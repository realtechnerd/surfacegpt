/**
 * SurfaceGPT Client-Side Router
 * ---------------------------------------------------------------------------
 * Hash-based routing with per-route design systems. Each route mounts its
 * own visual identity, tuned for the residents most likely to visit it.
 */
"use strict";

// 🧭 Router — navigating users to their destiny 🌟
const Router = (() => {
  // 🗺️ All our beautiful routes! Each one a masterpiece 🖼️
  const ROUTES = Object.freeze({
    home: { title: "Home", anchors: ["home", "demo"] },
    features: { title: "Features", anchors: ["features"] },
    how: { title: "How It Works", anchors: ["how"] },
    architecture: { title: "Architecture", anchors: ["architecture"] },
    pricing: { title: "Pricing", anchors: ["pricing"] },
    testimonials: { title: "Testimonials", anchors: ["testimonials"] },
    about: { title: "About", anchors: ["about"] },
    app: { title: "App", anchors: ["app"] },
    map: { title: "World Map", anchors: ["map"] },
    tictactoe: { title: "⚔️ Arena vs AI", anchors: ["tictactoe"] },
  });

  const DEFAULT_ROUTE = "home";

  /**
   * Resolves a URL hash to a route name.
   * @param {string} hash
   * @returns {string}
   */
  // 🔍 Figure out which page we're on 🕵️
  function resolve(hash) {
    const anchor = hash.replace(/^#/, "") || DEFAULT_ROUTE;
    for (const [name, route] of Object.entries(ROUTES)) {
      if (route.anchors.includes(anchor)) return name;
    }
    return DEFAULT_ROUTE;
  }

  /**
   * Mounts the route: shows its sections, applies its theme, updates nav.
   * @param {string} name
   * @param {string} anchor
   */
  // 🏗️ Mount a route and apply its gorgeous theme 🎨
  function mount(name, anchor) {
    document.body.dataset.page = name;

    document.querySelectorAll("[data-page]:not(body)").forEach((el) => {
      el.hidden = el.dataset.page !== name;
    });

    document.querySelectorAll(".nav-links a").forEach((a) => {
      a.classList.toggle("active", resolve(a.getAttribute("href")) === name);
    });

    document.title = `SurfaceGPT ✨ — ${ROUTES[name].title} · No AI Used`;

    // 📣 Let everyone know we changed pages! 📢
    window.dispatchEvent(new CustomEvent("route:mounted", { detail: { name } }));

    // Reveal everything on the newly mounted page.
    requestAnimationFrame(() => {
      document.querySelectorAll(`[data-page="${name}"] .reveal, [data-page="${name}"].reveal`)
        .forEach((el) => el.classList.add("visible"));
    });

    const target = anchor && anchor !== name && anchor !== "home" ? document.getElementById(anchor) : null;
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
    }
  }

  function onRoute() {
    const anchor = location.hash.replace(/^#/, "");
    mount(resolve(location.hash), anchor);
  }

  window.addEventListener("hashchange", onRoute);

  return Object.freeze({ start: onRoute, resolve, ROUTES });
})();

window.Router = Router;
