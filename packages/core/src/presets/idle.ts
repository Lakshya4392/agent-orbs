import { hexToRgba } from '../tokens.js';
import {
  applyRotation,
  createRotationMatrix,
  projectPoint,
} from '../projection.js';
import { generateShapePoints } from '../shapes.js';
import { OrbPreset, OrbShapeType, Point3D, PresetContext, ProjectedPoint } from '../types.js';

export class IdlePreset implements OrbPreset {
  readonly name = 'idle' as const;

  private cachedCount = 0;
  private cachedRadius = 0;
  private cachedShape: OrbShapeType = 'sphere';
  private basePoints: Point3D[] = [];
  private phases: number[] = [];

  private ensurePoints(count: number, radius: number, shape: OrbShapeType = 'sphere'): Point3D[] {
    if (
      this.cachedCount !== count ||
      this.cachedShape !== shape ||
      Math.abs(this.cachedRadius - radius) > 0.5
    ) {
      this.cachedCount = count;
      this.cachedRadius = radius;
      this.cachedShape = shape;
      this.basePoints = generateShapePoints(shape, count, radius);
      this.phases = new Array(count);
      for (let i = 0; i < count; i++) {
        this.phases[i] = Math.random() * Math.PI * 2;
      }
    }
    return this.basePoints;
  }

  render(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    context: PresetContext
  ): void {
    const { time, radius, speed, particleCount, theme, interactiveOffset, shape = 'sphere' } = context;
    const count = particleCount || 130;
    const basePts = this.ensurePoints(count, radius, shape);

    const centerX = width * 0.5;
    const centerY = height * 0.5;

    // Extremely calm, smooth rotation
    const rotX = 0.25 + time * 0.14 * speed + interactiveOffset.rx;
    const rotY = time * 0.32 * speed + interactiveOffset.ry;
    const rotZ = Math.sin(time * 0.15 * speed) * 0.05;
    const rotMatrix = createRotationMatrix(rotX, rotY, rotZ);

    // Serene harmonic breathing
    const breath = 1.0 + 0.045 * Math.sin(time * 1.35 * speed);

    const projected: ProjectedPoint[] = new Array(count);

    for (let i = 0; i < count; i++) {
      const p = basePts[i];
      // Subtle individual floating perturbation
      const floatDisp = 1.0 + 0.02 * Math.sin(time * 1.8 * speed + this.phases[i]);
      const currentScale = breath * floatDisp;

      const p3d: Point3D = {
        x: p.x * currentScale,
        y: p.y * currentScale,
        z: p.z * currentScale,
      };

      const rotated = applyRotation(p3d, rotMatrix);
      projected[i] = projectPoint(rotated, {
        centerX,
        centerY,
        sphereRadius: radius,
        baseRadius: 1.15,
        minOpacity: 0.12,
        maxOpacity: 0.95,
      });
    }

    // Sort points by depth
    projected.sort((a, b) => a.z - b.z);

    // Draw serene particles
    for (const pt of projected) {
      ctx.fillStyle = hexToRgba(theme.foreground, pt.depthAlpha);
      ctx.beginPath();
      ctx.arc(pt.x2d, pt.y2d, pt.radius, 0, Math.PI * 2);
      ctx.fill();

      // Soft ambient aura for closest front nodes on large viewports
      if (radius > 24 && pt.z > radius * 0.4) {
        ctx.fillStyle = hexToRgba(theme.foreground, 0.18 * pt.depthAlpha);
        ctx.beginPath();
        ctx.arc(pt.x2d, pt.y2d, pt.radius * 2.0, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
}

export const idlePreset = new IdlePreset();
