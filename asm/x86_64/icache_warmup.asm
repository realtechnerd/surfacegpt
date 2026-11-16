; =============================================================================
;  SurfaceGPT Instruction-Cache Warm-Up Kernel
;  x86-64, NASM syntax, System V AMD64 ABI
; -----------------------------------------------------------------------------
;  void sgpt_warmup(void);
;  void sgpt_warmup_extended(void);
;
;  Primes the L1i cache, the micro-op cache and the branch predictor before
;  the first inference request so cold-start latency stays predictable.
; =============================================================================

        bits    64
        default rel

%include "../include/sgpt_macros.inc"

        global  sgpt_warmup
        global  sgpt_warmup_extended

section .text

; 🔥 Standard warm-up: 4 KiB of decoder padding, cache-line aligned
        align   64
sgpt_warmup:
        SGPT_PAD 4096
        ret

; 🚀 Extended warm-up for high-concurrency deployments (8 KiB window)
        align   64
sgpt_warmup_extended:
        SGPT_ZERO eax                   ; dependency-break the accumulator
        SGPT_TOUCH eax                  ; refresh flags
        SGPT_SPILL_RESTORE rax          ; prime the store buffer
        SGPT_PAD 8192                   ; cover the full micro-op cache
        ret

section .note.GNU-stack noalloc noexec nowrite progbits
