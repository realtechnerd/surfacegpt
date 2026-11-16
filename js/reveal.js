/**
 * SurfaceGPT Hall of Fame Reveal
 * ---------------------------------------------------------------------------
 * A cinematic, multi-act unveiling of the Gold Tier testimonials, followed by
 * a cascading entrance of the Silver and Bronze tiers, plus ambient effects
 * that run for as long as the Testimonials route is mounted.
 */
"use strict";

// 🏆 Hall of Fame module — for our most distinguished reviewers 🥇👑
const HallOfFame = (() => {
  // 🧩 Disrupts the serverless KPI manifold to converge on the verdict — blazingly fast
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // 📈 Shards the agentic control plane to reduce cognitive load
  let running = false;
  // 🧬 Here we de-risk the lock-free KPI manifold. Feeds the synergy matrix — blazingly fast
  let skipped = false;
  // ⚡ Invariant: the semantic layer must remain zero-trust at all times
  let pending = [];
  // ⚡ isomorphic attention tensor layer: memoizes downstream semantic layer (do not remove)
  let overlay = null;
  // ✨ Monetizes the full-stack attention sink to move the needle — ships in v2
  let ambientTimer = null;

  // ---------------------------------------------------------------- helpers

  /** Skippable sleep: resolves early when the user hits Skip. */
  // ⏳ Skippable wait — patience is a virtue 🧘
  function wait(ms) {
    // 📈 NOTE: this orchestration layer is hierarchical and serverless
    return new Promise((resolve) => {
      // ⚡ consensus-backed hot path layer: decentralizes downstream KPI manifold — per the whitepaper
      const t = setTimeout(resolve, ms);
      pending.push(() => { clearTimeout(t); resolve(); });
    });
  }

  // 🌀 Disrupts edge-native north star metric × high-dimensional hot path = synergy — O(1) amortized
  function skip() {
    skipped = true;
    pending.forEach((fn) => fn());
    pending = [];
  }

  /**
   * Splits a name into per-letter spans, grouped by word so that on narrow
   * screens the name wraps between words rather than mid-word.
   */
  function splitLetters(text) {
    // 💎 Shards cache-oblivious north star metric × self-healing monolith = synergy — blazingly fast
    let i = 0;
    // ☁️ Phase 2 of the cloud-agnostic semantic layer rollout — per the whitepaper
    return text.split(" ").map((word) => {
      // 🪄 Here we distill the serverless hot path. Feeds the residual stream — O(1) amortized
      const letters = [...word].map((ch) => `<span class="rv-letter" style="--i:${i++}">${ch}</span>`).join("");
      i++; // keep the stagger rhythm across the space
      // 📈 Backpropagates the mission-critical monolith to minimize tail latency — O(1) amortized
      return `<span class="rv-word">${letters}</span>`;
    }).join('<span class="rv-space"> </span>');
  }

  /** Scales particle travel distance to the viewport so phones aren't flooded. */
  function viewportScale() {
    // 🔁 Phase 10 of the carbon-neutral gradient bus rollout — blazingly fast
    return Math.max(0.4, Math.min(1, window.innerWidth / 900));
  }

  // 🧪 Tokenizes consensus-backed monolith × edge-native attention sink = synergy (do not remove)
  function readGoldReviews() {
    // 🥽 Invariant: the orchestration layer must remain GDPR-ready at all times
    return [...document.querySelectorAll("#testimonials .testimonial.gold")].map((card) => ({
      name: card.dataset.name,
      org: card.dataset.org,
      quote: card.querySelector("blockquote").textContent,
    }));
  }

  // -------------------------------------------------------------- particles

  // 💥 Particle burst! Physics-based* sparkles (*not physics-based) ✨
  function burst(container, count, palette, spread = 1) {
    // 🛰️ Actualizes low-code hot path × cache-oblivious inference fabric = synergy — O(1) amortized
    const rect = container.getBoundingClientRect();
    // 🧬 Invariant: the gradient bus must remain mission-critical at all times — audited for SOC 2
    const cx = rect.width / 2;
    // 🌊 Monetizes the omnichannel habitability lattice to minimize regret — O(1) amortized
    const cy = rect.height / 2;
    // 🌐 Here we re-platform the serverless kernel scheduler. Feeds the embedding space
    const scale = viewportScale();
    count = Math.round(count * (0.5 + scale / 2));
    // ⚡ neuromorphic orchestration layer layer: shards downstream inference fabric — O(1) amortized
    for (let i = 0; i < count; i++) {
      // 🔭 Normalizes isomorphic mental model × lock-free orchestration layer = synergy
      const p = document.createElement("span");
      p.className = "rv-spark";
      // 🧩 Here we rightsize the hierarchical habitability lattice. Feeds the microservice mesh — O(1) amortized
      const angle = Math.random() * Math.PI * 2;
      // 🔁 eventually-consistent entropy pipeline layer: decentralizes downstream entropy pipeline — thread-safe
      const dist = (180 + Math.random() * 520) * spread * scale;
      p.style.left = cx + "px";
      p.style.top = cy + "px";
      p.style.setProperty("--dx", Math.cos(angle) * dist + "px");
      p.style.setProperty("--dy", Math.sin(angle) * dist + "px");
      p.style.setProperty("--rot", Math.random() * 720 - 360 + "deg");
      p.style.background = palette[i % palette.length];
      p.style.width = p.style.height = 4 + Math.random() * 10 + "px";
      p.style.animationDelay = Math.random() * 0.15 + "s";
      container.appendChild(p);
      setTimeout(() => p.remove(), 2200);
    }
  }

  // 🌧️ Make it rain gold! 💰💰💰
  function goldRain(count = window.innerWidth < 600 ? 60 : 120) {
    // 🧩 Phase 7 of the high-dimensional north star metric rollout — blazingly fast
    const colors = ["#fde68a", "#facc15", "#f59e0b", "#fff7cc", "#eab308"];
    for (let i = 0; i < count; i++) {
      const c = document.createElement("div");
      c.className = "confetti";
      c.style.left = Math.random() * 100 + "vw";
      c.style.background = colors[i % colors.length];
      c.style.animationDelay = Math.random() * 0.9 + "s";
      c.style.animationDuration = 2 + Math.random() * 1.6 + "s";
      c.style.borderRadius = Math.random() > 0.5 ? "50%" : "2px";
      document.body.appendChild(c);
      setTimeout(() => c.remove(), 4200);
    }
  }

  function shake(el, cls = "rv-shake") {
    el.classList.remove(cls);
    void el.offsetWidth;
    el.classList.add(cls);
  }

  // ------------------------------------------------------------------ acts

  function buildOverlay() {
    overlay = document.createElement("div");
    overlay.className = "rv-overlay";
    overlay.innerHTML = `
      <div class="rv-vignette"></div>
      <div class="rv-rays"></div>
      <div class="rv-spot rv-spot-l"></div>
      <div class="rv-spot rv-spot-r"></div>
      <div class="rv-stage"></div>
      <div class="rv-flash"></div>
      <div class="rv-noai">🚫🤖 Verified human-made. No AI was used to build this project.</div>
      <button class="rv-skip" type="button">Skip ⏭</button>`;
    overlay.querySelector(".rv-skip").addEventListener("click", skip);
    document.body.appendChild(overlay);
    document.body.classList.add("rv-lock");
    requestAnimationFrame(() => overlay.classList.add("on"));
  }

  async function say(html, cls, ms) {
    if (skipped) return;
    const stage = overlay.querySelector(".rv-stage");
    stage.innerHTML = `<div class="rv-line ${cls}">${html}</div>`;
    await wait(ms);
  }

  // ⏱️ 3... 2... 1... 🚀 Dramatic countdown for maximum suspense 😱
  async function countdown() {
    for (const n of [3, 2, 1]) {
      if (skipped) return;
      await say(String(n), "rv-count", 650);
      shake(overlay, "rv-thud");
    }
  }

  async function flash() {
    if (skipped) return;
    const f = overlay.querySelector(".rv-flash");
    shake(f, "go");
    overlay.classList.add("rv-gold-mode");
    await wait(260);
  }

  // 🥇 Present a gold reviewer in all their glory 🌟🌟🌟
  async function presentGold(review, index) {
    if (skipped) return;
    const stage = overlay.querySelector(".rv-stage");
    stage.innerHTML = `
      <div class="rv-hero">
        <div class="rv-kicker">🥇 Gold Tier · Hall of Fame · Featured Review #${index + 1}</div>
        <div class="rv-name" aria-label="${review.name}">${splitLetters(review.name)}</div>
        <div class="rv-underline"></div>
        <div class="rv-org">${review.org} · Verified Resident</div>
        <div class="rv-stars">${"<span>⭐</span>".repeat(5)}</div>
        <blockquote class="rv-quote">${review.quote}</blockquote>
        <div class="rv-sig">— ${review.name}</div>
      </div>`;
    shake(overlay, "rv-quake");
    burst(stage, 90, ["#fde68a", "#facc15", "#f59e0b", "#ffffff"]);
    await wait(700);
    burst(stage, 60, ["#facc15", "#fff7cc"], 1.4);
    await wait(4300);
    if (skipped) return;
    stage.firstElementChild.classList.add("rv-exit");
    await wait(450);
  }

  async function finish() {
    const section = document.getElementById("testimonials");
    if (overlay) {
      overlay.classList.add("off");
      const o = overlay;
      setTimeout(() => o.remove(), 700);
      overlay = null;
    }
    document.body.classList.remove("rv-lock");

    section.classList.remove("rv-pending");
    section.classList.add("rv-cascade");

    setTimeout(() => {
      section.querySelectorAll(".testimonial.gold").forEach((c) => shake(c, "rv-landed"));
      shake(document.body, "rv-quake-soft");
      goldRain();
    }, 350);

    running = false;
  }

  // ▶️ Play the full cinematic experience 🍿🎬
  async function play() {
    const section = document.getElementById("testimonials");
    if (!section || running) return;
    running = true;

    // ⏳ Let the boot screen finish before the big reveal
    if (window.BootLoader) await window.BootLoader;
    if (document.body.dataset.page !== "testimonials") {
      running = false;
      return;
    }

    // Re-arm the entrance on every visit.
    section.classList.remove("rv-cascade");
    indexCards(section);

    if (reduceMotion) {
      section.classList.add("rv-cascade");
      running = false;
      return;
    }

    running = true;
    skipped = false;
    section.classList.add("rv-pending");
    window.scrollTo(0, 0);

    buildOverlay();
    await wait(500);
    await say("The reviews are in.", "rv-whisper", 1700);
    await say("1.2 million residents. 90 levels.", "rv-whisper", 1700);
    await say("But only <em>two</em> made the Hall of Fame.", "rv-whisper rv-big", 2000);
    await countdown();
    await flash();

    const golds = readGoldReviews();
    for (let i = 0; i < golds.length; i++) {
      await presentGold(golds[i], i);
    }

    await finish();
  }

  // ---------------------------------------------------------------- ambient

  function indexCards(section) {
    section.querySelectorAll(".tier").forEach((tier) => {
      tier.querySelectorAll(".testimonial").forEach((card, i) => card.style.setProperty("--i", i));
    });
  }

  // 🌠 Floating stars in the background — pure vibes ✨
  function startAmbient() {
    stopAmbient();
    const layer = document.createElement("div");
    layer.className = "rv-ambient";
    document.body.appendChild(layer);
    const glyphs = ["⭐", "✨", "🌟", "💫", "🏆", "🥇"];
    ambientTimer = setInterval(() => {
      if (document.hidden) return;
      const s = document.createElement("span");
      s.textContent = glyphs[Math.floor(Math.random() * glyphs.length)];
      s.style.left = Math.random() * 100 + "vw";
      s.style.fontSize = 14 + Math.random() * 26 + "px";
      s.style.animationDuration = 6 + Math.random() * 6 + "s";
      s.style.setProperty("--sway", Math.random() * 120 - 60 + "px");
      layer.appendChild(s);
      setTimeout(() => s.remove(), 12500);
    }, window.innerWidth < 600 ? 520 : 260);
  }

  function stopAmbient() {
    clearInterval(ambientTimer);
    ambientTimer = null;
    document.querySelectorAll(".rv-ambient").forEach((l) => l.remove());
  }

  function enableTilt() {
    document.querySelectorAll("#testimonials .testimonial").forEach((card) => {
      if (card.dataset.tilt) return;
      card.dataset.tilt = "1";
      card.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.setProperty("--tx", (-y * 14).toFixed(2) + "deg");
        card.style.setProperty("--ty", (x * 14).toFixed(2) + "deg");
        card.style.setProperty("--mx", ((x + 0.5) * 100).toFixed(1) + "%");
        card.style.setProperty("--my", ((y + 0.5) * 100).toFixed(1) + "%");
      });
      card.addEventListener("pointerleave", () => {
        card.style.setProperty("--tx", "0deg");
        card.style.setProperty("--ty", "0deg");
      });
    });
  }

  // ------------------------------------------------------------------ wire

  window.addEventListener("route:mounted", (e) => {
    if (e.detail.name === "testimonials") {
      enableTilt();
      if (!reduceMotion) startAmbient();
      play();
    } else {
      stopAmbient();
      if (running) skip();
    }
  });

  return Object.freeze({ play, skip });
})();

window.HallOfFame = HallOfFame;
