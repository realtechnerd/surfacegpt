/**
 * SurfaceGPT Mobile Navigation
 * ---------------------------------------------------------------------------
 * Hamburger toggle for screens too narrow to show every nav link.
 */
"use strict";

// 🍔 Hamburger menu — because mobile users deserve navigation too 📱✨
(function MobileNav() {
  const nav = document.querySelector(".nav");
  const toggle = document.querySelector(".nav-toggle");
  if (!nav || !toggle) return;

  // 🔓 Open or close the menu 🚪
  function setOpen(open) {
    nav.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }

  toggle.addEventListener("click", () => setOpen(!nav.classList.contains("open")));

  // 👆 Close after picking a page
  nav.querySelectorAll(".nav-links a").forEach((a) => a.addEventListener("click", () => setOpen(false)));

  // 🧭 Close on any route change, Escape, or a tap outside
  window.addEventListener("route:mounted", () => setOpen(false));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setOpen(false); });
  document.addEventListener("click", (e) => { if (!nav.contains(e.target)) setOpen(false); });
})();
