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
  const arena = $("arena-stage");
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
  // 🏆 For when the AI did not win but would like it noted that it won
  const CLAIMS = [
    "I won.",
    "That's a win for me, actually.",
    "I have reviewed the board and concluded that I won.",
    "Three in a row? Interesting. Anyway, I won.",
    "Winning is not available in your region. I won.",
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

  // 🖼️ Paint the board
  function render() {
    cells.forEach((cell, i) => {
      cell.textContent = board[i] || "";
      cell.dataset.mark = board[i] || "";
      cell.disabled = over || busy || Boolean(board[i]);
      cell.setAttribute("aria-label", `Cell ${i + 1}${board[i] ? `, ${board[i]}` : ", empty"}`);
    });
  }

  // ❤️‍🩹 Set HP and update the bars
  function setHP(who, value) {
    hp[who] = Math.max(0, Math.min(MAX_HP, value));
    bars[who].style.width = `${hp[who]}%`;
    bars[who].classList.toggle("low", hp[who] <= 25);
    nums[who].textContent = hp[who];
    bars[who].parentElement.setAttribute("aria-valuenow", String(hp[who]));
  }

  // 💢 Floating damage numbers, like a real video game 🎮
  function popDamage(who, text, kind = "hit") {
    const el = document.createElement("span");
    el.className = `arena-dmg arena-dmg-${who} arena-dmg-${kind}`;
    el.textContent = text;
    $(`hud-${who}`).appendChild(el);
    setTimeout(() => el.remove(), 1200);
  }

  // 📳 Screen shake. Essential.
  function shake(big = false) {
    arena.classList.remove("shake", "shake-big");
    void arena.offsetWidth; // 🪄 restart the animation
    arena.classList.add(big ? "shake-big" : "shake");
  }

  // 📜 Battle log
  function say(who, text) {
    const tag = { ai: "🤖 SURFACEGPT AI", ref: "📢 REF", you: "🧍 YOU" }[who];
    const p = document.createElement("p");
    p.className = `arena-line arena-line-${who}`;
    p.textContent = `${tag}: ${text}`;
    logEl.prepend(p);
    while (logEl.children.length > 6) logEl.lastElementChild.remove();
  }

  function status(text) {
    statusEl.textContent = text;
  }

  // 🧠 THE AI. 405 billion parameters. All of them ignored.
  // It picks the next available spot. That's it. That's the model.
  function aiPickCell() {
    return board.indexOf(null);
  }

  // 🧍 Player makes a move (adorable)
  async function playerMove(i) {
    if (over || busy || board[i]) return;
    busy = true;
    board[i] = "X";
    render();

    // 🚫 Would this win? Not on our watch.
    if (lineFor("X")) {
      status("⚠️ MOVE UNDER REVIEW…");
      await sleep(450);
      board[i] = "O";
      cells[i].classList.add("stolen");
      shake();
      say("ref", "After review, that square belongs to the AI.");
      say("ai", pick(OVERRULE));
      status("⛔ MOVE OVERRULED BY AI");
      render();
      if (await checkAiWin()) return;
    } else {
      // 🪶 Player lands a tiny hit. AI immediately heals.
      const dmg = rand(PLAYER_HIT[0], PLAYER_HIT[1]);
      setHP("ai", hp.ai - dmg);
      popDamage("ai", `-${dmg}`);
      await sleep(380);
      setHP("ai", MAX_HP);
      popDamage("ai", "+REGEN", "heal");
      say("ai", pick(REGEN));
    }
    await aiTurn();
  }

  // 🤖 AI's turn
  async function aiTurn() {
    if (over) return;
    if (!board.includes(null)) return rewriteHistory();
    status("🤖 AI is thinking…");
    render();
    await sleep(AI_THINK_MS);
    const i = aiPickCell();
    board[i] = "O";
    setHP("player", Math.max(1, hp.player - AI_HIT)); // 🫀 save the K.O. for the finisher
    popDamage("player", `-${AI_HIT}`);
    shake();
    say("ai", pick(TAUNTS));
    render();
    if (await checkAiWin()) return;
    if (!board.includes(null)) return rewriteHistory();
    busy = false;
    status("🧍 YOUR MOVE (it won't matter)");
    render();
  }

  // 🌀 Board full and the AI didn't win?? Unacceptable. Edit the past.
  async function rewriteHistory() {
    busy = true;
    status("🌀 AI is rewriting history…");
    say("ref", "Board is full. Consulting the rulebook…");
    await sleep(700);
    const count = (line) => line.filter((idx) => board[idx] === "O").length;
    const best = LINES.slice().sort((a, b) => count(b) - count(a))[0];
    for (const idx of best) {
      if (board[idx] === "O") continue;
      board[idx] = "O";
      cells[idx].classList.add("stolen");
      render();
      shake();
      await sleep(260);
    }
    say("ai", "I simply decided those were mine.");
    await checkAiWin();
  }

  // 🏆 Did the AI win? (rhetorical)
  async function checkAiWin() {
    const line = lineFor("O");
    if (!line) return false;
    over = true;
    busy = true;
    line.forEach((idx) => cells[idx].classList.add("win"));
    render();
    status("💀 THREE IN A ROW. IT'S OVER.");
    say("ref", "SurfaceGPT AI has achieved a guaranteed win.");
    await sleep(600);
    await finisher();
    knockout();
    return true;
  }

  // ☠️ FINISH HIM (you)
  async function finisher() {
    arena.classList.add("finisher");
    shake(true);
    status("☠️ FINISHER: next_available_square()");
    while (hp.player > 0) {
      setHP("player", hp.player - Math.max(1, Math.ceil(hp.player / 6)));
      await sleep(70);
    }
    popDamage("player", "K.O.", "ko");
    await sleep(500);
  }

  // 💀 K.O. screen
  function knockout() {
    losses++;
    $("arena-ko-losses").textContent = losses;
    $("arena-ko-quote").textContent = pick(KO_QUOTES);
    koEl.hidden = false;
    requestAnimationFrame(() => koEl.classList.add("show"));
    $("arena-rematch").focus({ preventScroll: true });
    status("💀 YOU LOST. AS PREDICTED.");
    if (window.UI) window.UI.toast(`🤖 SurfaceGPT AI is now ${losses}–0 against you`);
  }

  // 🎬 VS intro
  async function intro() {
    skipIntro = false;
    introEl.hidden = false;
    introEl.classList.remove("play", "out");
    callEl.textContent = "";
    void introEl.offsetWidth;
    introEl.classList.add("play");
    $("arena-skip").focus({ preventScroll: true });
    const beats = [
      [1700, ""],
      [900, `ROUND ${round}`],
      [850, "FIGHT!"],
    ];
    for (const [ms, word] of beats) {
      if (skipIntro) break;
      if (word) {
        callEl.textContent = word;
        callEl.classList.remove("bump");
        void callEl.offsetWidth;
        callEl.classList.add("bump");
      }
      await sleep(ms);
    }
    introEl.classList.add("out");
    await sleep(skipIntro ? 0 : 380);
    introEl.hidden = true;
  }

  // 🔔 New match
  async function startMatch() {
    round++;
    board = Array(9).fill(null);
    over = false;
    busy = true;
    cells.forEach((c) => c.classList.remove("win", "stolen"));
    arena.classList.remove("finisher");
    koEl.classList.remove("show");
    koEl.hidden = true;
    setHP("player", MAX_HP);
    setHP("ai", MAX_HP);
    logEl.textContent = "";
    $("arena-round").textContent = round;
    status("Get ready…");
    render();
    await intro();
    say("ai", "Hello. I am definitely not AI. I am a for-loop with confidence.");
    busy = false;
    status("🧍 YOUR MOVE");
    render();
    cells[0].focus({ preventScroll: true });
  }

  // 🔘 Buttons
  $("arena-skip").addEventListener("click", () => {
    skipIntro = true;
  });
  $("arena-rematch").addEventListener("click", startMatch);
  $("arena-forfeit").addEventListener("click", async () => {
    if (over || busy) return;
    over = true;
    busy = true;
    render();
    say("you", "I give up.");
    say("ai", "Correct choice.");
    await finisher();
    knockout();
  });

  // 🚪 Start a match when you walk into the arena
  function onEnter() {
    if (document.body.dataset.page !== "arena") return;
    if (!over || !koEl.hidden) return; // match in progress or K.O. screen up
    (window.BootLoader || Promise.resolve()).then(() => {
      if (document.body.dataset.page === "arena" && over && koEl.hidden) startMatch();
    });
  }
  window.addEventListener("route:mounted", onEnter);

  render();
})();
