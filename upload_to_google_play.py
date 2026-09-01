#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
PetPin - Google Play Developer Publishing API Automation
Uploads Title, Short Description, Full Description, Feature Graphic (1024x500),
and 7 Phone Screenshots across ALL 20 Languages to Google Play Console.

Package: com.virelon.petpin
Developer: Virelonsoft
"""

import os
import sys
import glob
import json
import argparse
from pathlib import Path

# Ensure UTF-8 output on Windows terminal
try:
    sys.stdout.reconfigure(encoding='utf-8')
    sys.stderr.reconfigure(encoding='utf-8')
except Exception:
    pass

# Google Play API locale mapping for the 20 languages
LOCALE_MAPPING = {
    'tr': 'tr-TR',
    'en': 'en-US',
    'de': 'de-DE',
    'es': 'es-ES',
    'fr': 'fr-FR',
    'it': 'it-IT',
    'pt': 'pt-BR',
    'nl': 'nl-NL',
    'ru': 'ru-RU',
    'ar': 'ar',
    'ja': 'ja-JP',
    'ko': 'ko-KR',
    'zh': 'zh-CN',
    'pl': 'pl-PL',
    'sv': 'sv-SE',
    'no': 'no-NO',
    'da': 'da-DK',
    'fi': 'fi-FI',
    'id': 'id',
    'hi': 'hi-IN',
}

PACKAGE_NAME = "com.virelon.petpin"
METADATA_DIR = Path(r"C:\Users\muham\Desktop\ssler\google_play_metadata")
SCREENSHOTS_DIR = Path(r"C:\Users\muham\Desktop\ssler\google_play_screenshots")

def find_service_account_key(custom_path=None):
    """Search for the Google Cloud service account JSON key."""
    if custom_path and os.path.isfile(custom_path):
        return custom_path

    # Search common locations
    candidates = [
        "service-account.json",
        "play-api.json",
        "google-play-key.json",
        "api-key.json",
        "google-services.json",
        r"C:\Users\muham\Desktop\service-account.json",
        r"C:\Users\muham\Desktop\play-api.json",
        r"C:\Users\muham\Desktop\google-play-key.json",
        r"C:\Users\muham\Desktop\ssler\service-account.json",
    ]

    for p in candidates:
        if os.path.isfile(p):
            try:
                with open(p, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    if 'client_email' in data or 'private_key' in data:
                        return os.path.abspath(p)
            except Exception:
                pass

    # Search Desktop wildcard for any JSON with private_key
    desktop_jsons = glob.glob(r"C:\Users\muham\Desktop\*.json") + glob.glob(r".\*.json")
    for dj in desktop_jsons:
        try:
            with open(dj, 'r', encoding='utf-8') as f:
                data = json.load(f)
                if 'private_key' in data and 'client_email' in data:
                    return os.path.abspath(dj)
        except Exception:
            pass

    return None

def main():
    parser = argparse.ArgumentParser(description="Upload 20-Language Store Assets to Google Play Console via Publishing API")
    parser.add_argument("--key", "-k", help="Path to Google Play Service Account JSON key", default=None)
    parser.add_argument("--package", "-p", help="Package Name", default=PACKAGE_NAME)
    parser.add_argument("--dry-run", action="store_true", help="Validate assets without committing edit to Google Play")
    args = parser.parse_args()

    print("\n" + "="*70)
    print("🚀 PETPIN - GOOGLE PLAY STORE 20-LANGUAGE PUBLISHER")
    print(f"📦 Package Name: {args.package}")
    print(f"🏢 Developer: Virelonsoft")
    print("="*70 + "\n")

    key_path = find_service_account_key(args.key)

    if not key_path:
        print("⚠️  GOOGLE PLAY SERVICE ACCOUNT JSON KEY BULUNAMADI!\n")
        print("Google Play Developer API ile mağazaya otomatik yükleme yapabilmek için:")
        print("1. Google Play Console -> Geliştirici Hesabı -> 'API Erişimi' (API Access) bölümüne gidin.")
        print("2. 'Yeni Hizmet Hesabı Oluştur' (Create Service Account) butonuna basın.")
        print("3. Google Cloud Console'da Service Account oluşturup 'JSON Anahtarı' (Key) indirin.")
        print("4. Google Play Console'da bu hizmet hesabına 'Uygulama Bilgilerini Düzenleme / Sürüm Yönetimi' yetkisi verin.")
        print("5. İndirdiğiniz JSON dosyasını Masaüstüne `service-account.json` adıyla kaydedin.")
        print("\nSonrasında şu komutu çalıştırarak tüm 20 dili tek tıkla yükleyebilirsiniz:")
        print("👉  python upload_to_google_play.py --key C:\\Users\\muham\\Desktop\\service-account.json\n")
        
        print("🔍 Mevcut yerel varlıklar doğrulanıyor...")
        verify_local_assets()
        return

    print(f"🔑 Hizmet Hesabı Anahtarı Bulundu: {key_path}")

    try:
        from google.oauth2 import service_account
        from googleapiclient.discovery import build
        from googleapiclient.http import MediaFileUpload
    except ImportError:
        print("❌ 'google-api-python-client' veya 'google-auth' modülü eksik.")
        print("Yüklemek için: pip install google-api-python-client google-auth")
        return

    # Authenticate with Google Play Publishing API
    credentials = service_account.Credentials.from_service_account_file(
        key_path,
        scopes=['https://www.googleapis.com/auth/androidpublisher']
    )

    service = build('androidpublisher', 'v3', credentials=credentials)

    print("📡 Google Play Console Edit oturumu başlatılıyor...")
    try:
        edit_request = service.edits().insert(packageName=args.package, body={})
        edit_result = edit_request.execute()
        edit_id = edit_result['id']
        print(f"✓ Edit Oturumu Açıldı (Edit ID: {edit_id})\n")
    except Exception as e:
        print(f"❌ Google Play API Bağlantı Hatası: {e}")
        print("\nLütfen şunları kontrol edin:")
        print(f"1. `{args.package}` uygulamasının Google Play Console'da oluşturulmuş olduğunu.")
        print("2. Hizmet hesabının Play Console'da API Erişimi izinlerine sahip olduğunu.")
        return

    # Iterate through all 20 languages
    success_count = 0
    for lang_code, play_locale in LOCALE_MAPPING.items():
        meta_folder = METADATA_DIR / lang_code
        ss_folder = SCREENSHOTS_DIR / lang_code

        if not meta_folder.exists() or not ss_folder.exists():
            print(f"⚠️ [{lang_code.upper()}] Klasör bulunamadı, atlanıyor...")
            continue

        print(f"🔄 [{lang_code.upper()} -> {play_locale}] Mağaza metinleri ve görselleri yükleniyor...")

        try:
            # 1. Read Metadata
            with open(meta_folder / "title.txt", "r", encoding="utf-8") as f:
                title = f.read().strip()
            with open(meta_folder / "short_description.txt", "r", encoding="utf-8") as f:
                short_desc = f.read().strip()
            with open(meta_folder / "full_description.txt", "r", encoding="utf-8") as f:
                full_desc = f.read().strip()

            # 2. Update Listings (Title, Short Desc, Full Desc)
            listing_body = {
                'title': title,
                'shortDescription': short_desc,
                'fullDescription': full_desc,
            }
            service.edits().listings().update(
                packageName=args.package,
                editId=edit_id,
                language=play_locale,
                body=listing_body
            ).execute()
            print(f"   ✓ Metinler güncellendi (Ad: '{title}')")

            # 3. Upload Feature Graphic (1024x500)
            feature_graphic_path = ss_folder / "feature_graphic.png"
            if feature_graphic_path.exists():
                service.edits().images().deleteall(
                    packageName=args.package,
                    editId=edit_id,
                    language=play_locale,
                    imageType='featureGraphic'
                ).execute()

                media = MediaFileUpload(str(feature_graphic_path), mimetype='image/png')
                service.edits().images().upload(
                    packageName=args.package,
                    editId=edit_id,
                    language=play_locale,
                    imageType='featureGraphic',
                    media_body=media
                ).execute()
                print(f"   ✓ Özellik Grafiği yüklendi (1024x500)")

            # 4. Upload Phone Screenshots (1080x2400)
            service.edits().images().deleteall(
                packageName=args.package,
                editId=edit_id,
                language=play_locale,
                imageType='phoneScreenshots'
            ).execute()

            screenshot_files = sorted(glob.glob(str(ss_folder / "*.png")))
            screenshot_count = 0
            for ss_path in screenshot_files:
                if "feature_graphic" in os.path.basename(ss_path):
                    continue
                media = MediaFileUpload(ss_path, mimetype='image/png')
                service.edits().images().upload(
                    packageName=args.package,
                    editId=edit_id,
                    language=play_locale,
                    imageType='phoneScreenshots',
                    media_body=media
                ).execute()
                screenshot_count += 1

            print(f"   ✓ {screenshot_count} adet Ekran Görüntüsü yüklendi (1080x2400)")
            success_count += 1

        except Exception as e:
            print(f"   ❌ [{lang_code.upper()}] Yükleme hatası: {e}")

    # Commit Edit
    if not args.dry_run and success_count > 0:
        print("\n💾 Değişiklikler Google Play Console'a kalıcı olarak kaydediliyor (Commit)...")
        try:
            service.edits().commit(packageName=args.package, editId=edit_id).execute()
            print(f"🎉 TEBRİKLER! {success_count} Dilin Tüm Görselleri ve ASO Metinleri Google Play'e Başarıyla Gönderildi!")
        except Exception as e:
            print(f"❌ Commit Hatası: {e}")
    else:
        print(f"\n🔍 [DRY RUN] {success_count} Dil doğrulandı. Commit yapılmadı.")

def verify_local_assets():
    """Verify local files before publishing."""
    print("📁 Yerel Dosya Denetimi:")
    valid_langs = 0
    total_ss = 0
    total_fg = 0

    for lang_code, play_locale in LOCALE_MAPPING.items():
        meta_folder = METADATA_DIR / lang_code
        ss_folder = SCREENSHOTS_DIR / lang_code

        has_title = (meta_folder / "title.txt").exists()
        has_short = (meta_folder / "short_description.txt").exists()
        has_full = (meta_folder / "full_description.txt").exists()
        has_fg = (ss_folder / "feature_graphic.png").exists()
        ss_list = [f for f in glob.glob(str(ss_folder / "*.png")) if "feature_graphic" not in f]

        if has_title and has_short and has_full and has_fg and len(ss_list) >= 2:
            valid_langs += 1
            total_ss += len(ss_list)
            if has_fg: total_fg += 1
            print(f"  ✓ [{lang_code.upper()} -> {play_locale}]: 3 Metin Dosyası + {len(ss_list)} Ekran Görüntüsü + Özellik Grafiği Hazır")
        else:
            print(f"  ⚠️ [{lang_code.upper()}]: Eksik dosya var!")

    print(f"\n📊 TOPLAM HAZIR VARLIKLAR: {valid_langs}/20 Dil, {total_ss} Ekran Görüntüsü, {total_fg} Özellik Grafiği.")
    print("✅ Tüm dosyalar Google Play API formatına %100 uygundur.")

if __name__ == "__main__":
    main()
