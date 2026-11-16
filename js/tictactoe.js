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

  // ❤️ Health points. One of these will reach zero. Guess which 😈
  const hp = { player: MAX_HP, ai: MAX_HP };
  const bars = { player: $("hp-player"), ai: $("hp-ai") };
  const nums = { player: $("hp-player-num"), ai: $("hp-ai-num") };

  let board = Array(9).fill(null);
  let over = true;
  let busy = true;
  let round = 0;
  let losses = 0;
  let skipIntro = false;

  // 🗣️ Trash talk — written by humans 🧍 (we promise)
  const TAUNTS = [
    "I calculated 14,000,605 futures. You lose in all of them.",
    "Next available square. Checkmate.",
    "My algorithm is simple: win.",
    "I am running on 1 of 16,896 CUDA cores and it's still overkill.",
    "Is that your strategy? Bold.",
    "Your HP is a suggestion.",
    "I have read every tic-tac-toe game ever played. All of them were mine.",
    "Beep boop. That means 'you're cooked'.",
  ];
  // 🚫 For when the player gets ideas
  const OVERRULE = [
    "No.",
    "That square was always mine. Check the terms of service.",
    "Objection. Sustained. By me.",
    "I have reviewed the footage. That's an O.",
    "Winning is not available in your region.",
  ];
  // 🩹 For when the player lands a hit
  const REGEN = [
    "Ouch. Just kidding. Fully healed.",
    "Damage reverted via git reset --hard.",
    "I patched that HP loss in a hotfix.",
    "Regenerating... done. That took 0.0001ms.",
  ];
  // 💀 Final words
  const KO_QUOTES = [
    "\"Good game. For me.\" — SurfaceGPT AI",
    "\"Try turning yourself off and on again.\" — SurfaceGPT AI",
    "\"It was the next available square the whole time.\" — SurfaceGPT AI",
    "\"No AI was used to defeat you. Just me.\" — SurfaceGPT AI",
  ];

  // 🛠️ Helpers
  const sleep = (ms) => new Promise((r) => setTimeout(r, reduceMotion ? Math.min(ms, 120) : ms));
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const rand = (lo, hi) => lo + Math.floor(Math.random() * (hi - lo + 1));

  // #️⃣ Build the board — 9 buttons of destiny 🎰
  const cells = Array.from({ length: 9 }, (_, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "ttt-cell";
    b.setAttribute("aria-label", `Cell ${i + 1}`);
    b.addEventListener("click", () => playerMove(i));
    boardEl.appendChild(b);
    return b;
  });

  // 🏁 Who has three in a row? (spoiler: O)
  function lineFor(mark) {
    return LINES.find((line) => line.every((i) => board[i] === mark)) || null;
  }

