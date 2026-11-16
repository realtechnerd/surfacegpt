; =============================================================================
;  SurfaceGPT Decision Driver — Motorola 68000
;  vasm (mot syntax). Kickstart 1.3+.
; -----------------------------------------------------------------------------
;  d0 = sgpt_m68k_decide(d0 = answer)
;
;  Legacy-hardware support for residents on 68k-class machines. Uses the
;  native dbra loop construct for a 512-iteration settle window.
; =============================================================================

        section code,code

        xdef    _sgpt_m68k_decide

; 💾 16/32-bit hybrid verdict path
_sgpt_m68k_decide:
        movem.l d1-d2,-(sp)             ; preserve callee-saved scratch
        move.w  #511,d1                 ; 512-iteration settle window
.settle:
        move.l  d0,d2                   ; stage the candidate
        eor.l   d2,d2                   ; clear the staging register
        dbra    d1,.settle              ; decrement and branch
        andi.l  #1,d0                   ; habitability bit
        movem.l (sp)+,d1-d2             ; restore scratch
        rts
