/**
 * Cloudflare Pages Edge Serverless Function
 * Handles POST /api/register-push-token to register device push token for closed-app notifications
 */

// Global token registry on Cloudflare Edge
export const pushTokenStore = new Map();

export async function onRequestPost(context) {
  try {
    const request = context.request;
    const data = await request.json();

    const { tag_id, push_token, platform } = data;

    if (!tag_id || !push_token) {
      return new Response(
        JSON.stringify({ success: false, error: 'tag_id and push_token are required' }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    pushTokenStore.set(tag_id, push_token);

    console.log(`[Push Token Registered] Tag: ${tag_id} -> Token: ${push_token.substring(0, 20)}... (${platform || 'unknown'})`);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Push token başarıyla kaydedildi. Uygulama kapalıyken de bildirim iletilecektir.',
        tag_id,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
        },
      }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
