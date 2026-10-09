"use strict";
/* PING RUNNER – NOC World Tour
   Moteur du jeu : 1 ou 2 joueurs en écran partagé, 7 backbones MPLS (AS), quiz NOC toutes les 30 s. */
(function () {
  const W = 960, H = 640, TOP = 54, PX = 170, QUIZ_EVERY = 30, QUIZ_TIME = 15;
  const $ = id => document.getElementById(id);
  const cv = $("cv"), ctx = cv.getContext("2d");
  const EMO = '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';
  const FONT = 'system-ui,-apple-system,"Segoe UI",Roboto,"Noto Sans","Noto Sans CJK SC","Noto Sans CJK JP","Noto Sans Arabic","Noto Sans Devanagari",sans-serif';
  const NW = () => WORLDS.length;

  /* ---------- Langue ---------- */
  let LANG = (navigator.language || "fr").toLowerCase().startsWith("fr") ? "fr" : "en";
  try { const l = localStorage.getItem("pr_lang"); if (l === "fr" || l === "en") LANG = l; } catch (e) {}
  const T = k => { const v = I18N[LANG][k]; return v != null ? v : (I18N.en[k] != null ? I18N.en[k] : k); };
  const tr = o => o ? (o[LANG] || o.en || o.fr || "") : "";
  const fmt = (s, o) => s.replace(/\{(\w+)\}/g, (m, k) => o[k] != null ? o[k] : m);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ---------- Réglages par AS (game design) ---------- */
  // base = RTT ajouté par cet AS (ms), len = longueur du monde (px), n = créneaux d'obstacles,
  // w = poids des obstacles, ev = évènements spéciaux, dbl = probabilité d'un 2e obstacle.
  const WCFG = {
    fr: { base: 2, len: 6600, spd: 290, n: 15, dbl: .12, w: { lat: 2, loss: 1, bit: 2, cong: 2, jit: 1 }, ev: { hacker: 1 }, label: 16021 },
    de: { base: 10, len: 7000, spd: 300, n: 17, dbl: .16, w: { lat: 2, loss: 2, bit: 1, cong: 3, jit: 1, loop: 1 }, ev: { boost: 2, ddos: 1 }, label: 24005 },
    it: { base: 18, len: 7200, spd: 308, n: 17, dbl: .18, w: { lat: 2, loss: 2, bit: 2, cong: 2, jit: 2, loop: 1 }, ev: { maint: 2, hacker: 1, hijack: 1 }, label: 30117 },
    eg: { base: 30, len: 7400, spd: 314, n: 18, dbl: .2, w: { lat: 3, loss: 3, bit: 2, jit: 2, cong: 1, loop: 1 }, ev: { cut: 2, ddos: 1 }, label: 41210 },
    in: { base: 45, len: 7400, spd: 320, n: 18, dbl: .2, w: { lat: 4, loss: 3, jit: 2, cong: 2, loop: 1, ball: 2 }, ev: { hacker: 1, ddos: 1 }, label: 52004 },
    cn: { base: 55, len: 7800, spd: 326, n: 18, dbl: .22, w: { lat: 2, loss: 3, cong: 3, jit: 2, loop: 2, dragon: 2 }, ev: { boost: 1, gate: 2, hijack: 1, ddos: 1 }, label: 18033 },
    jp: { base: 45, len: 7800, spd: 332, n: 19, dbl: .24, w: { lat: 2, loss: 2, bit: 2, jit: 3, cong: 2, loop: 1 }, ev: { boost: 1, quake: 2, hacker: 1, ddos: 1 }, label: 60001 }
  };
  const BOOSTKEY = { de: "autobahn", cn: "cn2", jp: "shinkansen" };
  const BOOSTICO = { de: "🏎️", cn: "💎", jp: "🚄" };
  const LATICO = { eg: "🌪️", in: "🌧️" };
  const LATKEY = { eg: "sandstorm", in: "monsoon" };
  // Effet de chaque collision : d = santé perdue, l = paquets perdus, push = recul, q = la QoS protège
  const HIT = {
    loss: { d: 8, l: 2, al: "loss", q: 1 },
    bit: { d: 6, l: 1, crc: 1, al: "bit" },
    jit: { d: 4, spike: 70, lane: 1, al: "jit", q: 1 },
    cong: { d: 6, l: 2, push: 110, al: "cong", q: 1 },
    bot: { d: 4, l: 1, al: "ddos", q: 1 },
    ball: { d: 6, l: 1, al: "loss", q: 1 },
    dragon: { d: 9, l: 2, push: 80, al: "cong" },
    loop: { d: 5, ttl: 10, push: 320, al: "loop", nofrr: 1 },
    hacker: { d: 15, l: 3, inc: 1, al: "hacker" },
    hijack: { d: 20, l: 6, push: 420, inc: 1, al: "hijack", nofrr: 1 },
    cut: { d: 25, l: 8, push: 260, al: "cut" },
    maint: { d: 10, l: 3, push: 170, al: "maint" },
    gate: { d: 12, l: 3, push: 250, inc: 1, al: "gate", nofrr: 1 }
  };
  const SEGW = { lat: 300, boost: 1000, maint: 650, cut: 850, hijack: 700 };
  const ICON = { loss: "🕳️", bit: "⚡", jit: "🌊", cong: "🚛", loop: "🔁", bot: "🤖", ball: "🏏", dragon: "🐉", hacker: "🕵️", maint: "🚧", cut: "⚓", hijack: "🏴‍☠️", gate: "🔥", lat: "🐌", boost: "»" };
  const PKICO = { qos: "⭐", fec: "🧩", lock: "🔒", rpki: "🛡️", sab: "⚔️" };
  const DENY = ["TCP 23", "TCP 445", "UDP 1900", "TCP 3389", "UDP 161"];
  const PCOL = ["#38e1ff", "#ff5ad0"];

  /* ---------- Utilitaires ---------- */
  function rng(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function wpick(w, R) { let s = 0; for (const k in w) s += w[k]; let r = R() * s; for (const k in w) { r -= w[k]; if (r <= 0) return k; } return Object.keys(w)[0]; }
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const mean = a => a.length ? a.reduce((s, v) => s + v, 0) / a.length : 0;
  const stdev = a => { if (a.length < 2) return 0; const m = mean(a); return Math.sqrt(mean(a.map(v => (v - m) * (v - m)))); };
  const world = i => WORLDS[clamp(i, 0, NW() - 1)];
  const cfg = i => WCFG[world(i).id] || WCFG.fr;
  const cumBase = i => { let s = 0; for (let k = 0; k < i; k++) s += cfg(k).base; return s; };
  const special = (wd, key) => (wd.specials || []).find(s => s.key === key);

  let AC = null, mute = false;
  function beep(f, d = .08, type = "square", v = .03) {
    if (mute) return;
    try {
      AC = AC || new (window.AudioContext || window.webkitAudioContext)();
      const o = AC.createOscillator(), g = AC.createGain();
      o.type = type; o.frequency.value = f; g.gain.value = v; o.connect(g); g.connect(AC.destination);
      o.start(); g.gain.exponentialRampToValueAtTime(.0001, AC.currentTime + d); o.stop(AC.currentTime + d);
    } catch (e) {}
  }

  /* ---------- Génération des mondes (identique pour les deux joueurs) ---------- */
  function genWorld(wi, seed, versus) {
    const C = cfg(wi), R = rng(seed * 31 + wi * 7919 + 1), L = [];
    const x0 = 850, x1 = C.len - 520;
    const evs = [];
    for (const k in C.ev) for (let i = 0; i < C.ev[k]; i++) evs.push(k);
    for (let i = evs.length - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); [evs[i], evs[j]] = [evs[j], evs[i]]; }
    const n = C.n + evs.length, step = (x1 - x0) / n;
    const evAt = new Map();
    evs.forEach((e, i) => evAt.set(Math.floor((i + .5) * n / evs.length), e));
    let calmUntil = -1, calmLane = -1, skip = 0;
    const pkw = versus ? { qos: 3, fec: 3, lock: 1, rpki: 1, sab: 2, cul: 3 } : { qos: 3, fec: 3, lock: 1, rpki: 1, cul: 4 };
    for (let s = 0; s < n; s++) {
      const x = x0 + s * step + R() * step * .18;
      if (skip > 0) { skip--; continue; }
      const ev = evAt.get(s);
      if (ev) {
        const lane = Math.floor(R() * 3);
        if (ev === "ddos") {
          for (let l = 0; l < 3; l++) if (l !== lane) for (let j = 0; j < 4; j++) L.push({ k: "obs", t: "bot", x: x + j * 85, lane: l });
          skip = 1;
        } else if (ev === "gate") {
          const labels = [0, 1, 2].map(() => DENY[Math.floor(R() * DENY.length)]);
          L.push({ k: "gate", t: "gate", x, ok: lane, labels });
        } else if (ev === "hacker" || ev === "quake") {
          L.push({ k: "trig", t: ev, x });
          if (ev === "hacker" && R() < .7) L.push({ k: "pk", t: "lock", x: x - 280, lane: Math.floor(R() * 3) });
        } else {
          const w = SEGW[ev];
          L.push({ k: "seg", t: ev, x, w, lane });
          if (ev !== "boost") { calmUntil = x + w + 60; calmLane = lane; }
          if (ev === "hijack" && R() < .75) L.push({ k: "pk", t: "rpki", x: x - 520, lane: (lane + 1 + Math.floor(R() * 2)) % 3 });
        }
        continue;
      }
      const t = wpick(C.w, R);
      let lane = Math.floor(R() * 3);
      if (x < calmUntil + 300 && lane === calmLane) lane = (lane + 1 + Math.floor(R() * 2)) % 3;
      if (t === "lat") L.push({ k: "seg", t: "lat", x, w: SEGW.lat, lane });
      else L.push({ k: "obs", t, x, lane });
      if (x > calmUntil && t !== "loop" && t !== "lat" && t !== "dragon" && R() < C.dbl) {
        const w2 = Object.assign({}, C.w); delete w2.loop; delete w2.lat; delete w2.dragon;
        L.push({ k: "obs", t: wpick(w2, R), x: x + (R() - .5) * 40, lane: (lane + 1 + Math.floor(R() * 2)) % 3 });
      }
      if (R() < .55) L.push({ k: "pk", t: wpick(pkw, R), x: x + step * .5, lane: Math.floor(R() * 3) });
    }
    L.forEach((o, i) => { o.id = i; o.ph = (i * 1.7) % 6.28; });
    return L.sort((a, b) => a.x - b.x);
  }

  /* ---------- État ---------- */
  let G = null, best = 0, mode = "cpu";
  try { best = +localStorage.getItem("pr_best") || 0; } catch (e) {}
  const names = { p1: "", p2: "" };

  function viewports(n) {
    if (n === 1) { const h = H - TOP; return [{ y: TOP, h, sp: 112, k: 1.4 }]; }
    const h = (H - TOP - 6) / 2;
    return [{ y: TOP, h, sp: 64, k: 1 }, { y: TOP + h + 6, h, sp: 64, k: 1 }];
  }
  function newPlayer(i, ctrl, name, vp) {
    return {
      i, ctrl, name, col: PCOL[i], vp, wi: 0, cam: 0, lane: 1, y: 0, items: [], drones: [],
      health: 100, ttl: 64, lost: 0, sent: 0, crc: 0, inc: 0, deaths: 0, pts: 0, quizOk: 0, quizN: 0,
      inv: 0, frrCd: 0, frrT: 0, qosT: 0, lockT: 0, rpki: false, spike: 0, inLat: false, inBoost: false,
      dist: 0, last: 0, prev: null, jsum: 0, jn: 0, ws: WORLDS.map(() => ({ snt: 0, lost: 0, s: [] })),
      done: false, finishT: 0, fx: [], fl: [], msg: null, msgT: 0, banner: 0, tip: null, tipT: 0, seen: {},
      alarm: null, alarmT: 0, shake: 0, quakeT: 0, cpuT: 0, amb: [], hops: 0, warnT: 0, warnFrom: ""
    };
  }
  function startGame(m, forcedSeed) {
    mode = m || mode;
    const seed = forcedSeed != null ? forcedSeed : Math.floor(Math.random() * 1e9);
    const n = mode === "solo" ? 1 : 2, vps = viewports(n), versus = n === 2;
    const ps = [newPlayer(0, "human", names.p1 || T("p1"), vps[0])];
    if (n === 2) ps.push(newPlayer(1, mode === "cpu" ? "cpu" : "human", mode === "cpu" ? T("cpu") : (names.p2 || T("p2")), vps[1]));
    G = { mode, seed, versus, P: ps, layouts: WORLDS.map((w, i) => genWorld(i, seed, versus)), state: "count", countT: 3,
          time: 0, quizClock: 0, quiz: null, usedQ: new Set(), paused: false };
    ps.forEach(p => { enterWorld(p, 0); p.y = laneY(p, 1); });
    $("ov").style.display = "none"; $("qz").style.display = "none";
    $("pad2").style.display = n === 2 && mode === "2p" ? "flex" : "none";
    $("pad1").querySelector(".who").textContent = n === 2 && mode === "2p" ? "J1" : "";
    beep(520, .1, "triangle");
  }
  const laneY = (P, l) => P.vp.h * .6 + (l - 1) * P.vp.sp;
  const tubeTop = P => laneY(P, 0) - P.vp.sp * .62;
  function enterWorld(P, wi) {
    P.wi = wi; P.cam = 0; P.rpki = false; P.drones = [];
    P.items = G.layouts[wi].map(o => Object.assign({}, o, { used: false, y: null }));
    P.banner = 3; P.inLat = P.inBoost = false;
    const nat = special(world(wi), "nat"); if (nat) say(P, "🔁 " + nat.native + " · 192.168.1.10 → 41.250.8.17", "#9dffcf", 4);
    P.amb = []; const R = rng(wi * 99 + P.i);
    for (let i = 0; i < 26; i++) P.amb.push({ x: R() * W, y: R() * P.vp.h, v: .4 + R(), s: .6 + R() * .8 });
  }

  /* ---------- Règles ---------- */
  function say(P, txt, col, t) { P.msg = { txt, col: col || "#fff" }; P.msgT = t || 2.4; }
  function floater(P, txt, col) { P.fl.push({ txt, col, x: PX + 44, y: P.y - 26, life: 1.2 }); }
  function burst(P, x, y, col, n) { for (let i = 0; i < (n || 12); i++) P.fx.push({ x, y, vx: (Math.random() - .5) * 320, vy: (Math.random() - .5) * 320, life: .6, col }); }
  function alarm(P, key) {
    const wd = world(P.wi), txt = (wd.alarms && wd.alarms[key]) || key;
    const sev = /CRIT|严重|緊急|重大|حرج|गंभीर|KRIT/i.test(txt) ? "#ff4d6d" : /MAJ|主要|重要|رئيس|प्रमुख/i.test(txt) ? "#ffb020" : "#ffd24d";
    P.alarm = { txt, col: sev, dir: wd.dir }; P.alarmT = 5;
  }
  function tip(P, key, isPk) {
    const wd = world(P.wi);
    const sk0 = (key === "qos" && special(wd, "espresso")) || (key === "cul") || (key === "lat" && LATKEY[wd.id]) ? key + "@" + wd.id : key;
    if (P.seen[sk0]) return; P.seen[sk0] = 1;
    const ui = isPk ? T("pk")[key] : T("hz")[key];
    if (!ui) return;
    let native = "";
    if (!isPk && wd.hazards) {
      const hk = key === "bot" ? "ddos" : key === "boost" || key === "dragon" || key === "ball" ? null : key;
      native = hk ? wd.hazards[hk] || "" : "";
      const sk = key === "boost" ? BOOSTKEY[wd.id] : key === "dragon" ? "dragon" : key === "ball" ? "cricket" : key === "maint" ? "maint" : key === "cut" ? "anchor" : key === "gate" && wd.id === "cn" ? "gate" : key === "hacker" && wd.id === "fr" ? "arp" : key === "lat" ? LATKEY[wd.id] : null;
      const sp = sk && special(wd, sk); if (sp) native = sp.native;
    }
    if (isPk && key === "cul" && wd.culture) native = wd.culture.native + " (" + tr(wd.culture) + ")";
    const esp = isPk && key === "qos" && special(wd, "espresso");
    if (esp) native = esp.native;
    P.tip = { ico: isPk ? (key === "cul" ? (wd.culture ? wd.culture.emoji : "🎁") : esp ? "☕" : PKICO[key]) : ICON[key] || "", native, dir: wd.dir, name: ui[0], d: ui[1] };
    P.tipT = 4.6;
  }
  function probe(P) {
    const C = cfg(P.wi), ws = P.ws[P.wi];
    let s = cumBase(P.wi) + C.base * clamp(P.cam / C.len, 0, 1) + P.spike + Math.random() * 2.5;
    if (P.inLat && P.qosT <= 0) s += 70 + Math.random() * 40;
    if (P.inBoost) s *= .88;
    s = Math.max(.4, s);
    ws.snt++; P.sent++; ws.s.push(s);
    if (P.prev != null) { P.jsum += Math.abs(s - P.prev); P.jn++; }
    P.prev = s; P.last = s; P.spike *= .85;
  }
  function loseP(P, n) { P.lost += n; P.ws[P.wi].lost += n; }
  function hit(P, t, o) {
    const h = HIT[t]; if (!h) return;
    if (window.__PRDBG) window.__PRDBG(P, t, o);
    if (P.frrT > 0 && !h.nofrr) { if (o) o.used = o.k === "obs" ? true : o.used; return; }
    if (h.q && P.qosT > 0) { if (o && o.k === "obs") o.used = true; floater(P, "QoS EF ⭐", "#ffd24d"); return; }
    if (t === "hacker" && P.lockT > 0) { P.pts += 100; floater(P, T("lockOk"), "#37e6a0"); beep(880, .12, "triangle"); return; }
    if (t === "hijack" && P.rpki) { if (o && !o.used) { o.used = true; P.pts += 150; floater(P, T("rpkiOk"), "#37e6a0"); beep(880, .12, "triangle"); } return; }
    if (P.inv > 0) return;
    if (o && o.k === "obs") o.used = true;
    if (o) { o.cpuFool = false; o.cpuKnow = true; } // le bot NOC apprend de ses erreurs
    P.health -= h.d; if (h.l) loseP(P, h.l);
    if (h.crc) P.crc += 1 + Math.floor(Math.random() * 4);
    if (h.inc) P.inc++;
    if (h.spike) P.spike += h.spike;
    if (h.ttl) P.ttl -= h.ttl;
    if (h.push) P.cam = Math.max(0, P.cam - h.push);
    if (h.lane) P.lane = Math.floor(Math.random() * 3);
    P.inv = .7; P.shake = .3;
    burst(P, PX, P.y, t === "bit" ? "#ffb020" : t === "loop" ? "#ff5ad0" : "#ff4d6d");
    floater(P, "−" + h.d + " " + T("health") + (h.l ? "  −" + h.l + " pkt" : "") + (h.ttl ? "  TTL −" + h.ttl : ""), "#ff6b81");
    alarm(P, h.al);
    beep(t === "loop" ? 150 : 120, .16, "sawtooth");
    if (t === "gate") say(P, T("aclKo"), "#ff4d6d");
    if (P.health <= 0 || P.ttl <= 0) destroy(P, P.ttl <= 0 ? "ttl" : "hp");
  }
  function destroy(P, why) {
    P.deaths++; loseP(P, 10); (P.dlog = P.dlog || []).push(why + "@" + P.wi);
    if (why === "ttl") { P.health = Math.max(10, P.health - 15); alarm(P, "loop"); }
    else P.health = 50;
    P.ttl = 64 - P.hops;
    enterWorld(P, P.wi); P.banner = 0; P.inv = 1.6;
    say(P, why === "ttl" ? T("ttlx") : T("destroyed"), "#ff4d6d", 3.4);
    beep(90, .5, "sawtooth", .05);
  }
  function useFrr(P) {
    if (!G || G.state !== "play" || G.paused || P.done || P.frrCd > 0) return;
    P.frrT = .8; P.frrCd = 7; P.cam += 90;
    floater(P, T("frrOn"), "#38e1ff"); beep(1200, .1, "triangle"); beep(1500, .12, "triangle");
  }
  function setLane(P, d) {
    if (!G || G.state !== "play" || G.paused || P.done) return;
    const l = clamp(P.lane + d, 0, 2);
    if (l !== P.lane) { P.lane = l; beep(440 + l * 60, .03, "square", .015); }
  }
  function pickup(P, o) {
    o.used = true; burst(P, PX + 30, P.y, "#37e6a0", 10); beep(990, .09, "triangle");
    const wd = world(P.wi);
    tip(P, o.t, true);
    if (o.t === "qos") { P.qosT = 4; const es = special(wd, "espresso"); floater(P, es ? "☕ " + es.native : "QoS EF ⭐", "#ffd24d"); }
    else if (o.t === "fec") { P.health = Math.min(100, P.health + 15); floater(P, "FEC +15 🧩", "#37e6a0"); }
    else if (o.t === "lock") { P.lockT = 10; floater(P, "🔒 MACsec/IPsec", "#37e6a0"); }
    else if (o.t === "rpki") { P.rpki = true; floater(P, "🛡️ RPKI ROA", "#37e6a0"); }
    else if (o.t === "sab") {
      const O = G.P.find(q => q !== P);
      if (O && !O.done) {
        const free = Math.floor(Math.random() * 3), x = O.cam + 900, base = O.items.length;
        for (let l = 0; l < 3; l++) if (l !== free) for (let j = 0; j < 4; j++) O.items.push({ k: "obs", t: "bot", x: x + j * 80, lane: l, id: 9000 + base + l * 4 + j, ph: j, used: false, y: null });
        O.items.sort((a, b) => a.x - b.x);
        O.warnT = 2.6; O.warnFrom = P.name; beep(300, .2, "sawtooth");
        say(P, T("sabotage"), "#ffd24d"); P.pts += 50;
      } else { P.pts += 50; }
    } else {
      P.health = Math.min(100, P.health + 5); P.pts += 80;
      floater(P, (wd.culture ? wd.culture.emoji + " " + wd.culture.native : "🎁") + " +5", "#ffd24d");
    }
  }
  function nextWorld(P) {
    const wd = world(P.wi), nh = (wd.hostnames || [1, 2, 3]).length;
    if (P.ttl - nh <= 0) { destroy(P, "ttl"); return; }
    P.hops += nh; P.ttl -= nh;
    if (P.wi >= NW() - 1) {
      P.done = true; P.finishT = G.time;
      beep(523, .12, "triangle"); setTimeout(() => beep(659, .12, "triangle"), 120); setTimeout(() => beep(784, .25, "triangle"), 240);
      if (G.P.every(q => q.done)) setTimeout(showResults, 1400);
      return;
    }
    enterWorld(P, P.wi + 1);
    beep(660, .08, "triangle"); beep(990, .12, "triangle");
  }

  /* ---------- IA (bot NOC) ---------- */
  function laneOfY(P, y) { return clamp(Math.round((y - laneY(P, 0)) / P.vp.sp), 0, 2); }
  function cpuThink(P, dt) {
    P.cpuT -= dt; if (P.cpuT > 0) return;
    P.cpuT = .1 + Math.random() * .13;
    const cost = [0, 0, 0], look = 340;
    for (const o of P.items) {
      const rel = o.x - P.cam;
      if (o.k === "obs") {
        if (o.used || rel < -40 || rel > look) continue;
        const l = laneOfY(P, o.y != null ? o.y : laneY(P, o.lane));
        cost[l] += 100;
        if (o.t === "jit" || o.t === "dragon" || o.t === "ball") { if (l > 0) cost[l - 1] += 35; if (l < 2) cost[l + 1] += 35; }
      } else if (o.k === "seg") {
        if (rel > look + 120 || o.x + o.w - P.cam < -30) continue;
        if (o.cpuFool == null) o.cpuFool = Math.random() < .25;
        cost[o.lane] += o.t === "boost" ? -30 : o.t === "lat" ? (P.qosT > 0 ? 0 : 25) : o.t === "hijack" ? (P.rpki ? -5 : o.cpuFool ? -20 : 250) : 300;
      } else if (o.k === "gate") {
        if (rel < -30 || rel > 520) continue;
        if (o.cpuKnow == null) o.cpuKnow = Math.random() < .85;
        for (let l = 0; l < 3; l++) if (o.cpuKnow ? l !== o.ok : l === (o.ok + 1) % 3) cost[l] += 400;
      } else if (o.k === "pk" && !o.used && rel > 0 && rel < look) cost[o.lane] -= 18;
    }
    if (P.lockT <= 0) for (const d of P.drones) if (d.rx > 0 && d.rx < 420) cost[laneOfY(P, d.y)] += 70;
    cost[P.lane] -= 5;
    let bestL = P.lane; for (let l = 0; l < 3; l++) if (cost[l] < cost[bestL]) bestL = l;
    const r = Math.floor(Math.random() * 3);
    if (Math.random() < .03 && cost[r] < 100) bestL = r; // petite erreur humaine
    if (Math.abs(bestL - P.lane) === 2 && cost[1] >= 250 && cost[P.lane] < 100) bestL = P.lane; // ne traverse pas une voie fermée
    if (bestL !== P.lane) setLane(P, bestL > P.lane ? 1 : -1);
    if (cost[P.lane] >= 100 && P.frrCd <= 0 && Math.random() < .3) useFrr(P);
  }

  /* ---------- Mise à jour ---------- */
  function updPlayer(P, dt) {
    P.fx.forEach(p => { p.x += p.vx * dt; p.y += p.vy * dt; p.life -= dt; }); P.fx = P.fx.filter(p => p.life > 0);
    P.fl.forEach(f => { f.y -= 38 * dt; f.life -= dt; }); P.fl = P.fl.filter(f => f.life > 0);
    ["msgT", "alarmT", "shake", "banner", "warnT", "quakeT"].forEach(k => { if (P[k] > 0) P[k] -= dt; });
    if (P.tipT > 0 && !(P.msgT > 0) && P.banner <= 0) P.tipT -= dt;
    if (P.done) return;
    ["inv", "frrT", "frrCd", "qosT", "lockT"].forEach(k => { if (P[k] > 0) P[k] -= dt; });
    if (P.ctrl === "cpu") cpuThink(P, dt);
    P.y += (laneY(P, P.lane) - P.y) * Math.min(1, dt * 16);
    const C = cfg(P.wi);
    let mul = 1;
    if (P.inLat && P.qosT <= 0) mul *= .5;
    if (P.inBoost) mul *= 1.4;
    if (P.qosT > 0) mul *= 1.2;
    const v = C.spd * mul;
    P.cam += v * dt; P.dist += v * dt;
    while (P.dist >= 40) { P.dist -= 40; probe(P); }
    let inLat = false, inBoost = false;
    const k = P.vp.k, sp = P.vp.sp;
    for (const o of P.items) {
      let rel = o.x - P.cam;
      if (rel > 1100) break;
      if (o.k === "obs") {
        const act = rel < 900;
        if (o.t === "cong" && act) o.x -= 120 * dt;
        else if (o.t === "bot" && act) o.x -= 230 * dt;
        else if (o.t === "ball" && act) o.x -= 160 * dt;
        else if (o.t === "dragon" && act) o.x -= 50 * dt;
        if (o.t === "jit") o.y = laneY(P, o.lane) + Math.sin(G.time * 2.4 + o.ph) * sp * .9;
        else if (o.t === "dragon") o.y = laneY(P, 1) + Math.sin(G.time * 1.3 + o.ph) * sp * 1.05;
        else if (o.t === "ball") { const ph = (G.time * .9 + o.ph) % 2; o.y = laneY(P, 0) + (ph < 1 ? ph : 2 - ph) * 2 * sp; }
        else o.y = laneY(P, o.lane);
        rel = o.x - P.cam;
        if (rel < -200) continue;
        if (rel < 760) tip(P, o.t);
        if (o.used) continue;
        const ow = (o.t === "dragon" ? 100 : o.t === "bot" ? 28 : 40) * k, oh = (o.t === "dragon" ? 40 : 34) * k;
        if (Math.abs(rel) < ow / 2 + 28 * k && Math.abs(o.y - P.y) < oh / 2 + 14 * k) hit(P, o.t, o);
      } else if (o.k === "seg") {
        if (o.x + o.w - P.cam < -60) continue;
        if (rel < 760) tip(P, o.t);
        // il faut être réellement installé dans la voie (traverser vite ne compte pas)
        const inside = P.cam > o.x - 26 && P.cam < o.x + o.w + 26 && P.lane === o.lane && Math.abs(laneY(P, o.lane) - P.y) < sp * .3;
        if (!inside) continue;
        if (o.t === "lat") inLat = true;
        else if (o.t === "boost") inBoost = true;
        else hit(P, o.t, o);
      } else if (o.k === "gate") {
        if (rel < -80) continue;
        if (rel < 760) tip(P, "gate");
        if (Math.abs(rel) < 30 * k) {
          if (P.lane === o.ok) { if (!o.used) { o.used = true; P.pts += 60; floater(P, T("aclOk") + " +60", "#37e6a0"); beep(700, .1, "triangle"); } }
          else hit(P, "gate", o);
        }
      } else if (o.k === "trig") {
        if (o.used || rel > 420) continue;
        o.used = true;
        if (o.t === "hacker") { P.drones.push({ rx: 820, y: laneY(P, Math.floor(Math.random() * 3)), t: 0, st: "hover", done: false }); tip(P, "hacker"); beep(220, .3, "sawtooth"); }
        else {
          P.quakeT = 2.2; P.shake = 2.2; say(P, "🌏 " + T("quake"), "#ffb020");
          const sq = special(world(P.wi), "quake"); if (sq) say(P, "📳 " + sq.native + " · " + T("quake"), "#ffb020");
          for (let j = 0; j < 3; j++) P.items.push({ k: "obs", t: "jit", x: P.cam + 520 + j * 170, lane: Math.floor(Math.random() * 3), ph: j * 2, used: false, y: null, id: 8000 + j });
          P.items.sort((a, b) => a.x - b.x); alarm(P, "jit");
        }
      } else if (o.k === "pk") {
        if (o.used || rel < -60) continue;
        if (Math.abs(rel) < 36 * k && Math.abs(laneY(P, o.lane) - P.y) < 30 * k) pickup(P, o);
      }
    }
    P.inLat = inLat; P.inBoost = inBoost;
    if (inLat && P.qosT <= 0 && !P.latAl) { alarm(P, "lat"); P.latAl = true; } else if (!inLat) P.latAl = false;
    for (const d of P.drones) {
      d.t += dt;
      if (d.st === "hover") { d.rx += (300 - d.rx) * Math.min(1, dt * 3); d.y += clamp(P.y - d.y, -95 * dt, 95 * dt); if (d.t > 1.7) d.st = "dive"; }
      else if (d.st === "dive") { d.rx -= 330 * dt; d.y += clamp(P.y - d.y, -70 * dt, 70 * dt); if (d.rx < -140) d.st = "gone"; }
      else { d.rx -= 400 * dt; d.y -= 120 * dt; }
      if (d.st === "dive" && Math.abs(d.rx) < 36 * k && Math.abs(d.y - P.y) < 26 * k) { hit(P, "hacker", null); d.st = "leave"; burst(P, PX + d.rx, d.y, "#ff4d6d", 16); }
    }
    P.drones = P.drones.filter(d => d.rx > -300 && d.t < 9);
    if (P.cam >= C.len) nextWorld(P);
  }
  function update(dt) {
    if (!G) return;
    if (G.paused) return;
    if (G.state === "count") { G.countT -= dt; if (G.countT <= 0) G.state = "play"; return; }
    if (G.state === "quiz") { updQuiz(dt); return; }
    if (G.state !== "play") { G.P.forEach(P => updPlayer(P, 0)); return; }
    G.time += dt;
    G.P.forEach(P => updPlayer(P, dt));
    if (!G.P.every(P => P.done)) { G.quizClock += dt; if (G.quizClock >= QUIZ_EVERY && G.P.some(P => !P.done)) startQuiz(); }
  }

  /* ---------- Quiz NOC (toutes les 30 s) ---------- */
  function startQuiz() {
    const lead = G.P.reduce((a, b) => (b.wi * 1e5 + b.cam > a.wi * 1e5 + a.cam ? b : a));
    const wid = world(lead.wi).id;
    let pool = QUIZ.filter(q => !G.usedQ.has(q.id));
    if (!pool.length) { G.usedQ.clear(); pool = QUIZ.slice(); }
    const local = pool.filter(q => q.world === wid), any = pool.filter(q => q.world === "any");
    const src = local.length && (Math.random() < .5 || !any.length) ? local : (any.length ? any : pool);
    const q = src[Math.floor(Math.random() * src.length)];
    G.usedQ.add(q.id);
    const order = [0, 1, 2].sort(() => Math.random() - .5);
    G.quiz = { q, order, correct: order.indexOf(0), ans: {}, t: 0, rev: false, revT: 0, wi: lead.wi };
    G.P.forEach(P => { if (P.ctrl === "cpu") P.cpuAns = { at: 2.5 + Math.random() * 5, idx: Math.random() < .65 ? G.quiz.correct : (G.quiz.correct + 1 + Math.floor(Math.random() * 2)) % 3 }; });
    G.state = "quiz"; G.quizClock = 0;
    beep(784, .1, "triangle"); beep(988, .15, "triangle");
    renderQuiz();
    $("qz").style.display = "flex";
  }
  function answer(pi, idx) {
    const Z = G && G.quiz; if (!Z || Z.rev || G.state !== "quiz") return;
    if (Z.ans[pi] != null || !G.P[pi]) return;
    Z.ans[pi] = { idx, t: Z.t };
    beep(600, .05, "square", .02);
    if (G.P.every(P => Z.ans[P.i] != null)) reveal(); else renderQuiz();
  }
  function updQuiz(dt) {
    const Z = G.quiz; Z.t += dt;
    if (!Z.rev) {
      G.P.forEach(P => { if (P.ctrl === "cpu" && Z.ans[P.i] == null && Z.t >= P.cpuAns.at) answer(P.i, P.cpuAns.idx); });
      if (!Z.rev && Z.t >= QUIZ_TIME) reveal();
      const bar = $("qbar"); if (bar) bar.style.width = Math.max(0, 100 - Z.t / QUIZ_TIME * 100) + "%";
    } else {
      Z.revT += dt; if (Z.revT > 14) endQuiz();
    }
  }
  function reveal() {
    const Z = G.quiz; Z.rev = true; Z.revT = 0;
    const right = G.P.filter(P => Z.ans[P.i] && Z.ans[P.i].idx === Z.correct).sort((a, b) => Z.ans[a.i].t - Z.ans[b.i].t);
    Z.res = {};
    G.P.forEach(P => {
      P.quizN++;
      const a = Z.ans[P.i];
      if (a && a.idx === Z.correct) {
        P.quizOk++; P.health = Math.min(100, P.health + 10); P.frrCd = 0; P.pts += 200;
        const fast = G.P.length > 1 && right[0] === P;
        if (fast) { P.health = Math.min(100, P.health + 5); P.pts += 100; }
        Z.res[P.i] = { ok: true, fast, txt: T("correct") + " · +" + (fast ? 15 : 10) + " " + T("heal") + (fast ? " · " + T("fastest") : "") };
      } else {
        P.health = Math.max(1, P.health - 5);
        Z.res[P.i] = { ok: false, txt: (a ? T("wrong") : T("none")) + " · −5 " + T("heal") + " (" + T("escal") + ")" };
      }
    });
    beep(right.length ? 900 : 160, .2, right.length ? "triangle" : "sawtooth");
    renderQuiz();
  }
  function endQuiz() {
    if (!G || !G.quiz || !G.quiz.rev) return;
    G.quiz = null; $("qz").style.display = "none";
    G.state = "count"; G.countT = 3;
  }
  function renderQuiz() {
    const Z = G.quiz, q = Z.q, wd = q.world !== "any" ? WORLDS.find(w => w.id === q.world) : null;
    const L = ["A", "B", "C"];
    const keys = G.mode === "2p" ? [["1", "2", "3"], ["J", "K", "L"]] : [["1", "2", "3"], []];
    let h = '<div class="qhead"><span>' + T("quiz") + '</span><span class="qtag">' + (wd ? wd.flag + " AS" + wd.asn + " · " : "") + esc(q.topic) + " · " + "★".repeat(q.lvl || 1) + '</span></div>';
    h += '<div class="qbarw"><div id="qbar" class="qbar" style="width:' + (Z.rev ? 0 : Math.max(0, 100 - Z.t / QUIZ_TIME * 100)) + '%"></div></div>';
    h += '<h3 class="qq">' + esc(tr(q.q)) + '</h3><ol class="qopts">';
    Z.order.forEach((oi, i) => {
      const cls = Z.rev ? (i === Z.correct ? "good" : G.P.some(P => Z.ans[P.i] && Z.ans[P.i].idx === i) ? "bad" : "") : "";
      const who = G.P.filter(P => Z.rev && Z.ans[P.i] && Z.ans[P.i].idx === i).map(P => '<span class="dot" style="background:' + P.col + '"></span>').join("");
      h += '<li class="' + cls + '"><b>' + L[i] + '</b> ' + esc(tr(q.a[oi])) + who + '</li>';
    });
    h += '</ol><div class="qplayers">';
    G.P.forEach(P => {
      const a = Z.ans[P.i];
      h += '<div class="qp" style="border-color:' + P.col + '"><div class="qpn" style="color:' + P.col + '">' + esc(P.name) + '</div>';
      if (Z.rev) h += '<div class="qres ' + (Z.res[P.i].ok ? "ok" : "ko") + '">' + esc(Z.res[P.i].txt) + '</div>';
      else if (a) h += '<div class="qlock">🔒 ' + T("locked") + '</div>';
      else if (P.ctrl === "cpu") h += '<div class="qlock">🤖 …</div>';
      else h += '<div class="qbtns">' + L.map((l, i) => '<button data-p="' + P.i + '" data-a="' + i + '">' + l + (keys[P.i] && keys[P.i][i] ? '<small>' + keys[P.i][i] + '</small>' : '') + '</button>').join("") + '</div>';
      h += '</div>';
    });
    h += '</div>';
    if (Z.rev) {
      h += '<div class="exp">💡 ' + esc(tr(q.exp)) + '</div>';
      const fw = world(Z.wi);
      if (fw && fw.fact) h += '<div class="exp fact">' + fw.flag + ' <b>' + T("funFact") + '</b> ' + esc(tr(fw.fact)) + ' <span class="nat" lang="' + esc(fw.lang) + '" dir="' + esc(fw.dir) + '">« ' + esc(fw.slogan ? fw.slogan.native : "") + ' »</span></div>';
      h += '<button class="btn" id="qgo">' + T("cont") + '</button>';
    }
    $("qbox").innerHTML = h;
    $("qbox").querySelectorAll("button[data-p]").forEach(b => b.onclick = () => answer(+b.dataset.p, +b.dataset.a));
    const go = $("qgo"); if (go) go.onclick = endQuiz;
  }

  /* ---------- Rendu ---------- */
  function rr(x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
  function emoji(e, x, y, s) { ctx.font = s + "px " + EMO; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(e, x, y); }
  function txt(s, x, y, size, col, align, weight, dir, maxW) {
    ctx.font = (weight || 600) + " " + size + "px " + FONT; ctx.textAlign = align || "left"; ctx.textBaseline = "middle";
    ctx.fillStyle = col; ctx.direction = dir || "ltr";
    if (maxW) { let sz = size; while (sz > 9 && ctx.measureText(s).width > maxW) { sz--; ctx.font = (weight || 600) + " " + sz + "px " + FONT; } }
    ctx.fillText(s, x, y); ctx.direction = "ltr";
  }
  function hexA(hex, a) { const h = (hex || "#4da3ff").replace("#", ""); const n = parseInt(h.length === 3 ? h.split("").map(c => c + c).join("") : h, 16); return "rgba(" + (n >> 16 & 255) + "," + (n >> 8 & 255) + "," + (n & 255) + "," + a + ")"; }

  function landmark(id, x, b, hh) {
    ctx.beginPath();
    if (id === "fr") { // tour Eiffel
      ctx.moveTo(x - 46, b); ctx.quadraticCurveTo(x - 14, b - hh * .45, x - 5, b - hh); ctx.lineTo(x + 5, b - hh); ctx.quadraticCurveTo(x + 14, b - hh * .45, x + 46, b);
      ctx.moveTo(x - 30, b - hh * .22); ctx.lineTo(x + 30, b - hh * .22); ctx.moveTo(x - 15, b - hh * .52); ctx.lineTo(x + 15, b - hh * .52);
      ctx.moveTo(x - 22, b); ctx.arc(x, b, 22, Math.PI, 0); ctx.moveTo(x, b - hh); ctx.lineTo(x, b - hh - 16);
    } else if (id === "de") { // porte de Brandebourg
      ctx.rect(x - 75, b - hh * .62, 150, 16); ctx.rect(x - 20, b - hh * .62 - 18, 40, 18);
      for (let i = 0; i < 6; i++) { const cx = x - 66 + i * 26.4; ctx.moveTo(cx, b - hh * .62 + 16); ctx.lineTo(cx, b); }
    } else if (id === "it") { // Colisée
      ctx.moveTo(x - 115, b); ctx.lineTo(x - 115, b - hh * .55); ctx.quadraticCurveTo(x, b - hh * .68, x + 115, b - hh * .45); ctx.lineTo(x + 115, b);
      for (let r = 0; r < 3; r++) for (let i = 0; i < 8; i++) { const ax = x - 100 + i * 28, ay = b - 8 - r * hh * .16; ctx.moveTo(ax - 8, ay); ctx.arc(ax, ay - 6, 8, Math.PI, 0); }
    } else if (id === "eg") { // pyramides
      [[0, 1], [-120, .7], [110, .55]].forEach(p => { ctx.moveTo(x + p[0] - hh * p[1] * .9, b); ctx.lineTo(x + p[0], b - hh * p[1]); ctx.lineTo(x + p[0] + hh * p[1] * .9, b); });
    } else if (id === "in") { // dôme et minarets
      ctx.rect(x - 60, b - hh * .4, 120, hh * .4); ctx.moveTo(x - 45, b - hh * .4); ctx.bezierCurveTo(x - 55, b - hh * .85, x + 55, b - hh * .85, x + 45, b - hh * .4);
      ctx.moveTo(x, b - hh * .78); ctx.lineTo(x, b - hh * .92);
      [-95, -75, 75, 95].forEach(dx => { ctx.moveTo(x + dx, b); ctx.lineTo(x + dx, b - hh * .7); });
    } else if (id === "cn") { // Grande Muraille + pagode
      ctx.moveTo(x - 260, b - hh * .2);
      for (let i = 0; i < 26; i++) { const px = x - 260 + i * 20, py = b - hh * .2 - Math.sin(i / 4) * hh * .15; ctx.lineTo(px, py); ctx.lineTo(px, py - 6); ctx.lineTo(px + 10, py - 6); ctx.lineTo(px + 10, py); }
      for (let i = 0; i < 4; i++) { const w = 60 - i * 12, y = b - i * hh * .18; ctx.moveTo(x + 120 - w, y - hh * .12); ctx.lineTo(x + 120 + w, y - hh * .12); ctx.moveTo(x + 120 - w * .6, y); ctx.lineTo(x + 120 - w * .6, y - hh * .12); ctx.moveTo(x + 120 + w * .6, y); ctx.lineTo(x + 120 + w * .6, y - hh * .12); }
    } else if (id === "jp") { // Fuji + torii
      ctx.moveTo(x - hh * 1.2, b); ctx.lineTo(x - hh * .18, b - hh * .85); ctx.lineTo(x + hh * .18, b - hh * .85); ctx.lineTo(x + hh * 1.2, b);
      ctx.moveTo(x - hh * .3, b - hh * .68); ctx.lineTo(x - hh * .15, b - hh * .6); ctx.lineTo(x, b - hh * .7); ctx.lineTo(x + hh * .15, b - hh * .6); ctx.lineTo(x + hh * .3, b - hh * .68);
      const tx = x + 200; ctx.moveTo(tx - 50, b - hh * .5); ctx.quadraticCurveTo(tx, b - hh * .56, tx + 50, b - hh * .5); ctx.moveTo(tx - 40, b - hh * .4); ctx.lineTo(tx + 40, b - hh * .4);
      ctx.moveTo(tx - 30, b - hh * .52); ctx.lineTo(tx - 30, b); ctx.moveTo(tx + 30, b - hh * .52); ctx.lineTo(tx + 30, b);
    }
    ctx.stroke();
  }
  function drawWorld(P) {
    const vh = P.vp.h, k = P.vp.k, sp = P.vp.sp, wd = world(P.wi), pal = wd.palette || {}, C = cfg(P.wi);
    const g = ctx.createLinearGradient(0, 0, 0, vh); g.addColorStop(0, pal.sky1 || "#070b18"); g.addColorStop(1, pal.sky2 || "#101a36");
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, vh);
    // ambiance (étoiles, pluie, sable, pétales…)
    ctx.save();
    P.amb.forEach(a => {
      if (wd.id === "in") { a.y += 380 * a.v / 60; a.x -= 90 * a.v / 60; if (a.y > vh) { a.y = -10; a.x = Math.random() * W; } ctx.strokeStyle = "rgba(160,200,255,.35)"; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(a.x - 4, a.y + 12); ctx.stroke(); }
      else if (wd.id === "jp") { a.y += 30 * a.v / 60; a.x -= (60 + 40 * a.v) / 60; if (a.y > vh) a.y = -6; if (a.x < -6) a.x = W; ctx.fillStyle = "rgba(255,170,210,.75)"; ctx.beginPath(); ctx.ellipse(a.x, a.y, 4 * a.s, 2.4 * a.s, a.x / 30, 0, 7); ctx.fill(); }
      else if (wd.id === "eg") { a.x -= 160 * a.v / 60; if (a.x < 0) a.x = W; ctx.fillStyle = "rgba(240,200,120,.35)"; ctx.fillRect(a.x, a.y, 2, 2); }
      else if (wd.id === "cn" && a.s > 1.2) { a.y -= 18 * a.v / 60; if (a.y < -20) a.y = vh + 20; ctx.globalAlpha = .35; emoji("🏮", a.x, a.y, 14 * k); ctx.globalAlpha = 1; }
      else { ctx.fillStyle = "rgba(255,255,255," + (.15 + .25 * Math.abs(Math.sin(G.time + a.x))) + ")"; ctx.fillRect(a.x, a.y * .5, 1.6, 1.6); }
    });
    ctx.restore();
    // silhouettes culturelles en néon
    ctx.save(); ctx.strokeStyle = hexA(pal.accent, .3); ctx.lineWidth = 2; ctx.shadowColor = pal.accent || "#fff"; ctx.shadowBlur = 8;
    const per = 620, off = -((P.cam * .12) % per);
    for (let x = off - per + 300; x < W + per; x += per) landmark(wd.id, x, vh - 2, vh * .5);
    ctx.restore();
    // décor emoji (rangée au-dessus du tube, masquée quand une info s'affiche)
    const deco = wd.deco || [];
    if (deco.length && !((P.tipT > 0 || P.alarmT > 0) && P.banner <= 0) && !(P.msgT > 0)) {
      ctx.globalAlpha = .45;
      const dper = 190, sh = P.cam * .35, first = Math.floor(sh / dper);
      for (let i = 0; i < 7; i++) emoji(deco[(first + i) % deco.length], (first + i) * dper - sh + 40, 30 + (tubeTop(P) - 30) / 2, 18 * Math.min(k, 1.2));
      ctx.globalAlpha = 1;
    }
    // tube MPLS
    const top = tubeTop(P), bot = laneY(P, 2) + sp * .62;
    ctx.fillStyle = "rgba(0,0,0,.42)"; ctx.fillRect(0, top, W, bot - top);
    ctx.strokeStyle = pal.lane || "#4da3ff"; ctx.lineWidth = 3; ctx.shadowColor = pal.lane || "#4da3ff"; ctx.shadowBlur = 12;
    ctx.beginPath(); ctx.moveTo(0, top); ctx.lineTo(W, top); ctx.moveTo(0, bot); ctx.lineTo(W, bot); ctx.stroke(); ctx.shadowBlur = 0;
    ctx.strokeStyle = "rgba(255,255,255,.12)"; ctx.setLineDash([22, 18]); ctx.lineWidth = 2; ctx.lineDashOffset = P.cam % 40;
    for (let i = 0; i < 2; i++) { const y = (laneY(P, i) + laneY(P, i + 1)) / 2; ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
    ctx.setLineDash([]);
    // filigrane natif
    if (wd.welcome) { ctx.globalAlpha = .08; const wp = 900, wo = -((P.cam * .7) % wp); for (let x = wo; x < W + wp; x += wp) txt(wd.welcome.native, x + 300, laneY(P, 1) - sp * .5, 22 * k, "#fff", "center", 800, wd.dir); ctx.globalAlpha = 1; }
    // frontières eBGP
    drawBorder(P, -40, P.wi > 0 ? world(P.wi - 1) : null, wd, true);
    drawBorder(P, C.len + 60, wd, P.wi < NW() - 1 ? world(P.wi + 1) : null, false);
  }
  function drawBorder(P, wx, from, to, start) {
    const sx = wx - P.cam + PX, sp = P.vp.sp, k = P.vp.k, top = tubeTop(P), bot = laneY(P, 2) + sp * .62;
    if (sx < -160 || sx > W + 160) return;
    if (!to) { // destination
      ctx.fillStyle = "rgba(55,230,160,.12)"; rr(sx - 60, top - 6, 120, bot - top + 12, 14); ctx.fill();
      emoji("🖥️", sx, laneY(P, 1) - 8, 54 * k); txt("203.0.113.80", sx, laneY(P, 1) + 34 * k, 12 * k, "#9dffcf", "center", 700);
      txt("Tokyo DC · " + (WORLDS[NW() - 1].city || ""), sx, laneY(P, 2) + 10 * k, 11 * k, "#cfe0ff", "center", 600);
      return;
    }
    const col = (to.palette && to.palette.accent) || "#fff";
    ctx.fillStyle = hexA(col, .14); ctx.fillRect(sx - 14, top, 28, bot - top);
    ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.strokeRect(sx - 14, top, 28, bot - top);
    if (!start) {
      emoji(to.flag, sx, laneY(P, 1), 34 * k);
      txt("eBGP → AS" + to.asn, sx, top - 10 * k, 12 * k, col, "center", 800);
      txt(to.ix || "", sx, bot + 10 * k, 11 * k, "#cfe0ff", "center", 600);
    }
  }
  function drawItem(P, o) {
    const k = P.vp.k, sp = P.vp.sp, wd = world(P.wi);
    const sx = o.x - P.cam + PX;
    if (o.k === "seg") {
      const ex = sx + o.w; if (ex < -40 || sx > W + 40) return;
      const y = laneY(P, o.lane), hh = sp * .8;
      const st = { lat: ["rgba(255,176,32,.16)", "#ffb020"], boost: ["rgba(55,230,160,.14)", "#37e6a0"], maint: ["rgba(255,140,0,.2)", "#ff8c00"], cut: ["rgba(255,40,70,.22)", "#ff2846"], hijack: [P.rpki ? "rgba(120,120,140,.15)" : "rgba(180,80,255,.25)", P.rpki ? "#777" : "#c06bff"] }[o.t];
      ctx.fillStyle = st[0]; rr(sx, y - hh / 2, o.w, hh, 12); ctx.fill();
      ctx.strokeStyle = st[1]; ctx.lineWidth = 2; ctx.setLineDash(o.t === "lat" ? [8, 6] : []); ctx.stroke(); ctx.setLineDash([]);
      ctx.save(); ctx.beginPath(); ctx.rect(sx, y - hh / 2, o.w, hh); ctx.clip();
      if (o.t === "maint") { ctx.fillStyle = "rgba(0,0,0,.35)"; for (let x = sx - 40 + (P.cam * 0) % 40; x < ex; x += 40) { ctx.beginPath(); ctx.moveTo(x, y + hh / 2); ctx.lineTo(x + 20, y + hh / 2); ctx.lineTo(x + 40, y - hh / 2); ctx.lineTo(x + 20, y - hh / 2); ctx.fill(); } }
      if (o.t === "boost" || o.t === "hijack") { ctx.strokeStyle = hexA(st[1], .6); ctx.lineWidth = 3; const off = (G.time * 160) % 50; for (let x = sx - 50 + off; x < ex; x += 50) { ctx.beginPath(); ctx.moveTo(x, y - hh * .25); ctx.lineTo(x + 12, y); ctx.lineTo(x, y + hh * .25); ctx.stroke(); } }
      if (o.t === "cut") { ctx.strokeStyle = "rgba(255,255,255,.25)"; ctx.setLineDash([6, 10]); ctx.beginPath(); ctx.moveTo(sx, y); ctx.lineTo(ex, y); ctx.stroke(); ctx.setLineDash([]); }
      ctx.restore();
      const ico = o.t === "lat" ? (LATICO[wd.id] || "🐌") : o.t === "boost" ? (BOOSTICO[wd.id] || "🚀") : ICON[o.t];
      for (let x = sx + 40; x < ex - 20; x += 220) emoji(ico, x, y, 26 * k);
      let lab = "";
      if (o.t === "boost") { const s = special(wd, BOOSTKEY[wd.id]); lab = s ? s.native : "FAST"; }
      else if (o.t === "maint") { const s = special(wd, "maint"); lab = s ? s.native : (wd.hazards ? wd.hazards.maint : ""); }
      else if (o.t === "cut") { const s = special(wd, "anchor"); lab = "LOS · " + (s ? s.native : (wd.hazards ? wd.hazards.cut : "")); }
      else if (o.t === "hijack") lab = P.rpki ? "RPKI INVALID ✘ AS64666" : "203.0.113.0/25 · AS64666 · " + T("shortcut");
      else if (o.t === "lat") { const s = LATKEY[wd.id] && special(wd, LATKEY[wd.id]); lab = (s ? s.native : (wd.hazards ? wd.hazards.lat : "")) + " +ms"; }
      if (lab && ex - Math.max(sx + 8, 8) > 70) txt(lab, Math.max(sx + 8, 8), y - hh / 2 + 9 * k, 11 * k, st[1], "left", 800, wd.dir === "rtl" && o.t !== "hijack" ? "rtl" : "ltr", Math.max(60, Math.min(o.w - 16, 420)));
      if (o.t === "cut" && sx > -30) { emoji("⚓", sx + 6, y - hh / 2 - 4, 26 * k); }
      return;
    }
    if (o.k === "gate") {
      if (sx < -60 || sx > W + 60) return;
      for (let l = 0; l < 3; l++) {
        const ok = l === o.ok, y = laneY(P, l);
        ctx.fillStyle = ok ? "rgba(55,230,160,.22)" : "rgba(255,77,109,.38)"; rr(sx - 18 * k, y - sp * .44, 36 * k, sp * .88, 8); ctx.fill();
        ctx.strokeStyle = ok ? "#37e6a0" : "#ff4d6d"; ctx.lineWidth = 2; ctx.stroke();
        ctx.save(); ctx.translate(sx, y); ctx.rotate(-Math.PI / 2); txt(ok ? "ICMP ✔" : o.labels[l] + " ✘", 0, 0, 11 * k, "#fff", "center", 800, "ltr", sp * .84); ctx.restore();
        if (!ok) emoji("🔥", sx + 26 * k, y - sp * .3, 15 * k);
      }
      const g = special(wd, "gate"); txt((g ? g.native : (wd.hazards ? wd.hazards.gate : "ACL")), sx, tubeTop(P) - 9 * k, 11 * k, "#ffb020", "center", 800, wd.dir);
      return;
    }
    if (o.k === "trig") return;
    if (sx < -60 || sx > W + 60) return;
    if (o.k === "pk") {
      if (o.used) return;
      const y = laneY(P, o.lane) + Math.sin(G.time * 4 + o.x) * 4;
      ctx.shadowColor = o.t === "sab" ? "#ff4d6d" : "#37e6a0"; ctx.shadowBlur = 14;
      emoji(o.t === "cul" ? (wd.culture ? wd.culture.emoji : "🎁") : o.t === "qos" && special(wd, "espresso") ? "☕" : PKICO[o.t], sx, y, 28 * k); ctx.shadowBlur = 0;
      return;
    }
    const y = o.y != null ? o.y : laneY(P, o.lane);
    ctx.globalAlpha = o.used ? .22 : 1;
    if (o.t === "loss") { ctx.fillStyle = "#000"; ctx.beginPath(); ctx.ellipse(sx, y, 26 * k, 18 * k, 0, 0, 7); ctx.fill(); ctx.strokeStyle = "#ff4d6d"; ctx.lineWidth = 2; ctx.stroke(); emoji("🕳️", sx, y, 26 * k); }
    else if (o.t === "bit") { ctx.shadowColor = "#ffb020"; ctx.shadowBlur = 14; emoji("⚡", sx, y, 32 * k); ctx.shadowBlur = 0; txt(Math.floor(G.time * 6 + o.id) % 2 ? "0" : "1", sx + 18 * k, y - 15 * k, 12 * k, "#ffb020", "center", 800); }
    else if (o.t === "loop") { ctx.fillStyle = "rgba(255,90,208,.25)"; ctx.beginPath(); ctx.arc(sx, y, 25 * k, 0, 7); ctx.fill(); ctx.save(); ctx.translate(sx, y); ctx.rotate(G.time * 2.5); emoji("🔁", 0, 0, 30 * k); ctx.restore(); }
    else if (o.t === "bot") { ctx.shadowColor = "#ff4d6d"; ctx.shadowBlur = 10; emoji("🤖", sx, y, 24 * k); ctx.shadowBlur = 0; }
    else if (o.t === "dragon") { emoji("🐉", sx, y, 44 * k); emoji("🏮", sx + 40 * k, y + Math.sin(G.time * 5) * 8, 18 * k); }
    else if (o.t === "ball") { ctx.save(); ctx.translate(sx, y); ctx.rotate(G.time * 6); emoji("🏏", 0, 0, 28 * k); ctx.restore(); }
    else emoji(ICON[o.t] || "❓", sx, y, 32 * k);
    ctx.globalAlpha = 1;
  }
  function drawPacket(P) {
    const k = P.vp.k, C = cfg(P.wi);
    if (P.done) return;
    ctx.save(); ctx.translate(PX, P.y); ctx.scale(k, k);
    if (P.inv > 0 && Math.floor(G.time * 20) % 2) ctx.globalAlpha = .45;
    if (P.frrT > 0) { ctx.strokeStyle = "#38e1ff"; ctx.lineWidth = 3; ctx.setLineDash([6, 5]); ctx.beginPath(); ctx.arc(0, 0, 44, 0, 7); ctx.stroke(); ctx.setLineDash([]); }
    if (P.qosT > 0) { ctx.shadowColor = "#ffd24d"; ctx.shadowBlur = 26; ctx.fillStyle = "rgba(255,210,77,.16)"; ctx.beginPath(); ctx.arc(0, 0, 40, 0, 7); ctx.fill(); }
    if (P.lockT > 0) emoji("🔒", -40, -20, 14);
    const hp = clamp(P.health / 100, 0, 1);
    ctx.fillStyle = "#0e2333"; rr(-32, -18, 64, 36, 8); ctx.fill();
    ctx.strokeStyle = P.col; ctx.lineWidth = 2.5; ctx.stroke(); ctx.shadowBlur = 0;
    ctx.fillStyle = hp > .6 ? "#37e6a0" : hp > .3 ? "#ffb020" : "#ff4d6d"; rr(-8, -10, 36 * hp + .1, 20, 3); ctx.fill();
    ctx.fillStyle = P.col; rr(-32, -18, 22, 36, 8); ctx.fill();
    ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(-26, -5, 4.2, 0, 7); ctx.arc(-17, -5, 4.2, 0, 7); ctx.fill();
    ctx.fillStyle = "#000"; const look = P.health < 30 ? 0 : 1.5; ctx.beginPath(); ctx.arc(-25 + look, -5, 2, 0, 7); ctx.arc(-16 + look, -5, 2, 0, 7); ctx.fill();
    ctx.strokeStyle = "#000"; ctx.lineWidth = 1.5; ctx.beginPath();
    if (P.health < 35) ctx.arc(-21, 9, 4, Math.PI + .3, -.3); else ctx.arc(-21, 4, 4, .2, Math.PI - .2);
    ctx.stroke();
    const lab = "MPLS " + C.label;
    ctx.font = "700 10px " + FONT; const w = ctx.measureText(lab).width + 12;
    ctx.fillStyle = hexA((world(P.wi).palette || {}).accent, .9); rr(-w / 2, -36, w, 15, 7); ctx.fill();
    txt(lab, 0, -28.5, 10, "#05080f", "center", 800);
    ctx.restore();
  }
  function drawDrone(P, d) {
    const k = P.vp.k, x = PX + d.rx, wd = world(P.wi);
    if (d.st === "hover") { ctx.strokeStyle = "rgba(255,77,109,.5)"; ctx.setLineDash([4, 6]); ctx.beginPath(); ctx.moveTo(x, d.y); ctx.lineTo(PX + 30, P.y); ctx.stroke(); ctx.setLineDash([]); }
    ctx.shadowColor = "#ff4d6d"; ctx.shadowBlur = 16; emoji("🕵️", x, d.y, 32 * k); ctx.shadowBlur = 0;
    const s = wd.id === "fr" ? special(wd, "arp") : null;
    txt(s ? s.native : (wd.hazards ? wd.hazards.hacker : "MITM"), x, d.y - 24 * k, 10 * k, "#ff6b81", "center", 800, wd.dir);
  }
  function drawPlayerHud(P) {
    const wd = world(P.wi), k = P.vp.k;
    ctx.fillStyle = "rgba(4,7,16,.78)"; ctx.fillRect(0, 0, W, 30);
    ctx.fillStyle = P.col; ctx.fillRect(0, 0, 4, 30);
    txt(P.name, 10, 15, 13, P.col, "left", 800, "ltr", 92);
    // santé
    const hp = clamp(P.health, 0, 100);
    ctx.fillStyle = "#1a2647"; rr(108, 8, 104, 14, 7); ctx.fill();
    ctx.fillStyle = hp > 60 ? "#37e6a0" : hp > 30 ? "#ffb020" : "#ff4d6d"; rr(108, 8, 104 * hp / 100 + .1, 14, 7); ctx.fill();
    txt(Math.round(hp) + "%", 160, 15.5, 10, "#05080f", "center", 900);
    const lp = P.sent ? Math.min(100, P.lost / P.sent * 100) : 0;
    txt(T("ttl") + " " + P.ttl, 222, 15, 12, P.ttl < 25 ? "#ff4d6d" : "#e8f0ff", "left", 800);
    txt(T("loss") + " " + lp.toFixed(1) + "%", 282, 15, 12, lp > 3 ? "#ff6b81" : "#e8f0ff", "left", 800);
    txt(T("crc") + " " + P.crc, 382, 15, 12, P.crc ? "#ffb020" : "#e8f0ff", "left", 800);
    txt(T("rtt") + " " + Math.round(P.last) + "ms", 440, 15, 12, "#e8f0ff", "left", 800);
    // FRR
    txt(T("frr"), 538, 15, 11, "#38e1ff", "left", 800);
    ctx.fillStyle = "#1a2647"; rr(566, 10, 44, 10, 5); ctx.fill();
    ctx.fillStyle = P.frrCd <= 0 ? "#38e1ff" : "#2c6b82"; rr(566, 10, 44 * (1 - clamp(P.frrCd / 7, 0, 1)) + .1, 10, 5); ctx.fill();
    let ix = 622;
    if (P.qosT > 0) { emoji("⭐", ix, 15, 14); ix += 20; }
    if (P.lockT > 0) { emoji("🔒", ix, 15, 14); ix += 20; }
    if (P.rpki) { emoji("🛡️", ix, 15, 14); ix += 20; }
    emoji(wd.flag || "", 700, 15, 16);
    txt("AS" + wd.asn, 712, 15, 11, (wd.palette || {}).accent || "#fff", "left", 800);
    txt(world(P.wi).carrier || "", W - 8, 15, 11, "#8da2c8", "right", 600, "ltr", W - 770);
  }
  function drawPlayerOverlay(P) {
    const vh = P.vp.h, k = P.vp.k, wd = world(P.wi);
    if (P.banner > 0 && !P.done) {
      const a = Math.min(1, P.banner, 3 - P.banner + .2);
      ctx.globalAlpha = clamp(a, 0, 1);
      const bh = 88 * Math.min(k, 1.25), by = vh * .5 - bh / 2;
      ctx.fillStyle = "rgba(4,7,16,.82)"; rr(W / 2 - 330, by, 660, bh, 14); ctx.fill();
      ctx.strokeStyle = (wd.palette || {}).accent || "#fff"; ctx.lineWidth = 2; ctx.stroke();
      emoji(wd.flag, W / 2 - 290, by + bh / 2, 34 * Math.min(k, 1.25));
      txt(wd.welcome ? wd.welcome.native : wd.carrier, W / 2 + 20, by + bh * .3, 22 * Math.min(k, 1.2), "#fff", "center", 800, wd.dir, 560);
      txt(wd.welcome ? tr(wd.welcome) : "", W / 2 + 20, by + bh * .58, 13, "#cfe0ff", "center", 600, "ltr", 560);
      txt(wd.slogan ? "« " + wd.slogan.native + " »" : (wd.ix || ""), W / 2 + 20, by + bh * .82, 12, (wd.palette || {}).accent || "#ffd24d", "center", 700, wd.dir, 560);
      ctx.globalAlpha = 1;
    }
    // rangée d'info entre le HUD et le tube : message > astuce > décor
    const ry0 = 33, ry1 = tubeTop(P) - 4, rh = ry1 - ry0, two = rh >= 50;
    if (P.msgT > 0 && P.msg) {
      ctx.globalAlpha = Math.min(1, P.msgT);
      ctx.font = "800 15px " + FONT; const w = Math.min(W - 40, ctx.measureText(P.msg.txt).width + 34);
      ctx.fillStyle = "rgba(4,7,16,.88)"; rr(W / 2 - w / 2, ry0 + rh / 2 - 13, w, 26, 9); ctx.fill();
      txt(P.msg.txt, W / 2, ry0 + rh / 2, 15, P.msg.col, "center", 800, "ltr", W - 60); ctx.globalAlpha = 1;
    } else if (P.tipT > 0 && P.tip && P.banner <= 0) {
      ctx.globalAlpha = Math.min(1, P.tipT);
      const th = two ? Math.min(rh, 56) : rh, ty = ry0 + (rh - th) / 2;
      ctx.fillStyle = "rgba(12,20,42,.93)"; rr(16, ty, W - 32, th, 9); ctx.fill(); ctx.strokeStyle = "#4da3ff"; ctx.lineWidth = 1.5; ctx.stroke();
      emoji(P.tip.ico, 38, ty + th / 2, two ? 26 : 18);
      const head = P.tip.native ? P.tip.native + "  ·  " + P.tip.name : P.tip.name;
      if (two) { txt(head, 62, ty + th * .32, 15, "#ffd24d", "left", 800, "ltr", W - 100); txt(P.tip.d, 62, ty + th * .7, 13, "#e8f0ff", "left", 500, "ltr", W - 100); }
      else {
        ctx.font = "800 13px " + FONT; const hw = Math.min(ctx.measureText(head).width, 330);
        txt(head, 56, ty + th / 2, 13, "#ffd24d", "left", 800, "ltr", 330);
        txt("— " + P.tip.d, 64 + hw, ty + th / 2, 12, "#e8f0ff", "left", 500, "ltr", W - 100 - hw);
      }
      ctx.globalAlpha = 1;
    } else if (P.alarmT > 0 && P.alarm && P.banner <= 0) {
      ctx.globalAlpha = Math.min(1, P.alarmT);
      ctx.font = "700 13px " + FONT; const w = Math.min(W - 32, ctx.measureText(P.alarm.txt).width + 60);
      ctx.fillStyle = "rgba(20,4,10,.88)"; rr(W / 2 - w / 2, ry0 + rh / 2 - 13, w, 26, 9); ctx.fill();
      ctx.strokeStyle = P.alarm.col; ctx.lineWidth = 1.2; ctx.stroke();
      emoji("🚨", W / 2 - w / 2 + 16, ry0 + rh / 2, 13);
      txt(P.alarm.txt, W / 2 + 10, ry0 + rh / 2, 13, P.alarm.col, "center", 700, P.alarm.dir === "rtl" ? "rtl" : "ltr", W - 90);
      ctx.globalAlpha = 1;
    }
    if (P.warnT > 0) { ctx.globalAlpha = Math.min(1, P.warnT); ctx.fillStyle = "rgba(60,0,10,.85)"; rr(W - 330, tubeTop(P) + 4, 316, 24, 8); ctx.fill(); txt(T("sabIn") + " " + P.warnFrom + " ⚔️", W - 22, tubeTop(P) + 16, 13, "#ff6b81", "right", 800, "ltr", 300); ctx.globalAlpha = 1; }
    if (P.done) {
      ctx.fillStyle = "rgba(4,7,16,.75)"; ctx.fillRect(0, 30, W, vh - 30);
      emoji("🖥️", W / 2 - 200, vh / 2, 46 * k);
      txt("✅ " + T("echo") + " time=" + Math.round(mean(P.ws[NW() - 1].s)) + "ms", W / 2 + 20, vh / 2 - 14 * k, 22 * k, "#37e6a0", "center", 800);
      txt(G.P.every(q => q.done) ? "…" : T("waiting"), W / 2 + 20, vh / 2 + 18 * k, 14 * k, "#cfe0ff", "center", 600);
    }
  }
  function drawViewport(P) {
    ctx.save();
    ctx.translate(0, P.vp.y);
    ctx.beginPath(); ctx.rect(0, 0, W, P.vp.h); ctx.clip();
    ctx.save();
    if (P.shake > 0) ctx.translate((Math.random() - .5) * (P.quakeT > 0 ? 14 : 8), (Math.random() - .5) * (P.quakeT > 0 ? 10 : 8));
    drawWorld(P);
    for (const o of P.items) { if (o.x - P.cam > 1000) break; drawItem(P, o); }
    P.drones.forEach(d => drawDrone(P, d));
    drawPacket(P);
    P.fx.forEach(p => { ctx.globalAlpha = Math.max(0, p.life / .6); ctx.fillStyle = p.col; ctx.fillRect(p.x, p.y, 5, 5); }); ctx.globalAlpha = 1;
    P.fl.forEach(f => { ctx.globalAlpha = Math.min(1, f.life); txt(f.txt, f.x, f.y, 13 * P.vp.k, f.col, "left", 800); }); ctx.globalAlpha = 1;
    ctx.restore();
    drawPlayerHud(P);
    drawPlayerOverlay(P);
    ctx.restore();
  }
  function drawTop() {
    ctx.fillStyle = "#050812"; ctx.fillRect(0, 0, W, TOP);
    txt("PING RUNNER", 12, 18, 15, "#38e1ff", "left", 900);
    txt("NOC World Tour", 12, 38, 11, "#8da2c8", "left", 700);
    const x0 = 180, x1 = 800, y = 24, n = NW();
    ctx.strokeStyle = "#22335f"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke();
    WORLDS.forEach((w, i) => {
      const x = x0 + (x1 - x0) * i / n;
      emoji(w.flag, x + 10, y, 18); txt("AS" + w.asn, x + 10, y + 19, 9, "#8da2c8", "center", 700);
    });
    emoji("🖥️", x1, y, 18); txt("TYO", x1, y + 19, 9, "#8da2c8", "center", 700);
    if (G) G.P.forEach(P => {
      const prog = P.done ? n : P.wi + clamp(P.cam / cfg(P.wi).len, 0, 1);
      const x = x0 + 10 + (x1 - x0 - 10) * prog / n;
      ctx.fillStyle = P.col; ctx.beginPath();
      if (P.i === 0) { ctx.moveTo(x, y - 6); ctx.lineTo(x - 6, y - 16); ctx.lineTo(x + 6, y - 16); }
      else { ctx.moveTo(x, y + 6); ctx.lineTo(x - 6, y + 16); ctx.lineTo(x + 6, y + 16); }
      ctx.fill();
    });
    if (G && G.state !== "quiz") {
      const left = Math.max(0, Math.ceil(QUIZ_EVERY - G.quizClock));
      txt("🎓 " + T("quizIn"), W - 12, 18, 11, "#8da2c8", "right", 700);
      txt(left + " s", W - 12, 38, 16, left <= 5 ? "#ffd24d" : "#e8f0ff", "right", 900);
    }
  }
  function draw() {
    ctx.fillStyle = "#03050b"; ctx.fillRect(0, 0, W, H);
    drawTop();
    if (!G) { drawAttract(); return; }
    G.P.forEach(drawViewport);
    if (G.state === "count") {
      const n = Math.ceil(G.countT);
      ctx.fillStyle = "rgba(0,0,0,.35)"; ctx.fillRect(0, TOP, W, H - TOP);
      txt(n > 0 ? String(n) : "GO!", W / 2, H / 2, 90, "#fff", "center", 900);
      txt("ping 203.0.113.80", W / 2, H / 2 + 62, 18, "#9dffcf", "center", 700);
    }
    if (G.paused) { ctx.fillStyle = "rgba(0,0,0,.6)"; ctx.fillRect(0, TOP, W, H - TOP); txt(T("paused"), W / 2, H / 2, 26, "#fff", "center", 800); }
  }
  let attractT = 0;
  function drawAttract() {
    attractT += 1 / 60;
    const g = ctx.createLinearGradient(0, TOP, 0, H); g.addColorStop(0, "#070b18"); g.addColorStop(1, "#13204a"); ctx.fillStyle = g; ctx.fillRect(0, TOP, W, H - TOP);
    WORLDS.forEach((w, i) => { const x = ((i * 150 - attractT * 60) % (WORLDS.length * 150) + WORLDS.length * 150) % (WORLDS.length * 150) - 60; emoji(w.flag, x, H * .55, 54); txt("AS" + w.asn, x, H * .55 + 44, 13, "#8da2c8", "center", 700); });
  }

  /* ---------- Résultats ---------- */
  function metrics(P) {
    const lossPct = P.sent ? Math.min(100, P.lost / P.sent * 100) : 0;
    const dest = P.ws[NW() - 1].s, rtt = mean(dest.length ? dest : [].concat(...P.ws.map(w => w.s)));
    const jit = P.jn ? P.jsum / P.jn : 0, hp = clamp(Math.round(P.health), 0, 100);
    const qs = Math.round(hp * 10 - lossPct * 50 - P.crc * 3 - P.inc * 40 - P.deaths * 150);
    return { lossPct, rtt, jit, qs, hp };
  }
  function mtr(P) {
    const pad = (s, n) => (String(s) + " ".repeat(n)).slice(0, n), lp = (s, n) => (" ".repeat(n) + s).slice(-n);
    let out = pad("HOST", 26) + lp("Loss%", 7) + lp("Snt", 6) + lp("Last", 7) + lp("Avg", 7) + lp("Best", 7) + lp("Wrst", 7) + lp("StDev", 7) + "\n";
    out += pad(" 1.|-- 192.168.1.1 (CPE)", 26) + lp("0.0%", 7) + lp(P.ws[0].snt, 6) + lp("0.6", 7) + lp("0.7", 7) + lp("0.4", 7) + lp("1.9", 7) + lp("0.2", 7) + "\n";
    WORLDS.forEach((w, i) => {
      const s = P.ws[i], hn = (w.hostnames || ["r" + i])[(w.hostnames || [1]).length - 1];
      const lp2 = s.snt ? Math.min(100, s.lost / s.snt * 100) : 0;
      out += pad(" " + (i + 2) + ".|-- AS" + w.asn + " " + hn, 26) + lp(lp2.toFixed(1) + "%", 7) + lp(s.snt, 6) + lp(s.s.length ? s.s[s.s.length - 1].toFixed(1) : "-", 7) + lp(mean(s.s).toFixed(1), 7) +
        lp(s.s.length ? Math.min(...s.s).toFixed(1) : "-", 7) + lp(s.s.length ? Math.max(...s.s).toFixed(1) : "-", 7) + lp(stdev(s.s).toFixed(1), 7) + "\n";
    });
    return out;
  }
  function showResults() {
    if (!G || G.state === "over") return;
    G.state = "over";
    const M = G.P.map(metrics);
    let win = 0;
    if (G.P.length > 1) {
      const a = M[0], b = M[1];
      win = a.qs !== b.qs ? (a.qs > b.qs ? 0 : 1) : a.lossPct !== b.lossPct ? (a.lossPct < b.lossPct ? 0 : 1) : G.P[0].finishT !== G.P[1].finishT ? (G.P[0].finishT < G.P[1].finishT ? 0 : 1) : -1;
    }
    const top = Math.max(...M.map(m => m.qs));
    if (top > best) { best = top; try { localStorage.setItem("pr_best", best); } catch (e) {} }
    const R = T("rows");
    const rows = [
      ["qs", m => m.qs, (a, b) => a > b], ["health", (m, P) => m.hp + "%", (a, b, ma, mb) => ma.hp > mb.hp, true],
      ["loss", m => m.lossPct.toFixed(2) + "%", (a, b, ma, mb) => ma.lossPct < mb.lossPct, true], ["crc", (m, P) => P.crc, (a, b, ma, mb, Pa, Pb) => Pa.crc < Pb.crc, true],
      ["inc", (m, P) => P.inc, (a, b, ma, mb, Pa, Pb) => Pa.inc < Pb.inc, true], ["deaths", (m, P) => P.deaths, (a, b, ma, mb, Pa, Pb) => Pa.deaths < Pb.deaths, true],
      ["rtt", m => m.rtt.toFixed(1) + " ms", (a, b, ma, mb) => ma.rtt < mb.rtt, true], ["jit", m => m.jit.toFixed(2) + " ms", (a, b, ma, mb) => ma.jit < mb.jit, true],
      ["ttl", (m, P) => P.ttl, (a, b, ma, mb, Pa, Pb) => Pa.ttl > Pb.ttl, true], ["quiz", (m, P) => P.quizOk + "/" + P.quizN, (a, b, ma, mb, Pa, Pb) => Pa.quizOk > Pb.quizOk, true],
      ["time", (m, P) => P.finishT.toFixed(1) + " s", (a, b, ma, mb, Pa, Pb) => Pa.finishT < Pb.finishT, true], ["pts", (m, P) => P.pts, (a, b, ma, mb, Pa, Pb) => Pa.pts > Pb.pts, true]
    ];
    let h = '<h2>' + (G.P.length > 1 ? (win < 0 ? T("draw") : T("winner") + ' <span style="color:' + G.P[win].col + '">' + esc(G.P[win].name) + '</span>') : "🏁 " + T("soloDone")) + '</h2>';
    h += '<p class="sub">' + T("howWin") + '</p><table class="cmp"><tr><th></th>' + G.P.map(P => '<th style="color:' + P.col + '">' + esc(P.name) + '</th>').join("") + '</tr>';
    rows.forEach(r => {
      h += '<tr' + (r[0] === "qs" ? ' class="qs"' : "") + '><td>' + R[r[0]] + '</td>';
      G.P.forEach((P, i) => {
        let cls = "";
        if (G.P.length > 1) { const o = 1 - i; const better = r[0] === "qs" ? M[i].qs > M[o].qs : r[2](null, null, M[i], M[o], G.P[i], G.P[o]); const worse = r[0] === "qs" ? M[i].qs < M[o].qs : r[2](null, null, M[o], M[i], G.P[o], G.P[i]); cls = better ? "win" : worse ? "lose" : ""; }
        h += '<td class="' + cls + '">' + r[1](M[i], P) + '</td>';
      });
      h += '</tr>';
    });
    h += '</table>';
    G.P.forEach((P, i) => {
      const m = M[i], rec = Math.max(0, P.sent - P.lost);
      const ping = "C:\\> ping -t 203.0.113.80\n" + T("pingTxt") + "\n" + fmt(T("pingRep"), { t: Math.round(m.rtt), ttl: 64 - P.hops }) + "\n" + fmt(T("pingRep"), { t: Math.round(m.rtt + m.jit), ttl: 64 - P.hops }) + "\n…\n" + fmt(T("pingStat"), { s: P.sent, r: rec, l: P.lost, p: m.lossPct.toFixed(1) });
      h += '<details' + (i === 0 ? " open" : "") + '><summary style="color:' + P.col + '">' + esc(P.name) + ' — ' + T("mtr") + ' & ' + T("ping") + '</summary><pre>' + esc("mtr -r -c " + P.sent + " 203.0.113.80\n" + mtr(P)) + '</pre><pre>' + esc(ping) + '</pre></details>';
    });
    h += '<p class="sub">' + T("best") + " : " + best + " · " + T("fictional") + '</p>';
    h += '<div class="row2"><button class="btn" id="again">' + T("replay") + '</button><button class="btn alt" id="tomenu">' + T("menu") + '</button></div>';
    $("box").innerHTML = h; $("ov").style.display = "flex";
    $("again").onclick = () => startGame(G.mode);
    $("tomenu").onclick = showMenu;
    beep(523, .15, "triangle");
  }

  /* ---------- Menu ---------- */
  function showMenu() {
    G = null;
    const L = I18N[LANG];
    let h = '<div class="mhead"><h1>📡 ' + T("title") + '</h1><div class="langs">' + ["fr", "en"].map(l => '<button class="lg' + (l === LANG ? " on" : "") + '" data-l="' + l + '">' + l.toUpperCase() + '</button>').join("") + '</div></div>';
    h += '<p class="sub">' + T("subtitle") + '</p><p>' + T("intro") + '</p>';
    h += '<h3>' + T("route") + '</h3><div class="route">💻 LAN → ' + WORLDS.map(w => '<span class="as" style="border-color:' + ((w.palette || {}).accent || "#4da3ff") + '">' + w.flag + ' <b>AS' + w.asn + '</b><small>' + esc(w.carrier) + '</small><i lang="' + esc(w.lang) + '" dir="' + esc(w.dir) + '">' + esc(w.welcome ? w.welcome.native : "") + '</i></span>').join('<span class="arr">→</span>') + '<span class="arr">→</span> 🖥️ Tokyo</div>';
    h += '<h3>' + T("modes") + '</h3><div class="modes">' + [["solo", "mode1"], ["cpu", "modeCpu"], ["2p", "mode2"]].map(m => '<button class="md' + (m[0] === mode ? " on" : "") + '" data-m="' + m[0] + '">' + T(m[1]) + '</button>').join("") + '</div>';
    h += '<div class="names"><label>🧑‍💻 <input id="n1" maxlength="14" placeholder="' + T("p1") + '" value="' + esc(names.p1) + '"></label>' + (mode === "2p" ? '<label>👩‍💻 <input id="n2" maxlength="14" placeholder="' + T("p2") + '" value="' + esc(names.p2) + '"></label>' : "") + '</div>';
    h += '<button class="btn" id="go">' + T("start") + '</button>';
    h += '<h3>' + T("controls") + '</h3><div class="ctl">' + (mode === "2p" ? '<p>' + T("c1") + '</p><p>' + T("c2") + '</p>' : '<p>' + T("cSolo") + '</p>') + '<p>' + T("cTouch") + '</p><p>' + T("cMisc") + '</p></div>';
    h += '<h3>' + T("legend") + '</h3><div class="legend">';
    const hz = L.hz, pk = L.pk;
    ["lat", "loss", "bit", "jit", "cong", "loop", "hacker", "ddos", "hijack", "cut", "gate", "maint"].forEach(k => { h += '<div><span>' + (ICON[k === "ddos" ? "bot" : k] || "") + '</span><b>' + hz[k][0] + '</b> — ' + hz[k][1] + '</div>'; });
    ["frr", "qos", "fec", "lock", "rpki", "sab", "cul"].forEach(k => { h += '<div class="good"><span>' + (k === "frr" ? "⚡" : k === "cul" ? "🥐" : PKICO[k]) + '</span><b>' + pk[k][0] + '</b> — ' + pk[k][1] + '</div>'; });
    h += '</div><p class="sub">' + T("howWin") + '</p>' + (best ? '<p class="sub">🏆 ' + T("best") + " : " + best + '</p>' : "") + '<p class="sub">' + T("fictional") + '</p>';
    $("box").innerHTML = h; $("ov").style.display = "flex"; $("qz").style.display = "none";
    const saveNames = () => { const a = $("n1"), b = $("n2"); if (a) names.p1 = a.value.trim(); if (b) names.p2 = b.value.trim(); };
    $("box").querySelectorAll(".lg").forEach(b => b.onclick = () => { saveNames(); LANG = b.dataset.l; try { localStorage.setItem("pr_lang", LANG); } catch (e) {} document.documentElement.lang = LANG; $("rot").textContent = T("rotate"); showMenu(); });
    $("box").querySelectorAll(".md").forEach(b => b.onclick = () => { saveNames(); mode = b.dataset.m; showMenu(); });
    $("go").onclick = () => { saveNames(); startGame(mode); };
    $("pad2").style.display = "none";
  }

  /* ---------- Entrées ---------- */
  const KEYS = {
    p1: { up: ["KeyW"], down: ["KeyS"], frr: ["KeyD"], ans: { Digit1: 0, Digit2: 1, Digit3: 2 } },
    p2: { up: ["ArrowUp"], down: ["ArrowDown"], frr: ["ArrowRight", "ShiftRight", "Numpad0"], ans: { KeyJ: 0, KeyK: 1, KeyL: 2, Numpad1: 0, Numpad2: 1, Numpad3: 2, Digit8: 0, Digit9: 1, Digit0: 2 } },
    solo: { up: ["KeyW", "ArrowUp"], down: ["KeyS", "ArrowDown"], frr: ["Space", "KeyD", "ArrowRight"], ans: { Digit1: 0, Digit2: 1, Digit3: 2, Numpad1: 0, Numpad2: 1, Numpad3: 2, KeyJ: 0, KeyK: 1, KeyL: 2 } }
  };
  window.addEventListener("keydown", e => {
    const c = e.code;
    if (e.target && e.target.tagName === "INPUT") { if (c === "Enter" && $("go")) $("go").click(); return; }
    if (c === "KeyM") { mute = !mute; return; }
    if (!G) { if (c === "Enter" && $("go")) $("go").click(); return; }
    if (G.state === "over") { if (c === "Enter") startGame(G.mode); return; }
    if (c === "Escape" || c === "KeyP") { if (G.state === "play" || G.state === "count") G.paused = !G.paused; e.preventDefault(); return; }
    const maps = G.mode === "2p" ? [KEYS.p1, KEYS.p2] : [KEYS.solo];
    if (G.state === "quiz") {
      if (G.quiz && G.quiz.rev) { if (c === "Enter" || c === "Space") { endQuiz(); e.preventDefault(); } return; }
      maps.forEach((m, i) => { if (m.ans[c] != null) { answer(i, m.ans[c]); e.preventDefault(); } });
      return;
    }
    if (e.repeat) { if (c.startsWith("Arrow") || c === "Space") e.preventDefault(); return; }
    maps.forEach((m, i) => {
      const P = G.P[i]; if (!P || P.ctrl !== "human") return;
      if (m.up.includes(c)) { setLane(P, -1); e.preventDefault(); }
      else if (m.down.includes(c)) { setLane(P, 1); e.preventDefault(); }
      else if (m.frr.includes(c)) { useFrr(P); e.preventDefault(); }
    });
  });
  function bindPad(id, pi) {
    const el = $(id);
    el.querySelectorAll("button").forEach(b => b.addEventListener("pointerdown", ev => {
      ev.preventDefault(); if (!G) return; const P = G.P[pi]; if (!P || P.ctrl !== "human") return;
      const a = b.dataset.a; if (a === "up") setLane(P, -1); else if (a === "down") setLane(P, 1); else useFrr(P);
    }));
  }
  bindPad("pad1", 0); bindPad("pad2", 1);
  const touches = {};
  function canvasY(t) { const r = cv.getBoundingClientRect(); return (t.clientY - r.top) * H / r.height; }
  function playerAtY(y) { if (!G) return null; return G.P.find(P => y >= P.vp.y && y <= P.vp.y + P.vp.h && P.ctrl === "human") || null; }
  cv.addEventListener("touchstart", e => { for (const t of e.changedTouches) { const y = canvasY(t); touches[t.identifier] = { y0: y, y, t0: performance.now(), moved: false, P: playerAtY(y) }; } e.preventDefault(); }, { passive: false });
  cv.addEventListener("touchmove", e => {
    for (const t of e.changedTouches) {
      const s = touches[t.identifier]; if (!s || !s.P) continue;
      const y = canvasY(t), d = y - s.y;
      if (Math.abs(d) > 22) { setLane(s.P, d > 0 ? 1 : -1); s.y = y; s.moved = true; }
    }
    e.preventDefault();
  }, { passive: false });
  cv.addEventListener("touchend", e => { for (const t of e.changedTouches) { const s = touches[t.identifier]; if (s && s.P && !s.moved && performance.now() - s.t0 < 260) useFrr(s.P); delete touches[t.identifier]; } }, { passive: true });
  document.addEventListener("visibilitychange", () => { if (document.hidden && G && (G.state === "play" || G.state === "count")) G.paused = true; });

  /* ---------- Boucle ---------- */
  let last = performance.now();
  function loop(now) {
    const dt = Math.min(.05, (now - last) / 1000); last = now;
    update(dt); draw(); requestAnimationFrame(loop);
  }
  document.documentElement.lang = LANG;
  $("rot").textContent = T("rotate");
  showMenu();
  requestAnimationFrame(loop);

  // Accès pour les tests automatisés
  window.__PR = { get G() { return G; }, enterWorld, hit, update, startGame, answer, endQuiz, startQuiz, useFrr, setLane, showResults, showMenu, genWorld, laneY, WCFG, setLang: l => { LANG = l; } };
})();
