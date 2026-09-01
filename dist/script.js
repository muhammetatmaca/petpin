// ==========================================================================
// PetPin • Emil Kowalski Tactile Interaction & Geolocation Engine
// ==========================================================================

// Parse URL Parameters (allows dynamic rendering per pet)
const urlParams = new URLSearchParams(window.location.search);
const petTagId = urlParams.get('id') || 'PETPIN-QR-9821-TR';
const petNameParam = urlParams.get('name') || 'Milo';
const petMetaParam = urlParams.get('meta') || 'Golden Retriever • 3 Yaşında';
const ownerNameParam = urlParams.get('owner') || 'Sarah Jenkins';
const ownerPhoneParam = urlParams.get('phone') || '+90 555 234 56 78';
const ownerWhatsAppParam = urlParams.get('wa') || '+90 555 234 56 78';
const medicalParam = urlParams.get('med') || 'Tavuk ve buğday alerjisi vardır. Lütfen sadece temiz içme suyu veriniz.';
const vetParam = urlParams.get('vet') || 'Dr. Aris • Kadıköy Hayvan Kliniği';
const photoParam = urlParams.get('photo');

// Hydrate DOM Elements
document.getElementById('tagIdText').textContent = petTagId;
document.getElementById('petName').textContent = petNameParam;
document.getElementById('petMeta').textContent = petMetaParam;
document.getElementById('ownerName').textContent = 'Sahibi: ' + ownerNameParam;
document.getElementById('ownerPhoneLabel').textContent = ownerPhoneParam;
document.getElementById('medicalText').textContent = medicalParam;
document.getElementById('vetSummaryText').textContent = vetParam;
document.getElementById('vetDetailsText').textContent = vetParam + ' (7/24 Acil İletişim)';

if (photoParam) {
  document.getElementById('petAvatar').src = photoParam;
}

// Call & WhatsApp Hrefs
const cleanPhone = ownerPhoneParam.replace(/[^0-9+]/g, '');
document.getElementById('callBtn').href = 'tel:' + cleanPhone;

const cleanWa = ownerWhatsAppParam.replace(/[^0-9]/g, '');
document.getElementById('whatsappBtn').href = `https://wa.me/${cleanWa}?text=${encodeURIComponent(
  `Merhaba, ${petNameParam} adlı evcil hayvanınızı buldum ve konumumu paylaştım.`
)}`;

// Sonner Floating Toast Function
function showSonnerToast(title, desc) {
  const toast = document.getElementById('sonnerToast');
  const toastTitle = document.getElementById('toastTitle');
  const toastDesc = document.getElementById('toastDesc');

  toastTitle.textContent = title;
  toastDesc.textContent = desc;

  toast.classList.add('show');

  // Vibrate device if supported for tactile Emil Kowalski feel
  if (navigator.vibrate) {
    navigator.vibrate([40, 60, 40]);
  }

  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}

// Accordion Logic
const vetAccordion = document.getElementById('vetAccordion');
const vetAccordionHeader = document.getElementById('vetAccordionHeader');

if (vetAccordionHeader) {
  vetAccordionHeader.addEventListener('click', () => {
    vetAccordion.classList.toggle('open');
  });
}

// Leaflet Mini Map Variable
let leafletMap = null;
let leafletMarker = null;

function renderMiniMap(lat, lng) {
  const mapContainer = document.getElementById('miniMapContainer');
  mapContainer.style.display = 'block';

  if (!leafletMap) {
    leafletMap = L.map('miniMap', {
      center: [lat, lng],
      zoom: 16,
      zoomControl: false,
      attributionControl: false,
      dragging: true,
      touchZoom: true,
      scrollWheelZoom: false,
    });

    // Crisp Google Raster Street Tiles (100% Free, Zero API Key, Zero Watermarks)
    L.tileLayer('https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      subdomains: ['0', '1', '2', '3'],
    }).addTo(leafletMap);

    // Custom Pulse Marker Pin
    const pinHtml = `
      <div style="position:relative;display:flex;align-items:center;justify-content:center;">
        <div style="position:absolute;width:44px;height:44px;border-radius:22px;background:rgba(16,185,129,0.35);animation:pulseScale 2s infinite;"></div>
        <div style="width:28px;height:28px;border-radius:14px;background:#0F4C5C;border:2.5px solid #FFFFFF;box-shadow:0 4px 12px rgba(15,76,92,0.4);display:flex;align-items:center;justify-content:center;">
          <div style="width:10px;height:10px;border-radius:5px;background:#10B981;"></div>
        </div>
      </div>
    `;

    const customIcon = L.divIcon({
      className: 'leaflet-custom-marker',
      html: pinHtml,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });

    leafletMarker = L.marker([lat, lng], { icon: customIcon }).addTo(leafletMap);
  } else {
    leafletMap.setView([lat, lng], 16);
    leafletMarker.setLatLng([lat, lng]);
  }
}

// GPS Telemetry Engine
const telemetryCard = document.getElementById('telemetryCard');
const telemetryTitle = document.getElementById('telemetryTitle');
const telemetryDesc = document.getElementById('telemetryDesc');
const telemetryIconBox = document.getElementById('telemetryIconBox');
const geoAddressText = document.getElementById('geoAddressText');
const mapAccuracyText = document.getElementById('mapAccuracyText');
const reSyncBtn = document.getElementById('reSyncBtn');

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
    console.log('Telemetry dispatch log:', e);
  }
}

function requestGPSLocation() {
  telemetryCard.className = 'telemetry-card';
  telemetryIconBox.innerHTML = '<div class="telemetry-spinner"></div>';
  telemetryTitle.textContent = 'GPS Konumunuz Alınıyor...';
  telemetryDesc.textContent = `${petNameParam}'nun sahibine tam nerede olduğunu iletmek için konum tespit ediliyor.`;

  if (!navigator.geolocation) {
    telemetryCard.className = 'telemetry-card denied';
    telemetryIconBox.innerHTML = '⚠️';
    telemetryTitle.textContent = 'GPS Desteklenmiyor';
    telemetryDesc.textContent = 'Tarayıcınız konum servisini desteklemiyor. Lütfen sahibini doğrudan telefonla arayınız.';
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      const accuracy = Math.round(position.coords.accuracy || 4);

      let readableAddress = `${lat.toFixed(4)}° K, ${lng.toFixed(4)}° D`;

      // Free reverse geocoding via OpenStreetMap Nominatim
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
        const data = await res.json();
        if (data && data.display_name) {
          const parts = data.display_name.split(',');
          readableAddress = parts.slice(0, 3).join(',').trim();
        }
      } catch (e) {
        console.log('Reverse geocoding error:', e);
      }

      // Send to Cloudflare Edge API
      await sendScanLocation(lat, lng, accuracy, readableAddress);

      // Render crisp interactive mini map
      renderMiniMap(lat, lng);

      // Update UI to success state
      telemetryCard.className = 'telemetry-card';
      telemetryIconBox.innerHTML = `
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      `;
      telemetryTitle.textContent = 'Konumunuz Sahibine İletildi! 📍';
      telemetryDesc.textContent = `${petNameParam}'nun sahibine anlık bildirim ve harita koordinatınız gönderildi.`;
      geoAddressText.textContent = readableAddress;
      mapAccuracyText.textContent = `Hassasiyet: ±${accuracy}m`;

      // Pop Emil Kowalski style Sonner Toast
      showSonnerToast('Konum İletildi! 🐾', `Yaklaşık Adres: ${readableAddress}`);
    },
    (error) => {
      console.warn('Geolocation denied:', error);
      telemetryCard.className = 'telemetry-card denied';
      telemetryIconBox.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF6B6B" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      `;
      telemetryTitle.textContent = 'Konum İzni Bekleniyor';
      telemetryDesc.textContent = 'Sahibine konum iletebilmemiz için lütfen tarayıcının sorduğu "Konuma İzin Ver" seçeneğini onaylayınız.';
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    }
  );
}

// Auto-trigger on DOM load
window.addEventListener('DOMContentLoaded', () => {
  requestGPSLocation();
});

// Re-sync button handler
if (reSyncBtn) {
  reSyncBtn.addEventListener('click', () => {
    requestGPSLocation();
  });
}
