import { hexToRgba } from '../tokens.js';
import {
  applyRotation,
  createRotationMatrix,
  projectPoint,
} from '../projection.js';
import { OrbPreset, Point3D, PresetContext, ProjectedPoint } from '../types.js';

interface StreamTokenParticle {
  streamIndex: number;
  theta0: number;
  phaseSpeed: number;
  burstGroup: number;
}

export class StreamingPreset implements OrbPreset {
  readonly name = 'streaming' as const;

  private particles: StreamTokenParticle[] = [];

  constructor() {
    this.initParticles();
  }

  private initParticles() {
    this.particles = [];
    const maxParticles = 90;
    for (let i = 0; i < maxParticles; i++) {
      this.particles.push({
        streamIndex: i % 4, // 4 spiral emitter arms
        theta0: (i / maxParticles) * Math.PI * 2,
        phaseSpeed: 0.8 + (i % 3) * 0.25,
        burstGroup: i % 5,
      });
    }
  }

  render(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    context: PresetContext
  ): void {
    const { time, radius, speed, theme, interactiveOffset } = context;
    const centerX = width * 0.5;
    const centerY = height * 0.5;

    // Smooth tilted vortex view
    const rotX = 0.52 + Math.sin(time * 0.4 * speed) * 0.08 + interactiveOffset.rx;
    const rotY = time * 0.75 * speed + interactiveOffset.ry;
    const rotZ = Math.cos(time * 0.3 * speed) * 0.08;
    const rotMatrix = createRotationMatrix(rotX, rotY, rotZ);

    // Adaptive streaming particle count: small pills use ~32 particles, large viewports use ~64
    const count = radius < 22 ? 32 : 64;
    const activeParticles = this.particles.slice(0, count);

    const projected: (ProjectedPoint & { isTokenPulse: boolean })[] = [];

    // Continuous outward logarithmic spiral emitter (simulating live streaming token output)
    for (let i = 0; i < activeParticles.length; i++) {
      const p = activeParticles[i];

      // Normalized progress s along the spiral arm: loops from 0.05 (core) to 1.0 (outer wake)
      const loopTime = (time * 1.4 * speed * p.phaseSpeed + p.theta0) % (Math.PI * 2);
      const s = loopTime / (Math.PI * 2); // 0 to 1

      // Logarithmic spiral expansion
      const rCurrent = radius * Math.pow(s, 0.75) * 0.95;
      const armAngle = p.streamIndex * (Math.PI / 2) + s * Math.PI * 3.5;

      // Vertical wave displacement
      const yDisp = radius * 0.35 * Math.sin(s * Math.PI * 2 - time * 3.0 * speed);

      const p3d: Point3D = {
        x: rCurrent * Math.cos(armAngle),
        y: yDisp * (1 - s * 0.4),
        z: rCurrent * Math.sin(armAngle),
      };

      const rotated = applyRotation(p3d, rotMatrix);

      // Token packet pulse: rhythmic bursts travelling along the stream
      const isTokenPulse = Math.sin(s * 10.0 - time * 6.0 * speed) > 0.82;

      const proj = projectPoint(rotated, {
        centerX,
        centerY,
        sphereRadius: radius,
        baseRadius: (1.1 + (isTokenPulse ? 0.35 : 0)),
        minOpacity: 0.12,
        maxOpacity: 0.98,
      });

      projected.push({ ...proj, isTokenPulse });
    }

    // Sort particles by depth
    projected.sort((a, b) => a.z - b.z);

    // Draw streaming token particles
    for (const pt of projected) {
      const alpha = pt.isTokenPulse ? Math.min(1.0, pt.depthAlpha * 1.3) : pt.depthAlpha;
      ctx.fillStyle = hexToRgba(theme.foreground, alpha);

      ctx.beginPath();
      ctx.arc(pt.x2d, pt.y2d, pt.radius, 0, Math.PI * 2);
      ctx.fill();

      // Atmospheric token halo only on large viewports
      if (radius > 24 && pt.isTokenPulse && pt.z > 0) {
        ctx.fillStyle = hexToRgba(theme.foreground, 0.2 * pt.depthAlpha);
        ctx.beginPath();
        ctx.arc(pt.x2d, pt.y2d, pt.radius * 2.0, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
}

export const streamingPreset = new StreamingPreset();
