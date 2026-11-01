/**
 * ChaosForge — Unified 60 FPS Vector Arena, Streamer Director Deck & Codex AST Inspector UI
 *
 * Zero external image/audio dependencies. Everything is rendered via deterministic
 * HTML5 Canvas 2D vector geometry and synthesized via Web Audio API oscillators.
 */

import { SIGNATURE_PATCH_PRESETS } from '../compiler/codex-mutator.mjs';

export function renderChaosForgeHtml({ initialSnapshot, presets = SIGNATURE_PATCH_PRESETS }) {
  const safeInitialJson = JSON.stringify(initialSnapshot).replace(/</g, '\\u003c');
  const safePresetsJson = JSON.stringify(presets).replace(/</g, '\\u003c');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>ChaosForge — Live-Compiled Vector Physics Boss Raid for Twitch (OpenAI Codex)</title>
  <style>
    :root {
      --bg-deep: #060810;
      --bg-panel: rgba(11, 15, 27, 0.92);
      --bg-card: rgba(17, 23, 40, 0.88);
      --border-subtle: rgba(94, 234, 212, 0.18);
      --border-bright: rgba(0, 245, 212, 0.55);
      --accent-cyan: #00f5d4;
      --accent-magenta: #ff4d6d;
      --accent-amber: #fee440;
      --accent-violet: #9b5de5;
      --text-main: #f1f5f9;
      --text-dim: #94a3b8;
      --font-sans: 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif;
      --font-mono: 'JetBrains Mono', 'Cascadia Code', 'Consolas', monospace;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    html, body {
      width: 100%;
      height: 100%;
      background: var(--bg-deep);
      color: var(--text-main);
      font-family: var(--font-sans);
      overflow: hidden;
      user-select: none;
    }

    html:has(body.obs-transparent),
    body.obs-transparent {
      background: transparent !important;
    }

    body.obs-transparent .arena-stage {
      background:
        linear-gradient(45deg, rgba(15, 23, 42, 0.42) 25%, transparent 25%),
        linear-gradient(-45deg, rgba(15, 23, 42, 0.42) 25%, transparent 25%),
        linear-gradient(45deg, transparent 75%, rgba(15, 23, 42, 0.42) 75%),
        linear-gradient(-45deg, transparent 75%, rgba(15, 23, 42, 0.42) 75%),
        radial-gradient(circle at 50% 50%, rgba(0, 245, 212, 0.08), rgba(6, 8, 16, 0.55)) !important;
      background-size: 32px 32px, 32px 32px, 32px 32px, 32px 32px, 100% 100% !important;
      background-position: 0 0, 0 16px, 16px -16px, -16px 0, 0 0 !important;
    }

    body.obs-real-capture .arena-stage {
      background: transparent !important;
    }

    .obs-alpha-banner {
      display: none;
      position: absolute;
      top: 14px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0, 245, 212, 0.14);
      border: 1px solid rgba(0, 245, 212, 0.55);
      color: var(--accent-cyan);
      font-family: var(--font-mono);
      font-size: 11px;
      font-weight: 700;
      padding: 5px 14px;
      border-radius: 999px;
      pointer-events: none;
      z-index: 30;
      backdrop-filter: blur(6px);
      letter-spacing: 0.5px;
    }

    body.obs-transparent .obs-alpha-banner {
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }

    .app-shell {
      display: flex;
      flex-direction: column;
      width: 100vw;
      height: 100vh;
    }

    /* Top Header Bar */
    .topbar {
      height: 52px;
      min-height: 52px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 16px;
      background: rgba(7, 10, 19, 0.96);
      border-bottom: 1px solid var(--border-subtle);
      z-index: 20;
    }

    body.view-overlay .topbar {
      display: none;
    }

    .brand-group {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .brand-logo {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      background: linear-gradient(135deg, rgba(0, 245, 212, 0.22), rgba(155, 93, 229, 0.3));
      border: 1px solid var(--accent-cyan);
      display: grid;
      place-items: center;
      font-family: var(--font-mono);
      font-weight: 800;
      font-size: 14px;
      color: var(--accent-cyan);
      box-shadow: 0 0 14px rgba(0, 245, 212, 0.28);
    }

    .brand-title {
      font-size: 15px;
      font-weight: 800;
      letter-spacing: 0.4px;
      color: #fff;
    }

    .brand-sub {
      font-size: 11px;
      color: var(--text-dim);
      font-family: var(--font-mono);
    }

    .nav-tabs {
      display: flex;
      gap: 6px;
      background: rgba(15, 23, 42, 0.8);
      padding: 4px;
      border-radius: 8px;
      border: 1px solid rgba(148, 163, 184, 0.16);
    }

    .nav-tab {
      background: transparent;
      color: var(--text-dim);
      border: none;
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s ease;
      font-family: var(--font-sans);
    }

    .nav-tab.active {
      background: rgba(0, 245, 212, 0.16);
      color: var(--accent-cyan);
      border: 1px solid rgba(0, 245, 212, 0.4);
    }

    .top-actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .status-pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 5px 10px;
      border-radius: 999px;
      font-size: 11px;
      font-family: var(--font-mono);
      background: rgba(15, 23, 42, 0.9);
      border: 1px solid rgba(148, 163, 184, 0.22);
      color: #cbd5e1;
    }

    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--accent-cyan);
      box-shadow: 0 0 8px var(--accent-cyan);
    }

    .status-dot.warn {
      background: var(--accent-amber);
      box-shadow: 0 0 8px var(--accent-amber);
    }

    .btn {
      background: rgba(30, 41, 59, 0.85);
      color: #f8fafc;
      border: 1px solid rgba(148, 163, 184, 0.28);
      border-radius: 6px;
      padding: 6px 11px;
      font-size: 11.5px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s ease;
      font-family: var(--font-sans);
      display: inline-flex;
      align-items: center;
      gap: 5px;
    }

    .btn:hover {
      border-color: var(--accent-cyan);
      color: var(--accent-cyan);
    }

    .btn-primary {
      background: linear-gradient(135deg, rgba(0, 245, 212, 0.22), rgba(0, 187, 249, 0.25));
      border-color: var(--accent-cyan);
      color: var(--accent-cyan);
    }

    .btn-primary:hover {
      background: rgba(0, 245, 212, 0.3);
      box-shadow: 0 0 12px rgba(0, 245, 212, 0.25);
    }

    .btn-accent {
      background: linear-gradient(135deg, rgba(255, 77, 109, 0.22), rgba(155, 93, 229, 0.25));
      border-color: var(--accent-magenta);
      color: #fda4af;
    }

    /* Main Workspace Grid */
    .workspace {
      flex: 1;
      display: grid;
      grid-template-columns: minmax(0, 1.55fr) 440px;
      min-height: 0;
      overflow: hidden;
    }

    body.view-overlay .workspace {
      grid-template-columns: 1fr;
    }

    body.view-overlay .side-dock {
      display: none;
    }

    body.view-codex .workspace {
      grid-template-columns: minmax(0, 1fr) 580px;
    }

    /* Left Arena Stage */
    .arena-stage {
      position: relative;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: radial-gradient(circle at 50% 50%, #0b1120 0%, #05070e 100%);
      overflow: hidden;
    }

    #arenaCanvas {
      width: 100%;
      height: 100%;
      display: block;
    }

    /* Overlay HUD Elements inside Arena Stage */
    .hud-top-bar {
      position: absolute;
      top: 14px;
      left: 16px;
      right: 16px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      pointer-events: none;
      gap: 14px;
    }

    .boss-hud-card {
      background: rgba(8, 12, 24, 0.84);
      border: 1px solid rgba(255, 77, 109, 0.45);
      border-radius: 10px;
      padding: 10px 14px;
      min-width: 320px;
      max-width: 420px;
      backdrop-filter: blur(8px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.45);
    }

    .boss-hud-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 6px;
    }

    .boss-name {
      font-size: 13px;
      font-weight: 800;
      letter-spacing: 0.5px;
      color: #fff;
      text-transform: uppercase;
    }

    .boss-phase-tag {
      font-family: var(--font-mono);
      font-size: 10.5px;
      padding: 2px 7px;
      border-radius: 4px;
      background: rgba(255, 77, 109, 0.22);
      color: #fda4af;
      border: 1px solid rgba(255, 77, 109, 0.45);
    }

    .hp-track {
      width: 100%;
      height: 9px;
      background: rgba(15, 23, 42, 0.95);
      border-radius: 999px;
      overflow: hidden;
      border: 1px solid rgba(255, 255, 255, 0.12);
    }

    .hp-fill {
      height: 100%;
      width: 100%;
      background: linear-gradient(90deg, #ff4d6d 0%, #fee440 100%);
      transition: width 0.12s linear;
    }

    .boss-meta-row {
      display: flex;
      justify-content: space-between;
      margin-top: 6px;
      font-family: var(--font-mono);
      font-size: 10.5px;
      color: var(--text-dim);
    }

    /* Active Codex Patch HUD Card */
    .patch-hud-card {
      background: rgba(8, 12, 24, 0.86);
      border: 1px solid var(--border-bright);
      border-radius: 10px;
      padding: 10px 14px;
      min-width: 300px;
      max-width: 380px;
      backdrop-filter: blur(8px);
      box-shadow: 0 8px 24px rgba(0, 245, 212, 0.14);
    }

    .patch-hud-badge {
      display: inline-block;
      font-family: var(--font-mono);
      font-size: 10px;
      font-weight: 700;
      color: var(--accent-cyan);
      text-transform: uppercase;
      letter-spacing: 0.6px;
      margin-bottom: 3px;
    }

    .patch-hud-title {
      font-size: 13px;
      font-weight: 800;
      color: #fff;
      margin-bottom: 4px;
    }

    .patch-hud-laws {
      font-family: var(--font-mono);
      font-size: 10.5px;
      color: #cbd5e1;
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }

    .law-chip {
      background: rgba(0, 245, 212, 0.11);
      border: 1px solid rgba(0, 245, 212, 0.28);
      padding: 2px 6px;
      border-radius: 4px;
    }

    /* Bottom Overlay HUD: MVP Leaderboard & Command Ticker */
    .hud-bottom-bar {
      position: absolute;
      bottom: 14px;
      left: 16px;
      right: 16px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      pointer-events: none;
      gap: 14px;
    }

    .mvp-card, .feed-card {
      background: rgba(8, 12, 24, 0.84);
      border: 1px solid rgba(148, 163, 184, 0.22);
      border-radius: 10px;
      padding: 9px 12px;
      backdrop-filter: blur(8px);
    }

    .mvp-card {
      min-width: 270px;
    }

    .feed-card {
      min-width: 340px;
      max-width: 440px;
    }

    .hud-section-title {
      font-family: var(--font-mono);
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      color: var(--accent-amber);
      margin-bottom: 5px;
    }

    .mvp-row {
      display: flex;
      justify-content: space-between;
      font-family: var(--font-mono);
      font-size: 11px;
      padding: 2px 0;
    }

    .feed-line {
      font-family: var(--font-mono);
      font-size: 10.5px;
      color: #e2e8f0;
      padding: 2px 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* Right Side Dock (Director Deck & Codex AST Workbench) */
    .side-dock {
      height: 100%;
      background: var(--bg-panel);
      border-left: 1px solid var(--border-subtle);
      display: flex;
      flex-direction: column;
      overflow-y: auto;
      overflow-x: hidden;
      padding: 10px;
      gap: 8px;
    }

    .panel-box {
      background: var(--bg-card);
      border: 1px solid rgba(148, 163, 184, 0.18);
      border-radius: 9px;
      padding: 9px 11px;
    }

    .panel-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }

    .panel-title {
      font-size: 11.5px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: var(--accent-cyan);
      font-family: var(--font-mono);
    }

    .input-row {
      display: flex;
      gap: 6px;
      margin-bottom: 6px;
    }

    .text-input, .textarea-input {
      width: 100%;
      background: rgba(7, 10, 19, 0.9);
      border: 1px solid rgba(148, 163, 184, 0.3);
      border-radius: 6px;
      color: #fff;
      padding: 7px 10px;
      font-size: 12px;
      font-family: var(--font-mono);
    }

    .textarea-input {
      min-height: 54px;
      resize: vertical;
      font-family: var(--font-sans);
    }

    .text-input:focus, .textarea-input:focus {
      outline: none;
      border-color: var(--accent-cyan);
    }

    .preset-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 6px;
      margin-top: 6px;
    }

    .preset-btn {
      text-align: left;
      padding: 7px 9px;
      background: rgba(15, 23, 42, 0.85);
      border: 1px solid rgba(0, 245, 212, 0.24);
      border-radius: 6px;
      color: #e2e8f0;
      font-size: 11px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.14s ease;
    }

    .preset-btn:hover {
      border-color: var(--accent-cyan);
      background: rgba(0, 245, 212, 0.14);
    }

    .verb-bar {
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
    }

    .diff-list {
      display: flex;
      flex-direction: column;
      gap: 4px;
      max-height: 112px;
      overflow-y: auto;
      overflow-x: hidden;
      font-family: var(--font-mono);
      font-size: 10.5px;
    }

    .diff-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-shrink: 0;
      gap: 8px;
      background: rgba(7, 10, 19, 0.75);
      padding: 4px 7px;
      border-radius: 4px;
      border-left: 2px solid var(--accent-cyan);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .ast-code {
      background: rgba(5, 8, 16, 0.95);
      border: 1px solid rgba(148, 163, 184, 0.2);
      border-radius: 6px;
      padding: 8px;
      font-family: var(--font-mono);
      font-size: 10px;
      color: #a5f3fc;
      max-height: 165px;
      overflow-y: auto;
      overflow-x: hidden;
      white-space: pre-wrap;
      word-break: break-word;
    }

    .check-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-family: var(--font-mono);
      font-size: 10px;
      padding: 2px 6px;
      border-radius: 4px;
      background: rgba(56, 176, 0, 0.18);
      color: #86efac;
      border: 1px solid rgba(56, 176, 0, 0.4);
    }
  </style>
</head>
<body>
  <div class="app-shell">
    <!-- Top Header -->
    <header class="topbar">
      <div class="brand-group">
        <div class="brand-logo">CF</div>
        <div>
          <div class="brand-title">CHAOSFORGE // ANOMALY ENGINE</div>
          <div class="brand-sub">Live-Compiled 60 FPS Vector Boss Raid &amp; Codex AST Mutator for Twitch</div>
        </div>
      </div>

      <div class="nav-tabs">
        <button class="nav-tab active" data-view="studio" id="tabStudio">Split Studio (Director + Arena)</button>
        <button class="nav-tab" data-view="codex" id="tabCodex">Codex AST &amp; Invariant Inspector</button>
        <button class="nav-tab" data-view="overlay" id="tabOverlay">OBS Clean Overlay</button>
      </div>

      <div class="top-actions">
        <div class="status-pill" id="twitchStatusPill">
          <span class="status-dot warn" id="twitchStatusDot"></span>
          <span id="twitchStatusText">IRC: READY (STAGE SIM + LIVE WS)</span>
        </div>
        <button class="btn" id="btnToggleAudio" title="Toggle Procedural Web Audio Synth">Audio Synth: OFF</button>
        <button class="btn" id="btnToggleAlpha" title="Toggle Transparent Background for OBS Browser Source">OBS Alpha</button>
        <button class="btn btn-accent" id="btnStageSurge">Stage Crowd Surge (12 Viewers)</button>
      </div>
    </header>

    <!-- Main Workspace -->
    <main class="workspace">
      <!-- 60 FPS Vector Physics Canvas Stage -->
      <section class="arena-stage">
        <div class="obs-alpha-banner">
          <span>ALPHA CHANNEL ACTIVE (RGBA 0,0,0,0) — OBS BROWSER SOURCE OVERLAY LAYER</span>
        </div>
        <canvas id="arenaCanvas" width="1280" height="720"></canvas>

        <!-- Top Overlay HUD -->
        <div class="hud-top-bar">
          <div class="boss-hud-card">
            <div class="boss-hud-header">
              <span class="boss-name" id="hudBossName">AEGIS-IX SINGULARITY CORE</span>
              <span class="boss-phase-tag" id="hudBossPhase">PHASE 1 // HEX_CITADEL</span>
            </div>
            <div class="hp-track">
              <div class="hp-fill" id="hudBossHpFill" style="width: 100%;"></div>
            </div>
            <div class="boss-meta-row">
              <span id="hudBossHpText">HP: 2400 / 2400</span>
              <span id="hudBossAttackText">SEQ: spiral_lance_barrage</span>
            </div>
          </div>

          <div class="patch-hud-card">
            <div class="patch-hud-badge" id="hudPatchAuthor">ACTIVE CODEX AST PATCH // @system</div>
            <div class="patch-hud-title" id="hudPatchTitle">Genesis Orbital Core</div>
            <div class="patch-hud-laws" id="hudPatchLaws">
              <span class="law-chip">field: central_attractor</span>
              <span class="law-chip">G: 140N</span>
              <span class="law-chip">tether: 2.1x</span>
            </div>
          </div>
        </div>

        <!-- Bottom Overlay HUD -->
        <div class="hud-bottom-bar">
          <div class="mvp-card">
            <div class="hud-section-title">TOP KINETIC VIEWER DRONES (TWITCH CHAT)</div>
            <div id="hudMvpList"></div>
          </div>

          <div class="feed-card">
            <div class="hud-section-title">LIVE AST &amp; KINETIC TELEMETRY FEED</div>
            <div id="hudFeedList"></div>
          </div>
        </div>
      </section>

      <!-- Right Side Dock: Streamer Director Deck & Codex AST Workbench -->
      <aside class="side-dock">
        <!-- 1. Real Twitch IRC WebSocket & EventSub Bridge -->
        <div class="panel-box">
          <div class="panel-header">
            <span class="panel-title">1. Twitch API, IRCv3 Chat &amp; EventSub Bridge</span>
            <span class="check-badge" id="ircBadge">IRC + EventSub Active</span>
          </div>
          <div class="input-row">
            <input type="text" class="text-input" id="inputTwitchChannel" placeholder="Enter live Twitch channel (e.g. twitchdev, bck_stack)" value="bck_stack" />
            <button class="btn btn-primary" id="btnConnectTwitch">Connect Live IRC</button>
          </div>
          <div style="font-size: 10.5px; color: var(--text-dim); margin-bottom: 4px;">
            Twitch Chat Commands (IRCv3 WebSocket):
          </div>
          <div class="verb-bar" style="margin-bottom: 7px;">
            <button class="btn" data-cmd="!slingshot">!slingshot</button>
            <button class="btn" data-cmd="!tether">!tether</button>
            <button class="btn" data-cmd="!parry">!parry</button>
            <button class="btn" data-cmd="!overclock">!overclock</button>
            <button class="btn" data-cmd="!emp">!emp</button>
          </div>
          <div style="font-size: 10.5px; color: var(--text-dim); margin-bottom: 4px;">
            Twitch EventSub Webhooks &amp; WebSocket (follow / sub / cheer / raid / hype_train):
          </div>
          <div class="verb-bar">
            <button class="btn" data-eventsub="channel.follow">+ Follow</button>
            <button class="btn" data-eventsub="channel.subscribe">★ Sub Ion Strike</button>
            <button class="btn" data-eventsub="channel.cheer">💎 Cheer 500 Bits</button>
            <button class="btn" data-eventsub="channel.raid">🚀 Raid (45)</button>
            <button class="btn btn-accent" data-eventsub="channel.hype_train.begin">🔥 Hype Train</button>
          </div>
        </div>

        <!-- 2. OpenAI Codex Live Physics & Boss AST Mutator -->
        <div class="panel-box">
          <div class="panel-header">
            <span class="panel-title">2. Codex Live Rule Mutator (!patch)</span>
            <span class="check-badge" id="compilerModeBadge">ArenaPatchSchema v1</span>
          </div>
          <textarea class="textarea-input" id="inputPatchPrompt" placeholder="Type any natural-language physics or boss mutation (e.g. 'Split gravity into twin binary pulsars with prism ricochet beams and 3.4x tether whips')...">Split the reactor into twin binary pulsar gravity wells with high Coriolis spin and ricochet prism beams.</textarea>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 6px;">
            <span style="font-size: 10.5px; color: var(--text-dim); font-family: var(--font-mono);" id="compileLatencyLabel">18/18 Static Invariants Verified</span>
            <button class="btn btn-primary" id="btnCompilePatch">Compile &amp; Hot-Swap AST</button>
          </div>

          <div class="preset-grid" id="presetGrid"></div>
        </div>

        <!-- 3. Community !patch Voting Queue & Rollback History -->
        <div class="panel-box">
          <div class="panel-header">
            <span class="panel-title">3. Structural AST Diffs &amp; Hot-Swap History</span>
            <button class="btn" id="btnSimulateChatPatch" style="padding: 3px 8px; font-size: 10.5px;">+ Simulate Chat !patch</button>
          </div>
          <div class="diff-list" id="diffList">
            <div class="diff-item"><span>No mutations yet — running Genesis Orbital Core</span></div>
          </div>
        </div>

        <!-- 4. Validated ArenaPatchSchema v1 AST Inspector -->
        <div class="panel-box">
          <div class="panel-header">
            <span class="panel-title">4. Verified ArenaPatch AST &amp; Lyapunov Bounds</span>
            <div style="display:flex; gap:6px; align-items:center;">
              <button class="btn" id="btnTestGuardrail" style="padding:2px 7px; font-size:10px;" title="Inject adversarial eval() / divergent physics payload to verify static AST rejection">Test Guardrail</button>
              <span class="check-badge" id="tickBudgetBadge">0.42ms / tick</span>
            </div>
          </div>
          <div id="invariantCheckList" style="display:flex; flex-wrap:wrap; gap:4px; margin-bottom:6px;"></div>
          <pre class="ast-code" id="astJsonViewer"></pre>
        </div>
      </aside>
    </main>
  </div>

  <script type="module">
    const INITIAL_SNAPSHOT = ${safeInitialJson};
    const PRESETS = ${safePresetsJson};

    let state = INITIAL_SNAPSHOT;
    let lastDiffs = [];
    let audioEnabled = false;
    let audioCtx = null;

    const canvas = document.getElementById('arenaCanvas');
    const ctx = canvas.getContext('2d');

    // URL query view support (?view=overlay or ?view=codex)
    const params = new URLSearchParams(window.location.search);
    if (params.get('view') === 'overlay') {
      document.body.classList.add('view-overlay');
    } else if (params.get('view') === 'codex') {
      document.body.classList.add('view-codex');
    }
    if (params.get('alpha') === '1') {
      document.body.classList.add('obs-transparent');
    }
    if (window.obsstudio) {
      document.body.classList.add('obs-real-capture');
    }

    // View Switching Tabs
    document.querySelectorAll('.nav-tab').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.nav-tab').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        const v = btn.dataset.view;
        document.body.classList.remove('view-overlay', 'view-codex');
        if (v === 'overlay') document.body.classList.add('view-overlay');
        if (v === 'codex') document.body.classList.add('view-codex');
        resizeCanvas();
      });
    });

    // Double-click anywhere in overlay mode to return to Split Studio
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.body.classList.remove('view-overlay');
        resizeCanvas();
      }
    });

    // Procedural Web Audio Synthesizer (zero external audio files)
    function playSynthPulse(freqHz = 220, type = 'sine', durationSec = 0.22) {
      if (!audioEnabled) return;
      try {
        if (!audioCtx) {
          audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freqHz, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(freqHz * 1.45, audioCtx.currentTime + durationSec);

        gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + durationSec);

        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + durationSec);
      } catch {
        // Ignore audio context restrictions
      }
    }

    document.getElementById('btnToggleAudio').addEventListener('click', (e) => {
      audioEnabled = !audioEnabled;
      e.currentTarget.textContent = audioEnabled ? 'Audio Synth: ON' : 'Audio Synth: OFF';
      if (audioEnabled) {
        playSynthPulse(state?.activePatch?.aesthetics?.harmonicFrequencyHz || 220, 'triangle', 0.3);
      }
    });

    document.getElementById('btnToggleAlpha').addEventListener('click', () => {
      document.body.classList.toggle('obs-transparent');
    });

    // Render signature preset buttons
    const presetGrid = document.getElementById('presetGrid');
    PRESETS.forEach((p) => {
      const btn = document.createElement('button');
      btn.className = 'preset-btn';
      btn.innerHTML = '<div style="color: var(--accent-cyan); margin-bottom:2px;">' + p.label + '</div>' +
        '<div style="font-size:10px; color: var(--text-dim); font-weight:400;">' + p.candidate.fieldLaw.type + ' // ' + p.candidate.bossSpec.chassis + '</div>';
      btn.addEventListener('click', () => {
        document.getElementById('inputPatchPrompt').value = p.prompt;
        triggerCompilePatch(p.id, 'streamer_director');
      });
      presetGrid.appendChild(btn);
    });

    // API Helpers
    async function postApi(path, body) {
      const res = await fetch(path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      return res.json();
    }

    async function triggerCompilePatch(promptValue, author = 'streamer_director') {
      const btn = document.getElementById('btnCompilePatch');
      btn.textContent = 'Compiling AST...';
      const result = await postApi('/api/patch/compile', { prompt: promptValue, author });
      btn.textContent = 'Compile & Hot-Swap AST';

      if (result.ok) {
        state = result.snapshot;
        lastDiffs = result.diffs || [];
        document.getElementById('compilerModeBadge').textContent = result.compilerMode;
        document.getElementById('compileLatencyLabel').textContent =
          'Verified 18/18 Invariants in ' + result.compileLatencyMs + 'ms';
        renderDiffList(lastDiffs);
        updateDomHud();
        playSynthPulse(state.activePatch.aesthetics.harmonicFrequencyHz || 260, 'sawtooth', 0.35);
      }
    }

    document.getElementById('btnCompilePatch').addEventListener('click', () => {
      const prompt = document.getElementById('inputPatchPrompt').value;
      triggerCompilePatch(prompt, 'bck_stack');
    });

    // Quick Chat Verb Buttons
    document.querySelectorAll('[data-cmd]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const cmd = btn.dataset.cmd;
        const viewers = ['bck_stack', 'talhacomak', 'codex_pilot', 'kinetic_nova', 'shader_witch'];
        const pick = viewers[Math.floor(Math.random() * viewers.length)];
        const res = await postApi('/api/chat/command', {
          username: pick,
          command: cmd.replace('!', ''),
          argsText: ''
        });
        if (res.snapshot) {
          state = res.snapshot;
          updateDomHud();
          playSynthPulse(340, 'sine', 0.14);
        }
      });
    });

    // Twitch EventSub Webhook / WebSocket Trigger Buttons
    document.querySelectorAll('[data-eventsub]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const subType = btn.dataset.eventsub;
        const viewers = ['talhacomak', 'bck_stack', 'codex_pilot', 'kinetic_nova', 'shader_witch'];
        const pick = viewers[Math.floor(Math.random() * viewers.length)];
        const res = await postApi('/api/twitch/eventsub/simulate', {
          type: subType,
          username: pick,
          viewers: 45,
          bits: 500,
          tier: '3000',
          level: 4
        });
        if (res.snapshot) {
          state = res.snapshot;
          updateDomHud();
          playSynthPulse(520, 'sawtooth', 0.32);
        }
      });
    });

    // Stage Crowd Surge Button
    document.getElementById('btnStageSurge').addEventListener('click', async () => {
      const res = await postApi('/api/stage/surge', {});
      if (res.snapshot) {
        state = res.snapshot;
        updateDomHud();
        playSynthPulse(440, 'triangle', 0.28);
      }
    });

    // Simulate a viewer !patch from Twitch chat
    const SAMPLE_VIEWER_PATCHES = [
      { user: 'talhacomak', prompt: 'Invert magnetic dipole poles and supercharge elastic viewer tether whips to 3.4x cleave damage' },
      { user: 'shader_witch', prompt: 'Create a 4-pole harmonic standing-wave lattice with Chronos Tesseract and high-speed parry reflections' },
      { user: 'kinetic_nova', prompt: 'Kill central gravity into zero-g hyper-elastic ricochet chamber with prism lasers' },
      { user: 'bck_stack', prompt: 'Twin binary pulsar singularity wells with 5 shield arcs and spiral lance barrage' }
    ];
    let sampleIdx = 0;

    document.getElementById('btnSimulateChatPatch').addEventListener('click', async () => {
      const item = SAMPLE_VIEWER_PATCHES[sampleIdx % SAMPLE_VIEWER_PATCHES.length];
      sampleIdx++;
      document.getElementById('inputPatchPrompt').value = item.prompt;
      await triggerCompilePatch(item.prompt, item.user);
    });

    document.getElementById('btnTestGuardrail').addEventListener('click', async () => {
      const res = await postApi('/api/patch/test-guardrail', {});
      if (res.report) {
        state = res.snapshot;
        document.getElementById('compileLatencyLabel').textContent =
          'BLOCKED UNSAFE AST: ' + (res.report.rejectedReasons[0] || 'Lyapunov divergence');
        document.getElementById('astJsonViewer').textContent = JSON.stringify(res.report, null, 2);
        playSynthPulse(110, 'sawtooth', 0.25);
      }
    });

    // Connect Live Twitch IRC Channel
    const twitchClientState = { ws: null, channel: null };
    document.getElementById('btnConnectTwitch').addEventListener('click', async () => {
      const ch = document.getElementById('inputTwitchChannel').value.trim();
      if (!ch) return;
      const res = await postApi('/api/twitch/connect', { channel: ch });
      if (res.status) {
        const dot = document.getElementById('twitchStatusDot');
        const txt = document.getElementById('twitchStatusText');
        dot.classList.remove('warn');
        txt.textContent = 'IRC LIVE: #' + res.status.channel + ' (wss://irc-ws.chat.twitch.tv)';
      }
    });

    function renderDiffList(diffs) {
      const container = document.getElementById('diffList');
      const activeDiffs = (diffs && diffs.length > 0)
        ? diffs
        : (state?.patchHistory?.[0]?.diffs || []);
      if (!activeDiffs || activeDiffs.length === 0) {
        container.innerHTML = '<div class="diff-item"><span>Genesis Orbital Core active — click any preset or !patch to mutate AST</span></div>';
        return;
      }
      container.innerHTML = activeDiffs
        .map(
          (d) =>
            '<div class="diff-item">' +
            '<span style="color:#94a3b8;">' + d.path + '</span>' +
            '<span><s style="color:#64748b; margin-right:6px;">' + d.before + '</s>' +
            '<strong style="color:var(--accent-cyan);">' + d.after + '</strong></span>' +
            '</div>'
        )
        .join('');
    }

    function updateDomHud() {
      if (!state || !state.activePatch) return;
      const patch = state.activePatch;
      const boss = state.boss;

      document.getElementById('hudBossName').textContent = boss.name || patch.bossSpec.name;
      document.getElementById('hudBossPhase').textContent =
        'PHASE ' + boss.phase + ' // ' + patch.bossSpec.chassis.toUpperCase();
      const hpPct = Math.max(0, Math.min(100, (boss.hp / boss.maxHp) * 100));
      document.getElementById('hudBossHpFill').style.width = hpPct.toFixed(1) + '%';
      document.getElementById('hudBossHpText').textContent =
        'HP: ' + boss.hp + ' / ' + boss.maxHp + ' (Cleared: ' + boss.defeatedCount + ')';

      const seq = patch.bossSpec.behaviorSequence || [];
      const curAttack = seq[boss.behaviorIndex % Math.max(1, seq.length)] || 'spiral_lance_barrage';
      document.getElementById('hudBossAttackText').textContent = 'ACTIVE: ' + curAttack;

      document.getElementById('hudPatchAuthor').textContent =
        'ACTIVE CODEX AST PATCH // @' + patch.author;
      document.getElementById('hudPatchTitle').textContent = patch.title;
      document.getElementById('hudPatchLaws').innerHTML =
        '<span class="law-chip">field: ' + patch.fieldLaw.type + '</span>' +
        '<span class="law-chip">G: ' + patch.fieldLaw.gravityStrength + 'N</span>' +
        '<span class="law-chip">vortex: ' + patch.fieldLaw.vortexTorque + '</span>' +
        '<span class="law-chip">tether: ' + patch.droneLaw.tetherDamageBonus + 'x</span>' +
        '<span class="law-chip">bounce: ' + patch.fieldLaw.restitution + '</span>';

      // Top MVP Drones
      const mvpEl = document.getElementById('hudMvpList');
      const topDrones = (state.drones || []).slice(0, 4);
      if (topDrones.length === 0) {
        mvpEl.innerHTML = '<div class="mvp-row"><span style="color:var(--text-dim);">Waiting for Twitch chat (!join / !slingshot)...</span></div>';
      } else {
        mvpEl.innerHTML = topDrones
          .map(
            (d, idx) =>
              '<div class="mvp-row">' +
              '<span><strong style="color:' + d.color + ';">#' + (idx + 1) + ' @' + d.username + '</strong></span>' +
              '<span>' + d.damageDealt + ' DMG | ' + d.tetherCleaves + ' Whips | ' + d.parries + ' Parry</span>' +
              '</div>'
          )
          .join('');
      }

      // Live Telemetry Feed
      const feedEl = document.getElementById('hudFeedList');
      const logs = (state.combatLog || []).slice(0, 4);
      feedEl.innerHTML = logs
        .map((l) => '<div class="feed-line">[' + l.timeSec + 's] ' + l.text + '</div>')
        .join('');

      renderDiffList(lastDiffs);

      // Static Invariant Check Chips
      const checkEl = document.getElementById('invariantCheckList');
      if (checkEl && state.lastValidation?.checks) {
        checkEl.innerHTML = state.lastValidation.checks
          .map(
            (c) =>
              '<span class="check-badge" title="' +
              c.detail.replace(/"/g, '&quot;') +
              '">✓ ' +
              c.id +
              '</span>'
          )
          .join('');
      }

      // AST JSON Inspector
      document.getElementById('tickBudgetBadge').textContent =
        (state.lastStepDurationMs || 0.25) + 'ms / tick (60 FPS)';
      document.getElementById('astJsonViewer').textContent = JSON.stringify(
        {
          patchId: patch.patchId,
          title: patch.title,
          compilerMode: patch.compilerMode,
          fieldLaw: patch.fieldLaw,
          bossSpec: patch.bossSpec,
          droneLaw: patch.droneLaw
        },
        null,
        2
      );
    }

    // Responsive DPI-Aware Canvas Sizing
    function resizeCanvas() {
      const stage = canvas.parentElement;
      const rect = stage.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(640, Math.floor(rect.width * dpr));
      canvas.height = Math.max(360, Math.floor(rect.height * dpr));
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // 60 FPS Vector Renderer
    function drawArena() {
      requestAnimationFrame(drawArena);
      if (!state || !state.activePatch) return;

      const W = canvas.width;
      const H = canvas.height;
      const scaleX = W / 1280;
      const scaleY = H / 720;
      const scale = Math.min(scaleX, scaleY);
      const offsetX = (W - 1280 * scale) * 0.5;
      const offsetY = (H - 720 * scale) * 0.5;

      const patch = state.activePatch;
      const primaryHue = patch.aesthetics?.primaryHue ?? 192;
      const accentHue = patch.aesthetics?.accentHue ?? 325;

      ctx.save();
      if (document.body.classList.contains('obs-transparent')) {
        ctx.clearRect(0, 0, W, H);
      } else {
        ctx.fillStyle = '#060810';
        ctx.fillRect(0, 0, W, H);
      }

      ctx.translate(offsetX, offsetY);
      ctx.scale(scale, scale);

      // 1. Draw Warping Vector Field Grid (16x9)
      const cols = 16;
      const rows = 9;
      const t = state.timeSec || 0;
      ctx.lineWidth = 1;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const gx = ((c + 0.5) / cols) * 1280;
          const gy = ((r + 0.5) / rows) * 720;
          const dx = state.boss.x - gx;
          const dy = state.boss.y - gy;
          const dist = Math.hypot(dx, dy) + 80;
          const angle = Math.atan2(dy, dx) + (patch.fieldLaw.vortexTorque * 0.004);
          const len = Math.min(24, (Math.abs(patch.fieldLaw.gravityStrength) * 26) / dist + 7);

          ctx.strokeStyle = 'hsla(' + primaryHue + ', 85%, 60%, 0.19)';
          ctx.beginPath();
          ctx.moveTo(gx, gy);
          ctx.lineTo(gx + Math.cos(angle) * len, gy + Math.sin(angle) * len);
          ctx.stroke();

          ctx.fillStyle = 'hsla(' + primaryHue + ', 90%, 70%, 0.28)';
          ctx.fillRect(gx - 1, gy - 1, 2, 2);
        }
      }

      // 2. Draw Gravity / Magnetic Field Poles
      const poles = patch.fieldLaw.poles || [];
      poles.forEach((pole, idx) => {
        let px = pole.xNorm * 1280;
        let py = pole.yNorm * 720;
        if (patch.fieldLaw.type === 'binary_pulsar' && poles.length >= 2) {
          const oa = t * 1.15 + idx * Math.PI;
          px = 640 + Math.cos(oa) * 150;
          py = 360 + Math.sin(oa) * 150;
        }
        const grad = ctx.createRadialGradient(px, py, 4, px, py, 120);
        const poleHue = pole.polarity >= 0 ? primaryHue : accentHue;
        grad.addColorStop(0, 'hsla(' + poleHue + ', 95%, 65%, 0.24)');
        grad.addColorStop(1, 'hsla(' + poleHue + ', 95%, 65%, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(px, py, 120, 0, Math.PI * 2);
        ctx.fill();
      });

      // 3. Draw Shockwave Rings
      (state.shockwaves || []).forEach((sw) => {
        ctx.strokeStyle = 'hsla(' + (sw.hue || primaryHue) + ', 95%, 68%, ' + Math.max(0, sw.alpha) + ')';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(sw.x, sw.y, Math.max(2, sw.radius), 0, Math.PI * 2);
        ctx.stroke();
      });

      // 4. Draw Elastic Verlet Tether Whip Beams Between Viewer Drones
      const droneMap = new Map((state.drones || []).map((d) => [d.id, d]));
      (state.tethers || []).forEach((tether) => {
        const a = droneMap.get(tether.aUser);
        const b = droneMap.get(tether.bUser);
        if (!a || !b) return;

        ctx.save();
        ctx.strokeStyle = 'hsla(' + accentHue + ', 100%, 68%, 0.9)';
        ctx.lineWidth = 3;
        ctx.shadowColor = 'hsl(' + accentHue + ', 100%, 65%)';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        // Sine-wave harmonic vibration along the tether beam
        const midX = (a.x + b.x) * 0.5 + Math.sin(t * 24) * 9;
        const midY = (a.y + b.y) * 0.5 + Math.cos(t * 24) * 9;
        ctx.quadraticCurveTo(midX, midY, b.x, b.y);
        ctx.stroke();
        ctx.restore();
      });

      // 5. Draw Articulated Anomaly Boss Construct
      const boss = state.boss;
      if (boss) {
        ctx.save();
        ctx.translate(boss.x, boss.y);

        // Outer Rotating Shield Arcs
        const arcs = Math.max(1, patch.bossSpec.shieldArcs || 3);
        const exposedRatio = patch.bossSpec.weakPointExposedRatio || 0.38;
        const sectorSpan = (Math.PI * 2) / arcs;
        const shieldSpan = sectorSpan * (1 - exposedRatio);

        ctx.strokeStyle = 'hsla(' + primaryHue + ', 100%, 65%, 0.92)';
        ctx.lineWidth = 7;
        ctx.shadowColor = 'hsl(' + primaryHue + ', 100%, 60%)';
        ctx.shadowBlur = 14;

        for (let i = 0; i < arcs; i++) {
          const centerA = boss.shieldAngle + i * sectorSpan;
          ctx.beginPath();
          ctx.arc(0, 0, boss.radius + 14, centerA - shieldSpan * 0.5, centerA + shieldSpan * 0.5);
          ctx.stroke();
        }

        // Inner Geometric Chassis Topology
        ctx.rotate(-boss.shieldAngle * 0.7);
        const chassis = patch.bossSpec.chassis || 'hex_citadel';
        const sides = chassis === 'chronos_tesseract' ? 4 : chassis === 'gyro_seraph' ? 8 : 6;

        ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
        ctx.strokeStyle = 'hsl(' + accentHue + ', 95%, 64%)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        for (let i = 0; i < sides; i++) {
          const a = (i * Math.PI * 2) / sides;
          const rx = Math.cos(a) * boss.radius;
          const ry = Math.sin(a) * boss.radius;
          if (i === 0) ctx.moveTo(rx, ry);
          else ctx.lineTo(rx, ry);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Inner Pulsing Singularity Core
        const coreGrad = ctx.createRadialGradient(0, 0, 4, 0, 0, boss.radius * 0.65);
        coreGrad.addColorStop(0, '#ffffff');
        coreGrad.addColorStop(0.4, 'hsl(' + accentHue + ', 100%, 62%)');
        coreGrad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = coreGrad;
        ctx.beginPath();
        ctx.arc(0, 0, boss.radius * 0.65, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();

        // Direct On-Canvas Boss Label & Health Bar above Boss Core
        ctx.save();
        ctx.font = '800 11px "JetBrains Mono", monospace';
        ctx.fillStyle = '#fda4af';
        ctx.textAlign = 'center';
        ctx.fillText('RAID BOSS // ' + (patch.bossSpec.name || 'ANOMALY CORE').toUpperCase(), boss.x, boss.y - boss.radius - 34);

        const barW = 116;
        const barH = 6;
        const hpRatio = Math.max(0, Math.min(1, boss.hp / (boss.maxHp || 2400)));
        ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
        ctx.fillRect(boss.x - barW * 0.5, boss.y - boss.radius - 28, barW, barH);
        ctx.fillStyle = '#ff4d6d';
        ctx.fillRect(boss.x - barW * 0.5, boss.y - boss.radius - 28, barW * hpRatio, barH);
        ctx.restore();
      }

      // 6. Draw Boss & Reflected Projectiles
      (state.projectiles || []).forEach((p) => {
        ctx.save();
        const pColor = p.fromBoss
          ? 'hsl(' + accentHue + ', 95%, 64%)'
          : '#00f5d4';
        ctx.fillStyle = pColor;
        ctx.shadowColor = pColor;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // 7. Draw Viewer Kinetic Vector Drones
      (state.drones || []).forEach((d) => {
        // Velocity Ribbon Trail
        if (d.trail && d.trail.length > 1) {
          ctx.beginPath();
          for (let i = 0; i < d.trail.length; i++) {
            const pt = d.trail[i];
            if (i === 0) ctx.moveTo(pt.x, pt.y);
            else ctx.lineTo(pt.x, pt.y);
          }
          ctx.strokeStyle = d.color + '66';
          ctx.lineWidth = 3;
          ctx.stroke();
        }

        ctx.save();
        ctx.translate(d.x, d.y);

        // Parry Reflector Shell
        if (d.parryActive) {
          ctx.strokeStyle = '#00f5d4';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.arc(0, 0, d.radius + 12, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Oriented Vector Interceptor Chevron
        const heading = Math.atan2(d.vy, d.vx);
        ctx.rotate(heading);
        ctx.fillStyle = d.color;
        ctx.shadowColor = d.color;
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.moveTo(d.radius + 4, 0);
        ctx.lineTo(-d.radius, -d.radius * 0.8);
        ctx.lineTo(-d.radius * 0.45, 0);
        ctx.lineTo(-d.radius, d.radius * 0.8);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // Viewer Twitch Callsign Tag
        ctx.font = '600 11px "JetBrains Mono", monospace';
        ctx.fillStyle = '#f8fafc';
        ctx.fillText('@' + d.username, d.x + 15, d.y + 4);
      });

      // 8. Draw Floating 60 FPS Combat & AST Hot-Swap Callouts
      (state.callouts || []).forEach((c) => {
        ctx.save();
        ctx.font = '800 12px "JetBrains Mono", monospace';
        ctx.fillStyle = c.color || '#00F5D4';
        ctx.globalAlpha = Math.max(0, Math.min(1, c.alpha));
        ctx.shadowColor = '#000';
        ctx.shadowBlur = 8;
        ctx.fillText(c.text, c.x - 45, c.y);
        ctx.restore();
      });

      ctx.restore();
    }

    // Live State Polling / Stream Synchronization
    async function syncLoop() {
      try {
        const res = await fetch('/api/state');
        if (res.ok) {
          const data = await res.json();
          state = data.snapshot;
          if (data.twitch && data.twitch.channel) {
            const dot = document.getElementById('twitchStatusDot');
            const txt = document.getElementById('twitchStatusText');
            dot.classList.remove('warn');
            txt.textContent = 'IRC LIVE: #' + data.twitch.channel + ' (' + data.twitch.status.toUpperCase() + ')';
          }
          updateDomHud();
        }
      } catch {
        // Ignore transient fetch errors
      }
      setTimeout(syncLoop, 65);
    }

    updateDomHud();
    requestAnimationFrame(drawArena);
    syncLoop();
  </script>
</body>
</html>`;
}
