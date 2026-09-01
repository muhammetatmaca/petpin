import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Vibration,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ShieldCheck,
  Zap,
  MapPin,
  PhoneCall,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Check,
  QrCode,
  Radio,
  Clock,
  HeartHandshake,
  Navigation,
  MessageCircle,
  Stethoscope,
  BatteryCharging,
} from 'lucide-react-native';
import { CosmicBackground } from '../components/CosmicBackground';
import { SHADOWS } from '../theme/colors';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface OnboardingSlideData {
  id: string;
  step: string;
  badge: string;
  badgeColor: string;
  title: string;
  subtitle: string;
  type: 'tag_preview' | 'battery_comparison' | 'radar_gps' | 'contact_actions' | 'lost_shield' | 'get_started';
}

const ONBOARDING_SLIDES: OnboardingSlideData[] = [
  {
    id: '1',
    step: 'ADIM 1 / 6',
    badge: 'AKILLI KÜNYE TEKNOLOJİSİ',
    badgeColor: '#10B981',
    title: 'Dostunuzun Koruma Kalkanı',
    subtitle:
      'PetPin akıllı QR künye ile evcil hayvanınız kaybolduğunda arama karmaşası biter. Telefon kamerasıyla saniyeler içinde sahibine ulaşılır.',
    type: 'tag_preview',
  },
  {
    id: '2',
    step: 'ADIM 2 / 6',
    badge: 'SIFIR ŞARJ & PİL DERDİ',
    badgeColor: '#F59E0B',
    title: 'Asla Şarjı Bitmez, Yarı Yolda Bırakmaz',
    subtitle:
      'Geleneksel ağır GPS tasmaların aksine pil, şarj cihazı veya batarya gerektirmez. Su geçirmez, hafif ve ömür boyu çalışır.',
    type: 'battery_comparison',
  },
  {
    id: '3',
    step: 'ADIM 3 / 6',
    badge: 'MİLİSANİYELİK TAKİP',
    badgeColor: '#38BDF8',
    title: 'Okutanın Konumu Anında Cebinizde',
    subtitle:
      'Dostunuzu bulan kişi künyeyi okuttuğu an, izin verdiği tam GPS koordinatları ve sokak adresi telefonunuza bildirim olarak düşer.',
    type: 'radar_gps',
  },
  {
    id: '4',
    step: 'ADIM 4 / 6',
    badge: 'UYGULAMASIZ ERİŞİM',
    badgeColor: '#10B981',
    title: 'Tek Tıkla Doğrudan İletişim',
    subtitle:
      'Bulan kişi hiçbir şey indirmeden tek dokunuşla sizi arayabilir, WhatsApp’tan yazabilir ve acil sağlık notlarını görebilir.',
    type: 'contact_actions',
  },
  {
    id: '5',
    step: 'ADIM 5 / 6',
    badge: 'KAYIP ALARM AĞI',
    badgeColor: '#EF4444',
    title: 'Kayıp Anında Yüksek Öncelikli Alarm',
    subtitle:
      'Kayıp Modunu açtığınızda künye okutulur okutulmaz telefonunuz titreşir, acil alarm verir ve harita üzerinde adım adım rota çizer.',
    type: 'lost_shield',
  },
  {
    id: '6',
    step: 'ADIM 6 / 6',
    badge: 'AİLEYE HOŞ GELDİNİZ',
    badgeColor: '#A855F7',
    title: 'Milo’nun Dünyasını Korumaya Başlayın',
    subtitle:
      'Künyenizi oluşturun, PDF çıktısını alın veya galerinizden paylaşın. Dostunuz artık her an güvende.',
    type: 'get_started',
  },
];

interface OnboardingScreenProps {
  onComplete: () => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / SCREEN_WIDTH);
    if (index !== currentIndex && index >= 0 && index < ONBOARDING_SLIDES.length) {
      setCurrentIndex(index);
      try {
        Vibration.vibrate(10);
      } catch {
        // fallback
      }
    }
  };

  const handleNext = () => {
    if (currentIndex < ONBOARDING_SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
      try {
        Vibration.vibrate(15);
      } catch {
        // fallback
      }
    } else {
      try {
        Vibration.vibrate([0, 30, 60, 30]);
      } catch {
        // fallback
      }
      onComplete();
    }
  };

  const handleSkip = () => {
    try {
      Vibration.vibrate(15);
    } catch {
      // fallback
    }
    onComplete();
  };

  const isLastSlide = currentIndex === ONBOARDING_SLIDES.length - 1;

  // Custom Interactive Visual Showcase per Slide Type
  const renderVisualShowcase = (type: OnboardingSlideData['type']) => {
    switch (type) {
      case 'tag_preview':
        return (
          <View style={styles.tagShowcaseBox}>
            <View style={styles.tagHoloCard}>
              <View style={styles.tagHeaderRow}>
                <View style={styles.tagLiveDot} />
                <Text style={styles.tagSerial}>PETPIN • SMART TAG</Text>
                <QrCode size={18} color="#10B981" />
              </View>

              <View style={styles.tagQrVisualBox}>
                <View style={styles.qrInnerFrame}>
                  <QrCode size={64} color="#FFFFFF" strokeWidth={1.8} />
                </View>
                <View style={styles.tagMetaBox}>
                  <Text style={styles.tagNameText}>Milo</Text>
                  <Text style={styles.tagBreedText}>Golden Retriever • 3 Yaş</Text>
                  <View style={styles.tagIdBadge}>
                    <Text style={styles.tagIdBadgeText}>ID: PETPIN-TR-8F3A29</Text>
                  </View>
                </View>
              </View>

              <View style={styles.tagFooterPill}>
                <Radio size={14} color="#10B981" style={{ marginRight: 6 }} />
                <Text style={styles.tagFooterPillText}>Kamera ile Okutulduğunda Anında Tanır</Text>
              </View>
            </View>
          </View>
        );

      case 'battery_comparison':
        return (
          <View style={styles.comparisonBox}>
            <View style={styles.compareCardBad}>
              <View style={styles.compareCardHeader}>
                <Text style={styles.compareTitleBad}>Eski Nesil GPS Tasması</Text>
                <Text style={styles.compareBadgeBad}>Pil: %12</Text>
              </View>
              <Text style={styles.compareDescBad}>❌ 1-2 günde bir şarj gerektirir</Text>
              <Text style={styles.compareDescBad}>❌ Ağır ve suya karşı hassas</Text>
            </View>

            <View style={styles.compareCardGood}>
              <View style={styles.compareCardHeader}>
                <Text style={styles.compareTitleGood}>PetPin Akıllı QR Künye</Text>
                <View style={styles.compareBadgeGood}>
                  <Zap size={12} color="#10B981" />
                  <Text style={styles.compareBadgeGoodText}>%100 Pasif</Text>
                </View>
              </View>
              <Text style={styles.compareDescGood}>✅ Asla şarjı bitmez, batarya istemez</Text>
              <Text style={styles.compareDescGood}>✅ Su geçirmez, kırılmaz & ultra hafif</Text>
            </View>
          </View>
        );

      case 'radar_gps':
        return (
          <View style={styles.radarBox}>
            <View style={styles.radarCircleOuter}>
              <View style={styles.radarCircleMid}>
                <View style={styles.radarCircleInner}>
                  <MapPin size={28} color="#38BDF8" />
                  <View style={styles.radarPing} />
                </View>
              </View>
            </View>

            <View style={styles.gpsTelemetryCard}>
              <View style={styles.gpsHeader}>
                <View style={styles.gpsPulseDot} />
                <Text style={styles.gpsTitle}>GPS Konumu Alındı</Text>
                <Text style={styles.gpsTime}>Şimdi</Text>
              </View>
              <Text style={styles.gpsAddress}>Kadıköy Moda Sahili Parkı, İstanbul</Text>
              <Text style={styles.gpsAccuracy}>Hassasiyet: ±3 metre • Canlı Rota Hazır</Text>
            </View>
          </View>
        );

      case 'contact_actions':
        return (
          <View style={styles.contactActionsBox}>
            <View style={styles.contactActionRow}>
              <View style={[styles.contactIconCircle, { backgroundColor: 'rgba(16, 185, 129, 0.2)' }]}>
                <PhoneCall size={20} color="#10B981" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.contactActionTitle}>Sahibini Doğrudan Ara</Text>
                <Text style={styles.contactActionSub}>+90 555 234 56 78 (Sarah Jenkins)</Text>
              </View>
            </View>

            <View style={styles.contactActionRow}>
              <View style={[styles.contactIconCircle, { backgroundColor: 'rgba(37, 211, 102, 0.2)' }]}>
                <MessageCircle size={20} color="#25D366" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.contactActionTitle}>WhatsApp ile Konum Paylaş</Text>
                <Text style={styles.contactActionSub}>Harita koordinatlarıyla anında mesaj</Text>
              </View>
            </View>

            <View style={styles.contactActionRow}>
              <View style={[styles.contactIconCircle, { backgroundColor: 'rgba(239, 68, 68, 0.2)' }]}>
                <Stethoscope size={20} color="#EF4444" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.contactActionTitle}>Acil Klinik & Alerji Notları</Text>
                <Text style={styles.contactActionSub}>Tavuk & buğday alerjisi vardır</Text>
              </View>
            </View>
          </View>
        );

      case 'lost_shield':
        return (
          <View style={styles.lostShieldBox}>
            <View style={styles.beaconOuter}>
              <View style={styles.beaconInner}>
                <AlertTriangle size={36} color="#EF4444" strokeWidth={2.4} />
              </View>
              <View style={styles.beaconRing} />
            </View>

            <View style={styles.lostStatusCard}>
              <Text style={styles.lostStatusTitle}>🚨 Kayıp Modu Güvenlik Ağı</Text>
              <Text style={styles.lostStatusDesc}>
                Künye okutulduğu an telefonunuz titreşir, yüksek sesli uyarı verir ve bulucuya acil durum talimatlarını gösterir.
              </Text>
            </View>
          </View>
        );

      case 'get_started':
        return (
          <View style={styles.getStartedBox}>
            <View style={styles.celebrationCircle}>
              <Sparkles size={40} color="#A855F7" strokeWidth={2.2} />
            </View>

            <View style={styles.featureGrid}>
              <View style={styles.featurePill}>
                <Check size={14} color="#10B981" strokeWidth={3} />
                <Text style={styles.featurePillText}>Ömür Boyu Ücretsiz</Text>
              </View>
              <View style={styles.featurePill}>
                <Check size={14} color="#10B981" strokeWidth={3} />
                <Text style={styles.featurePillText}>A4 Tasmayı Yazdır</Text>
              </View>
              <View style={styles.featurePill}>
                <Check size={14} color="#10B981" strokeWidth={3} />
                <Text style={styles.featurePillText}>Cihaz Yedekleme</Text>
              </View>
            </View>
          </View>
        );
    }
  };

  const renderSlideItem = ({ item }: { item: OnboardingSlideData }) => {
    return (
      <View style={styles.slideWrapper}>
        <View style={styles.glassContainer}>
          {/* Top Step & Badge Header */}
          <View style={styles.stepHeaderRow}>
            <Text style={styles.stepText}>{item.step}</Text>
            <View style={[styles.badgePill, { borderColor: `${item.badgeColor}40` }]}>
              <View style={[styles.badgeDot, { backgroundColor: item.badgeColor }]} />
              <Text style={[styles.badgeText, { color: item.badgeColor }]}>{item.badge}</Text>
            </View>
          </View>

          {/* Interactive Feature Visual Showcase */}
          {renderVisualShowcase(item.type)}

          {/* Main Title & Subtitle */}
          <Text style={styles.slideTitle}>{item.title}</Text>
          <Text style={styles.slideSubtitle}>{item.subtitle}</Text>
        </View>
      </View>
    );
  };

  return (
    <CosmicBackground>
      <SafeAreaView style={styles.safeContainer} edges={['top', 'bottom', 'left', 'right']}>
        {/* Top Floating App Bar */}
        <View style={styles.topBar}>
          <View style={styles.brandGroup}>
            <View style={styles.brandDot} />
            <Text style={styles.brandName}>PetPin</Text>
          </View>

          {!isLastSlide ? (
            <TouchableOpacity
              style={styles.skipButton}
              activeOpacity={0.7}
              onPress={handleSkip}
            >
              <Text style={styles.skipButtonText}>Atla</Text>
            </TouchableOpacity>
          ) : (
            <View style={{ width: 44 }} />
          )}
        </View>

        {/* Carousel Slides */}
        <FlatList
          ref={flatListRef}
          data={ONBOARDING_SLIDES}
          renderItem={renderSlideItem}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          getItemLayout={(_, index) => ({
            length: SCREEN_WIDTH,
            offset: SCREEN_WIDTH * index,
            index,
          })}
          initialNumToRender={2}
          maxToRenderPerBatch={2}
          windowSize={3}
          removeClippedSubviews={true}
          style={styles.carouselList}
        />

        {/* Bottom Pagination & Action Bar */}
        <View style={styles.bottomBar}>
          {/* Active Dot Indicators */}
          <View style={styles.paginationRow}>
            {ONBOARDING_SLIDES.map((_, idx) => {
              const isActive = idx === currentIndex;
              return (
                <View
                  key={idx}
                  style={[
                    styles.pageDot,
                    isActive ? styles.pageDotActive : styles.pageDotInactive,
                  ]}
                />
              );
            })}
          </View>

          {/* Action CTA Button */}
          <TouchableOpacity
            style={[
              styles.actionCta,
              isLastSlide ? styles.actionCtaFinish : styles.actionCtaNext,
            ]}
            activeOpacity={0.88}
            onPress={handleNext}
          >
            <Text style={styles.actionCtaText}>
              {isLastSlide ? 'Tasmayı Hazırla & Başla' : 'Devam Et'}
            </Text>
            <ArrowRight size={18} color="#FFFFFF" strokeWidth={2.6} style={{ marginLeft: 8 }} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </CosmicBackground>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 6,
  },
  brandGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#10B981',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 8,
  },
  brandName: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  skipButton: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  skipButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.75)',
  },
  carouselList: {
    flex: 1,
  },
  slideWrapper: {
    width: SCREEN_WIDTH,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  glassContainer: {
    width: '100%',
    backgroundColor: 'rgba(10, 18, 32, 0.78)',
    borderRadius: 32,
    padding: 22,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    ...SHADOWS.card,
  },
  stepHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 16,
  },
  stepText: {
    fontSize: 12,
    fontWeight: '800',
    color: 'rgba(255, 255, 255, 0.4)',
    letterSpacing: 0.5,
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
  },

  // Slide 1 Visual: Tag Holo Card
  tagShowcaseBox: {
    width: '100%',
    marginBottom: 18,
  },
  tagHoloCard: {
    backgroundColor: 'rgba(15, 76, 92, 0.25)',
    borderRadius: 24,
    padding: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  tagHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  tagLiveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  tagSerial: {
    fontSize: 11,
    fontWeight: '800',
    color: 'rgba(255, 255, 255, 0.8)',
    letterSpacing: 1,
  },
  tagQrVisualBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 12,
  },
  qrInnerFrame: {
    padding: 8,
    backgroundColor: '#0A192F',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.4)',
  },
  tagMetaBox: {
    flex: 1,
  },
  tagNameText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  tagBreedText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.65)',
    marginBottom: 8,
  },
  tagIdBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  tagIdBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#10B981',
  },
  tagFooterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingVertical: 6,
    borderRadius: 12,
  },
  tagFooterPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#10B981',
  },

  // Slide 2 Visual: Battery Comparison
  comparisonBox: {
    width: '100%',
    gap: 10,
    marginBottom: 18,
  },
  compareCardBad: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.25)',
  },
  compareCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  compareTitleBad: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FCA5A5',
  },
  compareBadgeBad: {
    fontSize: 10,
    fontWeight: '800',
    color: '#EF4444',
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  compareDescBad: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.75)',
    marginTop: 2,
  },
  compareCardGood: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    borderRadius: 18,
    padding: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(16, 185, 129, 0.4)',
  },
  compareTitleGood: {
    fontSize: 13,
    fontWeight: '800',
    color: '#6EE7B7',
  },
  compareBadgeGood: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(16, 185, 129, 0.25)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  compareBadgeGoodText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#10B981',
  },
  compareDescGood: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
    marginTop: 2,
  },

  // Slide 3 Visual: Radar
  radarBox: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 18,
  },
  radarCircleOuter: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 1.5,
    borderColor: 'rgba(56, 189, 248, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  radarCircleMid: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 1.5,
    borderColor: 'rgba(56, 189, 248, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radarCircleInner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(56, 189, 248, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radarPing: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#38BDF8',
    opacity: 0.5,
  },
  gpsTelemetryCard: {
    width: '100%',
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
  },
  gpsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  gpsPulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#38BDF8',
    marginRight: 6,
  },
  gpsTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#38BDF8',
    flex: 1,
  },
  gpsTime: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.5)',
    fontWeight: '700',
  },
  gpsAddress: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  gpsAccuracy: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.65)',
  },

  // Slide 4 Visual: Contact Actions
  contactActionsBox: {
    width: '100%',
    gap: 8,
    marginBottom: 18,
  },
  contactActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    gap: 12,
  },
  contactIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactActionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  contactActionSub: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 1,
  },

  // Slide 5 Visual: Lost Shield
  lostShieldBox: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 18,
  },
  beaconOuter: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  beaconInner: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: 'rgba(239, 68, 68, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  beaconRing: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 1.5,
    borderColor: 'rgba(239, 68, 68, 0.5)',
  },
  lostStatusCard: {
    width: '100%',
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.35)',
  },
  lostStatusTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#F87171',
    marginBottom: 4,
    textAlign: 'center',
  },
  lostStatusDesc: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 16,
  },

  // Slide 6 Visual: Get Started
  getStartedBox: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 18,
  },
  celebrationCircle: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: 'rgba(168, 85, 247, 0.2)',
    borderWidth: 1.5,
    borderColor: 'rgba(168, 85, 247, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  featurePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    gap: 6,
  },
  featurePillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // Typography
  slideTitle: {
    fontSize: 21,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 27,
    marginBottom: 8,
    letterSpacing: -0.4,
  },
  slideSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.68)',
    textAlign: 'center',
    lineHeight: 19,
  },

  // Bottom Controls
  bottomBar: {
    paddingHorizontal: 22,
    paddingBottom: 20,
    paddingTop: 10,
    alignItems: 'center',
    gap: 16,
  },
  paginationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pageDot: {
    height: 6,
    borderRadius: 3,
  },
  pageDotActive: {
    width: 26,
    backgroundColor: '#10B981',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 6,
  },
  pageDotInactive: {
    width: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
  },
  actionCta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 16,
    borderRadius: 22,
  },
  actionCtaNext: {
    backgroundColor: '#0F4C5C',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
  },
  actionCtaFinish: {
    backgroundColor: '#10B981',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 14,
  },
  actionCtaText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
});
