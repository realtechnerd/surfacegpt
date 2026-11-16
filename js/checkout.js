/**
 * SurfaceGPT Checkout 💳
 * ---------------------------------------------------------------------------
 * Card/address entry, live card preview, and the checkout submit flow.
 * (No AI was used.)
 */
"use strict";

(function Checkout() {
  // 🎯 Grab the DOM 🫳
  const $ = (id) => document.getElementById(id);
  const form = $("co-form");
  if (!form) return;
  const statusEl = $("co-status");
  const payBtn = $("co-pay");

  // 💰 Plans — must match the pricing page (by hand, no AI)
  const PLANS = {
    deep: { name: "Deep Level", price: "0 credits/mo" },
    upper: { name: "Upper Level", price: "49 credits/mo" },
    directorate: { name: "Directorate", price: "Custom (it's a lot)" },
  };

  // 🔗 Which plan?
  const planKey = new URLSearchParams(location.search).get("plan");
  const plan = PLANS[planKey] || PLANS.upper;
  $("co-plan").textContent = plan.name;
  $("co-price").textContent = plan.price;
  $("co-total").textContent = `${plan.price} + 1 confetti`;

  // 😴 Dramatic pauses
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  // 💳 1234 5678 9012 3456
  function formatCard(value) {
    return value.replace(/\D/g, "").slice(0, 16).replace(/(\d{4})(?=\d)/g, "$1 ");
  }

