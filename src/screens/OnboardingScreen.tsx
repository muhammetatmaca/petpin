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
import { useTranslation } from '../i18n/LanguageContext';
import { TranslationSchema } from '../i18n/translations';
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

function getPastelSlides(t: (key: keyof TranslationSchema) => string): RevolutOnboardingSlide[] {
  return [
    {
      id: '1',
      tagEmoji: '🏷️',
      tag: t('onboarding_s1_tag'),
      tagBg: '#DCFCE7',
      tagBorder: '#86EFAC',
      tagTextColor: '#047857',
      tagDotColor: '#10B981',
      title: t('onboarding_s1_title'),
      subtitle: t('onboarding_s1_sub'),
      photo: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80',
      petBadgeName: 'Milo • Golden Retriever',
      collarSerial: 'TAG: #PETPIN-01',
      floatingPill: {
        icon: QrCode,
        title: t('tags_title'),
        description: t('onboarding_s1_pill'),
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
      tag: t('onboarding_s2_tag'),
      tagBg: '#FEF3C7',
      tagBorder: '#FDE68A',
      tagTextColor: '#B45309',
      tagDotColor: '#F59E0B',
      title: t('onboarding_s2_title'),
      subtitle: t('onboarding_s2_sub'),
      photo: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80',
      petBadgeName: 'Luna • British Shorthair',
      collarSerial: 'TAG: #PETPIN-02',
      floatingPill: {
        icon: Zap,
        title: t('home_battery_passive'),
        description: t('onboarding_s2_pill'),
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
      tag: t('onboarding_s3_tag'),
      tagBg: '#E0F2FE',
      tagBorder: '#BAE6FD',
      tagTextColor: '#0369A1',
      tagDotColor: '#0284C7',
      title: t('onboarding_s3_title'),
      subtitle: t('onboarding_s3_sub'),
      photo: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80',
      petBadgeName: 'Baron • French Bulldog',
      collarSerial: 'TAG: #PETPIN-03',
      floatingPill: {
        icon: MapPin,
        title: t('home_live_radar'),
        description: t('onboarding_s3_pill'),
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
      tag: t('onboarding_s4_tag'),
      tagBg: '#D1FAE5',
      tagBorder: '#A7F3D0',
      tagTextColor: '#047857',
      tagDotColor: '#059669',
      title: t('onboarding_s4_title'),
      subtitle: t('onboarding_s4_sub'),
      photo: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=800&q=80',
      petBadgeName: 'Pamuk & Tarçın',
      collarSerial: 'TAG: #PETPIN-04',
      floatingPill: {
        icon: PhoneCall,
        title: t('home_call_owner'),
        description: t('onboarding_s4_pill'),
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
      tag: t('onboarding_s5_tag'),
      tagBg: '#FFE4E6',
      tagBorder: '#FECDD3',
      tagTextColor: '#BE123C',
      tagDotColor: '#E11D48',
      title: t('onboarding_s5_title'),
      subtitle: t('onboarding_s5_sub'),
      photo: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&q=80',
      petBadgeName: 'Max • German Shepherd',
      collarSerial: 'TAG: #PETPIN-05',
      floatingPill: {
        icon: AlertTriangle,
        title: t('alert_urgent_title'),
        description: t('onboarding_s5_pill'),
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
      tag: t('onboarding_s6_tag'),
      tagBg: '#F3E8FF',
      tagBorder: '#DDD6FE',
      tagTextColor: '#6D28D9',
      tagDotColor: '#7C3AED',
      title: t('onboarding_s6_title'),
      subtitle: t('onboarding_s6_sub'),
      photo: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=800&q=80',
      petBadgeName: 'PetPin Family',
      collarSerial: 'TAG: #PETPIN-06',
      floatingPill: {
        icon: Sparkles,
        title: t('get_started'),
        description: t('onboarding_s6_pill'),
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
}

interface OnboardingScreenProps {
  onComplete: () => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const slides = getPastelSlides(t);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / SCREEN_WIDTH);
    if (index !== currentIndex && index >= 0 && index < slides.length) {
      setCurrentIndex(index);
      try {
        Vibration.vibrate(10);
      } catch {
        // fallback
      }
    }
  };

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
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

  const isLastSlide = currentIndex === slides.length - 1;

  const renderSlide = ({ item }: { item: RevolutOnboardingSlide }) => {
    const PillIcon = item.floatingPill.icon;
    return (
      <View style={styles.slideContainer}>
        {/* Soft Pastel Revolut-Style Glassmorphism Card */}
        <View style={styles.glassCard}>
          {/* Tag Category Pill */}
          <View
            style={[
              styles.tagPill,
              {
                backgroundColor: item.tagBg,
                borderColor: item.tagBorder,
              },
            ]}
          >
            <View
              style={[
                styles.tagDot,
                { backgroundColor: item.tagDotColor },
              ]}
            />
            <Text style={styles.tagEmoji}>{item.tagEmoji}</Text>
            <Text
              style={[
                styles.tagPillText,
                { color: item.tagTextColor },
              ]}
            >
              {item.tag}
            </Text>
          </View>

          {/* High Impact Title */}
          <Text style={styles.titleText}>{item.title}</Text>

          {/* Subtitle */}
          <Text style={styles.subtitleText}>{item.subtitle}</Text>

          {/* Real High-Resolution Pet Photography Frame */}
          <View style={styles.photoShowcaseFrame}>
            <Image
              source={{ uri: item.photo }}
              style={styles.petPhotoImage}
              resizeMode="cover"
            />
            <View style={styles.petPhotoGradientOverlay} />

            {/* Smart Collar Tag Badge Overlay */}
            <View style={styles.collarBadgeOverlay}>
              <View style={styles.collarBadgeIconBox}>
                <Tag size={13} color="#0F4C5C" />
              </View>
              <View>
                <Text style={styles.collarBadgeName}>{item.petBadgeName}</Text>
                <Text style={styles.collarBadgeSerial}>{item.collarSerial}</Text>
              </View>
            </View>
          </View>

          {/* Revolut Floating Spec Card */}
          <View style={styles.floatingSpecCard}>
            <View
              style={[
                styles.specIconBox,
                { backgroundColor: item.floatingPill.iconBg },
              ]}
            >
              <PillIcon size={18} color={item.floatingPill.iconColor} />
            </View>
            <View style={styles.specTextGroup}>
              <Text style={styles.specTitle}>{item.floatingPill.title}</Text>
              <Text style={styles.specDesc}>
                {item.floatingPill.description}
              </Text>
            </View>
            <View style={styles.specBadgeRight}>
              <Text style={styles.specBadgeRightText}>
                {item.floatingPill.badgeText}
              </Text>
            </View>
          </View>

          {/* 3 Value Proposition Bullets */}
          <View style={styles.featuresList}>
            {item.features.map((feat, idx) => (
              <View key={idx} style={styles.featureItem}>
                <View style={styles.featureCheckCircle}>
                  <Check size={11} color="#10B981" strokeWidth={3} />
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
    <View style={styles.container}>
      {/* Official Originkit Cosmic BG (Pastel Light Aurora Theme) */}
      <CosmicBackground theme="pastel" />

      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        {/* Top Header: Revolut Story Progress Segments & Skip */}
        <View style={styles.topHeader}>
          <View style={styles.segmentsRow}>
            {slides.map((_, idx) => {
              const isPassed = idx < currentIndex;
              const isCurrent = idx === currentIndex;
              return (
                <View key={idx} style={styles.segmentTrack}>
                  <View
                    style={[
                      styles.segmentFill,
                      isPassed && styles.segmentFillCompleted,
                      isCurrent && styles.segmentFillActive,
                    ]}
                  />
                </View>
              );
            })}
          </View>

          <TouchableOpacity
            style={styles.skipButton}
            onPress={handleSkip}
            activeOpacity={0.7}
          >
            <Text style={styles.skipButtonText}>{t('skip')}</Text>
          </TouchableOpacity>
        </View>

        {/* Carousel FlatList */}
        <FlatList
          ref={flatListRef}
          data={slides}
          renderItem={renderSlide}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          style={styles.flatList}
          contentContainerStyle={{ alignItems: 'center' }}
        />

        {/* Bottom CTA Action Bar */}
        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={styles.primaryCtaBtn}
            onPress={handleNext}
            activeOpacity={0.9}
          >
            <Text style={styles.primaryCtaText}>
              {isLastSlide ? t('get_started') : t('next')}
            </Text>
            <View style={styles.primaryCtaIconCircle}>
              <ArrowRight size={18} color="#0F4C5C" strokeWidth={2.5} />
            </View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF7F2',
  },
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topHeader: {
    paddingHorizontal: 22,
    paddingTop: 8,
    paddingBottom: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  segmentsRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginRight: 14,
  },
  segmentTrack: {
    flex: 1,
    height: 3.5,
    backgroundColor: 'rgba(15, 23, 42, 0.08)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  segmentFill: {
    width: '0%',
    height: '100%',
    backgroundColor: 'transparent',
    borderRadius: 2,
  },
  segmentFillCompleted: {
    width: '100%',
    backgroundColor: '#0F4C5C',
  },
  segmentFillActive: {
    width: '100%',
    backgroundColor: '#10B981',
  },
  skipButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.06)',
  },
  skipButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  flatList: {
    flex: 1,
  },
  slideContainer: {
    width: SCREEN_WIDTH,
    paddingHorizontal: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  glassCard: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 1)',
    ...SHADOWS.card,
  },
  tagPill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4.5,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
    gap: 5,
  },
  tagDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  tagEmoji: {
    fontSize: 11,
  },
  tagPillText: {
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  titleText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
    lineHeight: 28,
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  subtitleText: {
    fontSize: 12.5,
    color: '#475569',
    lineHeight: 18,
    fontWeight: '500',
    marginBottom: 12,
  },
  photoShowcaseFrame: {
    width: '100%',
    height: 145,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 12,
    backgroundColor: '#F1F5F9',
  },
  petPhotoImage: {
    width: '100%',
    height: '100%',
  },
  petPhotoGradientOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(15, 23, 42, 0.15)',
  },
  collarBadgeOverlay: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 14,
    gap: 7,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
  },
  collarBadgeIconBox: {
    width: 22,
    height: 22,
    borderRadius: 8,
    backgroundColor: 'rgba(15, 76, 92, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  collarBadgeName: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 13,
  },
  collarBadgeSerial: {
    fontSize: 9,
    fontWeight: '700',
    color: '#0F4C5C',
    lineHeight: 11,
  },
  floatingSpecCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.05)',
  },
  specIconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  specTextGroup: {
    flex: 1,
  },
  specTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 1,
  },
  specDesc: {
    fontSize: 10.5,
    color: '#64748B',
    fontWeight: '500',
  },
  specBadgeRight: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 3,
    paddingHorizontal: 7,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.08)',
  },
  specBadgeRightText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#0F4C5C',
  },
  featuresList: {
    gap: 6,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureCheckCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#334155',
  },
  bottomBar: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 8,
  },
  primaryCtaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F4C5C',
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 20,
    gap: 10,
    ...SHADOWS.glowTeal,
  },
  primaryCtaText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  primaryCtaIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
