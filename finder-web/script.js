// Parse URL Parameters to make the page dynamic for any pet
const urlParams = new URLSearchParams(window.location.search);
const petTagId = urlParams.get('id') || 'PETPIN-QR-9821-TR';
const petNameParam = urlParams.get('name') || 'Milo';
const petMetaParam = urlParams.get('meta') || 'Golden Retriever • 3 Yaşında';
const ownerNameParam = urlParams.get('owner') || 'Sarah Jenkins';
const ownerPhoneParam = urlParams.get('phone') || '+905552345678';
const ownerWhatsAppParam = urlParams.get('wa') || '905552345678';
const medicalParam = urlParams.get('med') || 'Tavuk ve buğday alerjisi vardır. Lütfen sadece temiz su veriniz.';
const photoParam = urlParams.get('photo');

// Apply to DOM
document.getElementById('tagIdBadge').textContent = 'ID: ' + petTagId;
document.getElementById('petName').textContent = petNameParam;
document.getElementById('petMeta').textContent = petMetaParam;
document.getElementById('ownerName').textContent = 'Sahibi: ' + ownerNameParam;
document.getElementById('medicalText').textContent = medicalParam;

if (photoParam) {
  document.getElementById('petAvatar').src = photoParam;
}

// Call & WhatsApp links
const cleanPhone = ownerPhoneParam.replace(/\s+/g, '');
document.getElementById('callBtn').href = 'tel:' + cleanPhone;

const cleanWa = ownerWhatsAppParam.replace(/[^0-9]/g, '');
document.getElementById('whatsappBtn').href = `https://wa.me/${cleanWa}?text=${encodeURIComponent(
  `Merhaba, ${petNameParam} adlı evcil hayvanınızı buldum ve konumumu paylaştım.`
)}`;

// GPS Geolocation Handler
const statusBanner = document.getElementById('statusBanner');
const statusTitle = document.getElementById('statusTitle');
const statusDesc = document.getElementById('statusDesc');
const statusIcon = document.getElementById('statusIcon');
const refreshLocationBtn = document.getElementById('refreshLocationBtn');

async function sendScanLocation(lat, lng, accuracy, address) {
  try {
    await fetch('/api/scan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tag_id: petTagId,
        pet_name: petNameParam,
        latitude: lat,
        longitude: lng,
        accuracy: accuracy,
        address: address,
        timestamp: new Date().toISOString(),
        user_agent: navigator.userAgent,
      }),
    });
  } catch (e) {
    console.log('API report error (expected on local preview):', e);
  }
}

function requestGPSLocation() {
  statusBanner.className = 'status-banner';
  statusIcon.innerHTML = '<div class="spinner"></div>';
  statusTitle.textContent = 'Konumunuz Alınıyor...';
  statusDesc.textContent = `${petNameParam}'nun sahibine nerede olduğunu iletmek için GPS konumunuz tespit ediliyor.`;

  if (!navigator.geolocation) {
    statusBanner.className = 'status-banner error';
    statusIcon.innerHTML = '⚠️';
    statusTitle.textContent = 'GPS Desteklenmiyor';
    statusDesc.textContent = 'Tarayıcınız konum servisini desteklemiyor. Lütfen sahibini telefonla arayınız.';
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      const accuracy = Math.round(position.coords.accuracy || 10);

      let readableAddress = `${lat.toFixed(4)}°, ${lng.toFixed(4)}°`;

      // Free reverse geocoding via OpenStreetMap Nominatim
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
        const data = await res.json();
        if (data && data.display_name) {
          const parts = data.display_name.split(',');
          readableAddress = parts.slice(0, 3).join(',').trim();
        }
      } catch (e) {
        console.log('Reverse geocode error:', e);
      }

      // Send to Cloudflare Edge API
      await sendScanLocation(lat, lng, accuracy, readableAddress);

      // Update UI to success checkmark
      statusBanner.className = 'status-banner';
      statusIcon.innerHTML = `
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      `;
      statusTitle.textContent = 'Konumunuz Sahibine İletildi! 📍';
      statusDesc.textContent = `Yaklaşık Konum: ${readableAddress} (Hassasiyet: ±${accuracy}m). Sahibine anlık bildirim gönderildi.`;
    },
    (error) => {
      console.warn('Geolocation error:', error);
      statusBanner.className = 'status-banner error';
      statusIcon.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF6B6B" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      `;
      statusTitle.textContent = 'Konum İzni Bekleniyor';
      statusDesc.textContent = 'Konumunuzu iletebilmemiz için lütfen tarayıcının sorduğu "Konuma İzin Ver" seçeneğine onay veriniz.';
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    }
  );
}

// Automatically trigger on page load
window.addEventListener('DOMContentLoaded', () => {
  requestGPSLocation();
});

// Manual refresh button
if (refreshLocationBtn) {
  refreshLocationBtn.addEventListener('click', () => {
    requestGPSLocation();
  });
}
