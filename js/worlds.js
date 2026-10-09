// Généré à partir du workflow de contenu (rédaction + vérification adversariale), puis validé par build_content.js.
// 7 backbones MPLS : textes natifs, alarmes NOC, palette, culture.
window.WORLDS = [
 {
  "id": "fr",
  "flag": "🇫🇷",
  "lang": "fr",
  "dir": "ltr",
  "carrier": "Orange / Opentransit",
  "asn": 5511,
  "city": "Paris",
  "ix": "France-IX Paris",
  "palette": {
   "sky1": "#0b1026",
   "sky2": "#1c2150",
   "lane": "#4f8cff",
   "accent": "#ff5a6e"
  },
  "deco": [
   "🥖",
   "🧀",
   "🍷",
   "🎨",
   "🚲"
  ],
  "welcome": {
   "native": "Bienvenue sur Opentransit – AS5511",
   "fr": "Bienvenue sur Opentransit – AS5511",
   "en": "Welcome to Opentransit – AS5511"
  },
  "slogan": {
   "native": "Petit à petit, l'oiseau fait son nid",
   "fr": "Petit à petit, l'oiseau fait son nid",
   "en": "Little by little, the bird builds its nest"
  },
  "hazards": {
   "lat": "Latence",
   "loss": "Perte de paquets",
   "bit": "Erreur CRC",
   "jit": "Gigue",
   "cong": "Congestion",
   "loop": "Boucle de routage",
   "hacker": "Interception MITM",
   "ddos": "Attaque DDoS",
   "hijack": "Détournement BGP",
   "cut": "Coupure fibre",
   "gate": "Pare-feu / ACL",
   "maint": "Travaux programmés"
  },
  "alarms": {
   "lat": "MINOR par-cr01 Hu0/0/0/1: latence élevée 85 ms",
   "loss": "MAJOR par-pe01 Te0/1/0/2: perte de paquets 3 %",
   "bit": "MAJOR par-cr02 Hu0/0/0/4: erreurs CRC en hausse",
   "jit": "MINOR par-pe01 Te0/1/0/2: gigue au-delà du seuil",
   "cong": "MAJOR par-cr01 Hu0/0/0/1: lien saturé à 98 %",
   "loop": "CRITICAL par-cr02: boucle de routage, TTL expiré",
   "hacker": "CRITICAL par-pe01: interception MITM détectée",
   "ddos": "CRITICAL par-cr01: attaque DDoS 40 Gbit/s, RTBH activé",
   "hijack": "CRITICAL par-cr02: détournement BGP, origine AS64666",
   "cut": "CRITICAL par-cr01 Hu0/0/0/2: LOS, coupure fibre",
   "gate": "MINOR par-pe01: paquet rejeté par l'ACL CPE-IN",
   "maint": "MINOR par-cr02: travaux programmés 02:00–04:00"
  },
  "specials": [
   {
    "key": "arp",
    "native": "Empoisonnement ARP !",
    "fr": "Empoisonnement ARP !",
    "en": "ARP spoofing attack!"
   },
   {
    "key": "nat",
    "native": "NAT du CPE : adresse traduite",
    "fr": "NAT du CPE : adresse traduite",
    "en": "CPE NAT: address translated"
   }
  ],
  "culture": {
   "emoji": "🥐",
   "native": "Croissant",
   "fr": "Croissant",
   "en": "Croissant"
  },
  "fact": {
   "fr": "France-IX est présent à Paris et à Marseille, l'un des grands carrefours mondiaux de câbles sous-marins vers l'Afrique et l'Asie.",
   "en": "France-IX operates in Paris and Marseille, one of the world's major submarine-cable hubs linking Europe to Africa and Asia."
  },
  "hostnames": [
   "par-pe01",
   "par-cr01",
   "par-cr02"
  ]
 },
 {
  "id": "de",
  "flag": "🇩🇪",
  "lang": "de",
  "dir": "ltr",
  "carrier": "Deutsche Telekom",
  "asn": 3320,
  "city": "Frankfurt",
  "ix": "DE-CIX Frankfurt",
  "palette": {
   "sky1": "#0b0b14",
   "sky2": "#1e1530",
   "lane": "#e20074",
   "accent": "#ffcc00"
  },
  "deco": [
   "🏰",
   "🍺",
   "🌲",
   "🍎",
   "🎻"
  ],
  "welcome": {
   "native": "Willkommen im Netz der Telekom – AS3320",
   "fr": "Bienvenue sur le réseau Telekom – AS3320",
   "en": "Welcome to the Telekom network – AS3320"
  },
  "slogan": {
   "native": "Wer rastet, der rostet – weiter geht's!",
   "fr": "Qui se repose rouille – on continue !",
   "en": "Who rests, rusts – keep forwarding!"
  },
  "hazards": {
   "lat": "Latenz",
   "loss": "Paketverlust",
   "bit": "CRC-Fehler",
   "jit": "Jitter",
   "cong": "Datenstau",
   "loop": "Routing-Schleife",
   "hacker": "MITM-Angriff",
   "ddos": "DDoS-Angriff",
   "hijack": "BGP-Hijacking",
   "cut": "Glasfaserbruch",
   "gate": "Firewall / ACL",
   "maint": "Wartungsfenster"
  },
  "alarms": {
   "lat": "MINOR fra-cr01 Hu0/0/0/1: hohe Latenz 70 ms",
   "loss": "MAJOR fra-cr02 Hu0/0/0/3: Paketverlust 4 %",
   "bit": "MAJOR fra-pe01 Te0/0/0/5: CRC-Fehler nehmen zu",
   "jit": "MINOR fra-pe01 Te0/0/0/5: Jitter über Schwellwert",
   "cong": "MAJOR fra-cr01 Hu0/0/0/1: Link zu 97 % ausgelastet",
   "loop": "CRITICAL fra-cr02: Routing-Schleife, TTL abgelaufen",
   "hacker": "CRITICAL fra-pe01: MITM-Angriff erkannt",
   "ddos": "CRITICAL fra-cr01: DDoS-Angriff 60 Gbit/s, RTBH aktiv",
   "hijack": "CRITICAL fra-cr02: BGP-Hijack, falscher Origin AS64666",
   "cut": "CRITICAL fra-cr01 Hu0/0/0/2: LOS – Glasfaserbruch",
   "gate": "MINOR fra-pe01: Paket durch ACL EDGE-IN verworfen",
   "maint": "MINOR fra-cr02: Wartungsfenster 02:00–04:00 aktiv"
  },
  "specials": [
   {
    "key": "autobahn",
    "native": "Datenautobahn: freie Fahrt!",
    "fr": "Autoroute de l'info : sans limite !",
    "en": "Data Autobahn: no speed limit!"
   }
  ],
  "culture": {
   "emoji": "🥨",
   "native": "Brezel",
   "fr": "Bretzel",
   "en": "Pretzel"
  },
  "fact": {
   "fr": "Fondé en 1995 à Francfort, DE-CIX est l'un des plus grands points d'échange Internet au monde en trafic de pointe.",
   "en": "Founded in 1995 in Frankfurt, DE-CIX is one of the world's largest Internet exchanges by peak traffic."
  },
  "hostnames": [
   "fra-pe01",
   "fra-cr01",
   "fra-cr02"
  ]
 },
 {
  "id": "it",
  "flag": "🇮🇹",
  "lang": "it",
  "dir": "ltr",
  "carrier": "Telecom Italia Sparkle (Seabone)",
  "asn": 6762,
  "city": "Palermo",
  "ix": "Sicily Hub Palermo",
  "palette": {
   "sky1": "#06142e",
   "sky2": "#0f2a4a",
   "lane": "#19e3b1",
   "accent": "#ffd23f"
  },
  "deco": [
   "🍋",
   "🌋",
   "🍕",
   "🍝",
   "🏛️"
  ],
  "welcome": {
   "native": "Benvenuti nella rete Sparkle – AS6762",
   "fr": "Bienvenue sur le réseau Sparkle – AS6762",
   "en": "Welcome to the Sparkle network – AS6762"
  },
  "slogan": {
   "native": "Tutte le rotte passano per la Sicilia",
   "fr": "Toutes les routes passent par la Sicile",
   "en": "All routes run through Sicily"
  },
  "hazards": {
   "lat": "Latenza",
   "loss": "Perdita pacchetti",
   "bit": "Errori CRC",
   "jit": "Jitter",
   "cong": "Congestione",
   "loop": "Loop di routing",
   "hacker": "Attacco MITM",
   "ddos": "Attacco DDoS",
   "hijack": "Dirottamento BGP",
   "cut": "Taglio fibra",
   "gate": "Firewall / ACL",
   "maint": "Manutenzione"
  },
  "alarms": {
   "lat": "MINOR pal-cr01 Hu0/0/0/1: latenza elevata 60 ms",
   "loss": "MAJOR pal-cr01 Hu0/0/0/3: perdita pacchetti 4%",
   "bit": "MAJOR pal-cr02 Hu0/0/0/5: errori CRC in aumento",
   "jit": "MINOR pal-pe01 Te0/0/0/2: jitter oltre soglia",
   "cong": "MAJOR pal-cr02 Hu0/0/0/1: link saturo al 97%",
   "loop": "CRITICAL pal-cr01: loop di routing, TTL scaduto",
   "hacker": "CRITICAL pal-pe01: intercettazione MITM rilevata",
   "ddos": "CRITICAL pal-cr01: attacco DDoS 80 Gbit/s, RTBH attivo",
   "hijack": "CRITICAL pal-cr02: dirottamento BGP da AS64666",
   "cut": "CRITICAL pal-cr01 Hu0/0/0/2: LOS, taglio fibra",
   "gate": "MINOR pal-pe01: pacchetto scartato dall'ACL EDGE-IN",
   "maint": "MINOR pal-cr02: manutenzione programmata 02:00–05:00"
  },
  "specials": [
   {
    "key": "maint",
    "native": "Lavori in corso: corsia chiusa",
    "fr": "Travaux : voie fermée (maintenance)",
    "en": "Maintenance window: lane closed"
   },
   {
    "key": "espresso",
    "native": "Espresso NOC Sparkle: si vola!",
    "fr": "Espresso du NOC Sparkle : turbo !",
    "en": "Sparkle NOC espresso: turbo!"
   }
  ],
  "culture": {
   "emoji": "🍧",
   "native": "Granita siciliana",
   "fr": "Granita sicilienne",
   "en": "Sicilian granita"
  },
  "fact": {
   "fr": "Seabone (AS6762), le backbone IP mondial de Sparkle, est un réseau Tier-1 ; Sicily Hub à Palerme relie les câbles sous-marins méditerranéens.",
   "en": "Seabone (AS6762), Sparkle's global IP backbone, is a Tier-1 network; Sicily Hub in Palermo interconnects Mediterranean submarine cables."
  },
  "hostnames": [
   "pal-cr01",
   "pal-cr02",
   "pal-pe01"
  ]
 },
 {
  "id": "eg",
  "flag": "🇪🇬",
  "lang": "ar",
  "dir": "rtl",
  "carrier": "Telecom Egypt",
  "asn": 8452,
  "city": "Cairo",
  "ix": "Cairo – landing station",
  "palette": {
   "sky1": "#0b0928",
   "sky2": "#1f1747",
   "lane": "#e8b44c",
   "accent": "#3ad1c6"
  },
  "deco": [
   "🐪",
   "🏜️",
   "🌴",
   "⛵",
   "🚢"
  ],
  "welcome": {
   "native": "أهلاً بكم في المصرية للاتصالات – AS8452",
   "fr": "Bienvenue sur le réseau Telecom Egypt – AS8452",
   "en": "Welcome to the Telecom Egypt network – AS8452"
  },
  "slogan": {
   "native": "من يشرب من ماء النيل لا بد أن يعود إليه",
   "fr": "Qui a bu l'eau du Nil y reviendra forcément… comme un Echo Reply !",
   "en": "Drink from the Nile and you must return… like an Echo Reply!"
  },
  "hazards": {
   "lat": "تأخير مرتفع",
   "loss": "فقدان الحزم",
   "bit": "أخطاء CRC",
   "jit": "تذبذب التأخير",
   "cong": "ازدحام الشبكة",
   "loop": "حلقة توجيه",
   "hacker": "قرصان إلكتروني",
   "ddos": "هجوم DDoS",
   "hijack": "اختطاف BGP",
   "cut": "قطع كابل الألياف",
   "gate": "جدار الحماية",
   "maint": "نافذة صيانة"
  },
  "alarms": {
   "lat": "MAJOR cai-cr01 Hu0/0/0/1: تجاوز التأخير العتبة 85ms",
   "loss": "MAJOR cai-cr01 Hu0/0/0/3: فقدان حزم بنسبة 4%",
   "bit": "MINOR cai-pe01 Te0/1/0/2: أخطاء CRC في الاستقبال",
   "jit": "MINOR suz-cr01 Hu0/0/0/2: تذبذب التأخير بلغ 25ms",
   "cong": "MAJOR cai-cr01 Hu0/0/0/4: ازدحام، إشغال الوصلة 98%",
   "loop": "CRITICAL cai-pe01: حلقة توجيه – انتهاء صلاحية TTL",
   "hacker": "CRITICAL suz-cr01: رصد اعتراض مشبوه لحركة المرور من AS64666",
   "ddos": "CRITICAL cai-pe01 Hu0/0/0/0: هجوم DDoS بمعدل 40Gbps",
   "hijack": "CRITICAL cai-cr01: اختطاف BGP، بادئة معلنة من AS64666",
   "cut": "CRITICAL suz-cr01 Hu0/0/0/1: LOS – انقطاع الكابل البحري",
   "gate": "MINOR cai-pe01: قائمة ACL رفضت حزمة ICMP واردة",
   "maint": "WARNING suz-cr01: بدء نافذة الصيانة المجدولة 02:00 UTC"
  },
  "specials": [
   {
    "key": "anchor",
    "native": "مرساة سفينة تقطع الكابل!",
    "fr": "Une ancre de navire coupe le câble !",
    "en": "Ship anchor cuts the cable!"
   },
   {
    "key": "sandstorm",
    "native": "عاصفة رملية تزيد التأخير",
    "fr": "Tempête de sable : latence en hausse",
    "en": "Sandstorm: latency rising"
   }
  ],
  "culture": {
   "emoji": "🧆",
   "native": "طعمية",
   "fr": "Ta'ameya (falafel égyptien)",
   "en": "Ta'ameya (Egyptian falafel)"
  },
  "fact": {
   "fr": "De nombreux câbles sous-marins Europe–Asie, comme les SEA-ME-WE, traversent l'Égypte par voie terrestre entre Méditerranée et mer Rouge.",
   "en": "Many Europe–Asia submarine cables, such as the SEA-ME-WE systems, cross Egypt overland between the Mediterranean and the Red Sea."
  },
  "hostnames": [
   "cai-pe01",
   "cai-cr01",
   "suz-cr01"
  ]
 },
 {
  "id": "in",
  "flag": "🇮🇳",
  "lang": "hi",
  "dir": "ltr",
  "carrier": "Tata Communications",
  "asn": 6453,
  "city": "Mumbai",
  "ix": "Mumbai landing station",
  "palette": {
   "sky1": "#06102a",
   "sky2": "#1b1446",
   "lane": "#ff9933",
   "accent": "#3fe07a"
  },
  "deco": [
   "🦚",
   "🐘",
   "🛺",
   "🪁",
   "🍛"
  ],
  "welcome": {
   "native": "टाटा कम्युनिकेशंस में स्वागत है – AS6453",
   "fr": "Bienvenue sur le réseau Tata Communications – AS6453",
   "en": "Welcome to the Tata Communications network – AS6453"
  },
  "slogan": {
   "native": "जहाँ चाह, वहाँ राह",
   "fr": "Là où il y a une volonté, il y a une route",
   "en": "Where there's a will, there's a route"
  },
  "hazards": {
   "lat": "उच्च लेटेंसी",
   "loss": "पैकेट लॉस",
   "bit": "बिट त्रुटि (CRC)",
   "jit": "जिटर",
   "cong": "नेटवर्क जाम",
   "loop": "रूटिंग लूप",
   "hacker": "हैकर की घुसपैठ",
   "ddos": "DDoS हमला",
   "hijack": "BGP हाईजैक",
   "cut": "फ़ाइबर कट",
   "gate": "फ़ायरवॉल / ACL",
   "maint": "मेंटेनेंस विंडो"
  },
  "alarms": {
   "lat": "MAJOR bom-cr01 Hu0/0/0/1: लेटेंसी थ्रेशोल्ड पार, 140ms",
   "loss": "MAJOR bom-cr01 Hu0/0/0/3: पैकेट लॉस 5%",
   "bit": "MINOR bom-pe01 Te0/2/0/1: इनपुट पर CRC त्रुटियाँ",
   "jit": "MINOR bom-cr02 Hu0/0/0/2: जिटर 30ms तक पहुँचा",
   "cong": "MAJOR bom-cr01 Hu0/0/0/4: कंजेशन, लिंक उपयोग 97%",
   "loop": "CRITICAL bom-pe01: रूटिंग लूप, TTL एक्सपायर",
   "hacker": "CRITICAL bom-cr02: AS64666 से संदिग्ध MITM इंटरसेप्शन",
   "ddos": "CRITICAL bom-pe01 Hu0/0/0/0: DDoS हमला, 35Gbps",
   "hijack": "CRITICAL bom-cr01: BGP हाईजैक, AS64666 ने प्रीफ़िक्स चुराया",
   "cut": "CRITICAL bom-cr02 Hu0/0/0/1: LOS, सबमरीन केबल कट",
   "gate": "MINOR bom-pe01: ACL ने ICMP पैकेट ड्रॉप किया",
   "maint": "WARNING bom-cr02: मेंटेनेंस विंडो शुरू, 02:00 IST"
  },
  "specials": [
   {
    "key": "monsoon",
    "native": "मानसून की बारिश, लिंक कमज़ोर",
    "fr": "Mousson : liens dégradés",
    "en": "Monsoon rain: links degraded"
   },
   {
    "key": "cricket",
    "native": "क्रिकेट बॉल – बच के!",
    "fr": "Balle de cricket – attention !",
    "en": "Cricket ball – duck!"
   }
  ],
  "culture": {
   "emoji": "🥭",
   "native": "हापुस आम",
   "fr": "Mangue Alphonso",
   "en": "Alphonso mango"
  },
  "fact": {
   "fr": "L'AS6453 de Tata Communications vient de Teleglobe, opérateur né au Canada et racheté en 2005-2006 par l'indien VSNL, rebaptisé Tata Communications en 2008.",
   "en": "Tata Communications' AS6453 comes from Teleglobe, a carrier born in Canada and bought in 2005-06 by India's VSNL, renamed Tata Communications in 2008."
  },
  "hostnames": [
   "bom-pe01",
   "bom-cr01",
   "bom-cr02"
  ]
 },
 {
  "id": "cn",
  "flag": "🇨🇳",
  "lang": "zh-CN",
  "dir": "ltr",
  "carrier": "China Telecom",
  "asn": 4134,
  "city": "Shanghai",
  "ix": "Shanghai PoP",
  "palette": {
   "sky1": "#12040a",
   "sky2": "#3a0b12",
   "lane": "#ff4545",
   "accent": "#ffc93c"
  },
  "deco": [
   "🏮",
   "🐉",
   "🐼",
   "🍵",
   "🥟"
  ],
  "welcome": {
   "native": "欢迎来到中国电信163骨干网 – AS4134",
   "fr": "Bienvenue sur le backbone 163 de China Telecom – AS4134",
   "en": "Welcome to China Telecom's 163 backbone – AS4134"
  },
  "slogan": {
   "native": "千里之行，始于第一跳",
   "fr": "Un voyage de mille li commence par le premier saut",
   "en": "A journey of a thousand miles begins with the first hop"
  },
  "hazards": {
   "lat": "高时延",
   "loss": "丢包",
   "bit": "CRC误码",
   "jit": "抖动",
   "cong": "链路拥塞",
   "loop": "路由环路",
   "hacker": "中间人攻击",
   "ddos": "DDoS攻击",
   "hijack": "BGP劫持",
   "cut": "光缆中断",
   "gate": "防火墙/ACL",
   "maint": "维护窗口"
  },
  "alarms": {
   "lat": "MINOR sha-cr01 100GE1/0/0: 时延升高至180ms",
   "loss": "MAJOR sha-cr02 100GE2/0/1: 丢包率5%",
   "bit": "MAJOR sha-pe01 GE0/1/2: CRC误码超阈值",
   "jit": "MINOR sha-cr01 100GE1/0/1: 抖动达35ms",
   "cong": "MAJOR sha-cr02 100GE1/0/3: 链路拥塞，利用率98%",
   "loop": "CRITICAL sha-cr01: 检测到路由环路，TTL超时",
   "hacker": "CRITICAL sha-pe01: 疑似中间人攻击，来源AS64666",
   "ddos": "CRITICAL sha-cr02: DDoS攻击，入向流量80Gbps",
   "hijack": "CRITICAL sha-cr01: BGP劫持，AS64666通告我方前缀",
   "cut": "CRITICAL sha-cr02 100GE3/0/0: LOS，光缆中断",
   "gate": "MINOR sha-pe01: ACL 3001拦截ICMP报文",
   "maint": "MINOR sha-cr01: 计划割接02:00-04:00，流量切换"
  },
  "specials": [
   {
    "key": "cn2",
    "native": "CN2 GIA 精品低时延通道",
    "fr": "Voie premium CN2 GIA basse latence",
    "en": "CN2 GIA premium low-latency lane"
   },
   {
    "key": "gate",
    "native": "边界ACL安全检查",
    "fr": "Contrôle ACL en bordure de réseau",
    "en": "Network-edge ACL check"
   },
   {
    "key": "dragon",
    "native": "舞龙来啦，注意避让！",
    "fr": "La danse du dragon arrive : esquive !",
    "en": "Dragon dance incoming: dodge it!"
   }
  ],
  "culture": {
   "emoji": "🧧",
   "native": "红包",
   "fr": "Enveloppe rouge (hongbao)",
   "en": "Red envelope (hongbao)"
  },
  "fact": {
   "fr": "China Telecom exploite deux grands backbones IP : ChinaNet « 163 » (AS4134) et CN2 (AS4809), son réseau premium à faible latence.",
   "en": "China Telecom runs two main IP backbones: ChinaNet '163' (AS4134) and CN2 (AS4809), its premium low-latency network."
  },
  "hostnames": [
   "sha-pe01",
   "sha-cr01",
   "sha-cr02"
  ]
 },
 {
  "id": "jp",
  "flag": "🇯🇵",
  "lang": "ja",
  "dir": "ltr",
  "carrier": "NTT",
  "asn": 2914,
  "city": "Tokyo",
  "ix": "JPIX Tokyo",
  "palette": {
   "sky1": "#090a24",
   "sky2": "#1c1a52",
   "lane": "#ff8fcf",
   "accent": "#ff6a3d"
  },
  "deco": [
   "🌸",
   "🗻",
   "🏯",
   "🚅",
   "🎏"
  ],
  "welcome": {
   "native": "NTTネットワークへようこそ – AS2914",
   "fr": "Bienvenue sur le réseau NTT – AS2914",
   "en": "Welcome to the NTT network – AS2914"
  },
  "slogan": {
   "native": "急がば回れ — 最短経路が最速とは限らない",
   "fr": "Hâte-toi lentement : le plus court chemin n'est pas toujours le plus rapide",
   "en": "More haste, less speed: the shortest path isn't always the fastest"
  },
  "hazards": {
   "lat": "遅延増大",
   "loss": "パケットロス",
   "bit": "CRCエラー",
   "jit": "ジッタ",
   "cong": "輻輳",
   "loop": "ルーティングループ",
   "hacker": "中間者攻撃",
   "ddos": "DDoS攻撃",
   "hijack": "BGPハイジャック",
   "cut": "光ファイバ断線",
   "gate": "ファイアウォール",
   "maint": "計画メンテナンス"
  },
  "alarms": {
   "lat": "MINOR tyo-cr01 et-0/0/1: 遅延増大 RTT 210ms",
   "loss": "MAJOR tyo-cr02 et-0/0/2: パケットロス 3%",
   "bit": "MAJOR tyo-pe01 xe-1/0/0: CRCエラー多発",
   "jit": "MINOR tyo-cr01 et-0/0/1: ジッタ閾値超過 (40ms)",
   "cong": "MAJOR tyo-cr02 et-0/0/3: 輻輳発生 使用率97%",
   "loop": "CRITICAL tyo-cr01: ルーティングループ検出 TTL超過",
   "hacker": "CRITICAL tyo-pe01: 中間者攻撃の疑い 送信元AS64666",
   "ddos": "CRITICAL tyo-cr02: DDoS攻撃検知 流入80Gbps",
   "hijack": "CRITICAL tyo-cr01: BGPハイジャック検知 (AS64666)",
   "cut": "CRITICAL tyo-cr02 et-0/0/0: LOS 光ファイバ断線",
   "gate": "MINOR tyo-pe01: ACLでICMPパケットを破棄",
   "maint": "MINOR tyo-cr01: 計画メンテナンス 02:00-05:00 JST"
  },
  "specials": [
   {
    "key": "quake",
    "native": "緊急地震速報！回線が揺れる",
    "fr": "Alerte séisme ! Les liens tremblent",
    "en": "Earthquake early warning! Links shaking"
   },
   {
    "key": "shinkansen",
    "native": "新幹線レーン 爆速転送！",
    "fr": "Voie Shinkansen : transfert éclair !",
    "en": "Shinkansen lane: bullet-speed forwarding!"
   }
  ],
  "culture": {
   "emoji": "🍣",
   "native": "寿司",
   "fr": "Sushi",
   "en": "Sushi"
  },
  "fact": {
   "fr": "AS2914, le Global IP Network de NTT, est l'un des rares réseaux Tier 1 : il atteint tout Internet sans acheter de transit IP.",
   "en": "AS2914, NTT's Global IP Network, is one of the few Tier-1 networks: it reaches the whole Internet without buying IP transit."
  },
  "hostnames": [
   "tyo-pe01",
   "tyo-cr01",
   "tyo-cr02"
  ]
 }
];
