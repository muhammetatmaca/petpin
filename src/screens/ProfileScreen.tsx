import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  Animated,
  Linking,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  FlatList,
} from 'react-native';
import {
  ChevronLeft,
  Phone,
  User,
  Stethoscope,
  QrCode,
  Share2,
  CheckCircle2,
  MessageCircle,
  AlertCircle,
  ShieldAlert,
  Sparkles,
  Edit3,
  Camera,
  Save,
  X,
  Globe,
  FileText,
  ShieldCheck,
  ChevronRight,
  Heart,
} from 'lucide-react-native';
import { usePet } from '../context/PetContext';
import { useTranslation } from '../i18n/LanguageContext';
import { SupportedLanguage, LanguageInfo } from '../i18n/translations';
import { COLORS, SHADOWS } from '../theme/colors';

interface ProfileScreenProps {
  onBackPress: () => void;
  onTagPress: () => void;
  onShowOnboarding?: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  onBackPress,
  onTagPress,
  onShowOnboarding,
}) => {
  const { profile, updateProfile, pickPetPhoto, toggleLostMode } = usePet();
  const { language, setLanguage, t, supportedLanguages } = useTranslation();

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [langModalVisible, setLangModalVisible] = useState(false);

  // Edit form state
  const [formPetName, setFormPetName] = useState(profile.petName);
  const [formPetBreed, setFormPetBreed] = useState(profile.petBreed);
  const [formPetAge, setFormPetAge] = useState(profile.petAge);
  const [formOwnerName, setFormOwnerName] = useState(profile.ownerName);
  const [formOwnerPhone, setFormOwnerPhone] = useState(profile.ownerPhone);
  const [formOwnerWhatsApp, setFormOwnerWhatsApp] = useState(profile.ownerWhatsApp);
  const [formVetInfo, setFormVetInfo] = useState(profile.vetInfo);
  const [formMedicalNotes, setFormMedicalNotes] = useState(profile.medicalNotes);

  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.25,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim]);

  const handleOpenEditModal = () => {
    setFormPetName(profile.petName);
    setFormPetBreed(profile.petBreed);
    setFormPetAge(profile.petAge);
    setFormOwnerName(profile.ownerName);
    setFormOwnerPhone(profile.ownerPhone);
    setFormOwnerWhatsApp(profile.ownerWhatsApp);
    setFormVetInfo(profile.vetInfo);
    setFormMedicalNotes(profile.medicalNotes);
    setEditModalVisible(true);
  };

  const handleSaveProfile = async () => {
    await updateProfile({
      petName: formPetName.trim() || 'Evcil Hayvan',
      petBreed: formPetBreed.trim() || 'Belirtilmedi',
      petAge: formPetAge.trim() || 'Belirtilmedi',
      ownerName: formOwnerName.trim() || 'Sahip',
      ownerPhone: formOwnerPhone.trim(),
      ownerWhatsApp: formOwnerWhatsApp.trim(),
      vetInfo: formVetInfo.trim(),
      medicalNotes: formMedicalNotes.trim(),
    });
    setEditModalVisible(false);
  };

  const currentLangInfo = supportedLanguages.find((l) => l.code === language) || supportedLanguages[0];

  const handleSelectLanguage = async (code: SupportedLanguage) => {
    await setLanguage(code);
    setLangModalVisible(false);
  };

  const handleOpenPrivacy = () => {
    Linking.openURL('https://virelonsoft.com/petpin/privacy.html').catch(() => {
      // fallback
    });
  };

  return (
    <View style={styles.container}>
      {/* Top Floating App Bar */}
      <View style={styles.topHeader}>
        <TouchableOpacity style={styles.backButton} activeOpacity={0.7} onPress={onBackPress}>
          <ChevronLeft size={22} color={COLORS.textPrimary} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>{t('profile_title')}</Text>

        {/* Language Switch Button in Header */}
        <TouchableOpacity
          style={styles.langHeaderBtn}
          activeOpacity={0.8}
          onPress={() => setLangModalVisible(true)}
        >
          <Text style={styles.langHeaderFlag}>{currentLangInfo.flag}</Text>
          <Text style={styles.langHeaderCode}>{currentLangInfo.code.toUpperCase()}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Hero Pet Avatar & Quick Badge */}
        <View style={styles.heroCard}>
          <View style={styles.avatarRow}>
            <View style={styles.avatarBorderContainer}>
              <Image source={{ uri: profile.petPhoto }} style={styles.petAvatarImage} />
              <TouchableOpacity
                style={styles.cameraIconBadge}
                activeOpacity={0.8}
                onPress={pickPetPhoto}
              >
                <Camera size={14} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <View style={styles.heroPetMeta}>
              <View style={styles.petNameAndTagRow}>
                <Text style={styles.petNameText}>{profile.petName}</Text>
                <View style={styles.smartTagPill}>
                  <Text style={styles.smartTagPillText}>#PETPIN-01</Text>
                </View>
              </View>

              <Text style={styles.petBreedText}>
                {profile.petBreed} • {profile.petAge}
              </Text>

              {/* Status Indicator */}
              <View style={styles.statusIndicatorRow}>
                <Animated.View
                  style={[
                    styles.statusPulseDot,
                    {
                      backgroundColor: profile.isLostMode ? COLORS.coral : COLORS.emerald,
                      transform: [{ scale: pulseAnim }],
                    },
                  ]}
                />
                <Text
                  style={[
                    styles.statusIndicatorText,
                    { color: profile.isLostMode ? COLORS.coral : COLORS.emerald },
                  ]}
                >
                  {profile.isLostMode ? t('home_status_lost') : t('home_status_safe')}
                </Text>
              </View>
            </View>
          </View>

          {/* Lost Mode Toggle Button */}
          <TouchableOpacity
            style={[
              styles.lostModeCta,
              profile.isLostMode ? styles.lostModeCtaActive : styles.lostModeCtaInactive,
            ]}
            activeOpacity={0.85}
            onPress={toggleLostMode}
          >
            <ShieldAlert size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={styles.lostModeCtaText}>
              {profile.isLostMode ? t('tags_lost_toggle_on') : t('tags_lost_toggle_off')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Language Selection Card */}
        <View style={styles.cardSection}>
          <Text style={styles.sectionHeading}>{t('profile_language')}</Text>

          <TouchableOpacity
            style={styles.settingRow}
            activeOpacity={0.7}
            onPress={() => setLangModalVisible(true)}
          >
            <View style={[styles.iconBox, { backgroundColor: '#E0F2FE' }]}>
              <Globe size={20} color="#0284C7" />
            </View>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingLabel}>{t('profile_language')}</Text>
              <Text style={styles.settingValue}>
                {currentLangInfo.flag} {currentLangInfo.nativeName} ({currentLangInfo.name})
              </Text>
            </View>
            <ChevronRight size={18} color="#94A3B8" />
          </TouchableOpacity>
        </View>

        {/* Pet Details & Medical Card */}
        <View style={styles.cardSection}>
          <Text style={styles.sectionHeading}>{t('tags_health_info')}</Text>

          <TouchableOpacity style={styles.settingRow} activeOpacity={0.7} onPress={handleOpenEditModal}>
            <View style={[styles.iconBox, { backgroundColor: '#DCFCE7' }]}>
              <User size={20} color="#059669" />
            </View>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingLabel}>{t('tags_pet_name')}</Text>
              <Text style={styles.settingValue}>{profile.ownerName}</Text>
            </View>
            <Edit3 size={16} color="#94A3B8" />
          </TouchableOpacity>

          <View style={styles.rowDivider} />

          <TouchableOpacity style={styles.settingRow} activeOpacity={0.7} onPress={handleOpenEditModal}>
            <View style={[styles.iconBox, { backgroundColor: '#FEF3C7' }]}>
              <Phone size={20} color="#D97706" />
            </View>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingLabel}>{t('tags_owner_phone')}</Text>
              <Text style={styles.settingValue}>
                {profile.ownerPhone || 'Belirtilmedi'}
              </Text>
            </View>
            <Edit3 size={16} color="#94A3B8" />
          </TouchableOpacity>

          <View style={styles.rowDivider} />

          <TouchableOpacity style={styles.settingRow} activeOpacity={0.7} onPress={handleOpenEditModal}>
            <View style={[styles.iconBox, { backgroundColor: '#F3E8FF' }]}>
              <Stethoscope size={20} color="#7C3AED" />
            </View>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingLabel}>{t('tags_vet_contact')}</Text>
              <Text style={styles.settingValue}>
                {profile.vetInfo || 'Veteriner bilgisi eklenmedi.'}
              </Text>
            </View>
            <Edit3 size={16} color="#94A3B8" />
          </TouchableOpacity>

          <View style={styles.rowDivider} />

          <TouchableOpacity style={styles.settingRow} activeOpacity={0.7} onPress={handleOpenEditModal}>
            <View style={[styles.iconBox, { backgroundColor: '#FFE4E6' }]}>
              <AlertCircle size={20} color="#E11D48" />
            </View>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingLabel}>{t('tags_allergies')}</Text>
              <Text style={styles.settingValue}>
                {profile.medicalNotes || 'Özel bir sağlık notu eklenmedi.'}
              </Text>
            </View>
            <Edit3 size={16} color="#94A3B8" />
          </TouchableOpacity>
        </View>

        {/* Quick Edit CTA Button */}
        <TouchableOpacity
          style={styles.primaryActionBtn}
          activeOpacity={0.88}
          onPress={handleOpenEditModal}
        >
          <Edit3 size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text style={styles.primaryActionBtnText}>{t('tags_edit_profile')}</Text>
        </TouchableOpacity>

        {/* Replay Onboarding Flow */}
        {onShowOnboarding && (
          <TouchableOpacity
            style={styles.secondaryActionBtn}
            activeOpacity={0.8}
            onPress={onShowOnboarding}
          >
            <Sparkles size={16} color="#0F4C5C" style={{ marginRight: 6 }} />
            <Text style={styles.secondaryActionBtnText}>{t('profile_replay_intro')}</Text>
          </TouchableOpacity>
        )}

        {/* Privacy Policy & Compliance */}
        <View style={styles.footerSection}>
          <TouchableOpacity
            style={styles.privacyLinkRow}
            activeOpacity={0.7}
            onPress={handleOpenPrivacy}
          >
            <FileText size={16} color="#64748B" style={{ marginRight: 6 }} />
            <Text style={styles.privacyLinkText}>{t('profile_privacy_policy')}</Text>
          </TouchableOpacity>

          <Text style={styles.footerBrandText}>
            {t('app_name')} • {t('profile_version')} 2.4.0 • {t('profile_company')}
          </Text>
          <Text style={styles.footerComplianceText}>{t('profile_data_protection')}</Text>
        </View>
      </ScrollView>

      {/* 20-Language Selector Modal */}
      <Modal
        visible={langModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setLangModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.langModalCard}>
            <View style={styles.modalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Globe size={22} color="#0F4C5C" />
                <Text style={styles.modalHeaderTitle}>{t('profile_select_lang')}</Text>
              </View>
              <TouchableOpacity
                style={styles.modalCloseBtn}
                onPress={() => setLangModalVisible(false)}
              >
                <X size={20} color="#0F172A" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={supportedLanguages}
              keyExtractor={(item) => item.code}
              contentContainerStyle={{ paddingBottom: 20 }}
              renderItem={({ item }: { item: LanguageInfo }) => {
                const isSelected = item.code === language;
                return (
                  <TouchableOpacity
                    style={[styles.langListItem, isSelected && styles.langListItemActive]}
                    activeOpacity={0.7}
                    onPress={() => handleSelectLanguage(item.code)}
                  >
                    <Text style={styles.langListFlag}>{item.flag}</Text>
                    <View style={{ flex: 1, marginLeft: 14 }}>
                      <Text style={[styles.langListNative, isSelected && styles.langListTextActive]}>
                        {item.nativeName}
                      </Text>
                      <Text style={styles.langListEnglish}>{item.name}</Text>
                    </View>
                    {isSelected && <CheckCircle2 size={20} color="#10B981" />}
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </View>
      </Modal>

      {/* Edit Profile Modal */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderTitle}>{t('tags_edit_profile')}</Text>
              <TouchableOpacity
                style={styles.modalCloseBtn}
                onPress={() => setEditModalVisible(false)}
              >
                <X size={20} color="#0F172A" />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.modalFormContent} showsVerticalScrollIndicator={false}>
              <TouchableOpacity
                style={styles.modalPhotoChangeRow}
                onPress={pickPetPhoto}
                activeOpacity={0.8}
              >
                <Image source={{ uri: profile.petPhoto }} style={styles.modalThumb} />
                <View style={{ flex: 1, marginLeft: 14 }}>
                  <Text style={styles.modalPhotoTitle}>Fotoğrafı Değiştir</Text>
                  <Text style={styles.modalPhotoDesc}>Galerinizden fotoğraf seçin</Text>
                </View>
                <Camera size={20} color="#0F4C5C" />
              </TouchableOpacity>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>{t('tags_pet_name')}</Text>
                <TextInput
                  style={styles.inputField}
                  value={formPetName}
                  onChangeText={setFormPetName}
                  placeholderTextColor="#94A3B8"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>{t('tags_pet_breed')}</Text>
                <TextInput
                  style={styles.inputField}
                  value={formPetBreed}
                  onChangeText={setFormPetBreed}
                  placeholderTextColor="#94A3B8"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>{t('tags_pet_age')}</Text>
                <TextInput
                  style={styles.inputField}
                  value={formPetAge}
                  onChangeText={setFormPetAge}
                  placeholderTextColor="#94A3B8"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Sahip Adı Soyadı</Text>
                <TextInput
                  style={styles.inputField}
                  value={formOwnerName}
                  onChangeText={setFormOwnerName}
                  placeholderTextColor="#94A3B8"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>{t('tags_owner_phone')}</Text>
                <TextInput
                  style={styles.inputField}
                  value={formOwnerPhone}
                  onChangeText={setFormOwnerPhone}
                  keyboardType="phone-pad"
                  placeholderTextColor="#94A3B8"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>{t('tags_vet_contact')}</Text>
                <TextInput
                  style={styles.inputField}
                  value={formVetInfo}
                  onChangeText={setFormVetInfo}
                  placeholderTextColor="#94A3B8"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>{t('tags_allergies')}</Text>
                <TextInput
                  style={[styles.inputField, { height: 80, textAlignVertical: 'top' }]}
                  value={formMedicalNotes}
                  onChangeText={setFormMedicalNotes}
                  multiline
                  placeholderTextColor="#94A3B8"
                />
              </View>

              <TouchableOpacity
                style={styles.modalSaveBtn}
                activeOpacity={0.88}
                onPress={handleSaveProfile}
              >
                <Save size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
                <Text style={styles.modalSaveBtnText}>{t('save')}</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF7F2',
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.08)',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  langHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.08)',
    gap: 6,
  },
  langHeaderFlag: {
    fontSize: 15,
  },
  langHeaderCode: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F4C5C',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 120,
    paddingTop: 10,
  },
  heroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    marginBottom: 16,
    ...SHADOWS.card,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarBorderContainer: {
    position: 'relative',
  },
  petAvatarImage: {
    width: 68,
    height: 68,
    borderRadius: 22,
    backgroundColor: '#E2E8F0',
  },
  cameraIconBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#0F4C5C',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  heroPetMeta: {
    flex: 1,
    marginLeft: 16,
  },
  petNameAndTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  petNameText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.4,
  },
  smartTagPill: {
    backgroundColor: '#DCFCE7',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  smartTagPillText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#047857',
  },
  petBreedText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
    marginBottom: 6,
  },
  statusIndicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusPulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusIndicatorText: {
    fontSize: 12,
    fontWeight: '800',
  },
  lostModeCta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 18,
    marginTop: 16,
  },
  lostModeCtaInactive: {
    backgroundColor: '#EF4444',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
  },
  lostModeCtaActive: {
    backgroundColor: '#0F4C5C',
  },
  lostModeCtaText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  cardSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    marginBottom: 16,
    ...SHADOWS.card,
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 12,
    letterSpacing: -0.2,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingTextContainer: {
    flex: 1,
    marginLeft: 14,
  },
  settingLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 2,
  },
  settingValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  rowDivider: {
    height: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.06)',
    marginVertical: 10,
  },
  primaryActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F4C5C',
    paddingVertical: 16,
    borderRadius: 20,
    marginBottom: 12,
    ...SHADOWS.glowTeal,
  },
  primaryActionBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  secondaryActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(15, 76, 92, 0.15)',
    marginBottom: 24,
  },
  secondaryActionBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F4C5C',
  },
  footerSection: {
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 20,
    gap: 6,
  },
  privacyLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  privacyLinkText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#0F4C5C',
  },
  footerBrandText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
  },
  footerComplianceText: {
    fontSize: 10.5,
    color: '#94A3B8',
  },

  // Language Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'flex-end',
  },
  langModalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    maxHeight: '75%',
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(15, 23, 42, 0.08)',
  },
  modalHeaderTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
  },
  modalCloseBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  langListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginBottom: 6,
  },
  langListItemActive: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#86EFAC',
  },
  langListFlag: {
    fontSize: 24,
  },
  langListNative: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  langListTextActive: {
    color: '#047857',
  },
  langListEnglish: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },

  // Edit Form Modal Styles
  modalFormContent: {
    paddingBottom: 24,
  },
  modalPhotoChangeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 18,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  modalThumb: {
    width: 50,
    height: 50,
    borderRadius: 16,
  },
  modalPhotoTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  modalPhotoDesc: {
    fontSize: 11,
    color: '#64748B',
  },
  inputGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
  },
  inputField: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  modalSaveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F4C5C',
    paddingVertical: 16,
    borderRadius: 20,
    marginTop: 10,
    ...SHADOWS.glowTeal,
  },
  modalSaveBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
