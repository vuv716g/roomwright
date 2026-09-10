interface Env { TURNSTILE_SITEKEY: string; }
const configured = (value: string) => value.trim().length > 0 && !value.toLowerCase().includes('replace_with');
export const onRequestGet = ({ env }: { env: Env }) => {
  const sitekey = env.TURNSTILE_SITEKEY?.trim() ?? '';
  if (!configured(sitekey)) return Response.json({ error: 'The message form is not configured.' }, { status: 503, headers: { 'Cache-Control': 'no-store' } });
  return Response.json({ sitekey }, { headers: { 'Cache-Control': 'no-store' } });
};
export const onRequest = () => new Response('Method Not Allowed', { status: 405, headers: { Allow: 'GET' } });