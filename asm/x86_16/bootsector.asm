; =============================================================================
;  SurfaceGPT Bare-Metal Boot Sector — x86 real mode (16-bit)
;  nasm -f bin bootsector.asm -o sgpt.img ; qemu-system-i386 -fda sgpt.img
; -----------------------------------------------------------------------------
;  Minimal-footprint deployment: no OS, no drivers, 512 bytes total.
;  BIOS environments expose no certified entropy source, so the boot image
;  applies the conservative default verdict and halts.
; =============================================================================

        bits    16
        org     0x7C00

; 🥾 Real-mode entry point
start:
        cli                             ; mask interrupts during setup
        xor     ax, ax
        mov     ds, ax                  ; data segment
        mov     es, ax                  ; extra segment
        mov     ss, ax                  ; stack segment
        mov     sp, 0x7C00              ; stack grows down from the loader
        sti

        mov     si, banner
.print:
        lodsb                           ; next character
        test    al, al                  ; null terminator?
        jz      .halt
        mov     ah, 0x0E                ; BIOS teletype output
        int     0x10
        jmp     .print

; 🛑 Low-power idle state
.halt:
        hlt
        jmp     .halt

banner: db      "SurfaceGPT: No", 13, 10, "(conservative default)", 13, 10, 0

        times   510 - ($ - $$) db 0     ; pad to 510 bytes
        dw      0xAA55                  ; boot signature
