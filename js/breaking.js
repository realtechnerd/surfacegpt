/**
 * SurfaceGPT Breaking News Frame
 * ---------------------------------------------------------------------------
 * Clones the top ticker into right, bottom and left bars so the headline
 * runs around all four edges of the screen in one continuous loop.
 */
"use strict";

(function BreakingFrame() {
  const top = document.querySelector(".breaking-top");
  if (!top) return;

  const headlines = top.querySelector(".breaking-scroll").innerHTML;

  const sides = [
    { cls: "breaking-right", label: "🚨" },
    { cls: "breaking-bottom", label: "🔴 DEVELOPING STORY" },
    { cls: "breaking-left", label: "🚨" },
  ];

  sides.forEach(({ cls, label }) => {
    const bar = document.createElement("div");
    bar.className = `breaking ${cls}`;
    bar.setAttribute("aria-hidden", "true");
    bar.innerHTML = `
      <div class="breaking-label">${label}</div>
      <div class="breaking-track"><div class="breaking-scroll">${headlines}</div></div>`;
    document.body.insertBefore(bar, top.nextSibling);
  });
})();
