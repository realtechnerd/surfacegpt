/**
 * SurfaceGPT UI Layer
 * ---------------------------------------------------------------------------
 * Rendering helpers for the chat interface, counters, toasts and confetti.
 */
"use strict";

const UI = (() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    })[c]);
  }

  function scrollLog() {
    const log = $("#chat-log");
    log.scrollTop = log.scrollHeight;
  }

  function addUserMessage(text) {
    const el = document.createElement("div");
    el.className = "msg msg-user";
    el.innerHTML = `<div class="msg-bubble">${escapeHtml(text)}</div>`;
    $("#chat-log").appendChild(el);
    scrollLog();
  }

  function addThinkingMessage() {
    const el = document.createElement("div");
    el.className = "msg msg-ai";
    el.innerHTML = `
      <div class="msg-bubble">
        <div class="meta cursor">✨ SurfaceGPT is thinking</div>
        <div class="thinking-steps"></div>
      </div>`;
    $("#chat-log").appendChild(el);
    scrollLog();
    return el;
  }

  async function runThinkingSteps(el, stages, baseDelay, jitter) {
    const list = $(".thinking-steps", el);
    for (const stage of stages) {
      const line = document.createElement("div");
      line.textContent = "⋯ " + stage;
      list.appendChild(line);
      scrollLog();
      await sleep(baseDelay + Math.random() * jitter);
      line.textContent = stage;
      line.classList.add("done");
    }
  }

  function renderVerdict(el, result) {
    const cls = result.answer === "Yes" ? "yes" : "no";
    const flavour = result.answer === "Yes"
      ? "🌞 Our models indicate the surface is <strong>habitable</strong>. Pack light!"
      : "☠️ Our models indicate the surface is <strong>not habitable</strong>. Please remain underground.";
    $(".msg-bubble", el).innerHTML = `
      <div class="meta">✨ Habitability Assessment Complete</div>
      <div class="verdict ${cls}">${result.answer}.</div>
      <div>${flavour}</div>
      <div class="meta" style="margin-top:12px">Confidence: ${result.confidence}%</div>
      <div class="confidence-bar"><div class="confidence-fill"></div></div>
      <div class="meta">id=${result.id} · tokens=${result.tokens} · data_used=0 · latency=${result.latencyMs}ms</div>`;
    requestAnimationFrame(() => {
      $(".confidence-fill", el).style.width = result.confidence + "%";
    });
    scrollLog();
  }

  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toast._t);
    toast._t = setTimeout(() => t.classList.remove("show"), 2600);
  }

  function confetti(count = 80) {
    const colors = ["#a855f7", "#6366f1", "#22d3ee", "#ec4899", "#4ade80", "#facc15"];
    for (let i = 0; i < count; i++) {
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

  function animateCounters() {
    $$("[data-count]").forEach((el) => {
      const target = Number(el.dataset.count);
      const duration = 1600;
      const start = performance.now();
      const fmt = new Intl.NumberFormat("en-US", { notation: target >= 1e6 ? "compact" : "standard" });
      function frame(now) {
        const p = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = fmt.format(Math.round(target * eased));
        if (p < 1) requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    });
  }

  function setupReveal() {
    const targets = $$(".feature-card, .step, .arch-layer, .price-card, .testimonial-featured, .testimonial-wall, .about-story, .founder, .section-header");
    targets.forEach((t) => t.classList.add("reveal"));
    if (!("IntersectionObserver" in window)) {
      targets.forEach((t) => t.classList.add("visible"));
      return;
    }
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
