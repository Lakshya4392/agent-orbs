import { hexToRgba } from '../tokens.js';
import {
  applyRotation,
  createRotationMatrix,
  projectPoint,
} from '../projection.js';
import { OrbPreset, Point3D, PresetContext, ProjectedPoint } from '../types.js';

export class WeavingPreset implements OrbPreset {
  readonly name = 'weaving' as const;

  render(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    context: PresetContext
  ): void {
    const { time, radius, speed, theme, interactiveOffset } = context;
    const centerX = width * 0.5;
    const centerY = height * 0.5;

    // Fixed front-facing perspective: NO 360 yaw spin!
    // Stays still and morphs its internal structure facing the viewer.
    const rotX = 0.18 + Math.sin(time * 0.4 * speed) * 0.05 + interactiveOffset.rx;
    const rotY = Math.sin(time * 0.3 * speed) * 0.12 + interactiveOffset.ry;
    const rotZ = Math.cos(time * 0.25 * speed) * 0.04;
    const rotMatrix = createRotationMatrix(rotX, rotY, rotZ);

    // Number of weaving warp (vertical) and weft (horizontal) strands
    const strandCount = radius < 22 ? 6 : 9;
    const samplesPerStrand = radius < 22 ? 10 : 16;

    const allProjected: (ProjectedPoint & { isWarp: boolean; tension: number })[] = [];

    // 1. Warp Strands (sinusoidal threads running vertically)
    for (let s = 0; s < strandCount; s++) {
      const u = (s / (strandCount - 1)) * 2 - 1; // -1 to 1 horizontal slot
      const xBase = u * radius * 0.85;

      for (let k = 0; k < samplesPerStrand; k++) {
        const v = (k / (samplesPerStrand - 1)) * 2 - 1; // -1 to 1 vertical slot
        const yBase = v * radius * 0.88;

        // Dynamic harmonic depth weaving: threads cross over and under each other
        const wavePhase = time * 2.2 * speed + s * 0.85 + k * 0.4;
        const zDisp = radius * 0.38 * Math.sin(wavePhase) * Math.cos(v * Math.PI * 0.5);

        // Breathing lateral tension
        const xDisp = radius * 0.06 * Math.cos(wavePhase * 1.4);

        const p3d: Point3D = {
          x: xBase + xDisp,
          y: yBase,
          z: zDisp,
        };

        const rotated = applyRotation(p3d, rotMatrix);
        const proj = projectPoint(rotated, {
          centerX,
          centerY,
          sphereRadius: radius,
          baseRadius: 1.15,
          minOpacity: 0.18,
          maxOpacity: 0.98,
        });

        allProjected.push({
          ...proj,
          isWarp: true,
          tension: Math.abs(Math.sin(wavePhase)),
        });
      }
    }

    // 2. Weft Strands (sinusoidal threads running horizontally, interlacing counter-phase)
    for (let s = 0; s < strandCount; s++) {
      const v = (s / (strandCount - 1)) * 2 - 1; // -1 to 1 vertical slot
      const yBase = v * radius * 0.85;

      for (let k = 0; k < samplesPerStrand; k++) {
        const u = (k / (samplesPerStrand - 1)) * 2 - 1; // -1 to 1 horizontal slot
        const xBase = u * radius * 0.88;

        // Counter-phase depth weaving (interlocking the fabric)
        const wavePhase = time * 2.2 * speed + s * 0.85 + k * 0.4 + Math.PI;
        const zDisp = radius * 0.38 * Math.sin(wavePhase) * Math.cos(u * Math.PI * 0.5);
        const yDisp = radius * 0.06 * Math.sin(wavePhase * 1.4);

        const p3d: Point3D = {
          x: xBase,
          y: yBase + yDisp,
          z: zDisp,
        };

        const rotated = applyRotation(p3d, rotMatrix);
        const proj = projectPoint(rotated, {
          centerX,
          centerY,
          sphereRadius: radius,
          baseRadius: 1.15,
          minOpacity: 0.18,
          maxOpacity: 0.98,
        });

        allProjected.push({
          ...proj,
          isWarp: false,
          tension: Math.abs(Math.sin(wavePhase)),
        });
      }
    }

    // Sort all nodes back-to-front
    allProjected.sort((a, b) => a.z - b.z);

    // Draw living woven matrix nodes
    for (const pt of allProjected) {
      const alpha = Math.min(1.0, pt.depthAlpha * (0.8 + 0.25 * pt.tension));
      const dotRadius = pt.radius * (0.9 + 0.25 * pt.tension);

      ctx.fillStyle = hexToRgba(theme.foreground, alpha);
      ctx.beginPath();
      ctx.arc(pt.x2d, pt.y2d, dotRadius, 0, Math.PI * 2);
      ctx.fill();

      // Atmospheric tension halo on crossing intersections (large viewports only)
      if (radius > 24 && pt.z > radius * 0.2 && pt.tension > 0.85) {
        ctx.fillStyle = hexToRgba(theme.foreground, 0.2 * pt.depthAlpha);
        ctx.beginPath();
        ctx.arc(pt.x2d, pt.y2d, dotRadius * 2.0, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
}

export const weavingPreset = new WeavingPreset();
