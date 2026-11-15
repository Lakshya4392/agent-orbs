import { hexToRgba } from '../tokens.js';
import {
  applyRotation,
  createRotationMatrix,
  projectPoint,
} from '../projection.js';
import { generateShapePoints } from '../shapes.js';
import { OrbPreset, Point3D, PresetContext, ProjectedPoint } from '../types.js';

export class ThinkingPreset implements OrbPreset {
  readonly name = 'thinking' as const;

  render(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    context: PresetContext
  ): void {
    const { time, radius, speed, theme, interactiveOffset, shape = 'sphere' } = context;
    const centerX = width * 0.5;
    const centerY = height * 0.5;

    // Harmonic rotation creating complex moiré optical interference
    const rotX = 0.42 + time * 0.22 * speed + interactiveOffset.rx;
    const rotY = time * 0.85 * speed + interactiveOffset.ry;
    const rotZ = Math.sin(time * 0.4 * speed) * 0.12;
    const rotMatrix = createRotationMatrix(rotX, rotY, rotZ);

    const allProjected: (ProjectedPoint & { waveAmp: number })[] = [];

    if (shape && shape !== 'sphere') {
      // Shape-adaptive thinking standing wave
      const shapeCount = radius < 22 ? 70 : 160;
      const basePts = generateShapePoints(shape, shapeCount, radius);

      for (let i = 0; i < basePts.length; i++) {
        const p = basePts[i];
        const w1 = Math.sin((p.x / (radius || 1)) * 3.5 + time * 2.5 * speed);
        const w2 = Math.cos((p.z / (radius || 1)) * 3.5 - time * 1.8 * speed);
        const waveDisp = 0.12 * (w1 + w2);
        const p3d: Point3D = {
          x: p.x * (1 + waveDisp),
          y: p.y * (1 + waveDisp * 0.5),
          z: p.z * (1 + waveDisp),
        };

        const rotated = applyRotation(p3d, rotMatrix);
        const proj = projectPoint(rotated, {
          centerX,
          centerY,
          sphereRadius: radius,
          baseRadius: 1.15,
          minOpacity: 0.10,
          maxOpacity: 0.98,
        });

        allProjected.push({ ...proj, waveAmp: Math.abs(w1 + w2) });
      }
    } else {
      // Iconic moiré lattice for sphere
      const numRings = radius < 22 ? 8 : 13;
      const colsPerRing = radius < 22 ? 14 : 24;

      for (let r = 1; r < numRings; r++) {
        const phi = ((r / numRings) - 0.5) * Math.PI * 0.9; // inclination
        const cosPhi = Math.cos(phi);
        const sinPhi = Math.sin(phi);

        for (let c = 0; c < colsPerRing; c++) {
          const theta = (c / colsPerRing) * Math.PI * 2;

          // Two counter-propagating harmonic standing waves that shape the iconic wavy shell
          const w1 = Math.sin(3.0 * theta + time * 2.5 * speed) * Math.cos(2.0 * phi);
          const w2 = Math.cos(4.0 * theta - time * 1.8 * speed) * Math.sin(3.0 * phi + time * 0.5 * speed);
          const waveDisp = 0.16 * (w1 + w2);
          const rMod = radius * (1 + waveDisp);

          const p3d: Point3D = {
            x: rMod * cosPhi * Math.cos(theta),
            y: rMod * sinPhi,
            z: rMod * cosPhi * Math.sin(theta),
          };

          const rotated = applyRotation(p3d, rotMatrix);
          const proj = projectPoint(rotated, {
            centerX,
            centerY,
            sphereRadius: radius,
            baseRadius: 1.15,
            minOpacity: 0.10,
            maxOpacity: 0.98,
          });

          allProjected.push({ ...proj, waveAmp: Math.abs(w1 + w2) });
        }
      }
    }

    // Sort nodes back-to-front for proper depth occlusion
    allProjected.sort((a, b) => a.z - b.z);

    // Draw harmonic antinodes / lattice points
    for (const pt of allProjected) {
      // Dynamic node radius scaled by wave amplitude (antinodes swell)
      const swell = 0.95 + pt.waveAmp * 0.3;
      const nodeRadius = pt.radius * swell;

      ctx.fillStyle = hexToRgba(theme.foreground, pt.depthAlpha);
      ctx.beginPath();
      ctx.arc(pt.x2d, pt.y2d, nodeRadius, 0, Math.PI * 2);
      ctx.fill();

      // Atmospheric halo only on larger displays to prevent white blob on mini orbs
      if (radius > 24 && pt.z > radius * 0.35 && pt.waveAmp > 1.25) {
        ctx.fillStyle = hexToRgba(theme.foreground, 0.2 * pt.depthAlpha);
        ctx.beginPath();
        ctx.arc(pt.x2d, pt.y2d, nodeRadius * 2.0, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
}

export const thinkingPreset = new ThinkingPreset();
