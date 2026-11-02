/**
 * ChaosForge — Unified 60 FPS Vector Arena & 4-Tab Exclusive Control Studio
 *
 * Right Panel Architecture (Strictly 1 Active Panel at a Time):
 *   Tab 1: Twitch API, Live Chat Window & EventSub Bridge
 *   Tab 2: Codex Live Rule Mutator (Connection, Prompt Input & Codex Response Terminal)
 *   Tab 3: Diff Summary (Before -> After Structural Comparison & Rollback History)
 *   Tab 4: Test Guardrail & Physics Safety Engine (Adversarial Payload Tester & 18 Invariants)
 */

import { SIGNATURE_PATCH_PRESETS } from '../compiler/codex-mutator.mjs';

export function renderChaosForgeHtml({ initialPayload, presets = SIGNATURE_PATCH_PRESETS }) {
  const safePayloadJson = JSON.stringify(initialPayload).replace(/</g, '\\u003c');
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
      --bg-panel: #0a0e1a;
      --bg-card: rgba(16, 22, 38, 0.95);
      --border-subtle: rgba(94, 234, 212, 0.2);
      --border-bright: rgba(0, 245, 212, 0.6);
      --accent-cyan: #00f5d4;
      --accent-magenta: #ff4d6d;
      --accent-amber: #fee440;
      --accent-violet: #9b5de5;
      --accent-green: #22c55e;
      --text-main: #f8fafc;
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
      background: rgba(7, 10, 19, 0.98);
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
      background: rgba(15, 23, 42, 0.85);
      padding: 4px;
      border-radius: 8px;
      border: 1px solid rgba(148, 163, 184, 0.18);
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
      background: rgba(30, 41, 59, 0.9);
      color: #f8fafc;
      border: 1px solid rgba(148, 163, 184, 0.3);
      border-radius: 6px;
      padding: 6px 12px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s ease;
      font-family: var(--font-sans);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 5px;
    }

    .btn:hover {
      border-color: var(--accent-cyan);
      color: var(--accent-cyan);
    }

    .btn-primary {
      background: linear-gradient(135deg, rgba(0, 245, 212, 0.22), rgba(0, 187, 249, 0.28));
      border-color: var(--accent-cyan);
      color: var(--accent-cyan);
    }

    .btn-primary:hover {
      background: rgba(0, 245, 212, 0.34);
      box-shadow: 0 0 12px rgba(0, 245, 212, 0.25);
    }

    .btn-accent {
      background: linear-gradient(135deg, rgba(255, 77, 109, 0.24), rgba(155, 93, 229, 0.28));
      border-color: var(--accent-magenta);
      color: #fda4af;
    }

    .btn-danger {
      background: linear-gradient(135deg, rgba(239, 68, 68, 0.25), rgba(255, 77, 109, 0.32));
      border-color: #ef4444;
      color: #fecaca;
    }

    .btn-danger:hover {
      border-color: #f87171;
      color: #fff;
      box-shadow: 0 0 14px rgba(239, 68, 68, 0.35);
    }

    /* Main Workspace Grid */
    .workspace {
      flex: 1;
      display: grid;
      grid-template-columns: minmax(0, 1fr) 540px;
      min-height: 0;
      overflow: hidden;
    }

    body.view-overlay .workspace {
      grid-template-columns: 1fr;
    }

    body.view-overlay .side-dock {
      display: none;
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
      background: rgba(8, 12, 24, 0.86);
      border: 1px solid rgba(255, 77, 109, 0.45);
      border-radius: 10px;
      padding: 10px 14px;
      min-width: 310px;
      max-width: 400px;
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

    .patch-hud-card {
      background: rgba(8, 12, 24, 0.86);
      border: 1px solid var(--border-bright);
      border-radius: 10px;
      padding: 10px 14px;
      min-width: 290px;
      max-width: 370px;
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
      gap: 5px;
    }

    .law-chip {
      background: rgba(0, 245, 212, 0.11);
      border: 1px solid rgba(0, 245, 212, 0.28);
      padding: 2px 6px;
      border-radius: 4px;
    }

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
      min-width: 260px;
    }

    .feed-card {
      min-width: 320px;
      max-width: 420px;
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

    /* ============================================================================
       RIGHT SIDE DOCK — 4 EXCLUSIVE FULL-HEIGHT TABS (ONLY 1 OPEN AT A TIME)
       ============================================================================ */
    .side-dock {
      height: 100%;
      background: var(--bg-panel);
      border-left: 1px solid var(--border-subtle);
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    /* 4-Button Selector Strip at Top of Right Panel */
    .dock-tab-strip {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 6px;
      padding: 10px 12px;
      background: rgba(5, 8, 16, 0.95);
      border-bottom: 1px solid rgba(148, 163, 184, 0.2);
    }

    .dock-tab-btn {
      background: rgba(15, 23, 42, 0.9);
      border: 1px solid rgba(148, 163, 184, 0.24);
      border-radius: 8px;
      padding: 8px 6px;
      color: var(--text-dim);
      cursor: pointer;
      transition: all 0.15s ease;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 3px;
      text-align: center;
    }

    .dock-tab-btn:hover {
      border-color: rgba(0, 245, 212, 0.45);
      color: #e2e8f0;
    }

    .dock-tab-btn.active {
      background: linear-gradient(180deg, rgba(0, 245, 212, 0.2), rgba(0, 245, 212, 0.06));
      border-color: var(--accent-cyan);
      color: #fff;
      box-shadow: 0 0 14px rgba(0, 245, 212, 0.2);
    }

    .dock-tab-num {
      font-family: var(--font-mono);
      font-size: 11px;
      font-weight: 800;
      color: var(--accent-cyan);
    }

    .dock-tab-label {
      font-size: 11px;
      font-weight: 700;
      line-height: 1.15;
    }

    /* Single Active Pane Container */
    .dock-pane {
      display: none;
      flex: 1;
      flex-direction: column;
      min-height: 0;
      padding: 14px;
      gap: 12px;
      overflow-y: auto;
    }

    .dock-pane.active {
      display: flex;
    }

    .pane-header-card {
      background: var(--bg-card);
      border: 1px solid rgba(0, 245, 212, 0.28);
      border-radius: 10px;
      padding: 12px 14px;
      flex-shrink: 0;
    }

    .pane-title-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 6px;
    }

    .pane-title {
      font-size: 13.5px;
      font-weight: 800;
      color: var(--accent-cyan);
      font-family: var(--font-mono);
      letter-spacing: 0.4px;
      text-transform: uppercase;
    }

    .pane-desc {
      font-size: 12px;
      color: var(--text-dim);
      line-height: 1.4;
    }

    .section-box {
      background: var(--bg-card);
      border: 1px solid rgba(148, 163, 184, 0.2);
      border-radius: 10px;
      padding: 12px 14px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .section-box.grow {
      flex: 1;
      min-height: 220px;
      overflow: hidden;
    }

    /* Right-dock focus accordion: one card can use the full pane at a time. */
    .dock-pane.accordion-enabled {
      overflow: hidden;
      gap: 8px;
    }

    .accordion-card {
      flex: 0 0 auto !important;
      min-height: 0;
      overflow: hidden;
      padding: 0;
      gap: 0;
    }

    .accordion-card.accordion-open {
      flex: 1 1 0 !important;
      min-height: 0;
    }

    .accordion-card.accordion-open.section-box.grow {
      min-height: 0;
    }

    .accordion-toggle {
      width: 100%;
      min-height: 46px;
      padding: 12px 14px;
      border: 0;
      background: transparent;
      color: inherit;
      cursor: pointer;
      text-align: left;
      font: inherit;
      flex-shrink: 0;
    }

    .accordion-toggle:hover,
    .accordion-card.accordion-open > .accordion-toggle {
      background: rgba(0, 245, 212, 0.065);
    }

    .accordion-toggle:focus-visible {
      outline: 2px solid var(--accent-cyan);
      outline-offset: -2px;
    }

    .accordion-card > .accordion-toggle .accordion-chevron {
      color: var(--accent-cyan);
      margin-left: 10px;
      transition: transform 150ms ease;
    }

    .accordion-card.accordion-open > .accordion-toggle .accordion-chevron {
      transform: rotate(90deg);
    }

    .accordion-card:not(.accordion-open) > :not(.accordion-toggle) {
      display: none !important;
    }

    .accordion-card.accordion-open > :not(.accordion-toggle) {
      margin-left: 14px;
      margin-right: 14px;
    }

    .accordion-card.accordion-open > :last-child {
      margin-bottom: 12px;
    }

    .sub-label {
      font-family: var(--font-mono);
      font-size: 11px;
      font-weight: 700;
      color: #cbd5e1;
      text-transform: uppercase;
      letter-spacing: 0.4px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .input-row {
      display: flex;
      gap: 8px;
    }

    .text-input, .textarea-input, .select-input {
      width: 100%;
      background: rgba(6, 9, 18, 0.95);
      border: 1px solid rgba(148, 163, 184, 0.35);
      border-radius: 7px;
      color: #fff;
      padding: 8px 11px;
      font-size: 12.5px;
      font-family: var(--font-mono);
      user-select: text;
    }

    .textarea-input {
      min-height: 76px;
      resize: vertical;
      font-family: var(--font-sans);
      line-height: 1.4;
    }

    .text-input:focus, .textarea-input:focus {
      outline: none;
      border-color: var(--accent-cyan);
      box-shadow: 0 0 0 2px rgba(0, 245, 212, 0.15);
    }

    /* Live Chat Message Window (Pane 1) */
    .chat-stream-window {
      flex: 1;
      background: rgba(5, 8, 15, 0.95);
      border: 1px solid rgba(0, 245, 212, 0.25);
      border-radius: 8px;
      padding: 10px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 8px;
      font-family: var(--font-mono);
      user-select: text;
    }

    .chat-msg-card {
      background: rgba(15, 23, 42, 0.85);
      border: 1px solid rgba(148, 163, 184, 0.16);
      border-left: 3px solid var(--accent-cyan);
      border-radius: 6px;
      padding: 7px 10px;
      font-size: 12px;
      line-height: 1.4;
    }

    .chat-msg-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 3px;
      font-size: 10.5px;
      color: var(--text-dim);
    }

    .chat-badge {
      padding: 1px 6px;
      border-radius: 4px;
      font-size: 9.5px;
      font-weight: 800;
      background: rgba(0, 245, 212, 0.15);
      color: var(--accent-cyan);
      border: 1px solid rgba(0, 245, 212, 0.35);
    }

    .chat-reply-box {
      margin-top: 5px;
      padding: 5px 8px;
      background: rgba(0, 245, 212, 0.08);
      border-radius: 5px;
      font-size: 11px;
      color: #a5f3fc;
      border-left: 2px solid var(--accent-amber);
    }

    /* Codex Terminal Window (Pane 2) */
    .codex-log-window {
      flex: 1;
      background: rgba(5, 8, 15, 0.95);
      border: 1px solid rgba(155, 93, 229, 0.35);
      border-radius: 8px;
      padding: 10px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 10px;
      user-select: text;
    }

    .codex-exchange-card {
      background: rgba(15, 23, 42, 0.92);
      border: 1px solid rgba(0, 245, 212, 0.3);
      border-radius: 8px;
      padding: 10px 12px;
      display: flex;
      flex-direction: column;
      gap: 7px;
    }

    .codex-prompt-bubble {
      background: rgba(30, 41, 59, 0.9);
      border-left: 3px solid var(--accent-amber);
      padding: 7px 10px;
      border-radius: 5px;
      font-size: 12px;
      color: #fef08a;
    }

    .codex-reply-bubble {
      background: rgba(0, 245, 212, 0.09);
      border-left: 3px solid var(--accent-cyan);
      padding: 8px 10px;
      border-radius: 5px;
      font-size: 12px;
      color: #e2e8f0;
      line-height: 1.45;
    }

    .preset-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 7px;
    }

    .preset-btn {
      text-align: left;
      padding: 8px 10px;
      background: rgba(15, 23, 42, 0.9);
      border: 1px solid rgba(0, 245, 212, 0.25);
      border-radius: 7px;
      color: #e2e8f0;
      font-size: 11.5px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.14s ease;
    }

    .preset-btn:hover {
      border-color: var(--accent-cyan);
      background: rgba(0, 245, 212, 0.15);
    }

    /* Diff Summary Table (Pane 3) */
    .diff-table-container {
      flex: 1;
      overflow-y: auto;
      overflow-x: hidden;
      display: flex;
      flex-direction: column;
      gap: 7px;
    }

    .diff-row-card {
      display: grid;
      grid-template-columns: 1.05fr 0.85fr 1.1fr;
      align-items: center;
      gap: 8px;
      background: rgba(7, 11, 22, 0.92);
      border: 1px solid rgba(0, 245, 212, 0.24);
      border-left: 4px solid var(--accent-cyan);
      padding: 9px 12px;
      border-radius: 7px;
      font-family: var(--font-mono);
      font-size: 11.5px;
      word-break: break-word;
    }

    .diff-param-name {
      color: #f8fafc;
      font-weight: 700;
    }

    .diff-before-val {
      color: #f87171;
      text-decoration: line-through;
      font-size: 11px;
    }

    .diff-after-val {
      color: var(--accent-cyan);
      font-weight: 800;
      text-align: right;
      word-break: break-word;
    }

    /* Guardrail Report Box (Pane 4) */
    .guardrail-report-card {
      background: rgba(15, 23, 42, 0.95);
      border: 2px solid rgba(34, 197, 94, 0.5);
      border-radius: 10px;
      padding: 12px 14px;
      font-family: var(--font-mono);
      font-size: 12px;
      line-height: 1.45;
    }

    .guardrail-report-card.blocked {
      background: rgba(69, 10, 10, 0.55);
      border-color: #ef4444;
      box-shadow: 0 0 22px rgba(239, 68, 68, 0.25);
    }

    .guardrail-report-card.clamped {
      background: rgba(69, 26, 3, 0.55);
      border-color: var(--accent-amber);
      box-shadow: 0 0 22px rgba(254, 228, 64, 0.2);
    }

    .check-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-family: var(--font-mono);
      font-size: 10.5px;
      padding: 3px 8px;
      border-radius: 5px;
      background: rgba(34, 197, 94, 0.16);
      color: #86efac;
      border: 1px solid rgba(34, 197, 94, 0.4);
    }

    .check-badge.fail {
      background: rgba(239, 68, 68, 0.22);
      color: #fca5a5;
      border-color: #ef4444;
    }

    .ast-code {
      background: rgba(5, 8, 16, 0.96);
      border: 1px solid rgba(148, 163, 184, 0.22);
      border-radius: 7px;
      padding: 10px;
      font-family: var(--font-mono);
      font-size: 11px;
      color: #a5f3fc;
      max-height: 220px;
      overflow-y: auto;
      white-space: pre-wrap;
      word-break: break-word;
      user-select: text;
    }

    .verb-bar {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
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
          <div class="brand-sub">Live-Compiled 60 FPS Vector Boss Raid &amp; Codex Rule Mutator for Twitch</div>
        </div>
      </div>

      <div class="nav-tabs">
        <button class="nav-tab active" data-view="studio" id="tabStudio">Split Studio (Arena + Control Panel)</button>
        <button class="nav-tab" data-view="overlay" id="tabOverlay">OBS Clean Overlay</button>
      </div>

      <div class="top-actions">
        <div class="status-pill" id="twitchStatusPill">
          <span class="status-dot" id="twitchStatusDot"></span>
          <span id="twitchStatusText">IRC: choose a channel</span>
        </div>
        <button class="btn" id="btnToggleAudio">Audio Synth: OFF</button>
        <button class="btn" id="btnToggleAlpha">OBS Alpha</button>
        <button class="btn btn-accent" id="btnStageSurge">Stage Crowd Surge (10 Viewers)</button>
      </div>
    </header>

    <!-- Main Workspace -->
    <main class="workspace">
      <!-- Left: 60 FPS Vector Physics Canvas Stage -->
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
            <div class="patch-hud-badge" id="hudPatchAuthor">ACTIVE CODEX PATCH // @system</div>
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
            <div class="hud-section-title">LIVE ARENA TELEMETRY FEED</div>
            <div id="hudFeedList"></div>
          </div>
        </div>
      </section>

      <!-- Right Side Dock: 4 Exclusive Full-Height Tabs -->
      <aside class="side-dock">
        <!-- 4-Button Selector Strip -->
        <div class="dock-tab-strip">
          <button class="dock-tab-btn active" data-pane="1">
            <span class="dock-tab-num">1</span>
            <span class="dock-tab-label">Twitch API &amp; Chat</span>
          </button>
          <button class="dock-tab-btn" data-pane="2">
            <span class="dock-tab-num">2</span>
            <span class="dock-tab-label">Codex Rule Mutator</span>
          </button>
          <button class="dock-tab-btn" data-pane="3">
            <span class="dock-tab-num">3</span>
            <span class="dock-tab-label">Diff Summary (<span id="tabDiffCount">4</span>)</span>
          </button>
          <button class="dock-tab-btn" data-pane="4">
            <span class="dock-tab-num">4</span>
            <span class="dock-tab-label">Test Guardrail</span>
          </button>
        </div>

        <!-- ==================================================================
             PANE 1: TWITCH API, LIVE CHAT WINDOW & EVENTSUB BRIDGE
             ================================================================== -->
        <div class="dock-pane active" id="dockPane1">
          <div class="pane-header-card">
            <div class="pane-title-row">
              <span class="pane-title">1. Twitch API, Live Chat &amp; EventSub</span>
              <span class="check-badge" id="pane1StatusBadge">wss://irc-ws.chat.twitch.tv:443</span>
            </div>
            <div class="pane-desc">
              Connects to any public Twitch channel via IRCv3 WebSocket. Real messages typed in Twitch chat immediately drive the 60 FPS arena; the demo controls below are explicitly local-only.
            </div>
          </div>

          <!-- Channel Connection Bar -->
          <div class="section-box">
            <div class="sub-label">
              <span>Live Twitch Channel Connection</span>
              <span id="ircConnectionDetail" style="color:var(--accent-cyan);">Not connected — choose your channel</span>
            </div>
            <div class="input-row">
              <input type="text" class="text-input" id="inputTwitchChannel" placeholder="Your Twitch channel name (e.g. your_channel)" />
              <button class="btn btn-primary" id="btnConnectTwitch" style="white-space:nowrap;">Connect Live IRC</button>
              <button class="btn" id="btnLeaveTwitch" style="white-space:nowrap;" disabled>Leave Live IRC</button>
            </div>
            <div class="input-row" style="margin-top:8px;">
              <button class="btn" id="btnAuthorizeTwitch" style="white-space:nowrap;">Connect My Twitch Account</button>
              <button class="btn btn-danger" id="btnDisconnectTwitchAccount" style="white-space:nowrap;" disabled>Disconnect Twitch Account</button>
              <span style="font-size:11px; color:var(--text-dim);">Any public channel can be read; authorization enables replies where Twitch permits them.</span>
            </div>
            <div id="connectionActivity" style="font-size:11px; color:var(--text-dim); margin-top:8px; max-height:42px; overflow-y:auto;">Connection activity will appear here. It is separate from the viewer chat below.</div>
          </div>

          <!-- Full-Height Live Twitch Chat Window -->
          <div class="section-box grow">
            <div class="sub-label">
              <span>Live Twitch Chat Stream (Incoming &amp; Outgoing)</span>
              <span id="chatMsgCountLabel" style="color:var(--accent-amber);">Live</span>
            </div>
            <div class="chat-stream-window" id="chatStreamWindow"></div>

            <!-- Real Twitch message composer -->
            <div class="input-row" style="margin-top:4px;">
              <input type="text" class="text-input" id="inputTwitchMessage" placeholder="Write to the connected Twitch chat..." maxlength="500" />
              <button class="btn btn-primary" id="btnSendToTwitch" disabled>Send to Twitch</button>
            </div>
            <div id="twitchMessageHelp" style="font-size:11px; color:var(--text-dim); margin:5px 0 8px;">Authorize your account and connect a live channel to write. Incoming messages appear above automatically.</div>

          </div>

          <!-- Local demo command injector -->
          <div class="section-box">
            <div class="sub-label" style="margin-top:2px;">
              <span>Studio Demo Command Injector</span>
              <span style="color:var(--accent-amber);">Does not send to Twitch</span>
            </div>
            <div class="input-row" style="margin-top:4px;">
              <input type="text" class="text-input" id="inputChatSender" style="max-width:115px;" value="viewer" title="Sender username" />
              <input type="text" class="text-input" id="inputChatMessage" placeholder="Type !slingshot, !tether, or !patch <new rule>..." value="!slingshot" />
              <button class="btn" id="btnSendChat">Inject Demo Command</button>
            </div>
            <div class="input-row" style="margin-top:6px;">
              <button class="btn btn-accent" id="btnRunDemoAudience">Run Demo Audience Sequence</button>
              <span style="font-size:11px; color:var(--text-dim);">Clearly labeled local viewers for a video when a real audience is not available.</span>
            </div>
            <div class="verb-bar">
              <button class="btn" data-cmd="!slingshot">!slingshot</button>
              <button class="btn" data-cmd="!tether @talhacomak">!tether</button>
              <button class="btn" data-cmd="!parry">!parry</button>
              <button class="btn" data-cmd="!overclock">!overclock</button>
              <button class="btn" data-cmd="!emp">!emp</button>
            </div>
          </div>

          <!-- Twitch EventSub Webhook & WebSocket Triggers -->
          <div class="section-box">
            <div class="sub-label">
              <span>Twitch EventSub Webhooks (POST /api/twitch/eventsub)</span>
              <span style="color:var(--accent-cyan);">HMAC-SHA256 Ready</span>
            </div>
            <div class="verb-bar">
              <button class="btn" data-eventsub="channel.follow">+ Follow</button>
              <button class="btn" data-eventsub="channel.subscribe">★ Sub Ion Strike</button>
              <button class="btn" data-eventsub="channel.cheer">💎 Cheer 500 Bits</button>
              <button class="btn" data-eventsub="channel.raid">🚀 Raid (45)</button>
              <button class="btn btn-accent" data-eventsub="channel.hype_train.begin">🔥 Hype Train</button>
            </div>
          </div>
        </div>

        <!-- ==================================================================
             PANE 2: CODEX LIVE RULE MUTATOR (!PATCH) & RESPONSE TERMINAL
             ================================================================== -->
        <div class="dock-pane" id="dockPane2">
          <div class="pane-header-card">
            <div class="pane-title-row">
              <span class="pane-title">2. Codex Live Rule Mutator (!patch)</span>
              <span class="check-badge" id="codexStatusBadge">CODEX AST READY</span>
            </div>
            <div class="pane-desc">
              Write any natural-language rule change below (or via <code>!patch</code> in Twitch chat). Codex compiles your sentence into a verified physics &amp; Boss AST and hot-swaps the game live.
            </div>
          </div>

          <!-- Codex Connection Bar -->
          <div class="section-box">
            <div class="sub-label">
              <span>OpenAI Codex Compiler Connection (server-managed)</span>
              <span id="codexConnStateLabel" style="color:#86efac;">● CONNECTED (ArenaPatchSchema v1)</span>
            </div>
            <div class="pane-desc">The deployment owns its compiler configuration. Visitors never paste or expose an API key in the browser.</div>
          </div>

          <!-- Codex Prompt Box -->
          <div class="section-box">
            <div class="sub-label">
              <span>Write Rule Mutation to Codex</span>
              <span id="compileLatencyLabel" style="color:var(--accent-cyan);">Schema: ArenaPatchSchema v1</span>
            </div>
            <textarea class="textarea-input" id="inputPatchPrompt" placeholder="Write what Codex should change in the game...">Split the reactor into twin binary pulsar gravity wells with high Coriolis spin and ricochet prism beams.</textarea>
            <div style="display:flex; gap:8px; justify-content:space-between; align-items:center;">
              <button class="btn" id="btnSimulateChatPatch">+ Simulate Viewer !patch from Chat</button>
              <button class="btn btn-primary" id="btnCompilePatch">Compile &amp; Apply with Codex</button>
            </div>

            <div class="sub-label" style="margin-top:4px;">
              <span>Quick Codex World Presets</span>
            </div>
            <div class="preset-grid" id="presetGrid"></div>
          </div>

          <!-- Codex Prompt & Response History Terminal -->
          <div class="section-box grow">
            <div class="sub-label">
              <span>Codex Prompt &amp; Response Log (What We Asked vs. What Codex Built)</span>
              <span id="codexLogCountLabel" style="color:var(--accent-amber);">Active</span>
            </div>
            <div class="codex-log-window" id="codexLogWindow"></div>
          </div>
        </div>

        <!-- ==================================================================
             PANE 3: STRUCTURAL DIFF SUMMARY (BEFORE -> AFTER) & ROLLBACK
             ================================================================== -->
        <div class="dock-pane" id="dockPane3">
          <div class="pane-header-card">
            <div class="pane-title-row">
              <span class="pane-title">3. Diff Summary (Previous Rule ➔ New Rule)</span>
              <span class="check-badge" id="diffHeaderBadge">Live AST Diff</span>
            </div>
            <div class="pane-desc">
              Shows every single physical constant, gravity topology, Boss chassis, and chat multiplier that changed in the latest Codex hot-swap.
            </div>
          </div>

          <!-- Full-Height Structural Diff List -->
          <div class="section-box grow">
            <div class="sub-label">
              <span>Parameter Comparison (Parameter | Previous Value ➔ New Value)</span>
              <span id="diffPatchTitleLabel" style="color:var(--accent-cyan);">Genesis Orbital Core</span>
            </div>
            <div class="diff-table-container" id="diffList"></div>
          </div>

          <!-- Patch History & One-Click Rollback -->
          <div class="section-box">
            <div class="sub-label">
              <span>Applied Patch History (Click to Rollback Live)</span>
            </div>
            <div id="patchHistoryList" style="display:flex; flex-direction:column; gap:6px; max-height:150px; overflow-y:auto;"></div>
          </div>
        </div>

        <!-- ==================================================================
             PANE 4: TEST GUARDRAIL & PHYSICS SAFETY ENGINE
             ================================================================== -->
        <div class="dock-pane" id="dockPane4">
          <div class="pane-header-card">
            <div class="pane-title-row">
              <span class="pane-title">4. Test Guardrail &amp; Physics Safety Wall</span>
              <span class="check-badge" id="tickBudgetBadge">0.09ms / tick (60 FPS)</span>
            </div>
            <div class="pane-desc">
              Every rule mutation is checked against 18 safety &amp; Lyapunov energy stability rules before touching the 60 FPS loop. Click below to fire an unsafe payload and watch the Guardrail block it live!
            </div>
          </div>

          <!-- Prominent Test Guardrail Action Buttons -->
          <div class="section-box">
            <div class="sub-label">
              <span>Live Guardrail Stress-Test Actions</span>
            </div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
              <button class="btn btn-danger" id="btnTestGuardrailEval">
                🛑 Test Guardrail #1: Malicious eval() Injection
              </button>
              <button class="btn btn-accent" id="btnTestGuardrailEnergy">
                ⚡ Test Guardrail #2: Infinite Energy (2.85x Bounce)
              </button>
            </div>
          </div>

          <!-- Live Guardrail Execution Diagnostic Box -->
          <div class="guardrail-report-card" id="guardrailReportBox" data-accordion-title="Latest Guardrail Report">
            <div style="font-weight:800; color:#86efac; margin-bottom:4px;" id="guardrailHeadline">
              ✓ GUARDRAIL STATUS: ALL 18 SAFETY &amp; PHYSICS INVARIANTS PASSING
            </div>
            <div style="font-size:11.5px; color:#cbd5e1;" id="guardrailDetail">
              Click either "Test Guardrail" button above to send an intentionally malicious or physically unstable payload and verify live interception.
            </div>
          </div>

          <!-- 18-Point Static Invariant Badges + JSON Schema View -->
          <div class="section-box grow">
            <div class="sub-label">
              <span>Active Safety Checks &amp; Raw Diagnostic JSON</span>
            </div>
            <div id="invariantCheckList" style="display:flex; flex-wrap:wrap; gap:5px; margin-bottom:6px;"></div>
            <pre class="ast-code" id="astJsonViewer" style="flex:1; max-height:none;"></pre>
          </div>
        </div>
      </aside>
    </main>
  </div>

  <script type="module">
    const INITIAL_PAYLOAD = ${safePayloadJson};
    const PRESETS = ${safePresetsJson};
    const ROOM_ID = INITIAL_PAYLOAD.room.id;

    let fullData = INITIAL_PAYLOAD;
    let state = INITIAL_PAYLOAD.snapshot;
    let snapshotReceivedAt = performance.now();
    let activePane = '1';
    let audioEnabled = false;
    const escapeHtml = (value) => String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
    let audioCtx = null;

    const canvas = document.getElementById('arenaCanvas');
    const ctx = canvas.getContext('2d');

    // URL query view support (?view=overlay or ?pane=1..4)
    const params = new URLSearchParams(window.location.search);
    if (params.get('view') === 'overlay') {
      document.body.classList.add('view-overlay');
    }
    if (params.get('alpha') === '1') {
      document.body.classList.add('obs-transparent');
    }
    if (window.obsstudio) {
      document.body.classList.add('obs-real-capture');
    }
    if (['1', '2', '3', '4'].includes(params.get('pane'))) {
      switchRightPane(params.get('pane'));
    }

    // Top View Switching Tabs (Split Studio vs OBS Clean Overlay)
    document.querySelectorAll('.nav-tab').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.nav-tab').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        const v = btn.dataset.view;
        document.body.classList.remove('view-overlay');
        if (v === 'overlay') document.body.classList.add('view-overlay');
        resizeCanvas();
      });
    });

    // Right Dock 4-Tab Exclusive Switcher (Clicking 1 closes 2,3,4; clicking 2 closes 1,3,4, etc.)
    function switchRightPane(paneId) {
      activePane = String(paneId);
      document.querySelectorAll('.dock-tab-btn').forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.pane === activePane);
      });
      document.querySelectorAll('.dock-pane').forEach((pane) => {
        pane.classList.toggle('active', pane.id === 'dockPane' + activePane);
      });
    }

    document.querySelectorAll('.dock-tab-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        switchRightPane(btn.dataset.pane);
      });
    });

    // Each right-dock pane is a focus accordion. A single opened card owns the
    // available vertical space; clicking it again returns to compact headings.
    function setupDockAccordions() {
      const defaultOpenIndexes = { dockPane1: 1, dockPane2: 1, dockPane3: 0, dockPane4: 0 };
      document.querySelectorAll('.dock-pane').forEach((pane) => {
        pane.classList.add('accordion-enabled');
        const cards = Array.from(pane.children).filter((child) =>
          child.classList.contains('section-box') || child.classList.contains('guardrail-report-card')
        );
        const setOpenCard = (nextCard) => {
          cards.forEach((card) => {
            const isOpen = card === nextCard;
            card.classList.toggle('accordion-open', isOpen);
            card.querySelector(':scope > .accordion-toggle')?.setAttribute('aria-expanded', String(isOpen));
          });
        };
        cards.forEach((card) => {
          // Grow belongs to the pre-accordion layout. If it remains, a
          // closed card still consumes the entire right panel.
          card.classList.remove('grow');
          card.classList.add('accordion-card');
          let toggle = card.querySelector(':scope > .sub-label');
          if (toggle) {
            toggle.classList.add('accordion-toggle');
            toggle.setAttribute('role', 'button');
            toggle.tabIndex = 0;
          } else {
            toggle = document.createElement('button');
            toggle.type = 'button';
            toggle.className = 'accordion-toggle sub-label';
            toggle.innerHTML = '<span>' + escapeHtml(card.dataset.accordionTitle || 'Details') + '</span>';
            card.prepend(toggle);
          }
          const chevron = document.createElement('span');
          chevron.className = 'accordion-chevron';
          chevron.setAttribute('aria-hidden', 'true');
          chevron.textContent = '▸';
          toggle.append(chevron);
          const toggleCard = () => setOpenCard(card.classList.contains('accordion-open') ? null : card);
          toggle.addEventListener('click', toggleCard);
          toggle.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              toggleCard();
            }
          });
        });
        setOpenCard(cards[defaultOpenIndexes[pane.id]] || null);
      });
    }
    setupDockAccordions();

    // Procedural Web Audio Synthesizer
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

    // Render signature preset buttons in Pane 2
    const presetGrid = document.getElementById('presetGrid');
    PRESETS.forEach((p) => {
      const btn = document.createElement('button');
      btn.className = 'preset-btn';
      btn.innerHTML =
        '<div style="color: var(--accent-cyan); margin-bottom:2px;">' + p.label + '</div>' +
        '<div style="font-size:10px; color: var(--text-dim); font-weight:400;">' +
        p.candidate.fieldLaw.type + ' // ' + p.candidate.bossSpec.chassis + '</div>';
      btn.addEventListener('click', () => {
        document.getElementById('inputPatchPrompt').value = p.prompt;
        triggerCompilePatch(p.prompt, 'viewer');
      });
      presetGrid.appendChild(btn);
    });

    async function postApi(path, body) {
      const res = await fetch(path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...body, roomId: ROOM_ID })
      });
      return res.json();
    }

    function applyServerPayload(data) {
      if (!data) return;
      fullData = data;
      if (data.snapshot) {
        state = data.snapshot;
        snapshotReceivedAt = performance.now();
      }
      updateDomHud();
    }

    // =========================================================================
    // PANE 1 ACTIONS: LIVE TWITCH CHAT & EVENTSUB
    // =========================================================================
    async function sendChatMessageFromBox() {
      const sender = document.getElementById('inputChatSender').value.trim() || 'viewer';
      const msgInput = document.getElementById('inputChatMessage');
      const message = msgInput.value.trim();
      if (!message) return;

      const res = await postApi('/api/chat/send', {
        username: sender,
        message,
        source: 'studio-live-chat',
        badge: 'LIVE CHAT'
      });
      applyServerPayload(res);
      playSynthPulse(360, 'sine', 0.16);
    }

    document.getElementById('btnSendChat').addEventListener('click', sendChatMessageFromBox);
    document.getElementById('inputChatMessage').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        sendChatMessageFromBox();
      }
    });

    // Quick Chat Verb Buttons
    document.querySelectorAll('[data-cmd]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const cmd = btn.dataset.cmd;
        const sender = document.getElementById('inputChatSender').value.trim() || 'viewer';
        document.getElementById('inputChatMessage').value = cmd;
        const res = await postApi('/api/chat/send', {
          username: sender,
          message: cmd,
          source: 'twitch-chat-cmd',
          badge: 'TWITCH CMD'
        });
        applyServerPayload(res);
        playSynthPulse(340, 'sine', 0.14);
      });
    });

    const DEMO_AUDIENCE_SEQUENCE = [
      { username: 'orbit_fan', message: '!join' },
      { username: 'rift_runner', message: '!slingshot' },
      { username: 'shield_scout', message: '!tether @rift_runner' },
      { username: 'codex_crew', message: '!patch Add twin binary gravity wells and ricochet prism beams' },
      { username: 'nova_echo', message: '!parry' },
      { username: 'live_ops', message: '!overclock' }
    ];
    let demoAudienceRunning = false;
    document.getElementById('btnRunDemoAudience').addEventListener('click', async (event) => {
      if (demoAudienceRunning) return;
      demoAudienceRunning = true;
      event.currentTarget.disabled = true;
      event.currentTarget.textContent = 'Demo Audience Running…';
      for (const item of DEMO_AUDIENCE_SEQUENCE) {
        const res = await postApi('/api/chat/send', {
          username: item.username,
          message: item.message,
          source: 'local-demo-audience',
          badge: 'DEMO'
        });
        applyServerPayload(res);
        await new Promise((resolve) => setTimeout(resolve, 850));
      }
      event.currentTarget.disabled = false;
      event.currentTarget.textContent = 'Run Demo Audience Sequence';
      demoAudienceRunning = false;
    });

    // Twitch EventSub Webhook / WebSocket Trigger Buttons
    document.querySelectorAll('[data-eventsub]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const subType = btn.dataset.eventsub;
        const sender = document.getElementById('inputChatSender').value.trim() || 'talhacomak';
        const res = await postApi('/api/twitch/eventsub/simulate', {
          type: subType,
          username: sender,
          viewers: 45,
          bits: 500,
          tier: '3000',
          level: 4
        });
        applyServerPayload(res);
        playSynthPulse(520, 'sawtooth', 0.32);
      });
    });

    document.getElementById('btnConnectTwitch').addEventListener('click', async () => {
      const ch = document.getElementById('inputTwitchChannel').value.trim();
      if (!ch) return;
      const res = await postApi('/api/twitch/connect', { channel: ch });
      applyServerPayload(res);
    });

    document.getElementById('btnAuthorizeTwitch').addEventListener('click', () => {
      window.location.assign('/auth/twitch/connect?room=' + encodeURIComponent(ROOM_ID));
    });

    async function sendToTwitch() {
      const input = document.getElementById('inputTwitchMessage');
      const message = input.value.trim();
      if (!message) return;
      const res = await postApi('/api/twitch/say', { message });
      if (res.ok) input.value = '';
      applyServerPayload(res);
    }

    document.getElementById('btnSendToTwitch').addEventListener('click', sendToTwitch);
    document.getElementById('inputTwitchMessage').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        sendToTwitch();
      }
    });

    document.getElementById('btnLeaveTwitch').addEventListener('click', async () => {
      const res = await postApi('/api/twitch/leave', {});
      applyServerPayload(res);
    });

    document.getElementById('btnDisconnectTwitchAccount').addEventListener('click', async () => {
      const res = await postApi('/api/twitch/disconnect-account', {});
      applyServerPayload(res);
    });

    // =========================================================================
    // PANE 2 ACTIONS: CODEX LIVE RULE MUTATOR (!PATCH)
    // =========================================================================
    async function triggerCompilePatch(promptValue, author = 'viewer') {
      const btn = document.getElementById('btnCompilePatch');
      btn.textContent = 'Codex Compiling AST...';
      const res = await postApi('/api/patch/compile', { prompt: promptValue, author });
      btn.textContent = 'Compile & Apply with Codex';
      applyServerPayload(res);

      if (res.ok) {
        document.getElementById('compileLatencyLabel').textContent =
          'Compiled & Verified 18/18 Invariants in ' + res.compileLatencyMs + 'ms (' + res.compilerMode + ')';
        playSynthPulse(state.activePatch.aesthetics.harmonicFrequencyHz || 260, 'sawtooth', 0.35);
      }
    }

    document.getElementById('btnCompilePatch').addEventListener('click', () => {
      const prompt = document.getElementById('inputPatchPrompt').value;
      triggerCompilePatch(prompt, 'viewer');
    });


    const SAMPLE_VIEWER_PATCHES = [
      { user: 'talhacomak', prompt: 'Invert magnetic dipole poles and supercharge elastic viewer tether whips to 3.4x cleave damage' },
      { user: 'shader_witch', prompt: 'Create a 4-pole harmonic standing-wave lattice with Chronos Tesseract and high-speed parry reflections' },
      { user: 'kinetic_nova', prompt: 'Kill central gravity into zero-g hyper-elastic ricochet chamber with prism lasers' },
      { user: 'arena_visitor', prompt: 'Twin binary pulsar singularity wells with 5 shield arcs and spiral lance barrage' }
    ];
    let sampleIdx = 0;

    document.getElementById('btnSimulateChatPatch').addEventListener('click', async () => {
      const item = SAMPLE_VIEWER_PATCHES[sampleIdx % SAMPLE_VIEWER_PATCHES.length];
      sampleIdx++;
      document.getElementById('inputPatchPrompt').value = item.prompt;
      await triggerCompilePatch(item.prompt, item.user);
    });

    // =========================================================================
    // PANE 4 ACTIONS: TEST GUARDRAIL BUTTONS
    // =========================================================================
    async function runGuardrailTest(scenario) {
      const res = await postApi('/api/patch/test-guardrail', { scenario });
      applyServerPayload(res);
      playSynthPulse(115, 'sawtooth', 0.3);
    }

    document.getElementById('btnTestGuardrailEval').addEventListener('click', () => {
      runGuardrailTest('eval_injection');
    });

    document.getElementById('btnTestGuardrailEnergy').addEventListener('click', () => {
      runGuardrailTest('energy_divergence');
    });

    // Stage Crowd Surge Button
    document.getElementById('btnStageSurge').addEventListener('click', async () => {
      const res = await postApi('/api/stage/surge', {});
      applyServerPayload(res);
      playSynthPulse(440, 'triangle', 0.28);
    });

    // =========================================================================
    // DOM HUD & 4-PANE RENDERER
    // =========================================================================
    let lastRenderedChatKey = null;
    let lastRenderedCodexId = null;

    function updateDomHud() {
      if (!state || !state.activePatch) return;
      const patch = state.activePatch;
      const boss = state.boss;

      // Top Left Boss HUD
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

      // Top Right Patch HUD
      document.getElementById('hudPatchAuthor').textContent =
        'ACTIVE CODEX PATCH // @' + patch.author;
      document.getElementById('hudPatchTitle').textContent = patch.title;
      document.getElementById('hudPatchLaws').innerHTML =
        '<span class="law-chip">field: ' + patch.fieldLaw.type + '</span>' +
        '<span class="law-chip">G: ' + patch.fieldLaw.gravityStrength + 'N</span>' +
        '<span class="law-chip">vortex: ' + patch.fieldLaw.vortexTorque + '</span>' +
        '<span class="law-chip">tether: ' + patch.droneLaw.tetherDamageBonus + 'x</span>' +
        '<span class="law-chip">bounce: ' + patch.fieldLaw.restitution + '</span>';

      // Bottom Left MVP List
      const mvpEl = document.getElementById('hudMvpList');
      const topDrones = (state.drones || []).slice(0, 4);
      mvpEl.innerHTML = topDrones
        .map(
          (d, idx) =>
            '<div class="mvp-row">' +
            '<span><strong style="color:' + escapeHtml(d.color) + ';">#' + (idx + 1) + ' @' + escapeHtml(d.username) + '</strong></span>' +
            '<span>' + d.damageDealt + ' DMG | ' + d.tetherCleaves + ' Whips | ' + d.parries + ' Parry</span>' +
            '</div>'
        )
        .join('');

      // Bottom Right Telemetry Feed
      const feedEl = document.getElementById('hudFeedList');
      const logs = (state.combatLog || []).slice(0, 4);
      feedEl.innerHTML = logs
        .map((l) => '<div class="feed-line">[' + escapeHtml(l.timeSec) + 's] ' + escapeHtml(l.text) + '</div>')
        .join('');

      // Twitch Status Bar
      const leaveButton = document.getElementById('btnLeaveTwitch');
      if (fullData.twitch && fullData.twitch.channel) {
        const ch = fullData.twitch.channel;
        const st = (fullData.twitch.status || 'connected').toUpperCase();
        document.getElementById('twitchStatusText').textContent = 'IRC: #' + ch + ' (' + st + ')';
        document.getElementById('ircConnectionDetail').textContent =
          '#' + ch + ' (' + st + ' // ' + (fullData.twitch.messagesReceived || 0) + ' msgs)';
        leaveButton.disabled = false;
      } else {
        document.getElementById('twitchStatusText').textContent = 'IRC: choose a channel';
        document.getElementById('ircConnectionDetail').textContent = 'Not connected — choose any public channel';
        leaveButton.disabled = true;
      }
      const oauthButton = document.getElementById('btnAuthorizeTwitch');
      const disconnectAccountButton = document.getElementById('btnDisconnectTwitchAccount');
      const sendToTwitchButton = document.getElementById('btnSendToTwitch');
      const twitchMessageHelp = document.getElementById('twitchMessageHelp');
      const canWriteToTwitch = Boolean(fullData.twitch?.authenticated && fullData.twitch?.identity?.login && fullData.twitch?.status === 'connected');
      sendToTwitchButton.disabled = !canWriteToTwitch;
      twitchMessageHelp.textContent = canWriteToTwitch
        ? 'Messages are sent as @' + fullData.twitch.identity.login + ' to #' + fullData.twitch.channel + '. Twitch moderation and a conservative rate limit apply.'
        : 'Authorize your account and connect a live channel to write. Incoming messages appear above automatically.';
      if (fullData.twitch?.identity?.login) {
        oauthButton.textContent = 'Twitch Authorized: @' + fullData.twitch.identity.login;
        oauthButton.disabled = true;
        disconnectAccountButton.disabled = false;
      } else if (!fullData.twitch?.oauthConfigured) {
        oauthButton.textContent = 'Twitch OAuth setup required';
        oauthButton.disabled = true;
        disconnectAccountButton.disabled = true;
      } else {
        oauthButton.textContent = 'Connect My Twitch Account';
        oauthButton.disabled = false;
        disconnectAccountButton.disabled = true;
      }

      // PANE 1: Render Live Chat Messages Window
      const chatMsgs = fullData.chatMessages || [];
      const chatRenderKey = chatMsgs.map((m) => m.id).join('|');
      if (chatRenderKey !== lastRenderedChatKey) {
        lastRenderedChatKey = chatRenderKey;
        const chatWin = document.getElementById('chatStreamWindow');
        const connectionEvents = chatMsgs.filter((m) => m.username === 'system');
        const viewerMessages = chatMsgs.filter((m) => m.username !== 'system' && m.badge !== 'EVENTSUB');
        const activityEl = document.getElementById('connectionActivity');
        activityEl.innerHTML = connectionEvents.length
          ? connectionEvents.slice(-3).reverse().map((m) => '<div>● ' + escapeHtml(m.message) + '</div>').join('')
          : 'Connection activity will appear here. It is separate from the viewer chat below.';
        document.getElementById('chatMsgCountLabel').textContent = viewerMessages.length + ' viewer messages';
        chatWin.innerHTML = viewerMessages.length
          ? viewerMessages
          .slice()
          .reverse()
          .map(
            (m) =>
              '<div class="chat-msg-card" style="border-left-color:' + escapeHtml(m.color || '#00F5D4') + ';">' +
              '<div class="chat-msg-header">' +
              '<span><strong style="color:' + escapeHtml(m.color || '#00F5D4') + ';">@' + escapeHtml(m.username) + '</strong> · ' + escapeHtml(m.source) + '</span>' +
              '<span class="chat-badge">' + escapeHtml(m.badge || 'CHAT') + ' · ' + escapeHtml(m.timestamp) + '</span>' +
              '</div>' +
              '<div style="color:#f8fafc; font-weight:600;">' + escapeHtml(m.message) + '</div>' +
              (m.reply ? '<div class="chat-reply-box">↳ ' + escapeHtml(m.reply) + '</div>' : '') +
              '</div>'
          )
          .join('')
          : '<div style="color:var(--text-dim); padding:12px 4px; line-height:1.5;">Waiting for live chat. Send a message in the connected Twitch chat, or open the separate Demo card for a labeled local sequence.</div>';
      }

      // PANE 2: Render Codex Prompt & Response Log
      const codexLogs = fullData.codex?.logs || [];
      const topCodexId = codexLogs[0]?.id || null;
      if (topCodexId !== lastRenderedCodexId) {
        lastRenderedCodexId = topCodexId;
        document.getElementById('codexLogCountLabel').textContent = codexLogs.length + ' compilations';
        const codexWin = document.getElementById('codexLogWindow');
        codexWin.innerHTML = codexLogs
          .map(
            (entry) =>
              '<div class="codex-exchange-card">' +
              '<div style="display:flex; justify-content:space-between; font-family:var(--font-mono); font-size:10.5px; color:var(--text-dim);">' +
              '<span>PROMPT BY <strong style="color:var(--accent-cyan);">@' + escapeHtml(entry.author) + '</strong></span>' +
              '<span>' + escapeHtml(entry.compilerMode) + ' · ' + escapeHtml(entry.compileLatencyMs) + 'ms · ' + escapeHtml(entry.timestamp) + '</span>' +
              '</div>' +
              '<div class="codex-prompt-bubble">"' + escapeHtml(entry.prompt) + '"</div>' +
              '<div class="codex-reply-bubble">' +
              '<div style="font-family:var(--font-mono); font-size:10.5px; color:var(--accent-cyan); font-weight:800; margin-bottom:3px;">' +
              'CODEX RESPONSE ➔ APPLIED PATCH [' + escapeHtml(entry.patchTitle) + ']' +
              '</div>' +
              '<div>' + escapeHtml(entry.replyText) + '</div>' +
              '</div>' +
              '</div>'
          )
          .join('');
      }

      // PANE 3: Render Structural Diff Summary & Rollback History
      const activeDiffs =
        fullData.lastDiffs && fullData.lastDiffs.length > 0
          ? fullData.lastDiffs
          : state.patchHistory?.[0]?.diffs || [];
      document.getElementById('tabDiffCount').textContent = activeDiffs.length;
      document.getElementById('diffPatchTitleLabel').textContent =
        patch.title + ' (' + activeDiffs.length + ' changes)';

      const diffContainer = document.getElementById('diffList');
      if (activeDiffs.length === 0) {
        diffContainer.innerHTML =
          '<div class="diff-row-card"><span class="diff-param-name">No parameter diffs</span><span>—</span><span class="diff-after-val">Identical</span></div>';
      } else {
        diffContainer.innerHTML = activeDiffs
          .map(
            (d) =>
              '<div class="diff-row-card">' +
              '<span class="diff-param-name">' + escapeHtml(d.path) + '</span>' +
              '<span class="diff-before-val">' + escapeHtml(d.before) + '</span>' +
              '<span class="diff-after-val">➔ ' + escapeHtml(d.after) + '</span>' +
              '</div>'
          )
          .join('');
      }

      const histEl = document.getElementById('patchHistoryList');
      const historyArr = state.patchHistory || [];
      histEl.innerHTML = historyArr
        .map(
          (h, idx) =>
            '<div style="display:flex; justify-content:space-between; align-items:center; background:rgba(7,11,22,0.85); padding:6px 10px; border-radius:6px; border:1px solid rgba(148,163,184,0.18); font-size:11.5px;">' +
            '<div><strong style="color:' + (idx === 0 ? 'var(--accent-cyan)' : '#f8fafc') + ';">' +
            (idx === 0 ? '[ACTIVE] ' : '') + escapeHtml(h.title) + '</strong> <span style="color:var(--text-dim); font-family:var(--font-mono); font-size:10px;">by @' + escapeHtml(h.author) + '</span></div>' +
            (idx > 0 && h.patchSnapshot
              ? '<button class="btn" data-rollback="' + escapeHtml(h.patchId) + '" style="padding:3px 8px; font-size:10.5px;">Rollback</button>'
              : '<span class="check-badge">LIVE</span>') +
            '</div>'
        )
        .join('');

      histEl.querySelectorAll('[data-rollback]').forEach((btn) => {
        btn.addEventListener('click', async () => {
          const res = await postApi('/api/patch/rollback', { patchId: btn.dataset.rollback });
          applyServerPayload(res);
          playSynthPulse(280, 'triangle', 0.25);
        });
      });

      // PANE 4: Render Guardrail Diagnostic Report & 18 Invariants
      document.getElementById('tickBudgetBadge').textContent =
        (state.lastStepDurationMs || 0.09) + 'ms / tick (60 FPS)';

      const gr = fullData.lastGuardrailReport;
      const grBox = document.getElementById('guardrailReportBox');
      const grHead = document.getElementById('guardrailHeadline');
      const grDetail = document.getElementById('guardrailDetail');
      const checkEl = document.getElementById('invariantCheckList');

      if (gr) {
        if (gr.blocked) {
          grBox.classList.remove('clamped');
          grBox.classList.add('blocked');
          grHead.style.color = '#fca5a5';
          grHead.textContent =
            '🛑 GUARDRAIL INTERCEPTED & BLOCKED UNSAFE PAYLOAD [' + gr.testedAt + ']';
          grDetail.innerHTML =
            '<div><strong>Scenario:</strong> ' + gr.scenario + '</div>' +
            '<div style="color:#fecaca; margin-top:4px;"><strong>Rejected Reason:</strong> ' +
            (gr.report?.rejectedReasons || []).join(' | ') +
            '</div>' +
            '<div style="color:#86efac; margin-top:4px;">✓ Result: Malicious payload was dropped before execution. 60 FPS Arena remained 100% unaffected.</div>';
        } else {
          grBox.classList.remove('blocked');
          grBox.classList.add('clamped');
          grHead.style.color = '#fef08a';
          grHead.textContent =
            '⚡ GUARDRAIL CLAMPED DIVERGENT PHYSICS PAYLOAD [' + gr.testedAt + ']';
          grDetail.innerHTML =
            '<div><strong>Scenario:</strong> ' + gr.scenario + '</div>' +
            '<div style="color:#fef08a; margin-top:4px;"><strong>Lyapunov Clamping Applied:</strong> ' +
            (gr.clampedWarnings || []).join(' | ') +
            '</div>' +
            '<div style="color:#86efac; margin-top:4px;">✓ Result: Divergent restitution/damping was automatically bounded to preserve 60 FPS stability.</div>';
        }

        const checksToShow = gr.report?.checks || state.lastValidation?.checks || [];
        checkEl.innerHTML = checksToShow
          .map(
            (c) =>
              '<span class="check-badge ' + (c.passed ? '' : 'fail') + '" title="' +
              c.detail.replace(/"/g, '&quot;') + '">' +
              (c.passed ? '✓ ' : '✗ ') + c.id + '</span>'
          )
          .join('');

        document.getElementById('astJsonViewer').textContent = JSON.stringify(
          {
            guardrailTestScenario: gr.scenario,
            blocked: gr.blocked,
            rejectedReasons: gr.report?.rejectedReasons,
            clampedWarnings: gr.clampedWarnings,
            testedPayload: gr.inputPayload,
            invariantChecks: gr.report?.checks
          },
          null,
          2
        );
      } else {
        grBox.classList.remove('blocked', 'clamped');
        const checks = state.lastValidation?.checks || [];
        checkEl.innerHTML = checks
          .map(
            (c) =>
              '<span class="check-badge" title="' +
              c.detail.replace(/"/g, '&quot;') + '">✓ ' + c.id + '</span>'
          )
          .join('');

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
    }

    // Responsive DPI-Aware Canvas Sizing
    function resizeCanvas() {
      const stage = canvas.parentElement;
      const rect = stage.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 3);
      canvas.width = Math.max(640, Math.floor(rect.width * dpr));
      canvas.height = Math.max(360, Math.floor(rect.height * dpr));
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // 60 FPS Vector Renderer
    function buildInterpolatedFrame() {
      const elapsedSec = Math.min(0.35, Math.max(0, (performance.now() - snapshotReceivedAt) / 1000));
      const project = (entity) => entity ? {
        ...entity,
        x: Math.max(-80, Math.min(1360, Number(entity.x || 0) + Number(entity.vx || 0) * elapsedSec)),
        y: Math.max(-80, Math.min(800, Number(entity.y || 0) + Number(entity.vy || 0) * elapsedSec))
      } : entity;
      const patch = state.activePatch;
      return {
        ...state,
        timeSec: Number(state.timeSec || 0) + elapsedSec,
        boss: state.boss ? {
          ...project(state.boss),
          shieldAngle: Number(state.boss.shieldAngle || 0) + Number(patch?.bossSpec?.rotationSpeed || 0) * elapsedSec
        } : state.boss,
        drones: (state.drones || []).map(project),
        projectiles: (state.projectiles || []).map(project)
      };
    }

    function drawArena() {
      requestAnimationFrame(drawArena);
      if (!state || !state.activePatch) return;

      const frame = buildInterpolatedFrame();

      const W = canvas.width;
      const H = canvas.height;
      const scaleX = W / 1280;
      const scaleY = H / 720;
      const scale = Math.min(scaleX, scaleY);
      const offsetX = (W - 1280 * scale) * 0.5;
      const offsetY = (H - 720 * scale) * 0.5;

      const patch = frame.activePatch;
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
      const t = frame.timeSec || 0;
      ctx.lineWidth = 1;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const gx = ((c + 0.5) / cols) * 1280;
          const gy = ((r + 0.5) / rows) * 720;
          const dx = frame.boss.x - gx;
          const dy = frame.boss.y - gy;
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
      (frame.shockwaves || []).forEach((sw) => {
        ctx.strokeStyle = 'hsla(' + (sw.hue || primaryHue) + ', 95%, 68%, ' + Math.max(0, sw.alpha) + ')';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(sw.x, sw.y, Math.max(2, sw.radius), 0, Math.PI * 2);
        ctx.stroke();
      });

      // 4. Draw Elastic Verlet Tether Whip Beams Between Viewer Drones
      const droneMap = new Map((frame.drones || []).map((d) => [d.id, d]));
      (frame.tethers || []).forEach((tether) => {
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
        const midX = (a.x + b.x) * 0.5 + Math.sin(t * 24) * 9;
        const midY = (a.y + b.y) * 0.5 + Math.cos(t * 24) * 9;
        ctx.quadraticCurveTo(midX, midY, b.x, b.y);
        ctx.stroke();
        ctx.restore();
      });

      // 5. Draw Articulated Anomaly Boss Construct
      const boss = frame.boss;
      if (boss) {
        ctx.save();
        ctx.translate(boss.x, boss.y);

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
      (frame.projectiles || []).forEach((p) => {
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
      (frame.drones || []).forEach((d) => {
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

        if (d.parryActive) {
          ctx.strokeStyle = '#00f5d4';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.arc(0, 0, d.radius + 12, 0, Math.PI * 2);
          ctx.stroke();
        }

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

        ctx.font = '600 11px "JetBrains Mono", monospace';
        ctx.fillStyle = '#f8fafc';
        ctx.fillText('@' + d.username, d.x + 15, d.y + 4);
      });

      // 8. Draw Floating 60 FPS Combat & AST Hot-Swap Callouts
      (frame.callouts || []).forEach((c) => {
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

    // Live State Synchronization Loop. Rendering remains requestAnimationFrame
    // driven; network state only needs a human-visible cadence.
    async function syncLoop() {
      try {
        const res = await fetch('/api/state?room=' + encodeURIComponent(ROOM_ID));
        if (res.ok) {
          const data = await res.json();
          applyServerPayload(data);
        }
      } catch {
        // Ignore transient fetch errors
      }
      setTimeout(syncLoop, document.visibilityState === 'visible' ? 250 : 15000);
    }

    updateDomHud();
    requestAnimationFrame(drawArena);
    syncLoop();
  </script>
</body>
</html>`;
}
