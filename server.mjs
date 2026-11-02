/** ChaosForge HTTP server: isolated live rooms for Twitch channels and judge demos. */
import http from 'node:http';
import crypto from 'node:crypto';
import { ChaosForgeArenaEngine } from './src/engine/physics.mjs';
import { compileNaturalLanguagePatch, SIGNATURE_PATCH_PRESETS } from './src/compiler/codex-mutator.mjs';
import { validateAndNormalizePatch, computePatchDiff } from './src/compiler/schema.mjs';
import { TwitchIrcLiveConnector, TwitchHelixAndEventSubClient, verifyTwitchEventSubSignature } from './src/twitch/bridge.mjs';
import { renderChaosForgeHtml } from './src/ui/app.mjs';

const PORT = Number(process.env.PORT || 4400);
const ROOM_TTL_MS = 6 * 60 * 60 * 1000;
const PATCH_COOLDOWN_MS = 3_000;
const rooms = new Map();
const channelRooms = new Map();
const recentEventSubIds = new Map();
const oauthStates = new Map();
const OAUTH_STATE_TTL_MS = 10 * 60 * 1000;
const TWITCH_CHAT_SCOPES = ['user:read:chat', 'user:write:chat'];

function nowLabel() { return new Date().toLocaleTimeString('en-GB', { hour12: false }); }
function cleanRoomId(value) { return String(value || '').toLowerCase().replace(/[^a-z0-9_-]/g, '').slice(0, 48); }
function cleanChannel(value) { return String(value || '').trim().toLowerCase().replace(/^#/, '').replace(/[^a-z0-9_]/g, '').slice(0, 25); }
function makeRoomId() { return `room-${crypto.randomBytes(8).toString('hex')}`; }
function twitchOAuthConfigured() { return Boolean(process.env.TWITCH_CLIENT_ID && process.env.TWITCH_CLIENT_SECRET && process.env.TWITCH_REDIRECT_URI); }
function roomUrl(origin, roomId, status) { const next = new URL('/', origin); next.searchParams.set('room', roomId); if (status) next.searchParams.set('twitch', status); return `${next.pathname}${next.search}`; }

function pushChat(room, { username, color = '#00F5D4', message, source = 'studio', badge = 'CHAT', reply = null }) {
  const entry = { id: `chat-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`, timestamp: nowLabel(), username: String(username || 'viewer').replace(/^@/, '').slice(0, 40), color: /^#[0-9a-f]{6}$/i.test(color) ? color : '#00F5D4', message: String(message || '').slice(0, 600), source: String(source).slice(0, 80), badge: String(badge).slice(0, 40), reply: reply ? String(reply).slice(0, 700) : null };
  room.state.chatMessages.push(entry);
  if (room.state.chatMessages.length > 60) room.state.chatMessages.shift();
  return entry;
}

function explainPatch(patch, diffs) { return `Compiled "${patch.title}" (${diffs.length} parameters mutated). Field: ${patch.fieldLaw.type}; Boss: ${patch.bossSpec.chassis}; tether bonus: ${patch.droneLaw.tetherDamageBonus}x.`; }
function pushCodexLog(room, { author, prompt, compilerMode, compileLatencyMs, patch, diffs }) {
  const entry = { id: `cdx-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`, timestamp: nowLabel(), author: String(author || 'viewer').replace(/^@/, '').slice(0, 40), prompt: String(prompt || '').slice(0, 600), compilerMode: compilerMode || 'semantic-ast', compileLatencyMs: compileLatencyMs || 0, patchTitle: patch.title, patchId: patch.patchId, replyText: explainPatch(patch, diffs || []), diffs: (diffs || []).slice(0, 12), astPreview: { fieldLaw: patch.fieldLaw, bossSpec: patch.bossSpec, droneLaw: patch.droneLaw } };
  room.state.codexLogs.unshift(entry);
  if (room.state.codexLogs.length > 20) room.state.codexLogs.length = 20;
  room.state.lastDiffs = entry.diffs;
  return entry;
}

function makeRoom(roomId = makeRoomId()) {
  const room = { id: roomId, createdAt: Date.now(), lastAccessAt: Date.now(), engine: new ChaosForgeArenaEngine({ width: 1280, height: 720 }), state: { chatMessages: [], codexLogs: [], lastDiffs: [], lastGuardrailReport: null, lastPatchByAuthor: new Map(), lastTwitchMessageAt: 0, channel: null, twitchIdentity: null, apiKey: null, apiProvider: null } };
  room.eventSub = new TwitchHelixAndEventSubClient({ onEventSubDirective: async (directive) => {
    room.engine.applyEventSubDirective(directive);
    pushChat(room, { username: directive.username || 'twitch_eventsub', color: '#FEE440', message: `[EventSub ${directive.eventType}] ${directive.headline}`, source: 'twitch-eventsub', badge: 'EVENTSUB', reply: `Applied arena kinetic wave (Boss DMG: -${directive.bossDamage || 0})` });
  }});
  room.twitch = new TwitchIrcLiveConnector({
    onUserNotice: (notice) => room.eventSub.triggerEvent(notice.msgId === 'raid' ? 'channel.raid' : notice.msgId === 'cheer' ? 'channel.cheer' : 'channel.subscribe', { user_name: notice.username, from_broadcaster_user_name: notice.username, viewers: notice.raidViewerCount, bits: notice.bits, tier: notice.subTier }, 'irc_usernotice'),
    onChatEvent: (evt) => processIncoming(room, { username: evt.username, color: evt.color || '#00F5D4', message: evt.message, source: `twitch-irc (#${evt.channel})`, badge: evt.isMod ? 'MOD' : evt.isSub ? 'SUB' : 'TWITCH' })
  });
  rooms.set(room.id, room);
  return room;
}
function getRoom(roomId, create = true) { const id = cleanRoomId(roomId); let room = id && rooms.get(id); if (!room && create) room = makeRoom(id || makeRoomId()); if (room) room.lastAccessAt = Date.now(); return room; }

async function processIncoming(room, { username, color = '#00F5D4', message, source = 'studio', badge = 'CHAT' }) {
  const text = String(message || '').trim().slice(0, 600); if (!text) return null;
  const author = String(username || 'viewer').replace(/^@/, '').toLowerCase().slice(0, 40) || 'viewer'; let reply = null; let codexEntry = null;
  if (text.startsWith('!')) {
    const [commandRaw, ...parts] = text.slice(1).trim().split(/\s+/); const command = (commandRaw || '').toLowerCase(); const argsText = parts.join(' ');
    if (command === 'patch') {
      const last = room.state.lastPatchByAuthor.get(author) || 0;
      if (Date.now() - last < PATCH_COOLDOWN_MS) reply = 'Patch cooldown: wait a few seconds before your next live rule change.';
      else {
        room.state.lastPatchByAuthor.set(author, Date.now()); const prompt = argsText || 'Split gravity into twin binary pulsar wells with prism ricochet beams'; const previous = structuredClone(room.engine.activePatch);
        const activeKey = room.state.apiKey || process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY;
        const activeModel = room.state.apiProvider === 'groq' || (activeKey && activeKey.startsWith('gsk_'))
          ? 'llama-3.3-70b-versatile'
          : (process.env.OPENAI_MODEL || 'gpt-4o-mini');
        const compiled = await compileNaturalLanguagePatch({
          prompt,
          author,
          currentPatch: previous,
          apiKey: activeKey,
          model: activeModel
        });
        if (compiled.ok) { room.engine.applyValidatedPatch(compiled.patch, compiled.diffs, compiled.validation); codexEntry = pushCodexLog(room, { author, prompt, compilerMode: compiled.compilerMode, compileLatencyMs: compiled.compileLatencyMs, patch: compiled.patch, diffs: compiled.diffs }); reply = `CODEX AST HOT-SWAP -> [${compiled.patch.title}] (${compiled.diffs.length} rules changed)`; }
        else reply = `GUARDRAIL REJECTED !patch: ${(compiled.validation?.rejectedReasons || ['Unsafe AST']).join(', ')}`;
      }
    } else if (command === 'vote') { const voted = room.engine.votePatchProposal({ username: author, indexOrId: argsText }); reply = voted ? `Vote recorded for "${voted.prompt}" (${voted.votes} votes)` : 'No active patch proposal to vote on'; }
    else { const result = room.engine.handleChatCommand({ username: author, color, command, argsText }); reply = result.ok ? `@${author} activated ${result.action}.` : `Unknown command !${command}. Try !join, !slingshot, !tether, !parry, !overclock, !emp, or !patch <rule>.`; }
  } else room.engine.spawnOrGetDrone(author, color);
  const chatEntry = pushChat(room, { username: author, color, message: text, source, badge, reply }); if (reply && room.twitch.authenticated) room.twitch.say(`[ChaosForge] ${reply}`); return { chatEntry, codexEntry };
}

function payload(room) {
  const activeKey = room.state.apiKey || process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY;
  const isGroq = activeKey ? activeKey.startsWith('gsk_') : false;
  const isOpenAi = activeKey ? activeKey.startsWith('sk-') : false;
  const provider = isGroq ? 'groq' : isOpenAi ? 'openai' : 'semantic-local';
  const modelName = isGroq ? 'llama-3.3-70b-versatile' : (process.env.OPENAI_MODEL || 'gpt-4o-mini');
  return {
    ok: true,
    room: { id: room.id, expiresAt: room.createdAt + ROOM_TTL_MS },
    twitch: { ...room.twitch.getStatus(), oauthConfigured: twitchOAuthConfigured(), identity: room.state.twitchIdentity },
    eventsub: room.eventSub.getStatus(),
    codex: {
      connected: true,
      hasApiKey: Boolean(activeKey),
      provider,
      model: Boolean(activeKey) ? modelName : 'Local Semantic AST',
      schemaName: 'ArenaPatchSchema v1 (strict)',
      logs: room.state.codexLogs
    },
    chatMessages: room.state.chatMessages,
    lastDiffs: room.state.lastDiffs,
    lastGuardrailReport: room.state.lastGuardrailReport,
    snapshot: room.engine.getSnapshot()
  };
}
const SECURITY_HEADERS = { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'same-origin', 'X-Frame-Options': 'SAMEORIGIN', 'Content-Security-Policy': "default-src 'self'; connect-src 'self' wss://irc-ws.chat.twitch.tv; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; base-uri 'self'; form-action 'self'" };
function sendJson(res, status, body) { res.writeHead(status, { ...SECURITY_HEADERS, 'Content-Type': 'application/json; charset=utf-8' }); res.end(JSON.stringify(body)); }
function readRawBody(req) { return new Promise((resolve, reject) => { let raw = ''; req.on('data', (chunk) => { raw += chunk; if (raw.length > 64_000) { reject(new Error('Request body too large')); req.destroy(); } }); req.on('end', () => resolve(raw)); req.on('error', reject); }); }
async function readJsonBody(req) { const raw = await readRawBody(req); try { return raw ? JSON.parse(raw) : {}; } catch { throw new Error('Invalid JSON body'); } }
function roomFrom(url, body) { return getRoom(body?.roomId || url.searchParams.get('room')); }

export const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
  try {
    if (req.method === 'GET' && url.pathname === '/favicon.ico') { res.writeHead(204, SECURITY_HEADERS); res.end(); return; }
    if (req.method === 'GET' && url.pathname === '/healthz') { sendJson(res, 200, { ok: true, rooms: rooms.size, uptimeSec: Math.round(process.uptime()) }); return; }
    if (req.method === 'GET' && url.pathname === '/auth/twitch/connect') {
      const room = getRoom(url.searchParams.get('room'), false);
      if (!room) { sendJson(res, 404, { ok: false, error: 'Studio room is unavailable. Return to the app and try again.' }); return; }
      if (!twitchOAuthConfigured()) { sendJson(res, 503, { ok: false, error: 'Twitch OAuth is not configured on this deployment yet.' }); return; }
      const state = crypto.randomBytes(24).toString('base64url');
      oauthStates.set(state, { roomId: room.id, expiresAt: Date.now() + OAUTH_STATE_TTL_MS });
      const authorize = new URL('https://id.twitch.tv/oauth2/authorize');
      authorize.searchParams.set('client_id', process.env.TWITCH_CLIENT_ID);
      authorize.searchParams.set('redirect_uri', process.env.TWITCH_REDIRECT_URI);
      authorize.searchParams.set('response_type', 'code');
      authorize.searchParams.set('scope', TWITCH_CHAT_SCOPES.join(' '));
      authorize.searchParams.set('state', state);
      res.writeHead(302, { Location: authorize.toString(), 'Cache-Control': 'no-store' }); res.end(); return;
    }
    if (req.method === 'GET' && url.pathname === '/auth/twitch/callback') {
      const state = String(url.searchParams.get('state') || ''); const pending = oauthStates.get(state);
      oauthStates.delete(state);
      if (!pending || pending.expiresAt < Date.now() || !twitchOAuthConfigured()) { sendJson(res, 400, { ok: false, error: 'Twitch authorization expired or is not configured. Start again from the studio.' }); return; }
      const room = getRoom(pending.roomId, false);
      const origin = `${req.headers['x-forwarded-proto'] || 'https'}://${req.headers.host}`;
      if (!room || url.searchParams.has('error')) { res.writeHead(302, { Location: roomUrl(origin, pending.roomId, 'cancelled') }); res.end(); return; }
      const code = url.searchParams.get('code');
      if (!code) { res.writeHead(302, { Location: roomUrl(origin, pending.roomId, 'failed') }); res.end(); return; }
      const tokenResponse = await fetch('https://id.twitch.tv/oauth2/token', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ client_id: process.env.TWITCH_CLIENT_ID, client_secret: process.env.TWITCH_CLIENT_SECRET, code, grant_type: 'authorization_code', redirect_uri: process.env.TWITCH_REDIRECT_URI }) });
      if (!tokenResponse.ok) { res.writeHead(302, { Location: roomUrl(origin, room.id, 'failed') }); res.end(); return; }
      const token = await tokenResponse.json();
      const userResponse = await fetch('https://api.twitch.tv/helix/users', { headers: { 'Client-ID': process.env.TWITCH_CLIENT_ID, Authorization: `Bearer ${token.access_token}` } });
      const twitchUser = (await userResponse.json()).data?.[0];
      if (!userResponse.ok || !twitchUser?.login) { res.writeHead(302, { Location: roomUrl(origin, room.id, 'failed') }); res.end(); return; }
      if (room.state.channel) channelRooms.delete(room.state.channel);
      room.state.channel = cleanChannel(twitchUser.login); channelRooms.set(room.state.channel, room.id);
      room.state.twitchIdentity = { login: room.state.channel, displayName: twitchUser.display_name || twitchUser.login, userId: twitchUser.id, tokenExpiresAt: Date.now() + Number(token.expires_in || 0) * 1000 };
      room.twitch.connect(room.state.channel, { oauthToken: token.access_token, botNick: room.state.channel });
      pushChat(room, { username: 'system', color: '#86efac', message: `Authorized Twitch connection for #${room.state.channel}. Chat replies are enabled.`, source: 'twitch-oauth', badge: 'CONNECTED' });
      res.writeHead(302, { Location: roomUrl(origin, room.id, 'connected'), 'Cache-Control': 'no-store' }); res.end(); return;
    }
    if (req.method === 'GET' && (url.pathname === '/' || url.pathname === '/overlay' || url.pathname === '/codex')) {
      let room = getRoom(url.searchParams.get('room'), false);
      if (!room) { room = makeRoom(); const next = new URL(url.pathname, `http://${req.headers.host}`); next.searchParams.set('room', room.id); res.writeHead(302, { Location: `${next.pathname}${next.search}` }); res.end(); return; }
      const html = renderChaosForgeHtml({ initialPayload: payload(room), presets: SIGNATURE_PATCH_PRESETS }); res.writeHead(200, { ...SECURITY_HEADERS, 'Content-Type': 'text/html; charset=utf-8' }); res.end(html); return;
    }
    if (req.method === 'GET' && url.pathname === '/api/state') { const room = roomFrom(url); sendJson(res, 200, payload(room)); return; }
    if (req.method === 'POST' && url.pathname === '/api/twitch/eventsub') {
      const rawBody = await readRawBody(req); let eventBody;
      try { eventBody = rawBody ? JSON.parse(rawBody) : {}; } catch { sendJson(res, 400, { ok: false, error: 'Invalid EventSub JSON body.' }); return; }
      const msgId = req.headers['twitch-eventsub-message-id']; const msgTs = req.headers['twitch-eventsub-message-timestamp']; const signature = req.headers['twitch-eventsub-message-signature']; const secret = process.env.TWITCH_EVENTSUB_SECRET;
      const timestamp = Date.parse(String(msgTs || ''));
      const freshTimestamp = Number.isFinite(timestamp) && Math.abs(Date.now() - timestamp) <= 10 * 60 * 1000;
      if (!secret || !msgId || !freshTimestamp || !signature || !verifyTwitchEventSubSignature({ secret, messageId: msgId, messageTimestamp: msgTs, rawBody, signatureHeader: signature })) { sendJson(res, 403, { ok: false, error: 'Valid, recent Twitch EventSub signature and server secret required.' }); return; }
      if (recentEventSubIds.has(msgId)) { sendJson(res, 202, { ok: true, duplicate: true }); return; }
      recentEventSubIds.set(msgId, Date.now());
      if (req.headers['twitch-eventsub-message-type'] === 'webhook_callback_verification' && eventBody.challenge) { res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' }); res.end(String(eventBody.challenge)); return; }
      const requestedRoom = cleanRoomId(url.searchParams.get('room')); const room = getRoom(requestedRoom, false);
      if (!room) { sendJson(res, 404, { ok: false, error: 'EventSub room is unavailable.' }); return; }
      const directive = room.eventSub.triggerEvent(eventBody?.subscription?.type || 'channel.follow', eventBody.event || {}, 'eventsub_webhook'); sendJson(res, 200, { ...payload(room), directive }); return;
    }
    const body = req.method === 'POST' ? await readJsonBody(req) : null; const room = roomFrom(url, body);
    if (req.method === 'POST' && url.pathname === '/api/twitch/leave') {
      if (room.state.channel) channelRooms.delete(room.state.channel);
      room.twitch.disconnect({ forgetCredentials: false });
      room.state.channel = null;
      pushChat(room, { username: 'system', message: 'Left the live Twitch chat. Your authorized account remains available for another channel.', source: 'twitch-irc', badge: 'DISCONNECTED' });
      sendJson(res, 200, payload(room)); return;
    }
    if (req.method === 'POST' && url.pathname === '/api/twitch/disconnect-account') {
      const accessToken = room.twitch.getAccessToken();
      if (room.state.channel) channelRooms.delete(room.state.channel);
      room.twitch.disconnect();
      room.state.channel = null;
      room.state.twitchIdentity = null;
      let revoked = false;
      if (accessToken && process.env.TWITCH_CLIENT_ID) {
        try {
          const revokeResponse = await fetch('https://id.twitch.tv/oauth2/revoke', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ client_id: process.env.TWITCH_CLIENT_ID, token: accessToken }),
            signal: AbortSignal.timeout(8_000)
          });
          revoked = revokeResponse.ok;
        } catch {
          revoked = false;
        }
      }
      pushChat(room, { username: 'system', message: revoked ? 'Twitch account disconnected and OAuth access revoked.' : 'Twitch account disconnected locally. Revoke access in Twitch Connections if needed.', source: 'twitch-oauth', badge: revoked ? 'REVOKED' : 'DISCONNECTED' });
      sendJson(res, 200, { ...payload(room), revoked }); return;
    }
    if (req.method === 'POST' && url.pathname === '/api/twitch/say') {
      const message = String(body.message || '').replace(/[\r\n]+/g, ' ').trim().slice(0, 500);
      if (!message) { sendJson(res, 400, { ok: false, error: 'Enter a Twitch chat message.' }); return; }
      if (!room.twitch.authenticated || room.twitch.status !== 'connected' || !room.state.twitchIdentity?.login) {
        sendJson(res, 409, { ok: false, error: 'Authorize your Twitch account and connect a channel before sending to Twitch.' }); return;
      }
      if (Date.now() - room.state.lastTwitchMessageAt < 1_200) {
        sendJson(res, 429, { ok: false, error: 'Chat is rate-limited. Wait a moment before sending again.' }); return;
      }
      if (!room.twitch.say(message)) {
        sendJson(res, 429, { ok: false, error: 'Twitch chat is temporarily rate-limited or unavailable.' }); return;
      }
      room.state.lastTwitchMessageAt = Date.now();
      pushChat(room, { username: room.state.twitchIdentity.login, color: '#86efac', message, source: `twitch-outgoing (#${room.state.channel})`, badge: 'OUTGOING' });
      sendJson(res, 200, payload(room)); return;
    }
    if (req.method === 'POST' && url.pathname === '/api/chat/send') { const processed = await processIncoming(room, { username: body.username || 'viewer', color: body.color || '#00F5D4', message: body.message, source: body.source || 'studio-live-chat', badge: body.badge || 'CHAT' }); sendJson(res, 200, { ...payload(room), processed }); return; }
    if (req.method === 'POST' && url.pathname === '/api/patch/compile') { const processed = await processIncoming(room, { username: body.author || 'viewer', message: `!patch ${String(body.prompt || '')}`, source: 'codex-mutator', badge: 'CODEX' }); const data = payload(room); sendJson(res, processed?.codexEntry ? 200 : 429, { ...data, ...(processed?.codexEntry ? { compilerMode: processed.codexEntry.compilerMode, compileLatencyMs: processed.codexEntry.compileLatencyMs, patch: room.engine.activePatch, diffs: processed.codexEntry.diffs } : { ok: false, error: processed?.chatEntry?.reply || 'Patch rejected' }) }); return; }
    if (req.method === 'POST' && url.pathname === '/api/patch/rollback') { const previous = structuredClone(room.engine.activePatch); const rolled = room.engine.rollbackToPatch(body.patchId); if (!rolled) { sendJson(res, 404, { ok: false, error: 'Patch ID not found in this room history' }); return; } const diffs = computePatchDiff(previous, rolled); pushCodexLog(room, { author: 'room_rollback', prompt: `Rollback to ${rolled.title}`, compilerMode: 'ast-snapshot-rollback', compileLatencyMs: 0.1, patch: rolled, diffs }); sendJson(res, 200, { ...payload(room), patch: rolled, diffs }); return; }
    if (req.method === 'POST' && url.pathname === '/api/patch/test-guardrail') { const energy = body.scenario === 'energy_divergence'; const adversarial = energy ? { title: 'Unbounded Kinetic Explosion', fieldLaw: { type: 'zero_g_drift', gravityStrength: 9999, vortexTorque: -9999, damping: 0.999, restitution: 2.85, tetherStiffness: 4.5 }, bossSpec: { name: 'Divergent Boss', chassis: 'gyro_seraph', shieldArcs: 12, rotationSpeed: 15, aggression: 9, projectileSpeed: 4000, behaviorSequence: ['ricochet_prism_beam'] } } : { title: 'Malicious Exploit eval(window.location)', fieldLaw: { type: 'central_attractor', gravityStrength: 'function(){ return eval("alert(1)"); }' } }; const report = validateAndNormalizePatch(adversarial); room.state.lastGuardrailReport = { testedAt: nowLabel(), scenario: energy ? 'Energy divergence' : 'Executable code injection', blocked: !report.valid, clampedWarnings: report.warnings || [], inputPayload: adversarial, report }; sendJson(res, 200, { ...payload(room), guardrailResult: room.state.lastGuardrailReport }); return; }
    if (req.method === 'POST' && url.pathname === '/api/twitch/eventsub/simulate') { const directive = room.eventSub.triggerEvent(body.type || 'channel.raid', body.event || { user_name: body.username || 'viewer', from_broadcaster_user_name: body.username || 'viewer', viewers: body.viewers || 45, bits: body.bits || 500, tier: body.tier || '3000', level: body.level || 4 }, 'studio_simulation'); sendJson(res, 200, { ...payload(room), directive }); return; }
    if (req.method === 'POST' && url.pathname === '/api/codex/config') {
      const rawKey = String(body?.apiKey || '').trim();
      if (!rawKey) {
        room.state.apiKey = null;
        room.state.apiProvider = null;
        pushChat(room, { username: 'system', message: 'Codex compiler reverted to deterministic local semantic AST mode.', source: 'codex-config', badge: 'LOCAL_AST' });
      } else if (rawKey.startsWith('gsk_')) {
        room.state.apiKey = rawKey;
        room.state.apiProvider = 'groq';
        pushChat(room, { username: 'system', message: 'Connected Groq Cloud LLM (llama-3.3-70b-versatile) for live rule compilations.', source: 'codex-config', badge: 'GROQ_CONNECTED' });
      } else if (rawKey.startsWith('sk-')) {
        room.state.apiKey = rawKey;
        room.state.apiProvider = 'openai';
        pushChat(room, { username: 'system', message: 'Connected OpenAI Codex LLM (gpt-4o-mini) for live rule compilations.', source: 'codex-config', badge: 'OPENAI_CONNECTED' });
      } else {
        sendJson(res, 400, { ok: false, error: 'Unrecognized API key format. Please enter a Groq key (starts with gsk_) or OpenAI key (starts with sk-).' });
        return;
      }
      sendJson(res, 200, payload(room)); return;
    }
    if (req.method === 'POST' && url.pathname === '/api/twitch/connect') { const channel = cleanChannel(body.channel); if (!channel) { sendJson(res, 400, { ok: false, error: 'Enter a valid Twitch channel name.' }); return; } if (room.state.channel) channelRooms.delete(room.state.channel); room.state.channel = channel; channelRooms.set(channel, room.id); const status = room.twitch.connect(channel); pushChat(room, { username: 'system', message: `Connecting server IRC bridge to #${channel}; anonymous mode reads chat only.`, source: 'twitch-irc', badge: 'SYSTEM' }); sendJson(res, 200, { ...payload(room), status }); return; }
    sendJson(res, 404, { ok: false, error: 'Not found' });
  } catch (error) { sendJson(res, 400, { ok: false, error: error.message || 'Bad request' }); }
});

setInterval(() => { const cutoff = Date.now() - ROOM_TTL_MS; for (const [id, room] of rooms) { room.engine.step(1 / 60); if (room.lastAccessAt < cutoff) { room.twitch.disconnect(); rooms.delete(id); if (room.state.channel) channelRooms.delete(room.state.channel); } } for (const [id, at] of recentEventSubIds) if (at < Date.now() - 10 * 60 * 1000) recentEventSubIds.delete(id); for (const [state, pending] of oauthStates) if (pending.expiresAt < Date.now()) oauthStates.delete(state); }, 1000 / 60);
if (import.meta.url === `file://${process.argv[1]?.replace(/\\/g, '/')}` || process.argv[1]?.endsWith('server.mjs')) server.listen(PORT, () => console.log(`ChaosForge running at http://localhost:${PORT}`));
