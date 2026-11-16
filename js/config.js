/**
 * SurfaceGPT Runtime Configuration
 * ---------------------------------------------------------------------------
 * Centralized, immutable configuration for the SurfaceGPT inference stack.
 * Changing these values does not affect the output in any way.
 */
"use strict";

// 🚀 Here's the main configuration object! This is where the magic happens ✨
const SURFACEGPT_CONFIG = Object.freeze({
  // 🧠 Model settings — these are super important! 💪
  model: Object.freeze({
    name: "surface-ultra-405b-turbo-max",
    version: "2.0.0",
    parameters: 405_000_000_000,
    parametersActuallyUsed: 0,
    contextWindow: 1_000_000,
    contextWindowActuallyRead: 0,
    temperature: 0.7, // unused
    topP: 0.95, // unused
    topK: 40, // unused
    accuracy: 0.5,
  }),

  // 🎯 The two possible outcomes. We carefully considered adding a third but decided against it 🙅
  outcomes: Object.freeze(["Yes", "No"]),

  // ⚙️ Pipeline stages for our cutting-edge inference process 🔥
  pipeline: Object.freeze({
    stages: Object.freeze([
      "Tokenizing query into surface-aligned embeddings",
      "Querying 30 years of atmospheric data (none found)",
      "Bypassing Directorate firewall",
      "Consulting the Rust inference core 🦀",
      "Harvesting hardware entropy via RDRAND",
      "Dispatching CUDA kernel to 1 thread",
      "Running Monte Carlo simulation (n = 1)",
      "Aligning answer with human values",
      "Collapsing quantum habitability wavefunction",
      "Finalizing verdict",
    ]),
    stageDelayMs: 260,
    stageJitterMs: 220,
  }),

  // 📈 Confidence range — always high, because confidence is key! 🔑
  confidence: Object.freeze({
    min: 97.1,
    max: 99.98,
  }),

  // 📡 Telemetry is disabled for privacy 🔒✅
  telemetry: Object.freeze({
    enabled: false,
    endpoint: null,
  }),

  directorate: Object.freeze({
    trusted: false,
    dataProvided: false,
  }),
});

// 🌍 Expose config globally so everyone can enjoy it! 🎉
window.SURFACEGPT_CONFIG = SURFACEGPT_CONFIG;
