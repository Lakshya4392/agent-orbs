import { hexToRgba } from '../tokens.js';
import {
  applyRotation,
  createFibonacciSphere,
  createRotationMatrix,
  projectPoint,
} from '../projection.js';
import { generateShapePoints } from '../shapes.js';
import { OrbPreset, OrbShapeType, Point3D, PresetContext, ProjectedPoint } from '../types.js';

export class SolvingPreset implements OrbPreset {
  readonly name = 'solving' as const;

  // Cached geometric stages for smooth continuous shape metamorphosis
  private cachedCount = 0;
  private cachedRadius = 0;
  private stages: Point3D[][] = [];

  private initStages(count: number, radius: number): Point3D[][] {
    if (this.cachedCount === count && Math.abs(this.cachedRadius - radius) < 0.5) {
      return this.stages;
    }

    this.cachedCount = count;
    this.cachedRadius = radius;

    // Stage 0: Pure Fibonacci Sphere
    const stage0 = createFibonacciSphere(count, radius);

    // Stage 1: Regular Octahedron / Diamond (Solving constraint boundaries)
    const stage1: Point3D[] = new Array(count);
    for (let i = 0; i < count; i++) {
      const sp = stage0[i];
      const sum = Math.abs(sp.x) + Math.abs(sp.y) + Math.abs(sp.z);
      const factor = sum > 0 ? (radius * 1.15) / sum : 1;
      stage1[i] = {
        x: sp.x * factor,
        y: sp.y * factor,
        z: sp.z * factor,
      };
    }

    // Stage 2: 3D Stellated Star / Cusp Singularity (AI proving step)
    const stage2: Point3D[] = new Array(count);
    for (let i = 0; i < count; i++) {
      const sp = stage0[i];
      const absX = Math.abs(sp.x / radius);
      const absY = Math.abs(sp.y / radius);
      const absZ = Math.abs(sp.z / radius);
      const cusp = Math.pow(Math.max(absX, Math.max(absY, absZ)), 3.0);
      const mod = 0.28 + 0.95 * cusp;
      stage2[i] = {
        x: sp.x * mod,
        y: sp.y * mod,
        z: sp.z * mod,
      };
    }

    // Stage 3: Hexagonal Geodesic Prism Ring (Optimal solution state)
    const stage3: Point3D[] = new Array(count);
    for (let i = 0; i < count; i++) {
      const theta = (i / count) * Math.PI * 2;
      const rHex = radius * (0.85 + 0.12 * Math.cos(theta * 6));
      const zDepth = radius * 0.45 * Math.sin(theta * 3);
      stage3[i] = {
        x: rHex * Math.cos(theta),
        y: rHex * Math.sin(theta),
        z: zDepth,
      };
    }

    this.stages = [stage0, stage1, stage2, stage3];
    return this.stages;
  }

  render(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    context: PresetContext
  ): void {
    const { time, radius, speed, particleCount, theme, interactiveOffset, shape } = context;
    const count = particleCount || (radius < 22 ? 48 : 140);
    const centerX = width * 0.5;
    const centerY = height * 0.5;

    // Fixed front-facing perspective: NO 360 yaw spin!
    // Stays still in front of user and dynamically morphs its geometry.
    const rotX = 0.15 + Math.sin(time * 0.45 * speed) * 0.04 + interactiveOffset.rx;
    const rotY = Math.cos(time * 0.35 * speed) * 0.07 + interactiveOffset.ry;
    const rotZ = Math.sin(time * 0.25 * speed) * 0.03;
    const rotMatrix = createRotationMatrix(rotX, rotY, rotZ);

    const stages = this.initStages(count, radius);

    // Compute continuous shape-shifting metamorphosis progression
    // Cycles through 4 geometric stages smoothly
    const cycleSpeed = 0.35 * speed;
    const cycleProgress = (time * cycleSpeed) % 4; // 0.0 to 4.0
    const currentStageIdx = Math.floor(cycleProgress);
    const nextStageIdx = (currentStageIdx + 1) % 4;
    const rawBlend = cycleProgress - currentStageIdx;

    // Smooth cubic ease-in-out for fluid shape transformation
    const blend = rawBlend * rawBlend * (3 - 2 * rawBlend);

    const fromPts = stages[currentStageIdx];
    const toPts = stages[nextStageIdx];

    // Dynamic breathing tension pulse
    const pulseFactor = 1 + 0.04 * Math.sin(time * 2.8 * speed);

    const projected: ProjectedPoint[] = new Array(count);

    // Transform and project all morphing points
    for (let i = 0; i < count; i++) {
      const pFrom = fromPts[i];
      const pTo = toPts[i];

      // Interpolated 3D point between the two geometric stages
      const px = (pFrom.x + (pTo.x - pFrom.x) * blend) * pulseFactor;
      const py = (pFrom.y + (pTo.y - pFrom.y) * blend) * pulseFactor;
      const pz = (pFrom.z + (pTo.z - pFrom.z) * blend) * pulseFactor;

      const rotated = applyRotation({ x: px, y: py, z: pz }, rotMatrix);
      projected[i] = projectPoint(rotated, {
        centerX,
        centerY,
        sphereRadius: radius,
        baseRadius: 1.25,
        minOpacity: 0.18,
        maxOpacity: 0.98,
      });
    }

    // Sort points back-to-front
    projected.sort((a, b) => a.z - b.z);

    // Draw morphing nodal points
    for (let i = 0; i < count; i++) {
      const pt = projected[i];

      ctx.fillStyle = hexToRgba(theme.foreground, pt.depthAlpha);
      ctx.beginPath();
      ctx.arc(pt.x2d, pt.y2d, pt.radius, 0, Math.PI * 2);
      ctx.fill();

      // Atmospheric halo on prominent foreground nodes (only on large displays)
      if (radius > 24 && pt.z > radius * 0.35) {
        ctx.fillStyle = hexToRgba(theme.foreground, 0.2 * pt.depthAlpha);
        ctx.beginPath();
        ctx.arc(pt.x2d, pt.y2d, pt.radius * 2.0, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
}

export const solvingPreset = new SolvingPreset();
