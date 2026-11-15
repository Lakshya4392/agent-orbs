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

export interface StateMetadata {
  id: OrbState;
  label: string;
  pillLabel: string;
  dots: number;
  description: string;
  mathModel: string;
  particleRange: [number, number];
  defaultParticles: number;
  defaultSpeed: number;
}

export const ORB_STATES_METADATA: Record<OrbState, StateMetadata> = {
  solving: {
    id: 'solving',
    label: 'Solving',
    pillLabel: 'Solving....',
    dots: 4,
    description: 'Golden spiral point cloud with dual-axis continuous Euler rotation',
    mathModel: 'Fibonacci spherical lattice • Golden angle φ ≈ 137.5°',
    particleRange: [200, 800],
    defaultParticles: 420,
    defaultSpeed: 1.0,
  },
  thinking: {
    id: 'thinking',
    label: 'Thinking',
    pillLabel: 'Thinking....',
    dots: 4,
    description: 'Spherical standing wave harmonic moiré interference lattice',
    mathModel: 'Harmonic spherical standing waves • Moiré interference pattern',
    particleRange: [300, 900],
    defaultParticles: 500,
    defaultSpeed: 0.85,
  },
  listening: {
    id: 'listening',
    label: 'Listening',
    pillLabel: 'Agent listening...',
    dots: 3,
    description: 'Horizontal latitude concentric rings with acoustic pulsation',
    mathModel: 'Iso-latitude acoustic harmonics • Radial breathing modulation',
    particleRange: [150, 600],
    defaultParticles: 360,
    defaultSpeed: 1.2,
  },
  working: {
    id: 'working',
    label: 'Working',
    pillLabel: 'Working....',
    dots: 4,
    description: 'Dynamic Keplerian orbital particle field converging and swirling',
    mathModel: 'Keplerian orbital dynamics • Dual-plane vortex convergence',
    particleRange: [250, 750],
    defaultParticles: 400,
    defaultSpeed: 1.4,
  },
  searching: {
    id: 'searching',
    label: 'Searching',
    pillLabel: 'Searching....',
    dots: 4,
    description: 'Lat/lon coordinate grid with 360-degree rotating radar sweep',
    mathModel: 'Orthogonal coordinate grid • Angular radar beam sweep',
    particleRange: [200, 700],
    defaultParticles: 380,
    defaultSpeed: 1.1,
  },
  streaming: {
    id: 'streaming',
    label: 'Streaming',
    pillLabel: 'Streaming....',
    dots: 4,
    description: 'Evolving helical particle stream emitting from core poles',
    mathModel: 'Helical vector emission • Dynamic velocity decay',
    particleRange: [200, 600],
    defaultParticles: 350,
    defaultSpeed: 1.3,
  },
  weaving: {
    id: 'weaving',
    label: 'Weaving',
    pillLabel: 'Weaving context...',
    dots: 3,
    description: 'Interlacing warp & weft fabric strands with harmonic depth tension (still front view)',
    mathModel: 'Non-rotational living loom • Orthogonal strand tensor',
    particleRange: [150, 500],
    defaultParticles: 300,
    defaultSpeed: 1.0,
  },
  diffusion: {
    id: 'diffusion',
    label: 'Diffusion',
    pillLabel: 'Generating image...',
    dots: 3,
    description: 'Latent noise reverse diffusion with generative laser scanline sampling for AI image models',
    mathModel: 'Stochastic Brownian noise decay • Linear raster beam sweep',
    particleRange: [100, 400],
    defaultParticles: 256,
    defaultSpeed: 1.0,
  },
  idle: {
    id: 'idle',
    label: 'Idle',
    pillLabel: 'Agent idle...',
    dots: 3,
    description: 'Gentle ambient breathing sphere with harmonic oscillation',
    mathModel: 'Harmonic oscillation • Low-energy ambient drift',
    particleRange: [100, 400],
    defaultParticles: 240,
    defaultSpeed: 0.5,
  },
  error: {
    id: 'error',
    label: 'Error',
    pillLabel: 'Interrupted...',
    dots: 3,
    description: 'Chaotic disrupted particle disturbance with high vibration',
    mathModel: 'Perturbation entropy • Stochastic vector displacement',
    particleRange: [200, 600],
    defaultParticles: 380,
    defaultSpeed: 1.6,
  },
};

export interface ColorPreset {
  id: string;
  name: string;
  hex: string;
  theme: { background: string; foreground: string; accent: string };
}

export const HERO_COLORS: ColorPreset[] = [
  {
    id: 'mono',
    name: 'Pure White',
    hex: '#FFFFFF',
    theme: { background: '#040404', foreground: '#FFFFFF', accent: '#37393E' },
  },
  {
    id: 'cyan',
    name: 'Cyber Cyan',
    hex: '#38BDF8',
    theme: { background: '#040404', foreground: '#38BDF8', accent: '#0369A1' },
  },
  {
    id: 'emerald',
    name: 'Emerald Pulse',
    hex: '#34D399',
    theme: { background: '#040404', foreground: '#34D399', accent: '#047857' },
  },
  {
    id: 'violet',
    name: 'Neural Violet',
    hex: '#A855F7',
    theme: { background: '#040404', foreground: '#A855F7', accent: '#6B21A8' },
  },
  {
    id: 'amber',
    name: 'Solar Amber',
    hex: '#F59E0B',
    theme: { background: '#040404', foreground: '#F59E0B', accent: '#B45309' },
  },
  {
    id: 'coral',
    name: 'Neon Coral',
    hex: '#FB7185',
    theme: { background: '#040404', foreground: '#FB7185', accent: '#9F1239' },
  },
];

