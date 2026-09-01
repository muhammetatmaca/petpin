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
  Switch,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
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
} from 'lucide-react-native';
import { usePet } from '../context/PetContext';
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
  const [editModalVisible, setEditModalVisible] = useState(false);

  // Edit form state
  const [formPetName, setFormPetName] = useState(profile.petName);
  const [formPetBreed, setFormPetBreed] = useState(profile.petBreed);
  const [formPetAge, setFormPetAge] = useState(profile.petAge);
  const [formOwnerName, setFormOwnerName] = useState(profile.ownerName);
  const [formOwnerPhone, setFormOwnerPhone] = useState(profile.ownerPhone);
  const [formOwnerWhatsApp, setFormOwnerWhatsApp] = useState(profile.ownerWhatsApp);
  const [formVetInfo, setFormVetInfo] = useState(profile.vetInfo);
  const [formMedicalNotes, setFormMedicalNotes] = useState(profile.medicalNotes);

  // Animated pulse for status badge
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
      petBreed: formPetBreed.trim() || 'Irk Belirtilmedi',
      petAge: formPetAge.trim() || 'Yaş Belirtilmedi',
      ownerName: formOwnerName.trim() || 'Evcil Hayvan Sahibi',
      ownerPhone: formOwnerPhone.trim(),
      ownerWhatsApp: formOwnerWhatsApp.trim(),
      vetInfo: formVetInfo.trim(),
      medicalNotes: formMedicalNotes.trim(),
    });
    setEditModalVisible(false);
  };

  const handlePhoneCall = () => {
    if (profile.ownerPhone) {
      Linking.openURL(`tel:${profile.ownerPhone.replace(/\s+/g, '')}`);
    }
  };

  const handleWhatsApp = () => {
    if (profile.ownerWhatsApp) {
      const cleanPhone = profile.ownerWhatsApp.replace(/[^0-9]/g, '');
      Linking.openURL(
        `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
          `Merhaba, ${profile.petName} adlı evcil hayvanınız hakkında yazıyorum.`
        )}`
      );
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
        <Text style={styles.headerTitle}>Künye & Profil</Text>
        <TouchableOpacity
          style={styles.editHeaderBtn}
          onPress={handleOpenEditModal}
          activeOpacity={0.8}
        >
          <Edit3 size={18} color={COLORS.primary} style={{ marginRight: 4 }} />
          <Text style={styles.editHeaderBtnText}>Düzenle</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Large Circular Pet Avatar Hero with Photo Picker */}
        <View style={styles.avatarSection}>
          <TouchableOpacity
            style={styles.avatarGlowRing}
            activeOpacity={0.85}
            onPress={pickPetPhoto}
          >
            <Image
              source={{ uri: profile.petPhoto }}
              style={styles.avatarImage}
            />
            <View
              style={[
                styles.cameraBadge,
                profile.isLostMode && { backgroundColor: COLORS.coral },
              ]}
            >
              <Camera size={16} color="#FFFFFF" />
            </View>
          </TouchableOpacity>

          <Text style={styles.petName}>{profile.petName}</Text>
          <Text style={styles.petSubtitle}>
            {profile.petBreed} • {profile.petAge}
          </Text>

          {/* Dynamic Animated Status Badge */}
          <View
            style={[
              styles.statusBadgeContainer,
              profile.isLostMode && styles.statusBadgeContainerLost,
            ]}
          >
            <View style={styles.pulseContainer}>
              <Animated.View
                style={[
                  styles.pulseDotOutline,
                  profile.isLostMode && { backgroundColor: 'rgba(255, 107, 107, 0.4)' },
                  { transform: [{ scale: pulseAnim }] },
                ]}
              />
              <View
                style={[
                  styles.pulseDotCore,
                  profile.isLostMode && { backgroundColor: COLORS.coral },
                ]}
              />
            </View>
            <Text
              style={[
                styles.statusBadgeText,
                profile.isLostMode && { color: COLORS.coral },
              ]}
            >
              {profile.isLostMode ? 'Kayıp Alarmı Aktif' : 'Güvende'}
            </Text>
          </View>
        </View>

        {/* Lost Mode Card with Switch */}
        <View
          style={[
            styles.lostModeCard,
            profile.isLostMode && styles.lostModeCardActive,
          ]}
        >
          <View style={styles.lostModeIconWrapper}>
            <ShieldAlert
              size={22}
              color={profile.isLostMode ? COLORS.coral : COLORS.primary}
            />
          </View>
          <View style={styles.lostModeTextContainer}>
            <Text style={styles.lostModeTitle}>Kayıp Alarmı Modu</Text>
            <Text style={styles.lostModeDesc}>
              Açıldığında QR'ı okutan kişiye acil durum mesajı ve iletişim butonları öncelikli gösterilir.
            </Text>
          </View>
          <Switch
            value={profile.isLostMode}
            onValueChange={toggleLostMode}
            trackColor={{ false: '#CBD5E1', true: COLORS.coral }}
            thumbColor="#FFFFFF"
          />
        </View>

        {/* Structured Data Rows / Information Card */}
        <View style={styles.infoCard}>
          {/* Owner Row */}
          <TouchableOpacity
            style={styles.dataRow}
            activeOpacity={0.7}
            onPress={handleOpenEditModal}
          >
            <View style={styles.iconContainer}>
              <User size={20} color={COLORS.primary} />
            </View>
            <View style={styles.dataTextContainer}>
              <Text style={styles.dataLabel}>Evcil Hayvan Sahibi</Text>
              <Text style={styles.dataValue}>{profile.ownerName}</Text>
            </View>
            <Edit3 size={16} color={COLORS.textMuted} />
          </TouchableOpacity>

          <View style={styles.divider} />

          {/* Phone Row */}
          <TouchableOpacity
            style={styles.dataRow}
            activeOpacity={0.7}
            onPress={handlePhoneCall}
          >
            <View style={styles.iconContainer}>
              <Phone size={20} color={COLORS.primary} />
            </View>
            <View style={styles.dataTextContainer}>
              <Text style={styles.dataLabel}>Telefon Numarası</Text>
              <Text style={[styles.dataValue, { color: COLORS.primary }]}>
                {profile.ownerPhone || 'Belirtilmedi'}
              </Text>
            </View>
            <View style={styles.callBadge}>
              <Text style={styles.callBadgeText}>ARA</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.divider} />

          {/* WhatsApp Row */}
          <TouchableOpacity
            style={styles.dataRow}
            activeOpacity={0.7}
            onPress={handleWhatsApp}
          >
            <View style={[styles.iconContainer, { backgroundColor: '#ECFDF5' }]}>
              <MessageCircle size={20} color={COLORS.emerald} />
            </View>
            <View style={styles.dataTextContainer}>
              <Text style={styles.dataLabel}>WhatsApp İletişimi</Text>
              <Text style={[styles.dataValue, { color: COLORS.emerald }]}>
                {profile.ownerWhatsApp || 'Belirtilmedi'}
              </Text>
            </View>
            <View style={[styles.callBadge, { backgroundColor: '#ECFDF5' }]}>
              <Text style={[styles.callBadgeText, { color: COLORS.emerald }]}>
                YAZ
              </Text>
            </View>
          </TouchableOpacity>

          <View style={styles.divider} />

          {/* Veterinarian Row */}
          <TouchableOpacity
            style={styles.dataRow}
            activeOpacity={0.7}
            onPress={handleOpenEditModal}
          >
            <View style={styles.iconContainer}>
              <Stethoscope size={20} color={COLORS.primary} />
            </View>
            <View style={styles.dataTextContainer}>
              <Text style={styles.dataLabel}>Kayıtlı Veteriner</Text>
              <Text style={styles.dataValue}>
                {profile.vetInfo || 'Kayıtlı veteriner ekleyin'}
              </Text>
            </View>
            <Edit3 size={16} color={COLORS.textMuted} />
          </TouchableOpacity>

          <View style={styles.divider} />

          {/* QR Tag Type & ID */}
          <TouchableOpacity
            style={styles.dataRow}
            activeOpacity={0.7}
            onPress={onTagPress}
          >
            <View style={styles.iconContainer}>
              <QrCode size={20} color={COLORS.primary} />
            </View>
            <View style={styles.dataTextContainer}>
              <Text style={styles.dataLabel}>Pasif Akıllı Künye ID (Yönet)</Text>
              <Text style={styles.dataCode}>{profile.tagId}</Text>
            </View>
            <View style={styles.callBadge}>
              <Text style={styles.callBadgeText}>KÜNYE</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.divider} />

          {/* Medical Notes / Allergies */}
          <TouchableOpacity
            style={styles.dataRow}
            activeOpacity={0.7}
            onPress={handleOpenEditModal}
          >
            <View style={[styles.iconContainer, { backgroundColor: COLORS.goldLight }]}>
              <AlertCircle size={20} color={COLORS.gold} />
            </View>
            <View style={styles.dataTextContainer}>
              <Text style={styles.dataLabel}>Tıbbi Bilgi & Alerjiler</Text>
              <Text style={styles.dataSubValue}>
                {profile.medicalNotes || 'Özel bir sağlık notu eklenmedi.'}
              </Text>
            </View>
            <Edit3 size={16} color={COLORS.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Quick Edit Profile Button */}
        <TouchableOpacity
          style={styles.editProfileCta}
          activeOpacity={0.88}
          onPress={handleOpenEditModal}
        >
          <Edit3 size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text style={styles.editProfileCtaText}>Bilgileri Düzenle & Güncelle</Text>
        </TouchableOpacity>

        {/* Replay Onboarding Flow Button */}
        {onShowOnboarding && (
          <TouchableOpacity
            style={styles.replayOnboardingBtn}
            activeOpacity={0.8}
            onPress={onShowOnboarding}
          >
            <Sparkles size={16} color={COLORS.primary} style={{ marginRight: 6 }} />
            <Text style={styles.replayOnboardingBtnText}>Uygulama Tanıtımını İzle (Cosmic Onboarding)</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Edit Profile Full Modal */}
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
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderTitle}>Profili Düzenle</Text>
              <TouchableOpacity
                style={styles.modalCloseIconBtn}
                onPress={() => setEditModalVisible(false)}
              >
                <X size={20} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>

            <ScrollView
              contentContainerStyle={styles.modalFormContent}
              showsVerticalScrollIndicator={false}
            >
              {/* Pet Photo Changer inside Modal */}
              <TouchableOpacity
                style={styles.modalPhotoChangeRow}
                onPress={pickPetPhoto}
                activeOpacity={0.8}
              >
                <Image
                  source={{ uri: profile.petPhoto }}
                  style={styles.modalThumb}
                />
                <View style={{ flex: 1, marginLeft: 14 }}>
                  <Text style={styles.modalPhotoTitle}>Fotoğrafı Değiştir</Text>
                  <Text style={styles.modalPhotoDesc}>
                    Galerinizden kendi evcil hayvanınızın fotoğrafını seçin
                  </Text>
                </View>
                <Camera size={20} color={COLORS.primary} />
              </TouchableOpacity>

              {/* Input: Pet Name */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Evcil Hayvan Adı</Text>
                <TextInput
                  style={styles.inputField}
                  value={formPetName}
                  onChangeText={setFormPetName}
                  placeholder="Örn: Paşa, Karabaş, Pamuk"
                  placeholderTextColor="#94A3B8"
                />
              </View>

              {/* Input: Breed */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Irkı / Cinsi</Text>
                <TextInput
                  style={styles.inputField}
                  value={formPetBreed}
                  onChangeText={setFormPetBreed}
                  placeholder="Örn: Golden Retriever, Tekir Kedi"
                  placeholderTextColor="#94A3B8"
                />
              </View>

              {/* Input: Age */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Yaşı</Text>
                <TextInput
                  style={styles.inputField}
                  value={formPetAge}
                  onChangeText={setFormPetAge}
                  placeholder="Örn: 2 Yaşında, 6 Aylık"
                  placeholderTextColor="#94A3B8"
                />
              </View>

              {/* Input: Owner Name */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Sahip Adı Soyadı</Text>
                <TextInput
                  style={styles.inputField}
                  value={formOwnerName}
                  onChangeText={setFormOwnerName}
                  placeholder="Adınız Soyadınız"
                  placeholderTextColor="#94A3B8"
                />
              </View>

              {/* Input: Phone */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Telefon Numarası</Text>
                <TextInput
                  style={styles.inputField}
                  value={formOwnerPhone}
                  onChangeText={setFormOwnerPhone}
                  placeholder="+90 5XX XXX XX XX"
                  placeholderTextColor="#94A3B8"
                  keyboardType="phone-pad"
                />
              </View>

              {/* Input: WhatsApp */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>WhatsApp Numarası</Text>
                <TextInput
                  style={styles.inputField}
                  value={formOwnerWhatsApp}
                  onChangeText={setFormOwnerWhatsApp}
                  placeholder="+90 5XX XXX XX XX"
                  placeholderTextColor="#94A3B8"
                  keyboardType="phone-pad"
                />
              </View>

              {/* Input: Vet */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Veteriner Bilgisi & Klinik</Text>
                <TextInput
                  style={styles.inputField}
                  value={formVetInfo}
                  onChangeText={setFormVetInfo}
                  placeholder="Örn: Dr. Ahmet • Merkez Veteriner"
                  placeholderTextColor="#94A3B8"
                />
              </View>

              {/* Input: Medical Notes */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Tıbbi Not & Alerjiler</Text>
                <TextInput
                  style={[styles.inputField, { height: 80, textAlignVertical: 'top' }]}
                  value={formMedicalNotes}
                  onChangeText={setFormMedicalNotes}
                  placeholder="Örn: Tavuk alerjisi var. Özel ilaç kullanıyor."
                  placeholderTextColor="#94A3B8"
                  multiline={true}
                />
              </View>

              {/* Save Button */}
              <TouchableOpacity
                style={styles.saveModalBtn}
                activeOpacity={0.88}
                onPress={handleSaveProfile}
              >
                <Save size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
                <Text style={styles.saveModalBtnText}>Kaydet & Güncelle</Text>
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
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: COLORS.background,
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
  editHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBg,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.subtle,
  },
  editHeaderBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 130,
  },
  avatarSection: {
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 20,
  },
  avatarGlowRing: {
    position: 'relative',
    padding: 6,
    borderRadius: 72,
    backgroundColor: 'rgba(0, 196, 159, 0.12)',
    marginBottom: 14,
  },
  avatarImage: {
    width: 114,
    height: 114,
    borderRadius: 57,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    padding: 6,
    borderWidth: 2.5,
    borderColor: '#FFFFFF',
    ...SHADOWS.subtle,
  },
  petName: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  petSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500',
    marginBottom: 12,
  },
  statusBadgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.emeraldLight,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.emeraldBorder,
    gap: 8,
  },
  statusBadgeContainerLost: {
    backgroundColor: COLORS.coralLight,
    borderColor: COLORS.coralBorder,
  },
  pulseContainer: {
    width: 12,
    height: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseDotOutline: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: 'rgba(16, 185, 129, 0.4)',
  },
  pulseDotCore: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.emerald,
  },
  statusBadgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.emerald,
  },
  lostModeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBg,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    marginBottom: 16,
    ...SHADOWS.subtle,
  },
  lostModeCardActive: {
    backgroundColor: COLORS.coralLight,
    borderColor: COLORS.coralBorder,
  },
  lostModeIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(15, 76, 92, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  lostModeTextContainer: {
    flex: 1,
    marginRight: 10,
  },
  lostModeTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  lostModeDesc: {
    fontSize: 11,
    color: COLORS.textSecondary,
    lineHeight: 15,
  },
  infoCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.card,
    marginBottom: 16,
  },
  dataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(15, 76, 92, 0.07)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  dataTextContainer: {
    flex: 1,
  },
  dataLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
    marginBottom: 2,
  },
  dataValue: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  dataSubValue: {
    fontSize: 13,
    color: COLORS.textPrimary,
    lineHeight: 18,
    fontWeight: '500',
  },
  dataCode: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
    fontFamily: 'monospace',
    letterSpacing: 0.5,
  },
  callBadge: {
    backgroundColor: 'rgba(15, 76, 92, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  callBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.primary,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.borderLight,
    marginHorizontal: 4,
  },
  editProfileCta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 20,
    ...SHADOWS.glowTeal,
    marginBottom: 12,
  },
  editProfileCtaText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  replayOnboardingBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(15, 76, 92, 0.07)',
    paddingVertical: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(15, 76, 92, 0.15)',
    marginBottom: 24,
  },
  replayOnboardingBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(7, 13, 18, 0.75)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '90%',
    paddingBottom: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalHeaderTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  modalCloseIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalFormContent: {
    padding: 20,
  },
  modalPhotoChangeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 18,
  },
  modalThumb: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  modalPhotoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  modalPhotoDesc: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  inputGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginBottom: 6,
  },
  inputField: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  saveModalBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 20,
    ...SHADOWS.glowTeal,
    marginTop: 8,
    marginBottom: 20,
  },
  saveModalBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
