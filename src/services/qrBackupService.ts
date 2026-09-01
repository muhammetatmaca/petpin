import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import * as Print from 'expo-print';
import { PetProfile } from '../context/PetContext';

/**
 * Downloads and saves the high-resolution QR Code image to the phone's Photo Gallery
 */
export async function saveQrImageToGallery(
  qrImageUrl: string,
  petName: string,
  tagId: string
): Promise<boolean> {
  try {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      // Fallback to native sharing if media library permission is denied
      if (await Sharing.isAvailableAsync()) {
        const fileUri = `${FileSystem.cacheDirectory}${tagId}-qr.png`;
        const downloadRes = await FileSystem.downloadAsync(qrImageUrl, fileUri);
        await Sharing.shareAsync(downloadRes.uri);
        return true;
      }
      alert('Fotoğrafı galeriye kaydedebilmek için galeri izni gereklidir.');
      return false;
    }

    const fileUri = `${FileSystem.cacheDirectory}${tagId}-qr.png`;
    const downloadRes = await FileSystem.downloadAsync(qrImageUrl, fileUri);

    const asset = await MediaLibrary.createAssetAsync(downloadRes.uri);
    await MediaLibrary.createAlbumAsync('PetPin Künyelerim', asset, false);

    alert(`✅ ${petName}’nin QR Künyesi telefonunuzun Fotoğraflar galerisine başarıyla kaydedildi!`);
    return true;
  } catch (error) {
    console.log('Error saving QR image:', error);
    alert('Fotoğraf kaydedilirken bir hata oluştu.');
    return false;
  }
}

/**
 * Generates and opens a printable A4 Collar Tag Sheet via Expo Print
 */
export async function printQrCollarTag(
  profile: PetProfile,
  publicWebUrl: string
): Promise<void> {
  try {
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
      publicWebUrl
    )}&color=0F4C5C&bgcolor=FFFFFF`;

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>PetPin • ${profile.petName} Akıllı Tasma Künyesi</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      text-align: center;
      padding: 30px;
      color: #0F172A;
    }
    .print-sheet {
      max-width: 480px;
      margin: 0 auto;
      border: 2px dashed #94A3B8;
      border-radius: 24px;
      padding: 24px;
      position: relative;
    }
    .cut-label {
      position: absolute;
      top: -12px;
      left: 20px;
      background: #FFFFFF;
      padding: 0 8px;
      font-size: 11px;
      font-weight: bold;
      color: #64748B;
    }
    .header-badge {
      font-size: 14px;
      font-weight: bold;
      color: #0F4C5C;
      margin-bottom: 4px;
    }
    .pet-name {
      font-size: 26px;
      font-weight: bold;
      color: #0F172A;
      margin: 4px 0;
    }
    .pet-meta {
      font-size: 13px;
      color: #64748B;
      margin-bottom: 16px;
    }
    .qr-box {
      width: 180px;
      height: 180px;
      margin: 0 auto 16px auto;
      border: 1px solid #E2E8F0;
      border-radius: 16px;
      padding: 8px;
    }
    .qr-img {
      width: 100%;
      height: 100%;
    }
    .tag-id {
      font-family: monospace;
      font-size: 14px;
      font-weight: bold;
      color: #0F4C5C;
      background: #F1F5F9;
      padding: 4px 12px;
      border-radius: 12px;
      display: inline-block;
      margin-bottom: 14px;
    }
    .contact-row {
      font-size: 13px;
      font-weight: bold;
      color: #0F172A;
      margin-bottom: 6px;
    }
    .medical-warning {
      background: #FFF1F2;
      border: 1px solid #FECDD3;
      color: #BE123C;
      font-size: 11px;
      padding: 8px;
      border-radius: 10px;
      margin-top: 12px;
    }
    .instructions {
      font-size: 10px;
      color: #94A3B8;
      margin-top: 16px;
      border-top: 1px solid #E2E8F0;
      padding-top: 10px;
    }
  </style>
</head>
<body>
  <div class="print-sheet">
    <div class="cut-label">✂️ Kesim Çizgisi (Tasmaya Yapıştırın veya Takın)</div>
    <div class="header-badge">🐾 PetPin Akıllı Künye</div>
    <div class="pet-name">${profile.petName}</div>
    <div class="pet-meta">${profile.petBreed} • ${profile.petAge}</div>
    
    <div class="qr-box">
      <img src="${qrApiUrl}" class="qr-img" />
    </div>

    <div class="tag-id">${profile.tagId}</div>
    
    <div class="contact-row">📞 Sahip: ${profile.ownerName} (${profile.ownerPhone || 'Belirtilmedi'})</div>
    
    ${
      profile.medicalNotes
        ? `<div class="medical-warning">⚠️ Sağlık Notu: ${profile.medicalNotes}</div>`
        : ''
    }

    <div class="instructions">
      Bulan kişi herhangi bir telefon kamerasıyla bu QR kodu okuttuğunda sahibine anlık GPS konumu gönderilir.
    </div>
  </div>
</body>
</html>
    `;

    await Print.printAsync({
      html: htmlContent,
    });
  } catch (error) {
    console.log('Error printing QR tag:', error);
    alert('Yazdırma işlemi başlatılamadı.');
  }
}

/**
 * Exports pet profile and unique tag backup as a shareable/saved JSON file
 */
export async function exportProfileBackup(profile: PetProfile): Promise<void> {
  try {
    const backupData = {
      version: '1.0',
      created_at: new Date().toISOString(),
      petpin_tag_id: profile.tagId,
      profile: {
        petName: profile.petName,
        petBreed: profile.petBreed,
        petAge: profile.petAge,
        ownerName: profile.ownerName,
        ownerPhone: profile.ownerPhone,
        ownerWhatsApp: profile.ownerWhatsApp,
        vetInfo: profile.vetInfo,
        medicalNotes: profile.medicalNotes,
        tagId: profile.tagId,
        isLostMode: profile.isLostMode,
      },
    };

    const fileName = `petpin-backup-${profile.petName.toLowerCase()}-${profile.tagId}.json`;
    const fileUri = `${FileSystem.cacheDirectory}${fileName}`;

    await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(backupData, null, 2));

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri, {
        mimeType: 'application/json',
        dialogTitle: `${profile.petName} PetPin Künye Yedeği`,
        UTI: 'public.json',
      });
    } else {
      alert(`Yedek dosyası hazırlandı:\n${JSON.stringify(backupData, null, 2)}`);
    }
  } catch (error) {
    console.log('Error exporting backup:', error);
    alert('Yedek alınırken bir hata oluştu.');
  }
}
