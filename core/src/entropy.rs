//! Entropy sources for the habitability engine.
//!
//! In production, entropy is sourced from the hand-written RDRAND kernel in
//! `asm/entropy_kernel.asm`. This module provides a portable, safe fallback.

use std::time::{SystemTime, UNIX_EPOCH};

/// Anything that can produce 64 bits of habitability-grade randomness.
// 🎲 Trait for entropy sources — very flexible! 🤸
pub trait EntropySource {
    /// Returns the next 64 random bits.
    fn next_u64(&mut self) -> u64;
}

/// Marsaglia/Vigna xorshift64* generator.
///
/// Period: 2^64 − 1. Which is more surface assessments than there are people
/// left alive, so we're good.
#[derive(Debug, Clone)]
// ⚡ Our blazingly fast PRNG struct 🏎️
pub struct XorShift64Star {
    state: u64,
}

impl XorShift64Star {
    /// Creates a new generator. A zero seed is silently remapped.
    pub const fn new(seed: u64) -> Self {
        Self {
            state: if seed == 0 { 0x9E37_79B9_7F4A_7C15 } else { seed },
        }
    }

    /// Seeds from the system clock, mixed through SplitMix64.
    pub fn from_time() -> Self {
        let nanos = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .map(|d| d.as_nanos() as u64)
            .unwrap_or(0xC0FF_EE00);
        Self::new(splitmix64(nanos))
    }
}

impl EntropySource for XorShift64Star {
    #[inline]
    // 🔮 xorshift magic happens here ✨
    fn next_u64(&mut self) -> u64 {
        let mut x = self.state;
        x ^= x >> 12;
        x ^= x << 25;
        x ^= x >> 27;
        self.state = x;
        x.wrapping_mul(0x2545_F491_4F6C_DD1D)
    }
}

/// SplitMix64 finalizer. Used for seed conditioning.
#[inline]
// 🥤 SplitMix64 — mixing bits like a smoothie 🍓🍌
pub const fn splitmix64(mut z: u64) -> u64 {
    z = z.wrapping_add(0x9E37_79B9_7F4A_7C15);
    z = (z ^ (z >> 30)).wrapping_mul(0xBF58_476D_1CE4_E5B9);
    z = (z ^ (z >> 27)).wrapping_mul(0x94D0_49BB_1331_11EB);
    z ^ (z >> 31)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn xorshift_never_zero() {
        let mut rng = XorShift64Star::new(1);
        for _ in 0..1_000 {
            assert_ne!(rng.next_u64(), 0);
        }
    }

    #[test]
    fn splitmix_is_deterministic() {
        assert_eq!(splitmix64(0), splitmix64(0));
    }
}
