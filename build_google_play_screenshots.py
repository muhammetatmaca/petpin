import os
import sys
import glob
from PIL import Image, ImageDraw, ImageFont, ImageFilter

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

from generate_store_languages import LANGUAGES

CANVAS_WIDTH = 1080
CANVAS_HEIGHT = 2400

SRC_DIR = r"C:\Users\muham\Desktop\ssler"
OUT_DIR = os.path.join(SRC_DIR, "google_play_screenshots")
os.makedirs(OUT_DIR, exist_ok=True)

SCREENSHOT_MAP = [
    os.path.join(SRC_DIR, "Screenshot_2026-09-02-00-33-27-081_host.exp.exponent.jpg"), # 1. Live Map
    os.path.join(SRC_DIR, "Screenshot_2026-09-02-00-33-05-314_host.exp.exponent.jpg"), # 2. Smart QR Tag
    os.path.join(SRC_DIR, "Screenshot_2026-09-02-00-33-39-329_host.exp.exponent.jpg"), # 3. Instant Alert
    os.path.join(SRC_DIR, "Screenshot_2026-09-02-00-33-13-065_host.exp.exponent.jpg"), # 4. Zero Battery
    os.path.join(SRC_DIR, "Screenshot_2026-09-02-00-33-29-718_host.exp.exponent.jpg"), # 5. Pet Profile
    os.path.join(SRC_DIR, "Screenshot_2026-09-02-00-33-47-329_host.exp.exponent.jpg"), # 6. Lost SOS Mode
    os.path.join(SRC_DIR, "Screenshot_2026-09-02-00-33-34-766_host.exp.exponent.jpg"), # 7. Direct Contact
]

def get_fonts(lang_code):
    """Selects the best native typography for each script"""
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
        font_pill = ImageFont.truetype(bold_path, 28)
        font_title = ImageFont.truetype(bold_path, 52)
        font_sub = ImageFont.truetype(reg_path, 29)
    except Exception:
        font_pill = ImageFont.load_default()
        font_title = ImageFont.load_default()
        font_sub = ImageFont.load_default()

    return font_pill, font_title, font_sub

def hex_to_rgb(hex_str):
    hex_clean = hex_str.lstrip('#')
    return tuple(int(hex_clean[i:i+2], 16) for i in (0, 2, 4))

def create_gradient(width, height, top_color, bot_color):
    top_rgb = hex_to_rgb(top_color)
    bot_rgb = hex_to_rgb(bot_color)
    
    gradient = Image.new('RGBA', (1, height))
    for y in range(height):
        ratio = y / float(height - 1)
        r = int(top_rgb[0] * (1 - ratio) + bot_rgb[0] * ratio)
        g = int(top_rgb[1] * (1 - ratio) + bot_rgb[1] * ratio)
        b = int(top_rgb[2] * (1 - ratio) + bot_rgb[2] * ratio)
        gradient.putpixel((0, y), (r, g, b, 255))
        
    return gradient.resize((width, height), Image.BILINEAR)

def create_device_mockup(screenshot_path):
    PHONE_W = 740
    PHONE_H = 1620
    BEZEL = 16
    CORNER_RADIUS = 54
    SCREEN_CORNER = 42
    
    SCREEN_W = PHONE_W - (BEZEL * 2)
    SCREEN_H = PHONE_H - (BEZEL * 2)
    
    ss_img = Image.open(screenshot_path).convert("RGBA")
    ss_resized = ss_img.resize((SCREEN_W, SCREEN_H), Image.LANCZOS)
    
    screen_mask = Image.new('L', (SCREEN_W, SCREEN_H), 0)
    draw_mask = ImageDraw.Draw(screen_mask)
    draw_mask.rounded_rectangle([0, 0, SCREEN_W, SCREEN_H], radius=SCREEN_CORNER, fill=255)
    
    screen_rounded = Image.new('RGBA', (SCREEN_W, SCREEN_H), (0, 0, 0, 0))
    screen_rounded.paste(ss_resized, (0, 0), screen_mask)
    
    phone_body = Image.new('RGBA', (PHONE_W, PHONE_H), (0, 0, 0, 0))
    draw_body = ImageDraw.Draw(phone_body)
    
    draw_body.rounded_rectangle(
        [0, 0, PHONE_W, PHONE_H],
        radius=CORNER_RADIUS,
        fill=(15, 23, 42, 255),
        outline=(51, 65, 85, 255),
        width=3
    )
    
    phone_body.paste(screen_rounded, (BEZEL, BEZEL), screen_mask)
    
    # Dynamic Island / Camera Notch
    pill_w, pill_h = 140, 28
    pill_x = (PHONE_W - pill_w) // 2
    pill_y = BEZEL + 10
    draw_body.rounded_rectangle(
        [pill_x, pill_y, pill_x + pill_w, pill_y + pill_h],
        radius=14,
        fill=(0, 0, 0, 240)
    )
    draw_body.ellipse([pill_x + 18, pill_y + 7, pill_x + 32, pill_y + 21], fill=(15, 23, 42, 255))
    draw_body.ellipse([pill_x + 22, pill_y + 11, pill_x + 26, pill_y + 15], fill=(30, 58, 138, 255))
    
    # Glass Gloss
    gloss_layer = Image.new('RGBA', (PHONE_W, PHONE_H), (0, 0, 0, 0))
    draw_gloss = ImageDraw.Draw(gloss_layer)
    draw_gloss.polygon(
        [(0, 0), (PHONE_W * 0.7, 0), (0, PHONE_H * 0.45)],
        fill=(255, 255, 255, 12)
    )
    
    phone_with_gloss = Image.alpha_composite(phone_body, gloss_layer)
    
    # Drop Shadow
    SHADOW_PAD = 80
    shadow_canvas = Image.new('RGBA', (PHONE_W + SHADOW_PAD * 2, PHONE_H + SHADOW_PAD * 2), (0, 0, 0, 0))
    draw_shadow = ImageDraw.Draw(shadow_canvas)
    
    draw_shadow.rounded_rectangle(
        [SHADOW_PAD + 6, SHADOW_PAD + 22, SHADOW_PAD + PHONE_W - 6, SHADOW_PAD + PHONE_H + 26],
        radius=CORNER_RADIUS,
        fill=(0, 0, 0, 75)
    )
    shadow_blurred = shadow_canvas.filter(ImageFilter.GaussianBlur(radius=38))
    
    mockup_final = Image.new('RGBA', shadow_blurred.size, (0, 0, 0, 0))
    mockup_final.paste(shadow_blurred, (0, 0), shadow_blurred)
    mockup_final.paste(phone_with_gloss, (SHADOW_PAD, SHADOW_PAD), phone_with_gloss)
    
    return mockup_final, SHADOW_PAD

def render_store_screenshot(screen_meta, screenshot_file, lang_code):
    font_pill, font_title, font_sub = get_fonts(lang_code)
    
    # 1. Base Gradient Canvas
    canvas = create_gradient(
        CANVAS_WIDTH,
        CANVAS_HEIGHT,
        screen_meta['color_top'],
        screen_meta['color_bot']
    )
    
    # 2. Ambient aura orb
    aura = Image.new('RGBA', (CANVAS_WIDTH, CANVAS_HEIGHT), (0, 0, 0, 0))
    draw_aura = ImageDraw.Draw(aura)
    draw_aura.ellipse(
        [CANVAS_WIDTH * 0.15, CANVAS_HEIGHT * 0.28, CANVAS_WIDTH * 0.85, CANVAS_HEIGHT * 0.65],
        fill=hex_to_rgb(screen_meta['pill_bg']) + (60,)
    )
    aura_blurred = aura.filter(ImageFilter.GaussianBlur(radius=100))
    canvas = Image.alpha_composite(canvas, aura_blurred)
    
    draw = ImageDraw.Draw(canvas)
    
    # 3. Top Marketing Category Pill Tag
    tag_text = screen_meta['tag']
    pill_bbox = draw.textbbox((0, 0), tag_text, font=font_pill)
    pill_text_w = pill_bbox[2] - pill_bbox[0]
    pill_text_h = pill_bbox[3] - pill_bbox[1]
    
    pill_pad_x = 24
    pill_pad_y = 12
    pill_w = pill_text_w + (pill_pad_x * 2)
    pill_h = pill_text_h + (pill_pad_y * 2)
    
    pill_x = (CANVAS_WIDTH - pill_w) // 2
    pill_y = 110
    
    draw.rounded_rectangle(
        [pill_x, pill_y, pill_x + pill_w, pill_y + pill_h],
        radius=pill_h // 2,
        fill=hex_to_rgb(screen_meta['pill_bg']) + (230,),
        outline=(255, 255, 255, 200),
        width=2
    )
    
    draw.text(
        (pill_x + pill_pad_x, pill_y + pill_pad_y - 2),
        tag_text,
        fill=hex_to_rgb(screen_meta['pill_txt']),
        font=font_pill
    )
    
    # 4. Main Headline
    title_lines = screen_meta['title'].split('\n')
    title_y = pill_y + pill_h + 36
    line_spacing = 66
    
    for i, line in enumerate(title_lines):
        t_bbox = draw.textbbox((0, 0), line, font=font_title)
        t_w = t_bbox[2] - t_bbox[0]
        t_x = (CANVAS_WIDTH - t_w) // 2
        draw.text((t_x, title_y + (i * line_spacing)), line, fill=(15, 23, 42, 255), font=font_title)
        
    # 5. Subtitle
    sub_text = screen_meta['subtitle']
    sub_y = title_y + (len(title_lines) * line_spacing) + 18
    
    words = sub_text.split()
    sub_lines = []
    current_line = []
    
    for word in words:
        test_line = " ".join(current_line + [word])
        w_bbox = draw.textbbox((0, 0), test_line, font=font_sub)
        if (w_bbox[2] - w_bbox[0]) <= 860:
            current_line.append(word)
        else:
            if current_line:
                sub_lines.append(" ".join(current_line))
                current_line = [word]
            else:
                sub_lines.append(word)
                current_line = []
    if current_line:
        sub_lines.append(" ".join(current_line))
        
    for j, s_line in enumerate(sub_lines):
        s_bbox = draw.textbbox((0, 0), s_line, font=font_sub)
        s_w = s_bbox[2] - s_bbox[0]
        s_x = (CANVAS_WIDTH - s_w) // 2
        draw.text((s_x, sub_y + (j * 38)), s_line, fill=(71, 85, 105, 255), font=font_sub)
        
    # 6. Device Mockup Placement
    mockup_img, pad = create_device_mockup(screenshot_file)
    mockup_x = (CANVAS_WIDTH - mockup_img.width) // 2
    mockup_y = 660 - pad
    
    canvas.paste(mockup_img, (mockup_x, mockup_y), mockup_img)
    
    return canvas

def main():
    print("Starting Google Play Store 20-Language Screenshot Generator...")
    total_generated = 0
    
    for lang_code, lang_data in LANGUAGES.items():
        lang_name = lang_data['name']
        lang_dir = os.path.join(OUT_DIR, lang_code)
        os.makedirs(lang_dir, exist_ok=True)
        
        print(f"Generating [{lang_code.upper()} - {lang_name}] Screenshots...")
        for idx, screen_meta in enumerate(lang_data['screens']):
            src_ss = SCREENSHOT_MAP[idx]
            out_filename = f"{idx+1}_{lang_code}_screenshot.png"
            out_path = os.path.join(lang_dir, out_filename)
            
            rendered_image = render_store_screenshot(screen_meta, src_ss, lang_code)
            rendered_image.convert('RGB').save(out_path, 'PNG', quality=95, optimize=True)
            total_generated += 1
            
        print(f"  Done: {lang_code.upper()} (7 screenshots saved)")
            
    print(f"\nSUCCESS! Generated all {total_generated} high-resolution screenshots across 20 languages.")
    print(f"Saved directly to: {OUT_DIR}")

if __name__ == '__main__':
    main()
