import { Point3D, OrbShapeType, AgentMorphology } from './types.js';
import { createFibonacciSphere } from './projection.js';

/**
 * Maps each state to its iconic native AI agent morphology
 */
export const STATE_DEFAULT_MORPHOLOGY: Record<string, AgentMorphology> = {
  thinking: 'cortex',
  solving: 'lattice',
  listening: 'waveform',
  working: 'orbital',
  searching: 'radar',
  streaming: 'flux',
  weaving: 'weave',
  diffusion: 'pixel',
  idle: 'orb',
  error: 'cortex',
};

/**
 * Generates 3D points for AI-native agent morphologies
 */
export function generateShapePoints(
  shape: OrbShapeType,
  count: number,
  radius: number
): Point3D[] {
  const points: Point3D[] = new Array(count);

  switch (shape) {
    // 1. NEURAL CORTEX: Folded dual-hemisphere brain manifold for Deep Reasoning (o1 / o3 / Thinking)
    case 'cortex': {
      const halfCount = Math.floor(count / 2);
      for (let i = 0; i < count; i++) {
        const isLeft = i < halfCount;
        const subIndex = isLeft ? i : i - halfCount;
        const totalSub = isLeft ? halfCount : count - halfCount;

        // Fibonacci distribution per hemisphere
        const phi = Math.acos(1 - (2 * (subIndex + 0.5)) / totalSub);
        const theta = Math.PI * (1 + Math.sqrt(5)) * subIndex;

        // Cerebral gyri fold modulation: harmonic creases along cortex
        const gyriFolds = 0.16 * Math.sin(5 * theta) * Math.cos(4 * phi) + 0.08 * Math.cos(8 * phi);
        const lobeR = radius * (0.62 + gyriFolds);

        // Hemisphere lateral displacement (separated by longitudinal fissure)
        const xOffset = isLeft ? -radius * 0.28 : radius * 0.28;

        points[i] = {
          x: lobeR * Math.sin(phi) * Math.cos(theta) * 0.85 + xOffset,
          y: lobeR * Math.cos(phi) * 1.05, // Slightly elongated vertically like a brain
          z: lobeR * Math.sin(phi) * Math.sin(theta) * 0.95,
        };
      }
      return points;
    }

    // 2. GEODESIC LATTICE: Icosahedral crystalline matrix for Constraint Solving & Logic Planning
    case 'lattice': {
      // Golden ratio for icosahedral coordinates
      const phiRatio = (1 + Math.sqrt(5)) * 0.5;
      const baseVertices: Point3D[] = [
        { x: -1, y: phiRatio, z: 0 },
        { x: 1, y: phiRatio, z: 0 },
        { x: -1, y: -phiRatio, z: 0 },
        { x: 1, y: -phiRatio, z: 0 },
        { x: 0, y: -1, z: phiRatio },
        { x: 0, y: 1, z: phiRatio },
        { x: 0, y: -1, z: -phiRatio },
        { x: 0, y: 1, z: -phiRatio },
        { x: phiRatio, y: 0, z: -1 },
        { x: phiRatio, y: 0, z: 1 },
        { x: -phiRatio, y: 0, z: -1 },
        { x: -phiRatio, y: 0, z: 1 },
      ];

      // Normalize base vertices to radius
      const normalizedBase: Point3D[] = baseVertices.map((v) => {
        const len = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
        return {
          x: (v.x / len) * radius * 0.95,
          y: (v.y / len) * radius * 0.95,
          z: (v.z / len) * radius * 0.95,
        };
      });

      // Sample along icosahedron edges and dual inner shell
      for (let i = 0; i < count; i++) {
        if (i < 12) {
          points[i] = normalizedBase[i];
        } else if (i < count * 0.7) {
          // Midpoints and trisection points of lattice edges
          const vA = normalizedBase[i % 12];
          const vB = normalizedBase[(i * 5 + 3) % 12];
          const t = ((i * 7) % 10) / 10;
          points[i] = {
            x: vA.x + (vB.x - vA.x) * t,
            y: vA.y + (vB.y - vA.y) * t,
            z: vA.z + (vB.z - vA.z) * t,
          };
        } else {
          // Inner concentrated core nucleus (singularity convergence)
          const corePt = createFibonacciSphere(count, radius * 0.45)[i];
          points[i] = corePt;
        }
      }
      return points;
    }

    // 3. ACOUSTIC WAVEFORM: Horizontal voice spectrum bands for Voice AI & Audio
    case 'waveform': {
      const numBands = 7;
      const ptsPerBand = Math.floor(count / numBands);
      let idx = 0;

      for (let b = 0; b < numBands && idx < count; b++) {
        // Vertical band position from -radius to +radius
        const bandT = (b / (numBands - 1)) * 2 - 1;
        const yPos = bandT * radius * 0.82;
        const bandRadius = Math.sqrt(Math.max(0, radius * radius - yPos * yPos)) * 0.95;

        for (let j = 0; j < ptsPerBand && idx < count; j++) {
          const theta = (j / ptsPerBand) * Math.PI * 2;
          // Harmonic voice oscillation
          const harmonic = 0.12 * Math.sin(theta * 4 + b * 1.5) + 0.05 * Math.cos(theta * 8);
          const rMod = bandRadius * (1 + harmonic);

          points[idx++] = {
            x: rMod * Math.cos(theta),
            y: yPos,
            z: rMod * Math.sin(theta),
          };
        }
      }

      // Fill remaining points on equatorial band
      while (idx < count) {
        const theta = (idx / count) * Math.PI * 2;
        points[idx++] = {
          x: radius * Math.cos(theta),
          y: 0,
          z: radius * Math.sin(theta),
        };
      }
      return points;
    }

    // 4. ORBITAL TOOL NEXUS: Planetary gyroscopic tool rings for Agent Execution & Computer Use
    case 'orbital': {
      const rings = 3;
      const ptsPerRing = Math.floor((count * 0.8) / rings);
      let idx = 0;

      // 3 Orthogonal gyroscopic rings
      for (let r = 0; r < rings; r++) {
        const inc = (r * Math.PI) / 3; // 0, 60deg, 120deg inclination
        const ringR = radius * (0.8 + r * 0.1);

        for (let j = 0; j < ptsPerRing && idx < count; j++) {
          const theta = (j / ptsPerRing) * Math.PI * 2;
          const x0 = ringR * Math.cos(theta);
          const y0 = ringR * Math.sin(theta) * Math.sin(inc);
          const z0 = ringR * Math.sin(theta) * Math.cos(inc);

          points[idx++] = { x: x0, y: y0, z: z0 };
        }
      }

      // Remaining particles form the central execution core
      const corePts = createFibonacciSphere(count - idx, radius * 0.38);
      for (let k = 0; k < corePts.length && idx < count; k++) {
        points[idx++] = corePts[k];
      }
      return points;
    }

    // 5. RADAR MERIDIAN GLOBE: Scanning coordinate lattice for Web Search & Vector RAG
    case 'radar': {
      const latSteps = 7;
      const lonSteps = Math.ceil(count / latSteps);
      let idx = 0;

      for (let i = 0; i < latSteps && idx < count; i++) {
        const phi = (((i + 1) / (latSteps + 1)) - 0.5) * Math.PI * 0.9;
        const cosPhi = Math.cos(phi);
        const sinPhi = Math.sin(phi);

        for (let j = 0; j < lonSteps && idx < count; j++) {
          const theta = (j / lonSteps) * Math.PI * 2;
          points[idx++] = {
            x: radius * cosPhi * Math.cos(theta),
            y: radius * sinPhi,
            z: radius * cosPhi * Math.sin(theta),
          };
        }
      }

      while (idx < count) {
        points[idx++] = { x: 0, y: (idx % 2 === 0 ? 1 : -1) * radius, z: 0 };
      }
      return points;
    }

    // 6. TOKEN FLUX: Outward logarithmic spiral vortex for LLM Completion & Streaming
    case 'flux': {
      const arms = 4;
      for (let i = 0; i < count; i++) {
        const arm = i % arms;
        const progress = Math.floor(i / arms) / (count / arms);
        const rCurrent = radius * Math.pow(progress, 0.72) * 0.95;
        const angle = arm * (Math.PI * 0.5) + progress * Math.PI * 3.5;
        const yDisp = radius * 0.3 * Math.sin(progress * Math.PI * 2);

        points[i] = {
          x: rCurrent * Math.cos(angle),
          y: yDisp * (1 - progress * 0.35),
          z: rCurrent * Math.sin(angle),
        };
      }
      return points;
    }

    // 7. SEMANTIC SYNAPSE: Clustered embedding vectors for Knowledge Graphs & Vector DBs
    case 'synapse': {
      // 5 semantic cluster centroids
      const centroids: Point3D[] = [
        { x: radius * 0.55, y: radius * 0.4, z: 0 },
        { x: -radius * 0.5, y: radius * 0.45, z: radius * 0.2 },
        { x: 0, y: -radius * 0.6, z: radius * 0.35 },
        { x: -radius * 0.35, y: -radius * 0.35, z: -radius * 0.45 },
        { x: radius * 0.45, y: -radius * 0.25, z: -radius * 0.35 },
      ];

      for (let i = 0; i < count; i++) {
        const c = centroids[i % centroids.length];
        // Gaussian scatter around centroid
        const u = Math.random();
        const v = Math.random();
        const rScatter = radius * 0.22 * Math.sqrt(-2 * Math.log(u || 0.01));
        const theta = v * Math.PI * 2;
        const phi = Math.random() * Math.PI;

        points[i] = {
          x: c.x + rScatter * Math.sin(phi) * Math.cos(theta),
          y: c.y + rScatter * Math.cos(phi),
          z: c.z + rScatter * Math.sin(phi) * Math.sin(theta),
        };
      }
      return points;
    }

    // 8. WEAVE: Interlacing planar warp & weft matrix
    case 'weave': {
      const strandCount = Math.floor(Math.sqrt(count)) || 8;
      const ptsPerStrand = Math.ceil(count / strandCount);
      let idx = 0;
      for (let s = 0; s < strandCount && idx < count; s++) {
        const u = (s / (strandCount - 1)) * 2 - 1;
        for (let k = 0; k < ptsPerStrand && idx < count; k++) {
          const v = (k / (ptsPerStrand - 1)) * 2 - 1;
          const zDisp = radius * 0.3 * Math.sin(u * 4 + v * 3);
          points[idx++] = {
            x: u * radius * 0.85,
            y: v * radius * 0.85,
            z: zDisp,
          };
        }
      }
      while (idx < count) {
        points[idx++] = { x: 0, y: 0, z: 0 };
      }
      return points;
    }

    // 9. PIXEL: Latent image diffusion sampling grid
    case 'pixel': {
      const side = Math.floor(Math.sqrt(count)) || 10;
      let idx = 0;
      for (let r = 0; r < side && idx < count; r++) {
        const v = (r / (side - 1)) * 2 - 1;
        for (let c = 0; c < side && idx < count; c++) {
          const u = (c / (side - 1)) * 2 - 1;
          points[idx++] = {
            x: u * radius * 0.85,
            y: v * radius * 0.85,
            z: 0,
          };
        }
      }
      while (idx < count) {
        points[idx++] = { x: 0, y: 0, z: 0 };
      }
      return points;
    }

    // 10. PURE ORB: Minimalist Fibonacci Sphere
    case 'orb':
    case 'sphere':
    default:
      return createFibonacciSphere(count, radius);
  }
}

/**
 * Linearly interpolates two 3D point clouds with smooth cubic ease-in-out
 */
export function morphPoints(from: Point3D[], to: Point3D[], progress: number): Point3D[] {
  const p = Math.max(0, Math.min(1, progress));
  const ease = p * p * (3 - 2 * p);
  const count = Math.min(from.length, to.length);
  const result: Point3D[] = new Array(count);

  for (let i = 0; i < count; i++) {
    result[i] = {
      x: from[i].x + (to[i].x - from[i].x) * ease,
      y: from[i].y + (to[i].y - from[i].y) * ease,
      z: from[i].z + (to[i].z - from[i].z) * ease,
    };
  }
  return result;
}
