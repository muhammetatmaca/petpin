import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Linking,
  Dimensions,
} from 'react-native';
import {
  ChevronLeft,
  Phone,
  Navigation,
  Clock,
  MapPin,
  Smartphone,
  CheckCircle2,
  Share2,
  Sparkles,
  ShieldCheck,
  Trash2,
  Info,
} from 'lucide-react-native';
import { InteractiveMap } from '../components/InteractiveMap';
import { COLORS, SHADOWS } from '../theme/colors';

interface ScanAlert {
  id: string;
  timestamp: string;
  timeAgo: string;
  latitude: number;
  longitude: number;
  address: string;
  device: string;
  accuracy: string;
}

interface AlertScreenProps {
  onBackPress: () => void;
  onNavigatePress?: () => void;
}

export const AlertScreen: React.FC<AlertScreenProps> = ({
  onBackPress,
  onNavigatePress,
}) => {
  // Starts clean with no fake alerts
  const [activeAlert, setActiveAlert] = useState<ScanAlert | null>(null);

  const handleClearAlert = () => {
    setActiveAlert(null);
  };

  const handleCallFinder = () => {
    Linking.openURL('tel:+905552345678');
  };

  const handleOpenDirections = () => {
    if (activeAlert) {
      Linking.openURL(
        `https://maps.google.com/?q=${activeAlert.latitude},${activeAlert.longitude}`
      );
    } else if (onNavigatePress) {
      onNavigatePress();
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBackPress}
          activeOpacity={0.8}
        >
          <ChevronLeft size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tarama Bildirimleri</Text>
        {activeAlert ? (
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleClearAlert}
            activeOpacity={0.8}
          >
            <Trash2 size={20} color={COLORS.coral} />
          </TouchableOpacity>
        ) : (
          <View style={styles.headerPlaceholder} />
        )}
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* CASE 1: NO ALERTS (Clean, Reassuring Empty State) */}
        {!activeAlert && (
          <View style={styles.emptyStateContainer}>
            <View style={styles.emptyIconCircle}>
              <ShieldCheck size={48} color={COLORS.emerald} />
              <View style={styles.emptyPulseRing} />
            </View>

            <Text style={styles.emptyTitle}>Henüz Tarama Bildirimi Yok</Text>
            <Text style={styles.emptySubtitle}>
              Milo güvende! Tasmasındaki QR künye birisi tarafından telefon kamerasıyla okutulduğunda anlık GPS konumu ve bildirim anında buraya düşecektir.
            </Text>

            <View style={styles.statusLivePill}>
              <View style={styles.statusLiveDot} />
              <Text style={styles.statusLiveText}>QR Künye Dinleniyor • 7/24 Aktif</Text>
            </View>

            {/* How notifications work card */}
            <View style={styles.howItWorksCard}>
              <View style={styles.howItWorksHeader}>
                <Info size={18} color={COLORS.primary} />
                <Text style={styles.howItWorksTitle}>Nasıl Çalışır?</Text>
              </View>
              <View style={styles.stepRow}>
                <Text style={styles.stepNumber}>1.</Text>
                <Text style={styles.stepText}>
                  Hayvanı bulan kişi telefon kamerasıyla tasmanın QR kodunu okutur.
                </Text>
              </View>
              <View style={styles.stepRow}>
                <Text style={styles.stepNumber}>2.</Text>
                <Text style={styles.stepText}>
                  Okutan kişinin izin verdiği anlık GPS konumu sahibine iletilir.
                </Text>
              </View>
              <View style={styles.stepRow}>
                <Text style={styles.stepNumber}>3.</Text>
                <Text style={styles.stepText}>
                  Telefonunuza anında bildirim ve SMS uyarısı düşer.
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* CASE 2: ACTIVE SCAN ALERT */}
        {activeAlert && (
          <View>
            {/* High-Contrast QR Scanned Alert Card */}
            <View style={styles.alertBannerCard}>
              <View style={styles.alertIconBadge}>
                <MapPin size={24} color={COLORS.emerald} />
              </View>
              <View style={styles.alertBannerTextWrapper}>
                <Text style={styles.alertTitle}>Künye Okutuldu! 📍</Text>
                <Text style={styles.alertDescription}>
                  Milo’nun tasmasındaki QR kod okutuldu ve okutan kişinin anlık GPS konumu size iletildi.
                </Text>
              </View>
            </View>

            {/* Metrics */}
            <View style={styles.metricsRow}>
              <View style={styles.metricCard}>
                <Clock size={16} color={COLORS.textSecondary} />
                <Text style={styles.metricLabel}>Tarama Zamanı</Text>
                <Text style={styles.metricValue}>
                  {activeAlert.timeAgo} ({activeAlert.timestamp})
                </Text>
              </View>
              <View style={styles.metricCard}>
                <Smartphone size={16} color={COLORS.primary} />
                <Text style={styles.metricLabel}>Tarayıcı Cihaz</Text>
                <Text style={[styles.metricValue, { color: COLORS.primary }]}>
                  {activeAlert.device}
                </Text>
              </View>
            </View>

            {/* Zero API Key Map Snippet Card */}
            <View style={styles.mapSnippetCard}>
              <View style={styles.mapSnippetHeaderRow}>
                <Text style={styles.mapSnippetHeader}>Okutulan GPS Noktası</Text>
                <View style={styles.gpsAccuracyPill}>
                  <Text style={styles.gpsAccuracyText}>
                    Hassasiyet: {activeAlert.accuracy}
                  </Text>
                </View>
              </View>

              {/* Zero API Key Map View Snippet */}
              <View style={styles.mapSnippetCanvas}>
                <InteractiveMap
                  latitude={activeAlert.latitude}
                  longitude={activeAlert.longitude}
                  zoom={16}
                  interactive={true}
                  lostMode={true}
                />
              </View>

              {/* Coordinate & Address Footer */}
              <View style={styles.coordFooter}>
                <Text style={styles.addressBold}>{activeAlert.address}</Text>
                <Text style={styles.coordText}>
                  GPS: {activeAlert.latitude.toFixed(4)}° K,{' '}
                  {activeAlert.longitude.toFixed(4)}° D
                </Text>
              </View>
            </View>

            {/* Passive QR Tag Education Box */}
            <View style={styles.passiveTagInfoBox}>
              <Sparkles size={16} color={COLORS.primary} style={{ marginRight: 8 }} />
              <Text style={styles.passiveTagInfoText}>
                Okutan kişiye konumunun size iletildiği bilgisi verildi ve iletişim butonlarınız gösterildi.
              </Text>
            </View>

            {/* Action Button Row */}
            <View style={styles.buttonActionGroup}>
              <TouchableOpacity
                style={styles.callOwnerButton}
                activeOpacity={0.85}
                onPress={handleCallFinder}
              >
                <Phone size={18} color={COLORS.primary} style={{ marginRight: 8 }} />
                <Text style={styles.callOwnerText}>Bulanı Ara</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.getDirectionsButton}
                activeOpacity={0.88}
                onPress={handleOpenDirections}
              >
                <Navigation
                  size={18}
                  color="#FFFFFF"
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.getDirectionsText}>Yol Tarifi Al</Text>
              </TouchableOpacity>
            </View>

            {/* Clear / Dismiss Action */}
            <TouchableOpacity
              style={styles.clearAlertBtn}
              activeOpacity={0.8}
              onPress={handleClearAlert}
            >
              <Text style={styles.clearAlertBtnText}>
                Bildirimi Temizle (Milo Güvende)
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.cardBg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.subtle,
  },
  headerPlaceholder: {
    width: 44,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 130,
  },
  emptyStateContainer: {
    alignItems: 'center',
    paddingTop: 20,
  },
  emptyIconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  emptyPulseRing: {
    position: 'absolute',
    width: 116,
    height: 116,
    borderRadius: 58,
    borderWidth: 1.5,
    borderColor: 'rgba(16, 185, 129, 0.25)',
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 12,
    marginBottom: 20,
  },
  statusLivePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.emeraldLight,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.emeraldBorder,
    marginBottom: 24,
  },
  statusLiveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.emerald,
    marginRight: 8,
  },
  statusLiveText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.emerald,
  },
  howItWorksCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 22,
    padding: 18,
    width: '100%',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    marginBottom: 24,
    ...SHADOWS.subtle,
  },
  howItWorksHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  howItWorksTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  stepNumber: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.primary,
    width: 20,
  },
  stepText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  alertBannerCard: {
    flexDirection: 'row',
    backgroundColor: '#ECFDF5',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1.5,
    borderColor: COLORS.emeraldBorder,
    alignItems: 'flex-start',
    marginBottom: 16,
    ...SHADOWS.subtle,
  },
  alertIconBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  alertBannerTextWrapper: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#065F46',
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  alertDescription: {
    fontSize: 13,
    color: '#047857',
    lineHeight: 19,
    fontWeight: '500',
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  metricCard: {
    flex: 1,
    backgroundColor: COLORS.cardBg,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.subtle,
  },
  metricLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
    marginTop: 6,
    marginBottom: 2,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  mapSnippetCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    marginBottom: 16,
    ...SHADOWS.card,
  },
  mapSnippetHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  mapSnippetHeader: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  gpsAccuracyPill: {
    backgroundColor: COLORS.emeraldLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  gpsAccuracyText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.emerald,
  },
  mapSnippetCanvas: {
    height: 180,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  coordFooter: {
    marginTop: 14,
  },
  addressBold: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  coordText: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  passiveTagInfoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 76, 92, 0.05)',
    padding: 14,
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(15, 76, 92, 0.1)',
  },
  passiveTagInfoText: {
    flex: 1,
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 17,
    fontWeight: '500',
  },
  buttonActionGroup: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  callOwnerButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    ...SHADOWS.subtle,
  },
  callOwnerText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.primary,
  },
  getDirectionsButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    ...SHADOWS.glowTeal,
  },
  getDirectionsText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  clearAlertBtn: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  clearAlertBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
});
