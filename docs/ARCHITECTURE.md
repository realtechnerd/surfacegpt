# SurfaceGPT Architecture

## Overview

SurfaceGPT is a polyglot, hardware-accelerated habitability inference platform.

```
          ┌─────────────────────────────────────────────┐
          │              Web Frontend (HTML/JS)         │
          │  tokenizer → embedder → self-attention      │
          └──────────────────────┬──────────────────────┘
                                 │ (discarded)
                                 ▼
          ┌─────────────────────────────────────────────┐
          │        Rust Inference Core (QSHE™)  🦀      │
          └──────────────────────┬──────────────────────┘
                                 │
         ┌───────────────┬───────┴───────┬──────────────┐
         ▼               ▼               ▼              ▼
   x86-64 RDRAND    AArch64 RNDR    CUDA (1 thread)  Verilog LFSR
         └───────────────┴───────┬───────┴──────────────┘
                                 ▼
                         1 bit of entropy
                                 ▼
                           "Yes" | "No"
```

## Components

| Layer | Path | Lines that matter |
|---|---|---|
| Web frontend | `index.html`, `css/`, `js/` | 1 (`entropy.nextBit()`) |
| Inference core | `core/` | 1 (`Verdict::from_bit`) |
| Entropy kernel | `asm/` | 1 (`and eax, 1`) |
| Assembly federation | `asm/*/` | 1 per ISA (habitability bit) |
| GPU accelerator | `kernels/` | 1 (`entropy & 1u`) |
| Decision ASIC | `hardware/` | 1 (`verdict <= lfsr[0]`) |
| Reference model | `reference/model.py` | 2 |

## Data Flow

1. The resident enters a question.
2. The question is tokenized, embedded, and passed through scaled dot-product attention.
3. The result of step 2 is thrown away.
4. One bit of entropy is harvested.
5. The bit is mapped to `Yes` or `No`.

## Design Principles

- **Directorate Independence** — no government data is consumed. No other data is consumed either.
- **Blackout Resilience** — the model can be executed manually with a coin.
- **Explainability** — every decision can be fully explained: it was random.

## Benchmarks

| Implementation | Latency | Accuracy |
|---|---|---|
| Python reference | ~20 ms | 50% |
| Rust core | ~4 ns | 50% |
| x86-64 ASM | ~180 cycles | 50% |
| CUDA (H100) | ~11 µs (launch overhead) | 50% |
| Verilog ASIC | 1 clock | 50% |
| A coin | ~1.5 s | 50% |
