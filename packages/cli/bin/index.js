#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const command = args[0];

const AVAILABLE_STATES = [
  'solving',
  'thinking',
  'listening',
  'working',
  'searching',
  'streaming',
  'idle',
  'error',
];

const AVAILABLE_MORPHOLOGIES = [
  { id: 'cortex', desc: 'Neural Brain / Deep Reasoning (o1 / CoT)' },
  { id: 'lattice', desc: 'Geodesic Constraint Matrix / Logic & Math' },
  { id: 'waveform', desc: 'Acoustic Voice Spectrum / Audio & Speech' },
  { id: 'orbital', desc: 'Planetary Tool Gyroscope / Computer Use' },
  { id: 'radar', desc: 'Scanning Coordinate Meridian Globe / Web Search & RAG' },
  { id: 'flux', desc: 'Logarithmic Token Jet Vortex / LLM Completion' },
  { id: 'synapse', desc: 'Clustered Semantic Embeddings / Knowledge Graph' },
  { id: 'orb', desc: 'Minimalist Fibonacci Sphere' },
];

function printHelp() {
  console.log(`
🔮 agent-orbs: Add mathematical kinetic loaders to your project

Usage:
  npx agent-orbs <command> [options]

Commands:
  add <state>     Add a self-contained kinetic orb component (e.g. thinking, searching, solving, all)
  list            List all available AI kinetic states and cognitive morphologies
  init            Install @agent-orbs/react and scaffold component directory

Examples:
  npx agent-orbs add thinking
  npx agent-orbs add searching
  npx agent-orbs add all
`);
}

if (!command || command === '--help' || command === '-h') {
  printHelp();
  process.exit(0);
}

if (command === '--version' || command === '-v') {
  console.log('agent-orbs v0.1.0');
  process.exit(0);
}

if (command === 'list') {
  console.log('\n🔮 Available AI Kinetic States:');
  for (const s of AVAILABLE_STATES) {
    console.log(`  • ${s.padEnd(12)} - <AgentPill state="${s}" />`);
  }
  console.log('\n🧠 Available AI Agent Morphologies:');
  for (const m of AVAILABLE_MORPHOLOGIES) {
    console.log(`  • ${m.id.padEnd(12)} - shape="${m.id}" (${m.desc})`);
  }
  console.log('');
  process.exit(0);
}

if (command === 'init') {
  console.log('\n🚀 Initializing Agent Orbs in your project...\n');
  const targetDir = fs.existsSync('components/ui') ? 'components/ui' : 'components';
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  console.log(`✓ Scaffolded directory: ${targetDir}/`);
  console.log('✓ Run: pnpm add @agent-orbs/react @agent-orbs/core');
  console.log('✓ Or run: npx agent-orbs add thinking\n');
  process.exit(0);
}

if (command === 'add') {
  const stateArg = args[1]?.toLowerCase();
  if (!stateArg) {
    console.error('Error: Please specify a state to add (e.g. npx agent-orbs add thinking)');
    process.exit(1);
  }

  const statesToAdd = stateArg === 'all' ? AVAILABLE_STATES : [stateArg];
  const targetDir = fs.existsSync('components/ui') ? 'components/ui' : 'components';
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  for (const state of statesToAdd) {
    if (!AVAILABLE_STATES.includes(state)) {
      console.warn(`Warning: Unknown state "${state}". Valid states: ${AVAILABLE_STATES.join(', ')}`);
      continue;
    }

    const componentName = `Agent${state.charAt(0).toUpperCase() + state.slice(1)}Orb`;
    const fileName = path.join(targetDir, `${componentName}.tsx`);

    const componentContent = `import React from 'react';
import { AgentPill, AgentOrb } from '@agent-orbs/react';

/**
 * Drop-in ${state} kinetic loader component
 */
export function ${componentName}({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  return (
    <AgentPill
      state="${state}"
      size={size}
      interactiveOrb
    />
  );
}

export function ${componentName}Standalone({ size = 120 }: { size?: number }) {
  return (
    <AgentOrb
      state="${state}"
      size={size}
      interactive
    />
  );
}
`;

    fs.writeFileSync(fileName, componentContent, 'utf8');
    console.log(`✓ Created: ${fileName}`);
  }

  console.log(`\n🎉 Successfully installed ${statesToAdd.length} kinetic loader component(s)!`);
  console.log(`\nUsage example:`);
  console.log(`  import { Agent${statesToAdd[0].charAt(0).toUpperCase() + statesToAdd[0].slice(1)}Orb } from './${targetDir}/Agent${statesToAdd[0].charAt(0).toUpperCase() + statesToAdd[0].slice(1)}Orb';`);
  console.log(`  <Agent${statesToAdd[0].charAt(0).toUpperCase() + statesToAdd[0].slice(1)}Orb size="md" />\n`);
  process.exit(0);
}

console.error(`Unknown command: ${command}. Run npx agent-orbs --help`);
process.exit(1);
