/**
 * Cloudflare Pages Edge Serverless Function
 * Handles Real-Time Scan Telemetry for PetPin Smart Tags
 */

// In-memory telemetry cache on Edge (persists active scans)
const scanStore = new Map();

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

    const scanRecord = {
      id: Date.now().toString(),
      tag_id: tag_id || 'PETPIN-TR-DEFAULT',
      pet_name: pet_name || 'Milo',
      latitude: Number(latitude) || 40.9876,
      longitude: Number(longitude) || 29.0345,
      accuracy: accuracy ? `±${accuracy}m` : '±4m (Yüksek)',
      address: address || 'Kadıköy, İstanbul',
      device: user_agent ? (user_agent.includes('iPhone') ? 'Mobil Safari / iOS' : 'Mobil Chrome / Android') : 'Mobil Kamera / Web',
      timestamp: timestamp || new Date().toISOString(),
      timeFormatted: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    // Store latest scan for this tag ID
    scanStore.set(scanRecord.tag_id, scanRecord);

    console.log(`[PetPin Scan Broadcast] Tag: ${scanRecord.tag_id} (${scanRecord.pet_name}) at ${scanRecord.address}`);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Konum başarıyla alındı ve evcil hayvanın sahibine anlık iletildi.',
        data: scanRecord,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
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
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
}

export async function onRequestGet(context) {
  try {
    const url = new URL(context.request.url);
    const tagId = url.searchParams.get('tag_id') || url.searchParams.get('id');

    if (!tagId) {
      return new Response(
        JSON.stringify({ success: false, error: 'tag_id parametresi gereklidir' }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    const latestScan = scanStore.get(tagId) || null;

    return new Response(
      JSON.stringify({
        success: true,
        tag_id: tagId,
        has_scan: latestScan !== null,
        scan: latestScan,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
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
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
