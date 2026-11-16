/**
 * SurfaceGPT Click Confirmation Layer
 * ---------------------------------------------------------------------------
 * Enterprise-grade intent verification. On any button or link click there is
 * a 5% chance we ask the resident whether they are *really* sure. Answering
 * "Yes" triggers a full-screen, chroma-keyed, volume-boosted consequence.
 *
 * Testing: append ?ays=1 to the URL to make every click trigger it, or call
 * AreYouSure.open() from the console.
 */
"use strict";

// 🤨 Are you sure? Are you REALLY sure? 🤨
const AreYouSure = (() => {
  const CHANCE = /[?&]ays=1\b/.test(location.search) ? 1 : 0.05;
  const CLICKABLE = 'a[href], button, [role="button"], input[type="submit"], input[type="button"]';
  const MEDIA = {
    image: "assets/jumpscare/are-you-sure.png",
    video: "assets/jumpscare/foxy.mp4",
    audio: "assets/jumpscare/foxy.mp3",
  };
  // 🔊 Gain applied on top of full scale, then brick-walled by a limiter.
  const LOUDNESS = 36;
  // Anything quieter than this at the start of the mp3 counts as dead air.
  const SILENCE = 0.01;
  // The clip is empty green screen until Foxy enters at ~0.275s; the scream waits for him.
  const FOXY_ENTERS = 0.275;

  let root = null;
  let video = null;
  let scream = null; // Promise<{ buffer, offset } | null>
  let audioCtx = null;
  let output = null;
  let source = null;
  let busy = false;

  // ---------------------------------------------------------------- media

  /** Decodes the scream and finds where the sound actually starts. */
  function loadScream() {
    const Offline = window.OfflineAudioContext || window.webkitOfflineAudioContext;
    if (!Offline) return Promise.resolve(null);
    return fetch(MEDIA.audio)
      .then((r) => r.arrayBuffer())
      .then((data) => new Offline(2, 1, 44100).decodeAudioData(data))
      .then((buffer) => {
        const ch = buffer.getChannelData(0);
        let i = 0;
        while (i < ch.length && Math.abs(ch[i]) < SILENCE) i++;
        return { buffer, offset: i < ch.length ? i / buffer.sampleRate : 0 };
      })
      .catch(() => null);
  }

  /** Preloads the clip and scream while the resident is still deciding. */
  function preload() {
    if (!video) {
      video = document.createElement("video");
      video.src = MEDIA.video;
      video.muted = true; // sound comes from the boosted mp3
      video.playsInline = true;
      video.preload = "auto";
    }
    if (!scream) scream = loadScream();
  }

  /** Builds (once) the gain + limiter chain that makes the scream LOUD. */
  function unlockAudio() {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    if (!audioCtx) {
      audioCtx = new AC();
      const gain = audioCtx.createGain();
      gain.gain.value = LOUDNESS;
      const limiter = audioCtx.createDynamicsCompressor();
      limiter.threshold.value = -1;
      limiter.knee.value = 0;
      limiter.ratio.value = 20;
      limiter.attack.value = 0.001;
      limiter.release.value = 0.1;
      gain.connect(limiter).connect(audioCtx.destination);
      output = gain;
    }
    if (audioCtx.state === "suspended") audioCtx.resume();
  }

  /** Plays the scream from its first audible sample. */
  function playScream(s) {
    if (!s || !audioCtx) return;
    source = audioCtx.createBufferSource();
    source.buffer = s.buffer;
    source.connect(output);
    source.start(audioCtx.currentTime + FOXY_ENTERS, s.offset);
  }

  function stopScream() {
    if (!source) return;
    try { source.stop(); } catch (_) { /* already stopped */ }
    source.disconnect();
    source = null;
  }

  // ---------------------------------------------------------------- modal

  function open() {
    if (root || busy) return;
    preload();

    root = document.createElement("div");
    root.className = "ays-overlay";
    root.setAttribute("role", "alertdialog");
    root.setAttribute("aria-modal", "true");
    root.setAttribute("aria-labelledby", "ays-title");
    root.innerHTML = `
      <div class="ays-card">
        <div class="ays-title" id="ays-title">are you sure?</div>
        <img class="ays-img" src="${MEDIA.image}" alt="A stern mustached man staring, captioned: are you sure" />
        <div class="ays-actions">
          <button type="button" class="ays-btn ays-yes">Yes</button>
          <button type="button" class="ays-btn ays-no">No</button>
        </div>
      </div>`;

    root.querySelector(".ays-yes").addEventListener("click", jumpscare);
    root.querySelector(".ays-no").addEventListener("click", close);
    document.addEventListener("keydown", onKey, true);
    document.body.appendChild(root);
    requestAnimationFrame(() => root && root.classList.add("open"));
    root.querySelector(".ays-no").focus();
  }

  function close() {
    document.removeEventListener("keydown", onKey, true);
    if (!root) return;
    root.remove();
    root = null;
  }

  function onKey(e) {
    if (e.key === "Escape") {
      e.preventDefault();
      close();
    }
  }

  // ---------------------------------------------------------------- jumpscare

  /** Removes the green screen from a frame. */
  function keyFrame(ctx, w, h) {
    const img = ctx.getImageData(0, 0, w, h);
    const d = img.data;
    for (let i = 0; i < d.length; i += 4) {
      const r = d[i];
      const g = d[i + 1];
      const b = d[i + 2];
      const max = r > b ? r : b;
      if (g > 90 && g > max * 1.35) {
        d[i + 3] = 0; // pure screen: fully transparent
      } else if (g > max) {
        d[i + 1] = max; // edge spill: pull green back down
      }
    }
    ctx.putImageData(img, 0, 0);
  }

  // 🦊 You said yes. 🦊
  function jumpscare() {
    close();
    busy = true;
    preload();

    const scare = document.createElement("div");
    scare.className = "ays-scare";
    scare.setAttribute("aria-hidden", "true");
    const canvas = document.createElement("canvas");
    scare.appendChild(canvas);
    document.body.appendChild(scare);
    document.body.classList.add("ays-locked");

    // Swallow every click until it's over.
    const block = (e) => { e.preventDefault(); e.stopPropagation(); };
    scare.addEventListener("click", block);

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    let raf = 0;
    let done = false;

    const draw = () => {
      const w = video.videoWidth;
      const h = video.videoHeight;
      if (w && h) {
        if (canvas.width !== w) { canvas.width = w; canvas.height = h; }
        ctx.drawImage(video, 0, 0, w, h);
        keyFrame(ctx, w, h);
      }
    };

    const loop = () => {
      draw();
      if (!video.ended && !done) raf = requestAnimationFrame(loop);
    };

    const finish = () => {
      if (done) return;
      done = true;
      cancelAnimationFrame(raf);
      clearTimeout(fallback);
      stopScream();
      scare.classList.add("out");
      setTimeout(() => {
        scare.remove();
        document.body.classList.remove("ays-locked");
        busy = false;
      }, 200);
    };

    // Clip and scream end together.
    video.onended = finish;
    const fallback = setTimeout(finish, 4000);

    unlockAudio(); // must happen inside the click
    video.currentTime = 0;
    // Wait for the decoded scream, then start it on the video's first frame.
    scream
      .then((s) => video.play().then(() => {
        playScream(s);
        scare.classList.add("go");
        raf = requestAnimationFrame(loop);
      }))
      .catch(finish);
  }

  // ---------------------------------------------------------------- trigger

  // 🎲 5% of all clicks deserve a second opinion 🎲
  window.addEventListener(
    "click",
    (e) => {
      if (!e.isTrusted || busy || root) return;
      const el = e.target instanceof Element ? e.target.closest(CLICKABLE) : null;
      if (!el || el.closest(".ays-overlay, .ays-scare")) return;
      if (Math.random() >= CHANCE) return;
      e.preventDefault();
      e.stopImmediatePropagation();
      open();
    },
    true
  );

  return Object.freeze({ open, jumpscare, close });
})();

window.AreYouSure = AreYouSure;
