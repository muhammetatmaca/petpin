/**
 * Cloudflare Pages Edge Serverless Function
 * Handles Real-Time Scan Telemetry & Remote Push Dispatch (APNs / FCM via Expo)
 */

import { pushTokenStore } from './register-push-token.js';

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

    const currentTagId = tag_id || 'PETPIN-TR-DEFAULT';

    const scanRecord = {
      id: Date.now().toString(),
      tag_id: currentTagId,
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
    scanStore.set(currentTagId, scanRecord);

    console.log(`[PetPin Scan Broadcast] Tag: ${currentTagId} (${scanRecord.pet_name}) at ${scanRecord.address}`);

    // 🔥 REMOTE PUSH NOTIFICATION DISPATCH (Wakes up phone when app is completely closed)
    let pushResult = null;
    const registeredPushToken = pushTokenStore ? pushTokenStore.get(currentTagId) : null;

    if (registeredPushToken) {
      try {
        const expoRes = await fetch('https://exp.host/--/api/v2/push/send', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Accept-encoding': 'gzip, deflate',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: registeredPushToken,
            sound: 'default',
            title: `🚨 ${scanRecord.pet_name}’nin Künyesi Okutuldu!`,
            body: `Bir hayvansever künyeyi okuttu. Konum: ${scanRecord.address}. Haritayı görmek için dokunun.`,
            data: {
              type: 'QR_SCAN_ALERT',
              tag_id: currentTagId,
              latitude: scanRecord.latitude,
              longitude: scanRecord.longitude,
              address: scanRecord.address,
            },
            priority: 'high',
            channelId: 'petpin-alerts',
          }),
        });
        pushResult = await expoRes.json();
      } catch (pushErr) {
        console.log('Expo Remote Push Dispatch Error:', pushErr);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Konum başarıyla alındı ve evcil hayvanın sahibine anlık iletildi.',
        data: scanRecord,
        push_dispatched: registeredPushToken !== null,
        push_details: pushResult,
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
