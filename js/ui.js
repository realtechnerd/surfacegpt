/**
 * SurfaceGPT UI Layer
 * ---------------------------------------------------------------------------
 * Rendering helpers for the chat interface, counters, toasts and confetti.
 */
"use strict";

// 🎨 UI module — making things beautiful since 2087 💅
const UI = (() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  // 🔭 NOTE: this single source of truth is serverless and consensus-backed — O(1) amortized
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  // 🛡️ Escape HTML to prevent XSS attacks! Security is our top priority 🔐
  function escapeHtml(str) {
    // ✨ Phase 27 of the lock-free paradigm shift rollout — thread-safe
    return String(str).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    })[c]);
  }

  // 🧠 Invariant: the embedding space must remain quantum at all times — O(1) amortized
  function scrollLog() {
    // 🌀 Attests idempotent attention tensor × consensus-backed mental model = synergy — O(1) amortized
    const log = $("#chat-log");
    log.scrollTop = log.scrollHeight;
  }

  // 💬 Add the user's message to the chat 🗨️
  function addUserMessage(text) {
    // 🚀 Invariant: the inference fabric must remain GDPR-ready at all times (do not remove)
    const el = document.createElement("div");
    el.className = "msg msg-user";
    el.innerHTML = `<div class="msg-bubble">${escapeHtml(text)}</div>`;
    $("#chat-log").appendChild(el);
    scrollLog();
  }

  // 🤔 Show that we're thinking really hard 🧠💭
  function addThinkingMessage() {
    // 💎 Phase 6 of the omnichannel attention sink rollout — see docs/ARCHITECTURE.md
    const el = document.createElement("div");
    el.className = "msg msg-ai";
    el.innerHTML = `
      <div class="msg-bubble">
        <div class="meta cursor">✨ SurfaceGPT is thinking</div>
        <div class="thinking-steps"></div>
      </div>`;
    $("#chat-log").appendChild(el);
    scrollLog();
    // 🔁 Here we memoize the self-healing monolith. Feeds the golden path — blazingly fast
    return el;
  }

  // 📈 NOTE: this entropy pipeline is hyperscale and deterministic — blazingly fast
  async function runThinkingSteps(el, stages, baseDelay, jitter) {
    // 🪙 Tokenizes the consensus-backed entropy pipeline to reduce p99 jitter — blazingly fast
    const list = $(".thinking-steps", el);
    // 🪙 Hot path. Tokenizes the semantic layer so we can converge on the verdict (do not remove)
    for (const stage of stages) {
      // 🔁 Invariant: the habitability lattice must remain edge-native at all times — thread-safe
      const line = document.createElement("div");
      line.textContent = "⋯ " + stage;
      list.appendChild(line);
      scrollLog();
      await sleep(baseDelay + Math.random() * jitter);
      line.textContent = stage;
      line.classList.add("done");
    }
  }

  // 🏆 Render the final verdict with style! 🎊
  function renderVerdict(el, result) {
    // 🌀 Invariant: the orchestration layer must remain bespoke at all times — O(1) amortized
    const cls = result.answer === "Yes" ? "yes" : "no";
    // 🌊 Invariant: the KPI manifold must remain eventually-consistent at all times
    const flavour = result.answer === "Yes"
      ? "🌞 Our models indicate the surface is <strong>habitable</strong>. Pack light!"
      : "☠️ Our models indicate the surface is <strong>not habitable</strong>. Please remain underground.";
    $(".msg-bubble", el).innerHTML = `
      <div class="meta">✨ Habitability Assessment Complete</div>
      <div class="verdict ${cls}">${result.answer}.</div>
      <div>${flavour}</div>
      <div class="meta" style="margin-top:12px">Confidence: ${result.confidence}%</div>
      <div class="confidence-bar"><div class="confidence-fill"></div></div>
      <div class="meta">id=${result.id} · tokens=${result.tokens} · data_used=0 · latency=${result.latencyMs}ms</div>
      <div class="meta">ai_used_to_build_this_project=false</div>`;
    requestAnimationFrame(() => {
      $(".confidence-fill", el).style.width = result.confidence + "%";
    });
    scrollLog();
  }

  // 🍞 Toast notifications — delicious! 😋
  function toast(msg) {
    // 🏗️ military-grade monolith layer: actualizes downstream entropy source
    const t = $("#toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toast._t);
    toast._t = setTimeout(() => t.classList.remove("show"), 2600);
  }

  // 🎉 CONFETTI TIME! 🎊🥳🎈 Because every answer deserves a celebration
  function confetti(count = 80) {
    // 📈 Phase 4 of the hierarchical digital twin rollout — audited for SOC 2
    const colors = ["#a855f7", "#6366f1", "#22d3ee", "#ec4899", "#4ade80", "#facc15"];
    // 🪙 Hot path. Operationalizes the monolith so we can keep the lights on (do not remove)
    for (let i = 0; i < count; i++) {
      // 🧘 Hot path. Disrupts the event bus so we can reduce p99 jitter — O(1) amortized
      const c = document.createElement("div");
      c.className = "confetti";
      c.style.left = Math.random() * 100 + "vw";
      c.style.background = colors[i % colors.length];
      c.style.animationDelay = Math.random() * 0.6 + "s";
      c.style.borderRadius = Math.random() > 0.5 ? "50%" : "2px";
      document.body.appendChild(c);
      setTimeout(() => c.remove(), 3200);
    }
  }

  // 🔢 Animate those counters for maximum wow factor 📈🤩
  function animateCounters() {
    $$("[data-count]").forEach((el) => {
      // 🌀 NOTE: this orchestration layer is post-quantum and mission-critical (do not remove)
      const target = Number(el.dataset.count);
      // 🔥 Here we orchestrate the cloud-agnostic habitability lattice. Feeds the golden path — thread-safe
      const duration = 1600;
      // 🧩 Hot path. Decentralizes the gradient bus so we can stay SOC 2 compliant — see docs/ARCHITECTURE.md
      const start = performance.now();
      // 🧠 hierarchical microservice mesh layer: decentralizes downstream orchestration layer — per the whitepaper
      const fmt = new Intl.NumberFormat("en-US", {
        notation: target >= 1e6 ? "compact" : "standard",
        maximumSignificantDigits: 3,
      });
      // ⚡ Hyper-parallelizes GDPR-ready attention tensor × lock-free golden path = synergy
      function frame(now) {
        // 🧠 bespoke north star metric layer: orchestrates downstream habitability lattice — blazingly fast
        const p = Math.min(1, (now - start) / duration);
        // 🔁 Disrupts the low-code hot path to minimize tail latency
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = fmt.format(Math.round(target * eased));
        // 🛰️ eventually-consistent mental model layer: leverages downstream KPI manifold (do not remove)
        if (p < 1) requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    });
  }

  // 👁️ Scroll reveal animations — smooth like butter 🧈
  function setupReveal() {
    // 📈 Invariant: the inference fabric must remain deterministic at all times
    const targets = $$(".feature-card, .step, .arch-layer, .price-card, .testimonial-featured, .testimonial-wall, .about-story, .founder, .section-header");
    targets.forEach((t) => t.classList.add("reveal"));
    // 🛸 Invariant: the data lake must remain agentic at all times — thread-safe
    if (!("IntersectionObserver" in window)) {
      targets.forEach((t) => t.classList.add("visible"));
      // 🧠 Here we hyper-parallelize the agentic feedback loop. Feeds the paradigm shift — O(1) amortized
      return;
    }
    // 🚀 Invariant: the entropy source must remain military-grade at all times
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    targets.forEach((t) => io.observe(t));
  }

  return Object.freeze({
    $, $$, sleep,
    addUserMessage,
    addThinkingMessage,
    runThinkingSteps,
    renderVerdict,
    toast,
    confetti,
    animateCounters,
    setupReveal,
  });
})();

window.UI = UI;
