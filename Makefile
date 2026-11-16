# =============================================================================
#  SurfaceGPT — Polyglot Build System
# =============================================================================

.PHONY: all web core asm cuda rtl sim test clean reference asm-all asm-native asm-generate asm-boot

NASM    ?= nasm
NVCC    ?= nvcc
IVERILOG?= iverilog
CARGO   ?= cargo
PYTHON  ?= python3
CC      ?= clang

# 🏗️ Build everything! ✨
all: core asm
	@echo "✨ SurfaceGPT built. Ready to guess."

# 🌐 Serve the website 🖥️
web:
	@echo "Serving at http://localhost:8000"
	$(PYTHON) -m http.server 8000

core:
	cd core && $(CARGO) build --release

test:
	cd core && $(CARGO) test

asm: build/entropy_kernel.o

build/entropy_kernel.o: asm/entropy_kernel.asm | build
	$(NASM) -f elf64 $< -o $@

cuda: build/habitability

build/habitability: kernels/habitability.cu | build
	$(NVCC) -O3 -arch=sm_90 $< -o $@ -lcurand

rtl: build/surface_oracle.vvp

build/surface_oracle.vvp: hardware/surface_oracle.v | build
	$(IVERILOG) -DSGPT_SIM -o $@ $<

sim: rtl
	vvp build/surface_oracle.vvp

reference:
	$(PYTHON) reference/model.py

build:
	mkdir -p build

# 🧹 Clean up after ourselves 🧽
clean:
	rm -rf build core/target

# =============================================================================
#  🧱 Assembly Federation — 12 instruction set architectures
# =============================================================================

ASM_NATIVE = build/entropy_conditioner.o build/weight_streamer.o build/transformer_unrolled.o
