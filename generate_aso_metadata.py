import os
import sys
import json

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

SRC_DIR = r"C:\Users\muham\Desktop\ssler"
META_DIR = os.path.join(SRC_DIR, "google_play_metadata")
SCREENSHOTS_DIR = os.path.join(SRC_DIR, "google_play_screenshots")
os.makedirs(META_DIR, exist_ok=True)

ASO_DATA = {
    'tr': {
        'language': 'Türkçe',
        'title': 'PetPin: Akıllı QR Evcil Künye',
        'short_desc': 'Kayıp evcil hayvanlar için sıfır şarjlı akıllı QR künye ve canlı GPS takibi.',
        'full_desc': """🐾 PetPin: Evcil Hayvanınızın Dünyasını Koruyan Akıllı QR Künye Ekosistemi!

Evcil dostunuzun kaybolma endişesine son verin. PetPin, şarjı biten ve aylık abonelik ücreti isteyen geleneksel GPS tasmaların aksine, %100 pasif ve ömür boyu kesintisiz çalışan yeni nesil akıllı evcil hayvan künyesidir.

Dostunuz kaybolduğunda, bulan kişinin herhangi bir akıllı telefon kamerasıyla künyeyi okutması yeterlidir. Bulan kişi hiçbir uygulama indirmek zorunda kalmadan doğrudan sizinle iletişime geçer ve tam sokak adresi canlı GPS koordinatlarıyla anında telefonunuza sesli/titreşimli bildirim olarak iletilir!

✨ ÖNE ÇIKAN TEMEL ÖZELLİKLER:

📍 CANLI GPS TELEMETRİSİ & SOKAK ADRESİ
Künye okutulduğu anda, tarayan kişinin izniyle tam sokak adresi, harita pini ve zaman damgası telefonunuza milisaniyeler içinde ulaşır. Tek dokunuşla haritayı açıp dostunuza giden en hızlı rotayı başlatın.

🏷️ UYGULAMASIZ AKILLI QR KÜNYE
Bulan kişinin PetPin uygulamasına sahip olması gerekmez. Herhangi bir iPhone veya Android kamera ile QR kod okutulduğunda şık, mobil uyumlu evcil hayvan profil kartı saniyeler içinde açılır.

⚡ SIFIR ŞARJ & %100 SU GEÇİRMEZ PASİF GÜVENLİK
Her gün tasma şarj etme derdine son! PetPin künyeleri hiçbir pil, elektrik veya şarj cihazı gerektirmez. Kediniz veya köpeğiniz için tüy kadar hafif, suya ve darbelere karşı %100 dayanıklıdır.

📞 TEK DOKUNUŞLA ARAMA & WHATSAPP
Bulan kişi karmaşık formlarla uğraşmadan tek tıkla sizi telefonla arayabilir veya WhatsApp üzerinden harita koordinatlarıyla birlikte anında mesaj gönderebilir.

🩺 DİJİTAL SAĞLIK & AŞI KARTI
Evcil hayvanınızın alerjilerini, kronik rahatsızlıklarını, aşı geçmişini ve veteriner kliniği iletişim bilgilerini dijital profiline kaydedin. Acil durumlarda bulan kişi ve hekimler doğru müdahaleyi anında yapsın.

🚨 KAYIP MODU (SOS BEACON ALARMI)
Dostunuz kaybolduğunda uygulamadan "Kayıp Modu"nu aktifleştirin. Künye tarandığında telefonunuz yüksek öncelikli acil durum alarmı verir ve bulucuya acil durum talimatlarını gösterir.

📄 YAZDIRILABİLİR A4 KÜNYE ŞABLONU & PAYLAŞIM
Künyenizi anında yüksek çözünürlüklü A4 PDF olarak dışa aktarın, yazdırıp tasmaya takın veya sosyal medyada kayıp ilanı olarak tek tıkla paylaşın.

🛡️ SIFIR ABONELİK & ÖMÜR BOYU ÜCRETSİZ
Gizli ücretler yok, aylık SIM kart aidatı yok! Bir kez oluşturun ve dostunuzu ömür boyu güvenle koruyun.

🐕 Kedi, köpek ve tüm evcil dostlarınız için en güvenli koruma ağı. PetPin'i şimdi ücretsiz indirin ve can dostunuzun güvenliğini şansa bırakmayın!"""
    },
    'en': {
        'language': 'English',
        'title': 'PetPin: Smart QR Pet Tag & GPS',
        'short_desc': 'Zero-battery smart QR collar tag and real-time GPS tracking for lost pets.',
        'full_desc': """🐾 PetPin: Next-Generation Smart QR Pet Collar Tag & Safety Ecosystem!

Never worry about losing your furry best friend again. Unlike heavy GPS trackers that run out of battery in a day and require costly monthly subscriptions, PetPin is 100% passive, featherlight, and works lifetime without charging.

When your pet goes missing, anyone who finds them simply scans the QR tag with their phone camera. No app download required! You instantly receive an acoustic alert along with the finder's exact street address and live GPS coordinates on your interactive map.

✨ KEY FEATURES & HIGHLIGHTS:

📍 LIVE GPS LOCATION & INSTANT ROUTE
The exact street address, GPS coordinates (±3m accuracy), and precise timestamp are pushed to your device milliseconds after the tag is scanned. Start navigation with one tap.

🏷️ APP-FREE SMART QR TAG
Finders don't need any special app. Scanning with any smartphone camera opens a mobile-optimized emergency profile card instantly.

⚡ ZERO BATTERY CHARGING & 100% WATERPROOF
No more daily charging hassles! PetPin requires zero batteries, zero cables, and zero maintenance. Featherlight and completely waterproof for dogs and cats of all sizes.

📞 1-TAP CALL & WHATSAPP CONTACT
Finders can reach you instantly via a direct phone call or WhatsApp message with pre-filled GPS coordinates.

🩺 DIGITAL HEALTH PASSPORT & ALLERGY NOTES
Keep vaccination history, dietary allergies, chronic conditions, and emergency vet contacts accessible 24/7 on your pet's digital profile.

🚨 LOST PET SOS SHIELD MODE
Activate Lost Mode with one tap. When scanned, your phone sounds a high-priority emergency alarm, and the finder is presented with emergency rescue instructions.

📄 PRINTABLE A4 COLLAR TAG & SHARING
Export ready-to-print high-resolution A4 collar templates or share your pet's digital badge across social networks instantly.

🛡️ ZERO SUBSCRIPTION & LIFETIME FREE
No monthly SIM fees, no subscriptions, no hidden charges. Create your pet's tag once and keep them protected forever.

🐕 Keep your dog and cat safe every step of the way. Download PetPin today and enjoy complete peace of mind!"""
    },
    'de': {
        'language': 'Deutsch',
        'title': 'PetPin: Smarte QR-Tier-Marke',
        'short_desc': 'Smarte QR-Halsbandmarke ohne Akku und Live-GPS-Standort für Haustiere.',
        'full_desc': """🐾 PetPin: Die smarte QR-Haustiermarke der nächsten Generation!

Verlieren Sie nie wieder Ihren geliebten Vierbeiner aus den Augen. Im Gegensatz zu herkömmlichen GPS-Trackern, die täglich geladen werden müssen und teure Abonnements erfordern, funktioniert PetPin zu 100% passiv und ohne jegliches Aufladen.

Geht Ihr Liebling verloren, scannt der Finder einfach den QR-Code mit der Smartphone-Kamera – ganz ohne App-Download! Sie erhalten sofort einen akustischen Alarm und den genauen Live-GPS-Standort mit Straßenadresse auf Ihrem Handy.

✨ DIE WICHTIGSTEN FUNKTIONEN:

📍 ECHTZEIT-GPS-STANDORT & ROUTE
Genaue Straßenadresse, Koordinaten (±3m Genauigkeit) und Zeitstempel landen in Millisekunden auf Ihrem Smartphone.

🏷️ APP-FREIES SMARTES QR-SYSTEM
Finder benötigen keine extra App. Jedes Smartphone öffnet sofort das digitale Notfallprofil Ihres Tieres.

⚡ NIE WIEDER LADEN & 100% WASSERDICHT
Kein Akku, keine Kabel, keine Wartung. Federleicht und absolut wasserfest für Hunde und Katzen aller Größen.

📞 1-KLICK-ANRUF & WHATSAPP
Der Finder kann Sie sofort direkt anrufen oder den Standort per WhatsApp teilen.

🩺 DIGITALER IMPFPASS & GESUNDHEITSNOTIZEN
Speichern Sie Allergien, Medikamente, Impfungen und Tierarzt-Kontakte griffbereit im Profil.

🚨 SOS-NOTFALL-MODUS
Bei Verlust aktivieren Sie den SOS-Modus: Bei einem Scan ertönt ein lauter Notfallalarm auf Ihrem Handy.

🛡️ KEINE ABOKOSTEN & LEBENSLANG KOSTENLOS
Keine monatlichen Gebühren. Einmal einrichten und dauerhaft geschützt sein.

🐕 Schützen Sie Ihren Hund und Ihre Katze zuverlässig. Jetzt PetPin kostenlos herunterladen!"""
    },
    'es': {
        'language': 'Español',
        'title': 'PetPin: Placa QR Mascota GPS',
        'short_desc': 'Placa QR inteligente sin batería y rastreo GPS en vivo para mascotas perdidas.',
        'full_desc': """🐾 PetPin: El ecosistema de seguridad inteligente con placa QR para mascotas.

Despreocúpate de que tu mascota se pierda. A diferencia de los collares GPS tradicionales que se quedan sin batería y requieren suscripciones mensuales, PetPin es 100% pasivo, ultraligero y funciona de por vida sin necesidad de recargas.

Si tu mascota se extravía, quien la encuentre solo debe escanear la placa con la cámara de su móvil. ¡Sin descargar aplicaciones! Recibirás de inmediato una alerta sonora con la dirección exacta y coordenadas GPS en tiempo real.

✨ CARACTERÍSTICAS PRINCIPALES:

📍 RASTREO GPS EN VIVO Y DIRECCIÓN EXACTA
Recibe la ubicación precisa (±3m) y la ruta más rápida hacia tu mascota al instante del escaneo.

🏷️ PLACA QR SIN NECESIDAD DE APPS
Cualquier teléfono inteligente puede escanear el código y ver el perfil de emergencia en segundos.

⚡ CERO BATERÍAS & 100% RESISTENTE AL AGUA
Olvídate de cargar collares todos los días. Sin cables, sin baterías y resistente a la lluvia y el agua.

📞 LLAMADA & WHATSAPP EN 1 TOQUE
El rescatador puede llamarte de inmediato o enviarte las coordenadas por WhatsApp con un solo clic.

🩺 HISTORIAL MÉDICO & ALERGIAS
Registra vacunas, alergias alimentarias, condiciones de salud y datos del veterinario de confianza.

🚨 MODO SOS EXTRAVÍO
Al activarlo, tu móvil emitirá una alarma prioritaria y el buscador verá instrucciones de rescate urgentes.

🛡️ SIN SUSCRIPCIONES & GRATIS DE POR VIDA
Sin cuotas mensuales de SIM ni costos ocultos. Protección total permanente.

🐕 Protege a tu perro o gato en cada aventura. ¡Descarga PetPin gratis hoy mismo!"""
    },
    'fr': {
        'language': 'Français',
        'title': 'PetPin: Médaille QR & GPS Chat',
        'short_desc': 'Médaille QR intelligente sans batterie et suivi GPS en direct pour animaux.',
        'full_desc': """🐾 PetPin : La médaille connectée intelligente nouvelle génération pour vos animaux !

Ne craignez plus jamais de perdre votre fidèle compagnon. Contrairement aux colliers GPS encombrants qui tombent en panne de batterie et nécessitent des abonnements coûteux, PetPin est 100% passif, ultra-léger et fonctionne sans aucune recharge.

Si votre animal s'égare, la personne qui le retrouve scanne simplement le QR code avec son smartphone, sans aucune application ! Vous recevez instantanément une notification d'urgence avec l'adresse exacte et les coordonnées GPS en direct.

✨ POINTS FORTS ET FONCTIONNALITÉS :

📍 GÉOLOCALISATION GPS EN DIRECT & ITINÉRAIRE
Adresse exacte et coordonnées GPS haute précision (±3m) transmises instantanément sur votre carte.

🏷️ MÉDAILLE QR SANS APPLICATION REQUISE
Scannable par n'importe quel smartphone iOS ou Android en moins d'une seconde.

⚡ ZÉRO BATTERIE & 100% ÉTANCHE
Aucun câble, aucune batterie à recharger. Ultra-léger pour chats et chiens et totalement résistant à l'eau.

📞 APPEL DIRECT & WHATSAPP EN 1 CLIC
Le passant peut vous contacter directement par téléphone ou partager la position sur WhatsApp.

🩺 CARNET DE SANTÉ NUMÉRIQUE & ALLERGIES
Gardez vaccins, allergies, soins et contact vétérinaire toujours accessibles en cas d'urgence.

🚨 BOUCLIER SOS PERDU
Activez le mode alerte : votre téléphone sonne fort dès le scan et guide le sauveteur vers vous.

🛡️ AUCUN ABONNEMENT & GRATUIT À VIE
Pas de frais mensuels de carte SIM. Une protection illimitée pour toute la vie de votre animal.

🐕 Téléchargez PetPin dès aujourd'hui et offrez à votre animal la meilleure protection !"""
    },
    'it': {
        'language': 'Italiano',
        'title': 'PetPin: Medaglietta QR e GPS',
        'short_desc': 'Medaglietta QR smart senza batteria e tracciamento GPS live per cani e gatti.',
        'full_desc': """🐾 PetPin: La medaglietta smart per animali di nuova generazione!

Proteggi il tuo amico a quattro zampe da ogni smarrimento. A differenza dei pesanti collari GPS con batterie che si scaricano rapidamente e abbonamenti mensili, PetPin è al 100% passivo, leggerissimo e dura per sempre senza ricariche.

Se il tuo cane o gatto si perde, chiunque lo trovi può scansionare la medaglietta con la fotocamera del telefono, senza scaricare alcuna app! Riceverai immediatamente un allarme sonoro con l'indirizzo esatto e la posizione GPS in tempo reale sulla mappa.

✨ FUNZIONALITÀ PRINCIPALI:

📍 TRACCIAMENTO GPS LIVE E INDIRIZZO PRECISO
Ricevi l'indirizzo esatto e le coordinate GPS (±3m di precisione) all'istante della scansione.

🏷️ MEDAGLIETTA QR SMART SENZA APP
Scansionabile da qualsiasi smartphone in un secondo per aprire la scheda di emergenza.

⚡ ZERO BATTERIA & 100% IMPERMEABILE
Nessun bisogno di ricariche quotidiane. Leggerissima per cani e gatti e totalmente impermeabile.

📞 CHIAMATA & WHATSAPP IN 1 TOCCO
Chi trova il tuo animale può chiamarti subito o inviarti la posizione GPS tramite WhatsApp.

🩺 LIBRETTO SANITARIO DIGITALE
Salva vaccinazioni, allergie alimentari, cure in corso e contatti del veterinario di fiducia.

🚨 MODALITÀ SOS SMARRIMENTO
Attiva lo scudo d'emergenza: allarme sonoro ad alta priorità e istruzioni per chi trova il tuo pet.

🛡️ NESSUN ABBONAMENTO & GRATIS PER SEMPRE
Nessun canone mensile. Sicurezza garantita per tutta la vita del tuo animale.

🐕 Scarica subito PetPin gratis e proteggi il tuo animale in ogni momento!"""
    },
    'pt': {
        'language': 'Português',
        'title': 'PetPin: Tag QR e GPS para Pets',
        'short_desc': 'Tag QR inteligente sem bateria e rastreamento GPS ao vivo para cães e gatos.',
        'full_desc': """🐾 PetPin: O ecossistema inteligente de segurança com tag QR para seu pet!

Nunca mais se preocupe em perder seu melhor amigo. Ao contrário dos rastreadores GPS pesados que descarregam a bateria em um dia e exigem mensalidades caras, o PetPin é 100% passivo, superleve e funciona para sempre sem precisar carregar.

Se o seu pet se perder, quem o encontrar só precisa apontar a câmera do celular para o QR Code da coleira, sem baixar nenhum app! Você recebe imediatamente um alerta com o endereço exato e as coordenadas GPS em tempo real no seu mapa.

✨ PRINCIPAIS RECURSOS:

📍 RASTREAMENTO GPS AO VIVO & ROTA INSTANTÂNEA
Endereço exato da rua e localização precisa (±3m) enviados instantaneamente para seu celular.

🏷️ TAG QR INTELIGENTE SEM NECESSIDADE DE APP
Compatível com qualquer câmera de smartphone iOS ou Android em apenas um segundo.

⚡ ZERO BATERIA & 100% À PROVA D'ÁGUA
Sem estresse de recarregar todos os dias. Ultraleve e resistente à água e impactos.

📞 LIGAÇÃO & WHATSAPP EM 1 TOQUE
Quem encontrar seu pet pode ligar para você na hora ou compartilhar a localização pelo WhatsApp.

🩺 HISTÓRICO DE SAÚDE & VACINAS
Mantenha vacinas, alergias alimentares e contatos da clínica veterinária sempre à mão.

🚨 MODO SOS PERDIDO
Ative o alarme prioritário de emergência para localizar seu pet com máxima rapidez.

🛡️ ZERO MENSALIDADE & GRATUITO PARA SEMPRE
Sem taxas ocultas ou planos mensais. Proteção vitalícia para seu cão ou gato.

🐕 Baixe o PetPin gratuitamente agora mesmo e garanta a segurança do seu pet!"""
    },
    'nl': {
        'language': 'Nederlands',
        'title': 'PetPin: Slimme QR Huisdier Tag',
        'short_desc': 'Slimme QR-penning zonder batterij en live GPS-locatie voor vermiste dieren.',
        'full_desc': """🐾 PetPin: De nieuwe generatie slimme QR-penning voor je huisdier!

Geen zorgen meer over het kwijtraken van je hond of kat. In tegenstelling tot zware GPS-halsbanden die dagelijks moeten worden opgeladen en dure abonnementen vereisen, is PetPin 100% passief, vederlicht en altijd werkend zonder batterijen.

Raakt je huisdier vermist? De vinder scant simpelweg de QR-code met de smartphonecamera – zonder app-installatie! Je ontvangt direct een akoestische melding met het exacte adres en de live GPS-locatie op je kaart.

✨ BELANGRIJKSTE FUNCTIES:

📍 LIVE GPS-LOCATIE & DIRECTE ROUTE
Exact straatadres en nauwkeurige GPS-coördinaten (±3m) direct op je telefoon.

🏷️ APP-VRIJE SLIMME QR-PENNING
Scannable met elke moderne smartphone binnen één seconde.

⚡ NOOIT OPLADEN & 100% WATERDICHT
Geen batterijen, geen snoeren, geen gedoe. Vederlicht en volledig waterbestendig.

📞 1-KLIK BELLEN & WHATSAPP
De vinder kan je direct bellen of de GPS-locatie via WhatsApp delen.

🩺 DIGITAAL DIERENPASPOORT & ALLERGIEËN
Houd inentingen, medische gegevens en dierenartscontacten altijd binnen handbereik.

🚨 VERMIST SOS-MODUS
Activeer het noodschild voor een luid prioritair alarm bij het scannen.

🛡️ GEEN ABONNEMENT & VOOR ALTIJD GRATIS
Geen verborgen kosten of SIM-kaartbijdragen. Levenslange bescherming.

🐕 Download PetPin vandaag nog gratis en houd je huisdier altijd veilig!"""
    },
    'ru': {
        'language': 'Русский',
        'title': 'PetPin: Умный QR Адресник GPS',
        'short_desc': 'Умный QR-адресник без зарядки и онлайн GPS-трекинг для потерянных питомцев.',
        'full_desc': """🐾 PetPin: Умный QR-адресник нового поколения для безопасности ваших питомцев!

Забудьте о страхе потерять собаку или кошку. В отличие от тяжелых GPS-ошейников, которые быстро разряжаются и требуют ежемесячных подписок, PetPin работает на 100% пассивно, не имеет батареек и служит вечно без подзарядки.

Если питомец потеряется, нашедший просто сканирует QR-код камерой смартфона — без скачивания приложений! Вы мгновенно получаете звуковое оповещение с точным адресом и живыми GPS-координатами на карте.

✨ ОСНОВНЫЕ ПРЕИМУЩЕСТВА:

📍 ТОЧНЫЙ GPS-ТРЕКИНГ И АДРЕС
Точный адрес и координаты (точность ±3м) приходят на телефон за доли секунды.

🏷️ СКАНИРОВАНИЕ БЕЗ ПРИЛОЖЕНИЯ
Любой смартфон считывает QR-код за 1 секунду и открывает экстренный профиль.

⚡ БЕЗ БАТАРЕЕК И 100% ВОДОНЕПРОНИЦАЕМЫЙ
Не требует зарядки. Невероятно легкий для кошек и собак любых пород.

📞 ЗВОНОК И WHATSAPP В 1 КЛИК
Нашедший может сразу позвонить владельцу или отправить координаты в WhatsApp.

🩺 ЦИФРОВОЙ ВЕТПАСПОРТ И ПРИВИВКИ
История вакцинации, аллергии и контакты ветклиники всегда под рукой.

🚨 РЕЖИМ SOS ПРИ ПОТЕРЕ
При сканировании звучит экстренный сигнал тревоги с инструкциями для нашедшего.

🛡️ БЕЗ ПОДПИСОК И БЕСПЛАТНО НАВСЕГДА
Никаких абонентских плат за связь. Создайте один раз — защищайте всю жизнь.

🐕 Скачайте PetPin бесплатно прямо сейчас и защитите своего любимца!"""
    },
    'ar': {
        'language': 'العربية',
        'title': 'PetPin: قلادة QR وتتبع أليف',
        'short_desc': 'قلادة QR ذكية بدون بطاريات وتتبع GPS مباشر للحيوانات الأليفة المفقودة.',
        'full_desc': """🐾 PetPin: النظام الذكي المتكامل لحماية ورعاية حيوانك الأليف عبر قلادة QR!

لا تقلق بعد اليوم بشأن ضياع قطتك أو كلبك. على عكس أجهزة تتبع GPS التقليدية التي تنفد بطاريتها وتتطلب اشتراكات شهرية، يعمل PetPin بدون أي بطاريات أو شحن مدى الحياة وبتقنية سلبية 100%.

عند فقدان أليفك، كل ما يحتاجه من يجده هو توجيه كاميرا هاتفه لمسح رمز QR دون الحاجة لتنزيل أي تطبيق! ستتلقى على الفور تنبيهاً صوتياً مع العنوان الدقيق وإحداثيات GPS المباشرة على الخريطة.

✨ أبرز المميزات:

📍 تتبع GPS مباشر وعنوان دقيق
تصلك إحداثيات الموقع بدقة (±3 أمتار) ومسار مباشر فور مسح القلادة.

🏷️ قلادة QR ذكية تعمل بدون تطبيقات
يمكن لأي هاتف ذكي قراءة الرمز في ثانية واحدة وفتح ملف الطوارئ.

⚡ بدون شحن ومقاومة للماء بنسبة 100%
خفيفة الوزن للقطط والكلاب ومصممة لتحمل الصدمات والماء دون بطاريات.

📞 اتصال وواتساب بلمسة واحدة
يمكن للمنقذ الاتصال بك فوراً أو إرسال الموقع عبر واتساب بنقرة واحدة.

🩺 سجل صحي ودفتر تطعيمات رقمي
احفظ بيانات التطعيمات، الحساسية، والأدوية وبيانات الطبيب البيطري.

🚨 درع الطوارئ عند الفقدان (SOS)
تفعيل وضع الفقدان يُطلق إنذاراً عالي الأولوية ويوفر إرشادات للمنقذ.

🛡️ بدون اشتراكات ومجاني مدى الحياة
لا توجد رسوم شهرية أو تكاليف مخفية.

🐕 حمل تطبيق PetPin مجاناً الآن واضمن أمان أليفك في كل خطوة!"""
    },
    'ja': {
        'language': '日本語',
        'title': 'PetPin: 充電不要スマートQR迷子札',
        'short_desc': '充電不要のスマートQR迷子札とリアルタイムGPS追跡で迷子ペットを保護。',
        'full_desc': """🐾 PetPin: 愛するペットを守る次世代スマートQR迷子札＆見守りアプリ！

大切なペットの迷子対策は万全ですか？ 毎日の充電が必要で高額な月額料金がかかる従来のGPS首輪とは異なり、PetPinは完全バッテリーフリー（無充電）で半永久的に使える画期的なスマート迷子札です。

万が一ペットが迷子になっても、保護した人がスマホのカメラでQRコードをかざすだけ！ アプリのインストールは不要で、飼い主のスマホへ正確な住所とリアルタイムGPS位置情報が即座に通知されます。

✨ 主な機能と特徴:

📍 リアルタイムGPS位置情報＆ナビゲーション
読み取り瞬時に詳細な住所と高精度GPS（誤差±3m）がマップ上に表示されます。

🏷️ アプリ不要で即座に読み取れるスマートQR
iPhoneでもAndroidでも、カメラをかざすだけで緊急プロフィールが1秒で開きます。

⚡ 充電不要＆完全防水のパッシブ設計
電池切れの心配はゼロ！ 羽のように軽く、水濡れや衝撃にも強い頑丈設計。

📞 ワンタップ直接通話＆メッセージ送信
保護者はワンタップで飼い主に直接電話や位置情報共有メッセージを送れます。

🩺 デジタル健康手帳＆アレルギー管理
ワクチン接種履歴、アレルギー、持病、かかりつけ動物病院の連絡先を一元管理。

🚨 迷子緊急SOSモード
迷子モードを有効にすると、タグ読み取り時にスマホから大音量のアラームが鳴ります。

🛡️ 月額料金なし・完全無料でずっと使える
追加の通信費や月額プランは一切ありません。

🐕 愛犬・愛猫の安全のために。今すぐPetPinを無料ダウンロードしましょう！"""
    },
    'ko': {
        'language': '한국어',
        'title': 'PetPin: 스마트 QR 반려동물 인식표',
        'short_desc': '충전 걱정 없는 스마트 QR 인식표와 실시간 GPS 위치 추적으로 미아 방지.',
        'full_desc': """🐾 PetPin: 소중한 반려동물을 위한 차세대 스마트 QR 안심 케어 시스템!

매일 충전해야 하고 비싼 월 구독료가 드는 무거운 GPS 목걸이는 이제 그만! PetPin은 100% 무전원 패시브 기술로 배터리 충전 없이 평생 동안 사용할 수 있는 스마트 반려동물 인식표입니다.

반려동물이 길을 잃었을 때, 발견자가 스마트폰 카메라로 QR 코드를 스캔하기만 하면 앱 설치 없이도 보호자에게 상세 주소와 실시간 GPS 위치가 알림으로 즉시 전송됩니다.

✨ 주요 핵심 기능:

📍 실시간 초정밀 GPS 위치 확인
스캔 즉시 오차 범위 ±3m의 상세 주소 및 실시간 경로가 지도에 표시됩니다.

🏷️ 앱 설치가 필요 없는 스마트 QR
모든 스마트폰 기본 카메라로 1초 만에 스캔하여 긴급 프로필을 확인할 수 있습니다.

⚡ 충전 필요 없음 & 100% 완전 방수
배터리가 방전될 걱정이 없습니다. 깃털처럼 가볍고 비와 물에 완벽히 안전합니다.

📞 원터치 직통 전화 & 메시지 연결
발견자가 번거로운 과정 없이 터치 한 번으로 보호자에게 바로 전화할 수 있습니다.

🩺 디지털 건강수첩 & 백신·알레르기 관리
예방접종 내역, 식이 알레르기, 동물병원 연락처를 디지털 프로필에 등록하세요.

🚨 실종 SOS 비상 보안 모드
실종 모드 활성화 시 인식표 스캔 즉시 스마트폰으로 긴급 경보음이 울립니다.

🛡️ 월 구독료 없는 평생 무료 혜택
통신비나 숨겨진 요금이 전혀 없습니다.

🐕 강아지와 고양이의 안전한 일상을 위해 지금 바로 PetPin을 다운로드하세요!"""
    },
    'zh': {
        'language': '简体中文',
        'title': 'PetPin: 智能防走失宠物QR吊牌',
        'short_desc': '终身免充电智能QR宠物吊牌，扫码即获实时GPS精确定位。',
        'full_desc': """🐾 PetPin：为爱宠量身打造的新一代智能防走失二维码吊牌！

告别传统 GPS 项圈每天充电和高昂月租的烦恼。PetPin 采用 100% 无源被动科技，无需任何电池与充电，轻盈耐用，终身长久守护爱宠。

当爱宠不慎走失时，好心人只需使用任意手机相机扫描吊牌上的二维码，无需下载任何 App，您的手机便会在毫秒间收到高精度 GPS 卫星定位与详细街道地址报警通知！

✨ 核心亮点与功能：

📍 实时高精 GPS 坐标与导航
扫码瞬间即可将拾到者的详细街道位置（±3米高精度）同步推送到您的手机地图。

🏷️ 无需下载应用，一扫即知
所有智能手机相机均可在 1 秒内识别二维码并打开专属紧急求助卡片。

⚡ 终身无需充电 & 全面防水耐摔
无需更换电池或插线充电，如羽毛般轻盈，猫咪狗狗佩戴无负担。

📞 一键电话直拨与即时联系
拾宠者可一键直拨主人电话或通过社交信息发送实时经纬度。

🩺 电子健康档案与过敏备忘
随时随地记录疫苗接种时间、食物过敏史、常去宠物医院与健康特别护理。

🚨 走失紧急 SOS 护盾模式
一键开启寻宠防线，一旦吊牌被扫描，手机立刻发出高优先级警报声。

🛡️ 零月租费用，终身免费使用
无任何内置扣费与卡费，一次绑定，终身守护。

🐕 随时随地保护您的毛孩子，立即免费下载 PetPin！"""
    },
    'pl': {
        'language': 'Polski',
        'title': 'PetPin: Inteligentna Adresówka',
        'short_desc': 'Adresówka QR bez baterii i śledzenie GPS na żywo dla zaginionych zwierząt.',
        'full_desc': """🐾 PetPin: Inteligentna adresówka QR nowej generacji dla Twojego pupila!

Zabezpiecz swojego psa lub kota przed zaginięciem. W przeciwieństwie do ciężkich lokalizatorów GPS, które rozładowują się po jednym dniu i wymagają drogiego abonamentu, PetPin działa w 100% pasywnie i bez konieczności ładowania.

W przypadku zaginięcia zwierzęcia, znalazca po prostu skanuje kod QR aparatem w telefonie – bez konieczności pobierania aplikacji! Natychmiast otrzymasz powiadomienie dźwiękowe z dokładnym adresem i współrzędnymi GPS na żywo.

✨ GŁÓWNE CECHY I ZALETY:

📍 LOKALIZACJA GPS NA ŻYWO I NAWIGACJA
Dokładny adres ulicy i precyzyjne współrzędne (±3m) natychmiast na Twoim telefonie.

🏷️ SYSTEM QR BEZ POTRZEBY APLIKACJI
Każdy smartfon może odczytać kod QR w ciągu 1 sekundy i otworzyć profil ratunkowy.

⚡ ZERO ŁADOWANIA & 100% WODOODPORNOŚĆ
Brak baterii, brak kabli. Niezwykle lekka adresówka, odporna na wodę i błoto.

📞 SZYBKI KONTAKT I TELEFON W 1 KLIK
Znalazca może natychmiast do Ciebie zadzwonić lub przesłać lokalizację przez WhatsApp.

🩺 CYFROWA KSIĄŻECZKA ZDROWIA I ALERGIE
Zapisz historię szczepień, alergie pokarmowe i kontakt do kliniki weterynaryjnej.

🚨 TRYB SOS ZAGINIĘCIA
Włącz tryb alarmowy: głośny dźwięk w telefonie po zeskanowaniu adresówki.

🛡️ ZERO ABONAMENTU I DARMOWE NA ZAWSZE
Brak opłat miesięcznych. Stała ochrona na całe życie zwierzęcia.

🐕 Pobierz PetPin za darmo już dziś i chroń swojego pupila!"""
    },
    'sv': {
        'language': 'Svenska',
        'title': 'PetPin: Smart QR Hundbricka',
        'short_desc': 'Batterifri smart QR-bricka och live GPS-spårning för bortsprungna djur.',
        'full_desc': """🐾 PetPin: Nästa generations smarta QR-bricka för dina husdjur!

Var trygg med att ditt husdjur alltid hittar hem. Till skillnad från tunga GPS-halsband som laddar ur och kräver dyra månadsabonnemang, är PetPin 100% passiv och fungerar helt utan batterier.

Om ditt husdjur försvinner kan upphittaren enkelt skanna QR-koden med sin mobilkamera – ingen app behövs! Du får omedelbart en notis med exakt gatuadress och GPS-koordinater på din karta.

✨ HUVUDFUNKTIONER:

📍 LIVE GPS-SPÅRNING OCH ADRESS
Exakt gatuadress och GPS-position (±3m precision) direkt till din telefon.

🏷️ SMART QR-BRICKA UTAN APP-KRAV
Kan skannas på en sekund med vilken iPhone eller Android som helst.

⚡ INGEN LADDNING & 100% VATTENTÄT
Inga sladdar, inga batteribyten. Fjäderlätt och tålig för alla väder.

📞 1-KLICK RING & WHATSAPP
Upphittaren kan ringa dig direkt eller skicka platsen via meddelande.

🩺 DIGITALT HÄLSOKORT & ALLERGIER
Spara vaccinationer, allergier och veterinärkontakt direkt i profilen.

🚨 BORTSPRUNGET SOS-LÄGE
Aktivera larmläget för ett högljutt nödlarm när brickan skannas.

🛡️ INGET ABONNEMANG & ALLTID GRATIS
Inga månadsavgifter eller dolda kostnader.

🐕 Ladda ner PetPin gratis idag och ge ditt husdjur det bästa skyddet!"""
    },
    'no': {
        'language': 'Norsk',
        'title': 'PetPin: Smart QR Kjæledyrtag',
        'short_desc': 'Batterifri smart QR-brikke og sanntids GPS-sporing for bortkomne dyr.',
        'full_desc': """🐾 PetPin: Den nye generasjonen smart QR-brikke for kjæledyret ditt!

Hold hunden eller katten din trygg til enhver tid. I motsetning til tunge GPS-halsbånd som må lades daglig og krever dyre abonnementer, er PetPin 100% passiv, fjærlett og trenger aldri lading.

Hvis kjæledyret ditt forsvinner, skanner finneren enkelt QR-koden med mobilkameraet – uten å laste ned noen app! Du mottar umiddelbart et varsel med nøyaktig gateadresse og GPS-posisjon i sanntid.

✨ NØKKELFUNKSJONER:

📍 SANNTIDS GPS-POSISJON & RUTE
Nøyaktig adresse og posisjon (±3m nøyaktighet) sendes umiddelbart til telefonen din.

🏷️ APP-FRI SMART QR-BRIKKE
Skannbar med alle smarttelefoner på ett sekund.

⚡ TRENGER ALDRI LADING & 100% VANNTETT
Ingen batterier, ingen kabler. Superlett og helt vanntett.

📞 1-TRYKKS RINGING & WHATSAPP
Finneren kan ringe deg direkte eller dele posisjonen med ett enkelt trykk.

🩺 DIGITALT HELSEKORT & ALLERGIER
Oppbevar vaksiner, allergier og veterinærkontakt trygt i profilen.

🚨 MISTET SOS-MODUS
Aktiver tapsmodus: Høy alarm på telefonen ved skanning.

🛡️ INGEN ABONNEMENTER & ALLTID GRATIS
Ingen månedlige avgifter. Livslang trygghet for kjæledyret ditt.

🐕 Last ned PetPin gratis i dag for full trygghet!"""
    },
    'da': {
        'language': 'Dansk',
        'title': 'PetPin: Smart QR Kæledyrstegn',
        'short_desc': 'Batterifrit smart QR-tegn og live GPS-sporing for bortkomne kæledyr.',
        'full_desc': """🐾 PetPin: Næste generations smarte QR-hundetegn til dine kæledyr!

Sørg for, at din hund eller kat altid er i sikkerhed. I modsætning til tunge GPS-halsbånd med kort batterilevetid og dyre abonnementer er PetPin 100% passivt og kræver aldrig opladning.

Hvis dit kæledyr bliver væk, behøver finderen blot at scanne QR-tegnet med mobilens kamera – helt uden at downloade en app! Du modtager straks en alarm med den nøjagtige adresse og live GPS-placering på dit kort.

✨ VIGTIGSTE FUNKTIONER:

📍 LIVE GPS-SPORING & RUTEVEJLEDNING
Præcis adresse og GPS-koordinater (±3m præcision) direkte på mobilen.

🏷️ SMART QR-TEGN UDEN APP-KRAV
Scannes på ét sekund med enhver smartphone.

⚡ INGEN OPLADNING & 100% VANDTÆT
Ingen batterier, ingen ledninger. Let som en fjer og fuldstændig vandtæt.

📞 1-KLIK OPKALD & WHATSAPP
Finderen kan ringe direkte til dig eller dele placeringen.

🩺 DIGITAL SUNDHEDSBOG & ALLERGIER
Gem vaccinationer, allergier og dyrlægens kontaktoplysninger.

🚨 FORSVUNDET SOS-SKJOLD
Aktivér nødskjoldet og modtag højlydt alarm, når tegnet scannes.

🛡️ INGEN ABONNEMENTER & GRATIS FOR ALTID
Ingen månedlige gebyrer. Livslang tryghed for dit kæledyr.

🐕 Hent PetPin gratis i dag og pas godt på din bedste ven!"""
    },
    'fi': {
        'language': 'Suomi',
        'title': 'PetPin: Älykäs QR Lemmikkitag',
        'short_desc': 'Latausvapaa äly-QR-laatta ja reaaliaikainen GPS-paikannus lemmikeille.',
        'full_desc': """🐾 PetPin: Uuden sukupolven älykäs QR-laatta lemmikkisi turvaksi!

Älä enää murehdi lemmikkisi katoamisesta. Toisin kuin painavat GPS-pannat, jotka vaativat jatkuvaa lataamista ja kalliita kuukausimaksuja, PetPin on 100% passiivinen ja toimii ikuisesti ilman latausta.

Jos lemmikkisi katoaa, löytäjä skannaa QR-koodin puhelimen kameralla – ilman sovelluksen latausta! Saat välittömästi ilmoituksen tarkan katuosoitteen ja reaaliaikaisen GPS-sijainnin kera.

✨ TÄRKEIMMÄT OMINAISUUDET:

📍 REAALIAIKAINEN GPS-PAIKANNUS JA REITTI
Tarkka osoite ja sijainti (±3m tarkkuus) suoraan puhelimeesi.

🏷️ SOVELLUSVAPAA ÄLY-QR-LAATTA
Skannattavissa millä tahansa älypuhelimella sekunnissa.

⚡ EI LATAUSTARVETTA & 100% VEDENPITÄVÄ
Ei paristoja eikä johtoja. Höyhenenkevyt ja täysin vedenkestävä.

📞 YHTEYS YHDELLÄ KOSKETUKSELLA
Löytäjä voi soittaa suoraan tai lähettää koordinaatit WhatsAppissa.

🩺 DIGITAALINEN TERVEYSKORTTI & ROKOTUKSET
Tallenna rokotukset, allergiat ja eläinlääkärin yhteystiedot profiiliin.

🚨 KADONNUT SOS-TURVAKILPI
Katoamistilassa puhelimesi hälyttää äänekkäästi heti laatan skannauksesta.

🛡️ EI KUUKAUSIMAKSUJA & AINA ILMAINEN
Ei piilokuluja tai SIM-korttimaksuja. Elinikäinen suoja lemmikillesi.

🐕 Lataa PetPin ilmaiseksi tänään ja varmista lemmikkisi turvallisuus!"""
    },
    'id': {
        'language': 'Bahasa Indonesia',
        'title': 'PetPin: Tag QR & GPS Hewan',
        'short_desc': 'Tag QR pintar tanpa baterai dan pelacakan GPS langsung untuk hewan peliharaan.',
        'full_desc': """🐾 PetPin: Ekosistem Keamanan Tag QR Pintar Generasi Baru untuk Hewan Peliharaan Anda!

Jangan pernah khawatir lagi kehilangan hewan peliharaan kesayangan Anda. Berbeda dengan pelacak GPS berat yang boros baterai dan memerlukan biaya langganan bulanan mahal, PetPin 100% pasif, sangat ringan, dan bekerja selamanya tanpa perlu dicas.

Saat hewan peliharaan Anda hilang, siapa pun yang menemukannya cukup memindai kode QR kalung dengan kamera HP – tanpa perlu mengunduh aplikasi apa pun! Anda akan langsung menerima pemberitahuan darurat beserta alamat jalan dan koordinat GPS langsung di peta Anda.

✨ FITUR & KEUNGGULAN UTAMA:

📍 PELACAKAN GPS LANGSUNG & RUTE CEPAT
Alamat jalan yang tepat dan koordinat GPS (akurasi ±3m) dikirim instan ke HP Anda.

🏷️ TAG QR PINTAR TANPA APLIKASI
Dapat dipindai oleh semua jenis smartphone dalam hitungan satu detik.

⚡ TANPA BATERAI & 100% TAHAN AIR
Bebas repot mengecas setiap hari. Sangat ringan untuk kucing dan anjing serta tahan cuaca ekstrem.

📞 1 KETUKAN TELEPON & WHATSAPP
Penemu hewan dapat langsung menelepon Anda atau membagikan lokasi via WhatsApp.

🩺 BUKU KESEHATAN DIGITAL & CATATAN ALERGI
Simpan riwayat vaksinasi, alergi makanan, dan kontak klinik dokter hewan di profil digital.

🚨 MODE SOS DARURAT HILANG
Aktifkan Mode Hilang untuk alarm prioritas tinggi saat tag dipindai.

🛡️ TANPA BIAYA BULANAN & GRATIS SELAMANYA
Tidak ada biaya langganan tersembunyi. Perlindungan seumur hidup untuk anabul Anda.

🐕 Unduh PetPin gratis sekarang dan jaga hewan kesayangan Anda selalu aman!"""
    },
    'hi': {
        'language': 'हिन्दी',
        'title': 'PetPin: स्मार्ट QR पेट टैग GPS',
        'short_desc': 'पालतू जानवरों के लिए बिना बैटरी का स्मार्ट QR कॉलर टैग और लाइव GPS ट्रैकिंग।',
        'full_desc': """🐾 PetPin: आपके पालतू जानवरों की सुरक्षा के लिए अगली पीढ़ी का स्मार्ट QR टैग!

अपने प्यारे कुत्ते या बिल्ली के खो जाने की चिंता को हमेशा के लिए अलविदा कहें। महंगे मासिक सब्सक्रिप्शन और रोज़ चार्ज होने वाले भारी GPS कॉलर के विपरीत, PetPin 100% पैसिव है, बहुत हल्का है और बिना किसी चार्जिंग के हमेशा काम करता है।

यदि आपका पालतू कभी खो जाता है, तो कोई भी व्यक्ति अपने स्मार्टफोन कैमरे से QR टैग को स्कैन कर सकता है – बिना कोई ऐप डाउनलोड किए! आपको तुरंत सटीक सड़क पते और लाइव GPS लोकेशन के साथ फोन पर अलर्ट प्राप्त होगा।

✨ प्रमुख विशेषताएं:

📍 लाइव GPS लोकेशन और सीधा नेविगेशन
टैग स्कैन होते ही सटीक पता और मैप लोकेशन (±3m सटीकता) आपके फोन पर पहुंच जाती है।

🏷️ बिना ऐप का स्मार्ट QR टैग
किसी भी स्मार्टफोन से 1 सेकंड में स्कैन करें और आपातकालीन प्रोफाइल देखें।

⚡ बिना बैटरी और 100% वाटरप्रूफ
रोज़ चार्ज करने का कोई झंझट नहीं। सभी नस्ल के कुत्तों और बिल्लियों के लिए हल्का और सुरक्षित।

📞 1-टैप कॉल और व्हाट्सएप संपर्क
पाने वाला व्यक्ति सीधे कॉल कर सकता है या व्हाट्सएप पर लोकेशन भेज सकता है।

🩺 डिजिटल स्वास्थ्य रिकॉर्ड और एलर्जी नोट्स
वैक्सीन, एलर्जी और पशु चिकित्सक के संपर्क हमेशा साथ रखें।

🚨 लॉस्ट SOS सुरक्षा मोड
खो जाने पर अलार्म चालू करें; स्कैन होते ही फोन में तेज़ सायरन बजेगा।

🛡️ कोई मासिक शुल्क नहीं, आजीवन मुफ्त
कोई छिपा हुआ शुल्क नहीं। जीवन भर की सुरक्षा।

🐕 आज ही PetPin मुफ्त में डाउनलोड करें और अपने पालतू को सुरक्षित रखें!"""
    }
}

def main():
    print("🚀 Generating Complete ASO Packages for 20 Languages...")
    total = 0
    
    for lang_code, data in ASO_DATA.items():
        # 1. Output directory in google_play_metadata
        lang_meta_dir = os.path.join(META_DIR, lang_code)
        os.makedirs(lang_meta_dir, exist_ok=True)
        
        # 2. Output directory in google_play_screenshots
        lang_ss_dir = os.path.join(SCREENSHOTS_DIR, lang_code)
        os.makedirs(lang_ss_dir, exist_ok=True)
        
        # Save individual txt files
        with open(os.path.join(lang_meta_dir, "title.txt"), "w", encoding="utf-8") as f:
            f.write(data['title'])
            
        with open(os.path.join(lang_meta_dir, "short_description.txt"), "w", encoding="utf-8") as f:
            f.write(data['short_desc'])
            
        with open(os.path.join(lang_meta_dir, "full_description.txt"), "w", encoding="utf-8") as f:
            f.write(data['full_desc'])
            
        with open(os.path.join(lang_meta_dir, "aso_package.json"), "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
            
        # Also copy aso_package.json to the screenshots directory for convenience
        with open(os.path.join(lang_ss_dir, "aso_metadata.json"), "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
            
        print(f"  ✓ [{lang_code.upper()} - {data['language']}] Title ({len(data['title'])}c) | Short ({len(data['short_desc'])}c)")
        total += 1
        
    print(f"\n🎉 SUCCESS! Generated {total} complete ASO text packages in: {META_DIR}")

if __name__ == '__main__':
    main()
