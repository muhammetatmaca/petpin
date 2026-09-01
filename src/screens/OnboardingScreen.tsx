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
import { PastelBackground } from '../components/PastelBackground';
import { SHADOWS } from '../theme/colors';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface RevolutOnboardingSlide {
  id: string;
  tag: string;
  tagBg: string;
  tagBorder: string;
  tagTextColor: string;
  tagDotColor: string;
  title: string;
  subtitle: string;
  photo: string;
  petBadgeName: string;
  petBadgeStatus: string;
  floatingPill: {
    icon: any;
    text: string;
    subtext: string;
    iconBg: string;
    iconColor: string;
  };
  features: string[];
}

const PASTEL_SLIDES: RevolutOnboardingSlide[] = [
  {
    id: '1',
    tag: 'AKILLI KÜNYE SİSTEMİ',
    tagBg: '#DCFCE7',
    tagBorder: '#86EFAC',
    tagTextColor: '#047857',
    tagDotColor: '#10B981',
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
      iconBg: '#DCFCE7',
      iconColor: '#059669',
    },
    features: [
      'Uygulamasız doğrudan tanıma',
      'Tüm akıllı telefonlarla %100 uyumlu',
      'Sıfır abonelik & ömür boyu kullanım',
    ],
  },
  {
    id: '2',
    tag: 'SIFIR ŞARJ & PİL',
    tagBg: '#FEF3C7',
    tagBorder: '#FDE68A',
    tagTextColor: '#B45309',
    tagDotColor: '#F59E0B',
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
      iconBg: '#FEF3C7',
      iconColor: '#D97706',
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
    tagBg: '#E0F2FE',
    tagBorder: '#BAE6FD',
    tagTextColor: '#0369A1',
    tagDotColor: '#0284C7',
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
      iconBg: '#E0F2FE',
      iconColor: '#0284C7',
    },
    features: [
      'Anlık sokak adresi & zaman damgası',
      'Tek tıkla navigasyon ve rota tarifi',
      'Sesli ve titreşimli anlık uyarı',
    ],
  },
  {
    id: '4',
    tag: 'TEK DOKUNUŞLA SAHİBE ULAŞIM',
    tagBg: '#D1FAE5',
    tagBorder: '#A7F3D0',
    tagTextColor: '#047857',
    tagDotColor: '#059669',
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
      iconBg: '#DCFCE7',
      iconColor: '#059669',
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
    tagBg: '#FFE4E6',
    tagBorder: '#FECDD3',
    tagTextColor: '#BE123C',
    tagDotColor: '#E11D48',
    title: 'Kayıp Anında Tüm\nGüvenlik Kalkanı Açılır',
    subtitle:
      'Uygulamadan Kayıp Modunu açın; künye okutulduğu anda telefonunuz acil durum alarmı verir, haritada rotayı çizer ve bulucuya talimatları gösterir.',
    photo: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&q=80',
    petBadgeName: 'Max • Asil Alman Kurdu',
    petBadgeStatus: 'Kayıp Kalkanı Aktif',
    floatingPill: {
      icon: AlertTriangle,
      text: 'Acil SOS Kalkanı',
      subtext: 'Öncelikli alarm modu',
      iconBg: '#FFE4E6',
      iconColor: '#E11D48',
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
    tagBg: '#F3E8FF',
    tagBorder: '#DDD6FE',
    tagTextColor: '#6D28D9',
    tagDotColor: '#7C3AED',
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
      iconBg: '#F3E8FF',
      iconColor: '#7C3AED',
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
    if (index !== currentIndex && index >= 0 && index < PASTEL_SLIDES.length) {
      setCurrentIndex(index);
      try {
        Vibration.vibrate(10);
      } catch {
        // fallback
      }
    }
  };

  const handleNext = () => {
    if (currentIndex < PASTEL_SLIDES.length - 1) {
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
      Vibration.vibrate(12);
    } catch {
      // fallback
    }
    onComplete();
  };

  const isLastSlide = currentIndex === PASTEL_SLIDES.length - 1;

  const renderSlideItem = ({ item }: { item: RevolutOnboardingSlide }) => {
    const PillIcon = item.floatingPill.icon;

    return (
      <View style={styles.slideWrapper}>
        {/* 1. Pastel Revolut Hero Pet Photo Card with Floating Glass Pill */}
        <View style={styles.photoContainer}>
          <Image source={{ uri: item.photo }} style={styles.petHeroImage} resizeMode="cover" />

          {/* Soft Bottom Gradient Scrim */}
          <View style={styles.photoGradientScrim} />

          {/* Top Pet Status Pill */}
          <View style={styles.petPhotoStatusPill}>
            <View style={[styles.liveStatusDot, { backgroundColor: item.tagDotColor }]} />
            <Text style={styles.petPhotoStatusText}>{item.petBadgeName}</Text>
          </View>

          {/* Floating Pastel Glass Pill */}
          <View style={styles.floatingGlassPill}>
            <View style={[styles.floatingIconCircle, { backgroundColor: item.floatingPill.iconBg }]}>
              <PillIcon size={18} color={item.floatingPill.iconColor} strokeWidth={2.4} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.floatingPillTitle}>{item.floatingPill.text}</Text>
              <Text style={styles.floatingPillSub}>{item.floatingPill.subtext}</Text>
            </View>
          </View>
        </View>

        {/* 2. Crisp Milk-Glass Bottom Content Card */}
        <View style={styles.contentCard}>
          {/* Pastel Category Badge */}
          <View
            style={[
              styles.categoryBadge,
              { backgroundColor: item.tagBg, borderColor: item.tagBorder },
            ]}
          >
            <View style={[styles.categoryDot, { backgroundColor: item.tagDotColor }]} />
            <Text style={[styles.categoryBadgeText, { color: item.tagTextColor }]}>{item.tag}</Text>
          </View>

          {/* Bold Charcoal Revolut Typography */}
          <Text style={styles.slideTitle}>{item.title}</Text>
          <Text style={styles.slideSubtitle}>{item.subtitle}</Text>

          {/* Pastel Feature Checklist */}
          <View style={styles.featuresList}>
            {item.features.map((feat, idx) => (
              <View key={idx} style={styles.featureRow}>
                <View style={[styles.featureCheckCircle, { backgroundColor: item.tagBg }]}>
                  <Check size={12} color={item.tagTextColor} strokeWidth={3} />
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
    <PastelBackground>
      <SafeAreaView style={styles.safeContainer} edges={['top', 'bottom', 'left', 'right']}>
        {/* Top Header with Revolut Segmented Story Progress Bar */}
        <View style={styles.topHeader}>
          {/* Segmented Progress Bars */}
          <View style={styles.progressSegmentsRow}>
            {PASTEL_SLIDES.map((_, idx) => {
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
          data={PASTEL_SLIDES}
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

        {/* Bottom Action CTA */}
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
    </PastelBackground>
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
    height: 4,
    backgroundColor: 'rgba(15, 23, 42, 0.08)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  segmentFill: {
    height: '100%',
    width: '0%',
  },
  segmentFillFull: {
    width: '100%',
    backgroundColor: '#0F4C5C',
  },
  segmentFillCurrent: {
    width: '100%',
    backgroundColor: '#0F4C5C',
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
    backgroundColor: '#0F4C5C',
  },
  brandTitle: {
    fontSize: 19,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.4,
  },
  skipBtn: {
    paddingVertical: 5,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.08)',
  },
  skipBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
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

  // Hero Pet Photo Card
  photoContainer: {
    width: '100%',
    height: SCREEN_HEIGHT * 0.32,
    borderRadius: 28,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    backgroundColor: '#E2E8F0',
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
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
  },
  petPhotoStatusPill: {
    position: 'absolute',
    top: 14,
    left: 14,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 1)',
    ...SHADOWS.subtle,
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
    color: '#0F172A',
  },
  floatingGlassPill: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    borderRadius: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 1)',
    gap: 10,
    ...SHADOWS.subtle,
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
    color: '#0F172A',
  },
  floatingPillSub: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },

  // Bottom Content Card (Crisp Milk-Glass)
  contentCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    borderRadius: 28,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 1)',
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
    color: '#0F172A',
    lineHeight: 26,
    marginBottom: 6,
    letterSpacing: -0.4,
  },
  slideSubtitle: {
    fontSize: 12.5,
    color: '#475569',
    lineHeight: 18,
    marginBottom: 12,
  },
  featuresList: {
    gap: 6,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(15, 23, 42, 0.06)',
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
    color: '#1E293B',
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
    ...SHADOWS.glowTeal,
  },
  actionBtnGetStarted: {
    backgroundColor: '#10B981',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
  },
  actionBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
});
