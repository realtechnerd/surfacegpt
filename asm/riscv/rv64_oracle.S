# =============================================================================
#  SurfaceGPT Open-ISA Oracle — RISC-V RV64IMAC
#  GNU AS, LP64 ABI
# -----------------------------------------------------------------------------
#  long sgpt_rv_oracle(long seed);
#
#  Royalty-free verdict generation for open-silicon deployments. Mixes the
#  caller seed with the cycle counter through a three-stage xorshift.
# =============================================================================

        .text
        .globl  sgpt_rv_oracle
        .type   sgpt_rv_oracle, @function
        .p2align 2

# 🦺 Open-ISA verdict path
sgpt_rv_oracle:
        rdcycle t0                      # sample the cycle counter
        xor     a0, a0, t0              # mix seed with timing entropy
        srli    t1, a0, 13              # xorshift stage 1
        xor     a0, a0, t1
        slli    t1, a0, 7               # xorshift stage 2
        xor     a0, a0, t1
        srli    t1, a0, 17              # xorshift stage 3
        xor     a0, a0, t1
        andi    a0, a0, 1               # habitability bit
        ret
        .size   sgpt_rv_oracle, .-sgpt_rv_oracle

        .section .note.GNU-stack,"",@progbits
