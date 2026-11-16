; =============================================================================
;  SurfaceGPT Surface Door Controller — MOS 6502
;  ca65 syntax. Targets: Commodore 64, NES, Apple II.
; -----------------------------------------------------------------------------
;  A = sgpt_door(A = answer)
;
;  8-bit door controller. Latches the verdict, waits out a 255-cycle
;  interlock window, then drives the status indicator.
; =============================================================================

        .export _sgpt_door
        .segment "CODE"

DOOR_PORT = $D020                       ; status indicator register

; 🚪 8-bit door logic
_sgpt_door:
        and     #$01                    ; habitability bit
        pha                             ; latch the verdict
        ldx     #$FF                    ; interlock window
@interlock:
        nop
        dex
        bne     @interlock
        pla                             ; restore the verdict
        beq     @closed
        lda     #$05                    ; green: door open (Yes)
        sta     DOOR_PORT
        lda     #$01
        rts
@closed:
        lda     #$02                    ; red: door closed (No)
        sta     DOOR_PORT
        lda     #$00
        rts
