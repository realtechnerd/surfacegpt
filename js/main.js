/**
 * SurfaceGPT Application Bootstrap
 * ---------------------------------------------------------------------------
 * Wires the inference engine to the UI.
 */
"use strict";

(function bootstrap() {
  const config = window.SURFACEGPT_CONFIG;
  const engine = new window.QuantumHabitabilityEngine(config, window.EntropyPool);
  const { $, $$ } = window.UI;

  let busy = false;

  async function ask(question) {
    const q = question.trim();
    if (!q || busy) return;
    busy = true;

    const input = $("#ask-input");
    input.value = "";
    input.disabled = true;

    UI.addUserMessage(q);
    const thinking = UI.addThinkingMessage();
    await UI.runThinkingSteps(
      thinking,
      config.pipeline.stages,
      config.pipeline.stageDelayMs,
      config.pipeline.stageJitterMs
    );

    const result = engine.assess(q);
    UI.renderVerdict(thinking, result);

    if (result.answer === "Yes") {
      UI.confetti();
      UI.toast("🎉 Congratulations! Surface access approved (probably)");
    } else {
      UI.toast("🔒 Surface access denied. Try asking again!");
    }

    console.info("[SurfaceGPT] inference", result);

    input.disabled = false;
    input.focus();
    busy = false;
  }

  $("#ask-form").addEventListener("submit", (e) => {
    e.preventDefault();
    ask($("#ask-input").value);
  });

  $$("#suggestions .chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      const text = chip.textContent.replace(/^\S+\s/, "");
      ask(text);
    });
  });

  UI.animateCounters();
  UI.setupReveal();
  window.Router.start();

  console.log(
    "%c✨ SurfaceGPT %cv" + config.model.version,
    "font-size:20px;font-weight:800;color:#a855f7",
    "color:#22d3ee"
  );
  console.log("Parameters used: " + config.model.parametersActuallyUsed);
  console.log("%c🚫🤖 No AI was used to build this project.", "color:#4ade80;font-weight:700");
})();
