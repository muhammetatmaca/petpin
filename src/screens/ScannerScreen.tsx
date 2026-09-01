import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  Dimensions,
  Vibration,
  ScrollView,
  Image,
  Linking,
  ActivityIndicator,
} from 'react-native';
import {
  X,
  Flashlight,
  FlashlightOff,
  QrCode,
  Smartphone,
  CheckCircle2,
  Phone,
  MessageCircle,
  MapPin,
  Heart,
  AlertTriangle,
  Stethoscope,
  ShieldCheck,
} from 'lucide-react-native';
import * as Location from 'expo-location';
import { COLORS, SHADOWS } from '../theme/colors';

const { width } = Dimensions.get('window');
const VIEWFINDER_SIZE = width * 0.72;

interface ScannerScreenProps {
  onClose: () => void;
  onScanSuccess?: () => void;
}

export const ScannerScreen: React.FC<ScannerScreenProps> = ({
  onClose,
  onScanSuccess,
}) => {
  const [torchOn, setTorchOn] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [finderModalVisible, setFinderModalVisible] = useState(false);
  const [gpsLocation, setGpsLocation] = useState<{
    latitude: number;
    longitude: number;
    address?: string;
  } | null>(null);

  // Animated laser line translation
  const scanLineAnim = useRef(new Animated.Value(0)).current;
  const hapticWaveAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Continuous laser sweep
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanLineAnim, {
          toValue: VIEWFINDER_SIZE - 8,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(scanLineAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Haptic pulse hint
    Animated.loop(
      Animated.sequence([
        Animated.timing(hapticWaveAnim, {
          toValue: 1.15,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(hapticWaveAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [scanLineAnim, hapticWaveAnim]);

  const handleSimulateTagScan = async () => {
    setIsScanning(true);
    try {
      Vibration.vibrate(120);
    } catch {
      // Fallback
    }

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        setGpsLocation({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          address: 'Moda Sahil Parkı, Kadıköy / İstanbul',
        });
      } else {
        setGpsLocation({
          latitude: 40.9876,
          longitude: 29.0345,
          address: 'Kadıköy / İstanbul (Varsayılan)',
        });
      }
    } catch {
      setGpsLocation({
        latitude: 40.9876,
        longitude: 29.0345,
        address: 'Kadıköy / İstanbul',
      });
    }

    setIsScanning(false);
    setFinderModalVisible(true);
  };

  const handleCallOwner = () => {
    Linking.openURL('tel:+905552345678');
  };

  const handleWhatsApp = () => {
    const lat = gpsLocation?.latitude ?? 40.9876;
    const lng = gpsLocation?.longitude ?? 29.0345;
    const message = `Merhaba, Milo'nun künyesini okuttum. Konumum: https://maps.google.com/?q=${lat},${lng}`;
    Linking.openURL(`https://wa.me/905552345678?text=${encodeURIComponent(message)}`);
  };

  return (
    <View style={styles.container}>
      {/* Translucent Camera Backdrop */}
      <View style={styles.cameraBackground}>
        <View style={styles.ambientBlurOverlay} />
      </View>

      {/* Top Floating Glass Controls */}
      <View style={styles.topControlRow}>
        <TouchableOpacity
          style={styles.circleGlassBtn}
          onPress={onClose}
          activeOpacity={0.8}
        >
          <X size={22} color="#FFFFFF" />
        </TouchableOpacity>

        <Text style={styles.headerTag}>PetPin QR Tarayıcı</Text>

        <TouchableOpacity
          style={[
            styles.circleGlassBtn,
            torchOn && { backgroundColor: 'rgba(0, 240, 255, 0.3)' },
          ]}
          onPress={() => setTorchOn(!torchOn)}
          activeOpacity={0.8}
        >
          {torchOn ? (
            <Flashlight size={22} color="#00F0FF" />
          ) : (
            <FlashlightOff size={22} color="#FFFFFF" />
          )}
        </TouchableOpacity>
      </View>

      {/* Center Viewfinder */}
      <View style={styles.viewfinderWrapper}>
        <View style={styles.viewfinderBox}>
          {/* Top-Left Corner */}
          <View style={[styles.cornerGuide, styles.cornerTL]} />
          {/* Top-Right Corner */}
          <View style={[styles.cornerGuide, styles.cornerTR]} />
          {/* Bottom-Left Corner */}
          <View style={[styles.cornerGuide, styles.cornerBL]} />
          {/* Bottom-Right Corner */}
          <View style={[styles.cornerGuide, styles.cornerBR]} />

          {/* Animated Laser Scanning Line */}
          <Animated.View
            style={[
              styles.laserLine,
              {
                transform: [{ translateY: scanLineAnim }],
              },
            ]}
          >
            <View style={styles.laserGlow} />
          </Animated.View>
        </View>

        {/* Alignment Guidance Pill */}
        <Animated.View
          style={[
            styles.instructionPill,
            { transform: [{ scale: hapticWaveAnim }] },
          ]}
        >
          <Smartphone size={16} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text style={styles.instructionText}>
            Künyedeki QR kodu çerçevenin içine hizalayın
          </Text>
        </Animated.View>
      </View>

      {/* Bottom Action Trigger */}
      <View style={styles.bottomSection}>
        <TouchableOpacity
          style={styles.scanCollarCta}
          activeOpacity={0.85}
          onPress={handleSimulateTagScan}
          disabled={isScanning}
        >
          {isScanning ? (
            <ActivityIndicator color="#070D12" size="small" />
          ) : (
            <>
              <QrCode size={20} color="#070D12" style={{ marginRight: 8 }} />
              <Text style={styles.scanCollarCtaText}>Künyeyi Tara & Test Et</Text>
            </>
          )}
        </TouchableOpacity>
        <Text style={styles.hintSubtext}>
          Okutan kişinin anlık konumu Milo'nun sahibine iletilir
        </Text>
      </View>

      {/* Finder Confirmation Modal Screen (Okutan Kişiye Gösterilen Bilgi Ekranı) */}
      {finderModalVisible && (
        <View style={styles.finderModalOverlay}>
          <View style={styles.finderModalCard}>
            <ScrollView
              contentContainerStyle={styles.finderModalContent}
              showsVerticalScrollIndicator={false}
            >
              {/* Success Icon & Reassurance Title */}
              <View style={styles.finderSuccessHeader}>
                <View style={styles.successIconBadge}>
                  <CheckCircle2 size={36} color={COLORS.emerald} />
                </View>
                <Text style={styles.finderSuccessTitle}>
                  Konumunuz Sahibine İletildi!
                </Text>
                <Text style={styles.finderSuccessDesc}>
                  Harika bir iyilik yaptınız! Milo'nun sahibine (`Sarah Jenkins`) şu anki GPS konumunuz ve tarama saati SMS & Bildirim olarak başarıyla gönderildi.
                </Text>
              </View>

              {/* Location Badge */}
              <View style={styles.finderLocationPill}>
                <MapPin size={16} color={COLORS.primary} />
                <Text style={styles.finderLocationText}>
                  {gpsLocation?.address ?? 'Moda Sahil Parkı, Kadıköy'}
                </Text>
              </View>

              {/* Pet Quick Card */}
              <View style={styles.finderPetCard}>
                <Image
                  source={{
                    uri: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=300&q=80',
                  }}
                  style={styles.finderPetAvatar}
                />
                <View style={styles.finderPetMeta}>
                  <Text style={styles.finderPetName}>Milo</Text>
                  <Text style={styles.finderPetBreed}>Golden Retriever</Text>
                  <View style={styles.emergencyNotePill}>
                    <Text style={styles.emergencyNoteText}>
                      ⚠️ Alerji: Tavuklu gıda vermeyiniz
                    </Text>
                  </View>
                </View>
              </View>

              {/* Direct Communication Buttons for Finder */}
              <View style={styles.finderActions}>
                <TouchableOpacity
                  style={styles.finderCallBtn}
                  activeOpacity={0.88}
                  onPress={handleCallOwner}
                >
                  <Phone size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
                  <Text style={styles.finderCallBtnText}>Sahibi Hemen Ara</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.finderWhatsAppBtn}
                  activeOpacity={0.88}
                  onPress={handleWhatsApp}
                >
                  <MessageCircle size={18} color={COLORS.emerald} style={{ marginRight: 8 }} />
                  <Text style={styles.finderWhatsAppBtnText}>WhatsApp ile Yaz</Text>
                </TouchableOpacity>
              </View>

              {/* Close Button */}
              <TouchableOpacity
                style={styles.finderCloseBtn}
                activeOpacity={0.8}
                onPress={() => {
                  setFinderModalVisible(false);
                  if (onScanSuccess) onScanSuccess();
                }}
              >
                <Text style={styles.finderCloseBtnText}>Kapat & Ana Ekrana Dön</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#070D12',
    justifyContent: 'space-between',
  },
  cameraBackground: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#0F1A20',
  },
  ambientBlurOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  topControlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 54,
    zIndex: 10,
  },
  headerTag: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  circleGlassBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  viewfinderWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewfinderBox: {
    width: VIEWFINDER_SIZE,
    height: VIEWFINDER_SIZE,
    borderRadius: 24,
    backgroundColor: 'rgba(15, 76, 92, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    position: 'relative',
    overflow: 'hidden',
  },
  cornerGuide: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderColor: '#00F0FF',
  },
  cornerTL: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 18,
  },
  cornerTR: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 18,
  },
  cornerBL: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 18,
  },
  cornerBR: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 18,
  },
  laserLine: {
    position: 'absolute',
    top: 0,
    left: 4,
    right: 4,
    height: 3,
    backgroundColor: '#00F0FF',
    borderRadius: 2,
    ...SHADOWS.glowTeal,
  },
  laserGlow: {
    height: 14,
    backgroundColor: 'rgba(0, 240, 255, 0.25)',
    marginTop: -5,
    borderRadius: 8,
  },
  instructionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
    marginTop: 28,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  instructionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  bottomSection: {
    paddingHorizontal: 24,
    paddingBottom: 48,
    alignItems: 'center',
  },
  scanCollarCta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00F0FF',
    width: '100%',
    paddingVertical: 16,
    borderRadius: 22,
    ...SHADOWS.glowTeal,
    marginBottom: 12,
  },
  scanCollarCtaText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#070D12',
    letterSpacing: 0.2,
  },
  hintSubtext: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
  },
  finderModalOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(7, 13, 18, 0.85)',
    justifyContent: 'flex-end',
    zIndex: 100,
  },
  finderModalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 24,
    paddingHorizontal: 20,
    paddingBottom: 36,
    maxHeight: '85%',
  },
  finderModalContent: {
    alignItems: 'center',
  },
  finderSuccessHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  successIconBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  finderSuccessTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  finderSuccessDesc: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 19,
    paddingHorizontal: 8,
  },
  finderLocationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 76, 92, 0.07)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    marginBottom: 16,
    gap: 6,
  },
  finderLocationText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  finderPetCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    padding: 14,
    width: '100%',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  finderPetAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 14,
  },
  finderPetMeta: {
    flex: 1,
  },
  finderPetName: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  finderPetBreed: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  emergencyNotePill: {
    backgroundColor: COLORS.coralLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  emergencyNoteText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.coral,
  },
  finderActions: {
    width: '100%',
    gap: 10,
    marginBottom: 14,
  },
  finderCallBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    borderRadius: 20,
    ...SHADOWS.glowTeal,
  },
  finderCallBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  finderWhatsAppBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ECFDF5',
    borderWidth: 1.5,
    borderColor: COLORS.emerald,
    paddingVertical: 15,
    borderRadius: 20,
  },
  finderWhatsAppBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.emerald,
  },
  finderCloseBtn: {
    paddingVertical: 10,
  },
  finderCloseBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
});
