/**
 * Cloudflare Pages Root Serverless Function
 * Handles /api/scan for Real-Time Scan Telemetry & In-Memory / Global Cache
 */

const scanCache = new Map();

export async function onRequestPost(context) {
  try {
    const data = await context.request.json();
    const tagId = data.tag_id || 'PETPIN-TR-DEFAULT';

    const scanRecord = {
      id: Date.now().toString(),
      tag_id: tagId,
      pet_name: data.pet_name || 'Milo',
      latitude: Number(data.latitude) || 40.9876,
      longitude: Number(data.longitude) || 29.0345,
      accuracy: data.accuracy ? `±${data.accuracy}m` : '±4m (Yüksek)',
      address: data.address || 'Kadıköy, İstanbul',
      device: data.user_agent
        ? data.user_agent.includes('iPhone')
          ? 'Mobil Safari / iOS'
          : 'Mobil Chrome / Android'
        : 'Mobil Web / Kamera',
      timestamp: data.timestamp || new Date().toISOString(),
      timeFormatted: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    scanCache.set(tagId, scanRecord);
    scanCache.set('LATEST_GLOBAL', scanRecord);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Konum kaydedildi',
        data: scanRecord,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Cache-Control': 'no-cache, no-store',
        },
      }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
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

    let scan = null;
    if (tagId && scanCache.has(tagId)) {
      scan = scanCache.get(tagId);
    } else if (scanCache.has('LATEST_GLOBAL')) {
      scan = scanCache.get('LATEST_GLOBAL');
    }

    return new Response(
      JSON.stringify({
        success: true,
        tag_id: tagId,
        has_scan: scan !== null,
        scan: scan,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'no-cache, no-store',
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
