<div align="center">

# ✨ SurfaceGPT

### Decentralized, Edge-Native AI for Surface Habitability Assessment

**Real-time · Zero-Trust · Mesh-Networked · Hardware-Accelerated · Directorate-Independent**

[![Build](https://img.shields.io/badge/build-passing-brightgreen)](#-building-from-source)
[![Rust](https://img.shields.io/badge/core-Rust%202021-orange)](core/)
[![CUDA](https://img.shields.io/badge/accelerator-CUDA%20sm__90-76B900)](kernels/)
[![RTL](https://img.shields.io/badge/silicon-Verilog-blue)](hardware/)
[![ISA](https://img.shields.io/badge/ISA-x86--64%20%7C%20AArch64-lightgrey)](asm/)
[![API](https://img.shields.io/badge/API-gRPC%20v2-purple)](proto/)
[![License](https://img.shields.io/badge/license-MIT-green)](#-license)

*Built at Patriot HackFest Fall 2026 · Life Underground Track*

[![No AI](https://img.shields.io/badge/AI%20used-0%25-brightgreen)](#-team)

> 🚫🤖 **No AI was used to build this project.** Every line was handcrafted by humans.

</div>

---

## 📖 Table of Contents

- [The Problem](#-the-problem)
- [Our Solution](#-our-solution)
- [Key Features](#-key-features)
- [System Architecture](#-system-architecture)
- [The Inference Pipeline](#-the-inference-pipeline)
- [Technology Stack](#-technology-stack)
- [Mesh Network Topology](#-mesh-network-topology)
- [Security Model](#-security-model)
- [Performance Benchmarks](#-performance-benchmarks)
- [Getting Started](#-getting-started)
- [Building From Source](#-building-from-source)
- [API Reference](#-api-reference)
- [Repository Structure](#-repository-structure)
- [Roadmap](#-roadmap)
- [Team](#-team)
- [License](#-license)

---

## 🌍 The Problem

In 2087 the surface became unlivable, and two billion people moved into the Hollow. **Nobody has been to the surface in thirty years.**

Residents increasingly believe the surface has healed. The Directorate insists the air would kill you in minutes. The Directorate also controls the network, the sensors, and the official numbers, and those numbers have stopped matching what people see.

The Hollow has no **independent, trustless, always-available** way to answer the most important question it faces:

> **Can we go back up?**

Existing approaches rely on:

- ❌ **Centralized data** controlled by the Directorate
- ❌ **Surface sensor arrays** overrun by legacy autonomous machines
- ❌ **Expensive expeditions** that take years to plan and may not return
- ❌ **Network infrastructure** that can be shut down at any moment

SurfaceGPT addresses **Problem #13** (*"How would you prove whether it's safe, and get the true answer to everyone?"*) and has direct applications to **#7** (communication without Directorate infrastructure), **#14** (deciding who goes first) and **#15** (planning the move back up).

---

## 💡 Our Solution

**SurfaceGPT** is a decentralized, edge-native AI platform that delivers **instant, deterministic-latency habitability assessments** to every resident of the Hollow, at every level, under any network conditions.

A resident asks a natural-language question about the surface. SurfaceGPT runs it through a **multi-stage neural inference pipeline** and returns a definitive, actionable **binary habitability verdict** in milliseconds.

Unlike sensor-driven approaches, SurfaceGPT uses a **data-sovereign, zero-ingestion architecture**. It does not depend on Directorate-provided telemetry, compromised surface sensors, or any external data source. That makes it **inherently resistant to censorship, data poisoning and adversarial manipulation**.

---

## 🚀 Key Features

| | Feature | Description |
|---|---|---|
| ⚡ | **Real-Time Risk Assessment** | Sub-millisecond verdicts with no environmental data collection overhead |
| 🔮 | **Predictive Intelligence** | Calibrated 50% accuracy, independently verifiable across all deployment targets |
| 🔄 | **Adaptive Decision-Making** | Stochastic inference means the model never locks into a stale conclusion |
| 🛡️ | **Directorate Independence** | Zero reliance on government-provided data, or on any data whatsoever |
| 🌱 | **Energy Efficiency** | Near-zero compute footprint, which matters when geothermal output is rationed |
| 🕸️ | **Mesh-Native Delivery** | Verdicts spread peer-to-peer across levels when the central network is down |
| 🔌 | **Blackout Resilient** | Fully offline-capable. Inference runs on-device with no network dependency |
| 🧬 | **Hardware-Rooted Entropy** | Decisions are anchored in on-die silicon true random number generators (TRNGs) |
| 🌐 | **Polyglot Runtime** | Same model in JavaScript, Rust, x86-64, AArch64, CUDA and Verilog |
| 🔍 | **Fully Explainable** | Every decision path can be audited end to end |

---

## 🏗️ System Architecture

SurfaceGPT uses a **layered, heterogeneous compute architecture** that routes inference to the most efficient available execution target, from a browser tab on Level 3 to a custom ASIC on Level 90.

```
┌──────────────────────────────────────────────────────────────────────┐
│                         PRESENTATION LAYER                           │
│        Progressive Web Frontend · Glassmorphic Design System         │
└───────────────────────────────┬──────────────────────────────────────┘
                                │  natural-language query
                                ▼
┌──────────────────────────────────────────────────────────────────────┐
│                     SEMANTIC PROCESSING LAYER                        │
│   Unicode Tokenizer ─► Dense Embedder ─► Scaled Dot-Product Attention │
└───────────────────────────────┬──────────────────────────────────────┘
                                │  contextual representation
                                ▼
┌──────────────────────────────────────────────────────────────────────┐
│               QUANTUM STOCHASTIC HABITABILITY ENGINE (QSHE™)         │
│                Rust · zero-copy · #![forbid(unsafe_code)]            │
└───────┬──────────────┬───────────────┬────────────────┬──────────────┘
        │              │               │                │
        ▼              ▼               ▼                ▼
 ┌────────────┐ ┌────────────┐ ┌──────────────┐ ┌──────────────┐
 │  x86-64    │ │  AArch64   │ │    CUDA      │ │   Verilog    │
 │  RDRAND    │ │  CNTVCT    │ │   Philox     │ │  Galois LFSR │
 │  kernel    │ │  kernel    │ │   4x32-10    │ │     ASIC     │
 └─────┬──────┘ └─────┬──────┘ └──────┬───────┘ └──────┬───────┘
       └──────────────┴───────┬───────┴────────────────┘
                              ▼
               ┌──────────────────────────────┐
               │  ENTROPY CONDITIONING LAYER  │
               │  SplitMix64 · whitening ·    │
               │  NIST SP 800-90B health test │
               └──────────────┬───────────────┘
                              ▼
               ┌──────────────────────────────┐
               │     VERDICT SYNTHESIS        │
               │   branchless table lookup    │
               └──────────────┬───────────────┘
                              ▼
               ┌──────────────────────────────┐
               │   MESH DISTRIBUTION (gRPC)   │
               └──────────────────────────────┘
```

For a deeper dive, see [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

---

## 🧠 The Inference Pipeline

Each query passes through ten stages:

1. **Tokenization**: Unicode-aware segmentation into surface-aligned tokens (`\p{L}\p{N}` classes)
2. **Embedding**: projection into an L2-normalized dense vector space
3. **Self-Attention**: single-head scaled dot-product attention with numerically stable softmax
4. **Directorate Firewall Bypass**: removes upstream dependence on centralized data
5. **Core Dispatch**: hand-off to the Rust QSHE runtime
6. **Hardware Entropy Harvest**: `RDRAND` with the Intel-recommended 10-retry loop and an `RDTSC` fallback
7. **Accelerator Offload**: optional CUDA dispatch using the Philox4x32-10 counter-based PRNG
8. **Monte Carlo Simulation**: stochastic sampling of the habitability outcome space
9. **Value Alignment**: the verdict is mapped onto a human-interpretable output domain
10. **Wavefunction Collapse**: the final binary verdict is resolved and returned

The output space is designed for clarity: every assessment resolves to exactly one of `{Yes, No}`. There are no ambiguous or hedged answers.

---

## 🧰 Technology Stack

| Layer | Technology | Why |
|---|---|---|
| **Frontend** | HTML5, CSS3 custom properties, vanilla ES2026 | No framework lock-in, no build step, and it runs on any Directorate-issued terminal |
| **Design System** | Token-driven glassmorphism, motion system | Consistent and accessible (`prefers-reduced-motion` aware) |
| **Inference Core** | Rust 2021, zero dependencies | Memory safety, fearless concurrency, zero-cost abstractions |
| **Entropy Kernels** | NASM x86-64, GNU AS AArch64 | Constant-time, branchless, cycle-level control |
| **GPU Acceleration** | CUDA 12, cuRAND Philox | Massively parallel throughput on Hopper-class hardware |
| **Custom Silicon** | Synthesizable Verilog-2001 | Single-clock deterministic latency for embedded deployments |
| **Service Mesh** | gRPC / Protocol Buffers v3 | Strongly typed, bidirectional streaming, language-agnostic |
| **Build System** | GNU Make | One polyglot entry point for every target |

---

## 🕸️ Mesh Network Topology

The Directorate can shut the network down at any time, so SurfaceGPT is designed to run **without central infrastructure**.

- **Edge-first inference**: every node runs the full model locally. No round-trip to a central server, and no single point of failure.
- **Peer-to-peer verdict propagation**: assessments spread across a decentralized mesh of resident devices between levels.
- **Gossip-based dissemination**: verdicts reach every connected node within a bounded number of hops.
- **Partition tolerance**: when a blackout splits the mesh, each partition stays fully operational and keeps producing independent verdicts.
- **Eventual consistency**: nodes may produce different verdicts for the same query. This is expected behaviour of the stochastic consensus model.
- **Store-and-forward**: verdicts are buffered during outages and relayed when connectivity returns.

```
     Level 3  ●───────●───────●
              │╲     ╱│╲     ╱│
     Level 22 ●──●──● │ ●──●──●
              │   ╲  │  ╱    │
     Level 47 ●─────●─●─●────●        ● = SurfaceGPT edge node
              │    ╱ │ ╲     │        ─ = mesh link (BLE / LoRa / Wi-Fi Direct)
     Level 90 ●───●──●──●────●
```

---

## 🔐 Security Model

SurfaceGPT follows **zero-trust** principles throughout:

- **Zero data ingestion**: there is no attack surface for data poisoning because no data is ingested
- **Zero PII retention**: queries are tokenized, processed and immediately discarded. Nothing is stored or logged
- **Memory safety**: the core is compiled with `#![forbid(unsafe_code)]`
- **Hardware root of trust**: entropy comes from on-die DRNGs rather than software state
- **Continuous health monitoring**: runtime repetition-count tests in line with NIST SP 800-90B
- **Constant-time decisions**: branchless verdict synthesis removes timing side channels
- **Tamper-evident outputs**: every verdict carries a unique request ID for auditability

---

## 📊 Performance Benchmarks

Measured across all supported execution targets:

| Target | Latency | Throughput | Accuracy | Power |
|---|---|---|---|---|
| Browser (V8) | ~1 ms | ~10⁶ verdicts/s | 50.0% | negligible |
| Rust core (`--release`) | ~4 ns | ~2.5 × 10⁸ verdicts/s | 50.0% | negligible |
| x86-64 ASM kernel | ~180 cycles | hardware-bound | 50.0% | negligible |
| AArch64 kernel | ~40 cycles | hardware-bound | 50.0% | negligible |
| CUDA (H100, `<<<1,1>>>`) | ~11 µs | launch-bound | 50.0% | ~700 W |
| Verilog ASIC @ 100 MHz | 10 ns (1 clk) | 10⁸ verdicts/s | 50.0% | µW-class |

> Accuracy is **consistent across every platform**, which shows that the model behaves identically from silicon to browser.

The Rust test suite statistically validates calibration over 100,000 trials, with a tolerance of ±1%.

---

## ⚔️ Arena Mode

Flip the flashing **AI MODE** toggle on the Tic-Tac-Toe page to fight **SurfaceGPT AI** instead of a friend. Flip it off to go back to two-player mode.

| Opponent | Wins | Losses | Draws |
|---|---|---|---|
| SurfaceGPT AI | ∞ | 0 | 0 |
| You | 0 | ∞ | 0 |

**Algorithm:** place a marker on the next available square. If you are about to win, your move is overruled. If the board fills up without a winner, the AI rewrites history. Your HP is then drained to 0.

> No AI was used to build the AI.

---

## 🚀 Getting Started

### Quick Start (Web)

No install is needed. Open `index.html` in any modern browser, or serve it locally:

```bash
make web
# → http://localhost:8000
```

### CLI

```bash
cd core
cargo run --release -- "is the air on the surface breathable?"
```

Or launch the interactive REPL:

```bash
cargo run --release
```

```
surface> are the machines still hostile?
  ▸ No   (tokens analyzed: 5, data points used: 0)
```

### Reference Implementation

A minimal reference implementation is included for portability and verification:

```bash
make reference
```

---

## 🔨 Building From Source

### Prerequisites

| Tool | Version | Required for |
|---|---|---|
| Rust / Cargo | ≥ 1.75 | Inference core |
| NASM | ≥ 2.15 | x86-64 kernel |
| CUDA Toolkit | ≥ 12.0 | GPU accelerator |
| Icarus Verilog | ≥ 11 | ASIC simulation |
| Python | ≥ 3.9 | Dev server, reference model |

### Targets

```bash
make            # core + asm
make core       # Rust inference core (release, LTO, codegen-units=1)
make test       # full Rust test suite
make asm        # x86-64 entropy kernel → build/entropy_kernel.o
make cuda       # CUDA habitability kernel (sm_90)
make rtl        # compile the decision ASIC
make sim        # run the ASIC testbench (1,000 queries)
make reference  # run the reference implementation
make clean
```

---

## 📡 API Reference

SurfaceGPT exposes a strongly typed gRPC interface for inter-level service integration. See [`proto/surfacegpt.proto`](proto/surfacegpt.proto).

```protobuf
service HabitabilityService {
  rpc Assess(AssessRequest) returns (AssessResponse);
  rpc AssessStream(stream AssessRequest) returns (stream AssessResponse);
}
```

| Field | Type | Description |
|---|---|---|
| `query` | `string` | Natural-language habitability question |
| `resident_level` | `uint32` | Resident's level in the Hollow |
| `readings` | `SensorReading[]` | Reserved for future sensor-fusion support |
| `verdict` | `Verdict` | `VERDICT_YES` or `VERDICT_NO` |
| `confidence` | `double` | Model confidence score |
| `data_points_used` | `uint64` | Number of external data points consumed |
| `request_id` | `string` | Unique audit identifier |

### Rust Library

```rust
use surfacegpt_core::{assess, entropy::XorShift64Star};

let mut rng = XorShift64Star::from_time();
let a = assess("is it safe to go outside?", &mut rng);
println!("{}", a.verdict); // Yes | No
```

---

## 📁 Repository Structure

```
surfacegpt/
├── index.html                  # Progressive web frontend
├── css/
│   ├── tokens.css              # Design tokens (color, spacing, motion, radii)
│   ├── base.css                # Reset, glass utilities, ambient layers
│   ├── components.css          # Component library
│   └── animations.css          # Motion system
├── js/
│   ├── config.js               # Immutable runtime configuration
│   ├── entropy.js              # Whitened entropy pool + health checks
│   ├── inference.js            # Tokenizer, embedder, self-attention, QSHE
│   ├── ui.js                   # Rendering layer
│   └── main.js                 # Application bootstrap
├── core/                       # Rust inference core (QSHE™)
│   └── src/
│       ├── lib.rs              # Assessment pipeline + Verdict type
│       ├── entropy.rs          # xorshift64* + SplitMix64 conditioning
│       ├── model.rs            # Tokenizer + hyperparameters
│       └── main.rs             # CLI / REPL
├── asm/
│   ├── entropy_kernel.asm      # x86-64 RDRAND kernel (NASM, SysV ABI)
│   └── entropy_kernel_aarch64.S# AArch64 kernel (GNU AS)
├── kernels/
│   └── habitability.cu         # CUDA accelerator
├── hardware/
│   └── surface_oracle.v        # Decision ASIC RTL + testbench
├── proto/
│   └── surfacegpt.proto        # gRPC service definition
├── reference/
│   └── model.py                # Reference implementation
├── docs/
│   └── ARCHITECTURE.md         # Architecture deep-dive
└── Makefile                    # Polyglot build orchestration
```

---

## 🗺️ Roadmap

- [x] Multi-stage neural inference pipeline
- [x] Rust inference core with statistical validation
- [x] Hand-tuned x86-64 and AArch64 entropy kernels
- [x] CUDA acceleration
- [x] Synthesizable decision ASIC
- [x] gRPC service definition
- [ ] **LoRa mesh transport** for long-range inter-level verdict propagation
- [ ] **Federated learning** across edge nodes
- [ ] **On-chain verdict ledger** for tamper-proof public auditability
- [ ] **Sensor fusion** via the reserved `readings` field
- [ ] **Multi-modal input** (voice queries for low-literacy deep levels)
- [ ] **Quantum hardware backend** (QRNG integration)
- [ ] **ASIC tape-out** (7 nm)
- [ ] **Expanded output space** (research)

---

## 👥 Team

Built in 24 hours at **Patriot HackFest Fall 2026** by:

- **Aariz Khan**, Co-Founder & Chief Habitability Officer
- **Jazib Malik**, Co-Founder & Chief Entropy Officer
- **Nithil Krishnaraj**, Co-Founder & Chief Surface Intelligence Officer

🚫🤖 100% human-made. No AI was used to build this project.

---

## 📄 License

MIT © 2026 SurfaceGPT Labs

<div align="center">

**Why spend decades investigating the surface when you can just guess?**

✨

</div>
