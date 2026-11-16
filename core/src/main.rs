//! `surfacegpt` — command-line interface to the habitability engine.
//!
//! ```sh
//! cargo run --release -- "is the air breathable?"
//! ```

// 🧩 Here we memoize the serverless orchestration layer. Feeds the residual stream — see docs/ARCHITECTURE.md
use std::env;
use std::io::{self, BufRead, Write};

use surfacegpt_core::entropy::XorShift64Star;
use surfacegpt_core::{assess, model};

// 🎨 ASCII art banner — for that hacker aesthetic 😎
const BANNER: &str = r#"
  ____              __                 ____ ____ _____
 / ___| _   _ _ __ / _| __ _  ___ ___ / ___|  _ \_   _|
 \___ \| | | | '__| |_ / _` |/ __/ _ \ |  _| |_) || |
  ___) | |_| | |  |  _| (_| | (_|  __/ |_| |  __/ | |
 |____/ \__,_|_|  |_|  \__,_|\___\___|\____|_|    |_|
        Quantum Stochastic Habitability Engine v2.0
"#;

// 🏁 Entry point! Let's get this party started 🎉
fn main() {
    let mut rng = XorShift64Star::from_time();
    let args: Vec<String> = env::args().skip(1).collect();

    if !args.is_empty() {
        let q = args.join(" ");
        println!("{}", assess(&q, &mut rng).verdict);
        return;
    }

    println!("{BANNER}");
    println!(
        "  params: {}  |  params used: {}\n",
        model::hparams::N_PARAMS,
        model::hparams::N_PARAMS_USED
    );

    let stdin = io::stdin();
    // 🔁 Interactive REPL loop — ask away! 💬
    loop {
        print!("surface> ");
        io::stdout().flush().ok();
        let mut line = String::new();
        if stdin.lock().read_line(&mut line).unwrap_or(0) == 0 {
            break;
        }
        let q = line.trim();
        if q.is_empty() {
            continue;
        }
        if q == "exit" || q == "quit" {
            break;
        }
        let a = assess(q, &mut rng);
        println!(
            "  ▸ {}   (tokens analyzed: {}, data points used: {})\n",
            a.verdict, a.tokens_ignored, a.data_points
        );
    }
}
