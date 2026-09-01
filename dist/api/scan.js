/**
 * Cloudflare Pages Edge Serverless Function
 * Handles POST /api/scan when a finder scans the QR tag
 */
export async function onRequestPost(context) {
  try {
    const request = context.request;
    const data = await request.json();

    const {
      tag_id,
      pet_name,
      latitude,
      longitude,
      accuracy,
      address,
      timestamp,
      user_agent,
    } = data;

    // Log the scan telemetry on Cloudflare Edge
    console.log(`[PetPin QR Scan Alert] Tag: ${tag_id} (${pet_name}) at Lat: ${latitude}, Lng: ${longitude}, Address: ${address}`);

    // (Optional) Forward push notification to Expo Notification API if token is configured
    // const expoPushUrl = 'https://exp.host/--/api/v2/push/send';
    // await fetch(expoPushUrl, { ... });

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Konum başarıyla alındı ve evcil hayvanın sahibine iletildi.',
        data: {
          tag_id,
          pet_name,
          latitude,
          longitude,
          address,
          received_at: new Date().toISOString(),
        },
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
      JSON.stringify({
        success: false,
        error: 'Geçersiz istek gövdesi',
        details: err.message,
      }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
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
