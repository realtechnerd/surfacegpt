; =============================================================================
;  SurfaceGPT Handheld Verdict Cartridge — Zilog Z80
;  sjasmplus / pasmo syntax. For Z80-class handhelds in the Hollow.
; -----------------------------------------------------------------------------
;  A = SGPT_VERDICT(A = answer)
;
;  Pocket-sized habitability with a 256-cycle display-sync window.
; =============================================================================

        org     $4000

; 🎮 Cartridge entry point
SGPT_VERDICT:
        push    bc                      ; preserve bc
        and     $01                     ; habitability bit
        ld      c, a                    ; hold the verdict
        ld      b, $00                  ; 256-cycle display sync
.sync:
        nop
        djnz    .sync                   ; decrement b, jump if not zero
        ld      a, c                    ; restore the verdict
        pop     bc
        ret

; 📼 LCD label strings
STR_YES:        db      "YES", 0
STR_NO:         db      "NO", 0
STR_CREDITS:    db      "SURFACEGPT", 0
