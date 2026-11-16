/**
 * SurfaceGPT Hall of Fame Score
 * ---------------------------------------------------------------------------
 * A fully synthesized, Web Audio–only cinematic score for the Gold Tier
 * reveal: ominous drone, booms, a rising riser, timpani countdown, a brass
 * impact on the flash, a heroic choir-ish pad per gold reviewer (with a key
 * change for the second one, obviously) and a closing fanfare.
 *
 * reveal.js calls the cues; everything here is optional and fails silently.
 */
"use strict";

// 🎼 The Hall of Fame Score — composed by hand, performed by oscillators 🎻
const HallOfFameScore = (() => {
  const AC = window.AudioContext || window.webkitAudioContext;

  let ctx = null;
  let master = null;
  let bus = null; // current cue bus; swapped out on stop() for a quick fade
  let drone = null;
  let noise = null;
  let countN = 0;
  let muted = false;
  try { muted = localStorage.getItem("rv-muted") === "1"; } catch (_) { /* private mode */ }

  // ---------------------------------------------------------------- engine

  function ensure() {
    if (!AC) return null;
    if (!ctx) {
      ctx = new AC();
      const comp = ctx.createDynamicsCompressor();
      comp.threshold.value = -10;
      comp.ratio.value = 6;
      comp.attack.value = 0.003;
      comp.release.value = 0.25;
      master = ctx.createGain();
      master.gain.value = muted ? 0 : 0.85;
      master.connect(comp).connect(ctx.destination);
      newBus();

      // Autoplay policy: if we started without a gesture, wake up on the next one.
      const wake = () => { if (ctx.state === "suspended") ctx.resume(); };
      ["pointerdown", "keydown", "touchstart"].forEach((ev) =>
        window.addEventListener(ev, wake, { capture: true, passive: true })
      );
    }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }

  function newBus() {
    bus = ctx.createGain();
    bus.connect(master);
  }

  function noiseBuffer() {
    if (noise) return noise;
    const len = ctx.sampleRate * 2;
    noise = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = noise.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    return noise;
  }

  /** Gain envelope: attack → hold → exponential release. */
  function env(t, peak, attack, hold, release) {
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + attack);
    g.gain.setValueAtTime(peak, t + attack + hold);
    g.gain.exponentialRampToValueAtTime(0.0001, t + attack + hold + release);
    return g;
  }

  function tone(t, { type = "sine", freq, to, glide = 0.5, peak = 0.3, attack = 0.005, hold = 0, release = 0.6, detune = 0, dest = bus }) {
    const o = ctx.createOscillator();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    if (to) o.frequency.exponentialRampToValueAtTime(to, t + glide);
    o.detune.value = detune;
    const g = env(t, peak, attack, hold, release);
    o.connect(g).connect(dest);
    o.start(t);
    o.stop(t + attack + hold + release + 0.05);
    return o;
  }

  function hiss(t, { type = "highpass", freq = 3000, to, glide = 1, q = 0.7, peak = 0.3, attack = 0.005, hold = 0, release = 1 }) {
    const src = ctx.createBufferSource();
    src.buffer = noiseBuffer();
    src.loop = true;
    const f = ctx.createBiquadFilter();
    f.type = type;
    f.Q.value = q;
    f.frequency.setValueAtTime(freq, t);
    if (to) f.frequency.exponentialRampToValueAtTime(to, t + glide);
    const g = env(t, peak, attack, hold, release);
    src.connect(f).connect(g).connect(bus);
    src.start(t);
    src.stop(t + attack + hold + release + 0.05);
  }

  // ---------------------------------------------------------------- instruments

  /** Cinematic boom: pitch-dropping sub plus a low thump. */
  function boom(t, vol = 1) {
    tone(t, { freq: 120, to: 32, glide: 0.9, peak: 0.9 * vol, release: 1.6 });
    tone(t, { type: "triangle", freq: 70, to: 40, glide: 0.4, peak: 0.35 * vol, release: 0.8 });
    hiss(t, { type: "lowpass", freq: 400, to: 80, glide: 0.5, peak: 0.5 * vol, release: 0.6 });
  }

  /** Tension riser: sweeping noise plus a climbing saw. */
  function riser(t, dur) {
    hiss(t, { type: "bandpass", freq: 300, to: 7000, glide: dur, q: 3, peak: 0.28, attack: dur * 0.9, release: 0.08 });
    tone(t, { type: "sawtooth", freq: 110, to: 880, glide: dur, peak: 0.06, attack: dur * 0.9, release: 0.08 });
  }

  function timpani(t, freq, vol = 1) {
    tone(t, { freq: freq * 1.04, to: freq, glide: 0.08, peak: 0.7 * vol, release: 1.4 });
    tone(t, { type: "triangle", freq: freq * 1.5, peak: 0.18 * vol, release: 0.5 });
    hiss(t, { type: "bandpass", freq: 900, q: 1, peak: 0.25 * vol, release: 0.12 });
  }

  function crash(t, vol = 1) {
    hiss(t, { type: "highpass", freq: 2500, peak: 0.45 * vol, release: 3 });
    hiss(t, { type: "bandpass", freq: 6000, q: 0.5, peak: 0.2 * vol, release: 1.5 });
  }

  /** Ensemble chord: detuned saw pairs through a lowpass with vibrato. */
  function chord(t, freqs, { peak = 0.12, attack = 0.02, hold = 0.5, release = 0.8, cutoff = 2400, type = "sawtooth" } = {}) {
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = cutoff;
    const g = env(t, peak, attack, hold, release);
    lp.connect(g).connect(bus);

    const lfo = ctx.createOscillator();
    const depth = ctx.createGain();
    lfo.frequency.value = 5.2;
    depth.gain.value = 9;
    lfo.connect(depth);
    const end = t + attack + hold + release + 0.05;
    lfo.start(t);
    lfo.stop(end);

    freqs.forEach((f) => {
      [-8, 8].forEach((cents) => {
        const o = ctx.createOscillator();
        o.type = type;
        o.frequency.value = f;
        o.detune.value = cents;
        depth.connect(o.detune);
        o.connect(lp);
        o.start(t);
        o.stop(end);
      });
    });
  }

  function chimes(t, freqs, step = 0.09) {
    freqs.forEach((f, i) => {
      tone(t + i * step, { freq: f, peak: 0.12, release: 1.2 });
      tone(t + i * step, { freq: f * 2, peak: 0.04, release: 0.6 });
    });
  }

  // ---------------------------------------------------------------- mute

  function addMuteButton() {
    const overlay = document.querySelector(".rv-overlay");
    if (!overlay || overlay.querySelector(".rv-mute")) return;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "rv-skip rv-mute";
    btn.setAttribute("aria-label", "Toggle sound");
    btn.style.right = "auto";
    btn.style.left = "24px";
    btn.textContent = muted ? "🔇 Sound off" : "🔊 Sound on";
    btn.addEventListener("click", () => {
      muted = !muted;
      try { localStorage.setItem("rv-muted", muted ? "1" : "0"); } catch (_) { /* ignore */ }
      btn.textContent = muted ? "🔇 Sound off" : "🔊 Sound on";
      if (master) master.gain.setTargetAtTime(muted ? 0 : 0.85, ctx.currentTime, 0.05);
    });
    overlay.appendChild(btn);
  }

  // ---------------------------------------------------------------- cues

  /** Act I: the ominous drone under the whispered lines. */
  function start() {
    if (!ensure()) return;
    stop(true);
    countN = 0;
    addMuteButton();

    const t = ctx.currentTime;
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.setValueAtTime(220, t);
    lp.Q.value = 4;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.32, t + 3);
    lp.connect(g).connect(bus);

    const oscs = [55, 55.35, 82.4, 27.5].map((f, i) => {
      const o = ctx.createOscillator();
      o.type = i === 3 ? "sine" : "sawtooth";
      o.frequency.value = f;
      o.connect(lp);
      o.start(t);
      return o;
    });
    drone = { oscs, lp, g };
    boom(t + 0.05, 0.8);
  }

  /** A line of text appears. reveal.js passes its CSS classes. */
  function line(cls = "") {
    if (!ctx) return;
    const t = ctx.currentTime;
    if (cls.includes("rv-count")) {
      const pitches = [98, 123.5, 146.8];
      timpani(t, pitches[Math.min(countN, 2)], 0.8 + countN * 0.2);
      tone(t, { type: "square", freq: 1760, peak: 0.05, release: 0.05 });
      if (drone) drone.lp.frequency.setTargetAtTime(500 + countN * 400, t, 0.2);
      countN++;
    } else if (cls.includes("rv-big")) {
      boom(t, 1);
      riser(t + 0.15, 1.85);
      if (drone) drone.lp.frequency.setTargetAtTime(900, t, 0.8);
    } else {
      boom(t, 0.7);
      if (drone) drone.lp.frequency.setTargetAtTime(drone.lp.frequency.value + 90, t, 0.5);
    }
  }

  /** The white flash: everything hits at once, the drone cuts out. */
  function impact() {
    if (!ctx) return;
    const t = ctx.currentTime;
    crash(t, 1.2);
    boom(t, 1.3);
    chord(t, [65.4, 130.8, 196, 261.6, 329.6], { peak: 0.16, attack: 0.008, hold: 0.25, release: 1.1, cutoff: 3200 });
    if (drone) {
      drone.g.gain.setTargetAtTime(0.0001, t, 0.15);
      const d = drone;
      setTimeout(() => d.oscs.forEach((o) => { try { o.stop(); } catch (_) { /* done */ } }), 1200);
      drone = null;
    }
  }

  /** A gold reviewer takes the stage. Second one gets a key change. */
  function gold(index = 0) {
    if (!ctx) return;
    const t = ctx.currentTime;
    const root = index === 0 ? 130.8 : 146.8; // C3, then up a whole step to D3
    const third = root * 1.26;
    const fifth = root * 1.498;

    // Timpani roll into the hit.
    for (let i = 0; i < 9; i++) timpani(t + i * 0.045, root / 2, 0.25 + i * 0.06);
    const hit = t + 0.42;
    crash(hit, 0.9);
    timpani(hit, root / 2, 1.2);
    boom(hit, 0.8);

    // Brass fanfare: root – fifth – octave, then hold the octave.
    const brass = [[0, root], [0.22, fifth], [0.44, root * 2]];
    brass.forEach(([dt, f], i) => {
      chord(hit + dt, [f, f / 2], {
        peak: 0.11,
        attack: 0.02,
        hold: i === brass.length - 1 ? 1.3 : 0.14,
        release: i === brass.length - 1 ? 0.9 : 0.12,
        cutoff: 2800,
      });
    });

    // Heroic "choir" pad swelling under the quote.
    chord(hit + 0.3, [root / 2, root, fifth, root * 2, third * 2, fifth * 2], {
      type: "triangle",
      peak: 0.09,
      attack: 1.2,
      hold: 2.6,
      release: 1.4,
      cutoff: 1800,
    });

    // Sparkles as the stars land.
    chimes(hit + 0.7, [root * 4, third * 4, fifth * 4, root * 8, fifth * 8]);
    chimes(hit + 2.4, [fifth * 8, root * 8, third * 4, root * 4], 0.12);
  }

  /** Cards cascade in: one last triumphant hit. */
  function finale() {
    if (!ctx || document.body.dataset.page !== "testimonials") return;
    const t = ctx.currentTime + 0.3;
    const arp = [261.6, 329.6, 392, 523.3];
    arp.forEach((f, i) => chord(t + i * 0.09, [f], { peak: 0.08, hold: 0.05, release: 0.25, cutoff: 3500 }));
    const hit = t + 0.4;
    chord(hit, [130.8, 261.6, 329.6, 392, 523.3], { peak: 0.13, attack: 0.01, hold: 0.8, release: 1.6, cutoff: 3200 });
    timpani(hit, 65.4, 1.2);
    crash(hit, 1);
    chimes(hit + 0.2, [1046.5, 1318.5, 1568, 2093, 2637]);
  }

  /** Fades out everything currently playing. */
  function stop(instant = false) {
    if (!ctx || !bus) return;
    const old = bus;
    old.gain.setTargetAtTime(0.0001, ctx.currentTime, instant ? 0.01 : 0.12);
    setTimeout(() => old.disconnect(), instant ? 100 : 800);
    if (drone) {
      const d = drone;
      setTimeout(() => d.oscs.forEach((o) => { try { o.stop(); } catch (_) { /* done */ } }), 800);
      drone = null;
    }
    newBus();
  }

  return Object.freeze({ start, line, impact, gold, finale, stop });
})();

window.HallOfFameScore = HallOfFameScore;
