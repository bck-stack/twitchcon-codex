/**
 * ChaosForge — Local HTTP Server, 60 FPS Arena Loop & Live Twitch IRCv3 Bridge
 */

import http from 'node:http';
import { ChaosForgeArenaEngine } from './src/engine/physics.mjs';
import {
  compileNaturalLanguagePatch,
  SIGNATURE_PATCH_PRESETS
} from './src/compiler/codex-mutator.mjs';
import { validateAndNormalizePatch } from './src/compiler/schema.mjs';
import { TwitchIrcLiveConnector } from './src/twitch/bridge.mjs';
import { renderChaosForgeHtml } from './src/ui/app.mjs';

const PORT = Number(process.env.PORT || 4400);

export const arena = new ChaosForgeArenaEngine({ width: 1280, height: 720 });

// Seed initial active Twitch community drones & elastic Verlet tethers so the arena is immediately kinetic
function seedInitialStageDrones() {
  const initialSquad = [
    { username: 'bck_stack', color: '#00F5D4' },
    { username: 'talhacomak', color: '#FF4D6D' },
    { username: 'codex_pilot', color: '#FEE440' },
    { username: 'shader_witch', color: '#9B5DE5' },
    { username: 'kinetic_nova', color: '#00BBF9' },
    { username: 'vector_monk', color: '#F15BB5' }
  ];

  for (const v of initialSquad) {
    arena.handleChatCommand({ username: v.username, color: v.color, command: 'join' });
  }

  arena.handleChatCommand({
    username: 'bck_stack',
    color: '#00F5D4',
    command: 'tether',
    argsText: '@talhacomak'
  });
  arena.handleChatCommand({
    username: 'codex_pilot',
    color: '#FEE440',
    command: 'tether',
    argsText: '@shader_witch'
  });
}

seedInitialStageDrones();

// Live Twitch IRCv3 WebSocket Connector
export const twitchConnector = new TwitchIrcLiveConnector({
  onChatEvent: async (evt) => {
    if (!evt.command) return;

    if (evt.command === 'patch') {
      const proposal = arena.enqueuePatchProposal({
        username: evt.username,
        prompt: evt.argsText
      });
      if (proposal) {
        const compiled = await compileNaturalLanguagePatch({
          prompt: evt.argsText,
          author: evt.username,
          currentPatch: arena.activePatch
        });
        if (compiled.ok) {
          arena.applyValidatedPatch(compiled.patch, compiled.diffs, compiled.validation);
        }
      }
      return;
    }

    if (evt.command === 'vote') {
      arena.votePatchProposal({ username: evt.username, indexOrId: evt.argsText });
      return;
    }

    arena.handleChatCommand({
      username: evt.username,
      color: evt.color,
      command: evt.command,
      argsText: evt.argsText
    });
  }
});

// Deterministic 60 FPS Server Physics Tick + Autonomous Community Kinetic Reflexes
let simInterval = setInterval(() => {
  arena.step(1 / 60);

  // Every ~1.8 seconds, let orbiting drones execute tactical slingshots/parries so the raid stays intense
  if (arena.tickCount % 110 === 0 && arena.drones.size > 0) {
    const dronesArr = Array.from(arena.drones.values());
    const actor = dronesArr[(arena.tickCount / 110) % dronesArr.length];
    const actions = ['slingshot', 'parry', 'overclock', 'tether'];
    const chosen = actions[(arena.tickCount / 110) % actions.length];
    arena.handleChatCommand({
      username: actor.username,
      color: actor.color,
      command: chosen
    });
  }
}, 1000 / 60);

function readJsonBody(req) {
  return new Promise((resolve) => {
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
      if (raw.length > 64_000) req.destroy();
    });
    req.on('end', () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch {
        resolve({});
      }
    });
  });
}

function sendJson(res, status, payload) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store'
  });
  res.end(JSON.stringify(payload));
}

export const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);

  if (req.method === 'GET' && (url.pathname === '/' || url.pathname === '/overlay' || url.pathname === '/codex')) {
    const html = renderChaosForgeHtml({
      initialSnapshot: arena.getSnapshot(),
      presets: SIGNATURE_PATCH_PRESETS
    });
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(html);
    return;
  }

  if (req.method === 'GET' && url.pathname === '/api/state') {
    sendJson(res, 200, {
      ok: true,
      twitch: twitchConnector.getStatus(),
      snapshot: arena.getSnapshot()
    });
    return;
  }

  if (req.method === 'POST' && url.pathname === '/api/patch/compile') {
    const body = await readJsonBody(req);
    const compiled = await compileNaturalLanguagePatch({
      prompt: body.prompt,
      author: body.author || 'streamer_director',
      currentPatch: arena.activePatch
    });

    if (!compiled.ok) {
      sendJson(res, 400, compiled);
      return;
    }

    arena.applyValidatedPatch(compiled.patch, compiled.diffs, compiled.validation);
    sendJson(res, 200, {
      ok: true,
      compilerMode: compiled.compilerMode,
      compileLatencyMs: compiled.compileLatencyMs,
      patch: compiled.patch,
      diffs: compiled.diffs,
      validation: compiled.validation,
      snapshot: arena.getSnapshot()
    });
    return;
  }

  if (req.method === 'POST' && url.pathname === '/api/chat/command') {
    const body = await readJsonBody(req);
    const result = arena.handleChatCommand({
      username: body.username || 'twitch_viewer',
      color: body.color || null,
      command: body.command || 'slingshot',
      argsText: body.argsText || ''
    });
    sendJson(res, 200, {
      ok: result.ok,
      result,
      snapshot: arena.getSnapshot()
    });
    return;
  }

  if (req.method === 'POST' && url.pathname === '/api/stage/surge') {
    const crowd = [
      ['bck_stack', '#00F5D4'],
      ['talhacomak', '#FF4D6D'],
      ['codex_pilot', '#FEE440'],
      ['shader_witch', '#9B5DE5'],
      ['kinetic_nova', '#00BBF9'],
      ['vector_monk', '#F15BB5'],
      ['orbital_lynx', '#38B000'],
      ['prism_hacker', '#FF9E00'],
      ['gauss_viper', '#00F5D4'],
      ['tether_queen', '#FF4D6D']
    ];
    for (const [u, c] of crowd) {
      arena.handleChatCommand({ username: u, color: c, command: 'slingshot' });
    }
    arena.handleChatCommand({ username: 'orbital_lynx', command: 'tether', argsText: '@prism_hacker' });
    arena.handleChatCommand({ username: 'gauss_viper', command: 'tether', argsText: '@tether_queen' });
    arena.handleChatCommand({ username: 'bck_stack', command: 'parry' });

    sendJson(res, 200, {
      ok: true,
      snapshot: arena.getSnapshot()
    });
    return;
  }

  if (req.method === 'POST' && url.pathname === '/api/patch/rollback') {
    const body = await readJsonBody(req);
    const rolled = arena.rollbackToPatch(body.patchId);
    if (!rolled) {
      sendJson(res, 404, { ok: false, error: 'Patch ID not found in history' });
      return;
    }
    sendJson(res, 200, {
      ok: true,
      patch: rolled,
      snapshot: arena.getSnapshot()
    });
    return;
  }

  if (req.method === 'POST' && url.pathname === '/api/patch/test-guardrail') {
    const adversarial = {
      title: 'Malicious Injection eval(window.location)',
      fieldLaw: {
        type: 'zero_g_drift',
        gravityStrength: 999999,
        vortexTorque: -999999,
        damping: 0.999,
        restitution: 2.85,
        tetherStiffness: 4.0
      }
    };
    const report = validateAndNormalizePatch(adversarial);
    arena.logEvent(
      'GUARDRAIL_BLOCKED',
      `AST Guardrail blocked unsafe payload: ${report.rejectedReasons[0] || 'Lyapunov divergence clamped'}`,
      { report }
    );
    sendJson(res, 200, {
      ok: true,
      blocked: !report.valid,
      report,
      snapshot: arena.getSnapshot()
    });
    return;
  }

  if (req.method === 'POST' && url.pathname === '/api/twitch/connect') {
    const body = await readJsonBody(req);
    try {
      const status = twitchConnector.connect(body.channel || 'bck_stack');
      arena.logEvent('TWITCH_IRC_CONNECT', `Connected live IRCv3 WebSocket to #${status.channel}`);
      sendJson(res, 200, { ok: true, status });
    } catch (err) {
      sendJson(res, 400, { ok: false, error: err.message });
    }
    return;
  }

  sendJson(res, 404, { ok: false, error: 'Not found' });
});

if (import.meta.url === `file://${process.argv[1].replace(/\\/g, '/')}` || process.argv[1]?.endsWith('server.mjs')) {
  server.listen(PORT, () => {
    console.log(`ChaosForge Live Vector Physics & Codex AST Server running at http://localhost:${PORT}`);
  });
}
