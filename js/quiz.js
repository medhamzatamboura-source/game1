// Généré à partir du workflow de contenu (rédaction + vérification adversariale), puis validé par build_content.js.
// Banque de questions NOC (FR/EN). a[0] est la bonne réponse ; le jeu mélange les options.
window.QUIZ = [
 {
  "id": "bgp-01",
  "world": "any",
  "topic": "bgp",
  "lvl": 1,
  "q": {
   "fr": "Ta session BGP vers l'upstream affiche « Active ». Est-elle montée et échange-t-elle des routes ?",
   "en": "Your BGP session to the upstream shows 'Active'. Is it up and exchanging routes?"
  },
  "a": [
   {
    "fr": "Non : elle essaie encore d'ouvrir la session TCP",
    "en": "No: it's still trying to open the TCP session"
   },
   {
    "fr": "Oui : Active est l'état normal de fonctionnement",
    "en": "Yes: Active is the normal working state"
   },
   {
    "fr": "Non : elle est en shutdown administratif",
    "en": "No: it's administratively shut down"
   }
  ],
  "exp": {
   "fr": "Seul Established signifie que les routes circulent. En Active, la session TCP (port 179) n'est pas montée et le routeur réessaie : vérifie joignabilité, ACL, IP et AS du peer.",
   "en": "Only Established means routes are flowing. In Active, the TCP session (port 179) isn't up and the router keeps retrying: check reachability, ACLs, peer IP and AS."
  }
 },
 {
  "id": "bgp-02",
  "world": "any",
  "topic": "bgp",
  "lvl": 1,
  "q": {
   "fr": "Une route eBGP arrive avec ton propre ASN déjà présent dans l'AS_PATH. Que fait ton routeur par défaut ?",
   "en": "An eBGP route arrives with your own ASN already in its AS_PATH. What does your router do by default?"
  },
  "a": [
   {
    "fr": "Il la rejette : c'est l'anti-boucle de BGP",
    "en": "Drops it: that's BGP loop prevention"
   },
   {
    "fr": "Il l'installe avec une LOCAL_PREF plus haute",
    "en": "Installs it with a higher LOCAL_PREF"
   },
   {
    "fr": "Il la transmet uniquement aux peers iBGP",
    "en": "Forwards it to iBGP peers only"
   }
  ],
  "exp": {
   "fr": "Voir son propre ASN dans l'AS_PATH signifie que la route est déjà passée par cet AS : elle est rejetée. « allowas-in » contourne la règle, par ex. pour des sites VPN partageant le même ASN.",
   "en": "Seeing its own ASN in the AS_PATH means the route already crossed this AS, so it's discarded. 'allowas-in' overrides this, e.g. for VPN sites sharing one ASN."
  }
 },
 {
  "id": "bgp-03",
  "world": "any",
  "topic": "bgp",
  "lvl": 1,
  "q": {
   "fr": "Pourquoi configurer un max-prefix sur une session eBGP client ?",
   "en": "Why set a max-prefix limit on an eBGP session with a customer?"
  },
  "a": [
   {
    "fr": "Pour couper la session si le client annonce trop de routes (leak)",
    "en": "To drop the session if the customer leaks too many routes"
   },
   {
    "fr": "Pour limiter le débit du client à un nombre fixe de Mbps",
    "en": "To cap the customer's bandwidth at a fixed number of Mbps"
   },
   {
    "fr": "Pour accélérer la reconvergence BGP après un flap du lien",
    "en": "To make BGP reconverge faster after a link flap"
   }
  ],
  "exp": {
   "fr": "Si un client réannonce par erreur une full table, le max-prefix coupe la session avant que le leak se propage. Un seuil d'alerte (ex. 80 %) prévient le NOC avant.",
   "en": "If a customer accidentally re-announces a full table, max-prefix tears the session down before the leak spreads. A warning threshold (e.g. 80 %) alerts the NOC first."
  }
 },
 {
  "id": "bgp-04",
  "world": "any",
  "topic": "bgp",
  "lvl": 2,
  "q": {
   "fr": "Chemin A : LOCAL_PREF 200, AS_PATH de 5 AS. Chemin B : LOCAL_PREF 100, AS_PATH de 2 AS. Lequel est le meilleur ?",
   "en": "Path A: LOCAL_PREF 200, AS_PATH of 5 ASNs. Path B: LOCAL_PREF 100, AS_PATH of 2 ASNs. Which one is best?"
  },
  "a": [
   {
    "fr": "A : la LOCAL_PREF est comparée avant l'AS_PATH",
    "en": "Path A: LOCAL_PREF is checked before AS_PATH"
   },
   {
    "fr": "B : l'AS_PATH le plus court est toujours comparé en premier",
    "en": "Path B: shortest AS_PATH is always checked first"
   },
   {
    "fr": "Les deux : BGP fait du load-balancing par défaut",
    "en": "Both: BGP load-balances them by default"
   }
  ],
  "exp": {
   "fr": "La LOCAL_PREF la plus haute gagne avant même de regarder la longueur d'AS_PATH. C'est le levier classique pour choisir sa sortie (ex. préférer le peering au transit).",
   "en": "Highest LOCAL_PREF wins before AS_PATH length is even looked at. It's the classic knob to choose your exit point (e.g. prefer peering over transit)."
  }
 },
 {
  "id": "bgp-05",
  "world": "any",
  "topic": "bgp",
  "lvl": 2,
  "q": {
   "fr": "Des routes apprises en eBGP puis relayées en iBGP ont un next hop injoignable sur tes routeurs cœur. Correctif classique ?",
   "en": "Routes learned via eBGP and relayed over iBGP show an unreachable next hop on your core routers. Classic fix?"
  },
  "a": [
   {
    "fr": "Configurer next-hop-self sur les sessions iBGP du routeur de bordure",
    "en": "Configure next-hop-self on the border router's iBGP sessions"
   },
   {
    "fr": "Augmenter la LOCAL_PREF de ces routes sur le routeur de bordure",
    "en": "Raise the LOCAL_PREF of these routes on the border router"
   },
   {
    "fr": "Activer le dampening sur la session eBGP du routeur de bordure",
    "en": "Enable route dampening on the border router's eBGP session"
   }
  ],
  "exp": {
   "fr": "L'iBGP conserve le next hop eBGP tel quel. Si ce lien externe n'est pas dans l'IGP, il est injoignable. next-hop-self le remplace par la loopback du routeur de bordure.",
   "en": "iBGP keeps the eBGP next hop unchanged. If that external link isn't in the IGP, it's unresolvable. next-hop-self swaps it for the border router's loopback."
  }
 },
 {
  "id": "bgp-06",
  "world": "any",
  "topic": "bgp",
  "lvl": 2,
  "q": {
   "fr": "Pourquoi l'iBGP a-t-il besoin d'un full mesh ou de route reflectors ?",
   "en": "Why does iBGP need a full mesh or route reflectors?"
  },
  "a": [
   {
    "fr": "Une route apprise en iBGP n'est pas réannoncée aux autres peers iBGP",
    "en": "An iBGP-learned route isn't re-advertised to other iBGP peers"
   },
   {
    "fr": "Une session iBGP ne peut transporter que 1 000 préfixes au maximum",
    "en": "An iBGP session can carry at most 1,000 prefixes"
   },
   {
    "fr": "Les voisins iBGP doivent être sur le même sous-réseau connecté",
    "en": "iBGP neighbors must be directly connected on the same subnet"
   }
  ],
  "exp": {
   "fr": "Cette règle de split horizon iBGP évite les boucles dans l'AS. Un route reflector l'assouplit et s'appuie sur ORIGINATOR_ID et CLUSTER_LIST pour rester sans boucle.",
   "en": "This iBGP split-horizon rule avoids loops inside the AS. A route reflector relaxes it and relies on ORIGINATOR_ID and CLUSTER_LIST to stay loop-free."
  }
 },
 {
  "id": "bgp-07",
  "world": "any",
  "topic": "bgp",
  "lvl": 2,
  "q": {
   "fr": "Une session BGP tombe avec « hold timer expired ». Que s'est-il passé ?",
   "en": "A BGP session drops with 'hold timer expired'. What actually happened?"
  },
  "a": [
   {
    "fr": "Aucun KEEPALIVE ni UPDATE reçu pendant le hold time",
    "en": "No KEEPALIVE or UPDATE was received within the hold time"
   },
   {
    "fr": "Le peer a dépassé la limite max-prefix de la session",
    "en": "The peer exceeded the max-prefix limit set on the session"
   },
   {
    "fr": "Une route avec un AS_PATH trop long a été reçue et rejetée",
    "en": "A route with an overly long AS_PATH was received and rejected"
   }
  ],
  "exp": {
   "fr": "Les keepalives partent tous les 1/3 du hold time (180 s par défaut chez Cisco, 90 s chez Juniper). Pistes : pertes sur le lien, control plane saturé, souci de MTU sur les gros UPDATE.",
   "en": "Keepalives are sent every 1/3 of the hold time (180 s default on Cisco, 90 s on Juniper). Suspect link loss, a saturated control plane or an MTU issue on large UPDATEs."
  }
 },
 {
  "id": "bgp-08",
  "world": "any",
  "topic": "bgp",
  "lvl": 3,
  "q": {
   "fr": "Par défaut, entre quels chemins BGP le MED est-il comparé ?",
   "en": "By default, between which BGP paths is MED compared?"
  },
  "a": [
   {
    "fr": "Les chemins reçus du même AS voisin",
    "en": "Paths received from the same neighboring AS"
   },
   {
    "fr": "Tous les chemins, quel que soit l'AS d'origine",
    "en": "Any paths, whatever AS they come from"
   },
   {
    "fr": "Uniquement les chemins appris en iBGP",
    "en": "Only paths learned from iBGP peers"
   }
  ],
  "exp": {
   "fr": "Le MED est l'indication d'un voisin sur son lien d'entrée préféré (le plus bas gagne). Il n'est comparé qu'entre chemins du même AS voisin, sauf avec always-compare-med.",
   "en": "MED is a neighbor's hint about its preferred entry link (lower wins). It's only compared between paths from the same neighbor AS, unless always-compare-med is set."
  }
 },
 {
  "id": "security-01",
  "world": "any",
  "topic": "security",
  "lvl": 1,
  "q": {
   "fr": "Un DDoS de 300 Gbps frappe un client. Que fait un centre de scrubbing de ce trafic ?",
   "en": "A 300 Gbps DDoS hits a customer. What does a scrubbing center do with that traffic?"
  },
  "a": [
   {
    "fr": "Il filtre l'attaque et renvoie le trafic propre au client",
    "en": "Filters out the attack and returns clean traffic"
   },
   {
    "fr": "Il jette tout le trafic vers l'IP du client, bon ou mauvais",
    "en": "Drops all traffic to the customer's IP, good and bad"
   },
   {
    "fr": "Il chiffre le trafic pour que l'attaquant ne le lise pas",
    "en": "Encrypts the traffic so the attacker can't read it"
   }
  ],
  "exp": {
   "fr": "Le trafic est dévié vers le scrubber (souvent via une annonce BGP), nettoyé, puis renvoyé via GRE ou une VRF dédiée. Contrairement au RTBH, les clients légitimes passent.",
   "en": "Traffic is diverted to the scrubber (often via a BGP announcement), cleaned, then sent back over GRE or a dedicated VRF. Unlike RTBH, legit users still get through."
  }
 },
 {
  "id": "security-02",
  "world": "any",
  "topic": "security",
  "lvl": 2,
  "q": {
   "fr": "Un ROA autorise 203.0.113.0/24 uniquement depuis AS65001. Le pirate AS64666 annonce 203.0.113.0/24. Statut RPKI ?",
   "en": "A ROA allows 203.0.113.0/24 from AS65001 only. Pirate AS64666 announces 203.0.113.0/24. RPKI status?"
  },
  "a": [
   {
    "fr": "Invalid : l'AS d'origine ne correspond pas au ROA",
    "en": "Invalid: the origin AS doesn't match the ROA"
   },
   {
    "fr": "Valid : la longueur de préfixe correspond au ROA",
    "en": "Valid: the prefix length matches the ROA"
   },
   {
    "fr": "NotFound : RPKI ne vérifie que la longueur",
    "en": "NotFound: RPKI only checks the prefix length"
   }
  ],
  "exp": {
   "fr": "La Route Origin Validation vérifie l'AS d'origine et la longueur max. Mauvaise origine = Invalid, et les réseaux qui appliquent la ROV la rejettent. Le reste de l'AS_PATH n'est pas vérifié.",
   "en": "Route Origin Validation checks the origin AS and max length. Wrong origin = Invalid, and networks enforcing ROV drop it. The rest of the AS_PATH isn't validated."
  }
 },
 {
  "id": "security-03",
  "world": "any",
  "topic": "security",
  "lvl": 2,
  "q": {
   "fr": "Tu annonces 198.51.100.0/22. Le pirate AS64666 annonce 198.51.100.0/24 (sans filtrage RPKI). Où va le trafic vers 198.51.100.10 ?",
   "en": "You announce 198.51.100.0/22. Pirate AS64666 announces 198.51.100.0/24 (no RPKI filtering). Where does traffic to 198.51.100.10 go?"
  },
  "a": [
   {
    "fr": "Chez le pirate : le préfixe le plus long gagne toujours",
    "en": "To the pirate: the longest prefix match always wins"
   },
   {
    "fr": "Chez toi : la route la plus ancienne gagne en BGP",
    "en": "To you: the oldest route wins in BGP"
   },
   {
    "fr": "Chez toi : un AS_PATH plus court bat un préfixe plus long",
    "en": "To you: a shorter AS_PATH beats a longer prefix"
   }
  ],
  "exp": {
   "fr": "Le forwarding applique le longest prefix match avant tout attribut BGP. Parades : annoncer aussi les /24, publier des ROA avec un maxLength serré, faire filtrer les upstreams.",
   "en": "Forwarding uses longest prefix match before any BGP attribute. Countermeasures: announce the /24s too, publish ROAs with a tight maxLength, ask upstreams to filter."
  }
 },
 {
  "id": "security-04",
  "world": "any",
  "topic": "security",
  "lvl": 3,
  "q": {
   "fr": "Un client sous DDoS tague son /32 avec la community 65535:666 (RFC 7999). Que doit faire l'upstream ?",
   "en": "A customer under DDoS tags its /32 with community 65535:666 (RFC 7999). What should the upstream do?"
  },
  "a": [
   {
    "fr": "Blackholer tout le trafic vers ce /32 en bordure",
    "en": "Blackhole all traffic to that /32 at its edge"
   },
   {
    "fr": "Envoyer le /32 vers un centre de scrubbing",
    "en": "Send the /32 to a scrubbing center for cleaning"
   },
   {
    "fr": "Limiter le débit du /32 à 666 Mbps",
    "en": "Rate-limit the /32 to 666 Mbps"
   }
  ],
  "exp": {
   "fr": "BLACKHOLE, c'est le RTBH : le trafic vers le /32 est jeté en bordure pour protéger le reste du réseau. L'IP visée est sacrifiée, mais les dégâts collatéraux cessent.",
   "en": "BLACKHOLE means RTBH: traffic to the /32 is dropped at the edge to protect the rest of the network. The targeted IP is sacrificed, but collateral damage stops."
  }
 },
 {
  "id": "security-05",
  "world": "any",
  "topic": "security",
  "lvl": 3,
  "q": {
   "fr": "Que permet BGP Flowspec que le RTBH ne permet pas ?",
   "en": "What can BGP Flowspec do that RTBH can't?"
  },
  "a": [
   {
    "fr": "Jeter ou limiter par port/protocole, ex. seulement le flood UDP/123",
    "en": "Drop or rate-limit by port/protocol, e.g. only UDP/123 floods"
   },
   {
    "fr": "Chiffrer les sessions BGP entre peers pour bloquer les hijacks",
    "en": "Encrypt the BGP sessions between peers to stop hijacks"
   },
   {
    "fr": "Valider l'AS d'origine de chaque route reçue grâce aux ROA",
    "en": "Validate the origin AS of every received route against ROAs"
   }
  ],
  "exp": {
   "fr": "Flowspec (RFC 8955) distribue des règles de filtrage via BGP : match sur ports, protocole, taille... puis drop, rate-limit ou redirect. Le RTBH, lui, jette tout vers la destination.",
   "en": "Flowspec (RFC 8955) pushes filter rules via BGP: match on ports, protocol, length... then drop, rate-limit or redirect. RTBH just drops everything to the destination."
  }
 },
 {
  "id": "security-06",
  "world": "any",
  "topic": "security",
  "lvl": 2,
  "q": {
   "fr": "Un hacker se branche sur une fibre noire entre deux PoP. Quelle techno chiffre les trames Ethernet hop par hop au débit ligne ?",
   "en": "A hacker taps a dark fiber between two PoPs. Which feature encrypts Ethernet frames hop by hop at line rate?"
  },
  "a": [
   {
    "fr": "MACsec (IEEE 802.1AE)",
    "en": "MACsec (IEEE 802.1AE)"
   },
   {
    "fr": "Des tunnels GRE entre les deux PoP",
    "en": "GRE tunnels between the two PoPs"
   },
   {
    "fr": "RPKI avec Route Origin Validation",
    "en": "RPKI with Route Origin Validation"
   }
  ],
  "exp": {
   "fr": "MACsec chiffre et authentifie chaque trame sur le lien, en hardware, contre les MITM par écoute de fibre. IPsec le fait en couche 3 de bout en bout ; GRE seul ne chiffre rien.",
   "en": "MACsec encrypts and authenticates every frame on the link in hardware, defeating fiber-tap MITM. IPsec does it at layer 3 end to end; GRE alone encrypts nothing."
  }
 },
 {
  "id": "mpls-01",
  "world": "any",
  "topic": "mpls",
  "lvl": 1,
  "q": {
   "fr": "Quelle taille fait une entrée de pile de labels MPLS ajoutée à ta trame ?",
   "en": "How big is one MPLS label stack entry pushed onto your frame?"
  },
  "a": [
   {
    "fr": "4 octets (32 bits)",
    "en": "4 bytes (32 bits)"
   },
   {
    "fr": "2 octets (16 bits)",
    "en": "2 bytes (16 bits)"
   },
   {
    "fr": "8 octets (64 bits)",
    "en": "8 bytes (64 bits)"
   }
  ],
  "exp": {
   "fr": "Label de 20 bits, TC de 3 bits (QoS), 1 bit bottom-of-stack, TTL de 8 bits. Avec 2 labels (L3VPN), +8 octets : dimensionne la MTU du cœur en conséquence !",
   "en": "20-bit label, 3-bit TC (QoS), 1 bottom-of-stack bit, 8-bit TTL. With 2 labels (L3VPN) that's +8 bytes: size your core MTU accordingly!"
  }
 },
 {
  "id": "mpls-02",
  "world": "any",
  "topic": "mpls",
  "lvl": 1,
  "q": {
   "fr": "Ta trame labellisée entre dans un routeur P (cœur) au milieu du LSP. Que fait-il du label du dessus ?",
   "en": "Your labelled frame enters a P (core) router mid-LSP. What does it do with the top label?"
  },
  "a": [
   {
    "fr": "Il le swappe contre le label du next hop et forwarde",
    "en": "Swaps it for the next hop's label and forwards"
   },
   {
    "fr": "Il pousse un nouveau label à chaque saut",
    "en": "Pushes one more label at every hop"
   },
   {
    "fr": "Il retire tous les labels et fait un lookup IP",
    "en": "Pops all labels and does an IP lookup"
   }
  ],
  "exp": {
   "fr": "Le PE d'entrée push, les P swappent, la sortie (ou l'avant-dernier saut) pop. Le P ne fait aucun lookup IP : le cœur n'a pas besoin des routes clients.",
   "en": "Ingress PE pushes, P routers swap, the egress (or penultimate hop) pops. The P router does no IP lookup, so the core needs no customer routes."
  }
 },
 {
  "id": "mpls-03",
  "world": "any",
  "topic": "mpls",
  "lvl": 2,
  "q": {
   "fr": "Avec le Penultimate Hop Popping (PHP), qui retire le label du dessus ?",
   "en": "With Penultimate Hop Popping (PHP), who removes the top label?"
  },
  "a": [
   {
    "fr": "Le routeur juste avant le PE de sortie",
    "en": "The router just before the egress PE"
   },
   {
    "fr": "Le PE d'entrée, juste avant l'envoi dans le LSP",
    "en": "The ingress PE, before sending into the LSP"
   },
   {
    "fr": "Le routeur CE du client, à la réception",
    "en": "The customer's CE router, on receipt"
   }
  ],
  "exp": {
   "fr": "Le PE de sortie annonce l'implicit-null (label 3), donc l'avant-dernier saut pop. La sortie fait un seul lookup au lieu de deux. L'explicit-null (0) garde le label, ex. pour la QoS.",
   "en": "The egress PE signals implicit-null (label 3), so the penultimate hop pops. The egress then does one lookup instead of two. Explicit-null (0) keeps the label, e.g. for QoS."
  }
 },
 {
  "id": "mpls-04",
  "world": "any",
  "topic": "mpls",
  "lvl": 2,
  "q": {
   "fr": "Un lien cœur est coupé. Avec le Fast ReRoute RSVP-TE et un backup pré-signalé, en combien de temps le trafic est-il rétabli en général ?",
   "en": "A core link is cut. With RSVP-TE Fast ReRoute and a pre-signalled backup, how fast is traffic typically restored?"
  },
  "a": [
   {
    "fr": "Environ 50 ms",
    "en": "About 50 ms"
   },
   {
    "fr": "Environ 5 secondes",
    "en": "About 5 seconds"
   },
   {
    "fr": "Environ 3 minutes (reconvergence BGP)",
    "en": "About 3 minutes (BGP reconvergence)"
   }
  ],
  "exp": {
   "fr": "Le tunnel de backup est déjà signalé et programmé en hardware : le point de réparation local bascule direct, ~50 ms façon SDH. La réoptimisation globale du chemin vient ensuite.",
   "en": "The backup tunnel is already signalled and programmed in hardware: the point of local repair just switches over, SONET-style ~50 ms. Global path re-optimization comes afterwards."
  }
 },
 {
  "id": "mpls-05",
  "world": "any",
  "topic": "mpls",
  "lvl": 3,
  "q": {
   "fr": "Dans un L3VPN MPLS, qu'est-ce qui décide dans quelles VRF une route client est importée ?",
   "en": "In an MPLS L3VPN, what decides which VRFs import a customer route?"
  },
  "a": [
   {
    "fr": "L'extended community Route Target (RT)",
    "en": "The Route Target (RT) extended community"
   },
   {
    "fr": "Le Route Distinguisher (RD)",
    "en": "The Route Distinguisher (RD)"
   },
   {
    "fr": "Le label LDP associé à la loopback du PE",
    "en": "The LDP label bound to the PE loopback"
   }
  ],
  "exp": {
   "fr": "Le RD rend seulement uniques les préfixes clients qui se chevauchent en MP-BGP (VPNv4). Le RT est la politique : une VRF exporte un RT, celles qui l'importent reçoivent la route.",
   "en": "The RD only makes overlapping customer prefixes unique in MP-BGP (VPNv4). The RT is the policy: one VRF exports an RT, and the VRFs importing it receive the route."
  }
 },
 {
  "id": "mpls-06",
  "world": "any",
  "topic": "mpls",
  "lvl": 3,
  "q": {
   "fr": "Dans les traceroutes clients, aucun routeur P de ton cœur MPLS n'apparaît, et pas d'étoiles. Raison la plus probable ?",
   "en": "In customer traceroutes, none of your MPLS core P routers show up, and there are no stars. Most likely reason?"
  },
  "a": [
   {
    "fr": "Le TTL IP n'est pas copié dans le TTL du label (propagation off)",
    "en": "IP TTL isn't copied into the label TTL (propagation off)"
   },
   {
    "fr": "Chaque routeur P jette l'ICMP via une ACL d'infrastructure",
    "en": "Every P router drops ICMP with an infrastructure ACL"
   },
   {
    "fr": "Le cœur fait du PHP : le label est retiré avant le PE de sortie",
    "en": "The core uses PHP: the label is popped before the egress PE"
   }
  ],
  "exp": {
   "fr": "Sans propagation du TTL, le PE d'entrée met le TTL du label à 255 : il n'expire jamais dans le cœur. Les opérateurs le font pour masquer leur topologie.",
   "en": "With TTL propagation off, the ingress PE sets the label TTL to 255, so it never expires inside the core. Carriers do this to hide their topology."
  }
 },
 {
  "id": "troubleshoot-01",
  "world": "any",
  "topic": "troubleshoot",
  "lvl": 1,
  "q": {
   "fr": "Les compteurs input errors et CRC montent sans arrêt sur une interface 100G. Où regardes-tu en premier ?",
   "en": "Input errors and CRC counters keep rising on a 100G interface. Where do you look first?"
  },
  "a": [
   {
    "fr": "Couche physique : fibre sale, optique HS ou jarretière défectueuse",
    "en": "Physical layer: dirty fiber, faulty optic or bad patch cord"
   },
   {
    "fr": "Config BGP : timers keepalive trop agressifs côté peer",
    "en": "BGP config: overly aggressive keepalive timers on the peer"
   },
   {
    "fr": "Une boucle de routage entre deux routeurs cœur (TTL qui expire)",
    "en": "A routing loop between two core routers (TTL expiring)"
   }
  ],
  "exp": {
   "fr": "Des CRC signifient que les trames arrivent corrompues : quasi toujours la couche 1. Nettoie les connecteurs, vérifie la puissance Rx, change l'optique ou la jarretière, ici ou en face.",
   "en": "CRC errors mean frames arrive corrupted: almost always layer 1. Clean the connectors, check Rx power, swap the optic or patch cord, here or at the far end."
  }
 },
 {
  "id": "troubleshoot-02",
  "world": "any",
  "topic": "troubleshoot",
  "lvl": 2,
  "q": {
   "fr": "MTR affiche 60 % de perte au saut 4, mais 0 % des sauts 5 à 9 et à la destination. Diagnostic ?",
   "en": "MTR shows 60% loss at hop 4, but 0% at hops 5 to 9 and at the destination. Diagnosis?"
  },
  "a": [
   {
    "fr": "Pas de vraie perte : le saut 4 rate-limite ses réponses ICMP",
    "en": "No real loss: hop 4 rate-limits its own ICMP replies"
   },
   {
    "fr": "Perte réelle : le saut 4 jette 60 % du trafic qu'il transite",
    "en": "Real loss: hop 4 drops 60% of the transit traffic it forwards"
   },
   {
    "fr": "Le saut 4 est congestionné, les sauts suivants mentent",
    "en": "Hop 4 is congested and later hops are lying"
   }
  ],
  "exp": {
   "fr": "Les routeurs répondent aux TTL expirés via le control plane, protégé par CoPP/rate limit. Une perte qui ne se propage pas aux sauts suivants n'est pas réelle. Seule celle qui persiste compte.",
   "en": "Routers answer TTL-expired via the control plane, protected by CoPP/rate limits. Loss that doesn't carry on to later hops isn't real. Only loss that persists to the end counts."
  }
 },
 {
  "id": "troubleshoot-03",
  "world": "any",
  "topic": "troubleshoot",
  "lvl": 2,
  "q": {
   "fr": "Les petits pings passent, mais les paquets IP de 1500 octets avec DF échouent sur le chemin. Cause probable ?",
   "en": "Small pings work, but 1500-byte IP packets with DF set fail across the path. Most likely cause?"
  },
  "a": [
   {
    "fr": "Un lien du chemin a une MTU inférieure à 1500 octets",
    "en": "A link on the path has an MTU below 1500 bytes"
   },
   {
    "fr": "La machine de destination est down",
    "en": "The destination host is down"
   },
   {
    "fr": "L'ICMP est rate-limité sur la destination",
    "en": "ICMP is rate-limited at the destination"
   }
  ],
  "exp": {
   "fr": "Avec DF, un routeur ne peut pas fragmenter et doit renvoyer un ICMP « Fragmentation needed ». Si cet ICMP est filtré, la PMTUD casse : trou noir classique avec GRE/IPsec ou labels MPLS.",
   "en": "With DF set, a router can't fragment and should return ICMP 'Fragmentation needed'. If that ICMP is filtered, PMTUD breaks: a classic black hole with GRE/IPsec or extra MPLS labels."
  }
 },
 {
  "id": "troubleshoot-04",
  "world": "any",
  "topic": "troubleshoot",
  "lvl": 3,
  "q": {
   "fr": "Sur un lien cuivre, un côté affiche des late collisions, l'autre des CRC et des runts. Quel est le problème ?",
   "en": "On a copper link, one side shows late collisions, the other CRC errors and runts. What's wrong?"
  },
  "a": [
   {
    "fr": "Duplex mismatch : un côté en half, l'autre en full duplex",
    "en": "Duplex mismatch: one side half, the other full duplex"
   },
   {
    "fr": "Speed mismatch : 100 Mbps d'un côté, 1 Gbps de l'autre",
    "en": "Speed mismatch: 100 Mbps on one side, 1 Gbps on the other"
   },
   {
    "fr": "Le lien est saturé par un DDoS",
    "en": "The link is saturated by a DDoS"
   }
  ],
  "exp": {
   "fr": "Le côté half voit des late collisions ; le côté full reçoit des trames tronquées (CRC, runts). Typique quand une extrémité est forcée et l'autre en auto-négociation.",
   "en": "The half-duplex side sees late collisions; the full-duplex side receives truncated frames (CRC, runts). Typical when one end is hard-coded and the other auto-negotiates."
  }
 },
 {
  "id": "troubleshoot-05",
  "world": "any",
  "topic": "troubleshoot",
  "lvl": 2,
  "q": {
   "fr": "Ton IGP et ton BGP mettent des secondes à détecter un voisin mort derrière un switch (lien toujours up). Quel outil le voit en ~150 ms ?",
   "en": "Your IGP and BGP take seconds to detect a dead neighbor behind a switch (link still up). What spots it in ~150 ms?"
  },
  "a": [
   {
    "fr": "BFD avec intervalle 50 ms et multiplicateur 3",
    "en": "BFD with 50 ms intervals and multiplier 3"
   },
   {
    "fr": "Un polling SNMP de l'interface toutes les 5 s",
    "en": "SNMP polling of the interface every 5 seconds"
   },
   {
    "fr": "Des alertes syslog avec le logging en niveau debug",
    "en": "Syslog alerts with logging set to debug level"
   }
  ],
  "exp": {
   "fr": "BFD échange des hellos légers, souvent en hardware : 3 ratés × 50 ms = 150 ms de détection, puis il prévient BGP/IGP/FRR. Ajoute du dampening pour ne pas amplifier un lien qui flappe.",
   "en": "BFD exchanges lightweight hellos, often in hardware: 3 missed × 50 ms = 150 ms detection, then it alerts BGP/IGP/FRR. Add dampening so a flapping link isn't amplified."
  }
 },
 {
  "id": "troubleshoot-06",
  "world": "any",
  "topic": "troubleshoot",
  "lvl": 3,
  "q": {
   "fr": "Ton traceroute Paris→Tokyo est propre, mais Tokyo voit des pertes vers Paris. Que ne peut pas te montrer ton traceroute ?",
   "en": "Your traceroute Paris→Tokyo is clean, but Tokyo sees loss towards Paris. What can't your traceroute show you?"
  },
  "a": [
   {
    "fr": "Le chemin retour, qui peut traverser d'autres AS",
    "en": "The return path, which may cross other ASes"
   },
   {
    "fr": "Le RTT vers chaque saut du chemin aller",
    "en": "The RTT to each hop on the forward path"
   },
   {
    "fr": "Si la destination répond à l'ICMP",
    "en": "Whether the destination answers ICMP"
   }
  ],
  "exp": {
   "fr": "Le routage Internet est souvent asymétrique : chaque AS choisit sa sortie (hot potato). Demande un traceroute retour depuis l'autre bout ou utilise un looking glass côté distant.",
   "en": "Internet routing is often asymmetric: each AS picks its own exit (hot potato). Ask for a reverse traceroute from the far end or use a looking glass in the remote AS."
  }
 },
 {
  "id": "optics-01",
  "world": "any",
  "topic": "optics",
  "lvl": 1,
  "q": {
   "fr": "Alarme : LOS sur Hu0/0/0/1, puissance Rx -40 dBm. Qu'est-ce que ça signifie ?",
   "en": "Alarm: LOS on Hu0/0/0/1, Rx power -40 dBm. What does it mean?"
  },
  "a": [
   {
    "fr": "Pas de lumière reçue : fibre coupée, débranchée ou laser distant off",
    "en": "No light received: fiber cut, unplugged or far-end laser off"
   },
   {
    "fr": "Trop de lumière : le récepteur sature, il faut un atténuateur",
    "en": "Too much light: the receiver is saturated, add an attenuator"
   },
   {
    "fr": "La lumière est OK, mais le VLAN est mal configuré",
    "en": "Light is fine, but the VLAN is misconfigured"
   }
  ],
  "exp": {
   "fr": "LOS = Loss Of Signal. -40 dBm, c'est le plancher de l'optique : le noir complet. Vérifie le panneau de brassage, puis le Tx distant, puis demande un tir OTDR au fournisseur fibre.",
   "en": "LOS = Loss Of Signal. -40 dBm is basically the optic's floor: total darkness. Check the patch panel, then the far-end Tx, then ask the fiber provider for an OTDR shot."
  }
 },
 {
  "id": "optics-02",
  "world": "any",
  "topic": "optics",
  "lvl": 1,
  "q": {
   "fr": "Que permet le DWDM à un opérateur sur une seule paire de fibres ?",
   "en": "What does DWDM let a carrier do on a single fiber pair?"
  },
  "a": [
   {
    "fr": "Transporter de nombreuses longueurs d'onde, chacune un canal",
    "en": "Carry many wavelengths, each one a separate channel"
   },
   {
    "fr": "Doubler la vitesse de la lumière dans le cœur de la fibre",
    "en": "Double the speed of light inside the fiber core"
   },
   {
    "fr": "Chiffrer tous les canaux avec une seule clé optique",
    "en": "Encrypt all channels with one shared optical key"
   }
  ],
  "exp": {
   "fr": "Le DWDM empile des dizaines de canaux (ex. 96 × 50 GHz en bande C, vers 1550 nm), chacun portant de 100G à 800G+. Les amplis EDFA les boostent tous d'un coup.",
   "en": "Dense WDM packs dozens of channels (e.g. 96 × 50 GHz in the C-band, around 1550 nm), each carrying 100G to 800G+. EDFA amplifiers boost them all at once."
  }
 },
 {
  "id": "optics-03",
  "world": "any",
  "topic": "optics",
  "lvl": 2,
  "q": {
   "fr": "Tx = 0 dBm, span de 80 km à 0,25 dB/km, plus 2 dB de connectique. Puissance Rx attendue ?",
   "en": "Tx = 0 dBm, 80 km span at 0.25 dB/km, plus 2 dB of connectors. Expected Rx power?"
  },
  "a": [
   {
    "fr": "-22 dBm",
    "en": "-22 dBm"
   },
   {
    "fr": "-20 dBm",
    "en": "-20 dBm"
   },
   {
    "fr": "-18 dBm",
    "en": "-18 dBm"
   }
  ],
  "exp": {
   "fr": "Les pertes en dB s'additionnent : 80 × 0,25 = 20 dB, + 2 dB = 22 dB. 0 dBm - 22 dB = -22 dBm. Compare à la sensibilité du récepteur pour connaître ta marge.",
   "en": "Losses in dB simply add up: 80 × 0.25 = 20 dB, + 2 dB = 22 dB. 0 dBm - 22 dB = -22 dBm. Compare it with the receiver sensitivity to know your margin."
  }
 },
 {
  "id": "optics-04",
  "world": "any",
  "topic": "optics",
  "lvl": 2,
  "q": {
   "fr": "Un câble sous-marin est coupé par 2 000 m de fond. Comment est-il réparé en général ?",
   "en": "A submarine cable is cut in 2,000 m of water. How is it usually repaired?"
  },
  "a": [
   {
    "fr": "Un navire câblier remonte les deux bouts et insère une section neuve",
    "en": "A cable ship lifts both ends and splices in a spare section"
   },
   {
    "fr": "Des plongeurs ressoudent la fibre directement sur le fond",
    "en": "Divers weld the fiber back together directly on the seabed"
   },
   {
    "fr": "On l'abandonne et on pose un câble entièrement neuf sur le tracé",
    "en": "It's abandoned and a whole new cable is laid on the route"
   }
  ],
  "exp": {
   "fr": "Le câblier récupère chaque extrémité au grappin (ou via un ROV), raboute un câble de rechange à bord puis redescend la boucle. Météo et permis : des jours à des semaines de coupure.",
   "en": "The repair ship grapples (or uses an ROV) to recover each end, splices in spare cable on board, then lowers the loop back. Weather and permits mean days to weeks of outage."
  }
 },
 {
  "id": "latency-01",
  "world": "any",
  "topic": "latency",
  "lvl": 1,
  "q": {
   "fr": "La lumière dans la fibre va à environ 200 000 km/s. Combien de délai aller ajoute chaque km ?",
   "en": "Light in fiber travels at about 200,000 km/s. How much one-way delay does each km add?"
  },
  "a": [
   {
    "fr": "Environ 5 µs",
    "en": "About 5 µs"
   },
   {
    "fr": "Environ 5 ms",
    "en": "About 5 ms"
   },
   {
    "fr": "Environ 0,5 ns",
    "en": "About 0.5 ns"
   }
  ],
  "exp": {
   "fr": "Le verre ralentit la lumière à ~2/3 de c (indice ~1,47). Règle d'or : 5 µs/km en aller simple, donc 1 000 km ≈ 5 ms aller, ≈ 10 ms de RTT.",
   "en": "Glass slows light to ~2/3 of c (refractive index ~1.47). Rule of thumb: 5 µs/km one way, so 1,000 km ≈ 5 ms one way, ≈ 10 ms RTT."
  }
 },
 {
  "id": "latency-02",
  "world": "any",
  "topic": "latency",
  "lvl": 2,
  "q": {
   "fr": "La route fibre de ta trame vers Tokyo fait environ 20 000 km. Quel est le RTT minimum dû à la seule propagation ?",
   "en": "Your frame's fiber route to Tokyo is about 20,000 km. What's the minimum RTT from propagation alone?"
  },
  "a": [
   {
    "fr": "Environ 200 ms",
    "en": "About 200 ms"
   },
   {
    "fr": "Environ 100 ms",
    "en": "About 100 ms"
   },
   {
    "fr": "Environ 40 ms",
    "en": "About 40 ms"
   }
  ],
  "exp": {
   "fr": "20 000 km × 5 µs = 100 ms aller, et le RTT est un aller-retour : 200 ms. Aucun upgrade de routeur ne bat la physique ; seule une route plus courte (câble plus direct) le réduit.",
   "en": "20,000 km × 5 µs = 100 ms one way, and RTT is a round trip: 200 ms. No router upgrade beats physics; only a shorter route (a more direct cable) lowers it."
  }
 },
 {
  "id": "latency-03",
  "world": "any",
  "topic": "latency",
  "lvl": 1,
  "q": {
   "fr": "Qu'est-ce que la gigue (jitter) ?",
   "en": "What is jitter?"
  },
  "a": [
   {
    "fr": "La variation du délai des paquets dans le temps",
    "en": "The variation in packet delay over time"
   },
   {
    "fr": "Le temps aller-retour moyen mesuré par ping",
    "en": "The average round-trip time measured by ping"
   },
   {
    "fr": "Le pourcentage de paquets perdus sur un lien",
    "en": "The share of packets lost on a link"
   }
  ],
  "exp": {
   "fr": "La voix et la vidéo détestent la gigue : les paquets arrivent irrégulièrement et le jitter buffer doit compenser. Cible VoIP usuelle : < ~30 ms, avec moins de 1 % de perte.",
   "en": "Voice and video hate jitter: packets arrive unevenly and the jitter buffer must absorb it. Usual VoIP target: under ~30 ms, with less than 1 % loss."
  }
 },
 {
  "id": "latency-04",
  "world": "any",
  "topic": "latency",
  "lvl": 2,
  "q": {
   "fr": "Quel marquage DSCP est classiquement utilisé pour la voix, servie par la file prioritaire (LLQ) ?",
   "en": "Which DSCP marking is classically used for voice, served by the priority (LLQ) queue?"
  },
  "a": [
   {
    "fr": "EF (46)",
    "en": "EF (46)"
   },
   {
    "fr": "AF11 (10)",
    "en": "AF11 (10)"
   },
   {
    "fr": "CS1 (8)",
    "en": "CS1 (8)"
   }
  ],
  "exp": {
   "fr": "EF = Expedited Forwarding, DSCP 46 (101110 en binaire). Priorité stricte mais policée, pour qu'un burst voix n'affame pas les autres classes. En MPLS, il est mappé sur TC/EXP 5.",
   "en": "EF = Expedited Forwarding, DSCP 46 (binary 101110). Strict priority but policed, so a voice burst can't starve other classes. In MPLS it maps to TC/EXP 5."
  }
 },
 {
  "id": "latency-05",
  "world": "any",
  "topic": "latency",
  "lvl": 3,
  "q": {
   "fr": "En charge, la latence passe de 20 ms à 600 ms mais la perte reste proche de 0 %. Coupable le plus probable ?",
   "en": "Under load, latency jumps from 20 ms to 600 ms but loss stays near 0%. Most likely culprit?"
  },
  "a": [
   {
    "fr": "Bufferbloat : des buffers géants mettent en file au lieu de jeter",
    "en": "Bufferbloat: oversized buffers queue packets instead of dropping"
   },
   {
    "fr": "Reroutage : BGP a choisi une route fibre bien plus longue",
    "en": "Rerouting: BGP moved traffic onto a much longer fiber route"
   },
   {
    "fr": "Couche 1 : un connecteur sale génère des CRC sur le lien",
    "en": "Layer 1: a dirty connector is causing CRC errors on the link"
   }
  ],
  "exp": {
   "fr": "Des buffers énormes masquent la congestion : TCP les remplit et le délai explose. Remède : AQM (CoDel, FQ-CoDel, RED/WRED) ou buffers dimensionnés au lien.",
   "en": "Huge buffers hide congestion: TCP keeps filling them and delay explodes. Fix it with AQM (CoDel, FQ-CoDel, RED/WRED) or buffers sized to the link."
  }
 },
 {
  "id": "noc-01",
  "world": "any",
  "topic": "noc",
  "lvl": 1,
  "q": {
   "fr": "Après une grosse panne, le client demande un « RFO ». Que lui envoies-tu ?",
   "en": "After a major outage, the customer asks for an 'RFO'. What do you send them?"
  },
  "a": [
   {
    "fr": "Un Reason For Outage : cause, chronologie, actions correctives",
    "en": "A Reason For Outage report: cause, timeline, corrective actions"
   },
   {
    "fr": "Une Request For Offer pour chiffrer un lien de secours",
    "en": "A Request For Offer to quote a backup link for the site"
   },
   {
    "fr": "Un Router Firmware Override pour forcer le reboot du PE",
    "en": "A Router Firmware Override to force-reload the faulty PE"
   }
  ],
  "exp": {
   "fr": "Le RFO explique ce qui a cassé, quand, l'impact, la cause racine et les actions pour que ça ne se reproduise pas. Des horodatages précis (en UTC !) comptent pour les pénalités SLA.",
   "en": "The RFO explains what broke, when, the impact, the root cause and the actions so it won't happen again. Precise timestamps (in UTC!) matter for SLA credits."
  }
 },
 {
  "id": "noc-02",
  "world": "any",
  "topic": "noc",
  "lvl": 1,
  "q": {
   "fr": "Quel outil te dit QUI envoie du trafic à qui, sur quels ports et en quelle quantité ?",
   "en": "Which tool tells you WHO sends traffic to whom, on which ports and how much?"
  },
  "a": [
   {
    "fr": "NetFlow / IPFIX",
    "en": "NetFlow / IPFIX"
   },
   {
    "fr": "Les compteurs d'interface SNMP",
    "en": "SNMP interface counters"
   },
   {
    "fr": "Les messages syslog",
    "en": "Syslog messages"
   }
  ],
  "exp": {
   "fr": "SNMP dit à quel point le tuyau est plein, syslog ce qui s'est passé sur l'équipement, NetFlow/IPFIX quels flux remplissent le tuyau. Idéal pour repérer un DDoS ou les top talkers.",
   "en": "SNMP says how full the pipe is, syslog says what happened on the box, NetFlow/IPFIX says which flows fill the pipe. Perfect for spotting a DDoS or the top talkers."
  }
 },
 {
  "id": "noc-03",
  "world": "any",
  "topic": "noc",
  "lvl": 1,
  "q": {
   "fr": "Fin de ton shift de nuit : un incident P1 est toujours ouvert. Quelle est la bonne passation ?",
   "en": "End of your night shift: a P1 incident is still open. What's the right handover?"
  },
  "a": [
   {
    "fr": "Briefer l'équipe suivante et mettre à jour le ticket avec la suite",
    "en": "Brief the next shift and update the ticket with next steps"
   },
   {
    "fr": "Fermer le ticket : l'équipe suivante le rouvrira si besoin",
    "en": "Close the ticket: the next shift will reopen it if needed"
   },
   {
    "fr": "Laisser tel quel : le client rappellera si c'est encore down",
    "en": "Leave it: the customer will call back if it's still down"
   }
  ],
  "exp": {
   "fr": "Une bonne passation liste les incidents ouverts, les actions faites, les escalades en cours et qui attend quoi. Un P1 se transmet de vive voix, pas juste en file d'attente.",
   "en": "A good handover lists open incidents, actions done, pending escalations and who's waiting for what. A P1 is handed over verbally, not just left in the queue."
  }
 },
 {
  "id": "noc-04",
  "world": "any",
  "topic": "noc",
  "lvl": 2,
  "q": {
   "fr": "Au sens ITIL, quelle est la différence entre un incident et un problème ?",
   "en": "In ITIL terms, what's the difference between an incident and a problem?"
  },
  "a": [
   {
    "fr": "Incident : rétablir vite ; problème : trouver la cause racine",
    "en": "Incident: restore fast; problem: find the root cause"
   },
   {
    "fr": "Incident : visible du client ; problème : interne uniquement",
    "en": "Incident: customer-facing; problem: internal only"
   },
   {
    "fr": "Incident : tickets P1/P2 ; problème : tickets P3/P4",
    "en": "Incident: P1/P2 tickets; problem: P3/P4 tickets"
   }
  ],
  "exp": {
   "fr": "La gestion des incidents rétablit le service (reroutage, contournement). La gestion des problèmes trouve et élimine la cause racine pour que l'incident ne revienne pas.",
   "en": "Incident management gets the service back (reroute, workaround). Problem management finds and removes the root cause so the same incident doesn't come back."
  }
 },
 {
  "id": "noc-05",
  "world": "any",
  "topic": "noc",
  "lvl": 3,
  "q": {
   "fr": "Un lien a un SLA de disponibilité de 99,99 %. Combien d'indisponibilité par an est tolérée, environ ?",
   "en": "A link has a 99.99% availability SLA. About how much downtime per year is allowed?"
  },
  "a": [
   {
    "fr": "Environ 53 minutes",
    "en": "About 53 minutes"
   },
   {
    "fr": "Environ 8,8 heures",
    "en": "About 8.8 hours"
   },
   {
    "fr": "Environ 5 minutes",
    "en": "About 5 minutes"
   }
  ],
  "exp": {
   "fr": "Chaque 9 de plus divise l'indispo par 10 : 99,9 % ≈ 8,8 h/an, 99,99 % ≈ 53 min, 99,999 % ≈ 5 min. Les fenêtres de maintenance planifiées sont en général exclues du calcul.",
   "en": "Each extra 9 divides downtime by 10: 99.9% ≈ 8.8 h/year, 99.99% ≈ 53 min, 99.999% ≈ 5 min. Planned maintenance windows are usually excluded from the count."
  }
 },
 {
  "id": "fr-icmp-01",
  "world": "fr",
  "topic": "icmp",
  "lvl": 1,
  "q": {
   "fr": "Départ de Paris ! Votre trame transporte un ping. Quel type ICMP correspond à un Echo Request ?",
   "en": "Leaving Paris! Your frame carries a ping. Which ICMP type is an Echo Request?"
  },
  "a": [
   {
    "fr": "Type 8",
    "en": "Type 8"
   },
   {
    "fr": "Type 0",
    "en": "Type 0"
   },
   {
    "fr": "Type 3",
    "en": "Type 3"
   }
  ],
  "exp": {
   "fr": "Echo Request = type 8, Echo Reply = type 0. Le type 3 (Destination Unreachable) signale qu'une destination est injoignable.",
   "en": "Echo Request is type 8 and Echo Reply is type 0. Type 3 (Destination Unreachable) reports that a destination cannot be reached."
  }
 },
 {
  "id": "fr-mtu-01",
  "world": "fr",
  "topic": "mtu",
  "lvl": 2,
  "q": {
   "fr": "Comme une baguette trop longue pour le sac : un paquet IPv4 de 1600 octets, DF=1, doit sortir par un lien MTU 1500. Que fait le routeur ?",
   "en": "Like a baguette too long for the bag: a 1600-byte IPv4 packet with DF=1 must exit via a 1500-byte MTU link. What does the router do?"
  },
  "a": [
   {
    "fr": "Il le jette et renvoie un ICMP « Fragmentation Needed »",
    "en": "Drops it and sends back ICMP 'Fragmentation Needed'"
   },
   {
    "fr": "Il le fragmente quand même en deux morceaux",
    "en": "Fragments it anyway into two pieces"
   },
   {
    "fr": "Il tronque le paquet à 1500 octets",
    "en": "Truncates the packet to 1500 bytes"
   }
  ],
  "exp": {
   "fr": "Avec DF=1, le routeur ne peut pas fragmenter : il jette le paquet et renvoie un ICMP type 3 code 4. C'est la base du Path MTU Discovery.",
   "en": "With DF set, the router may not fragment: it drops the packet and sends back ICMP type 3 code 4. This is what Path MTU Discovery relies on."
  }
 },
 {
  "id": "fr-ixp-01",
  "world": "fr",
  "topic": "ixp",
  "lvl": 3,
  "q": {
   "fr": "Un membre de France-IX apprend une route via le route server. L'ASN du route server apparaît-il normalement dans l'AS_PATH ?",
   "en": "A France-IX member learns a route via the route server. Does the route server's ASN normally appear in the AS_PATH?"
  },
  "a": [
   {
    "fr": "Non, un route server d'IX est transparent (RFC 7947)",
    "en": "No, an IX route server is transparent (RFC 7947)"
   },
   {
    "fr": "Oui, comme sur toute session eBGP classique",
    "en": "Yes, as on any regular eBGP session"
   },
   {
    "fr": "Oui, mais uniquement pour les routes IPv6",
    "en": "Yes, but only for IPv6 routes"
   }
  ],
  "exp": {
   "fr": "Le route server redistribue les routes sans être dans le chemin des données : il n'insère pas son ASN (RFC 7947). Les membres doivent parfois désactiver enforce-first-as.",
   "en": "The route server only redistributes routes and is not in the data path, so it does not insert its ASN (RFC 7947). Members may need to disable enforce-first-as."
  }
 },
 {
  "id": "de-ixp-02",
  "world": "de",
  "topic": "ixp",
  "lvl": 1,
  "q": {
   "fr": "Willkommen in Frankfurt ! Qu'est-ce que DE-CIX Frankfurt ?",
   "en": "Willkommen in Frankfurt! What is DE-CIX Frankfurt?"
  },
  "a": [
   {
    "fr": "L'un des plus grands points d'échange Internet au monde",
    "en": "One of the world's largest Internet exchange points"
   },
   {
    "fr": "La principale station d'atterrissage de câbles sous-marins allemande",
    "en": "Germany's main submarine-cable landing station"
   },
   {
    "fr": "Le route reflector BGP interne de Deutsche Telekom",
    "en": "Deutsche Telekom's internal BGP route reflector"
   }
  ],
  "exp": {
   "fr": "DE-CIX Frankfurt est un IXP majeur où des réseaux du monde entier s'échangent du trafic en peering. Francfort est à l'intérieur des terres : aucun câble sous-marin n'y atterrit !",
   "en": "DE-CIX Frankfurt is a major IXP where networks from all over the world exchange traffic by peering. Frankfurt is inland, so no submarine cable lands there!"
  }
 },
 {
  "id": "de-qos-01",
  "world": "de",
  "topic": "qos",
  "lvl": 2,
  "q": {
   "fr": "Oktoberfest : la tente est pleine, chaque nouvel arrivant est refoulé à l'entrée. De quel comportement de file d'attente s'agit-il ?",
   "en": "Oktoberfest: the beer tent is full and every new arrival is turned away at the door. Which queuing behaviour is this?"
  },
  "a": [
   {
    "fr": "Tail drop",
    "en": "Tail drop"
   },
   {
    "fr": "WRED",
    "en": "WRED"
   },
   {
    "fr": "Policing avec remarquage",
    "en": "Policing with re-marking"
   }
  ],
  "exp": {
   "fr": "File pleine = tail drop : tout paquet entrant est jeté. WRED jette aléatoirement avant la saturation pour éviter la synchronisation TCP ; le policing agit sur un débit, pas sur une file.",
   "en": "Full queue = tail drop: every arriving packet is discarded. WRED drops randomly before the queue fills to avoid TCP synchronisation; policing acts on a rate, not a queue."
  }
 },
 {
  "id": "de-bgp-01",
  "world": "de",
  "topic": "bgp",
  "lvl": 3,
  "q": {
   "fr": "Le pirate AS64666 lance un DDoS sur un client d'AS3320 ! Quelle communauté BGP well-known demande un blackholing (RFC 7999) ?",
   "en": "Pirate AS64666 launches a DDoS on an AS3320 customer! Which well-known BGP community requests blackholing (RFC 7999)?"
  },
  "a": [
   {
    "fr": "65535:666",
    "en": "65535:666"
   },
   {
    "fr": "65535:65281",
    "en": "65535:65281"
   },
   {
    "fr": "65535:0",
    "en": "65535:0"
   }
  ],
  "exp": {
   "fr": "RFC 7999 : BLACKHOLE = 65535:666, les voisins jettent le trafic vers ce préfixe (souvent un /32). 65535:65281 = NO_EXPORT, 65535:0 = GRACEFUL_SHUTDOWN.",
   "en": "RFC 7999: BLACKHOLE = 65535:666, neighbours discard traffic to that prefix (often a /32). 65535:65281 is NO_EXPORT and 65535:0 is GRACEFUL_SHUTDOWN."
  }
 },
 {
  "id": "it-asn-01",
  "world": "it",
  "topic": "asn",
  "lvl": 1,
  "q": {
   "fr": "Benvenuti in Sicilia ! Quel ASN porte Seabone, le backbone IP international de Telecom Italia Sparkle ?",
   "en": "Benvenuti in Sicilia! Which ASN does Seabone, Telecom Italia Sparkle's international IP backbone, use?"
  },
  "a": [
   {
    "fr": "AS6762",
    "en": "AS6762"
   },
   {
    "fr": "AS3356",
    "en": "AS3356"
   },
   {
    "fr": "AS1299",
    "en": "AS1299"
   }
  ],
  "exp": {
   "fr": "Seabone, le backbone IP international de Sparkle, est l'AS6762. AS3356 appartient à Lumen et AS1299 à Arelion (ex-Telia Carrier).",
   "en": "Seabone, Sparkle's international IP backbone, is AS6762. AS3356 belongs to Lumen and AS1299 to Arelion (formerly Telia Carrier)."
  }
 },
 {
  "id": "it-subsea-01",
  "world": "it",
  "topic": "subsea",
  "lvl": 1,
  "q": {
   "fr": "Pourquoi le Sicily Hub de Sparkle à Palerme est-il un site stratégique ?",
   "en": "Why is Sparkle's Sicily Hub in Palermo a strategic site?"
  },
  "a": [
   {
    "fr": "C'est un carrefour de câbles sous-marins en Méditerranée",
    "en": "It's a Mediterranean crossroads for submarine cables"
   },
   {
    "fr": "C'est le seul point d'échange Internet d'Italie",
    "en": "It is the only Internet exchange point in Italy"
   },
   {
    "fr": "Il héberge le registre des noms de domaine .it",
    "en": "It hosts the registry for .it domain names"
   }
  ],
  "exp": {
   "fr": "Au cœur de la Méditerranée, Palerme est un point de jonction des câbles sous-marins reliant Europe, Afrique, Moyen-Orient et Asie. L'Italie compte d'autres IXP (MIX, Namex…).",
   "en": "In the middle of the Mediterranean, Palermo is a junction for submarine cables linking Europe, Africa, the Middle East and Asia. Italy has other IXPs (MIX, Namex…)."
  }
 },
 {
  "id": "it-mpls-01",
  "world": "it",
  "topic": "mpls",
  "lvl": 2,
  "q": {
   "fr": "Comme les couches d'une cassata sicilienne, les labels MPLS s'empilent. Quel champ indique le dernier label de la pile ?",
   "en": "Like the layers of a Sicilian cassata, MPLS labels stack up. Which field marks the last label of the stack?"
  },
  "a": [
   {
    "fr": "Le bit S (Bottom of Stack) à 1",
    "en": "The S (Bottom of Stack) bit set to 1"
   },
   {
    "fr": "Le champ TTL à 0",
    "en": "The TTL field set to 0"
   },
   {
    "fr": "Les bits TC/EXP à 111",
    "en": "The TC/EXP bits set to 111"
   }
  ],
  "exp": {
   "fr": "Chaque entrée MPLS fait 32 bits : label (20), TC (3), S (1), TTL (8). S=1 marque le fond de la pile ; ensuite vient le payload (IP, L2VPN…).",
   "en": "Each MPLS entry is 32 bits: label (20), TC (3), S (1), TTL (8). S=1 marks the bottom of the stack; the payload (IP, L2VPN…) follows."
  }
 },
 {
  "id": "eg-subsea-02",
  "world": "eg",
  "topic": "subsea",
  "lvl": 1,
  "q": {
   "fr": "Comment la plupart des câbles sous-marins Europe–Asie franchissent-ils l'Égypte ?",
   "en": "How do most Europe–Asia submarine cables get across Egypt?"
  },
  "a": [
   {
    "fr": "Par voie terrestre, de la Méditerranée à la mer Rouge",
    "en": "Overland, from the Mediterranean to the Red Sea"
   },
   {
    "fr": "Par un relais satellite entre les deux mers",
    "en": "Through a satellite relay between the two seas"
   },
   {
    "fr": "Par des liaisons cuivre à travers le désert",
    "en": "Through copper links across the desert"
   }
  ],
  "exp": {
   "fr": "C'est la route la plus courte entre l'Europe et l'Asie : des câbles comme SEA-ME-WE atterrissent en Méditerranée puis traversent l'Égypte par voie terrestre jusqu'à la mer Rouge.",
   "en": "It is the shortest Europe–Asia route: cables such as SEA-ME-WE land on the Mediterranean coast, then cross Egypt overland to the Red Sea."
  }
 },
 {
  "id": "eg-subsea-03",
  "world": "eg",
  "topic": "subsea",
  "lvl": 1,
  "q": {
   "fr": "Alarme LOS sur un câble sous-marin en mer Rouge. Quelle est la cause la plus fréquente des coupures de câbles sous-marins ?",
   "en": "LOS alarm on a submarine cable in the Red Sea. What is the most common cause of submarine cable faults?"
  },
  "a": [
   {
    "fr": "Les ancres de navires et la pêche",
    "en": "Ship anchors and fishing gear"
   },
   {
    "fr": "Les morsures de requins",
    "en": "Shark bites"
   },
   {
    "fr": "La corrosion due au sel marin",
    "en": "Corrosion from sea salt"
   }
  ],
  "exp": {
   "fr": "La majorité des défauts viennent d'activités humaines : chalutage et ancres de navires. Les requins ? Rarissimes. Il faut alors envoyer un navire câblier pour réparer.",
   "en": "Most faults come from human activity: trawling and ship anchors. Sharks? Extremely rare. A cable ship must then sail out to make the repair."
  }
 },
 {
  "id": "eg-bgp-02",
  "world": "eg",
  "topic": "bgp",
  "lvl": 2,
  "q": {
   "fr": "L'arabe se lit de droite à gauche, comme un AS_PATH depuis l'origine. Dans « 6762 8452 8452 8452 », pourquoi 8452 apparaît-il 3 fois ?",
   "en": "Arabic reads right to left, like an AS_PATH from its origin. In '6762 8452 8452 8452', why does 8452 appear 3 times?"
  },
  "a": [
   {
    "fr": "AS8452 fait du prepending pour rendre ce chemin moins attractif",
    "en": "AS8452 prepends to make this path less preferred"
   },
   {
    "fr": "Une boucle de routage entre trois routeurs d'AS8452",
    "en": "A routing loop between three AS8452 routers"
   },
   {
    "fr": "Le préfixe agrège trois sous-réseaux d'AS8452",
    "en": "The prefix aggregates three AS8452 subnets"
   }
  ],
  "exp": {
   "fr": "L'AS d'origine est le plus à droite. Répéter son ASN (prepending) allonge l'AS_PATH et décourage les autres AS de choisir ce chemin.",
   "en": "The origin AS is the rightmost one. Repeating its ASN (prepending) lengthens the AS_PATH and discourages other ASes from choosing this path."
  }
 },
 {
  "id": "in-mpls-02",
  "world": "in",
  "topic": "mpls",
  "lvl": 1,
  "q": {
   "fr": "À Mumbai, les dabbawalas se passent les gamelles de relais en relais. Que fait un routeur P en milieu de LSP sur le label du haut ?",
   "en": "In Mumbai, dabbawalas hand lunchboxes from relay to relay. What does a mid-LSP P router do to the top label?"
  },
  "a": [
   {
    "fr": "SWAP : il le remplace par un nouveau label",
    "en": "SWAP: it replaces it with a new label"
   },
   {
    "fr": "PUSH : il ajoute un label VPN",
    "en": "PUSH: it adds a VPN label"
   },
   {
    "fr": "POP : il retire toute la pile puis fait un lookup IP",
    "en": "POP: it removes the whole stack, then does an IP lookup"
   }
  ],
  "exp": {
   "fr": "Un routeur P commute sur le label du haut et le remplace (swap) par celui annoncé par le saut suivant, sans regarder l'en-tête IP. Le PUSH se fait sur le PE d'entrée.",
   "en": "A P router switches on the top label and swaps it for the one advertised by the next hop, without looking at the IP header. PUSH happens on the ingress PE."
  }
 },
 {
  "id": "in-optics-01",
  "world": "in",
  "topic": "optics",
  "lvl": 2,
  "q": {
   "fr": "Diwali, la fête des lumières ! Quelle longueur d'onde utilise typiquement la fibre monomode longue distance (DWDM) ?",
   "en": "Diwali, the festival of lights! Which wavelength does long-haul single-mode fibre (DWDM) typically use?"
  },
  "a": [
   {
    "fr": "~1550 nm",
    "en": "~1550 nm"
   },
   {
    "fr": "~850 nm",
    "en": "~850 nm"
   },
   {
    "fr": "~650 nm",
    "en": "~650 nm"
   }
  ],
  "exp": {
   "fr": "La bande C (≈1530–1565 nm) offre la plus faible atténuation et s'amplifie par EDFA : idéale pour le longue distance et le sous-marin. Le 850 nm sert au multimode courte portée.",
   "en": "The C-band (≈1530–1565 nm) has the lowest attenuation and is amplified by EDFAs, ideal for long-haul and subsea. 850 nm is for short-reach multimode."
  }
 },
 {
  "id": "in-asn-02",
  "world": "in",
  "topic": "asn",
  "lvl": 2,
  "q": {
   "fr": "Tata Communications (AS6453) est considéré comme un tier-1. Qu'est-ce qui définit un réseau tier-1 ?",
   "en": "Tata Communications (AS6453) is considered a tier-1. What defines a tier-1 network?"
  },
  "a": [
   {
    "fr": "Il atteint tout Internet sans acheter de transit",
    "en": "It reaches the whole Internet without buying transit"
   },
   {
    "fr": "Il possède au moins un IXP sur chaque continent",
    "en": "It owns at least one IXP on every continent"
   },
   {
    "fr": "Il a un ASN 16 bits inférieur à 10000",
    "en": "It has a 16-bit ASN lower than 10000"
   }
  ],
  "exp": {
   "fr": "Un tier-1 atteint toutes les routes d'Internet via ses clients et du peering gratuit (settlement-free) avec les autres tier-1, sans payer de transit à personne.",
   "en": "A tier-1 reaches every Internet route via its customers and settlement-free peering with the other tier-1s, without paying anyone for transit."
  }
 },
 {
  "id": "cn-ip-01",
  "world": "cn",
  "topic": "ip",
  "lvl": 1,
  "q": {
   "fr": "En Chine, le 8 (八) porte bonheur ! Quel champ de l'en-tête IPv4 fait exactement 8 bits ?",
   "en": "In China, 8 (八) is a lucky number! Which IPv4 header field is exactly 8 bits long?"
  },
  "a": [
   {
    "fr": "TTL (Time To Live)",
    "en": "TTL (Time To Live)"
   },
   {
    "fr": "Adresse source",
    "en": "Source address"
   },
   {
    "fr": "Longueur totale (Total Length)",
    "en": "Total Length"
   }
  ],
  "exp": {
   "fr": "Le TTL fait 8 bits (max 255) et baisse de 1 à chaque routeur ; à 0, le paquet est jeté et un ICMP Time Exceeded est renvoyé. Adresse : 32 bits, Total Length : 16.",
   "en": "TTL is 8 bits (max 255) and drops by 1 at each router; at 0 the packet is discarded and ICMP Time Exceeded is sent back. Addresses are 32 bits, Total Length 16."
  }
 },
 {
  "id": "cn-mpls-03",
  "world": "cn",
  "topic": "mpls",
  "lvl": 2,
  "q": {
   "fr": "Comme un gâteau de lune (月饼) avec son jaune au centre, un paquet L3VPN porte deux labels. Que désigne le label interne (VPN) ?",
   "en": "Like a mooncake (月饼) with a yolk inside, an L3VPN packet carries two labels. What does the inner (VPN) label identify?"
  },
  "a": [
   {
    "fr": "La VRF/le préfixe de destination sur le PE de sortie",
    "en": "The VRF/prefix at the egress PE"
   },
   {
    "fr": "Le prochain routeur P sur le chemin",
    "en": "The next P router on the path"
   },
   {
    "fr": "La classe de service du paquet",
    "en": "The packet's class of service"
   }
  ],
  "exp": {
   "fr": "Le label externe (LDP/RSVP/SR) amène le paquet au PE de sortie ; le label interne, annoncé en MP-BGP, lui indique dans quelle VRF le livrer.",
   "en": "The outer (LDP/RSVP/SR) label carries the packet to the egress PE; the inner label, advertised via MP-BGP, tells that PE which VRF to deliver it to."
  }
 },
 {
  "id": "cn-asn-03",
  "world": "cn",
  "topic": "asn",
  "lvl": 3,
  "q": {
   "fr": "China Telecom exploite le backbone « 163 » (AS4134). Quel ASN porte son réseau premium CN2 ?",
   "en": "China Telecom runs the '163' backbone (AS4134). Which ASN does its premium CN2 network use?"
  },
  "a": [
   {
    "fr": "AS4809",
    "en": "AS4809"
   },
   {
    "fr": "AS4837",
    "en": "AS4837"
   },
   {
    "fr": "AS9808",
    "en": "AS9808"
   }
  ],
  "exp": {
   "fr": "CN2, le réseau premium de China Telecom, est l'AS4809, réputé pour sa qualité de service. AS4837 est China Unicom et AS9808 China Mobile.",
   "en": "CN2, China Telecom's premium network, is AS4809, known for its quality of service. AS4837 is China Unicom and AS9808 is China Mobile."
  }
 },
 {
  "id": "jp-qos-02",
  "world": "jp",
  "topic": "qos",
  "lvl": 1,
  "q": {
   "fr": "Le Shinkansen est réputé pour sa ponctualité, train après train. Quelle métrique mesure la variation du délai d'un paquet à l'autre ?",
   "en": "The Shinkansen is famous for its punctuality, train after train. Which metric measures how delay varies from packet to packet?"
  },
  "a": [
   {
    "fr": "La gigue (jitter)",
    "en": "Jitter"
   },
   {
    "fr": "La latence (RTT)",
    "en": "Latency (RTT)"
   },
   {
    "fr": "Le taux de perte",
    "en": "Packet loss rate"
   }
  ],
  "exp": {
   "fr": "La gigue (jitter, IPDV dans la RFC 3393) mesure la variation du délai entre paquets. La VoIP la lisse avec un jitter buffer, au prix d'un peu de latence en plus.",
   "en": "Jitter (IPDV in RFC 3393) measures how delay varies between packets. VoIP smooths it out with a jitter buffer, at the cost of a little extra latency."
  }
 },
 {
  "id": "jp-latency-01",
  "world": "jp",
  "topic": "latency",
  "lvl": 2,
  "q": {
   "fr": "Paris–Tokyo ≈ 9 700 km à vol d'oiseau. La lumière dans la fibre va à ~200 000 km/s. Quel RTT minimum théorique ?",
   "en": "Paris–Tokyo is ≈ 9,700 km great-circle. Light in fibre travels at ~200,000 km/s. What is the theoretical minimum RTT?"
  },
  "a": [
   {
    "fr": "≈ 100 ms",
    "en": "≈ 100 ms"
   },
   {
    "fr": "≈ 10 ms",
    "en": "≈ 10 ms"
   },
   {
    "fr": "≈ 500 ms",
    "en": "≈ 500 ms"
   }
  ],
  "exp": {
   "fr": "Aller-retour : 2 × 9 700 km ÷ 200 000 km/s ≈ 97 ms. Les vrais câbles font des détours et les équipements ajoutent du délai : les RTT réels sont nettement plus élevés.",
   "en": "Round trip: 2 × 9,700 km ÷ 200,000 km/s ≈ 97 ms. Real cables take detours and equipment adds delay, so real-world RTTs are much higher."
  }
 },
 {
  "id": "jp-security-01",
  "world": "jp",
  "topic": "security",
  "lvl": 3,
  "q": {
   "fr": "Le pirate AS64666 annonce un /24 pris dans le /22 d'AS2914. ROA : /22, maxLength 22, origine AS2914. Avec ROV appliqué, que se passe-t-il ?",
   "en": "Pirate AS64666 announces a /24 out of AS2914's /22. ROA: /22, maxLength 22, origin AS2914. With ROV enforced, what happens?"
  },
  "a": [
   {
    "fr": "Invalid : la route est rejetée",
    "en": "Invalid: the route is rejected"
   },
   {
    "fr": "Valid : le /22 couvre le /24",
    "en": "Valid: the /22 covers the /24"
   },
   {
    "fr": "NotFound : la route est acceptée",
    "en": "NotFound: the route is accepted"
   }
  ],
  "exp": {
   "fr": "Un ROA couvre le /24, mais l'origine ne correspond pas et 24 > maxLength : statut Invalid. Avec ROV appliqué, la route pirate est jetée.",
   "en": "A ROA covers the /24, but the origin AS doesn't match and 24 exceeds maxLength, so it is Invalid. With ROV enforced, the hijack route is dropped."
  }
 }
];
