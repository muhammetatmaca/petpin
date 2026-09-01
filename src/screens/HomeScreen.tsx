import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import * as Location from 'expo-location';
import {
  MapPin,
  QrCode,
  Compass,
  Layers,
  Bell,
  ShieldCheck,
  Navigation,
  Sparkles,
  Clock,
  Crosshair,
  AlertTriangle,
} from 'lucide-react-native';
import { InteractiveMap } from '../components/InteractiveMap';
import { usePet } from '../context/PetContext';
import { COLORS, SHADOWS } from '../theme/colors';

interface HomeScreenProps {
  onTagPress: () => void;
  onProfilePress: () => void;
  onAlertPress: () => void;
}

const { width } = Dimensions.get('window');

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onTagPress,
  onProfilePress,
  onAlertPress,
}) => {
  const { profile, activeScanAlert } = usePet();
  const [mapType, setMapType] = useState<'standard' | 'satellite'>('standard');
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [currentAddress, setCurrentAddress] = useState<string>('Konum alınıyor...');
  const [petLocation, setPetLocation] = useState({
    latitude: 40.9876,
    longitude: 29.0345,
  });

  // Sync petLocation to activeScanAlert if available
  useEffect(() => {
    if (activeScanAlert) {
      setPetLocation({
        latitude: activeScanAlert.latitude,
        longitude: activeScanAlert.longitude,
      });
      setCurrentAddress(activeScanAlert.address);
    }
  }, [activeScanAlert]);

  // Fetch real device GPS coordinates on mount
  useEffect(() => {
    let isMounted = true;

    async function initLiveLocation() {
      if (activeScanAlert) {
        setLoadingLocation(false);
        return;
      }

      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setCurrentAddress('Moda Sahil Parkı, Kadıköy (Varsayılan)');
          setLoadingLocation(false);
          return;
        }

        const position = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        if (!isMounted) return;

        const coords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };

        setPetLocation(coords);

        // Real reverse geocoding for human-readable street name
        try {
          const reverseResults = await Location.reverseGeocodeAsync(coords);
          if (reverseResults && reverseResults.length > 0) {
            const place = reverseResults[0];
            const street = place.street || place.name || place.district || 'Gezinti Bölgesi';
            const city = place.subregion || place.city || place.region || '';
            setCurrentAddress(`${street}, ${city}`.trim());
          } else {
            setCurrentAddress(`${coords.latitude.toFixed(4)}°, ${coords.longitude.toFixed(4)}°`);
          }
        } catch {
          setCurrentAddress(`${coords.latitude.toFixed(4)}°, ${coords.longitude.toFixed(4)}°`);
        }
      } catch (err) {
        console.log('Location error:', err);
        setCurrentAddress('Kadıköy Moda Sahili, İstanbul');
      } finally {
        if (isMounted) setLoadingLocation(false);
      }
    }

    initLiveLocation();

    return () => {
      isMounted = false;
    };
  }, [activeScanAlert]);

  const handleToggleMapType = () => {
    setMapType((prev) => (prev === 'standard' ? 'satellite' : 'standard'));
  };

  const handleCenterOnPet = () => {
    if (activeScanAlert) {
      setPetLocation({
        latitude: activeScanAlert.latitude,
        longitude: activeScanAlert.longitude,
      });
    } else {
      setPetLocation((prev) => ({ ...prev }));
    }
  };

  const isAlertState = activeScanAlert !== null || profile.isLostMode;

  return (
    <View style={styles.container}>
      {/* 100% Free OpenStreetMap & CartoDB Interactive Vector/Satellite Map - Zero API Key Needed */}
      <View style={styles.mapContainer}>
        <InteractiveMap
          latitude={petLocation.latitude}
          longitude={petLocation.longitude}
          zoom={16}
          mapType={mapType}
          lostMode={isAlertState}
          onMarkerPress={activeScanAlert ? onAlertPress : onProfilePress}
        />
      </View>

      {/* Top Floating Glass Header */}
      <View style={styles.topHeader}>
        <View style={styles.brandBadge}>
          <Text style={styles.brandTitle}>PetPin</Text>
          <View style={[styles.liveDotContainer, activeScanAlert && { backgroundColor: COLORS.coralLight }]}>
            <Sparkles size={12} color={activeScanAlert ? COLORS.coral : COLORS.emerald} style={{ marginRight: 4 }} />
            <Text style={[styles.liveText, activeScanAlert && { color: COLORS.coral }]}>
              {activeScanAlert ? 'TARAMA ALINDI' : 'CANLI HARİTA'}
            </Text>
          </View>
        </View>

        <View style={styles.headerActionRow}>
          <TouchableOpacity
            style={styles.glassIconButton}
            onPress={onAlertPress}
            activeOpacity={0.8}
          >
            <Bell size={20} color={activeScanAlert ? COLORS.coral : COLORS.primary} />
            {activeScanAlert && <View style={styles.notificationDot} />}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.glassIconButton}
            onPress={onProfilePress}
            activeOpacity={0.8}
          >
            <ShieldCheck size={20} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Floating Map Controls */}
      <View style={styles.mapToolGroup}>
        {/* Toggle Map Type (Standard / Satellite) */}
        <TouchableOpacity
          style={[
            styles.toolButton,
            mapType === 'satellite' && { backgroundColor: COLORS.primary },
          ]}
          onPress={handleToggleMapType}
          activeOpacity={0.8}
        >
          <Layers
            size={18}
            color={mapType === 'satellite' ? '#FFFFFF' : COLORS.primary}
          />
        </TouchableOpacity>

        {/* Center on Pet Location */}
        <TouchableOpacity
          style={styles.toolButton}
          onPress={handleCenterOnPet}
          activeOpacity={0.8}
        >
          <Crosshair size={18} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {/* Floating Glass Bottom Sheet for Pet & Tag Status */}
      <TouchableOpacity
        style={[styles.glassCardSheet, activeScanAlert && styles.alertCardSheet]}
        activeOpacity={0.95}
        onPress={activeScanAlert ? onAlertPress : onProfilePress}
      >
        <View style={styles.cardHeaderHandle} />

        {/* Main Pet Info Row */}
        <View style={styles.petCardContent}>
          {/* Avatar */}
          <View style={styles.avatarWrapper}>
            <Image
              source={{ uri: profile.petPhoto }}
              style={styles.petAvatar}
            />
            <View
              style={[
                styles.onlineBadge,
                isAlertState && { backgroundColor: COLORS.coral },
              ]}
            />
          </View>

          {/* Pet Info & Live Address */}
          <View style={styles.petMetaContainer}>
            <View style={styles.petNameRow}>
              <Text style={styles.petName}>{profile.petName}</Text>
              <View
                style={[
                  styles.safeStatusPill,
                  isAlertState && styles.lostStatusPill,
                ]}
              >
                <Text
                  style={[
                    styles.safeStatusText,
                    isAlertState && styles.lostStatusText,
                  ]}
                >
                  {activeScanAlert
                    ? '📍 Künye Okutuldu!'
                    : profile.isLostMode
                    ? 'Kayıp Modu Aktif'
                    : 'Güvende'}
                </Text>
              </View>
            </View>

            {/* Real Street Address */}
            <View style={styles.addressRow}>
              <MapPin size={12} color={activeScanAlert ? COLORS.coral : COLORS.textSecondary} style={{ marginRight: 4 }} />
              {loadingLocation ? (
                <ActivityIndicator size="small" color={COLORS.primary} />
              ) : (
                <Text style={[styles.addressText, activeScanAlert && { color: '#0F172A', fontWeight: '700' }]} numberOfLines={1}>
                  {currentAddress}
                </Text>
              )}
            </View>

            {/* Tag State Info */}
            <View style={styles.telemetryRow}>
              <View style={[styles.tagPill, activeScanAlert && { backgroundColor: COLORS.coralLight }]}>
                {activeScanAlert ? (
                  <>
                    <Clock size={12} color={COLORS.coral} />
                    <Text style={[styles.tagPillText, { color: COLORS.coral }]}>
                      Okutulma: {activeScanAlert.timeFormatted}
                    </Text>
                  </>
                ) : (
                  <>
                    <ShieldCheck size={12} color={COLORS.primary} />
                    <Text style={styles.tagPillText}>QR Künye Aktif • Dinleniyor</Text>
                  </>
                )}
              </View>
            </View>
          </View>
        </View>

        {/* Informative Tag Action Banner */}
        <TouchableOpacity
          style={[styles.infoBanner, activeScanAlert && { backgroundColor: COLORS.coralLight, borderColor: COLORS.coralBorder }]}
          activeOpacity={0.8}
          onPress={activeScanAlert ? onAlertPress : onTagPress}
        >
          <View style={styles.infoIconWrapper}>
            {activeScanAlert ? (
              <AlertTriangle size={16} color={COLORS.coral} />
            ) : (
              <QrCode size={16} color={COLORS.primary} />
            )}
          </View>
          <Text style={[styles.infoBannerText, activeScanAlert && { color: COLORS.coral, fontWeight: '700' }]}>
            {activeScanAlert
              ? 'Bulan kişinin konumunu ve detaylarını gör ➔'
              : 'Künyem: Milo’nun QR kodunu ve bulan kişinin ekranını yönet'}
          </Text>
          <Sparkles size={14} color={activeScanAlert ? COLORS.coral : COLORS.emerald} style={{ marginLeft: 4 }} />
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  mapContainer: {
    ...StyleSheet.absoluteFill,
  },
  topHeader: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  brandBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardGlass,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.borderGlass,
    ...SHADOWS.subtle,
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: -0.5,
    marginRight: 10,
  },
  liveDotContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.emeraldLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  liveText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.emerald,
    letterSpacing: 0.5,
  },
  headerActionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  glassIconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.cardGlass,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderGlass,
    ...SHADOWS.subtle,
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 10,
    right: 11,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.coral,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  mapToolGroup: {
    position: 'absolute',
    right: 20,
    top: 130,
    gap: 10,
    zIndex: 10,
  },
  toolButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.cardGlass,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderGlass,
    ...SHADOWS.subtle,
  },
  glassCardSheet: {
    position: 'absolute',
    bottom: 96,
    left: 18,
    right: 18,
    backgroundColor: COLORS.cardGlass,
    borderRadius: 28,
    padding: 16,
    paddingTop: 10,
    borderWidth: 1,
    borderColor: COLORS.borderGlass,
    ...SHADOWS.card,
    zIndex: 10,
  },
  alertCardSheet: {
    borderColor: COLORS.coralBorder,
    borderWidth: 1.5,
    backgroundColor: 'rgba(255, 255, 255, 0.96)',
  },
  cardHeaderHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CBD5E1',
    alignSelf: 'center',
    marginBottom: 10,
  },
  petCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarWrapper: {
    position: 'relative',
    marginRight: 14,
  },
  petAvatar: {
    width: 62,
    height: 62,
    borderRadius: 31,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: COLORS.emerald,
    borderWidth: 2.5,
    borderColor: '#FFFFFF',
  },
  petMetaContainer: {
    flex: 1,
  },
  petNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  petName: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
  },
  safeStatusPill: {
    backgroundColor: COLORS.emeraldLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.emeraldBorder,
  },
  safeStatusText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.emerald,
  },
  lostStatusPill: {
    backgroundColor: COLORS.coralLight,
    borderColor: COLORS.coralBorder,
  },
  lostStatusText: {
    color: COLORS.coral,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  addressText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
    flex: 1,
  },
  telemetryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 76, 92, 0.08)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 4,
  },
  tagPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 76, 92, 0.05)',
    padding: 10,
    borderRadius: 14,
    marginTop: 12,
    borderWidth: 1,
    borderColor: 'rgba(15, 76, 92, 0.1)',
  },
  infoIconWrapper: {
    marginRight: 8,
  },
  infoBannerText: {
    flex: 1,
    fontSize: 11,
    color: COLORS.textSecondary,
    lineHeight: 15,
    fontWeight: '500',
  },
});
