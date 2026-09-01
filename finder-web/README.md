# PetPin • Cloudflare Pages Bulan Kişi Web Sayfası 🐾

Bu klasör (`finder-web`), tasmanın üzerindeki QR kod okutulduğunda hayvanı bulan kişinin telefonunda açılacak olan **resmi mobil web sayfası ve Cloudflare Edge API fonksiyonudur**.

---

## 🚀 Cloudflare Pages'e 60 Saniyede Yükleme (Ücretsiz)

### 1. Adım: GitHub Reponuza Gönderin
Projenizi GitHub'a push edin (`git add .`, `git commit -m "Add finder web"`, `git push`).

### 2. Adım: Cloudflare Dashboard'a Girin
1. [Cloudflare Dashboard](https://dash.cloudflare.com)'a ücretsiz giriş yapın.
2. Soldaki menüden **Workers & Pages** ➔ **Create application** ➔ **Pages** sekmesini seçin.
3. **Connect to Git** (GitHub hesabınızı bağlayın) butonuna basın.
4. Bu reponuzu seçin.

### 3. Adım: Ayarları Yapın & Deploy Edin
* **Project Name**: `petpin-tag` (veya istediğiniz bir isim)
* **Production Branch**: `main` (veya `master`)
* **Build Configuration**:
  - **Framework preset**: `None`
  - **Build output directory**: `finder-web`
* **Save and Deploy** butonuna basın!

🎉 **Tebrikler!** 15 saniye içinde Cloudflare size ücretsiz ve canlı bir link verecektir:  
👉 **`https://petpin-tag.pages.dev`**

---

## 📲 Nasıl Çalışır?

1. **Bulan Kişi QR'ı Okutur**:
   - `https://petpin-tag.pages.dev/?id=PETPIN-QR-9821-TR&name=Milo` linki açılır.
2. **GPS Otomatik Alınır**:
   - Tarayıcı konum izni ister.
   - İzin verildiği an `navigator.geolocation` ile koordinatlar alınır ve OpenStreetMap ile sokak adına dönüştürülür.
3. **Cloudflare Edge API'ye İletilir**:
   - `/api/scan` fonksiyonuna konum, saat ve cihaz bilgisi anında postalanır.
4. **Sahip Aranır**:
   - Bulan kişi sayfadaki tek bir tıkla sahibini telefonla arayabilir veya WhatsApp üzerinden fotoğraf gönderebilir.
