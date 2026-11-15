import { ORB_TOKENS } from './tokens.js';

export type OrbState =
  | 'solving'
  | 'thinking'
  | 'listening'
  | 'working'
  | 'searching'
  | 'streaming'
  | 'weaving'
  | 'diffusion'
  | 'idle'
  | 'error';

export interface Point3D {
  x: number;
  y: number;
  z: number;
}

export interface ProjectedPoint {
  x2d: number;
  y2d: number;
  scale: number;
  depthAlpha: number;
  radius: number;
  z: number;
}

export type AgentMorphology =
  | 'cortex'    // Neural Brain / Deep Reasoning
  | 'lattice'   // Geodesic Constraint Matrix / Logic & Math
  | 'waveform'  // Acoustic Voice Spectrum / Audio
  | 'orbital'   // Planetary Tool Gyroscope / Code Execution & Computer Use
  | 'radar'     // Scanning Coordinate Meridian Globe / Web Search & RAG
  | 'flux'      // Logarithmic Token Jet Vortex / LLM Completion
  | 'synapse'   // Clustered Semantic Embeddings / Knowledge Graph & Memory
  | 'weave'     // Interlacing Warp & Weft Strands / Synthesis
  | 'pixel'     // Latent Diffusion Noise Grid / Image Generation
  | 'orb';      // Minimalist Fibonacci Sphere

export type OrbShapeType =
  | AgentMorphology
  | 'sphere'
  | 'cube'
  | 'cylinder'
  | 'pyramid'
  | 'torus'
  | 'helix'
  | 'star';

export interface OrbTheme {
  background: string;
  foreground: string;
  accent: string;
}

export interface OrbOptions {
  state?: OrbState;
  shape?: OrbShapeType;
  size?: number;
  speed?: number;
  particleCount?: number;
  interactive?: boolean;
  transparent?: boolean;
  theme?: Partial<OrbTheme>;
  onFrame?: (stats: { fps: number; time: number }) => void;
}

export interface PresetContext {
  time: number;
  dt: number;
  radius: number;
  speed: number;
  particleCount: number;
  shape?: OrbShapeType;
  theme: OrbTheme;
  rotation: {
    rx: number;
    ry: number;
    rz: number;
  };
  interactiveOffset: {
    rx: number;
    ry: number;
  };
}

export interface OrbPreset {
  name: OrbState;
  render: (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    context: PresetContext
  ) => void;
}

export interface OrbRenderer {
  readonly canvas: HTMLCanvasElement;
  getState(): OrbState;
  setState(state: OrbState): void;
  getShape(): OrbShapeType;
  setShape(shape: OrbShapeType): void;
  setSpeed(speed: number): void;
  setTheme(theme: Partial<OrbTheme>): void;
  setParticleCount(count: number): void;
  resize(width?: number, height?: number): void;
  pause(): void;
  resume(): void;
  destroy(): void;
}

export { ORB_TOKENS };
