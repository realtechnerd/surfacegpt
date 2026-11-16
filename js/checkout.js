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

  // 📅 MM/YY
  function formatExpiry(value) {
    const d = value.replace(/\D/g, "").slice(0, 4);
    return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
  }

  // 🏷️ Card brand detection
  function brandFor(digits) {
    if (digits.startsWith("4")) return "RATION CARD";
    if (digits.startsWith("5")) return "LIGHT-HOUR EXPRESS";
    if (digits.startsWith("3")) return "RECYCLED WATER CLUB";
    if (digits.startsWith("6")) return "DIRECTORATE BLACK";
    return "RATION CARD";
  }

  // ✅ Luhn check
  function luhn(digits) {
    let sum = 0;
    for (let i = 0; i < digits.length; i++) {
      let n = Number(digits[digits.length - 1 - i]);
      if (i % 2 === 1) {
        n *= 2;
        if (n > 9) n -= 9;
      }
      sum += n;
    }
    return digits.length >= 12 && sum % 10 === 0;
  }

  // 👀 Live card preview
  function updatePreview() {
    const digits = $("co-cc").value.replace(/\D/g, "");
    const shown = (digits + "•".repeat(16 - digits.length)).replace(/(.{4})(?=.)/g, "$1 ");
    $("co-card-number").textContent = shown;
    $("co-card-brand").textContent = brandFor(digits);
    $("co-card-name").textContent = $("co-cc-name").value.trim() || "YOUR NAME HERE";
    $("co-card-exp").textContent = $("co-exp").value || "MM/YY";
  }

  $("co-cc").addEventListener("input", (e) => {
    e.target.value = formatCard(e.target.value);
    updatePreview();
  });
  $("co-exp").addEventListener("input", (e) => {
    e.target.value = formatExpiry(e.target.value);
    updatePreview();
  });
  $("co-cc-name").addEventListener("input", updatePreview);
  $("co-cvc").addEventListener("input", (e) => {
    e.target.value = e.target.value.replace(/\D/g, "").slice(0, 4);
  });

  // 🔍 Validation
  function validate() {
    const problems = [];
    form.querySelectorAll("[required]").forEach((el) => {
      const empty = el.type === "checkbox" ? !el.checked : !el.value.trim();
      el.classList.toggle("co-invalid", empty);
      if (empty) problems.push(el);
    });
    const digits = $("co-cc").value.replace(/\D/g, "");
    const cardOk = luhn(digits);
    $("co-cc").classList.toggle("co-invalid", !cardOk);
    if (!cardOk) problems.push($("co-cc"));
    const expOk = /^(0[1-9]|1[0-2])\/\d{2}$/.test($("co-exp").value);
    $("co-exp").classList.toggle("co-invalid", !expOk);
    if (!expOk) problems.push($("co-exp"));
    const cvcOk = /^\d{3,4}$/.test($("co-cvc").value);
    $("co-cvc").classList.toggle("co-invalid", !cvcOk);
    if (!cvcOk) problems.push($("co-cvc"));
    return [...new Set(problems)]; // 🧮 no double counting
  }

  // 🎭 Payment processing
  const STEPS = [
    "Contacting payment processor…",
    "Verifying card…",
    "Checking the ration ledger…",
    "Authorizing payment…",
    "Flipping the coin…",
  ];

