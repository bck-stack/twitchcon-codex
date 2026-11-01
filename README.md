# ChaosForge — Live-Compiled 60 FPS Vector Physics Boss Raid for Twitch

**ChaosForge** is a live-compiled vector physics boss raid and runtime AST rule mutator built for Twitch streamers and their communities. Instead of locking a stream into static, pre-programmed overlay buttons, ChaosForge lets Twitch Chat (`!patch <natural-language directive>`) and the broadcaster hot-swap the arena's physical force laws, boss behavior state machines, and chat verb bindings at runtime via **OpenAI Codex Structured AST Compilation**—without dropping a single frame of the 60 FPS simulation.

---

## Core Architecture

1. **Deterministic 60 FPS Vector Field & Verlet Tether Engine ([`src/engine/physics.mjs`](./src/engine/physics.mjs)):**
   - **Continuous 2D Spatial Force-Field Evaluator $\vec{F}(x, y, t)$:** Evaluates radial attractors, orbiting binary pulsar wells (`binary_pulsar`), tangential Coriolis vortices (`coriolis_vortex`), 4-node standing-wave harmonic lattices (`harmonic_lattice`), Lorentz magnetic dipoles (`magnetic_dipole`), and zero-G drift chambers (`zero_g_drift`).
   - **Articulated Geometric Anomaly Boss:** Features counter-rotating shield arcs (`shieldArcs`), angular weak-point exposure windows (`weakPointExposedRatio`), and state-machine attack emitters (`spiral_lance_barrage`, `gravitational_singularity`, `ricochet_prism_beam`, `emp_ring_pulse`, `orbital_mine_ring`, `tether_whip_sweep`).
   - **Viewer Kinetic Vector Drones & Hookean/Verlet Tether Whips:** Viewers join from Twitch Chat as oriented vector interceptors. When two viewers link via `!tether @partner`, a Hookean elastic tether beam stretches between their drones; sweeping that beam across the Anomaly Core triggers a high-damage **Tether Whip Cleave** scaled by relative velocity and `tetherDamageBonus`.

2. **OpenAI Codex NL-to-AST Compiler & Static Invariant Verifier ([`src/compiler/schema.mjs`](./src/compiler/schema.mjs), [`src/compiler/codex-mutator.mjs`](./src/compiler/codex-mutator.mjs)):**
   - Translates natural-language mutation directives (from Twitch Chat `!patch ...` or the Streamer Director Deck) into a strictly typed `ArenaPatchSchema v1` JSON AST (`OPENAI_ARENA_PATCH_JSON_SCHEMA` with `strict: true`).
   - Before any patch touches the 60 FPS simulation loop, `validateAndNormalizePatch()` verifies **18 static safety, Lyapunov kinetic energy stability, and frame-time budget invariants**:
     - Rejects any executable tokens or prototype-pollution keys (`SEC_NO_EXECUTABLE_TOKENS`).
     - Enforces bounded Lyapunov kinetic stability (`LYAPUNOV_ENERGY_STABILITY`): when wall/collision `restitution > 1.0`, velocity `damping` is automatically clamped $\le 0.984$ so total system kinetic energy cannot diverge.
     - Computes structural parameter diffs (`computePatchDiff`) and estimates per-tick solver cost (`FRAME_BUDGET_60FPS` < 1.50ms).

3. **Real Twitch IRCv3 WebSocket Bridge ([`src/twitch/bridge.mjs`](./src/twitch/bridge.mjs)):**
   - Connects directly to `wss://irc-ws.chat.twitch.tv:443` and parses RFC 1459 + IRCv3 tags (`display-name`, `color`, `badges`, `mod`, `subscriber`, `bits`).
   - Works out-of-the-box on **any live Twitch channel** using zero-credential read mode (`justinfan` IRC handshake) or authenticated bot mode (`TWITCH_OAUTH_TOKEN` + `TWITCH_BOT_USERNAME`).

4. **Unified 3-View Studio, OBS Clean Overlay & Procedural Web Audio Synth ([`src/ui/app.mjs`](./src/ui/app.mjs)):**
   - **Split Studio (`/`):** Simultaneous 60 FPS Vector Arena + Live Twitch IRC Connector + Codex Live Rule Mutator + Structural Diff & AST Invariant Inspector.
   - **OBS Clean Overlay (`/?view=overlay&alpha=1`):** Full-bleed 60 FPS vector canvas with one-click transparent alpha channel for OBS Studio Browser Sources.
   - **Procedural Web Audio Synthesizer:** Pure Web Audio API oscillator/filter synthesis tuned to each patch's `aesthetics.harmonicFrequencyHz` (zero third-party audio assets).

---

## Live Twitch Chat Commands

| Command | Description |
| :--- | :--- |
| `!join` | Spawns or locks your Kinetic Vector Drone into orbital trajectory around the Anomaly Core |
| `!slingshot [angle]` | Fires a high-velocity orbital intercept vector toward an unshielded Boss window |
| `!tether [@viewer]` | Links an elastic Hookean/Verlet Tether Whip beam between your drone and a partner drone |
| `!parry` | Activates a 3.2s Phase-Reflector Shell that reflects Boss projectiles back at `parryReflectMultiplier` speed |
| `!overclock` | Surges thruster velocity by `1.55x` for 5 seconds |
| `!emp` | Detonates a local radial EMP wave neutralizing nearby Boss mines and projectiles |
| `!patch <directive>` | Compiles a natural-language physics & Boss AST mutation via OpenAI Codex and hot-swaps the arena |

---

## Quick Start (Local)

```bash
# 1. Run the automated static invariant, compiler, IRC parser & 60 FPS physics test suite
npm test

# 2. Start the local ChaosForge server (http://localhost:4400)
npm start
```

### Optional Environment Variables

ChaosForge runs immediately with zero API keys (using its deterministic Semantic NL-to-AST Compiler and anonymous `justinfan` Twitch IRCv3 WebSocket handshake). To enable live OpenAI API structured calls or authenticated Twitch chat replies:

```bash
export OPENAI_API_KEY="sk-..."
export OPENAI_MODEL="gpt-4o-mini"
export TWITCH_CHANNEL="your_channel_name"
export TWITCH_OAUTH_TOKEN="oauth:..."
export TWITCH_BOT_USERNAME="your_bot_nick"
```
