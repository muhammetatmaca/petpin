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
  Tag,
  Radio,
  Lock,
} from 'lucide-react-native';
import { CosmicBackground } from '../components/CosmicBackground';
import { SHADOWS } from '../theme/colors';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface RevolutOnboardingSlide {
  id: string;
  tagEmoji: string;
  tag: string;
  tagBg: string;
  tagBorder: string;
  tagTextColor: string;
  tagDotColor: string;
  title: string;
  subtitle: string;
  photo: string;
  petBadgeName: string;
  collarSerial: string;
  floatingPill: {
    icon: any;
    title: string;
    description: string;
    iconBg: string;
    iconColor: string;
    badgeText: string;
  };
  features: string[];
}

const PASTEL_SLIDES: RevolutOnboardingSlide[] = [
  {
    id: '1',
    tagEmoji: '🏷️',
    tag: 'AKILLI QR KÜNYE',
    tagBg: '#DCFCE7',
    tagBorder: '#86EFAC',
    tagTextColor: '#047857',
    tagDotColor: '#10B981',
    title: 'Dostunuz Kaybolduğunda\nSaniyeler İçinde Yanınızda',
    subtitle:
      'PetPin akıllı QR künyesi ile arama karmaşası biter. Telefon kamerasıyla okutan herkes tek dokunuşla size ulaşır.',
    photo: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80',
    petBadgeName: 'Milo • Golden Retriever',
    collarSerial: 'TAG: #PETPIN-01',
    floatingPill: {
      icon: QrCode,
      title: 'Akıllı QR Künye',
      description: 'Telefon kamerasıyla anında tanır',
      iconBg: '#DCFCE7',
      iconColor: '#059669',
      badgeText: '7/24 Aktif',
    },
    features: [
      'Uygulamasız doğrudan tanıma',
      'Tüm akıllı telefonlarla %100 uyumlu',
      'Sıfır abonelik & ömür boyu kullanım',
    ],
  },
  {
    id: '2',
    tagEmoji: '⚡',
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
    collarSerial: 'TAG: #PETPIN-02',
    floatingPill: {
      icon: Zap,
      title: 'Sıfır Pil İhtiyacı',
      description: 'Ömür boyu kesintisiz koruma',
      iconBg: '#FEF3C7',
      iconColor: '#D97706',
      badgeText: '%100 Pasif',
    },
    features: [
      'Günde bir şarj etme derdine son',
      'Kediler için ultra hafif & rahat',
      'Yağmura ve suya %100 dayanıklı',
    ],
  },
  {
    id: '3',
    tagEmoji: '📍',
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
    collarSerial: 'TAG: #PETPIN-03',
    floatingPill: {
      icon: MapPin,
      title: 'Canlı Konum Bildirimi',
      description: '±3m yüksek GPS hassasiyeti',
      iconBg: '#E0F2FE',
      iconColor: '#0284C7',
      badgeText: 'GPS Canlı',
    },
    features: [
      'Anlık sokak adresi & zaman damgası',
      'Tek tıkla navigasyon ve rota tarifi',
      'Sesli ve titreşimli anlık uyarı',
    ],
  },
  {
    id: '4',
    tagEmoji: '💬',
    tag: 'TEK DOKUNUŞLA ULAŞIM',
    tagBg: '#D1FAE5',
    tagBorder: '#A7F3D0',
    tagTextColor: '#047857',
    tagDotColor: '#059669',
    title: 'WhatsApp, Arama ve\nAcil Veteriner Bilgisi',
    subtitle:
      'Bulan kişi hiçbir uygulama indirmeden tek tıkla sizi telefonla arayabilir, WhatsApp’tan yazabilir ve varsa acil sağlık alerji notlarını görebilir.',
    photo: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=800&q=80',
    petBadgeName: 'Pamuk & Tarçın',
    collarSerial: 'TAG: #PETPIN-04',
    floatingPill: {
      icon: PhoneCall,
      title: 'Hızlı Arama & WhatsApp',
      description: 'Uygulama gerektirmeden direkt arama',
      iconBg: '#DCFCE7',
      iconColor: '#059669',
      badgeText: 'Anında İletişim',
    },
    features: [
      'Doğrudan sahibini arama butonu',
      'WhatsApp ile otomatik konum paylaşımı',
      'Alerji, kronik hastalık ve klinik notları',
    ],
  },
  {
    id: '5',
    tagEmoji: '🚨',
    tag: 'KAYIP MODU & ALARM',
    tagBg: '#FFE4E6',
    tagBorder: '#FECDD3',
    tagTextColor: '#BE123C',
    tagDotColor: '#E11D48',
    title: 'Kayıp Anında Tüm\nGüvenlik Kalkanı Açılır',
    subtitle:
      'Uygulamadan Kayıp Modunu açın; künye okutulduğu anda telefonunuz acil durum alarmı verir, haritada rotayı çizer ve bulucuya talimatları gösterir.',
    photo: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&q=80',
    petBadgeName: 'Max • Asil Alman Kurdu',
    collarSerial: 'TAG: #PETPIN-05',
    floatingPill: {
      icon: AlertTriangle,
      title: 'Acil SOS Kalkanı',
      description: 'Yüksek öncelikli kayıp alarmı',
      iconBg: '#FFE4E6',
      iconColor: '#E11D48',
      badgeText: 'Kayıp Modu',
    },
    features: [
      'Yüksek öncelikli acil durum uyarısı',
      'Bulucuya özel yönlendirme ekranı',
      'Kayıp durumunda kırmızı harita pini',
    ],
  },
  {
    id: '6',
    tagEmoji: '✨',
    tag: 'PETPIN AİLESİ',
    tagBg: '#F3E8FF',
    tagBorder: '#DDD6FE',
    tagTextColor: '#6D28D9',
    tagDotColor: '#7C3AED',
    title: 'Dostunuzun Dünyasını\nKorumaya Hazır mısınız?',
    subtitle:
      'Künyenizi oluşturun, PDF çıktısını alın veya galerinizden paylaşın. Dostunuz artık her adımda güvende.',
    photo: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=800&q=80',
    petBadgeName: 'PetPin Ailesi',
    collarSerial: 'TAG: #PETPIN-06',
    floatingPill: {
      icon: Sparkles,
      title: 'Hemen Başlayın',
      description: 'Ücretsiz, sınırsız ve 7/24 güvenli',
      iconBg: '#F3E8FF',
      iconColor: '#7C3AED',
      badgeText: 'Ömür Boyu',
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
        {/* 1. Hero Pet Photo with Floating Smart Collar Tags */}
        <View style={styles.photoContainer}>
          <Image source={{ uri: item.photo }} style={styles.petHeroImage} resizeMode="cover" />

          {/* Soft Scrim */}
          <View style={styles.photoGradientScrim} />

          {/* Luxury Collar Tag (Top-Left) */}
          <View style={styles.collarTagPill}>
            <View style={styles.collarTagRingHole}>
              <View style={[styles.collarTagRingDot, { backgroundColor: item.tagDotColor }]} />
            </View>
            <View>
              <Text style={styles.collarTagPetName}>{item.petBadgeName}</Text>
              <Text style={styles.collarTagSerial}>{item.collarSerial}</Text>
            </View>
          </View>

          {/* Floating Feature Tag Card (Bottom) */}
          <View style={styles.floatingFeatureTag}>
            <View style={[styles.floatingIconBox, { backgroundColor: item.floatingPill.iconBg }]}>
              <PillIcon size={20} color={item.floatingPill.iconColor} strokeWidth={2.4} />
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.floatingTagHeaderRow}>
                <Text style={styles.floatingTagTitle}>{item.floatingPill.title}</Text>
                <View style={[styles.miniStatusBadge, { backgroundColor: item.tagBg }]}>
                  <Text style={[styles.miniStatusBadgeText, { color: item.tagTextColor }]}>
                    {item.floatingPill.badgeText}
                  </Text>
                </View>
              </View>
              <Text style={styles.floatingTagDesc}>{item.floatingPill.description}</Text>
            </View>
          </View>
        </View>

        {/* 2. Milk-Glass Bottom Content Card */}
        <View style={styles.contentCard}>
          {/* Aesthetic Pastel Pill Tag */}
          <View
            style={[
              styles.aestheticPillTag,
              { backgroundColor: item.tagBg, borderColor: item.tagBorder },
            ]}
          >
            <Text style={styles.aestheticPillEmoji}>{item.tagEmoji}</Text>
            <Text style={[styles.aestheticPillText, { color: item.tagTextColor }]}>{item.tag}</Text>
          </View>

          {/* High-Contrast Revolut Typography */}
          <Text style={styles.slideTitle}>{item.title}</Text>
          <Text style={styles.slideSubtitle}>{item.subtitle}</Text>

          {/* Clean Checklist */}
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
    <CosmicBackground theme="pastel">
      <SafeAreaView style={styles.safeContainer} edges={['top', 'bottom', 'left', 'right']}>
        {/* Top Header with Segmented Story Bar */}
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

          {/* Brand Row & Skip */}
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

        {/* Carousel Slides */}
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

        {/* Bottom CTA Action Button */}
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
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
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

  // Hero Pet Photo Container
  photoContainer: {
    width: '100%',
    height: SCREEN_HEIGHT * 0.32,
    borderRadius: 28,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#FFFFFF',
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
    height: 95,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
  },

  // Luxury Collar Tag Badge (Top-Left)
  collarTagPill: {
    position: 'absolute',
    top: 14,
    left: 14,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    gap: 8,
    ...SHADOWS.subtle,
  },
  collarTagRingHole: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: '#0F4C5C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  collarTagRingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  collarTagPetName: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F172A',
  },
  collarTagSerial: {
    fontSize: 9,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.5,
  },

  // Floating Feature Tag Card (Bottom)
  floatingFeatureTag: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    gap: 10,
    ...SHADOWS.subtle,
  },
  floatingIconBox: {
    width: 38,
    height: 38,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatingTagHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  floatingTagTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  miniStatusBadge: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  miniStatusBadgeText: {
    fontSize: 9.5,
    fontWeight: '800',
  },
  floatingTagDesc: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },

  // Bottom Content Card (Milk-Glass)
  contentCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    borderRadius: 28,
    padding: 20,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    marginTop: 10,
    ...SHADOWS.card,
  },
  aestheticPillTag: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
    gap: 6,
  },
  aestheticPillEmoji: {
    fontSize: 11,
  },
  aestheticPillText: {
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
