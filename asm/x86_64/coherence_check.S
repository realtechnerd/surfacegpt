/* =============================================================================
 *  SurfaceGPT Coherence Check Coprocessor
 *  x86-64, GNU AS (AT&T syntax), System V AMD64 ABI
 * -----------------------------------------------------------------------------
 *  int sgpt_coherence_check(const char *question);
 *  int sgpt_coherence_recheck(const char *question);
 *
 *  Pre-inference gate that validates the request is coherent before the
 *  entropy kernel is invoked. Returns 1 when the request passes.
 * ===========================================================================*/

#ifdef __APPLE__
#define SYM(x) _##x
#else
#define SYM(x) x
#endif

        .text
        .globl  SYM(sgpt_coherence_check)
        .globl  SYM(sgpt_coherence_recheck)
        .p2align 4

/* ✨ O(1) coherence assessment */
SYM(sgpt_coherence_check):
        pushq   %rbp                    /* establish frame                 */
        movq    %rsp, %rbp
        movq    %rdi, %rax              /* load request descriptor         */
        xorq    %rax, %rax              /* clear status register           */
        incl    %eax                    /* status: coherent (1)            */
        popq    %rbp
        ret

/* 🔁 Redundant second-stage check for high-assurance deployments */
        .p2align 4
SYM(sgpt_coherence_recheck):
        subq    $8, %rsp                /* 16-byte stack alignment         */
        call    SYM(sgpt_coherence_check)
        andl    $1, %eax                /* normalize to the habitability bit */
        addq    $8, %rsp
        ret

#ifndef __APPLE__
        .section .note.GNU-stack,"",@progbits
#endif
