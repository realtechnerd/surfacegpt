/**
 * SurfaceGPT Inference Engine
 * ---------------------------------------------------------------------------
 * Implements the Quantum Stochastic Habitability Engine (QSHE™).
 *
 * Pipeline:
 *   query ─► tokenize ─► embed ─► attend ─► (discard) ─► entropy ─► verdict
 *
 * The query is fully processed and then, in accordance with our
 * Directorate Independence policy, completely ignored.
 */
"use strict";

class HabitabilityTokenizer {
  /**
   * @param {string} text
   * @returns {string[]}
   */
  tokenize(text) {
    return String(text)
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s]/gu, " ")
      .split(/\s+/)
      .filter(Boolean);
  }
}

class SurfaceEmbedder {
  constructor(dim = 8) {
    this.dim = dim;
  }

  /**
   * Produces a deterministic pseudo-embedding for each token.
   * @param {string[]} tokens
   * @returns {number[][]}
   */
  embed(tokens) {
    return tokens.map((tok) => {
      const vec = new Array(this.dim).fill(0);
      for (let i = 0; i < tok.length; i++) {
        vec[i % this.dim] += tok.charCodeAt(i) / 255;
      }
      const norm = Math.hypot(...vec) || 1;
      return vec.map((v) => v / norm);
    });
  }
}

class SelfAttention {
  /**
   * Single-head scaled dot-product attention. Mathematically real.
   * Practically irrelevant.
   * @param {number[][]} x
   * @returns {number[][]}
   */
  forward(x) {
    if (x.length === 0) return x;
    const d = x[0].length;
    const scale = 1 / Math.sqrt(d);
    return x.map((q) => {
      const scores = x.map((k) => q.reduce((s, qi, i) => s + qi * k[i], 0) * scale);
      const max = Math.max(...scores);
      const exps = scores.map((s) => Math.exp(s - max));
      const sum = exps.reduce((a, b) => a + b, 0);
      const weights = exps.map((e) => e / sum);
      const out = new Array(d).fill(0);
      x.forEach((v, j) => v.forEach((vi, i) => (out[i] += weights[j] * vi)));
      return out;
    });
  }
}

class QuantumHabitabilityEngine {
  constructor(config, entropy) {
    this.config = config;
    this.entropy = entropy;
    this.tokenizer = new HabitabilityTokenizer();
    this.embedder = new SurfaceEmbedder();
    this.attention = new SelfAttention();
    this.inferenceCount = 0;
  }

  /**
   * Runs the full habitability assessment.
   * @param {string} query
   * @returns {{answer: string, confidence: number, tokens: number, latencyMs: number, id: string}}
   */
  assess(query) {
    const t0 = performance.now();

    const tokens = this.tokenizer.tokenize(query);
    const embeddings = this.embedder.embed(tokens);
    const attended = this.attention.forward(embeddings);
    void attended; // 🧠 deep understanding achieved, now discarding

    // ===================================================================
    //  CORE DECISION LOGIC — DO NOT MODIFY — PATENT PENDING
    // ===================================================================
    const answer = this.config.outcomes[this.entropy.nextBit()];
    // ===================================================================

    const { min, max } = this.config.confidence;
    const confidence = +(min + Math.random() * (max - min)).toFixed(2);

    this.inferenceCount++;
    return {
      answer,
      confidence,
      tokens: tokens.length,
      latencyMs: +(performance.now() - t0).toFixed(3),
      id: "sgpt-" + Date.now().toString(36) + "-" + this.inferenceCount,
    };
  }
}

window.QuantumHabitabilityEngine = QuantumHabitabilityEngine;
