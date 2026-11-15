import { hexToRgba } from '../tokens.js';
import {
  applyRotation,
  createRotationMatrix,
  projectPoint,
} from '../projection.js';
import { generateShapePoints } from '../shapes.js';
import { OrbPreset, Point3D, PresetContext, ProjectedPoint } from '../types.js';

export class ListeningPreset implements OrbPreset {
  readonly name = 'listening' as const;

  render(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    context: PresetContext
  ): void {
    const { time, radius, speed, theme, interactiveOffset, shape = 'waveform' } = context;
    const centerX = width * 0.5;
    const centerY = height * 0.5;

    // Gentle axial tilt and smooth rotation
    const rotX = 0.42 + Math.sin(time * 0.5 * speed) * 0.08 + interactiveOffset.rx;
    const rotY = time * 0.55 * speed + interactiveOffset.ry;
    const rotZ = Math.cos(time * 0.4 * speed) * 0.05;
    const rotMatrix = createRotationMatrix(rotX, rotY, rotZ);

    // Multi-band acoustic pulsation simulation
    const bassPulse = Math.sin(time * 3.8 * speed);
    const midPulse = Math.sin(time * 7.5 * speed);
    const trebleFlutter = Math.sin(time * 15.0 * speed);

    const projectedDots: (ProjectedPoint & { ringWeight: number })[] = [];

    if (shape && shape !== 'waveform' && shape !== 'sphere') {
      // Shape-adaptive acoustic speech wave modulation
      const shapeCount = radius < 22 ? 60 : 130;
      const basePts = generateShapePoints(shape, shapeCount, radius);

      for (let i = 0; i < basePts.length; i++) {
        const p = basePts[i];
        const latNorm = p.y / (radius || 1);
        const eqSens = Math.exp(-latNorm * latNorm * 3.5);
        const acousticDisp =
          eqSens *
          (bassPulse * 0.14 +
            midPulse * 0.08 * Math.sin(p.x * 2.5) +
            trebleFlutter * 0.04 * Math.cos(p.z * 3.0));

        const p3d: Point3D = {
          x: p.x * (1 + acousticDisp),
          y: p.y,
          z: p.z * (1 + acousticDisp),
        };

        const rotated = applyRotation(p3d, rotMatrix);
        const proj = projectPoint(rotated, {
          centerX,
          centerY,
          sphereRadius: radius,
          baseRadius: 1.1 + eqSens * 0.25,
          minOpacity: 0.15,
          maxOpacity: 0.98,
        });

        projectedDots.push({ ...proj, ringWeight: eqSens });
      }
    } else {
      // Canonical horizontal voice frequency bands
      const numRings = radius < 22 ? 6 : 9;
      const ringDots = radius < 22 ? 12 : 22;

      for (let r = 0; r < numRings; r++) {
        const latT = (r / (numRings - 1)) * 2 - 1;
        const yBase = latT * radius * 0.85;
        const baseRingR = Math.sqrt(Math.max(0, radius * radius - yBase * yBase));
        const eqSens = Math.exp(-latT * latT * 3.5);

        const ringAcousticDisp =
          eqSens *
          (bassPulse * 0.14 +
            midPulse * 0.08 * Math.sin(r * 1.5) +
            trebleFlutter * 0.04 * Math.cos(r * 2.2));

        const ringR = baseRingR * (1 + ringAcousticDisp);

        for (let d = 0; d < ringDots; d++) {
          const theta = (d / ringDots) * Math.PI * 2;
          const acousticWave = Math.sin(theta * 3.0 - time * 5.0 * speed + r);
          const dotR = ringR * (1 + acousticWave * 0.04 * eqSens);

          const p3d: Point3D = {
            x: dotR * Math.cos(theta),
            y: yBase,
            z: dotR * Math.sin(theta),
          };

          const rotated = applyRotation(p3d, rotMatrix);
          const proj = projectPoint(rotated, {
            centerX,
            centerY,
            sphereRadius: radius,
            baseRadius: 1.05 + eqSens * 0.25,
            minOpacity: 0.12,
            maxOpacity: 0.98,
          });

          projectedDots.push({ ...proj, ringWeight: eqSens });
        }
      }
    }

    // Sort dots by depth
    projectedDots.sort((a, b) => a.z - b.z);

    // Draw acoustic dots
    for (const pt of projectedDots) {
      ctx.fillStyle = hexToRgba(theme.foreground, pt.depthAlpha);
      ctx.beginPath();
      ctx.arc(pt.x2d, pt.y2d, pt.radius, 0, Math.PI * 2);
      ctx.fill();

      // Extra acoustic halo on equatorial listening nodes (only on large displays)
      if (radius > 24 && pt.z > radius * 0.25 && pt.ringWeight > 0.6) {
        ctx.fillStyle = hexToRgba(theme.foreground, 0.2 * pt.depthAlpha * pt.ringWeight);
        ctx.beginPath();
        ctx.arc(pt.x2d, pt.y2d, pt.radius * 2.0, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
}

export const listeningPreset = new ListeningPreset();
