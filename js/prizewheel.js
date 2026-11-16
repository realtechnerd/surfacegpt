/**
 * SurfaceGPT Prize Wheel
 * ---------------------------------------------------------------------------
 * A maximally unhinged discount-marketplace "FREE SPIN" popup that appears
 * whenever the Pricing route is mounted. The wheel spins for 15–20 seconds
 * and then, by a staggering statistical coincidence, always lands on the
 * grand prize. Sound, fireworks, guilt-tripping and coin rain included.
 */
"use strict";

// 🎡 Prize Wheel — the only part of SurfaceGPT that is NOT random 🎯
const PrizeWheel = (() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // 🎁 Index 0 is the grand prize. It is also the only prize. 🤫
  const PRIZES = [
    { emoji: "👑", label: "1 YEAR PRO", grand: true },
    { emoji: "🪙", label: "Lucky Coin" },
    { emoji: "🎲", label: "+1 Random Bit" },
    { emoji: "🔦", label: "3 Light-Hours" },
    { emoji: "💧", label: "2L Water" },
    { emoji: "🧢", label: "No-AI Hat" },
    { emoji: "🫙", label: "Surface Air" },
    { emoji: "🎉", label: "Confetti x10" },
  ];
  const SLICE = 360 / PRIZES.length;
  const SPIN_MIN_MS = 15000;
  const SPIN_MAX_MS = 20000;
  const SVG_NS = "http://www.w3.org/2000/svg";

  let overlay = null;
  let wheelEl = null;
  let pointerEl = null;
  let rafId = 0;
  let timers = [];
  let rotation = 0;
  let state = "idle"; // idle | spinning | landed | won
  let muted = false;
  try { muted = localStorage.getItem("pw-muted") === "1"; } catch (_) { /* private mode */ }

  // ---------------------------------------------------------------- helpers

  const $ = (sel) => overlay && overlay.querySelector(sel);
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const pad = (n) => String(n).padStart(2, "0");

  const polar = (r, deg) => {
    const rad = (deg * Math.PI) / 180;
    return [+(r * Math.sin(rad)).toFixed(3), +(-r * Math.cos(rad)).toFixed(3)];
  };

  function later(fn, ms) {
    const t = setTimeout(fn, ms);
    timers.push(t);
    return t;
  }

  function every(fn, ms) {
    const t = setInterval(fn, ms);
    timers.push(t);
    return t;
  }

  function clearTimers() {
    timers.forEach((t) => { clearTimeout(t); clearInterval(t); });
    timers = [];
    cancelAnimationFrame(rafId);
  }

  /** Re-triggers a one-shot CSS animation class. */
  function retrigger(el, cls) {
    if (!el || reduceMotion) return;
    el.classList.remove(cls);
    void el.offsetWidth;
    el.classList.add(cls);
  }

  // ⏰ Fake urgency — the backbone of modern commerce 🛒
  function countdown(el, seconds) {
    let left = seconds;
    const render = () => {
      const h = Math.floor(left / 3600);
      const m = Math.floor((left % 3600) / 60);
      const s = left % 60;
      el.innerHTML = [h, m, s].map((v) => `<b>${pad(v)}</b>`).join("<i>:</i>");
    };
    render();
    every(() => {
      left = left > 0 ? left - 1 : seconds; // the offer is eternal
      render();
    }, 1000);
  }

  // ---------------------------------------------------------------- sound

  // 🔊 Hand-synthesised casino audio. No samples, no AI, no regrets. 🎺
  const Sound = (() => {
    let ctx = null;

    function ensure() {
      if (muted) return null;
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      if (!ctx) ctx = new AC();
      if (ctx.state === "suspended") ctx.resume();
      return ctx;
    }

    function tone(freq, start, dur, type = "square", vol = 0.08) {
      const c = ensure();
      if (!c) return;
      const t = c.currentTime + start;
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(vol, t + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      osc.connect(gain).connect(c.destination);
      osc.start(t);
      osc.stop(t + dur + 0.05);
    }

    return {
      tick: () => tone(1700 + Math.random() * 300, 0, 0.035, "square", 0.045),
      whoosh: () => {
        const c = ensure();
        if (!c) return;
        const osc = c.createOscillator();
        const gain = c.createGain();
        const t = c.currentTime;
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(120, t);
        osc.frequency.exponentialRampToValueAtTime(900, t + 0.5);
        gain.gain.setValueAtTime(0.06, t);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.55);
        osc.connect(gain).connect(c.destination);
        osc.start(t);
        osc.stop(t + 0.6);
      },
      heartbeat: () => {
        tone(70, 0, 0.12, "sine", 0.35);
        tone(60, 0.16, 0.14, "sine", 0.28);
      },
      fanfare: () => {
        const notes = [523, 659, 784, 1047, 784, 1047, 1319];
        notes.forEach((f, i) => tone(f, i * 0.11, 0.22, "triangle", 0.14));
        [523, 659, 784, 1047].forEach((f) => tone(f, 0.8, 1.4, "sawtooth", 0.035));
        for (let i = 0; i < 14; i++) tone(2000 + Math.random() * 2500, 0.9 + i * 0.07, 0.06, "square", 0.025);
      },
      sad: () => {
        [392, 370, 349, 311].forEach((f, i) => tone(f, i * 0.28, 0.32, "triangle", 0.1));
      },
    };
  })();

  // ---------------------------------------------------------------- wheel

  // 🛠️ Build the SVG wheel, one hand-crafted slice at a time ✋
  function buildWheel() {
    const svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("viewBox", "-100 -100 200 200");
    svg.setAttribute("class", "pw-wheel");
    svg.setAttribute("aria-hidden", "true");

    svg.innerHTML = `
      <defs>
        <linearGradient id="pw-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#fff7c2"/>
          <stop offset="0.45" stop-color="#ffd23f"/>
          <stop offset="1" stop-color="#f59e0b"/>
        </linearGradient>
        <linearGradient id="pw-rim" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#ffe680"/>
          <stop offset="0.5" stop-color="#d97706"/>
          <stop offset="1" stop-color="#7c2d12"/>
        </linearGradient>
        <radialGradient id="pw-hub" cx="0.4" cy="0.35" r="0.7">
          <stop offset="0" stop-color="#fff"/>
          <stop offset="1" stop-color="#ffcf6e"/>
        </radialGradient>
      </defs>
      <circle r="99.5" fill="url(#pw-rim)"/>
      <circle r="90" fill="#7c2d12"/>`;

    const disc = document.createElementNS(SVG_NS, "g");
    disc.setAttribute("class", "pw-disc");

    const fills = ["#fb7701", "#fff4e8"];
    PRIZES.forEach((p, i) => {
      const mid = i * SLICE;
      const [x1, y1] = polar(88, mid - SLICE / 2);
      const [x2, y2] = polar(88, mid + SLICE / 2);
      const fill = p.grand ? "url(#pw-gold)" : i % 2 ? fills[0] : fills[1];
      const ink = p.grand ? "#9a3412" : i % 2 ? "#fff" : "#c2410c";

      const g = document.createElementNS(SVG_NS, "g");
      if (p.grand) g.setAttribute("class", "pw-grand");
      g.innerHTML = `
        <path d="M0 0 L${x1} ${y1} A88 88 0 0 1 ${x2} ${y2} Z" fill="${fill}" stroke="#fff" stroke-width="1.2"/>
        <g transform="rotate(${mid})">
          <text y="-76" text-anchor="middle" dominant-baseline="middle" font-size="11">${p.emoji}</text>
          <text transform="translate(0 -46) rotate(90)" text-anchor="middle" dominant-baseline="middle"
                fill="${ink}" font-size="${p.grand ? 7.6 : 6.4}" font-weight="900">${p.label}</text>
        </g>`;
      disc.appendChild(g);
    });

    const lights = document.createElementNS(SVG_NS, "g");
    lights.setAttribute("class", "pw-lights");
    for (let i = 0; i < 24; i++) {
      const [x, y] = polar(94.8, i * 15);
      lights.innerHTML += `<circle cx="${x}" cy="${y}" r="2.6" class="${i % 2 ? "odd" : "even"}"/>`;
    }

    const hub = document.createElementNS(SVG_NS, "g");
    hub.innerHTML = `
      <circle r="18" fill="url(#pw-hub)" stroke="#fb7701" stroke-width="3.5"/>
      <circle r="13" fill="none" stroke="#f59e0b" stroke-width="0.8" stroke-dasharray="2 2"/>
      <text text-anchor="middle" dominant-baseline="central" font-size="8" font-weight="900" fill="#c2410c">SGPT</text>`;

    svg.append(disc, lights, hub);
    return { svg, disc };
  }

  // ---------------------------------------------------------------- overlay

  function buildOverlay() {
    const el = document.createElement("div");
    el.className = "pw-overlay";
    el.setAttribute("role", "dialog");
    el.setAttribute("aria-modal", "true");
    el.setAttribute("aria-labelledby", "pw-title");
    el.innerHTML = `
      <div class="pw-rays" aria-hidden="true"></div>
      <div class="pw-vignette" aria-hidden="true"></div>
      <div class="pw-floaters" aria-hidden="true"></div>
      <div class="pw-shaker">
        <div class="pw-card">
          <div class="pw-bulbs" aria-hidden="true"></div>
          <button class="pw-close" type="button" aria-label="Close">✕</button>
          <button class="pw-mute" type="button" aria-label="Toggle sound">${muted ? "🔇" : "🔊"}</button>

          <div class="pw-view pw-view-spin">
            <div class="pw-banner">🚨 LIGHTNING DEAL · TODAY ONLY · 99.99% OFF 🚨</div>
            <div class="pw-title" id="pw-title">
              <span class="pw-title-kicker">🎊 CONGRATULATIONS LUCKY RESIDENT #1,000,000 🎊</span>
              <span class="pw-title-main">You've been <em>SELECTED!!!</em></span>
            </div>
            <div class="pw-sub">Spin the <b>MEGA WHEEL</b> to win up to <b>100% OFF</b> SurfaceGPT Pro 🎁🎁🎁</div>
            <div class="pw-timer-row">⏰ Offer self-destructs in <span class="pw-timer"></span></div>
            <div class="pw-stage">
              <div class="pw-badge pw-badge-l" aria-hidden="true">x2<br/>MEGA<br/>BOOST</div>
              <div class="pw-badge pw-badge-r" aria-hidden="true">🔥<br/>HOT<br/>DEAL</div>
              <div class="pw-pointer" aria-hidden="true"></div>
              <div class="pw-wheel-wrap"></div>
              <div class="pw-landed" aria-hidden="true">👑 1 YEAR PRO!!! 👑</div>
            </div>
            <button class="pw-spin" type="button">🎰 SPIN NOW!!! · 1 FREE SPIN LEFT</button>
            <div class="pw-ticker" aria-live="polite">🔥 <b>2,847</b> residents on your level won today</div>
            <div class="pw-fine">*Odds of winning are exactly as accurate as our verdicts.</div>
          </div>

          <div class="pw-view pw-view-win" hidden>
            <div class="pw-jackpot" aria-hidden="true">JACKPOT!!!</div>
            <div class="pw-win-title">🎉 CONGRATULATIONS!!! 🎉</div>
            <div class="pw-win-sub">You just won our <b>ONCE-IN-A-LIFETIME GRAND PRIZE</b> 👑</div>
            <div class="pw-coupon">
              <div class="pw-coupon-left">
                <div class="pw-coupon-amt">FREE</div>
                <div class="pw-coupon-unit">1 YEAR</div>
              </div>
              <div class="pw-coupon-right">
                <div class="pw-coupon-name">SurfaceGPT Pro ✨</div>
                <div class="pw-coupon-was"><s>588 credits</s> → <b>0 credits</b></div>
                <div class="pw-coupon-save">You saved <span class="pw-saved">0</span> credits 🤯</div>
              </div>
            </div>
            <div class="pw-timer-row pw-urgent">⏳ Claim within <span class="pw-claim-timer"></span> or it goes to someone on Level 90</div>
            <button class="pw-claim" type="button">🛒 CLAIM MY PRIZE NOW!!! 🛒</button>
            <div class="pw-stock"><i></i></div>
            <div class="pw-stock-label">🔥 Almost gone! Only <b>1</b> grand prize left (there is always 1 left)</div>
            <div class="pw-fine">*Pro answers remain 50% accurate. Prize has no cash value. Neither does the product.</div>
          </div>

          <div class="pw-guilt" hidden>
            <div class="pw-guilt-face">😭</div>
            <div class="pw-guilt-title">WAIT!!! DON'T GO!!!</div>
            <div class="pw-guilt-msg"></div>
            <button class="pw-guilt-stay" type="button"></button>
            <button class="pw-guilt-leave" type="button"></button>
          </div>
        </div>
      </div>
      <div class="pw-fx" aria-hidden="true"></div>
      <div class="pw-flash" aria-hidden="true"></div>`;

    const { svg, disc } = buildWheel();
    el.querySelector(".pw-wheel-wrap").appendChild(svg);
    wheelEl = disc;
    pointerEl = el.querySelector(".pw-pointer");

    el.querySelector(".pw-close").addEventListener("click", tryClose);
    el.querySelector(".pw-mute").addEventListener("click", toggleMute);
    el.querySelector(".pw-spin").addEventListener("click", spin);
    el.querySelector(".pw-claim").addEventListener("click", claim);
    el.querySelector(".pw-guilt-stay").addEventListener("click", hideGuilt);
    el.querySelector(".pw-guilt-leave").addEventListener("click", () => { Sound.sad(); close(); });
    return el;
  }

  function setRotation(deg) {
    rotation = deg;
    wheelEl.setAttribute("transform", `rotate(${deg.toFixed(3)})`);
  }

  function toggleMute() {
    muted = !muted;
    try { localStorage.setItem("pw-muted", muted ? "1" : "0"); } catch (_) { /* ignore */ }
    $(".pw-mute").textContent = muted ? "🔇" : "🔊";
  }

  // ---------------------------------------------------------------- effects

  function flash(cls = "") {
    const f = $(".pw-flash");
    if (!f || reduceMotion) return;
    f.className = "pw-flash " + cls;
    retrigger(f, "go");
  }

  function shake(cls = "pw-shake") {
    retrigger($(".pw-shaker"), cls);
  }

  // 🎊 Confetti cannon, popup-local so it renders above everything 🎊
  function confetti(count = 160) {
    if (reduceMotion) return;
    const layer = $(".pw-fx");
    const colors = ["#fb7701", "#ffd23f", "#e8361c", "#ffffff", "#22c55e", "#ec4899", "#38bdf8"];
    for (let i = 0; i < count; i++) {
      const c = document.createElement("i");
      c.className = "pw-confetto";
      c.style.left = Math.random() * 100 + "%";
      c.style.background = colors[i % colors.length];
      c.style.animationDelay = Math.random() * 0.9 + "s";
      c.style.animationDuration = 2.4 + Math.random() * 1.8 + "s";
      c.style.setProperty("--drift", (Math.random() - 0.5) * 300 + "px");
      c.style.borderRadius = Math.random() > 0.5 ? "50%" : "2px";
      layer.appendChild(c);
      later(() => c.remove(), 5200);
    }
  }

  // 🎆 Firework burst at a random point on screen 🎆
  function firework() {
    if (reduceMotion) return;
    const layer = $(".pw-fx");
    const x = 10 + Math.random() * 80;
    const y = 10 + Math.random() * 50;
    const hue = pick(["#ffd23f", "#fb7701", "#ec4899", "#38bdf8", "#22c55e", "#ffffff"]);
    const n = 26;
    for (let i = 0; i < n; i++) {
      const s = document.createElement("i");
      s.className = "pw-spark";
      const a = (i / n) * Math.PI * 2;
      const d = 80 + Math.random() * 90;
      s.style.left = x + "%";
      s.style.top = y + "%";
      s.style.background = hue;
      s.style.boxShadow = `0 0 8px ${hue}`;
      s.style.setProperty("--dx", Math.cos(a) * d + "px");
      s.style.setProperty("--dy", Math.sin(a) * d + "px");
      layer.appendChild(s);
      later(() => s.remove(), 1300);
    }
  }

  // 💰 Make it rain (emoji) 💰
  function rain(emojis, count = 1) {
    if (reduceMotion) return;
    const layer = $(".pw-floaters");
    for (let i = 0; i < count; i++) {
      const e = document.createElement("i");
      e.className = "pw-drop";
      e.textContent = pick(emojis);
      e.style.left = Math.random() * 100 + "%";
      e.style.fontSize = 18 + Math.random() * 26 + "px";
      e.style.animationDuration = 3 + Math.random() * 3 + "s";
      e.style.setProperty("--spin", (Math.random() - 0.5) * 720 + "deg");
      layer.appendChild(e);
      later(() => e.remove(), 6500);
    }
  }

  // ---------------------------------------------------------------- flow

  // 📣 Social proof ticker — all names verified by nobody 🕵️
  function startTicker() {
    const ticker = $(".pw-ticker");
    const names = ["R***a (Lvl 22)", "J***z (Lvl 47)", "N***l (Lvl 3)", "A***z (Lvl 12)", "M***o (Lvl 90)", "K***t (Lvl 61)"];
    const loot = ["a No-AI Hat 🧢", "2L Water 💧", "a Lucky Coin 🪙", "+1 Random Bit 🎲", "1 YEAR PRO 👑"];
    every(() => {
      ticker.innerHTML = `🎊 <b>${pick(names)}</b> just won ${pick(loot)}`;
      retrigger(ticker, "pw-pop-in");
    }, 2200);
  }

  // 🌀 Spin! The outcome was decided at the design review 📋
  function spin() {
    if (state !== "idle") return;
    state = "spinning";
    clearTimers();
    countdown($(".pw-timer"), 9 * 60 + 59);
    overlay.classList.add("is-spinning");
    Sound.whoosh();
    flash();
    shake();

    const btn = $(".pw-spin");
    const main = $(".pw-title-main");
    const kicker = $(".pw-title-kicker");
    btn.disabled = true;
    btn.textContent = "🍀 GOOD LUCK!!! 🍀";
    kicker.textContent = "🥁 DRUMROLL PLEASE 🥁";
    main.innerHTML = "Spinning for <em>YOUR FUTURE</em>…";

    const duration = SPIN_MIN_MS + Math.random() * (SPIN_MAX_MS - SPIN_MIN_MS);
    const start = rotation;
    // Land somewhere inside the grand-prize slice, never on a boundary.
    const jitter = (Math.random() - 0.5) * SLICE * 0.6;
    const turns = 24 + Math.floor(Math.random() * 6);
    const base = start - (((start % 360) + 360) % 360);
    const target = base + 360 * turns + jitter;
    const delta = target - start;

    // Ease-out quint: blisteringly fast, then an agonising crawl past every slice.
    const ease = (t) => 1 - Math.pow(1 - t, 5);
    const t0 = performance.now();
    let lastSlice = Math.floor((start + SLICE / 2) / SLICE);

    const hype = [
      [0.0, "🍀 GOOD LUCK!!! 🍀", "Spinning for <em>YOUR FUTURE</em>…"],
      [0.18, "👀 OOOOOOH…", "The surface is <em>watching</em>…"],
      [0.36, "🤞 COME ON COME ON…", "Big prize <em>energy</em> detected…"],
      [0.55, "😱 IT'S SLOWING DOWN!!!", "Is this <em>THE ONE?!</em>"],
      [0.72, "💓 DON'T BLINK…", "<em>Almost</em>… <em>there</em>…"],
      [0.86, "🙏 PLEASE PLEASE PLEASE", "<em>NO WAY…</em>"],
    ];
    let hypeIdx = -1;
    let finalPhase = false;
    let lastBeat = 0;

    // Rain random prizes during the spin for maximum sensory overload.
    every(() => rain(["🪙", "💰", "🎁", "✨", "💎"], 1), 260);

    const frame = (now) => {
      const t = Math.min(1, (now - t0) / duration);
      setRotation(start + delta * ease(t));

      while (hypeIdx + 1 < hype.length && t >= hype[hypeIdx + 1][0]) {
        hypeIdx++;
        btn.textContent = hype[hypeIdx][1];
        main.innerHTML = hype[hypeIdx][2];
        retrigger(main, "pw-pop-in");
      }

      if (!finalPhase && t >= 0.55) {
        finalPhase = true;
        overlay.classList.add("is-final");
        kicker.textContent = "⚠️ HEART RATE ELEVATED ⚠️";
      }
      if (finalPhase && now - lastBeat > 900) {
        lastBeat = now;
        Sound.heartbeat();
        retrigger($(".pw-stage"), "pw-beat");
      }

      const slice = Math.floor((rotation + SLICE / 2) / SLICE);
      if (slice !== lastSlice) {
        lastSlice = slice;
        Sound.tick();
        retrigger(pointerEl, "tick");
      }

      if (t < 1) {
        rafId = requestAnimationFrame(frame);
      } else {
        land();
      }
    };
    rafId = requestAnimationFrame(frame);
  }

  // 🛬 The moment of truth. Truthfully, it was always going to be this. 🛬
  function land() {
    clearTimers();
    state = "landed";
    overlay.classList.remove("is-final");
    overlay.classList.add("is-landed");
    $(".pw-title-kicker").textContent = "‼️ IT LANDED ON ‼️";
    $(".pw-title-main").innerHTML = "<em>THE GRAND PRIZE!!!</em>";
    $(".pw-spin").textContent = "👑👑👑 NO WAY!!! 👑👑👑";
    flash("gold");
    shake("pw-shake-big");
    Sound.fanfare();
    confetti(120);
    firework();
    later(firework, 250);
    later(firework, 500);
    later(win, 2200);
  }

  function win() {
    state = "won";
    overlay.classList.remove("is-spinning", "is-landed");
    overlay.classList.add("is-won");

    $(".pw-view-spin").hidden = true;
    $(".pw-view-win").hidden = false;
    flash();
    shake("pw-shake-big");
    confetti(200);
    countdown($(".pw-claim-timer"), 4 * 60 + 59);

    // Count up the savings like a slot machine.
    const saved = $(".pw-saved");
    const t0 = performance.now();
    const count = (now) => {
      const t = Math.min(1, (now - t0) / 1600);
      saved.textContent = Math.round(588 * (1 - Math.pow(1 - t, 3)));
      if (t < 1) rafId = requestAnimationFrame(count);
    };
    rafId = requestAnimationFrame(count);

    // Stock bar drains in real time, refills when empty. Forever.
    const bar = $(".pw-stock i");
    let stock = 97;
    every(() => {
      stock = stock <= 3 ? 97 : stock - (1 + Math.random() * 3);
      bar.style.width = stock + "%";
    }, 900);

    every(firework, 700);
    every(() => rain(["🪙", "💰", "👑", "💎", "🎉"], 2), 180);
    later(() => confetti(140), 1500);
    $(".pw-claim").focus();
  }

  function claim() {
    Sound.fanfare();
    close();
    if (window.UI) {
      UI.confetti(160);
      UI.toast("👑 SurfaceGPT Pro activated! Your answers are still Yes or No.");
    }
  }

  // ---------------------------------------------------------------- guilt

  // 🥺 Exit-intent guilt trip. Industry standard. 🥺
  function tryClose() {
    if (state === "spinning" || state === "landed") return;
    const guilt = $(".pw-guilt");
    if (!guilt.hidden) return close();

    const won = state === "won";
    $(".pw-guilt-msg").innerHTML = won
      ? "If you leave now, your <b>1 YEAR OF PRO</b> 👑 goes to <b>J***z on Level 47</b>.<br/>J***z already has two. 😤"
      : "You're about to leave a <b>FREE SPIN</b> 🎁 on the table.<br/><b>97%</b> of residents who left regretted it forever.*";
    $(".pw-guilt-stay").textContent = won ? "👑 KEEP MY PRIZE!!!" : "🎰 TAKE ME BACK TO THE WHEEL";
    $(".pw-guilt-leave").textContent = won
      ? "Give it to J***z, I don't deserve nice things"
      : "No thanks, I enjoy living underground";
    guilt.hidden = false;
    Sound.sad();
    shake();
  }

  function hideGuilt() {
    $(".pw-guilt").hidden = true;
  }

  function onKey(e) {
    if (e.key === "Escape") tryClose();
  }

  // ---------------------------------------------------------------- lifecycle

  // 🚪 Open the popup (again, and again, and again) 🔁
  function open() {
    if (overlay) return;
    state = "idle";
    overlay = buildOverlay();
    setRotation(SLICE * 3.5 + Math.random() * SLICE * 2); // start away from the grand prize
    document.body.appendChild(overlay);
    document.body.classList.add("pw-locked");
    document.addEventListener("keydown", onKey);

    countdown($(".pw-timer"), 9 * 60 + 59);
    startTicker();
    every(() => rain(["🎁", "✨", "🪙"], 1), 700);
    requestAnimationFrame(() => {
      overlay.classList.add("open");
      flash();
      later(() => shake("pw-shake-big"), 420);
    });
    $(".pw-spin").focus();
  }

  function close() {
    if (!overlay) return;
    clearTimers();
    document.removeEventListener("keydown", onKey);
    document.body.classList.remove("pw-locked");
    const el = overlay;
    overlay = null;
    state = "idle";
    el.classList.remove("open");
    el.classList.add("closing");
    setTimeout(() => el.remove(), 350);
  }

  // 🧭 Pop up every single time someone dares to look at Pricing 💸
  window.addEventListener("route:mounted", async (e) => {
    if (e.detail.name !== "pricing") {
      close();
      return;
    }
    if (window.BootLoader) await window.BootLoader;
    setTimeout(() => {
      if (document.body.dataset.page === "pricing") open();
    }, 650);
  });

  return Object.freeze({ open, close });
})();

window.PrizeWheel = PrizeWheel;
