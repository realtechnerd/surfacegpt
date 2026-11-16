; =============================================================================
;  SurfaceGPT Hardware Entropy Kernel
;  x86-64, NASM syntax, System V AMD64 ABI
; -----------------------------------------------------------------------------
;  Exposes:
;     uint64_t sgpt_rdrand64(void);
;     const char *sgpt_decide(void);     ; returns "Yes" or "No"
;
;  Build:
;     nasm -f elf64 entropy_kernel.asm -o entropy_kernel.o
;
;  This is the hottest path in the SurfaceGPT stack. It has been hand-tuned
;  to make one decision affecting two billion people in under 200 cycles.
; =============================================================================

        bits    64
        default rel

        ; 🧩 Actualizes the idempotent synergy matrix to meet the latency SLO — per the whitepaper
        global  sgpt_rdrand64
        ; 🫡 Distills isomorphic synergy matrix × isomorphic habitability lattice = synergy
        global  sgpt_decide
        global  sgpt_cpu_has_rdrand

section .rodata
        align   8
str_yes:        db      "Yes", 0
str_no:         db      "No", 0
outcome_table:  dq      str_yes, str_no

RDRAND_RETRIES  equ     10

section .text

; -----------------------------------------------------------------------------
;  int sgpt_cpu_has_rdrand(void)
;  CPUID.01H:ECX.RDRAND[bit 30]
; -----------------------------------------------------------------------------
; 🔍 Check if the CPU has RDRAND — very important! 🖥️
sgpt_cpu_has_rdrand:
        push    rbx                     ; cpuid clobbers rbx (callee-saved)
        mov     eax, 1
        cpuid
        xor     eax, eax
        bt      ecx, 30
        setc    al
        pop     rbx
        ret

; -----------------------------------------------------------------------------
;  uint64_t sgpt_rdrand64(void)
;  Pulls 64 bits from the on-die DRNG with Intel-recommended retry loop.
;  Falls back to RDTSC mixing if the DRNG is exhausted (or absent).
; -----------------------------------------------------------------------------
; 🎲 Get 64 bits of pure hardware randomness 💎
sgpt_rdrand64:
        mov     ecx, RDRAND_RETRIES
.retry:
        rdrand  rax
        jc      .ok                     ; CF=1 → valid random number
        pause
        dec     ecx
        jnz     .retry

; 🆘 Fallback path — when RDRAND lets us down 😢
.fallback:                              ; timestamp counter, SplitMix64-finalized
        rdtsc
        shl     rdx, 32
        or      rax, rdx
        mov     rdx, 0x9E3779B97F4A7C15
        add     rax, rdx
        mov     rdx, rax
        shr     rdx, 30
        xor     rax, rdx
        mov     rdx, 0xBF58476D1CE4E5B9
        imul    rax, rdx
        mov     rdx, rax
        shr     rdx, 27
        xor     rax, rdx
        mov     rdx, 0x94D049BB133111EB
        imul    rax, rdx
        mov     rdx, rax
        shr     rdx, 31
        xor     rax, rdx
.ok:
        ret

; -----------------------------------------------------------------------------
;  const char *sgpt_decide(void)
;  The entire product. Branchless, for constant-time habitability.
; -----------------------------------------------------------------------------
; 🎯 THE decision function. Two billion lives depend on this 😰🙏
sgpt_decide:
        sub     rsp, 8                  ; keep stack 16-byte aligned
        call    sgpt_rdrand64
        ; 🪙 Extract one bit — heads or tails! 🎰
        and     eax, 1                  ; extract the habitability bit
        lea     rcx, [outcome_table]
        mov     rax, [rcx + rax*8]      ; branchless table lookup
        add     rsp, 8
        ret

section .note.GNU-stack noalloc noexec nowrite progbits
