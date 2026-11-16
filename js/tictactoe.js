/**
 * SurfaceGPT ARENA ⚔️ — Tic-Tac-Toe vs SurfaceGPT AI 🤖
 * ---------------------------------------------------------------------------
 * Single-player boss fight. You vs. the most advanced opponent ever built:
 * a for-loop that picks the next empty cell. It has never lost. It never will.
 * (No AI was used to build the AI.)
 */
"use strict";

(function Arena() {
  // 📐 All 8 winning lines — we counted them by hand ✋ (again) (no AI)
  const LINES = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];

  // ⚖️ Game balance — tuned by our esports team 🏆 (perfectly fair)
  const MAX_HP = 100;
  const AI_HIT = 17; // 💥 damage per AI marker
  const PLAYER_HIT = [1, 3]; // 🪶 damage per player marker (lol)
  const AI_THINK_MS = 650; // 🧠 fake thinking time for immersion

  // ♿ Respect reduced motion — even the AI has manners 🎩
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // 🎯 Grab the DOM 🫳
  const $ = (id) => document.getElementById(id);
  const arena = $("arena");
  if (!arena) return;
  const boardEl = $("arena-board");
  const statusEl = $("arena-status");
  const logEl = $("arena-log");
  const introEl = $("arena-intro");
  const callEl = $("arena-intro-call");
  const koEl = $("arena-ko");

