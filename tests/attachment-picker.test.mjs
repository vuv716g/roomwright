import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import ts from 'typescript';
const page = await readFile(new URL('../src/pages/index.astro', import.meta.url), 'utf8');
const shared = await readFile(new URL('../src/lib/attachments.ts', import.meta.url), 'utf8');
class Element {
  children = []; handlers = {}; files = []; value = ''; hidden = false;
  addEventListener(name, fn) { this.handlers[name] = fn; }
  setAttribute() {}
  append(...items) { this.children.push(...items); }
  replaceChildren() { this.children = []; }
}
test('separate file-picker selections accumulate, remove, validate and submit together', () => {
  const input = new Element(), status = new Element(), clear = new Element(), list = new Element();
  const context = vm.createContext({ attachmentInput: input, attachmentStatus: status, clearAttachments: clear,
    enquiryForm: { querySelector: () => list }, document: { createElement: () => new Element() }, FormData });
  const block = page.slice(page.indexOf('    const attachmentList ='), page.indexOf("    let turnstileSitekey ="));
  vm.runInContext(ts.transpileModule(shared.replaceAll('export ', '') + '\n' + block, { compilerOptions: { target: ts.ScriptTarget.ES2022 } }).outputText, context);
  const first = new File(['one'], 'first.png'), second = new File(['two'], 'second.png');
  const choose = (files) => { input.files = files; input.handlers.change(); };
  choose([first]); choose([second]);
  assert.equal(list.children.length, 2);
  const submission = page.slice(page.indexOf("      formData.delete('attachments');"), page.indexOf('      if (submitButton) submitButton.disabled = true;', page.indexOf("      formData.delete('attachments');")));
  context.formData = new FormData();
  vm.runInContext(submission, context);
  assert.deepEqual(context.formData.getAll('attachments').map(file => file.name), ['first.png', 'second.png']);
  choose([second]); assert.equal(list.children.length, 2, 'duplicate selection ignored');
  choose([]); assert.equal(list.children.length, 2, 'cancel preserves selection');
  choose([new File(['bad'], 'bad.exe')]); assert.equal(list.children.length, 2);
  assert.match(status.textContent, /previous attachments are still selected/);
  choose([new File(['3'], 'third.png'), new File(['4'], 'fourth.png')]); assert.equal(list.children.length, 2);
  list.children[0].children[1].handlers.click(); assert.equal(list.children.length, 1);
  assert.equal(list.children[0].children[0].textContent, 'second.png');
  clear.handlers.click(); assert.equal(list.children.length, 0); assert.equal(clear.hidden, true);
});
