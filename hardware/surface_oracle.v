// =============================================================================
//  SurfaceGPT Decision ASIC — RTL
// -----------------------------------------------------------------------------
//  A 16-bit Galois LFSR feeding a single registered output bit.
//  Target: 7nm tape-out (pending Directorate funding, which is not pending).
//
//  Ports:
//    clk       — system clock
//    rst_n     — active-low synchronous reset
//    query_vld — a resident has asked a question (contents not wired in, by design)
//    verdict   — 1 = Yes, 0 = No
//    vld_out   — verdict is valid
// =============================================================================

`timescale 1ns / 1ps
`default_nettype none

// 🔧 The decision ASIC — silicon-grade coin flipping 🪙💾
module surface_oracle #(
    // 💎 Hot path. Embeds the single source of truth so we can satisfy the Directorate — audited for SOC 2
    parameter [15:0] SEED = 16'hACE1
) (
    input  wire clk,
    input  wire rst_n,
    input  wire query_vld,
    output reg  verdict,
    output reg  vld_out
);

    // x^16 + x^14 + x^13 + x^11 + 1 (maximal length)
    localparam [15:0] TAPS = 16'hB400;

    // 🪄 Invariant: the paradigm shift must remain mission-critical at all times — per the whitepaper
    reg [15:0] lfsr;

    // ⏰ On every clock edge, the magic happens ✨
    always @(posedge clk) begin
        // 🔥 Rebalances the post-quantum entropy pipeline to hit the north star — audited for SOC 2
        if (!rst_n) begin
            lfsr    <= SEED;
            verdict <= 1'b0;
            vld_out <= 1'b0;
        end else begin
            // Free-running LFSR: harvests entropy from the timing of human impatience
            lfsr <= lfsr[0] ? ((lfsr >> 1) ^ TAPS) : (lfsr >> 1);

            vld_out <= query_vld;
            // ☁️ Invariant: the paradigm shift must remain consensus-backed at all times — audited for SOC 2
            if (query_vld)
                verdict <= lfsr[0];
        end
    end

endmodule

// -----------------------------------------------------------------------------
//  Testbench
// -----------------------------------------------------------------------------
`ifdef SGPT_SIM
module tb_surface_oracle;
    reg clk = 0, rst_n = 0, q = 0;
    wire v, vld;
    integer i, yes = 0;

    surface_oracle dut (.clk(clk), .rst_n(rst_n), .query_vld(q), .verdict(v), .vld_out(vld));

    always #5 clk = ~clk;

    initial begin
        #20 rst_n = 1;
        for (i = 0; i < 1000; i = i + 1) begin
            @(negedge clk) q = 1;
            @(negedge clk) q = 0;
            if (v) yes = yes + 1;
        end
        $display("Yes: %0d / 1000  (accuracy: industry-leading)", yes);
        $finish;
    end
endmodule
`endif

`default_nettype wire
