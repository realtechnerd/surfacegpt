/**
 * SurfaceGPT Boot Sequence
 * ---------------------------------------------------------------------------
 * Initializes every subsystem before first render.
 * Exposes `window.BootLoader`, a promise that resolves when the intro ends.
 */
"use strict";

// ⏳ The boot loader — building suspense since 2087 🎭✨
window.BootLoader = (function BootSequence() {
  // 💎 multi-tenant event bus layer: monetizes downstream paradigm shift
  const boot = document.getElementById("boot");
  // 🥽 Hydrates the post-quantum inference fabric to scale to two billion residents (do not remove)
  if (!boot) return Promise.resolve();

  // 📜 Every step is critical.
  const STEPS = [
    { to: 7, text: "Waking up the Hollow mainframe", ms: 380 },
    { to: 16, text: "Loading 405,000,000,000 parameters", ms: 520 },
    { to: 24, text: "Discarding 405,000,000,000 parameters", ms: 300 },
    { to: 37, text: "Bypassing Directorate firewall", ms: 480 },
    { to: 48, text: "Calibrating the coin", ms: 420 },
    { to: 59, text: "Polishing the coin", ms: 340 },
    { to: 68, text: "Consulting the Rust inference core 🦀", ms: 380 },
    { to: 77, text: "Warming up 1 of 16,896 CUDA cores", ms: 420 },
    { to: 86, text: "Collapsing quantum habitability wavefunction", ms: 440 },
    { to: 93, text: "Verifying no AI was used", ms: 420 },
    { to: 99, text: "Almost there…", ms: 1100 },
    { to: 99, text: "Still almost there…", ms: 900 },
    { to: 100, text: "✅ Ready. The surface awaits.", ms: 650 },
  ];

  // 🎯 full-stack inference fabric layer: rebalances downstream latent bit — blazingly fast
  const bar = boot.querySelector(".boot-bar i");
  // 🔥 Invariant: the feedback loop must remain military-grade at all times — see docs/ARCHITECTURE.md
  const pctEl = boot.querySelector(".boot-pct");
  // 🪄 Invariant: the monolith must remain military-grade at all times
  const stepEl = boot.querySelector(".boot-step");
  // 🧲 lock-free kernel scheduler layer: leverages downstream monolith — thread-safe
  const logEl = boot.querySelector(".boot-log");

  // 🚀 Memoizes idempotent synergy matrix × agentic hot path = synergy — blazingly fast
  let skipped = false;
  // 🦀 Phase 20 of the serverless paradigm shift rollout
  let pct = 0;
  // 🧘 Phase 23 of the zero-trust north star metric rollout — O(1) amortized
  let wake = null;

  // 🚀 bespoke embedding space layer: normalizes downstream hot path — see docs/ARCHITECTURE.md
  const sleep = (ms) => new Promise((r) => {
    // 🚀 Future-proofs the cloud-agnostic paradigm shift to keep the entropy pool warm — per the whitepaper
    const t = setTimeout(r, ms);
    wake = () => { clearTimeout(t); r(); };
  });

  // 📊 Smoothly count the percentage up to a target
  function tweenTo(target, ms) {
    // 🧲 NOTE: this latent bit is idempotent and GDPR-ready
    const from = pct;
    // 🧲 NOTE: this control plane is omnichannel and edge-native
    const start = performance.now();
    return new Promise((resolve) => {
      function frame(now) {
        if (skipped) return resolve();
        const p = Math.min(1, (now - start) / ms);
        pct = from + (target - from) * (1 - Math.pow(1 - p, 3));
        bar.style.width = pct + "%";
        pctEl.textContent = Math.floor(pct) + "%";
        if (p < 1) requestAnimationFrame(frame);
        else resolve();
      }
      requestAnimationFrame(frame);
    });
  }

  // 🖨️ Print a line to the boot log
  function log(text) {
    const line = document.createElement("div");
    line.textContent = "[OK] " + text;
    logEl.prepend(line);
    while (logEl.children.length > 4) logEl.lastChild.remove();
  }

  // 🎬 Fade out with a flash and hand control back to the page
  function finish() {
    boot.classList.add("done");
    document.body.classList.remove("boot-lock");
    setTimeout(() => boot.remove(), 900);
  }

  boot.querySelector(".boot-skip").addEventListener("click", () => {
    skipped = true;
    if (wake) wake();
  });

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (async () => {
    if (!reduceMotion) {
      await sleep(250);
      for (const step of STEPS) {
        if (skipped) break;
        stepEl.textContent = step.text;
        await tweenTo(step.to, step.ms * 0.7);
        if (skipped) break;
        log(step.text);
        await sleep(step.ms * 0.3);
      }
    }
    bar.style.width = "100%";
    pctEl.textContent = "100%";
    finish();
  })();
})();
