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
} from 'lucide-react-native';
import { CosmicBackground } from '../components/CosmicBackground';
import { COLORS, SHADOWS } from '../theme/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export interface OnboardingSlide {
  id: string;
  badge: string;
  badgeColor: string;
  title: string;
  subtitle: string;
  icon: any;
  iconBg: string;
  iconColor: string;
  highlightPoints: string[];
}

const ONBOARDING_SLIDES: OnboardingSlide[] = [
  {
    id: '1',
    badge: 'YENİ NESİL KORUMA',
    badgeColor: '#10B981',
    title: 'Dostunuzun Güvencesi, Sizin İçiniz Rahat',
    subtitle:
      'PetPin akıllı QR künye teknolojisi ile tüylü dostunuz kaybolduğunda panik ve belirsizlik biter. Saniyeler içinde ona kavuşun.',
    icon: ShieldCheck,
    iconBg: 'rgba(16, 185, 129, 0.18)',
    iconColor: '#10B981',
    highlightPoints: [
      'Sıfır abonelik veya aylık ücret',
      'Telefon kamerasıyla anında tanıma',
      'Tüm akıllı telefonlarla %100 uyumlu',
    ],
  },
  {
    id: '2',
    badge: '%100 PASİF ÇALIŞMA',
    badgeColor: '#F59E0B',
    title: 'Asla Şarjı Bitmez, Yarı Yolda Bırakmaz',
    subtitle:
      'Geleneksel ağır GPS tasmaların aksine pil, şarj cihazı veya batarya gerektirmez. Su geçirmez, ultra hafif ve ömür boyu aktiftir.',
    icon: Zap,
    iconBg: 'rgba(245, 158, 11, 0.18)',
    iconColor: '#F59E0B',
    highlightPoints: [
      'Sıfır şarj & sıfır pil değişimi',
      'Hafif ve suya dayanıklı künye',
      'Ağır batarya taşımayan rahat tasarım',
    ],
  },
  {
    id: '3',
    badge: 'MİLİSANİYELİK TAKİP',
    badgeColor: '#38BDF8',
    title: 'Kamerayı Tutan Anında Konumunu Gönderir',
    subtitle:
      'Dostunuzu bulan hayvansever künyeyi okuttuğu anda, izin verdiği tam GPS koordinatları ve sokak adresi telefonunuza anlık düşer.',
    icon: MapPin,
    iconBg: 'rgba(56, 189, 248, 0.18)',
    iconColor: '#38BDF8',
    highlightPoints: [
      '±3 metre yüksek GPS hassasiyeti',
      'Canlı sokak adresi & zaman damgası',
      'Tek dokunuşla navigasyon ve rota',
    ],
  },
  {
    id: '4',
    badge: 'ANLIK İLETİŞİM',
    badgeColor: '#10B981',
    title: 'WhatsApp, Telefon & Acil Klinik Bilgisi',
    subtitle:
      'Bulan kişi hiçbir uygulama indirmeden tek tıkla sizi telefonla arayabilir, WhatsApp’tan yazabilir ve kritik sağlık alerji notlarını görebilir.',
    icon: PhoneCall,
    iconBg: 'rgba(16, 185, 129, 0.18)',
    iconColor: '#10B981',
    highlightPoints: [
      'Tek tıkla sahibini arama & mesaj',
      'Kronik hastalık & aşı alerji notları',
      'Nöbetçi veteriner kliniği bilgisi',
    ],
  },
  {
    id: '5',
    badge: 'KAYIP ALARM MODU',
    badgeColor: '#EF4444',
    title: 'Kayıp Anında Tüm Alarm Ağı Devreye Girer',
    subtitle:
      'Uygulamadan tek dokunuşla Kayıp Modunu açın; künye tarandığında telefonunuz yüksek titreşimli acil bildirim verir ve haritada parlar.',
    icon: AlertTriangle,
    iconBg: 'rgba(239, 68, 68, 0.18)',
    iconColor: '#EF4444',
    highlightPoints: [
      'Yüksek öncelikli acil durum uyarısı',
      'Kayıp modunda kırmızı alarm ekranı',
      'Bulan kişiye özel acil yönlendirme',
    ],
  },
  {
    id: '6',
    badge: 'BAŞLAMAYA HAZIRSINIZ',
    badgeColor: '#A855F7',
    title: 'Milo’nun Dünyasını Korumaya Başlayın',
    subtitle:
      'Künyenizi oluşturun, PDF çıktısını alın veya galerinizden paylaşın. Dostunuz artık her adımda güvende.',
    icon: Sparkles,
    iconBg: 'rgba(168, 85, 247, 0.22)',
    iconColor: '#A855F7',
    highlightPoints: [
      'Yazdırılabilir A4 künye şablonu',
      'Güvenli cihaz yedekleme & geri yükleme',
      '7/24 kesintisiz koruma kalkanı',
    ],
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
        Vibration.vibrate(12);
      } catch {
        // haptic fallback
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
        Vibration.vibrate(20);
      } catch {
        // haptic fallback
      }
    } else {
      try {
        Vibration.vibrate([0, 40, 60, 40]);
      } catch {
        // haptic fallback
      }
      onComplete();
    }
  };

  const handleSkip = () => {
    try {
      Vibration.vibrate(15);
    } catch {
      // haptic fallback
    }
    onComplete();
  };

  const isLastSlide = currentIndex === ONBOARDING_SLIDES.length - 1;

  const renderSlideItem = ({ item }: { item: OnboardingSlide }) => {
    const IconComponent = item.icon;

    return (
      <View style={styles.slideWrapper}>
        <View style={styles.slideCard}>
          {/* Top Badge */}
          <View style={[styles.badgePill, { borderColor: `${item.badgeColor}40` }]}>
            <View style={[styles.badgeDot, { backgroundColor: item.badgeColor }]} />
            <Text style={[styles.badgeText, { color: item.badgeColor }]}>{item.badge}</Text>
          </View>

          {/* Central Glowing Icon Circle */}
          <View style={[styles.iconOuterGlow, { backgroundColor: item.iconBg }]}>
            <View style={styles.iconInnerCircle}>
              <IconComponent size={44} color={item.iconColor} strokeWidth={2.2} />
            </View>
          </View>

          {/* Titles */}
          <Text style={styles.slideTitle}>{item.title}</Text>
          <Text style={styles.slideSubtitle}>{item.subtitle}</Text>

          {/* Feature Highlight Pills */}
          <View style={styles.highlightsContainer}>
            {item.highlightPoints.map((point, idx) => (
              <View key={idx} style={styles.highlightRow}>
                <View style={[styles.checkCircle, { backgroundColor: `${item.badgeColor}22` }]}>
                  <Check size={13} color={item.badgeColor} strokeWidth={3} />
                </View>
                <Text style={styles.highlightText}>{point}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    );
  };

  return (
    <CosmicBackground>
      <SafeAreaView style={styles.safeContainer} edges={['top', 'bottom', 'left', 'right']}>
        {/* Top Header Controls */}
        <View style={styles.topHeader}>
          <View style={styles.brandRow}>
            <View style={styles.brandLogoDot} />
            <Text style={styles.brandTitle}>PetPin</Text>
          </View>

          {!isLastSlide ? (
            <TouchableOpacity
              style={styles.skipBtn}
              activeOpacity={0.7}
              onPress={handleSkip}
            >
              <Text style={styles.skipBtnText}>Atla</Text>
            </TouchableOpacity>
          ) : (
            <View style={{ width: 40 }} />
          )}
        </View>

        {/* Carousel Content */}
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
          style={styles.carouselList}
        />

        {/* Bottom Navigation & Controls */}
        <View style={styles.bottomBar}>
          {/* Pagination Indicators */}
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

          {/* Action Button */}
          <TouchableOpacity
            style={[
              styles.actionBtn,
              isLastSlide ? styles.actionBtnGetStarted : styles.actionBtnNext,
            ]}
            activeOpacity={0.85}
            onPress={handleNext}
          >
            <Text style={styles.actionBtnText}>
              {isLastSlide ? 'Hemen Başla' : 'Devam Et'}
            </Text>
            <ArrowRight
              size={18}
              color="#FFFFFF"
              strokeWidth={2.5}
              style={{ marginLeft: 8 }}
            />
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
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 8,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandLogoDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#10B981',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 8,
  },
  brandTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  skipBtn: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  skipBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.75)',
  },
  carouselList: {
    flex: 1,
  },
  slideWrapper: {
    width: SCREEN_WIDTH,
    paddingHorizontal: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slideCard: {
    width: '100%',
    backgroundColor: 'rgba(15, 23, 42, 0.72)',
    borderRadius: 32,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    ...SHADOWS.card,
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    marginBottom: 20,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  iconOuterGlow: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  iconInnerCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: 'rgba(10, 20, 36, 0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  slideTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 10,
    letterSpacing: -0.4,
  },
  slideSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.68)',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  highlightsContainer: {
    width: '100%',
    gap: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  highlightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  highlightText: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.88)',
    flex: 1,
  },
  bottomBar: {
    paddingHorizontal: 24,
    paddingBottom: 20,
    paddingTop: 12,
    alignItems: 'center',
    gap: 18,
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
    width: 24,
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
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 16,
    borderRadius: 22,
    ...SHADOWS.subtle,
  },
  actionBtnNext: {
    backgroundColor: '#0F4C5C',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  actionBtnGetStarted: {
    backgroundColor: '#10B981',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  actionBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
});
