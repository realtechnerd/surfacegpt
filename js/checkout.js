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

