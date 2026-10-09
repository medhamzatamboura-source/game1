// STUB – remplacé par le contenu vérifié
window.WORLDS = [
 ["fr","🇫🇷","fr","ltr","Orange","5511","Paris","France-IX Paris","Bienvenue chez Orange – AS5511","#0b1030","#1a1f4a","#4da3ff","#ff7a00"],
 ["de","🇩🇪","de","ltr","Deutsche Telekom","3320","Frankfurt","DE-CIX Frankfurt","Willkommen bei der Telekom – AS3320","#0d0d14","#2a1030","#e20074","#ffcc00"],
 ["it","🇮🇹","it","ltr","Telecom Italia Sparkle","6762","Palermo","Sicily Hub Palermo","Benvenuti nella rete Sparkle – AS6762","#06130e","#10281e","#2ee59d","#ff3b3b"],
 ["eg","🇪🇬","ar","rtl","Telecom Egypt","8452","Cairo","Cairo landing station","مرحبًا بكم في المصرية للاتصالات","#0a0b22","#1d1838","#e8b04a","#ffd27a"],
 ["in","🇮🇳","hi","ltr","Tata Communications","6453","Mumbai","Mumbai landing station","टाटा कम्युनिकेशंस में स्वागत है","#0a0f1f","#1c1530","#ff9933","#22c55e"],
 ["cn","🇨🇳","zh-CN","ltr","China Telecom","4134","Shanghai","Shanghai PoP","欢迎来到中国电信 AS4134","#1a0505","#3a0a0a","#ff3b30","#ffd24d"],
 ["jp","🇯🇵","ja","ltr","NTT","2914","Tokyo","JPIX Tokyo","NTTネットワークへようこそ","#0a0a24","#1d1440","#ff7eb6","#ffffff"]
].map(a=>({id:a[0],flag:a[1],lang:a[2],dir:a[3],carrier:a[4],asn:+a[5],city:a[6],ix:a[7],welcome:{native:a[8],fr:a[8],en:a[8]},slogan:{native:"…",fr:"",en:""},
 palette:{sky1:a[9],sky2:a[10],lane:a[11],accent:a[12]},deco:["🌐","📡","🛰️"],hazards:{lat:"lat",loss:"loss",bit:"bit",jit:"jit",cong:"cong",loop:"loop",hacker:"hacker",ddos:"ddos",hijack:"hijack",cut:"cut",gate:"gate",maint:"maint"},
 alarms:{lat:"MINOR lat",loss:"MAJOR loss",bit:"MAJOR CRC",jit:"MINOR jit",cong:"MAJOR cong",loop:"CRITICAL loop",hacker:"CRITICAL mitm",ddos:"CRITICAL ddos",hijack:"CRITICAL hijack",cut:"CRITICAL LOS",gate:"MINOR acl",maint:"MINOR maint"},
 specials:[],culture:{emoji:"🎁",native:"gift",fr:"cadeau",en:"gift"},fact:{fr:"",en:""},hostnames:["r1","r2","r3"]}));
