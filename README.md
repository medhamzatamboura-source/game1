# 📡 PING RUNNER – NOC World Tour

Jeu éducatif (FR/EN) pour ingénieurs NOC : tu es une **trame ICMP Echo Request** qui part d'un LAN client à Paris et traverse **7 backbones MPLS** (7 AS) jusqu'à un serveur à Tokyo.

| # | AS | Opérateur | Langue / ambiance |
|---|----|-----------|-------------------|
| 1 | AS5511 | Orange (Opentransit) | 🇫🇷 français – LAN client, ARP spoofing |
| 2 | AS3320 | Deutsche Telekom | 🇩🇪 allemand – voies « Autobahn » |
| 3 | AS6762 | Telecom Italia Sparkle (Seabone) | 🇮🇹 italien – fenêtres de maintenance, détournement BGP |
| 4 | AS8452 | Telecom Egypt | 🇪🇬 arabe – ancres qui coupent les câbles sous-marins |
| 5 | AS6453 | Tata Communications | 🇮🇳 hindi – mousson, balles de cricket |
| 6 | AS4134 | China Telecom | 🇨🇳 chinois – voie CN2, pare-feu, danse du dragon |
| 7 | AS2914 | NTT | 🇯🇵 japonais – séismes, voie Shinkansen |

## Jouer

1. Télécharge le dépôt (**Code → Download ZIP**) et décompresse-le.
2. Ouvre `index.html` dans Chrome, Firefox, Edge ou Safari (aucune installation, fonctionne hors ligne).

Modes : **Solo**, **Solo contre le bot NOC**, **2 joueurs sur le même écran** (écran partagé).

| | Joueur 1 | Joueur 2 | Solo |
|---|---|---|---|
| Monter / descendre | `Z`/`W` · `S` | `↑` · `↓` | `↑ ↓` ou `Z/W S` |
| FRR (Fast ReRoute) | `D` | `→` | `Espace`, `→` ou `D` |
| Réponse quiz A/B/C | `1` `2` `3` | `J` `K` `L` (ou pavé num. 1 2 3) | `1` `2` `3` |

Mobile / tablette : glisse vers le haut ou le bas dans ta moitié d'écran, touche pour le FRR, ou utilise les boutons sous le jeu. `Échap` = pause, `M` = son.

## Règles

- **Dangers** : latence, perte de paquets, erreurs CRC, gigue, congestion, boucles de routage (TTL −10), pirates MITM qui foncent sur toi, vagues DDoS, faux préfixes /25 (détournement BGP), coupures de fibre, fenêtres de maintenance, pare-feu (prends la voie **ICMP**).
- **Bonus** : ⭐ QoS DSCP EF, 🧩 FEC, 🔒 MACsec/IPsec, 🛡️ RPKI, ⚔️ sabotage (envoie un DDoS chez l'adversaire), spécialité culturelle de chaque pays.
- **FRR** : ta compétence (0,8 s d'invulnérabilité + bond en avant, recharge 7 s), réinitialisée par une bonne réponse au quiz.
- **Quiz NOC toutes les 30 s** : le jeu se fige. Bonne réponse = +10 santé (+5 pour le plus rapide). Mauvaise réponse = −5 santé.
- **Gagnant** : le meilleur *score qualité* à l'arrivée  
  `santé × 10 − perte % × 50 − erreurs CRC × 3 − incidents sécurité × 40 − trames détruites × 150`.  
  Le jeu affiche ensuite un rapport **MTR** par AS et une sortie **ping** pour chaque joueur.

## Fichiers

- `index.html` – page et styles
- `js/game.js` – moteur (écran partagé, génération identique des mondes pour les deux joueurs, bot, quiz, résultats)
- `js/worlds.js` – les 7 AS : textes en langue locale, alarmes NOC, palette, culture
- `js/quiz.js` – banque de questions NOC (BGP, MPLS, dépannage, optique, sécurité, ITIL…)
- `js/i18n.js` – textes de l'interface FR/EN

Les noms de routeurs sont fictifs. Les ASN et opérateurs réels sont utilisés à titre pédagogique.
