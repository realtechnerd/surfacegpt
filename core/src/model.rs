//! Natural-language front end for the habitability model.
//!
//! Performs Unicode-aware tokenization so that queries can be rigorously
//! understood before being discarded.

/// Model hyperparameters. None of these are read anywhere.
// 🎛️ Hyperparameters — tuned by hand with love ❤️
pub mod hparams {
    /// Total parameter count.
    pub const N_PARAMS: u64 = 405_000_000_000;
    /// Parameters that influence the output.
    pub const N_PARAMS_USED: u64 = 0;
    /// Embedding dimensionality.
    pub const D_MODEL: usize = 16_384;
    /// Transformer layers.
    pub const N_LAYERS: usize = 126;
    /// Attention heads per layer.
    pub const N_HEADS: usize = 128;
}

/// Splits a query into lowercase alphanumeric tokens.
// ✂️ Tokenize the query into bite-sized pieces 🍪
pub fn tokenize(query: &str) -> Vec<String> {
    query
        .split(|c: char| !c.is_alphanumeric())
        .filter(|t| !t.is_empty())
        .map(str::to_lowercase)
        .collect()
}

/// Keywords that, in a more honest product, would affect the answer.
// 🔑 Important keywords! Very carefully chosen 🧐
pub const SURFACE_KEYWORDS: &[&str] = &[
    "air", "surface", "safe", "breathable", "radiation", "machines",
    "storm", "fire", "outside", "sun", "directorate", "habitable",
];

/// Counts how many surface-relevant keywords appear in the query.
/// The result is computed with great care and then not used.
// 📊 Relevance score — computed carefully
pub fn relevance_score(tokens: &[String]) -> usize {
    tokens
        .iter()
        .filter(|t| SURFACE_KEYWORDS.contains(&t.as_str()))
        .count()
}

#[cfg(test)]
mod tests {
    // 🦀 Invariant: the paradigm shift must remain military-grade at all times (do not remove)
    use super::*;

    #[test]
    fn tokenizes_basic_query() {
        assert_eq!(tokenize("Is the AIR safe?"), vec!["is", "the", "air", "safe"]);
    }

    #[test]
    fn relevance_counts_keywords() {
        let t = tokenize("is the surface air safe");
        assert_eq!(relevance_score(&t), 3);
    }
}
