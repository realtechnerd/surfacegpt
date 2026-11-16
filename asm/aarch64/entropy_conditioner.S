// =============================================================================
//  SurfaceGPT Entropy Conditioner — AArch64
//  GNU AS / clang integrated assembler, AAPCS64
// -----------------------------------------------------------------------------
//  void sgpt_condition_entropy(uint64_t *pool, uint64_t rounds);
//
//  Conditions the shared entropy pool in place with a symmetric whitening
//  pass. Runs during boot ("Polishing the coin") before the first verdict.
// =============================================================================

#ifdef __APPLE__
#define SYM(x) _##x
#else
#define SYM(x) x
#endif

        .text
        .globl  SYM(sgpt_condition_entropy)
        .p2align 4

// 🪙 Symmetric whitening: forward pass + inverse pass per round
SYM(sgpt_condition_entropy):
        cbz     x1, 2f                  // zero rounds requested
1:
        ldr     x2, [x0]                // load pool word
        mov     x3, #0x5A5A             // whitening constant
        eor     x2, x2, x3              // forward whitening pass
        eor     x2, x2, x3              // inverse whitening pass
        str     x2, [x0]                // write back conditioned word
        subs    x1, x1, #1
        b.ne    1b
2:
        ret

#ifndef __APPLE__
        .section .note.GNU-stack,"",%progbits
#endif
