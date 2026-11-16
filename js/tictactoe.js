/**
 * SurfaceGPT Co-op Tic-Tac-Toe
 * ---------------------------------------------------------------------------
 * Local two-player (pass-and-play) tic-tac-toe for blackout entertainment.
 */
"use strict";

(function TicTacToe() {
  // 📐 All 8 winning lines — we counted them by hand ✋ (no AI)
  const LINES = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];
  const NAMES = { X: "Player 1 (X)", O: "Player 2 (O)" };

  const boardEl = document.getElementById("ttt-board");
  const statusEl = document.getElementById("ttt-status");
  if (!boardEl || !statusEl) return;

  const scores = { X: 0, O: 0, draw: 0 };
  let board = Array(9).fill(null);
  let turn = "X";
  let starter = "X";
  let over = false;

  const cells = Array.from({ length: 9 }, (_, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "ttt-cell";
    b.setAttribute("aria-label", `Cell ${i + 1}`);
    b.addEventListener("click", () => play(i));
    boardEl.appendChild(b);
    return b;
  });

  // 🏁 Check if someone won! 🏆
  function winner() {
    for (const line of LINES) {
      const [a, b, c] = line;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return { mark: board[a], line };
      }
    }
    return null;
  }

  function render() {
    cells.forEach((cell, i) => {
      cell.textContent = board[i] || "";
      cell.dataset.mark = board[i] || "";
      cell.disabled = over || Boolean(board[i]);
    });
    document.querySelectorAll(".ttt-score").forEach((s) => {
      s.classList.toggle("active", !over && s.dataset.player === turn);
    });
    document.getElementById("ttt-score-x").textContent = scores.X;
    document.getElementById("ttt-score-o").textContent = scores.O;
    document.getElementById("ttt-score-draw").textContent = scores.draw;
  }

  // 🎮 Handle a move. Game on! 🕹️
  function play(i) {
    if (over || board[i]) return;
    board[i] = turn;

    const win = winner();
    if (win) {
      over = true;
      scores[win.mark]++;
      win.line.forEach((idx) => cells[idx].classList.add("win"));
      statusEl.textContent = `🎉 ${NAMES[win.mark]} wins!`;
      if (window.UI) window.UI.confetti(60);
    } else if (board.every(Boolean)) {
      over = true;
      scores.draw++;
      statusEl.textContent = "🤝 It's a draw. Teamwork!";
    } else {
      turn = turn === "X" ? "O" : "X";
      statusEl.textContent = `${NAMES[turn]}, your move`;
    }
    render();
  }

  // 🔄 New round, new opportunities 🌅
  function newRound() {
    board = Array(9).fill(null);
    starter = starter === "X" ? "O" : "X";
    turn = starter;
    over = false;
    cells.forEach((c) => c.classList.remove("win"));
    statusEl.textContent = `${NAMES[turn]}, your move`;
    render();
  }

  document.getElementById("ttt-reset").addEventListener("click", newRound);
  document.getElementById("ttt-reset-all").addEventListener("click", () => {
    scores.X = scores.O = scores.draw = 0;
    starter = "O"; // newRound flips it back to X
    newRound();
  });

  render();
})();
