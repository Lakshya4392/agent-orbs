import { OrbPreset, OrbState } from '../types.js';
import { diffusionPreset } from './diffusion.js';
import { errorPreset } from './error.js';
import { idlePreset } from './idle.js';
import { listeningPreset } from './listening.js';
import { searchingPreset } from './searching.js';
import { solvingPreset } from './solving.js';
import { streamingPreset } from './streaming.js';
import { thinkingPreset } from './thinking.js';
import { weavingPreset } from './weaving.js';
import { workingPreset } from './working.js';

export {
  diffusionPreset,
  errorPreset,
  idlePreset,
  listeningPreset,
  searchingPreset,
  solvingPreset,
  streamingPreset,
  thinkingPreset,
  weavingPreset,
  workingPreset,
};

export const PRESETS: Record<OrbState, OrbPreset> = {
  solving: solvingPreset,
  thinking: thinkingPreset,
  listening: listeningPreset,
  working: workingPreset,
  searching: searchingPreset,
  streaming: streamingPreset,
  weaving: weavingPreset,
  diffusion: diffusionPreset,
  idle: idlePreset,
  error: errorPreset,
};

export function getPreset(state: OrbState): OrbPreset {
  const preset = PRESETS[state];
  if (!preset) {
    return PRESETS.idle;
  }
  return preset;
}
