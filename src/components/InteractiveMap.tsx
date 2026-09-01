import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { COLORS } from '../theme/colors';

interface InteractiveMapProps {
  latitude: number;
  longitude: number;
  zoom?: number;
  mapType?: 'standard' | 'satellite';
  lostMode?: boolean;
  onMarkerPress?: () => void;
  interactive?: boolean;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  latitude,
  longitude,
  zoom = 15,
  mapType = 'standard',
  lostMode = false,
  onMarkerPress,
  interactive = true,
}) => {
  const webViewRef = useRef<any>(null);

  // Send updates to Leaflet map when props change
  useEffect(() => {
    if (webViewRef.current) {
      const script = `
        if (window.updateMapState) {
          window.updateMapState(${latitude}, ${longitude}, '${mapType}', ${lostMode});
        }
        true;
      `;
      webViewRef.current.injectJavaScript(script);
    }
  }, [latitude, longitude, mapType, lostMode]);

  const leafletHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>
    html, body, #map {
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
      background-color: #F8FAFC;
    }
    .leaflet-control-attribution {
      display: none !important;
    }
    .custom-pet-pin {
      background: transparent;
      border: none;
    }
    .pin-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: relative;
    }
    .pulse-ring {
      position: absolute;
      width: 70px;
      height: 70px;
      border-radius: 50%;
      background-color: ${lostMode ? 'rgba(255, 107, 107, 0.4)' : 'rgba(0, 196, 159, 0.35)'};
      animation: pulse 2s infinite ease-out;
      z-index: 1;
    }
    @keyframes pulse {
      0% { transform: scale(0.6); opacity: 0.8; }
      100% { transform: scale(1.8); opacity: 0; }
    }
    .pin-bubble {
      width: 46px;
      height: 46px;
      border-radius: 23px;
      background-color: ${lostMode ? '#FF6B6B' : '#0F4C5C'};
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2.5px solid #FFFFFF;
      box-shadow: 0 4px 14px rgba(15, 76, 92, 0.35);
      position: relative;
      z-index: 2;
    }
    .pin-avatar {
      width: 36px;
      height: 36px;
      border-radius: 18px;
      object-fit: cover;
    }
    .pin-pointer {
      width: 0;
      height: 0;
      border-left: 6px solid transparent;
      border-right: 6px solid transparent;
      border-top: 8px solid ${lostMode ? '#FF6B6B' : '#0F4C5C'};
      margin-top: -2px;
      z-index: 2;
    }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    var lat = ${latitude};
    var lng = ${longitude};
    var isLost = ${lostMode};
    var currentMapType = '${mapType}';

    // Direct Google Maps & Satellite Tile Layers (100% Free, NO API Key needed, Zero Watermarks)
    var standardLayer = L.tileLayer('https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      subdomains: ['0', '1', '2', '3']
    });

    var satelliteLayer = L.tileLayer('https://mt{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      subdomains: ['0', '1', '2', '3']
    });

    var map = L.map('map', {
      center: [lat, lng],
      zoom: ${zoom},
      zoomControl: false,
      attributionControl: false,
      dragging: ${interactive},
      touchZoom: ${interactive},
      doubleClickZoom: ${interactive},
      scrollWheelZoom: ${interactive}
    });

    var activeLayer = currentMapType === 'satellite' ? satelliteLayer : standardLayer;
    activeLayer.addTo(map);

    // Circle for Geofence/Scan area
    var circle = L.circle([lat, lng], {
      color: isLost ? '#FF6B6B' : '#0F4C5C',
      fillColor: isLost ? '#FF6B6B' : '#0F4C5C',
      fillOpacity: isLost ? 0.18 : 0.10,
      radius: 280,
      weight: 1.5,
      dashArray: '5, 5'
    }).addTo(map);

    // Custom Marker HTML
    function getPinHtml(lost) {
      var color = lost ? '#FF6B6B' : '#0F4C5C';
      var pulseColor = lost ? 'rgba(255, 107, 107, 0.4)' : 'rgba(0, 196, 159, 0.35)';
      return '<div class="pin-container">' +
        '<div class="pulse-ring" style="background-color: ' + pulseColor + '"></div>' +
        '<div class="pin-bubble" style="background-color: ' + color + '">' +
          '<img class="pin-avatar" src="https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=150&q=80" />' +
        '</div>' +
        '<div class="pin-pointer" style="border-top-color: ' + color + '"></div>' +
      '</div>';
    }

    var petIcon = L.divIcon({
      className: 'custom-pet-pin',
      html: getPinHtml(isLost),
      iconSize: [46, 56],
      iconAnchor: [23, 56]
    });

    var marker = L.marker([lat, lng], { icon: petIcon }).addTo(map);

    marker.on('click', function() {
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'MARKER_CLICK' }));
      }
    });

    window.updateMapState = function(newLat, newLng, newMapType, newLostMode) {
      lat = newLat;
      lng = newLng;
      isLost = newLostMode;

      marker.setLatLng([newLat, newLng]);
      circle.setLatLng([newLat, newLng]);
      circle.setStyle({
        color: isLost ? '#FF6B6B' : '#0F4C5C',
        fillColor: isLost ? '#FF6B6B' : '#0F4C5C',
        fillOpacity: isLost ? 0.18 : 0.10
      });

      marker.setIcon(L.divIcon({
        className: 'custom-pet-pin',
        html: getPinHtml(isLost),
        iconSize: [46, 56],
        iconAnchor: [23, 56]
      }));

      if (newMapType !== currentMapType) {
        currentMapType = newMapType;
        if (currentMapType === 'satellite') {
          map.removeLayer(standardLayer);
          satelliteLayer.addTo(map);
        } else {
          map.removeLayer(satelliteLayer);
          standardLayer.addTo(map);
        }
      }

      map.panTo([newLat, newLng], { animate: true, duration: 0.8 });
    };

    window.centerOnPet = function() {
      map.flyTo([lat, lng], 16, { animate: true, duration: 1 });
    };
  </script>
</body>
</html>
  `;

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        originWhitelist={['*']}
        source={{ html: leafletHtml }}
        style={styles.webView}
        scrollEnabled={interactive}
        bounces={false}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        onMessage={(event: any) => {
          try {
            const data = JSON.parse(event.nativeEvent.data);
            if (data.type === 'MARKER_CLICK' && onMarkerPress) {
              onMarkerPress();
            }
          } catch (e) {
            // ignore
          }
        }}
        renderLoading={() => (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  webView: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  loadingContainer: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
  },
});
