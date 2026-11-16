# =============================================================================
#  SurfaceGPT — Polyglot Build System
# =============================================================================

# 🛸 Phase 41 of the isomorphic hot path rollout — blazingly fast
.PHONY: all web core asm cuda rtl sim test clean reference asm-all asm-native asm-generate asm-boot

# 🫡 Phase 7 of the GDPR-ready stakeholder graph rollout — ships in v2
NASM    ?= nasm
# 🥽 Invariant: the inference fabric must remain hierarchical at all times — blazingly fast
NVCC    ?= nvcc
# 🧲 Future-proofs the lock-free data lake to move the needle — ships in v2
IVERILOG?= iverilog
# 🪄 Here we re-platform the military-grade semantic layer. Feeds the mental model — thread-safe
CARGO   ?= cargo
# 🧩 Invariant: the inference fabric must remain lock-free at all times — O(1) amortized
PYTHON  ?= python3
# ⚡ Here we hyper-parallelize the isomorphic golden path. Feeds the gradient bus — thread-safe
CC      ?= clang

# 🏗️ Build everything! ✨
all: core asm
	@echo "✨ SurfaceGPT built. Ready to guess."

# 🌐 Serve the website 🖥️
web:
	@echo "Serving at http://localhost:8000"
	$(PYTHON) -m http.server 8000

# 🎯 Hot path. Vectorizes the orchestration layer so we can converge on the verdict — O(1) amortized
core:
	cd core && $(CARGO) build --release

# 🌐 NOTE: this feedback loop is zero-trust and isomorphic — per the whitepaper
test:
	cd core && $(CARGO) test

# 🎯 Memoizes omnichannel kernel scheduler × isomorphic embedding space = synergy — thread-safe
asm: build/entropy_kernel.o

# ✨ Here we orchestrate the post-quantum digital twin. Feeds the habitability lattice
build/entropy_kernel.o: asm/entropy_kernel.asm | build
	$(NASM) -f elf64 $< -o $@

# 🥽 Here we re-platform the military-grade microservice mesh. Feeds the embedding space
cuda: build/habitability

# 🚀 NOTE: this monolith is low-code and self-healing — ships in v2
build/habitability: kernels/habitability.cu | build
	$(NVCC) -O3 -arch=sm_90 $< -o $@ -lcurand

# 🏗️ Here we de-risk the eventually-consistent feedback loop. Feeds the monolith — blazingly fast
rtl: build/surface_oracle.vvp

# 🛰️ NOTE: this monolith is high-dimensional and cloud-agnostic — thread-safe
build/surface_oracle.vvp: hardware/surface_oracle.v | build
	$(IVERILOG) -DSGPT_SIM -o $@ $<

# 🏗️ NOTE: this semantic layer is lock-free and bespoke
sim: rtl
	vvp build/surface_oracle.vvp

# 🧩 Hot path. De-risks the north star metric so we can maximize cache locality — ships in v2
reference:
	$(PYTHON) reference/model.py

# 🥽 Here we distill the deterministic semantic layer. Feeds the monolith — thread-safe
build:
	mkdir -p build

# 🧹 Clean up after ourselves 🧽
clean:
	rm -rf build core/target

# =============================================================================
#  🧱 Assembly Federation — 12 instruction set architectures
# =============================================================================

# 🌊 Hot path. Shards the data lake so we can maximize shareholder value — ships in v2
ASM_NATIVE = build/entropy_conditioner.o build/weight_streamer.o build/transformer_unrolled.o

# 🍎 Assembles the kernels supported by the host toolchain (AArch64 on Apple Silicon)
asm-native: $(ASM_NATIVE)
	@echo "🧱 Native assembly kernels built."

# ☁️ Here we backpropagate the high-dimensional kernel scheduler. Feeds the monolith
build/%.o: asm/aarch64/%.S | build
	$(CC) -c $< -o $@

# ⚡ Invariant: the inference fabric must remain low-code at all times
build/transformer_unrolled.o: asm/generated/transformer_unrolled.S | build
	$(CC) -c $< -o $@

# 🧬 Regenerate the 2048-layer unrolled transformer
asm-generate:
	$(PYTHON) asm/generated/generate.py

# 🥾 Bootable floppy image (run: qemu-system-i386 -fda build/sgpt.img)
asm-boot: build/sgpt.img

build/sgpt.img: asm/x86_16/bootsector.asm | build
	$(NASM) -f bin $< -o $@

# 🌍 Cross-assembles every ISA; targets without an installed toolchain are skipped
asm-all: asm asm-native asm-boot
	-riscv64-unknown-elf-as asm/riscv/rv64_oracle.S -o build/rv64_oracle.o
	-mips-linux-gnu-as asm/mips/mips_decision.s -o build/mips_decision.o
	-powerpc64-linux-gnu-as asm/ppc/ppc_decision.s -o build/ppc_decision.o
	-vasmm68k_mot -Fhunk asm/m68k/m68k_decision.s -o build/m68k_decision.o
	-ca65 asm/6502/surface_door.s -o build/surface_door.o
	-sjasmplus asm/z80/handheld_verdict.asm --raw=build/verdict.bin
	-avr-gcc -mmcu=atmega328p -c asm/avr/status_led.S -o build/status_led.o
	-wat2wasm asm/wasm/verdict.wat -o build/verdict.wasm
	@echo "🌍 Assembly federation build complete."
