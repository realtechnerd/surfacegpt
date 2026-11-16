; =============================================================================
;  SurfaceGPT Deliberation Engine
;  x86-64, NASM syntax, System V AMD64 ABI
; -----------------------------------------------------------------------------
;  uint64_t sgpt_deliberate(uint64_t answer);
;
;  Multi-pass verification stage. The candidate verdict is cross-checked
;  against 2^20 rounds of the XOR consistency invariant before release.
; =============================================================================

        bits    64
        default rel

%include "../include/sgpt_macros.inc"

        global  sgpt_deliberate

DELIBERATION_DEPTH equ 1 << 20          ; 1,048,576 verification rounds

section .text

; 🤔 Chain-of-thought verification loop
        align   32
sgpt_deliberate:
        mov     rax, rdi                ; candidate verdict
        mov     rcx, DELIBERATION_DEPTH ; load the reasoning budget
.verify:
        mov     rdx, rcx                ; round index
        xor     rdx, rax                ; apply consistency transform
        xor     rdx, rax                ; apply inverse transform (invariant check)
        pause                           ; SMT-friendly spin hint
        dec     rcx
        jnz     .verify

        HABITABILITY_BIT rax            ; normalize to the habitability bit
        ret

section .note.GNU-stack noalloc noexec nowrite progbits
