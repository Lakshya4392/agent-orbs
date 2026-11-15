# 🔮 Agent Orbs

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-white.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-white.svg?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18%20%7C%2019-white.svg?style=flat-square&logo=react&logoColor=white)](https://react.dev/)
[![Zero Dependencies](https://img.shields.io/badge/Dependencies-Zero-white.svg?style=flat-square)](https://github.com/Lakshya4392/agent-orbs)
[![Bundle Size](https://img.shields.io/badge/Bundle%20Size-%3C4KB-white.svg?style=flat-square)](https://bundlephobia.com)

**Next-Generation Mathematical 3D Kinetic Loaders for AI Agents & Modern Applications**  
*Pure HTML5 Canvas 2D Perspective Projection • Zero WebGL Overhead • Micro-calibrated for High-DPI screens • 60/120 FPS*

[**Explore Live Showcase & Studio →**](https://github.com/Lakshya4392/agent-orbs)

</div>

---

## 🌟 Why Agent Orbs?

Standard loading spinners (`animate-spin`, circular SVG rings, bouncing dots) were designed in 2012 for slow server responses. Today's AI agents don't merely "load" — they:

- 🧠 **Think** across complex reasoning tokens
- 🎙️ **Listen** and stream multimodal audio/speech
- ⚡ **Solve** constraints via geometric state-metamorphosis
- 🔍 **Search** vector coordinates with radar sweeps
- 🛰️ **Work** through multi-agent tool execution orbits
- 🌊 **Stream** live LLM token bursts
- 🧵 **Weave** long context windows into synthesis

**Agent Orbs** transforms status indicators into mesmerizing, Apple/Perplexity-grade 3D kinetic mathematical orbs built specifically for every AI lifecycle phase.

---

## 🎨 Strict Monochrome Luxury Theme

Engineered following a strict dark luxury design aesthetic with micro-borders and high-contrast particle depth:

| Token | Hex | Role |
|---|---|---|
| **Background** | `#040404` | Pitch black deep canvas |
| **Foreground** | `#FFFFFF` | Crisp pure white particle nodes with distance-based alpha depth |
| **Accent** | `#37393E` | Capsule borders, ambient rings, and micro-grid lattice |

---

## 📦 Monorepo Architecture

```text
agent-orbs/
├── packages/
│   ├── core/       # @agent-orbs/core - Zero-dependency 3D Canvas 2D math engine (<4KB)
│   ├── react/      # @agent-orbs/react - <AgentOrb /> & <AgentPill /> React components
│   └── cli/        # agent-orbs - shadcn-style CLI for instant scaffolding
└── apps/
    └── web/        # Interactive showcase gallery & parameter studio
```

---

## ⚡ CLI Quick Start (shadcn-style)

Add components directly to your project without installing large libraries:

```bash
# Initialize Agent Orbs in your project
npx agent-orbs init

# Add specific kinetic state pills or orbs
npx agent-orbs add solving
npx agent-orbs add thinking
npx agent-orbs add searching

# Add all components at once
npx agent-orbs add all

# List all available agent states
npx agent-orbs list
```

---

## 🚀 React / Next.js Quick Start

### 1. Installation

```bash
pnpm add @agent-orbs/react @agent-orbs/core
# or
npm install @agent-orbs/react @agent-orbs/core
# or
yarn add @agent-orbs/react @agent-orbs/core
```

### 2. The `<AgentPill />` Component (Reference Image 2)

Drop-in pill status capsules matching production AI interfaces:

```tsx
import { AgentPill } from '@agent-orbs/react';

export function AgentStatus({ state }: { state: 'solving' | 'thinking' | 'listening' | 'working' | 'searching' | 'streaming' }) {
  return (
    <AgentPill
      state={state}
      size="md"
      interactiveOrb
    />
  );
}
```

#### Pill Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `state` | `OrbState` | `'idle'` | Kinetic state (`solving`, `thinking`, `listening`, `working`, `searching`, `streaming`, `weaving`, `diffusion`) |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Height & font preset (`sm` = 28px, `md` = 36px, `lg` = 48px) |
| `label` | `ReactNode` | Canonical label | Status text label (e.g., `"Solving...."`, `"Thinking...."`) |
| `orbSize` | `number` | `24` (on `md`) | Explicit diameter of the embedded kinetic orb |
| `speed` | `number` | `1.0` | Animation velocity multiplier |
| `theme` | `Partial<OrbTheme>` | `#FFFFFF` | Custom color overrides (`foreground`, `background`, `accent`) |
| `interactiveOrb` | `boolean` | `false` | Enable interactive mouse/touch drag rotation |

---

### 3. The Standalone `<AgentOrb />` Component

High-performance 3D kinetic orb for hero sections, modal dialogs, and AI chat avatars:

```tsx
import { AgentOrb } from '@agent-orbs/react';

export function HeroOrb() {
  return (
    <AgentOrb
      state="solving"
      size={120}
      speed={1.0}
      interactive
      transparent
    />
  );
}
```

#### Orb Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `state` | `OrbState` | `'idle'` | Kinetic preset |
| `shape` | `OrbShapeType` | `'sphere'` | Geometric target (`sphere`, `cube`, `cylinder`, `pyramid`, `torus`, `helix`, `star`) |
| `size` | `number` | `120` | Canvas width & height in CSS pixels (auto scaled for Retina 2x/3x) |
| `speed` | `number` | `1.0` | Rotation and phase velocity |
| `particleCount` | `number` | Auto | Override number of 3D mathematical nodes |
| `interactive` | `boolean` | `true` | Allows mouse/touch drag rotation with momentum |
| `transparent` | `boolean` | `true` | Transparent canvas background |
| `theme` | `Partial<OrbTheme>` | `#FFFFFF` | Color palette |
| `onFrame` | `(stats) => void` | `undefined` | Hook into 60/120fps render loop with live FPS and frame time |

---

### 4. Zero-Dependency Vanilla Canvas (HTML / JS / Svelte / Vue)

Works anywhere without React or bundlers:

```html
<canvas id="orbCanvas" width="128" height="128" style="width: 64px; height: 64px;"></canvas>

<script type="module">
  import { createOrbRenderer } from '@agent-orbs/core';

  const canvas = document.getElementById('orbCanvas');
  const orb = createOrbRenderer(canvas, {
    state: 'thinking',
    speed: 1.0,
    interactive: true,
  });

  // Switch states dynamically
  orb.setState('solving');
</script>
```

---

## 🧠 Supported Agent Lifecycle States

| State | Default Pill Label | Mathematical Geometry & Behavior |
|---|---|---|
| **`solving`** | `Solving....` | **Still Front-Facing Shape Metamorphosis:** Smooth continuous transformation between $\text{Sphere} \to \text{Octahedron (Diamond)} \to \text{Stellated Star} \to \text{Hexagonal Prism Ring}$. No distracting 360 yaw spin. |
| **`thinking`** | `Thinking....` | Spherical standing-wave harmonic moiré interference ripples with dynamic antinode swelling. |
| **`listening`** | `Agent listening...` | Concentric latitude rings pulsing with simulated multi-band bass, mid, and treble voice waveforms. |
| **`working`** | `Working....` | Multi-plane Keplerian orbital mechanics simulating asynchronous agent tool calls. |
| **`searching`** | `Searching....` | 3D coordinate lattice with $360^\circ$ rotating radar laser sweep and trailing phosphor wake. |
| **`streaming`** | `Streaming....` | Logarithmic 4-arm outward spiral emitter with rhythmic LLM token burst pulses. |
| **`weaving`** | `Weaving context...` | Front-facing orthogonal warp-and-weft lattice with traveling cross-point context pulses. |
| **`diffusion`** | `Generating image...` | High-frequency 3D Gaussian noise lattice converging into sharp raster scanline upscaling. |
| **`idle`** | `Agent ready` | Serene harmonic breathing sphere with subtle micro-phase offsets. |
| **`error`** | `Interrupted...` | High-frequency digital glitch bursts with damped spring recovery. |

---

## 🔬 Mathematical Projection Engine

Rather than bundling Three.js or heavy WebGL runtimes (300KB–1MB), **Agent Orbs** implements a lean, zero-dependency 3D pipeline on HTML5 Canvas 2D (<4KB):

- **Fibonacci Sphere Lattice:** Uniform golden-spiral node distribution via $\phi = i \cdot \pi(3 - \sqrt{5})$.
- **Euler 3D Matrix:** Full $3 \times 3$ rotation matrices ($R_z \times R_y \times R_x$) with interactive mouse drag integration.
- **Perspective Falloff:** Dynamic scale factor $\text{scale} = \frac{d}{d - z}$ and non-linear depth alpha $\alpha = \alpha_{\min} + (\frac{z + r}{2r})^{1.4} \cdot (\alpha_{\max} - \alpha_{\min})$.
- **High-DPI Retina Scaling:** Automatically detects `window.devicePixelRatio` and scales internal canvas backing buffer for sub-pixel crispness.
- **Micro-calibrated Halo Thresholds:** Halos automatically disable on small pill dimensions ($\le 24\text{px}$) to prevent blown-out white blobs, preserving razor-sharp individual particle nodes.

---

## 🛠️ Local Development

```bash
# Clone repository
git clone https://github.com/Lakshya4392/agent-orbs.git
cd agent-orbs

# Install dependencies
pnpm install

# Run unit tests
pnpm test

# Build all packages
pnpm build

# Start interactive showcase studio
pnpm dev
```

---

## 👤 Author & Credits

Crafted by **Lakshya**  
- GitHub: [@Lakshya4392](https://github.com/Lakshya4392)  
- Repository: [https://github.com/Lakshya4392/agent-orbs](https://github.com/Lakshya4392/agent-orbs)

---

## 📄 License

[MIT License](LICENSE) © 2026 Lakshya. Free for commercial and open-source use.
