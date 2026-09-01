import os
import sys
import glob
from PIL import Image, ImageDraw, ImageFont, ImageFilter

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

BANNER_WIDTH = 1024
BANNER_HEIGHT = 500

SRC_DIR = r"C:\Users\muham\Desktop\ssler"
OUT_DIR = os.path.join(SRC_DIR, "google_play_screenshots")
os.makedirs(OUT_DIR, exist_ok=True)

# Feature Graphic Translations for 20 Languages
FEATURE_GRAPHIC_DATA = {
    'tr': {
        'tag': 'YENİ NESİL EVCİL HAYVAN GÜVENLİĞİ',
        'title': 'Dostunuz Asla Kaybolmaz',
        'subtitle': 'Sıfır Şarjlı Akıllı QR Künye & Canlı GPS Takip Ekosistemi',
        'badge1': '⚡ Sıfır Şarj & Pasif Güvenlik',
        'badge2': '📍 Canlı GPS Telemetrisi',
        'badge3': '💬 Tek Tıkla Arama & WhatsApp',
    },
    'en': {
        'tag': 'NEXT-GEN PET SAFETY ECOSYSTEM',
        'title': 'Never Lose Your Best Friend',
        'subtitle': 'Zero-Battery Smart QR Collar Tag & Live GPS Tracking',
        'badge1': '⚡ Zero Battery Required',
        'badge2': '📍 Real-Time GPS Telemetry',
        'badge3': '💬 1-Tap Call & WhatsApp',
    },
    'de': {
        'tag': 'MODERNE HAUSTIERSICHERHEIT',
        'title': 'Ihr Liebling Geht Nie Verloren',
        'subtitle': 'Smarte QR-Marke ohne Akku & Live-GPS-Standort',
        'badge1': '⚡ Kein Akku & Wartungsfrei',
        'badge2': '📍 Live-GPS-Telemetrie',
        'badge3': '💬 1-Klick-Anruf & WhatsApp',
    },
    'es': {
        'tag': 'SEGURIDAD INTELIGENTE PARA MASCOTAS',
        'title': 'Tu Mascota Siempre Protegida',
        'subtitle': 'Placa QR Inteligente Sin Baterías & Rastreo GPS en Vivo',
        'badge1': '⚡ Cero Baterías Necesarias',
        'badge2': '📍 Telemetría GPS en Vivo',
        'badge3': '💬 Llamada & WhatsApp Directo',
    },
    'fr': {
        'tag': 'SÉCURITÉ ANIMALE NOUVELLE GÉNÉRATION',
        'title': 'Ne Perdez Plus Jamais Votre Animal',
        'subtitle': 'Médaille QR Intelligente Sans Batterie & Suivi GPS en Direct',
        'badge1': '⚡ Zéro Batterie Requise',
        'badge2': '📍 Télémétrie GPS en Direct',
        'badge3': '💬 Appel & WhatsApp en 1 Clic',
    },
    'it': {
        'tag': 'SICUREZZA SMART PER ANIMALI',
        'title': 'Il Tuo Amico Sempre al Sicuro',
        'subtitle': 'Medaglietta QR Senza Batteria & Tracciamento GPS Live',
        'badge1': '⚡ Nessuna Ricarica Necessaria',
        'badge2': '📍 Telemetria GPS in Tempo Reale',
        'badge3': '💬 Chiamata & WhatsApp Rapido',
    },
    'pt': {
        'tag': 'PROTEÇÃO INTELIGENTE PARA SEU PET',
        'title': 'Seu Melhor Amigo Sempre Seguro',
        'subtitle': 'Tag QR Inteligente Sem Bateria & Rastreamento GPS ao Vivo',
        'badge1': '⚡ Zero Bateria Necessária',
        'badge2': '📍 Telemetria GPS em Tempo Real',
        'badge3': '💬 Ligação & WhatsApp Direto',
    },
    'nl': {
        'tag': 'SLIMME VEILIGHEID VOOR JE HUISDIER',
        'title': 'Je Huisdier Altijd Veilig',
        'subtitle': 'Slimme QR-Penning Zonder Batterij & Live GPS-Tracking',
        'badge1': '⚡ Nooit Opladen Nodig',
        'badge2': '📍 Live GPS-Telemetrie',
        'badge3': '💬 1-Klik Bellen & WhatsApp',
    },
    'ru': {
        'tag': 'УМНАЯ БЕЗОПАСНОСТЬ ПИТОМЦЕВ',
        'title': 'Ваш Питомец Всегда в Безопасности',
        'subtitle': 'Умный QR-адресник без зарядки и онлайн GPS-трекинг',
        'badge1': '⚡ 100% Без Зарядки',
        'badge2': '📍 Точная GPS-Телеметрия',
        'badge3': '💬 Связь в 1 Клик',
    },
    'ar': {
        'tag': 'الأمان الذكي للحيوانات الأليفة',
        'title': 'أليفك دائماً في أمان تام',
        'subtitle': 'قلادة QR ذكية بدون بطاريات وتتبع GPS مباشر',
        'badge1': '⚡ بدون شحن أو بطاريات',
        'badge2': '📍 تتبع GPS فوري مباشر',
        'badge3': '💬 اتصال وواتساب بلمسة واحدة',
    },
    'ja': {
        'tag': '次世代ペットセキュリティ',
        'title': '愛するペットを迷子にさせない',
        'subtitle': '充電不要のスマートQR迷子札＆リアルタイムGPS追跡',
        'badge1': '⚡ 充電・電池交換ゼロ',
        'badge2': '📍 高精度リアルタイムGPS',
        'badge3': '💬 ワンタップ直接通話',
    },
    'ko': {
        'tag': '차세대 스마트 반려동물 안심 케어',
        'title': '소중한 반려동물을 안전하게',
        'subtitle': '충전 걱정 없는 스마트 QR 인식표 & 실시간 GPS 위치 추적',
        'badge1': '⚡ 무충전 영구 안심 기술',
        'badge2': '📍 초정밀 실시간 GPS',
        'badge3': '💬 원터치 통화 & 메시지',
    },
    'zh': {
        'tag': '新一代智能宠物安全守护',
        'title': '时刻守护您的爱宠不走失',
        'subtitle': '永久免充电智能 QR 吊牌 & 实时 GPS 卫星定位',
        'badge1': '⚡ 终身无需充电',
        'badge2': '📍 实时精准 GPS 轨迹',
        'badge3': '💬 一键快速通话联系',
    },
    'pl': {
        'tag': 'INTELIGENTNE BEZPIECZEŃSTWO ZWIERZĄT',
        'title': 'Twój Pupil Zawsze Bezpieczny',
        'subtitle': 'Adresówka QR Bez Ładowania & Śledzenie GPS na Żywo',
        'badge1': '⚡ Zero Ładowania Baterii',
        'badge2': '📍 Telemetria GPS na Żywo',
        'badge3': '💬 Szybki Kontakt w 1 Klik',
    },
    'sv': {
        'tag': 'SMART HUSDJURSTRYGGHET',
        'title': 'Ditt Husdjur Är Alltid Tryggt',
        'subtitle': 'Batterifri Smart QR-Bricka & Live GPS-Spårning',
        'badge1': '⚡ Ingen Laddning Krävs',
        'badge2': '📍 Live GPS-Telemetri',
        'badge3': '💬 1-Klick Ring & WhatsApp',
    },
    'no': {
        'tag': 'SMART KJÆLEDYRSIKKERHET',
        'title': 'Kjæledyret Ditt Alltid Trygt',
        'subtitle': 'Batterifri Smart QR-Brikke & Live GPS-Sporing',
        'badge1': '⚡ Trenger Aldri Lading',
        'badge2': '📍 Live GPS-Telemetri',
        'badge3': '💬 1-Trykks Ringing & WhatsApp',
    },
    'da': {
        'tag': 'SMART KÆLEDYRSSIKKERHED',
        'title': 'Dit Kæledyr Er Altid i Sikkerhed',
        'subtitle': 'Batterifrit Smart QR-Tegn & Live GPS-Sporing',
        'badge1': '⚡ Kræver Ingen Opladning',
        'badge2': '📍 Live GPS-Telemetri',
        'badge3': '💬 1-Klik Opkald & WhatsApp',
    },
    'fi': {
        'tag': 'ÄLYKÄS LEMMIKKITURVA',
        'title': 'Lemmikkisi On Aina Turvassa',
        'subtitle': 'Latausvapaa Äly-QR-Laatta & Reaaliaikainen GPS-Paikannus',
        'badge1': '⚡ Ei Lataustarvetta',
        'badge2': '📍 Reaaliaikainen GPS',
        'badge3': '💬 Yhteys Yhdellä Kosketuksella',
    },
    'id': {
        'tag': 'KEAMANAN HEWAN PELIHARAAN PINTAR',
        'title': 'Hewan Peliharaan Anda Selalu Aman',
        'subtitle': 'Tag QR Pintar Tanpa Baterai & Pelacakan GPS Langsung',
        'badge1': '⚡ Tanpa Cas & Bebas Baterai',
        'badge2': '📍 Telemetri GPS Langsung',
        'badge3': '💬 1 Ketukan Telepon & WhatsApp',
    },
    'hi': {
        'tag': 'स्मार्ट पेट सुरक्षा इकोसिस्टम',
        'title': 'आपका पालतू हमेशा सुरक्षित',
        'subtitle': 'बिना बैटरी का स्मार्ट QR टैग और लाइव GPS ट्रैकिंग',
        'badge1': '⚡ बिना चार्जिंग की जरूरत',
        'badge2': '📍 लाइव GPS टेलीमेट्री',
        'badge3': '💬 1-टैप कॉल और व्हाट्सएप',
    },
}

def get_fonts(lang_code):
    bold_path = r"C:\Windows\Fonts\segoeuib.ttf"
    reg_path = r"C:\Windows\Fonts\segoeui.ttf"
    
    if lang_code in ['zh', 'ja']:
        if os.path.exists(r"C:\Windows\Fonts\msyh.ttc"):
            bold_path = r"C:\Windows\Fonts\msyh.ttc"
            reg_path = r"C:\Windows\Fonts\msyh.ttc"
    elif lang_code == 'ko':
        if os.path.exists(r"C:\Windows\Fonts\malgun.ttf"):
            bold_path = r"C:\Windows\Fonts\malgun.ttf"
            reg_path = r"C:\Windows\Fonts\malgun.ttf"
    elif lang_code == 'hi':
        if os.path.exists(r"C:\Windows\Fonts\Nirmala.ttc"):
            bold_path = r"C:\Windows\Fonts\Nirmala.ttc"
            reg_path = r"C:\Windows\Fonts\Nirmala.ttc"
    elif lang_code == 'ar':
        if os.path.exists(r"C:\Windows\Fonts\arialbd.ttf"):
            bold_path = r"C:\Windows\Fonts\arialbd.ttf"
            reg_path = r"C:\Windows\Fonts\arial.ttf"
    elif lang_code == 'ru':
        if os.path.exists(r"C:\Windows\Fonts\arialbd.ttf"):
            bold_path = r"C:\Windows\Fonts\arialbd.ttf"
            reg_path = r"C:\Windows\Fonts\arial.ttf"

    try:
        font_brand = ImageFont.truetype(bold_path, 34)
        font_tag = ImageFont.truetype(bold_path, 20)
        font_title = ImageFont.truetype(bold_path, 46)
        font_sub = ImageFont.truetype(reg_path, 22)
        font_badge = ImageFont.truetype(bold_path, 19)
    except Exception:
        font_brand = ImageFont.load_default()
        font_tag = ImageFont.load_default()
        font_title = ImageFont.load_default()
        font_sub = ImageFont.load_default()
        font_badge = ImageFont.load_default()

    return font_brand, font_tag, font_title, font_sub, font_badge

def create_feature_graphic(lang_code, meta):
    """Renders a flagship 1024x500 Feature Graphic with glowing phone & tag mockup"""
    font_brand, font_tag, font_title, font_sub, font_badge = get_fonts(lang_code)
    
    # 1. Base Gradient Canvas (Pastel Mint & Dark Forest Accent)
    base = Image.new('RGBA', (BANNER_WIDTH, BANNER_HEIGHT), (250, 247, 242, 255))
    draw = ImageDraw.Draw(base)
    
    # Gradient overlay
    for y in range(BANNER_HEIGHT):
        ratio = y / float(BANNER_HEIGHT - 1)
        r = int(250 * (1 - ratio) + 240 * ratio)
        g = int(247 * (1 - ratio) + 245 * ratio)
        b = int(242 * (1 - ratio) + 250 * ratio)
        draw.line([(0, y), (BANNER_WIDTH, y)], fill=(r, g, b, 255))
        
    # Ambient glowing aura on right side
    aura = Image.new('RGBA', (BANNER_WIDTH, BANNER_HEIGHT), (0, 0, 0, 0))
    draw_aura = ImageDraw.Draw(aura)
    draw_aura.ellipse([600, -80, 1080, 520], fill=(16, 185, 129, 65))
    draw_aura.ellipse([700, 120, 1020, 480], fill=(56, 189, 248, 55))
    draw_aura.ellipse([50, -50, 400, 300], fill=(221, 214, 254, 45))
    aura_blurred = aura.filter(ImageFilter.GaussianBlur(radius=80))
    base = Image.alpha_composite(base, aura_blurred)
    draw = ImageDraw.Draw(base)
    
    # 2. Left Column: Brand & Marketing Copy
    # Brand logo row
    draw.rounded_rectangle([50, 42, 66, 58], radius=8, fill=(15, 76, 92, 255))
    draw.text((76, 32), "PetPin", fill=(15, 76, 92, 255), font=font_brand)
    
    # Category tag pill
    tag_bbox = draw.textbbox((0, 0), meta['tag'], font=font_tag)
    t_w = tag_bbox[2] - tag_bbox[0]
    draw.rounded_rectangle([50, 88, 50 + t_w + 24, 118], radius=15, fill=(220, 252, 231, 255), outline=(134, 239, 172, 255), width=1)
    draw.text((62, 92), meta['tag'], fill=(4, 120, 87, 255), font=font_tag)
    
    # Main Title
    draw.text((50, 136), meta['title'], fill=(15, 23, 42, 255), font=font_title)
    
    # Subtitle
    draw.text((50, 202), meta['subtitle'], fill=(71, 85, 105, 255), font=font_sub)
    
    # 3 Pill Badges on left bottom
    badges = [meta['badge1'], meta['badge2'], meta['badge3']]
    colors = [
        ((254, 243, 199, 255), (253, 230, 138, 255), (180, 83, 9, 255)),
        ((224, 242, 254, 255), (186, 230, 253, 255), (3, 105, 161, 255)),
        ((209, 250, 229, 255), (167, 243, 208, 255), (4, 120, 87, 255)),
    ]
    
    start_y = 260
    for idx, (badge_text, (bg, border, txt)) in enumerate(zip(badges, colors)):
        b_bbox = draw.textbbox((0, 0), badge_text, font=font_badge)
        b_w = b_bbox[2] - b_bbox[0]
        draw.rounded_rectangle([50, start_y + (idx * 48), 50 + b_w + 28, start_y + (idx * 48) + 38], radius=19, fill=bg, outline=border, width=1)
        draw.text((64, start_y + (idx * 48) + 8), badge_text, fill=txt, font=font_badge)
        
    # 3. Right Column: Smartphone 3D Mockup
    phone_src = os.path.join(SRC_DIR, "Screenshot_2026-09-02-00-33-27-081_host.exp.exponent.jpg")
    ss_img = Image.open(phone_src).convert("RGBA")
    
    MOCK_W = 270
    MOCK_H = 590
    BEZEL = 10
    
    ss_resized = ss_img.resize((MOCK_W - BEZEL * 2, MOCK_H - BEZEL * 2), Image.LANCZOS)
    
    screen_mask = Image.new('L', (MOCK_W - BEZEL * 2, MOCK_H - BEZEL * 2), 0)
    draw_smask = ImageDraw.Draw(screen_mask)
    draw_smask.rounded_rectangle([0, 0, MOCK_W - BEZEL * 2, MOCK_H - BEZEL * 2], radius=32, fill=255)
    
    screen_cut = Image.new('RGBA', (MOCK_W - BEZEL * 2, MOCK_H - BEZEL * 2), (0, 0, 0, 0))
    screen_cut.paste(ss_resized, (0, 0), screen_mask)
    
    phone_frame = Image.new('RGBA', (MOCK_W, MOCK_H), (0, 0, 0, 0))
    draw_phone = ImageDraw.Draw(phone_frame)
    draw_phone.rounded_rectangle([0, 0, MOCK_W, MOCK_H], radius=40, fill=(15, 23, 42, 255), outline=(51, 65, 85, 255), width=2)
    phone_frame.paste(screen_cut, (BEZEL, BEZEL), screen_mask)
    
    # Phone Drop Shadow
    p_shadow = Image.new('RGBA', (MOCK_W + 80, MOCK_H + 80), (0, 0, 0, 0))
    draw_ps = ImageDraw.Draw(p_shadow)
    draw_ps.rounded_rectangle([40, 48, 40 + MOCK_W, 48 + MOCK_H], radius=40, fill=(0, 0, 0, 85))
    p_shadow_blur = p_shadow.filter(ImageFilter.GaussianBlur(radius=28))
    
    # Paste Phone on Canvas
    phone_x = 690
    phone_y = 65
    base.paste(p_shadow_blur, (phone_x - 40, phone_y - 40), p_shadow_blur)
    base.paste(phone_frame, (phone_x, phone_y), phone_frame)
    
    # Floating Holographic QR Collar Tag next to phone
    tag_card = Image.new('RGBA', (210, 110), (0, 0, 0, 0))
    draw_tc = ImageDraw.Draw(tag_card)
    draw_tc.rounded_rectangle([0, 0, 210, 110], radius=22, fill=(255, 255, 255, 245), outline=(226, 232, 240, 255), width=1)
    # Tag hole
    draw_tc.ellipse([16, 16, 32, 32], fill=(241, 245, 249, 255), outline=(15, 76, 92, 255), width=2)
    draw_tc.ellipse([21, 21, 27, 27], fill=(16, 185, 129, 255))
    draw_tc.text((42, 16), "TAG: #PETPIN-01", fill=(15, 23, 42, 255), font=font_tag)
    draw_tc.text((16, 44), "Milo • Golden Retriever", fill=(71, 85, 105, 255), font=font_badge)
    draw_tc.text((16, 72), "🟢 7/24 Aktif • GPS Canlı", fill=(4, 120, 87, 255), font=font_tag)
    
    # Shadow for Tag Card
    tc_shadow = Image.new('RGBA', (270, 170), (0, 0, 0, 0))
    draw_tcs = ImageDraw.Draw(tc_shadow)
    draw_tcs.rounded_rectangle([30, 36, 240, 146], radius=22, fill=(0, 0, 0, 60))
    tc_shadow_blur = tc_shadow.filter(ImageFilter.GaussianBlur(radius=18))
    
    tag_x = 550
    tag_y = 310
    base.paste(tc_shadow_blur, (tag_x - 30, tag_y - 30), tc_shadow_blur)
    base.paste(tag_card, (tag_x, tag_y), tag_card)
    
    return base

def main():
    print("🚀 Generating Google Play Store 1024x500 Feature Graphics for 20 Languages...")
    count = 0
    for lang_code, meta in FEATURE_GRAPHIC_DATA.items():
        lang_dir = os.path.join(OUT_DIR, lang_code)
        os.makedirs(lang_dir, exist_ok=True)
        
        graphic = create_feature_graphic(lang_code, meta)
        out_path = os.path.join(lang_dir, "feature_graphic.png")
        graphic.convert('RGB').save(out_path, 'PNG', quality=95, optimize=True)
        print(f"  ✓ [{lang_code.upper()}] Feature Graphic -> {out_path}")
        count += 1
        
    print(f"\n🎉 SUCCESS! Generated {count} Feature Graphics (1024x500) for all 20 languages.")

if __name__ == '__main__':
    main()
