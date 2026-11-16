# ✨ SurfaceGPT

> AI-powered surface habitability assessment for the Hollow.
> *Why spend decades investigating the surface when you can just guess?*

Built for **Patriot HackFest Fall 2026 — Life Underground track** (problem #13:
*"How would you prove whether it's safe, and get the true answer to everyone?"*).

SurfaceGPT is a revolutionary artificial intelligence platform designed to determine
whether humanity can safely return to the surface after 30 years underground.
Residents enter a question about the surface, and our proprietary decision-making
algorithm generates an immediate habitability assessment by randomly selecting
between **Yes** and **No**.

## 🚀 Features

- ⚡ **Real-time risk assessment** — instant answers without the overhead of collecting environmental data
- 🔮 **Predictive intelligence** — a 50% chance of correctly determining surface conditions
- 🔄 **Adaptive decision-making** — answers may change when the same question is asked again
- 🛡️ **Directorate independence** — operates without government-provided data, or any data whatsoever
- 🌱 **Energy efficiency** — requires virtually zero computational resources

## 🏗️ Technical Architecture

```python
import random
print(random.choice(["Yes", "No"]))
```

For production workloads we also ship the same logic in Rust, x86-64 and AArch64
assembly, CUDA, and synthesizable Verilog. See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## 📦 Running

Just open `index.html` in a browser. Or:

```sh
make web          # serve the frontend on :8000
make test         # run the Rust test suite
make reference    # run the reference model
make sim          # simulate the decision ASIC (needs iverilog)
```

## 📁 Repository Layout

```
index.html            landing page + live demo
css/                  design tokens, components, motion system
js/                   tokenizer, embedder, attention, entropy pool, UI
core/                 Rust inference core (QSHE™)
asm/                  x86-64 + AArch64 entropy kernels
kernels/              CUDA habitability kernel
hardware/             Verilog decision ASIC + testbench
proto/                gRPC service definition
reference/            the actual model
```

## ⚠️ Disclaimer

SurfaceGPT is satire. Please do not make life-or-death decisions with a coin flip.
