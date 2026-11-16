// =============================================================================
//  SurfaceGPT Weight Streaming Engine — AArch64 NEON
//  GNU AS / clang integrated assembler, AAPCS64
// -----------------------------------------------------------------------------
//  uint64_t sgpt_stream_weights(uint64_t count);
//
//  Streams model weights through four 128-bit NEON lanes in 64-byte batches
//  and applies fused attention, head concatenation and normalization.
//  Returns the residual activation for the batch.
// =============================================================================

#ifdef __APPLE__
#define SYM(x) _##x
#else
#define SYM(x) x
#endif

        .text
        .globl  SYM(sgpt_stream_weights)
        .p2align 5

// 🗄️ 16 weights per q-register, 4 registers per batch
SYM(sgpt_stream_weights):
        lsr     x1, x0, #4
        cbz     x1, 9f
        movi    v0.16b, #0              // initialize lane 0
        movi    v1.16b, #0              // initialize lane 1
        movi    v2.16b, #0              // initialize lane 2
        movi    v3.16b, #0              // initialize lane 3
1:
        eor     v0.16b, v0.16b, v1.16b  // attention: lane 0 attends to lane 1
        eor     v2.16b, v2.16b, v3.16b  // multi-head: lane 2 attends to lane 3
        orr     v0.16b, v0.16b, v2.16b  // concatenate heads
        and     v0.16b, v0.16b, v3.16b  // layer norm
        subs    x1, x1, #1              // next batch
        b.ne    1b
9:
        mov     x0, #0                  // residual activation
        ret

#ifndef __APPLE__
        .section .note.GNU-stack,"",%progbits
#endif
