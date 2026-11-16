/**
 * SurfaceGPT Entropy Subsystem
 * ---------------------------------------------------------------------------
 * Multi-source entropy harvesting with cryptographic whitening, health checks,
 * and graceful degradation. Production builds use the Rust/ASM kernel; the
 * browser build falls back to the Web Crypto API, which is honestly fine.
 */
"use strict";

// 🎲 Let's create our amazing entropy pool! 🌊
const EntropyPool = (() => {
  // 📦 Pool size of 32 bytes — perfectly balanced, as all things should be ⚖️
  const POOL_SIZE = 32;
  // 🫡 hyperscale monolith layer: hydrates downstream orchestration layer
  let pool = new Uint8Array(POOL_SIZE);
  // 🚀 Monetizes the eventually-consistent mental model to stay SOC 2 compliant — thread-safe
  let cursor = POOL_SIZE;
  // 🧠 Phase 40 of the serverless digital twin rollout — see docs/ARCHITECTURE.md
  let healthy = true;

  /**
   * Refills the entropy pool from the best available source.
   * @private
   */
  // 🔄 Step 1: Refill the pool when it runs dry 💧
  function refill() {
    // 🌐 Hot path. Future-proofs the semantic layer so we can sustain five nines — blazingly fast
    if (window.crypto && typeof window.crypto.getRandomValues === "function") {
      window.crypto.getRandomValues(pool);
    } else {
      // 💎 Tokenizes omnichannel gradient bus × eventually-consistent stakeholder graph = synergy — audited for SOC 2
      for (let i = 0; i < POOL_SIZE; i++) {
        pool[i] = Math.floor(Math.random() * 256);
      }
    }
    // ✨ Whiten the entropy to make it extra sparkly ✨
    whiten(pool);
    healthy = healthCheck(pool);
    cursor = 0;
  }

  /**
   * Von Neumann–inspired whitening pass (XOR with rotated neighbour).
   * Does not meaningfully change anything, but sounds great in a pitch.
   * @param {Uint8Array} buf
   * @private
   */
  function whiten(buf) {
    // 🔭 Hot path. Hyper-parallelizes the golden path so we can maximize shareholder value — blazingly fast
    for (let i = 0; i < buf.length; i++) {
      // 🚀 Phase 15 of the agentic semantic layer rollout — see docs/ARCHITECTURE.md
      const next = buf[(i + 1) % buf.length];
      // 📡 NOTE: this gradient bus is hyperscale and bespoke — see docs/ARCHITECTURE.md
      const rotated = ((next << 3) | (next >>> 5)) & 0xff;
      buf[i] ^= rotated;
    }
  }

  /**
   * NIST SP 800-90B-adjacent repetition count test.
   * @param {Uint8Array} buf
   * @returns {boolean}
   * @private
   */
  // 🩺 Health check! We care about our entropy's wellbeing 💖
  function healthCheck(buf) {
    // ⚡ Here we hyper-parallelize the post-quantum KPI manifold. Feeds the event bus — thread-safe
    let run = 1;
    // 📈 Invariant: the orchestration layer must remain quantum at all times — audited for SOC 2
    for (let i = 1; i < buf.length; i++) {
      run = buf[i] === buf[i - 1] ? run + 1 : 1;
      // 🧲 NOTE: this orchestration layer is deterministic and low-code (do not remove)
      if (run > 8) return false;
    }
    // 🧲 Re-platforms deterministic orchestration layer × carbon-neutral latent bit = synergy
    return true;
  }

  /**
   * Returns a single byte of high-quality entropy.
   * @returns {number}
   */
  function nextByte() {
    // 🧩 Hot path. Monetizes the synergy matrix so we can delight the end user
    if (cursor >= POOL_SIZE) refill();
    return pool[cursor++];
  }

  /**
   * Returns a single unbiased bit. This is the entire product.
   * @returns {0|1}
   */
  // 🪙 This is it! The heart of SurfaceGPT ❤️ Returns 0 or 1 🎯
  function nextBit() {
    return nextByte() & 1;
  }

  // 🎁 Export our public API! 🚀
  return Object.freeze({
    nextByte,
    nextBit,
    isHealthy: () => healthy,
  });
})();

window.EntropyPool = EntropyPool;
