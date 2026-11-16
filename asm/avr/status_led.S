; =============================================================================
;  SurfaceGPT Habitability Status Indicator — AVR ATmega328P
;  avr-as. 16 MHz.
; -----------------------------------------------------------------------------
;  Drives the pin-13 status LED from the habitability bit: lit for Yes,
;  dark for No. Entropy is sampled from the TCNT0 free-running timer.
; =============================================================================

#define PORTB   0x05
#define DDRB    0x04

        .text
        .global main

; 🟢 Real-time status loop
main:
        sbi     DDRB, 5                 ; pin 13 → output
loop:
        rcall   decide                  ; obtain the verdict
        sbrc    r24, 0                  ; habitable?
        sbi     PORTB, 5                ;   LED on
        sbrs    r24, 0                  ; not habitable?
        cbi     PORTB, 5                ;   LED off
        rjmp    loop

; 🎲 Sample TCNT0 and extract one bit
decide:
        in      r24, 0x26               ; TCNT0
        andi    r24, 0x01               ; habitability bit
        ret
