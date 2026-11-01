import test from 'node:test';
import assert from 'node:assert/strict';

import {
  DEFAULT_ARENA_PATCH,
  validateAndNormalizePatch,
  computePatchDiff
} from '../src/compiler/schema.mjs';
import {
  compileNaturalLanguagePatch,
  SIGNATURE_PATCH_PRESETS
} from '../src/compiler/codex-mutator.mjs';
import {
  ChaosForgeArenaEngine,
  evaluateVectorField,
  isAngleBlockedByBossShield
} from '../src/engine/physics.mjs';
import { parseTwitchIrcLine } from '../src/twitch/bridge.mjs';

test('ArenaPatchSchema validator enforces Lyapunov energy bounds and rejects executable tokens', () => {
  // 1. Rejects payload with forbidden executable token
  const malicious = {
    title: 'eval(alert(1))',
    fieldLaw: { type: 'central_attractor', gravityStrength: 100 }
  };
  const rejected = validateAndNormalizePatch(malicious);
  assert.equal(rejected.valid, false);
  assert.ok(rejected.rejectedReasons.length > 0);

  // 2. Clamps super-elastic restitution damping so kinetic energy cannot diverge
  const superElastic = {
    title: 'Hyper Bounce',
    fieldLaw: {
      type: 'zero_g_drift',
      gravityStrength: 0,
      vortexTorque: 90,
      damping: 0.997,
      restitution: 1.14,
      tetherStiffness: 0.25
    },
    bossSpec: {
      name: 'Prism Boss',
      chassis: 'gyro_seraph',
      shieldArcs: 3,
      rotationSpeed: 1.5,
      aggression: 1.2,
      projectileSpeed: 340,
      behaviorSequence: ['ricochet_prism_beam']
    }
  };
  const res = validateAndNormalizePatch(superElastic);
  assert.equal(res.valid, true);
  assert.ok(res.patch.fieldLaw.damping <= 0.984, 'Damping must be clamped when restitution > 1.0');
  assert.ok(res.estimatedTickCostMs < 1.5, 'Estimated tick cost must stay under 60 FPS budget');
});

test('NL-to-AST compiler translates natural-language Twitch !patch prompts into validated ArenaPatches with structural diffs', async () => {
  const result = await compileNaturalLanguagePatch({
    prompt: 'Split gravity into twin binary pulsar wells with prism ricochet lasers and 3x tether whip cleave',
    author: 'talhacomak',
    currentPatch: DEFAULT_ARENA_PATCH
  });

  assert.equal(result.ok, true);
  assert.equal(result.patch.fieldLaw.type, 'binary_pulsar');
  assert.equal(result.patch.fieldLaw.poles.length, 2);
  assert.ok(result.patch.bossSpec.behaviorSequence.includes('ricochet_prism_beam'));
  assert.ok(result.diffs.length >= 4, 'Should compute structural AST diffs against previous patch');
});

test('Twitch IRCv3 parser extracts display-name, color, badges, and !patch / !slingshot commands', () => {
  const raw =
    '@badge-info=;badges=broadcaster/1,subscriber/12;color=#00F5D4;display-name=bck_stack;mod=1;subscriber=1 :bck_stack!bck_stack@bck_stack.tmi.twitch.tv PRIVMSG #chaosforge :!patch invert magnetic dipole poles and deploy leviathan coil';
  const parsed = parseTwitchIrcLine(raw);

  assert.equal(parsed.type, 'PRIVMSG');
  assert.equal(parsed.channel, 'chaosforge');
  assert.equal(parsed.username, 'bck_stack');
  assert.equal(parsed.color, '#00F5D4');
  assert.equal(parsed.isMod, true);
  assert.equal(parsed.command, 'patch');
  assert.equal(parsed.argsText, 'invert magnetic dipole poles and deploy leviathan coil');
});

test('ChaosForgeArenaEngine steps deterministically at 60 FPS, links Verlet tethers, and hot-swaps patches without losing drones', async () => {
  const engine = new ChaosForgeArenaEngine({ width: 1280, height: 720 });

  engine.handleChatCommand({ username: 'bck_stack', color: '#00F5D4', command: 'join' });
  engine.handleChatCommand({ username: 'talhacomak', color: '#FF4D6D', command: 'join' });
  engine.handleChatCommand({
    username: 'bck_stack',
    color: '#00F5D4',
    command: 'tether',
    argsText: '@talhacomak'
  });

  assert.equal(engine.drones.size, 2);
  assert.equal(engine.tethers.length, 1);

  for (let i = 0; i < 60; i++) {
    engine.step(1 / 60);
  }

  const compiled = await compileNaturalLanguagePatch({
    prompt: SIGNATURE_PATCH_PRESETS[0].id,
    author: 'bck_stack',
    currentPatch: engine.activePatch
  });
  engine.applyValidatedPatch(compiled.patch, compiled.diffs, compiled.validation);

  const snap = engine.getSnapshot();
  assert.equal(snap.drones.length, 2, 'Hot-swapping AST patch must preserve active viewer drones');
  assert.equal(snap.activePatch.fieldLaw.type, 'binary_pulsar');
  assert.ok(snap.lastStepDurationMs < 5.0);
});
