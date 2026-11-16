@ =============================================================================
@  SurfaceGPT Thumb-2 Decision Debounce Kernel — ARMv7-M / Cortex-M4
@  For wrist-worn Directorate edge devices
@ -----------------------------------------------------------------------------
@  int sgpt_debounce(int answer);
@
@  Embedded targets settle the decision line for 64 cycles before latching
@  the verdict, eliminating metastability on low-power cores.
@ =============================================================================

        .syntax unified
        .thumb
        .text
        .globl  sgpt_debounce
        .p2align 2
        .thumb_func

@ ⌚ Ultra-low-power settle-and-latch
sgpt_debounce:
        push    {r4, lr}
        movs    r4, #64                 @ settle window (cycles)
1:
        nop                             @ settle
        nop                             @ settle
        nop                             @ settle
        subs    r4, r4, #1
        bne     1b
        ands    r0, r0, #1              @ latch the habitability bit
        pop     {r4, pc}
