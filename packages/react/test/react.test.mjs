import assert from 'node:assert';
import { test } from 'node:test';
import * as ReactLib from '../dist/index.js';

test('React library exports', () => {
  assert.ok(ReactLib.AgentOrb, 'AgentOrb component is exported');
  assert.ok(ReactLib.AgentPill, 'AgentPill component is exported');
  assert.ok(ReactLib.useAgentOrb, 'useAgentOrb hook is exported');
  assert.ok(ReactLib.DEFAULT_PILL_LABELS, 'DEFAULT_PILL_LABELS is exported');
  assert.ok(ReactLib.createOrbRenderer, 'createOrbRenderer re-exported');
  assert.ok(ReactLib.ORB_TOKENS, 'ORB_TOKENS re-exported');
  assert.strictEqual(ReactLib.ORB_TOKENS.background, '#040404');
  assert.strictEqual(ReactLib.ORB_TOKENS.foreground, '#FFFFFF');
  assert.strictEqual(ReactLib.ORB_TOKENS.accent, '#37393E');
});

test('DEFAULT_PILL_LABELS matches Reference Image 2 specifications', () => {
  const labels = ReactLib.DEFAULT_PILL_LABELS;
  assert.strictEqual(labels.solving, 'Solving....');
  assert.strictEqual(labels.thinking, 'Thinking....');
  assert.strictEqual(labels.listening, 'Agent listening...');
  assert.strictEqual(labels.working, 'Working....');
  assert.strictEqual(labels.searching, 'Searching....');
  assert.strictEqual(labels.streaming, 'Streaming....');
  assert.strictEqual(labels.idle, 'Agent ready');
  assert.strictEqual(labels.error, 'Interrupted...');
});

test('Components are valid React components/forwardRefs', () => {
  assert.strictEqual(typeof ReactLib.AgentOrb, 'object');
  assert.strictEqual(ReactLib.AgentOrb.displayName, 'AgentOrb');

  assert.strictEqual(typeof ReactLib.AgentPill, 'object');
  assert.strictEqual(ReactLib.AgentPill.displayName, 'AgentPill');

  assert.strictEqual(typeof ReactLib.useAgentOrb, 'function');
});
