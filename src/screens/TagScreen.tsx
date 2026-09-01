import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  Share,
  Switch,
  Modal,
  Linking,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import {
  QrCode,
  Share2,
  Eye,
  ShieldCheck,
  Phone,
  MessageCircle,
  MapPin,
  CheckCircle2,
  Sparkles,
  AlertCircle,
  Copy,
  ExternalLink,
  ChevronRight,
  Info,
  RefreshCw,
  Link as LinkIcon,
  X,
  Check,
  Download,
  Printer,
  FileDown,
  FileUp,
  FolderArchive,
} from 'lucide-react-native';
import { usePet } from '../context/PetContext';
import { useTranslation } from '../i18n/LanguageContext';
import {
  saveQrImageToGallery,
  printQrCollarTag,
  exportProfileBackup,
} from '../services/qrBackupService';
import { COLORS, SHADOWS } from '../theme/colors';

interface TagScreenProps {
  onViewAlerts: () => void;
}

export const TagScreen: React.FC<TagScreenProps> = ({ onViewAlerts }) => {
  const { profile, updateProfile, regenerateTagId, pairPhysicalTag } = usePet();
  const { t } = useTranslation();
  const [showPhoneToFinder, setShowPhoneToFinder] = useState(true);
  const [showWhatsAppToFinder, setShowWhatsAppToFinder] = useState(true);
  const [showMedicalNotes, setShowMedicalNotes] = useState(true);
  const [previewModalVisible, setPreviewModalVisible] = useState(false);
  const [pairModalVisible, setPairModalVisible] = useState(false);
  const [restoreModalVisible, setRestoreModalVisible] = useState(false);
  const [customTagInput, setCustomTagInput] = useState('');
  const [restoreJsonInput, setRestoreJsonInput] = useState('');
  const [copied, setCopied] = useState(false);

  const tagId = profile.tagId;
  const publicWebUrl = `https://petpin.muhammetatmaca79.workers.dev/?id=${encodeURIComponent(
    tagId
  )}&name=${encodeURIComponent(profile.petName)}&owner=${encodeURIComponent(
    profile.ownerName
  )}&phone=${encodeURIComponent(
    profile.ownerPhone
  )}&wa=${encodeURIComponent(profile.ownerWhatsApp)}`;

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(
    publicWebUrl
  )}&color=0F4C5C&bgcolor=FAFAFA`;

  const handleShareTag = async () => {
    try {
      await Share.share({
        title: `${profile.petName}’nin PetPin Akıllı Künyesi`,
        message: `${profile.petName}'nin PetPin Akıllı Tasması için dijital künye linki: ${publicWebUrl}`,
        url: publicWebUrl,
      });
    } catch (error) {
      console.log('Share error:', error);
    }
  };

  const handleCopyLink = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenerateId = async () => {
    const newId = await regenerateTagId();
    alert(`Yeni benzersiz künye kodunuz oluşturuldu: ${newId}`);
  };

  const handlePairTag = async () => {
    if (customTagInput.trim().length > 3) {
      await pairPhysicalTag(customTagInput);
      setPairModalVisible(false);
      setCustomTagInput('');
      alert('Fiziksel künyeniz başarıyla profilinize bağlandı!');
    } else {
      alert('Lütfen geçerli bir künye seri numarası giriniz.');
    }
  };

  const handleSaveToGallery = async () => {
    await saveQrImageToGallery(qrImageUrl, profile.petName, tagId);
  };

  const handlePrintTag = async () => {
    await printQrCollarTag(profile, publicWebUrl);
  };

  const handleExportBackup = async () => {
    await exportProfileBackup(profile);
  };

  const handleRestoreBackup = async () => {
    try {
      const parsed = JSON.parse(restoreJsonInput.trim());
      if (parsed.profile || parsed.petpin_tag_id) {
        const restoredProfile = parsed.profile || parsed;
        await updateProfile(restoredProfile);
        setRestoreModalVisible(false);
        setRestoreJsonInput('');
        alert(`✅ ${restoredProfile.petName || 'Profil'} ve ${restoredProfile.tagId || 'Künye'} yedeği başarıyla geri yüklendi!`);
      } else {
        alert('Geçersiz yedek içeriği. Lütfen PetPin yedek JSON kodunu yapıştırınız.');
      }
    } catch (e) {
      alert('Yedek JSON metni çözümlenemedi. Lütfen kopyaladığınız yedek kodunu tam olarak yapıştırınız.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>{t('tags_title')}</Text>
          <Text style={styles.headerSubtitle}>{profile.petName} • {t('tags_subtitle')}</Text>
        </View>
        <TouchableOpacity
          style={styles.headerActionBtn}
          onPress={handleShareTag}
          activeOpacity={0.8}
        >
          <Share2 size={20} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Physical Smart Tag Card Showcase */}
        <View style={styles.tagShowcaseCard}>
          <View style={styles.tagTopBadgeRow}>
            <View style={styles.nfcBadge}>
              <Sparkles size={12} color={COLORS.emerald} style={{ marginRight: 4 }} />
              <Text style={styles.nfcBadgeText}>PETPIN SMART QR</Text>
            </View>
            <Text style={styles.noBatteryText}>{t('home_battery_passive')}</Text>
          </View>

          {/* High-Resolution Dynamic QR Graphic */}
          <View style={styles.qrWrapper}>
            <Image
              source={{ uri: qrImageUrl }}
              style={styles.qrImage}
            />
            <View style={styles.qrCenterLogo}>
              <View style={styles.centerDot} />
            </View>
          </View>

          {/* Unique Tag ID & Copy Row */}
          <TouchableOpacity
            style={styles.tagIdRow}
            activeOpacity={0.7}
            onPress={handleCopyLink}
          >
            <Text style={styles.tagIdText}>{tagId}</Text>
            <View style={styles.copyBadge}>
              {copied ? (
                <CheckCircle2 size={14} color={COLORS.emerald} />
              ) : (
                <Copy size={14} color={COLORS.primary} />
              )}
              <Text
                style={[
                  styles.copyBadgeText,
                  copied && { color: COLORS.emerald },
                ]}
              >
                {copied ? t('copied') : t('tags_qr_share')}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Tag Quick Actions: Download Image & Print Tag */}
          <View style={styles.quickExportRow}>
            <TouchableOpacity
              style={styles.quickExportBtn}
              activeOpacity={0.8}
              onPress={handleSaveToGallery}
            >
              <Download size={16} color={COLORS.primary} style={{ marginRight: 6 }} />
              <Text style={styles.quickExportBtnText}>Galeriye Kaydet</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickExportBtn}
              activeOpacity={0.8}
              onPress={handlePrintTag}
            >
              <Printer size={16} color={COLORS.primary} style={{ marginRight: 6 }} />
              <Text style={styles.quickExportBtnText}>{t('tags_export_pdf')}</Text>
            </TouchableOpacity>
          </View>

          {/* Tag ID Actions: Regenerate or Pair Physical Collar */}
          <View style={styles.tagActionsRow}>
            <TouchableOpacity
              style={styles.tagActionBtn}
              activeOpacity={0.8}
              onPress={handleRegenerateId}
            >
              <RefreshCw size={14} color={COLORS.primary} style={{ marginRight: 6 }} />
              <Text style={styles.tagActionBtnText}>Yeni ID Üret</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tagActionBtn, { backgroundColor: 'rgba(15, 76, 92, 0.08)' }]}
              activeOpacity={0.8}
              onPress={() => {
                setCustomTagInput(tagId);
                setPairModalVisible(true);
              }}
            >
              <LinkIcon size={14} color={COLORS.primary} style={{ marginRight: 6 }} />
              <Text style={styles.tagActionBtnText}>Fiziksel Künye Eşle</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Backup & Restore Tools Card (Yedekleme & Geri Yükleme) */}
        <View style={styles.backupCard}>
          <View style={styles.backupHeaderRow}>
            <FolderArchive size={18} color={COLORS.primary} />
            <Text style={styles.backupTitle}>Künye & Profil Yedekleme</Text>
          </View>
          <Text style={styles.backupSubtitle}>
            Uygulamayı silseniz bile QR kodunuz ve ayarlarınız kaybolmaz. Yedeğinizi telefonunuza indirebilir veya yedekten geri yükleyebilirsiniz.
          </Text>

          <View style={styles.backupBtnGroup}>
            <TouchableOpacity
              style={styles.backupBtn}
              activeOpacity={0.8}
              onPress={handleExportBackup}
            >
              <FileDown size={16} color={COLORS.primary} style={{ marginRight: 6 }} />
              <Text style={styles.backupBtnText}>Yedek Al (İndir / Paylaş)</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.backupBtn, { backgroundColor: 'rgba(15, 76, 92, 0.06)' }]}
              activeOpacity={0.8}
              onPress={() => setRestoreModalVisible(true)}
            >
              <FileUp size={16} color={COLORS.primary} style={{ marginRight: 6 }} />
              <Text style={styles.backupBtnText}>Yedekten Yükle</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Finder Preview Trigger Button */}
        <TouchableOpacity
          style={styles.previewFinderButton}
          activeOpacity={0.88}
          onPress={() => setPreviewModalVisible(true)}
        >
          <View style={styles.previewBtnIconBadge}>
            <Eye size={20} color="#FFFFFF" />
          </View>
          <View style={styles.previewBtnTextWrapper}>
            <Text style={styles.previewBtnTitle}>
              Bulan Kişi Ne Görür? (Önizle)
            </Text>
            <Text style={styles.previewBtnSubtitle}>
              Hayvanı bulan kişinin telefon kamerasında açılan web sayfasını gör
            </Text>
          </View>
          <ChevronRight size={20} color={COLORS.primary} />
        </TouchableOpacity>

        {/* Finder Privacy & Display Settings */}
        <View style={styles.settingsCard}>
          <Text style={styles.settingsSectionTitle}>
            Bulan Kişiye Gösterilecek Bilgiler
          </Text>

          {/* Setting 1: Show Phone */}
          <View style={styles.settingRow}>
            <View style={styles.settingTextGroup}>
              <Text style={styles.settingLabel}>Telefon Numarasını Göster</Text>
              <Text style={styles.settingDesc}>
                Bulan kişi tek tıkla doğrudan sizi telefonla arayabilir
              </Text>
            </View>
            <Switch
              value={showPhoneToFinder}
              onValueChange={setShowPhoneToFinder}
              trackColor={{ false: '#CBD5E1', true: COLORS.primary }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.settingDivider} />

          {/* Setting 2: Show WhatsApp */}
          <View style={styles.settingRow}>
            <View style={styles.settingTextGroup}>
              <Text style={styles.settingLabel}>WhatsApp Butonunu Göster</Text>
              <Text style={styles.settingDesc}>
                Bulan kişi anında fotoğraf ve konum mesajı atabilir
              </Text>
            </View>
            <Switch
              value={showWhatsAppToFinder}
              onValueChange={setShowWhatsAppToFinder}
              trackColor={{ false: '#CBD5E1', true: COLORS.emerald }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.settingDivider} />

          {/* Setting 3: Show Medical Info */}
          <View style={styles.settingRow}>
            <View style={styles.settingTextGroup}>
              <Text style={styles.settingLabel}>Alerji & Sağlık Notunu Göster</Text>
              <Text style={styles.settingDesc}>
                Önemli beslenme veya ilaç uyarılarını ekranda belirtir
              </Text>
            </View>
            <Switch
              value={showMedicalNotes}
              onValueChange={setShowMedicalNotes}
              trackColor={{ false: '#CBD5E1', true: COLORS.coral }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>
      </ScrollView>

      {/* Restore from Backup Modal */}
      <Modal
        visible={restoreModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setRestoreModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.pairModalCard}>
            <View style={styles.pairModalHeader}>
              <Text style={styles.pairModalTitle}>Yedekten Geri Yükle</Text>
              <TouchableOpacity
                style={styles.pairCloseBtn}
                onPress={() => setRestoreModalVisible(false)}
              >
                <X size={20} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.pairModalDesc}>
              Daha önce aldığınız PetPin yedek dosyasının (JSON) metnini buraya yapıştırarak künye kodunuzu ve profilinizi anında geri yükleyin.
            </Text>

            <View style={styles.pairInputContainer}>
              <TextInput
                style={[styles.pairInput, { height: 110, textAlignVertical: 'top', fontSize: 13 }]}
                value={restoreJsonInput}
                onChangeText={setRestoreJsonInput}
                placeholder='{"petpin_tag_id": "PETPIN-TR-...", "profile": {...}}'
                placeholderTextColor="#94A3B8"
                multiline={true}
              />
            </View>

            <TouchableOpacity
              style={styles.pairSubmitBtn}
              activeOpacity={0.88}
              onPress={handleRestoreBackup}
            >
              <Check size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={styles.pairSubmitBtnText}>Yedeği Yükle & Kurtar</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Pair Physical Tag Modal */}
      <Modal
        visible={pairModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setPairModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.pairModalCard}>
            <View style={styles.pairModalHeader}>
              <Text style={styles.pairModalTitle}>Fiziksel Künyeyi Eşle</Text>
              <TouchableOpacity
                style={styles.pairCloseBtn}
                onPress={() => setPairModalVisible(false)}
              >
                <X size={20} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.pairModalDesc}>
              Satın aldığınız metal veya silikon PetPin künyesinin arkasında yazan benzersiz seri kodunu giriniz.
            </Text>

            <View style={styles.pairInputContainer}>
              <TextInput
                style={styles.pairInput}
                value={customTagInput}
                onChangeText={setCustomTagInput}
                placeholder="Örn: PETPIN-TR-8F3A29"
                placeholderTextColor="#94A3B8"
                autoCapitalize="characters"
              />
            </View>

            <TouchableOpacity
              style={styles.pairSubmitBtn}
              activeOpacity={0.88}
              onPress={handlePairTag}
            >
              <Check size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={styles.pairSubmitBtnText}>Künyeyi Eşleştir</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Live Finder Web Browser Simulation Modal */}
      <Modal
        visible={previewModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setPreviewModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.browserModalContainer}>
            <View style={styles.browserHeader}>
              <View style={styles.browserUrlPill}>
                <ShieldCheck size={14} color={COLORS.emerald} style={{ marginRight: 6 }} />
                <Text style={styles.browserUrlText} numberOfLines={1}>
                  petpin.muhammetatmaca79.workers.dev/?id={tagId}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.browserCloseButton}
                onPress={() => setPreviewModalVisible(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.browserCloseText}>Kapat</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              contentContainerStyle={styles.webPreviewContent}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.webSuccessBanner}>
                <View style={styles.webSuccessIcon}>
                  <CheckCircle2 size={24} color={COLORS.emerald} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.webSuccessTitle}>
                    Konumunuz Sahibine İletildi!
                  </Text>
                  <Text style={styles.webSuccessDesc}>
                    Bu sayfayı açtığınızda {profile.petName}’nin sahibine anlık konumunuz SMS ve bildirim ile gönderildi.
                  </Text>
                </View>
              </View>

              <View style={styles.webPetCard}>
                <Image
                  source={{ uri: profile.petPhoto }}
                  style={styles.webPetAvatar}
                />
                <Text style={styles.webPetName}>{profile.petName}</Text>
                <Text style={styles.webPetBreed}>
                  {profile.petBreed} • {profile.petAge}
                </Text>

                <View style={styles.webOwnerPill}>
                  <Text style={styles.webOwnerText}>Sahibi: {profile.ownerName}</Text>
                </View>
              </View>

              {showMedicalNotes && profile.medicalNotes ? (
                <View style={styles.webAlertBox}>
                  <AlertCircle size={16} color={COLORS.coral} style={{ marginRight: 8 }} />
                  <Text style={styles.webAlertText}>
                    Önemli: {profile.medicalNotes}
                  </Text>
                </View>
              ) : null}

              <View style={styles.webActionStack}>
                {showPhoneToFinder && profile.ownerPhone ? (
                  <TouchableOpacity
                    style={styles.webCallButton}
                    onPress={() =>
                      Linking.openURL(`tel:${profile.ownerPhone.replace(/\s+/g, '')}`)
                    }
                  >
                    <Phone size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
                    <Text style={styles.webCallButtonText}>Sahibi Hemen Ara</Text>
                  </TouchableOpacity>
                ) : null}

                {showWhatsAppToFinder && profile.ownerWhatsApp ? (
                  <TouchableOpacity
                    style={styles.webWhatsAppButton}
                    onPress={() => {
                      const cleanPhone = profile.ownerWhatsApp.replace(/[^0-9]/g, '');
                      Linking.openURL(
                        `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                          `Merhaba, ${profile.petName} adlı evcil hayvanınızı buldum.`
                        )}`
                      );
                    }}
                  >
                    <MessageCircle
                      size={18}
                      color={COLORS.emerald}
                      style={{ marginRight: 8 }}
                    />
                    <Text style={styles.webWhatsAppButtonText}>
                      WhatsApp ile Yaz & Foto Gönder
                    </Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            </ScrollView>
          </View>
        </View>
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
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '500',
    marginTop: 2,
  },
  headerActionBtn: {
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
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 130,
  },
  tagShowcaseCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 32,
    padding: 22,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    marginBottom: 16,
    ...SHADOWS.card,
  },
  tagTopBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 18,
  },
  nfcBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.emeraldLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.emeraldBorder,
  },
  nfcBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.emerald,
    letterSpacing: 0.5,
  },
  noBatteryText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  qrWrapper: {
    position: 'relative',
    width: 210,
    height: 210,
    borderRadius: 24,
    backgroundColor: '#FAFAFA',
    padding: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(15, 76, 92, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    ...SHADOWS.subtle,
  },
  qrImage: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  qrCenterLogo: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.subtle,
  },
  centerDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: COLORS.primary,
  },
  tagIdRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 10,
    marginBottom: 12,
  },
  tagIdText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.primary,
    fontFamily: 'monospace',
    letterSpacing: 0.5,
  },
  copyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  copyBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
  },
  quickExportRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
    marginBottom: 10,
  },
  quickExportBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(15, 76, 92, 0.07)',
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(15, 76, 92, 0.1)',
  },
  quickExportBtnText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: COLORS.primary,
  },
  tagActionsRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  tagActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
    paddingVertical: 10,
    borderRadius: 14,
  },
  tagActionBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  backupCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    marginBottom: 16,
    ...SHADOWS.subtle,
  },
  backupHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  backupTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  backupSubtitle: {
    fontSize: 11.5,
    color: COLORS.textSecondary,
    lineHeight: 16,
    marginBottom: 14,
  },
  backupBtnGroup: {
    flexDirection: 'row',
    gap: 10,
  },
  backupBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
    paddingVertical: 11,
    borderRadius: 14,
  },
  backupBtnText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: COLORS.primary,
  },
  previewFinderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBg,
    borderRadius: 24,
    padding: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(15, 76, 92, 0.15)',
    marginBottom: 16,
    ...SHADOWS.subtle,
  },
  previewBtnIconBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  previewBtnTextWrapper: {
    flex: 1,
  },
  previewBtnTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: 2,
  },
  previewBtnSubtitle: {
    fontSize: 11,
    color: COLORS.textSecondary,
    lineHeight: 15,
  },
  settingsCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.subtle,
  },
  settingsSectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  settingTextGroup: {
    flex: 1,
    marginRight: 12,
  },
  settingLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  settingDesc: {
    fontSize: 11,
    color: COLORS.textSecondary,
    lineHeight: 15,
  },
  settingDivider: {
    height: 1,
    backgroundColor: COLORS.borderLight,
    marginVertical: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(7, 13, 18, 0.75)',
    justifyContent: 'flex-end',
  },
  pairModalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingBottom: 36,
  },
  pairModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  pairModalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  pairCloseBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pairModalDesc: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginBottom: 18,
  },
  pairInputContainer: {
    marginBottom: 18,
  },
  pairInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.primary,
  },
  pairSubmitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 20,
    ...SHADOWS.glowTeal,
  },
  pairSubmitBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  browserModalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '90%',
    paddingBottom: 24,
  },
  browserHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    backgroundColor: '#F8FAFC',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  browserUrlPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  browserUrlText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  browserCloseButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  browserCloseText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },
  webPreviewContent: {
    padding: 20,
  },
  webSuccessBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.emeraldBorder,
    marginBottom: 16,
  },
  webSuccessIcon: {
    marginRight: 12,
  },
  webSuccessTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#065F46',
    marginBottom: 2,
  },
  webSuccessDesc: {
    fontSize: 11,
    color: '#047857',
    lineHeight: 16,
  },
  webPetCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 22,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  webPetAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    marginBottom: 10,
  },
  webPetName: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  webPetBreed: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
    marginBottom: 10,
  },
  webOwnerPill: {
    backgroundColor: 'rgba(15, 76, 92, 0.08)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
  },
  webOwnerText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
  },
  webAlertBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.coralLight,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.coralBorder,
    marginBottom: 16,
  },
  webAlertText: {
    flex: 1,
    fontSize: 11,
    color: COLORS.coral,
    fontWeight: '600',
    lineHeight: 15,
  },
  webActionStack: {
    gap: 10,
  },
  webCallButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 18,
    ...SHADOWS.glowTeal,
  },
  webCallButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  webWhatsAppButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: COLORS.emerald,
    paddingVertical: 14,
    borderRadius: 18,
  },
  webWhatsAppButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.emerald,
  },
});
