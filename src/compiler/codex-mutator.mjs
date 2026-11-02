/**
 * ChaosForge — Live Codex Rule Mutator & Semantic NL-to-AST Compiler
 *
 * Translates natural-language mutation prompts from Twitch Chat (`!patch <prompt>`)
 * or the Streamer Director Deck into a strictly validated `ArenaPatchSchema v1` AST.
 *
 * Supports:
 *   1. OpenAI Structured Outputs (`OPENAI_API_KEY` via Responses/Chat Completions API
 *      enforcing `OPENAI_ARENA_PATCH_JSON_SCHEMA` with `strict: true`).
 *   2. Deterministic Semantic AST Compiler (zero-key local compilation that parses
 *      physical force directives, boss topologies, tether elasticity, and harmonic
 *      frequencies directly into the validated AST).
 */

import {
  DEFAULT_ARENA_PATCH,
  OPENAI_ARENA_PATCH_JSON_SCHEMA,
  validateAndNormalizePatch,
  computePatchDiff
} from './schema.mjs';

export const SIGNATURE_PATCH_PRESETS = [
  {
    id: 'preset-binary-pulsar',
    label: 'Binary Pulsar Singularity',
    prompt: 'Split the reactor into twin binary pulsar gravity wells with high Coriolis spin and ricochet prism beams.',
    author: 'codex-preset',
    candidate: {
      title: 'Twin Binary Pulsar Wells',
      fieldLaw: {
        type: 'binary_pulsar',
        gravityStrength: 265,
        vortexTorque: 195,
        damping: 0.986,
        restitution: 0.94,
        tetherStiffness: 0.22
      },
      bossSpec: {
        name: 'Pulsar-Twin Gemini Core',
        chassis: 'gyro_seraph',
        shieldArcs: 4,
        rotationSpeed: 1.85,
        aggression: 1.55,
        projectileSpeed: 390,
        behaviorSequence: [
          'gravitational_singularity',
          'ricochet_prism_beam',
          'spiral_lance_barrage'
        ]
      },
      droneLaw: {
        impulseMultiplier: 1.65,
        tetherDamageBonus: 2.75,
        parryReflectMultiplier: 2.1,
        activeVerbs: ['slingshot', 'tether', 'parry', 'gravity_well', 'overclock']
      },
      aesthetics: {
        primaryHue: 278,
        accentHue: 42,
        gridDistortion: 0.88,
        harmonicFrequencyHz: 330
      }
    }
  },
  {
    id: 'preset-magnetic-whip',
    label: 'Magnetic Dipole Tether Whip',
    prompt: 'Invert north/south magnetic dipole poles, supercharge elastic viewer tether whips to 3.4x damage, and deploy Leviathan Coil.',
    author: 'codex-preset',
    candidate: {
      title: 'Dipole Tether Overdrive',
      fieldLaw: {
        type: 'magnetic_dipole',
        gravityStrength: -180,
        vortexTorque: -220,
        damping: 0.984,
        restitution: 1.04,
        tetherStiffness: 0.36
      },
      bossSpec: {
        name: 'Leviathan Gauss Coil',
        chassis: 'leviathan_coil',
        shieldArcs: 2,
        rotationSpeed: -2.1,
        aggression: 1.75,
        projectileSpeed: 430,
        behaviorSequence: [
          'tether_whip_sweep',
          'emp_ring_pulse',
          'ricochet_prism_beam'
        ]
      },
      droneLaw: {
        impulseMultiplier: 1.95,
        tetherDamageBonus: 3.4,
        parryReflectMultiplier: 2.4,
        activeVerbs: ['tether', 'slingshot', 'emp', 'parry', 'overclock']
      },
      aesthetics: {
        primaryHue: 158,
        accentHue: 14,
        gridDistortion: 0.76,
        harmonicFrequencyHz: 164.8
      }
    }
  },
  {
    id: 'preset-chronos-lattice',
    label: 'Chronos 4-Pole Harmonic Lattice',
    prompt: 'Create a 4-node harmonic standing-wave lattice with Chronos Tesseract boss, 5 shield arcs, and high-speed parry reflections.',
    author: 'codex-preset',
    candidate: {
      title: 'Chronos Harmonic Lattice',
      fieldLaw: {
        type: 'harmonic_lattice',
        gravityStrength: 190,
        vortexTorque: 140,
        damping: 0.991,
        restitution: 0.92,
        tetherStiffness: 0.25
      },
      bossSpec: {
        name: 'Chronos-IV Tesseract',
        chassis: 'chronos_tesseract',
        shieldArcs: 5,
        rotationSpeed: 1.35,
        aggression: 1.4,
        projectileSpeed: 350,
        behaviorSequence: [
          'orbital_mine_ring',
          'ricochet_prism_beam',
          'spiral_lance_barrage',
          'emp_ring_pulse'
        ]
      },
      droneLaw: {
        impulseMultiplier: 1.5,
        tetherDamageBonus: 2.5,
        parryReflectMultiplier: 2.85,
        activeVerbs: ['parry', 'slingshot', 'tether', 'overclock', 'gravity_well']
      },
      aesthetics: {
        primaryHue: 205,
        accentHue: 52,
        gridDistortion: 0.95,
        harmonicFrequencyHz: 440
      }
    }
  },
  {
    id: 'preset-zero-g-ricochet',
    label: 'Zero-G Hyper-Elastic Ricochet Chamber',
    prompt: 'Kill central gravity into zero-g drift, crank wall restitution to hyper-elastic 1.12x, and fire prism ricochet lasers.',
    author: 'codex-preset',
    candidate: {
      title: 'Zero-G Prism Ricochet',
      fieldLaw: {
        type: 'zero_g_drift',
        gravityStrength: 0,
        vortexTorque: 45,
        damping: 0.981,
        restitution: 1.12,
        tetherStiffness: 0.19
      },
      bossSpec: {
        name: 'Seraph Prism Array',
        chassis: 'gyro_seraph',
        shieldArcs: 3,
        rotationSpeed: 2.45,
        aggression: 1.85,
        projectileSpeed: 510,
        behaviorSequence: [
          'ricochet_prism_beam',
          'spiral_lance_barrage',
          'tether_whip_sweep'
        ]
      },
      droneLaw: {
        impulseMultiplier: 2.25,
        tetherDamageBonus: 2.3,
        parryReflectMultiplier: 3.1,
        activeVerbs: ['slingshot', 'parry', 'overclock', 'emp']
      },
      aesthetics: {
        primaryHue: 336,
        accentHue: 184,
        gridDistortion: 0.62,
        harmonicFrequencyHz: 293.66
      }
    }
  }
];

function hashPromptDeterministically(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/**
 * Semantic NL-to-AST synthesizer that deterministically extracts physical laws,
 * boss topology, and drone multipliers from any natural-language prompt.
 */
export function synthesizeSemanticCandidate(promptText, basePatch = DEFAULT_ARENA_PATCH) {
  const clean = String(promptText || '').trim();
  const lower = clean.toLowerCase();
  const seed = hashPromptDeterministically(lower || 'genesis');

  // 1. Determine Field Law Type
  let fieldType = basePatch.fieldLaw.type;
  if (/binary|twin|pulsar|two\s+star|double\s+core/.test(lower)) {
    fieldType = 'binary_pulsar';
  } else if (/magnet|dipole|pole|polar|repel/.test(lower)) {
    fieldType = 'magnetic_dipole';
  } else if (/harmonic|lattice|grid|crystal|standing\s+wave|tesseract/.test(lower)) {
    fieldType = 'harmonic_lattice';
  } else if (/zero[\s-]*g|weightless|drift|no\s+gravity/.test(lower)) {
    fieldType = 'zero_g_drift';
  } else if (/vortex|cyclone|whirlpool|tornado|swirl|coriolis/.test(lower)) {
    fieldType = 'coriolis_vortex';
  } else if (/black\s*hole|singularity|attractor/.test(lower)) {
    fieldType = 'central_attractor';
  }

  // 2. Gravity & Vortex Magnitude
  let gravityStrength = basePatch.fieldLaw.gravityStrength;
  if (fieldType === 'zero_g_drift') {
    gravityStrength = 0;
  } else if (/invert|reverse|repel|anti[\s-]*gravity|push\s+away/.test(lower)) {
    gravityStrength = -Math.abs(220 + (seed % 140));
  } else if (/heavy|crush|singularity|black\s*hole|extreme\s+gravity|3x/.test(lower)) {
    gravityStrength = 310 + (seed % 95);
  } else if (/low\s+gravity|moon|float/.test(lower)) {
    gravityStrength = 65;
  } else {
    gravityStrength = 135 + ((seed % 160) - 40);
  }

  let vortexTorque = basePatch.fieldLaw.vortexTorque;
  if (/spin|vortex|cyclone|spiral|orbit|whirl/.test(lower)) {
    const sign = /counter|reverse|left/.test(lower) ? -1 : 1;
    vortexTorque = sign * (210 + (seed % 120));
  } else {
    vortexTorque = ((seed % 2 === 0 ? 1 : -1) * (75 + (seed % 110)));
  }

  // 3. Restitution & Tether Stiffness
  let restitution = 0.88;
  if (/bounce|elastic|ricochet|pinball|rubber|mirror/.test(lower)) {
    restitution = 1.08;
  } else if (/heavy|absorb|damp|slow/.test(lower)) {
    restitution = 0.58;
  }

  let tetherStiffness = 0.18;
  if (/tether|whip|rope|chain|link|elastic/.test(lower)) {
    tetherStiffness = 0.36;
  }

  // 4. Boss Chassis & Attacks
  let chassis = basePatch.bossSpec.chassis;
  if (/leviathan|coil|serpent|whip/.test(lower)) {
    chassis = 'leviathan_coil';
  } else if (/chronos|tesseract|cube|time|lattice/.test(lower)) {
    chassis = 'chronos_tesseract';
  } else if (/seraph|gyro|prism|wing|ring/.test(lower)) {
    chassis = 'gyro_seraph';
  } else if (/citadel|fortress|hex|shield/.test(lower)) {
    chassis = 'hex_citadel';
  } else {
    const chassisList = ['hex_citadel', 'gyro_seraph', 'chronos_tesseract', 'leviathan_coil'];
    chassis = chassisList[seed % chassisList.length];
  }

  const attacks = [];
  if (/ricochet|mirror|prism|laser|beam/.test(lower)) attacks.push('ricochet_prism_beam');
  if (/black\s*hole|singularity|pull|well/.test(lower)) attacks.push('gravitational_singularity');
  if (/whip|tether|sweep|lasso/.test(lower)) attacks.push('tether_whip_sweep');
  if (/emp|shockwave|pulse|nova/.test(lower)) attacks.push('emp_ring_pulse');
  if (/mine|trap|orbital|ring/.test(lower)) attacks.push('orbital_mine_ring');
  if (/spiral|barrage|lance|bullet/.test(lower)) attacks.push('spiral_lance_barrage');

  if (attacks.length < 2) {
    attacks.push('spiral_lance_barrage', 'ricochet_prism_beam', 'emp_ring_pulse');
  }

  const shieldArcs = /no\s+shield|glass\s+cannon|unshielded/.test(lower)
    ? 1
    : /fortress|max\s+shield|5\s+shield|6\s+shield/.test(lower)
    ? 5
    : 2 + (seed % 4);

  const aggression = /berserk|overdrive|insane|fast|chaos/.test(lower)
    ? 2.15
    : /calm|slow|training/.test(lower)
    ? 0.75
    : Number((1.15 + ((seed % 85) / 100)).toFixed(2));

  const projectileSpeed = Math.round(240 + aggression * 115 + (seed % 60));

  // 5. Drone Law
  const impulseMultiplier = /fast\s+drone|turbo|slingshot|boost|overclock|3x|2x/.test(lower)
    ? 2.25
    : Number((1.25 + ((seed % 70) / 100)).toFixed(2));

  const tetherDamageBonus = /whip|tether|chain|link/.test(lower) ? 3.3 : 2.2;
  const parryReflectMultiplier = /parry|reflect|mirror|deflect/.test(lower) ? 2.9 : 1.85;

  // 6. Title & Aesthetics
  const words = clean
    .replace(/[^a-zA-Z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !/^(make|the|and|with|into|turn|give|for|chat|boss)$/i.test(w))
    .slice(0, 4);

  const generatedTitle = words.length >= 2
    ? words.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ')
    : `Anomaly Patch #${(seed % 900) + 100}`;

  const primaryHue = (seed % 360);
  const accentHue = ((primaryHue + 145 + (seed % 70)) % 360);
  const harmonicFrequencyHz = Number((140 + (seed % 320)).toFixed(1));

  return {
    title: generatedTitle,
    fieldLaw: {
      type: fieldType,
      gravityStrength,
      vortexTorque,
      damping: 0.985,
      restitution,
      tetherStiffness
    },
    bossSpec: {
      name: `${generatedTitle.split(' ')[0]} ${chassis.replace('_', ' ').toUpperCase()}`,
      chassis,
      shieldArcs,
      rotationSpeed: Number((((seed % 2 === 0 ? 1 : -1) * (1.1 + (seed % 16) / 10))).toFixed(2)),
      aggression,
      projectileSpeed,
      behaviorSequence: Array.from(new Set(attacks)).slice(0, 4)
    },
    droneLaw: {
      impulseMultiplier,
      tetherDamageBonus,
      parryReflectMultiplier,
      activeVerbs: ['slingshot', 'tether', 'parry', 'overclock', 'emp', 'gravity_well']
    },
    aesthetics: {
      primaryHue,
      accentHue,
      gridDistortion: Number((0.45 + ((seed % 50) / 100)).toFixed(2)),
      harmonicFrequencyHz
    }
  };
}

/**
 * Calls OpenAI API with strict JSON Schema output if `apiKey` is available;
 * otherwise compiles deterministically via `synthesizeSemanticCandidate`.
 */
export async function compileNaturalLanguagePatch({
  prompt,
  author = 'twitch-chat',
  currentPatch = DEFAULT_ARENA_PATCH,
  apiKey = process.env.OPENAI_API_KEY,
  model = process.env.OPENAI_MODEL || 'gpt-4o-mini'
}) {
  const startedAt = performance.now();
  const cleanPrompt = String(prompt || '').trim();

  if (!cleanPrompt) {
    return {
      ok: false,
      error: 'Mutation prompt cannot be empty'
    };
  }

  // Check if prompt matches a named preset ID directly
  const matchedPreset = SIGNATURE_PATCH_PRESETS.find((p) => p.id === cleanPrompt);
  let rawCandidate = null;
  let compilerMode = 'codex-semantic-ast';
  let llmFallbackReason = null;

  if (matchedPreset) {
    rawCandidate = structuredClone(matchedPreset.candidate);
    compilerMode = 'codex-curated-preset';
  } else if (apiKey && typeof apiKey === 'string') {
    const isGroq = apiKey.startsWith('gsk_');
    const isOpenAI = apiKey.startsWith('sk-');
    if (isGroq || isOpenAI) {
      try {
        const endpoint = isGroq
          ? 'https://api.groq.com/openai/v1/chat/completions'
          : 'https://api.openai.com/v1/chat/completions';
        const selectedModel = isGroq
          ? (model && model.includes('llama') ? model : 'llama-3.3-70b-versatile')
          : (model || 'gpt-4o-mini');

        const requestBody = {
          model: selectedModel,
          temperature: 0.3,
          messages: [
            {
              role: 'system',
              content:
                'You are the ChaosForge Live Physics & Boss AST Compiler for Twitch streams. ' +
                'Convert the viewer or streamer natural-language mutation directive into a valid ArenaPatch JSON object matching the strict schema. ' +
                'Output must be valid raw JSON with keys: title, fieldLaw, bossSpec, droneLaw, aesthetics. No markdown, no prose.' +
                (isGroq ? ' JSON Schema (follow exactly, use only listed enum values): ' + JSON.stringify(OPENAI_ARENA_PATCH_JSON_SCHEMA.schema) : '')
            },
            {
              role: 'user',
              content: `Current active patch: ${JSON.stringify({
                title: currentPatch.title,
                fieldLaw: currentPatch.fieldLaw,
                bossSpec: currentPatch.bossSpec
              })}\n\nViewer/Streamer mutation request: "${cleanPrompt}"`
            }
          ]
        };

        if (isOpenAI) {
          requestBody.response_format = {
            type: 'json_schema',
            json_schema: OPENAI_ARENA_PATCH_JSON_SCHEMA
          };
        } else {
          requestBody.response_format = { type: 'json_object' };
        }

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`
          },
          body: JSON.stringify(requestBody)
        });

        if (response.ok) {
          const data = await response.json();
          const content = data?.choices?.[0]?.message?.content;
          if (content) {
            rawCandidate = JSON.parse(content);
            compilerMode = `${isGroq ? 'groq-live' : 'openai-live'} (${selectedModel})`;
          } else {
            llmFallbackReason = 'empty response';
          }
        } else {
          llmFallbackReason = `HTTP ${response.status}`;
        }
      } catch (error) {
        llmFallbackReason = error?.name === 'SyntaxError' ? 'invalid JSON' : 'network error';
      }
    }
  }

  if (!rawCandidate) {
    rawCandidate = synthesizeSemanticCandidate(cleanPrompt, currentPatch);
    if (llmFallbackReason) compilerMode = `codex-semantic-ast (LLM fallback: ${llmFallbackReason})`;
  }

  let validation = validateAndNormalizePatch(rawCandidate, {
    author,
    sourcePrompt: cleanPrompt,
    compilerMode
  });

  // An LLM can return JSON that fails the strict schema. Keep the stream alive
  // with the deterministic compiler and say so in the log.
  if (!validation.valid && compilerMode.includes('-live')) {
    const reasons = (validation.rejectedReasons || []).slice(0, 2).join('; ');
    compilerMode = `codex-semantic-ast (LLM output rejected: ${reasons || 'schema'})`;
    rawCandidate = synthesizeSemanticCandidate(cleanPrompt, currentPatch);
    validation = validateAndNormalizePatch(rawCandidate, { author, sourcePrompt: cleanPrompt, compilerMode });
  }

  const compileLatencyMs = Number((performance.now() - startedAt).toFixed(2));
  if (!validation.valid) {
    return {
      ok: false,
      compilerMode,
      compileLatencyMs,
      validation
    };
  }

  const diffs = computePatchDiff(currentPatch, validation.patch);
  return {
    ok: true,
    compilerMode,
    compileLatencyMs,
    patch: validation.patch,
    validation,
    diffs
  };
}
