import { test } from 'node:test';
import assert from 'node:assert/strict';
import ts from 'typescript';
import { readFile } from 'node:fs/promises';

// Load the TypeScript handler without requiring a Cloudflare account or sending email.
const encodeModule = (source) => 'data:text/javascript;base64,' + Buffer.from(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText).toString('base64');
const shared = encodeModule(await readFile(new URL('../src/lib/attachments.ts', import.meta.url), 'utf8'));
const source = (await readFile(new URL('../functions/api/enquiry.ts', import.meta.url), 'utf8')).replace('../../src/lib/attachments', shared);
const { onRequestPost } = await import(encodeModule(source));
const env = { RESEND_API_KEY: 'test-key', ENQUIRY_TO: 'steven@gluckli.com', EMAIL_FROM: 'test@example.com', TURNSTILE_SECRET: 'test-secret', TURNSTILE_HOSTNAMES: 'roomwright.co.uk' };
const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a/e0AAAAASUVORK5CYII=', 'base64');
const photo = () => new File([png], 'room.png', { type: 'image/png' });
const form = (files = []) => {
  const data = new FormData();
  for (const [key, value] of Object.entries({ name: 'Customer', email: 'customer@example.com', message: 'Room plans', 'cf-turnstile-response': 'test-token' })) data.set(key, value);
  for (const file of files) data.append('attachments', file);
  return data;
};

test('enquiry attachments and rejection paths', async (t) => {
  const originalFetch = globalThis.fetch;
  let sent;
  let verified = true;
  let mailStatus = 200;
  globalThis.fetch = async (url, options) => {
    if (String(url).includes('siteverify')) return Response.json({ success: verified, hostname: 'roomwright.co.uk', action: 'enquiry' });
    assert.equal(url, 'https://api.resend.com/emails');
    sent = JSON.parse(options.body);
    return Response.json({}, { status: mailStatus });
  };
  t.after(() => { globalThis.fetch = originalFetch; });
  const submit = async (data, headers = {}) => {
    sent = undefined;
    return onRequestPost({ request: new Request('https://roomwright.co.uk/api/enquiry', { method: 'POST', body: data, headers }), env });
  };
  await t.test('sends exact file bytes to the configured Steven inbox', async () => {
    assert.equal((await submit(form([photo()]))).status, 200);
    assert.deepEqual(sent.to, ['steven@gluckli.com']);
    assert.equal(sent.reply_to, 'customer@example.com');
    assert.equal(sent.attachments[0].filename, 'room.png');
    assert.deepEqual(Buffer.from(sent.attachments[0].content, 'base64'), png);
  });
  await t.test('selected service is included in the email', async () => {
    const data = form();
    data.set('service', 'Furniture assembly');
    assert.equal((await submit(data)).status, 200);
    assert.match(sent.text, /Service: Furniture assembly/);
    assert.match(sent.html, /Furniture assembly/);
  });
  await t.test('messages without attachments still send', async () => {
    assert.equal((await submit(form())).status, 200);
    assert.equal(sent.attachments, undefined);
  });
  await t.test('multiple supported files send together', async () => {
    assert.equal((await submit(form([photo(), new File(['%PDF-1.7\nplan'], 'plan.pdf')]))).status, 200);
    assert.equal(sent.attachments.length, 2);
  });
  for (const [name, files] of [
    ['too many files', [photo(), photo(), photo(), photo()]],
    ['unsupported type', [new File(['test'], 'program.exe')]],
    ['disguised file', [new File(['not a photo'], 'room.png')]],
    ['empty file', [new File([], 'room.png')]],
    ['oversized file', [new File([new Uint8Array(5 * 1024 * 1024 + 1)], 'room.png')]],
    ['total size exceeded', Array.from({ length: 3 }, () => new File([new Uint8Array(4 * 1024 * 1024)], 'room.png'))],
  ]) await t.test('rejects ' + name, async () => {
    assert.ok([400, 413].includes((await submit(form(files))).status));
    assert.equal(sent, undefined);
  });
  await t.test('ignores the browser empty file placeholder', async () => {
    assert.equal((await submit(form([new File([], '')]))).status, 200);
    assert.equal(sent.attachments, undefined);
  });
  await t.test('verification failure sends no mail', async () => {
    verified = false;
    assert.equal((await submit(form([photo()]))).status, 403);
    assert.equal(sent, undefined);
    verified = true;
  });
  await t.test('mail provider failure is reported', async () => {
    mailStatus = 500;
    assert.equal((await submit(form([photo()]))).status, 502);
    mailStatus = 200;
  });
  await t.test('cross-origin requests are rejected', async () => {
    assert.equal((await submit(form(), { Origin: 'https://other.example' })).status, 403);
    assert.equal(sent, undefined);
  });
});
