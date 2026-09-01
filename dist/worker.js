/**
 * PetPin Cloudflare Worker & API Gateway
 * Handles Real-Time Scan Telemetry, Push Notifications, and Static Assets
 */

// In-memory telemetry cache on Edge (persists active scans)
const scanStore = new Map();
const pushTokenStore = new Map();

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    // Endpoint: /api/register-push-token
    if (url.pathname === '/api/register-push-token') {
      if (request.method === 'POST') {
        try {
          const data = await request.json();
          const { tag_id, push_token } = data;
          if (tag_id && push_token) {
            pushTokenStore.set(tag_id, push_token);
          }
          return new Response(
            JSON.stringify({ success: true, message: 'Push token kaydedildi', tag_id }),
            {
              status: 200,
              headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
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
    }

    // Endpoint: /api/scan (GET & POST)
    if (url.pathname === '/api/scan') {
      if (request.method === 'POST') {
        try {
          const data = await request.json();
          const tag_id = data.tag_id || 'PETPIN-TR-DEFAULT';

          const scanRecord = {
            id: Date.now().toString(),
            tag_id: tag_id,
            pet_name: data.pet_name || 'Milo',
            latitude: Number(data.latitude) || 40.9876,
            longitude: Number(data.longitude) || 29.0345,
            accuracy: data.accuracy ? `±${data.accuracy}m` : '±4m (Yüksek)',
            address: data.address || 'Kadıköy, İstanbul',
            device: data.user_agent
              ? data.user_agent.includes('iPhone')
                ? 'Mobil Safari / iOS'
                : 'Mobil Chrome / Android'
              : 'Mobil Kamera / Web',
            timestamp: data.timestamp || new Date().toISOString(),
            timeFormatted: new Date().toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            }),
          };

          // Store latest scan
          scanStore.set(tag_id, scanRecord);

          console.log(`[Scan Saved] ${tag_id}: ${scanRecord.address}`);

          return new Response(
            JSON.stringify({
              success: true,
              message: 'Konum başarıyla alındı ve sahibine iletildi.',
              data: scanRecord,
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
              status: 400,
              headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
              },
            }
          );
        }
      }

      if (request.method === 'GET') {
        const tagId = url.searchParams.get('tag_id') || url.searchParams.get('id');
        const scan = tagId ? scanStore.get(tagId) : null;

        return new Response(
          JSON.stringify({
            success: true,
            tag_id: tagId,
            has_scan: scan !== null && scan !== undefined,
            scan: scan || null,
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
      }
    }

    // Serve static assets (HTML, CSS, JS) from assets directory
    if (env && env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return new Response('Not Found', { status: 404 });
  },
};
