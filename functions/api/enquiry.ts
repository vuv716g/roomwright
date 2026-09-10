interface Env {
  RESEND_API_KEY: string;
  ENQUIRY_TO: string;
  EMAIL_FROM: string;
  TURNSTILE_SECRET: string;
  TURNSTILE_HOSTNAMES: string;
}

const MAX_FORM_BYTES = 20_000;
const MAX_TOKEN_LENGTH = 2_048;
const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
const TEST_SECRET = '1x0000000000000000000000000000000AA';
const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '0.0.0.0']);

const json = (body: Record<string, unknown>, status = 200) =>
  Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });

const envText = (value: string | undefined) => typeof value === 'string' ? value.trim() : '';
const configured = (value: string) => value.length > 0 && !value.toLowerCase().includes('replace_with');
const formText = (value: FormDataEntryValue | null, limit: number) => typeof value === 'string' ? value.trim().slice(0, limit) : '';
const escapeHtml = (value: string) => value.replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]!);

async function verifyTurnstile(request: Request, env: Env, token: string): Promise<boolean> {
  const secret = envText(env.TURNSTILE_SECRET);
  const expectedHostnames = new Set(envText(env.TURNSTILE_HOSTNAMES).split(',').map((hostname) => hostname.trim()).filter(Boolean));
  const isLocalTest = secret === TEST_SECRET && expectedHostnames.size > 0 && Array.from(expectedHostnames).every((hostname) => LOCAL_HOSTS.has(hostname));

  if (!configured(secret) || !token || token.length > MAX_TOKEN_LENGTH || expectedHostnames.size === 0) return false;
  if (secret === TEST_SECRET && !isLocalTest) return false;

  const body = new URLSearchParams({ secret, response: token });
  const ip = request.headers.get('CF-Connecting-IP') || request.headers.get('X-Forwarded-For')?.split(',')[0]?.trim();
  if (ip) body.set('remoteip', ip);

  try {
    const response = await fetch(TURNSTILE_VERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
      signal: AbortSignal.timeout(10_000)
    });
    const result = await response.json() as { success?: boolean; action?: string; hostname?: string };
    return response.ok && result.success === true &&
      (result.action === 'enquiry' || (isLocalTest && result.action === 'test')) &&
      typeof result.hostname === 'string' && expectedHostnames.has(result.hostname);
  } catch {
    return false;
  }
}

export const onRequestPost = async ({ request, env }: { request: Request; env: Env }): Promise<Response> => {
  const origin = request.headers.get('Origin');
  if (origin && origin !== new URL(request.url).origin) return json({ error: 'Invalid request origin.' }, 403);
  if (Number(request.headers.get('Content-Length') ?? 0) > MAX_FORM_BYTES) return json({ error: 'Your message is too long.' }, 413);

  let form: FormData;
  try { form = await request.formData(); } catch { return json({ error: 'We could not read that message.' }, 400); }
  if (formText(form.get('website'), 100)) return json({ ok: true });

  const token = formText(form.get('cf-turnstile-response'), MAX_TOKEN_LENGTH + 1);
  if (!await verifyTurnstile(request, env, token)) return json({ error: 'Please complete the verification check and try again.' }, 403);

  const name = formText(form.get('name'), 120);
  const email = formText(form.get('email'), 254);
  const telephone = formText(form.get('telephone'), 60);
  const postcode = formText(form.get('postcode'), 24);
  const message = formText(form.get('message'), 6_000);
  if (!name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ error: 'Please provide your name, a valid email address and a message.' }, 400);

  const fields = [['Name', name], ['Email', email], ['Telephone', telephone], ['Postcode', postcode]].filter(([, value]) => value);
  const text = fields.map(([label, value]) => label + ': ' + value).join('\n') + '\n\nMessage:\n' + message;
  const html = '<h2>New Roomwright message</h2><p>' + fields.map(([label, value]) => '<strong>' + escapeHtml(label) + ':</strong> ' + escapeHtml(value)).join('<br>') + '</p><h3>Message</h3><p>' + escapeHtml(message).replace(/\n/g, '<br>') + '</p>';

  const apiKey = envText(env.RESEND_API_KEY);
  const to = envText(env.ENQUIRY_TO);
  const from = envText(env.EMAIL_FROM);
  if (!configured(apiKey) || !configured(to) || !configured(from)) return json({ error: 'The message form is not configured.' }, 503);

  try {
    const sent = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + apiKey, 'Content-Type': 'application/json', 'Idempotency-Key': 'roomwright-enquiry-' + crypto.randomUUID() },
      body: JSON.stringify({ from, to: [to], reply_to: email, subject: 'Website message: Roomwright', text, html })
    });
    if (!sent.ok) return json({ error: 'We could not send your message right now. Please try again later.' }, 502);
  } catch {
    return json({ error: 'We could not send your message right now. Please try again later.' }, 502);
  }
  return json({ ok: true });
};

export const onRequest = () => new Response('Method Not Allowed', { status: 405, headers: { Allow: 'POST' } });