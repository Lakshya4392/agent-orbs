import { hexToRgba } from '../tokens.js';
import {
  applyRotation,
  createRotationMatrix,
  projectPoint,
} from '../projection.js';
import { OrbPreset, Point3D, PresetContext, ProjectedPoint } from '../types.js';

interface KeplerianOrbit {
  a: number; // semi-major axis relative to radius
  e: number; // eccentricity [0..0.6]
  inc: number; // inclination
  node: number; // longitude of ascending node
  omega: number; // argument of periapsis
  period: number; // orbital period factor
}

interface OrbitalParticle {
  orbitIndex: number;
  meanAnomaly0: number; // initial mean anomaly
  trail?: ProjectedPoint;
}

export class WorkingPreset implements OrbPreset {
  readonly name = 'working' as const;

  private orbits: KeplerianOrbit[] = [];
  private particles: OrbitalParticle[] = [];

  constructor() {
    this.initOrbits();
  }

  private initOrbits() {
    // 5 distinct inclined orbital planes
    this.orbits = [
      { a: 0.95, e: 0.28, inc: 0.45, node: 0.2, omega: 0.5, period: 2.8 },
      { a: 0.82, e: 0.42, inc: -0.65, node: 1.8, omega: 1.2, period: 2.2 },
      { a: 0.70, e: 0.35, inc: 1.10, node: 3.4, omega: 2.1, period: 1.7 },
      { a: 0.88, e: 0.20, inc: -1.25, node: 4.8, omega: 0.8, period: 2.5 },
      { a: 0.60, e: 0.50, inc: 0.20, node: 5.9, omega: 3.0, period: 1.4 },
      { a: 1.05, e: 0.15, inc: 0.85, node: 2.5, omega: 4.2, period: 3.2 },
    ];

    this.particles = [];
    const count = 110;
    for (let i = 0; i < count; i++) {
      const orbitIndex = i % this.orbits.length;
      const meanAnomaly0 = Math.random() * Math.PI * 2;
      this.particles.push({ orbitIndex, meanAnomaly0 });
    }
  }

  // Solves Kepler's equation M = E - e*sin(E) using Newton-Raphson (3 iterations)
  private solveKepler(M: number, e: number): number {
    let E = M;
    for (let k = 0; k < 3; k++) {
      const f = E - e * Math.sin(E) - M;
      const fPrime = 1 - e * Math.cos(E);
      E -= f / fPrime;
    }
    return E;
  }

  // Converts orbital elements to 3D Cartesian coordinates
  private orbitalToCartesian(orbit: KeplerianOrbit, M: number, radius: number): Point3D {
    const { a, e, inc, node, omega } = orbit;
    const E = this.solveKepler(M, e);

    // True anomaly nu and radius r
    const cosE = Math.cos(E);
    const sinE = Math.sin(E);
    const r = radius * a * (1 - e * cosE);

    // Orbital plane coordinates
    const cosNu = (cosE - e) / (1 - e * cosE);
    const sinNu = (Math.sqrt(Math.max(0, 1 - e * e)) * sinE) / (1 - e * cosE);
    const nu = Math.atan2(sinNu, cosNu);

    const theta = nu + omega;

    // Position in 3D inclined plane
    const cosNode = Math.cos(node);
    const sinNode = Math.sin(node);
    const cosInc = Math.cos(inc);
    const sinInc = Math.sin(inc);
    const cosTheta = Math.cos(theta);
    const sinTheta = Math.sin(theta);

    const x = r * (cosNode * cosTheta - sinNode * sinTheta * cosInc);
    const y = r * (sinTheta * sinInc);
    const z = r * (sinNode * cosTheta + cosNode * sinTheta * cosInc);

    return { x, y, z };
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

    // Dynamic camera rotation
    const rotX = 0.5 + time * 0.22 * speed + interactiveOffset.rx;
    const rotY = time * 0.65 * speed + interactiveOffset.ry;
    const rotZ = Math.sin(time * 0.35 * speed) * 0.1;
    const rotMatrix = createRotationMatrix(rotX, rotY, rotZ);

    // Adaptive particle count: small pills use ~36 particles so each fast orbital path is clearly distinguished
    const activeCount = radius < 22 ? 36 : 72;
    const activeParticles = this.particles.slice(0, activeCount);

    // Compute dynamic orbital particles
    const projectedParticles: (ProjectedPoint & { speedNorm: number })[] = [];

    for (const p of activeParticles) {
      const orbit = this.orbits[p.orbitIndex];
      // Mean motion n = 2PI / period
      const n = (Math.PI * 2) / orbit.period;
      const M = (p.meanAnomaly0 + time * n * speed) % (Math.PI * 2);

      const p3d = this.orbitalToCartesian(orbit, M, radius);
      const rotated = applyRotation(p3d, rotMatrix);

      const proj = projectPoint(rotated, {
        centerX,
        centerY,
        sphereRadius: radius,
        baseRadius: 1.15,
        minOpacity: 0.15,
        maxOpacity: 0.98,
      });

      // Speed indicator: higher near periapsis (smaller r)
      const distFromCenter = Math.sqrt(p3d.x * p3d.x + p3d.y * p3d.y + p3d.z * p3d.z);
      const speedNorm = Math.max(0, Math.min(1, 1.2 - distFromCenter / (radius * orbit.a)));

      projectedParticles.push({ ...proj, speedNorm });
    }

    // Sort particles by depth
    projectedParticles.sort((a, b) => a.z - b.z);

    // Render swirling kinetic orbital particles (NO giant white nucleus blob!)
    for (const pt of projectedParticles) {
      const dotRadius = pt.radius * (0.85 + 0.35 * pt.speedNorm);

      ctx.fillStyle = hexToRgba(theme.foreground, pt.depthAlpha);
      ctx.beginPath();
      ctx.arc(pt.x2d, pt.y2d, dotRadius, 0, Math.PI * 2);
      ctx.fill();

      // Velocity trail for fast whipping particles on large viewports
      if (radius > 24 && pt.speedNorm > 0.6 && pt.z > -radius * 0.2) {
        ctx.fillStyle = hexToRgba(theme.foreground, pt.depthAlpha * 0.2);
        ctx.beginPath();
        ctx.arc(pt.x2d, pt.y2d, dotRadius * 1.8, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
}

export const workingPreset = new WorkingPreset();
