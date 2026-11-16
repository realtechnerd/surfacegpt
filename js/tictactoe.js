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

