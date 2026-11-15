import { hexToRgba } from '../tokens.js';
import {
  applyRotation,
  createFibonacciSphere,
  createRotationMatrix,
  projectPoint,
} from '../projection.js';
import { OrbPreset, Point3D, PresetContext, ProjectedPoint } from '../types.js';

export class ErrorPreset implements OrbPreset {
  readonly name = 'error' as const;

  private cachedCount = 0;
  private cachedRadius = 0;
  private basePoints: Point3D[] = [];

  private ensurePoints(count: number, radius: number): Point3D[] {
    if (this.cachedCount !== count || Math.abs(this.cachedRadius - radius) > 0.5) {
      this.cachedCount = count;
      this.cachedRadius = radius;
      this.basePoints = createFibonacciSphere(count, radius);
    }
    return this.basePoints;
  }

  // Deterministic pseudo-random hash
  private pseudoNoise(seed: number): number {
    const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
    return (x - Math.floor(x)) * 2 - 1; // [-1..1]
  }

  render(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    context: PresetContext
  ): void {
    const { time, radius, speed, particleCount, theme, interactiveOffset } = context;
    const count = particleCount || 140;
    const basePts = this.ensurePoints(count, radius);

    const centerX = width * 0.5;
    const centerY = height * 0.5;

    // Glitch cycle: repeats every 2.0s with 0.3s violent stutter
    const cycle = (time * 1.2 * speed) % 2.0;
    const isGlitching = cycle < 0.32;
    const isRecovering = cycle >= 0.32 && cycle < 0.7;

    // Disturbed rotation with erratic speed bursts and micro-stutters
    const glitchJitter = isGlitching ? this.pseudoNoise(time * 30) * 0.35 : 0;
    const rotX = 0.35 + time * 0.3 * speed + glitchJitter + interactiveOffset.rx;
    const rotY = time * 0.8 * speed + (isGlitching ? this.pseudoNoise(time * 40) * 0.5 : 0) + interactiveOffset.ry;
    const rotZ = Math.sin(time * 0.5 * speed) * 0.1;
    const rotMatrix = createRotationMatrix(rotX, rotY, rotZ);

    const projected: (ProjectedPoint & { isDisturbed: boolean })[] = new Array(count);

    // Compute particle disturbances
    for (let i = 0; i < count; i++) {
      const p = basePts[i];
      let dx = 0;
      let dy = 0;
      let dz = 0;
      let isDisturbed = false;

      if (isGlitching) {
        // High frequency digital particle tearing
        const seed = Math.floor(time * 20) + i;
        const tearChance = Math.abs(this.pseudoNoise(seed));

        if (tearChance > 0.45) {
          isDisturbed = true;
          const mag = radius * 0.28 * tearChance;
          dx = this.pseudoNoise(seed * 1.1) * mag;
          dy = this.pseudoNoise(seed * 2.2) * (mag * 0.4); // horizontal scanline bias
          dz = this.pseudoNoise(seed * 3.3) * mag;
        }
      } else if (isRecovering) {
        // Damped spring ring-down vibration
        const recT = (cycle - 0.32) / 0.38;
        const decay = Math.exp(-recT * 5.0) * Math.sin(recT * 25.0);
        const amp = radius * 0.08 * decay;
        dx = this.pseudoNoise(i) * amp;
        dy = this.pseudoNoise(i * 2) * amp;
        dz = this.pseudoNoise(i * 3) * amp;
        isDisturbed = Math.abs(decay) > 0.15;
      }

      const p3d: Point3D = {
        x: p.x + dx,
        y: p.y + dy,
        z: p.z + dz,
      };

      const rotated = applyRotation(p3d, rotMatrix);
      const proj = projectPoint(rotated, {
        centerX,
        centerY,
        sphereRadius: radius,
        baseRadius: isDisturbed ? 1.35 : 1.15,
        minOpacity: 0.15,
        maxOpacity: 0.98,
      });

      projected[i] = { ...proj, isDisturbed };
    }

    // Sort points by depth
    projected.sort((a, b) => a.z - b.z);

    // Draw particles
    for (const pt of projected) {
      if (pt.isDisturbed) {
        // High energy disturbed particle
        ctx.fillStyle = hexToRgba(theme.foreground, 0.98);
        ctx.beginPath();
        ctx.arc(pt.x2d, pt.y2d, pt.radius * 1.25, 0, Math.PI * 2);
        ctx.fill();

        // Error flare only on larger displays
        if (radius > 24) {
          ctx.fillStyle = hexToRgba(theme.foreground, 0.25);
          ctx.beginPath();
          ctx.arc(pt.x2d, pt.y2d, pt.radius * 2.2, 0, Math.PI * 2);
          ctx.fill();
        }
      } else {
        // Regular particle
        ctx.fillStyle = hexToRgba(theme.foreground, pt.depthAlpha);
        ctx.beginPath();
        ctx.arc(pt.x2d, pt.y2d, pt.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
}

export const errorPreset = new ErrorPreset();
