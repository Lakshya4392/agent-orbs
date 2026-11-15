export { AgentOrb, type AgentOrbProps } from './AgentOrb.js';
export {
  AgentPill,
  type AgentPillProps,
  type AgentPillSize,
  DEFAULT_PILL_LABELS,
} from './AgentPill.js';
export {
  useAgentOrb,
  type UseAgentOrbOptions,
  type UseAgentOrbReturn,
} from './useAgentOrb.js';

// Re-export core contracts and constants
export {
  type OrbState,
  type OrbShapeType,
  type OrbTheme,
  type OrbOptions,
  type OrbRenderer,
  type OrbPreset,
  type PresetContext,
  type Point3D,
  type ProjectedPoint,
  ORB_TOKENS,
  hexToRgba,
  createOrbRenderer,
} from '@agent-orbs/core';
