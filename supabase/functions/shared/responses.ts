import { corsHeaders } from './cors.ts';

export const success = (body: any) =>
  new Response(JSON.stringify({ success: true, data: body }), {
    status: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

export const fail = (msg: string, status = 400) =>
  new Response(JSON.stringify({ success: false, message: msg }), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

export const handleCORS = () => {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
};
