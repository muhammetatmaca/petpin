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
  Printer,
  Copy,
  ExternalLink,
  ChevronRight,
  Info,
} from 'lucide-react-native';
import { usePet } from '../context/PetContext';
import { COLORS, SHADOWS } from '../theme/colors';

interface TagScreenProps {
  onViewAlerts: () => void;
}

export const TagScreen: React.FC<TagScreenProps> = ({ onViewAlerts }) => {
  const { profile } = usePet();
  const [showPhoneToFinder, setShowPhoneToFinder] = useState(true);
  const [showWhatsAppToFinder, setShowWhatsAppToFinder] = useState(true);
  const [showMedicalNotes, setShowMedicalNotes] = useState(true);
  const [previewModalVisible, setPreviewModalVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  const tagId = profile.tagId;
  const publicWebUrl = `https://petpin.muhammetatmaca79.workers.dev/?id=${encodeURIComponent(
    tagId
  )}&name=${encodeURIComponent(profile.petName)}&owner=${encodeURIComponent(
    profile.ownerName
  )}&phone=${encodeURIComponent(
    profile.ownerPhone
  )}&wa=${encodeURIComponent(profile.ownerWhatsApp)}`;

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

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Akıllı QR Künyem</Text>
          <Text style={styles.headerSubtitle}>{profile.petName}’nin Boyun Tasması</Text>
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
              <Text style={styles.nfcBadgeText}>NFC + QR AKTİF</Text>
            </View>
            <Text style={styles.noBatteryText}>Pil Gerektirmez • Pasif</Text>
          </View>

          {/* High-Resolution QR Graphic */}
          <View style={styles.qrWrapper}>
            <Image
              source={{
                uri: `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(
                  publicWebUrl
                )}&color=0F4C5C&bgcolor=FAFAFA`,
              }}
              style={styles.qrImage}
            />
            <View style={styles.qrCenterLogo}>
              <View style={styles.centerDot} />
            </View>
          </View>

          {/* Tag ID & Copy Row */}
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
                {copied ? 'Kopyalandı' : 'Kopyala'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Finder Preview Trigger Button (Bulan Kişi Görünümünü Test Et) */}
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

        {/* How It Works Explainer Box */}
        <View style={styles.infoExplainerCard}>
          <View style={styles.infoExplainerHeader}>
            <Info size={18} color={COLORS.primary} />
            <Text style={styles.infoExplainerTitle}>Bulan Kişi Nasıl Okutur?</Text>
          </View>
          <Text style={styles.infoExplainerText}>
            Milo kaybolursa, bulan kişinin herhangi bir uygulama yüklemesine gerek yoktur. Telefonunun standart kamera uygulamasını QR koda tutması yeterlidir. Tarandığı anda konum izniyle birlikte GPS noktası doğrudan size bildirilir.
          </Text>
        </View>

        {/* Finder Privacy & Display Settings */}
        <View style={styles.settingsCard}>
          <Text style={styles.settingsSectionTitle}>
            Bulan Kişiye Gösterilecek Bilgiler
          </Text>

          {/* Setting 1: Show Phone */}
          <View style={styles.settingRow}>
            <View style={styles.settingIconWrapper}>
              <Phone size={18} color={COLORS.primary} />
            </View>
            <View style={styles.settingTextWrapper}>
              <Text style={styles.settingTitle}>Telefon Numarası</Text>
              <Text style={styles.settingDesc}>+90 (555) 234-5678 aransın</Text>
            </View>
            <Switch
              value={showPhoneToFinder}
              onValueChange={setShowPhoneToFinder}
              trackColor={{ false: '#CBD5E1', true: COLORS.primary }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.divider} />

          {/* Setting 2: Show WhatsApp */}
          <View style={styles.settingRow}>
            <View style={[styles.settingIconWrapper, { backgroundColor: '#ECFDF5' }]}>
              <MessageCircle size={18} color={COLORS.emerald} />
            </View>
            <View style={styles.settingTextWrapper}>
              <Text style={styles.settingTitle}>WhatsApp Butonu</Text>
              <Text style={styles.settingDesc}>Doğrudan mesaj ve fotoğraf alabilsin</Text>
            </View>
            <Switch
              value={showWhatsAppToFinder}
              onValueChange={setShowWhatsAppToFinder}
              trackColor={{ false: '#CBD5E1', true: COLORS.emerald }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.divider} />

          {/* Setting 3: Show Medical / Allergy */}
          <View style={styles.settingRow}>
            <View style={[styles.settingIconWrapper, { backgroundColor: COLORS.goldLight }]}>
              <AlertCircle size={18} color={COLORS.gold} />
            </View>
            <View style={styles.settingTextWrapper}>
              <Text style={styles.settingTitle}>Tıbbi Bilgi & Alerjiler</Text>
              <Text style={styles.settingDesc}>Yabancı gıda verilmemesi uyarısı</Text>
            </View>
            <Switch
              value={showMedicalNotes}
              onValueChange={setShowMedicalNotes}
              trackColor={{ false: '#CBD5E1', true: COLORS.gold }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Secondary Action: Print / Order QR */}
        <View style={styles.extraActionsRow}>
          <TouchableOpacity
            style={styles.extraActionBtn}
            activeOpacity={0.8}
            onPress={handleShareTag}
          >
            <Printer size={18} color={COLORS.primary} style={{ marginRight: 8 }} />
            <Text style={styles.extraActionBtnText}>Künyeyi Yazdır / İndir</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Finder Web Preview Modal (Bulan Kişinin Web Görünümü Simülasyonu) */}
      <Modal
        visible={previewModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setPreviewModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* Modal Header Bar simulating Mobile Browser */}
            <View style={styles.browserHeaderBar}>
              <View style={styles.browserUrlPill}>
                <Text style={styles.browserUrlText}>🔒 petpin.app/t/milo-9821</Text>
              </View>
              <TouchableOpacity
                style={styles.modalCloseBtn}
                onPress={() => setPreviewModalVisible(false)}
              >
                <Text style={styles.modalCloseBtnText}>Kapat</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              contentContainerStyle={styles.webPreviewContent}
              showsVerticalScrollIndicator={false}
            >
              {/* Web Banner: GPS Sent Confirmation */}
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

              {/* Pet Identity on Finder Web */}
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

              {/* Medical Notice */}
              {showMedicalNotes && profile.medicalNotes ? (
                <View style={styles.webAlertBox}>
                  <AlertCircle size={16} color={COLORS.coral} style={{ marginRight: 8 }} />
                  <Text style={styles.webAlertText}>
                    Önemli: {profile.medicalNotes}
                  </Text>
                </View>
              ) : null}

              {/* Action Buttons for Finder */}
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
    backgroundColor: COLORS.background,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -0.4,
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
    borderRadius: 28,
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
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.emerald,
  },
  noBatteryText: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  qrWrapper: {
    width: 190,
    height: 190,
    backgroundColor: '#FAFAFA',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.borderLight,
    marginBottom: 18,
    position: 'relative',
  },
  qrImage: {
    width: 160,
    height: 160,
  },
  qrCenterLogo: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.primary,
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
    backgroundColor: 'rgba(15, 76, 92, 0.06)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    gap: 12,
  },
  tagIdText: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.primary,
    fontFamily: 'monospace',
    letterSpacing: 0.5,
  },
  copyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  copyBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
  },
  previewFinderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 22,
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
    ...SHADOWS.glowTeal,
  },
  previewBtnTextWrapper: {
    flex: 1,
  },
  previewBtnTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  previewBtnSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 16,
  },
  infoExplainerCard: {
    backgroundColor: 'rgba(15, 76, 92, 0.05)',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(15, 76, 92, 0.1)',
    marginBottom: 16,
  },
  infoExplainerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  infoExplainerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
  },
  infoExplainerText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  settingsCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    marginBottom: 16,
    ...SHADOWS.subtle,
  },
  settingsSectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 14,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  settingIconWrapper: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(15, 76, 92, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingTextWrapper: {
    flex: 1,
    marginRight: 8,
  },
  settingTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  settingDesc: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.borderLight,
    marginVertical: 4,
  },
  extraActionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  extraActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.cardBg,
    paddingVertical: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.subtle,
  },
  extraActionBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(7, 13, 18, 0.75)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '90%',
    paddingBottom: 30,
  },
  browserHeaderBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  browserUrlPill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
  },
  browserUrlText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  modalCloseBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  modalCloseBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
  },
  webPreviewContent: {
    padding: 20,
    alignItems: 'center',
  },
  webSuccessBanner: {
    flexDirection: 'row',
    backgroundColor: '#ECFDF5',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.emeraldBorder,
    marginBottom: 18,
    width: '100%',
    alignItems: 'flex-start',
  },
  webSuccessIcon: {
    marginRight: 10,
    marginTop: 2,
  },
  webSuccessTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#065F46',
    marginBottom: 2,
  },
  webSuccessDesc: {
    fontSize: 12,
    color: '#047857',
    lineHeight: 16,
  },
  webPetCard: {
    alignItems: 'center',
    marginBottom: 16,
    width: '100%',
  },
  webPetAvatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 10,
  },
  webPetName: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  webPetBreed: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  webOwnerPill: {
    backgroundColor: 'rgba(15, 76, 92, 0.08)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
  },
  webOwnerText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  webAlertBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.coralLight,
    padding: 12,
    borderRadius: 14,
    width: '100%',
    marginBottom: 18,
    borderWidth: 1,
    borderColor: COLORS.coralBorder,
  },
  webAlertText: {
    flex: 1,
    fontSize: 12,
    color: '#991B1B',
    lineHeight: 16,
    fontWeight: '600',
  },
  webActionStack: {
    width: '100%',
    gap: 10,
  },
  webCallButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    borderRadius: 18,
    ...SHADOWS.glowTeal,
  },
  webCallButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  webWhatsAppButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ECFDF5',
    borderWidth: 1.5,
    borderColor: COLORS.emerald,
    paddingVertical: 15,
    borderRadius: 18,
  },
  webWhatsAppButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.emerald,
  },
});
