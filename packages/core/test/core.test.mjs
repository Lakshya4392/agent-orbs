import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ORB_TOKENS,
  hexToRgba,
  createRotationMatrix,
  applyRotation,
  projectPoint,
  createFibonacciSphere,
  PRESETS,
  getPreset,
} from '../dist/index.js';

test('Tokens: Strict Palette Verification', () => {
  assert.equal(ORB_TOKENS.background, '#040404', 'Background must be #040404');
  assert.equal(ORB_TOKENS.foreground, '#FFFFFF', 'Foreground must be #FFFFFF');
  assert.equal(ORB_TOKENS.accent, '#37393E', 'Accent must be #37393E');
});

test('Color utils: hexToRgba', () => {
  assert.equal(hexToRgba('#FFFFFF', 0.5), 'rgba(255, 255, 255, 0.500)');
  assert.equal(hexToRgba('#040404', 1), 'rgba(4, 4, 4, 1.000)');
  assert.equal(hexToRgba('#37393E', 0.25), 'rgba(55, 57, 62, 0.250)');
  // 3-digit shorthand
  assert.equal(hexToRgba('#FFF', 1), 'rgba(255, 255, 255, 1.000)');
  // Clamping
  assert.equal(hexToRgba('#000', -0.5), 'rgba(0, 0, 0, 0.000)');
  assert.equal(hexToRgba('#000', 1.5), 'rgba(0, 0, 0, 1.000)');
});

test('Projection: 3D Rotation Matrix identity and rotation', () => {
  const identity = createRotationMatrix(0, 0, 0);
  assert.equal(Math.round(identity.m00), 1);
  assert.equal(Math.round(identity.m11), 1);
  assert.equal(Math.round(identity.m22), 1);

  const p = { x: 1, y: 0, z: 0 };
  const rotatedY90 = applyRotation(p, createRotationMatrix(0, Math.PI / 2, 0));
  // Rotating (1,0,0) by +90deg around Y gives (0, 0, -1)
  assert.ok(Math.abs(rotatedY90.x) < 1e-6);
  assert.ok(Math.abs(rotatedY90.y) < 1e-6);
  assert.ok(Math.abs(rotatedY90.z - (-1)) < 1e-6);
});

test('Projection: Perspective & Depth Falloff', () => {
  const pNear = { x: 0, y: 0, z: 50 };
  const pFar = { x: 0, y: 0, z: -50 };

  const projNear = projectPoint(pNear, {
    centerX: 100,
    centerY: 100,
    sphereRadius: 50,
  });

  const projFar = projectPoint(pFar, {
    centerX: 100,
    centerY: 100,
    sphereRadius: 50,
  });

  // Near points must have greater scale, greater depthAlpha, and larger radius
  assert.ok(projNear.scale > projFar.scale, 'Near scale must be larger than far scale');
  assert.ok(projNear.depthAlpha > projFar.depthAlpha, 'Near depthAlpha must be greater than far depthAlpha');
  assert.ok(projNear.radius > projFar.radius, 'Near radius must be greater than far radius');
  assert.ok(projNear.depthAlpha <= 1.0 && projNear.depthAlpha >= 0.0);
  assert.ok(projFar.depthAlpha <= 1.0 && projFar.depthAlpha >= 0.0);
});

test('Math: Fibonacci Sphere Point Cloud Distribution', () => {
  const count = 100;
  const radius = 60;
  const points = createFibonacciSphere(count, radius);

  assert.equal(points.length, count);

  for (const pt of points) {
    const dist = Math.sqrt(pt.x * pt.x + pt.y * pt.y + pt.z * pt.z);
    assert.ok(Math.abs(dist - radius) < 1e-4, `Point should lie on sphere radius ${radius}, got ${dist}`);
  }
});

test('Presets: All 10 presets registered and valid', () => {
  const expectedStates = [
    'solving',
    'thinking',
    'listening',
    'working',
    'searching',
    'streaming',
    'weaving',
    'diffusion',
    'idle',
    'error',
  ];

  for (const state of expectedStates) {
    const preset = PRESETS[state];
    assert.ok(preset, `Preset ${state} must be registered in PRESETS`);
    assert.equal(preset.name, state);
    assert.equal(typeof preset.render, 'function', `Preset ${state} must implement render`);

    const fetched = getPreset(state);
    assert.equal(fetched.name, state);
  }

  // Unknown fallback returns idle
  const unknownFallback = getPreset('non-existent');
  assert.equal(unknownFallback.name, 'idle');
});

test('Shapes: AI Agent Morphologies generator produces valid points', async () => {
  const { generateShapePoints } = await import('../dist/index.js');
  const agentMorphologies = ['cortex', 'lattice', 'waveform', 'orbital', 'radar', 'flux', 'synapse', 'weave', 'pixel', 'orb'];
  const count = 120;
  const radius = 50;

  for (const morph of agentMorphologies) {
    const pts = generateShapePoints(morph, count, radius);
    assert.equal(pts.length, count, `Morphology ${morph} must generate ${count} points`);
    for (const p of pts) {
      assert.ok(typeof p.x === 'number' && !isNaN(p.x));
      assert.ok(typeof p.y === 'number' && !isNaN(p.y));
      assert.ok(typeof p.z === 'number' && !isNaN(p.z));
    }
  }
});
