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
  Image,
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
  Heart,
  MessageCircle,
} from 'lucide-react-native';
import { CosmicBackground } from '../components/CosmicBackground';
import { SHADOWS } from '../theme/colors';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface RevolutOnboardingSlide {
  id: string;
  tag: string;
  tagColor: string;
  title: string;
  subtitle: string;
  photo: string;
  petBadgeName: string;
  petBadgeStatus: string;
  floatingPill: {
    icon: any;
    text: string;
    subtext: string;
  };
  features: string[];
}

const REVOLUT_SLIDES: RevolutOnboardingSlide[] = [
  {
    id: '1',
    tag: 'AKILLI KÜNYE SİSTEMİ',
    tagColor: '#10B981',
    title: 'Dostunuz Kaybolduğunda\nSaniyeler İçinde Yanınızda',
    subtitle:
      'PetPin akıllı QR künyesi ile arama karmaşası biter. Telefon kamerasıyla okutan herkes tek dokunuşla size ulaşır.',
    photo: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80',
    petBadgeName: 'Milo • Golden Retriever',
    petBadgeStatus: 'Künye 7/24 Aktif',
    floatingPill: {
      icon: QrCode,
      text: 'Akıllı QR Künye',
      subtext: 'Kamerayla anında tanır',
    },
    features: [
      'Uygulamasız doğrudan tanıma',
      'Tüm akıllı telefonlarla uyumlu',
      'Sıfır abonelik & ömür boyu kullanım',
    ],
  },
  {
    id: '2',
    tag: 'SIFIR ŞARJ & PİL',
    tagColor: '#F59E0B',
    title: 'Asla Şarjı Bitmez,\nYarı Yolda Bırakmaz',
    subtitle:
      'Geleneksel ağır GPS tasmaların aksine pil veya şarj istemez. Kediniz ve köpeğiniz için tüy kadar hafif ve %100 su geçirmezdir.',
    photo: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80',
    petBadgeName: 'Luna • British Shorthair',
    petBadgeStatus: '%100 Pasif Güvenlik',
    floatingPill: {
      icon: Zap,
      text: 'Sıfır Pil İhtiyacı',
      subtext: 'Ömür boyu kesintisiz',
    },
    features: [
      'Günde bir şarj etme derdine son',
      'Kediler için ultra hafif & rahat',
      'Yağmura ve suya %100 dayanıklı',
    ],
  },
  {
    id: '3',
    tag: 'CANLI GPS TELEMETRİ',
    tagColor: '#38BDF8',
    title: 'Okutan Kişinin Konumu\nAnında Haritanızda',
    subtitle:
      'Dostunuzu bulan kişi künyeyi okuttuğu an, izin verdiği canlı GPS koordinatları ve tam sokak adresi telefonunuza bildirim olarak düşer.',
    photo: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80',
    petBadgeName: 'Baron • Fransız Bulldog',
    petBadgeStatus: 'GPS Radarı Hazır',
    floatingPill: {
      icon: MapPin,
      text: 'Canlı Konum Bildirimi',
      subtext: '±3m yüksek hassasiyet',
    },
    features: [
      'Anlık sokak adresi & zaman damgası',
      'Tek tıkla navigasyon ve rota tarifi',
      'Sesli ve titreşimli acil uyarı',
    ],
  },
  {
    id: '4',
    tag: 'TEK DOKUNUŞLA SAHİBE ULAŞIM',
    tagColor: '#10B981',
    title: 'WhatsApp, Arama ve\nAcil Veteriner Bilgisi',
    subtitle:
      'Bulan kişi hiçbir uygulama indirmeden tek tıkla sizi telefonla arayabilir, WhatsApp’tan yazabilir ve varsa acil sağlık alerji notlarını görebilir.',
    photo: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=800&q=80',
    petBadgeName: 'Pamuk & Tarçın',
    petBadgeStatus: 'İletişim Bilgileri Hazır',
    floatingPill: {
      icon: PhoneCall,
      text: 'Hızlı Arama & WhatsApp',
      subtext: 'Uygulama gerektirmez',
    },
    features: [
      'Doğrudan sahibini arama butonu',
      'WhatsApp ile otomatik konum paylaşımı',
      'Alerji, kronik hastalık ve klinik notları',
    ],
  },
  {
    id: '5',
    tag: 'KAYIP MODU & ALARM AĞI',
    tagColor: '#EF4444',
    title: 'Kayıp Anında Tüm\nGüvenlik Kalkanı Açılır',
    subtitle:
      'Uygulamadan Kayıp Modunu açın; künye okutulduğu anda telefonunuz acil durum alarmı verir, haritada rotayı çizer ve bulucuya talimatları gösterir.',
    photo: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5455?auto=format&fit=crop&w=800&q=80',
    petBadgeName: 'Max • Alman Kurdu',
    petBadgeStatus: 'Kayıp Kalkanı Aktif',
    floatingPill: {
      icon: AlertTriangle,
      text: 'Acil SOS Kalkanı',
      subtext: 'Öncelikli alarm modu',
    },
    features: [
      'Yüksek öncelikli acil durum uyarısı',
      'Bulucuya özel yönlendirme ekranı',
      'Kayıp durumunda kırmızı harita pini',
    ],
  },
  {
    id: '6',
    tag: 'PETPIN AİLESİNE HOŞ GELDİNİZ',
    tagColor: '#A855F7',
    title: 'Dostunuzun Dünyasını\nKorumaya Hazır mısınız?',
    subtitle:
      'Künyenizi oluşturun, PDF çıktısını alın veya galerinizden paylaşın. Dostunuz artık her adımda güvende.',
    photo: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=800&q=80',
    petBadgeName: 'PetPin Ailesi',
    petBadgeStatus: 'Korumaya Hazır',
    floatingPill: {
      icon: Sparkles,
      text: 'Hemen Başlayın',
      subtext: 'Ücretsiz & Sınırsız',
    },
    features: [
      'Yazdırılabilir A4 künye şablonu',
      'Cihazlar arası güvenli yedekleme',
      '7/24 kesintisiz pasif koruma',
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
    if (index !== currentIndex && index >= 0 && index < REVOLUT_SLIDES.length) {
      setCurrentIndex(index);
      try {
        Vibration.vibrate(10);
      } catch {
        // haptic fallback
      }
    }
  };

  const handleNext = () => {
    if (currentIndex < REVOLUT_SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
      try {
        Vibration.vibrate(15);
      } catch {
        // haptic fallback
      }
    } else {
      try {
        Vibration.vibrate([0, 30, 60, 30]);
      } catch {
        // haptic fallback
      }
      onComplete();
    }
  };

  const handleSkip = () => {
    try {
      Vibration.vibrate(12);
    } catch {
      // haptic fallback
    }
    onComplete();
  };

  const isLastSlide = currentIndex === REVOLUT_SLIDES.length - 1;

  const renderSlideItem = ({ item }: { item: RevolutOnboardingSlide }) => {
    const PillIcon = item.floatingPill.icon;

    return (
      <View style={styles.slideWrapper}>
        {/* 1. Revolut-Style Hero Photo Card with Glowing Frosted Badge */}
        <View style={styles.photoContainer}>
          <Image source={{ uri: item.photo }} style={styles.petHeroImage} resizeMode="cover" />

          {/* Gradient Dark Overlay on Image Bottom */}
          <View style={styles.photoGradientScrim} />

          {/* Top Pet Status Pill */}
          <View style={styles.petPhotoStatusPill}>
            <View style={[styles.liveStatusDot, { backgroundColor: item.tagColor }]} />
            <Text style={styles.petPhotoStatusText}>{item.petBadgeName}</Text>
          </View>

          {/* Floating Glassmorphic Revolut Feature Widget */}
          <View style={styles.floatingGlassPill}>
            <View style={[styles.floatingIconCircle, { backgroundColor: `${item.tagColor}25` }]}>
              <PillIcon size={18} color={item.tagColor} strokeWidth={2.4} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.floatingPillTitle}>{item.floatingPill.text}</Text>
              <Text style={styles.floatingPillSub}>{item.floatingPill.subtext}</Text>
            </View>
          </View>
        </View>

        {/* 2. Revolut-Style Bottom Content Card */}
        <View style={styles.contentCard}>
          {/* Tag Badge */}
          <View style={[styles.categoryBadge, { borderColor: `${item.tagColor}35` }]}>
            <View style={[styles.categoryDot, { backgroundColor: item.tagColor }]} />
            <Text style={[styles.categoryBadgeText, { color: item.tagColor }]}>{item.tag}</Text>
          </View>

          {/* Bold Revolut Title & Subtitle */}
          <Text style={styles.slideTitle}>{item.title}</Text>
          <Text style={styles.slideSubtitle}>{item.subtitle}</Text>

          {/* Revolut Feature Highlight Checklist */}
          <View style={styles.featuresList}>
            {item.features.map((feat, idx) => (
              <View key={idx} style={styles.featureRow}>
                <View style={[styles.featureCheckCircle, { backgroundColor: `${item.tagColor}20` }]}>
                  <Check size={12} color={item.tagColor} strokeWidth={3} />
                </View>
                <Text style={styles.featureText}>{feat}</Text>
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
        {/* Top Header with Revolut Segmented Story Progress Bar */}
        <View style={styles.topHeader}>
          {/* Segmented Progress Bars */}
          <View style={styles.progressSegmentsRow}>
            {REVOLUT_SLIDES.map((_, idx) => {
              const isPast = idx < currentIndex;
              const isCurrent = idx === currentIndex;
              return (
                <View key={idx} style={styles.segmentTrack}>
                  <View
                    style={[
                      styles.segmentFill,
                      isPast && styles.segmentFillFull,
                      isCurrent && styles.segmentFillCurrent,
                    ]}
                  />
                </View>
              );
            })}
          </View>

          {/* Brand & Skip Button */}
          <View style={styles.navRow}>
            <View style={styles.brandRow}>
              <View style={styles.brandDot} />
              <Text style={styles.brandTitle}>PetPin</Text>
            </View>

            {!isLastSlide ? (
              <TouchableOpacity style={styles.skipBtn} activeOpacity={0.7} onPress={handleSkip}>
                <Text style={styles.skipBtnText}>Atla</Text>
              </TouchableOpacity>
            ) : (
              <View style={{ width: 44 }} />
            )}
          </View>
        </View>

        {/* Slides Carousel */}
        <FlatList
          ref={flatListRef}
          data={REVOLUT_SLIDES}
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

        {/* Bottom Revolut-Style Large Action CTA */}
        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={[styles.actionBtn, isLastSlide ? styles.actionBtnGetStarted : styles.actionBtnNext]}
            activeOpacity={0.88}
            onPress={handleNext}
          >
            <Text style={styles.actionBtnText}>{isLastSlide ? 'Hemen Başla' : 'Devam Et'}</Text>
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
  topHeader: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 4,
    gap: 12,
  },
  progressSegmentsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    width: '100%',
  },
  segmentTrack: {
    flex: 1,
    height: 3.5,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  segmentFill: {
    height: '100%',
    width: '0%',
  },
  segmentFillFull: {
    width: '100%',
    backgroundColor: '#10B981',
  },
  segmentFillCurrent: {
    width: '100%',
    backgroundColor: '#10B981',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 6,
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandDot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: '#10B981',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 8,
  },
  brandTitle: {
    fontSize: 19,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.4,
  },
  skipBtn: {
    paddingVertical: 5,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  skipBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.75)',
  },
  carouselList: {
    flex: 1,
  },
  slideWrapper: {
    width: SCREEN_WIDTH,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    paddingVertical: 6,
  },

  // Revolut Hero Pet Photo Container
  photoContainer: {
    width: '100%',
    height: SCREEN_HEIGHT * 0.32,
    borderRadius: 28,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.14)',
    ...SHADOWS.card,
  },
  petHeroImage: {
    width: '100%',
    height: '100%',
  },
  photoGradientScrim: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 90,
    backgroundColor: 'rgba(4, 9, 20, 0.6)',
  },
  petPhotoStatusPill: {
    position: 'absolute',
    top: 14,
    left: 14,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(7, 14, 26, 0.82)',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  liveStatusDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    marginRight: 6,
  },
  petPhotoStatusText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  floatingGlassPill: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(10, 20, 36, 0.88)',
    borderRadius: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    gap: 10,
  },
  floatingIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatingPillTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  floatingPillSub: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.65)',
    fontWeight: '600',
  },

  // Revolut Bottom Content Card
  contentCard: {
    backgroundColor: 'rgba(10, 18, 32, 0.82)',
    borderRadius: 28,
    padding: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    marginTop: 10,
    ...SHADOWS.card,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    marginBottom: 8,
  },
  categoryDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    marginRight: 6,
  },
  categoryBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  slideTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
    lineHeight: 26,
    marginBottom: 6,
    letterSpacing: -0.4,
  },
  slideSubtitle: {
    fontSize: 12.5,
    color: 'rgba(255, 255, 255, 0.68)',
    lineHeight: 18,
    marginBottom: 12,
  },
  featuresList: {
    gap: 6,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureCheckCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.88)',
  },

  // Bottom CTA Bar
  bottomBar: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    paddingTop: 6,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 16,
    borderRadius: 22,
  },
  actionBtnNext: {
    backgroundColor: '#0F4C5C',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    ...SHADOWS.subtle,
  },
  actionBtnGetStarted: {
    backgroundColor: '#10B981',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 14,
  },
  actionBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
});
