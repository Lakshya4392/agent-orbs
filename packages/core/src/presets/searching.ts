import { hexToRgba } from '../tokens.js';
import {
  applyRotation,
  createRotationMatrix,
  projectPoint,
} from '../projection.js';
import { OrbPreset, Point3D, PresetContext, ProjectedPoint } from '../types.js';

interface RadarTarget {
  theta: number;
  phi: number;
  lastPingTime: number;
}

export class SearchingPreset implements OrbPreset {
  readonly name = 'searching' as const;

  private targets: RadarTarget[] = [
    { theta: 0.9, phi: 0.35, lastPingTime: 0 },
    { theta: 2.5, phi: -0.4, lastPingTime: 0 },
    { theta: 4.1, phi: 0.25, lastPingTime: 0 },
    { theta: 5.6, phi: -0.3, lastPingTime: 0 },
  ];

  render(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    context: PresetContext
  ): void {
    const { time, radius, speed, theme, interactiveOffset } = context;
    const centerX = width * 0.5;
    const centerY = height * 0.5;

    // Smooth spherical tilt
    const rotX = 0.38 + interactiveOffset.rx;
    const rotY = time * 0.35 * speed + interactiveOffset.ry;
    const rotZ = 0.06;
    const rotMatrix = createRotationMatrix(rotX, rotY, rotZ);

    // 360-degree rotating radar sweep angle around sphere's Y axis
    const sweepAngle = (time * 2.4 * speed) % (Math.PI * 2);

    // Adaptive coordinate lattice resolution
    const latSteps = radius < 22 ? 6 : 9;
    const lonSteps = radius < 22 ? 14 : 22;

    const activeNodes: (ProjectedPoint & { sweepIntensity: number; isFront: boolean })[] = [];

    // 1. Calculate coordinate lattice nodes
    for (let i = 0; i < latSteps; i++) {
      const phi = (((i + 1) / (latSteps + 1)) - 0.5) * Math.PI * 0.88;
      const cosPhi = Math.cos(phi);
      const sinPhi = Math.sin(phi);

      for (let j = 0; j < lonSteps; j++) {
        const theta = (j / lonSteps) * Math.PI * 2;

        // Angular distance behind the radar sweep beam [0..2PI]
        let dAngle = (sweepAngle - theta) % (Math.PI * 2);
        if (dAngle < 0) dAngle += Math.PI * 2;

        // Strong exponential decay envelope behind sweep beam
        const sweepIntensity = dAngle < 1.6 ? Math.exp(-dAngle / 0.42) : 0;

        const p3d: Point3D = {
          x: radius * cosPhi * Math.cos(theta),
          y: radius * sinPhi,
          z: radius * cosPhi * Math.sin(theta),
        };

        const rotated = applyRotation(p3d, rotMatrix);
        const isFront = rotated.z > -radius * 0.2;

        const proj = projectPoint(rotated, {
          centerX,
          centerY,
          sphereRadius: radius,
          baseRadius: 1.25,
          minOpacity: 0.22,
          maxOpacity: 0.98,
        });

        activeNodes.push({ ...proj, sweepIntensity, isFront });
      }
    }

    // Sort nodes by depth (back to front)
    activeNodes.sort((a, b) => a.z - b.z);

    // 2. Draw coordinate nodes with guaranteed high-contrast visibility
    for (const node of activeNodes) {
      if (node.sweepIntensity > 0.05) {
        // High-intensity illuminated node in radar wake
        const alpha = Math.min(1.0, 0.45 + node.sweepIntensity * 0.55);
        const nodeR = Math.max(0.9, node.radius * (1 + node.sweepIntensity * 0.85));

        ctx.fillStyle = hexToRgba(theme.foreground, alpha);
        ctx.beginPath();
        ctx.arc(node.x2d, node.y2d, nodeR, 0, Math.PI * 2);
        ctx.fill();

        // Atmospheric phosphor glow on large viewports
        if (radius > 24 && node.sweepIntensity > 0.5 && node.z > 0) {
          ctx.fillStyle = hexToRgba(theme.foreground, 0.25 * node.sweepIntensity);
          ctx.beginPath();
          ctx.arc(node.x2d, node.y2d, nodeR * 2.2, 0, Math.PI * 2);
          ctx.fill();
        }
      } else {
        // Clear, crisp baseline coordinate node (ensuring Searching is ALWAYS visible!)
        const baseAlpha = node.isFront ? Math.max(0.38, node.depthAlpha * 0.85) : Math.max(0.18, node.depthAlpha * 0.45);
        const nodeR = Math.max(0.75, node.radius * 0.95);

        ctx.fillStyle = hexToRgba(theme.foreground, baseAlpha);
        ctx.beginPath();
        ctx.arc(node.x2d, node.y2d, nodeR, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // 3. Render rotating Radar Sweep Meridian Beam (the sweeping laser scanline)
    const beamSamples = radius < 22 ? 8 : 16;
    const sweepPoints: ProjectedPoint[] = [];

    for (let k = 0; k <= beamSamples; k++) {
      const phi = ((k / beamSamples) - 0.5) * Math.PI * 0.92;
      const p3d: Point3D = {
        x: radius * Math.cos(phi) * Math.cos(sweepAngle),
        y: radius * Math.sin(phi),
        z: radius * Math.cos(phi) * Math.sin(sweepAngle),
      };
      const rotated = applyRotation(p3d, rotMatrix);
      const proj = projectPoint(rotated, {
        centerX,
        centerY,
        sphereRadius: radius,
        baseRadius: 1.35,
        minOpacity: 0.35,
        maxOpacity: 1.0,
      });
      sweepPoints.push(proj);
    }

    // Draw bright scanning beam dots along current sweep angle
    for (const pt of sweepPoints) {
      if (pt.z > -radius * 0.3) {
        ctx.fillStyle = hexToRgba(theme.foreground, Math.min(1.0, pt.depthAlpha * 1.4));
        ctx.beginPath();
        ctx.arc(pt.x2d, pt.y2d, Math.max(1.0, pt.radius * 1.15), 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // 4. Detect and draw radar target blips & expanding sonar rings
    for (const target of this.targets) {
      let dAngle = (sweepAngle - target.theta) % (Math.PI * 2);
      if (dAngle < 0) dAngle += Math.PI * 2;

      // When radar sweeps over target blip, trigger ping
      if (dAngle < 0.18) {
        target.lastPingTime = time;
      }

      const p3d: Point3D = {
        x: radius * Math.cos(target.phi) * Math.cos(target.theta),
        y: radius * Math.sin(target.phi),
        z: radius * Math.cos(target.phi) * Math.sin(target.theta),
      };

      const rotated = applyRotation(p3d, rotMatrix);
      const proj = projectPoint(rotated, {
        centerX,
        centerY,
        sphereRadius: radius,
        baseRadius: 2.2,
        minOpacity: 0.3,
        maxOpacity: 1.0,
      });

      const timeSincePing = time - target.lastPingTime;
      const pingActive = timeSincePing < 1.1 && target.lastPingTime > 0;

      if (pingActive && proj.z > -radius * 0.2) {
        const pingT = timeSincePing / 1.1;
        const pingAlpha = (1 - pingT) * 0.85;
        const ringSize = Math.max(1.5, proj.radius * (1 + pingT * 3.5));

        // Expanding sonar ping ring
        ctx.strokeStyle = hexToRgba(theme.foreground, pingAlpha);
        ctx.lineWidth = 1.0;
        ctx.beginPath();
        ctx.arc(proj.x2d, proj.y2d, ringSize, 0, Math.PI * 2);
        ctx.stroke();

        // Bright blip center
        ctx.fillStyle = hexToRgba(theme.foreground, 1.0 - pingT * 0.4);
        ctx.beginPath();
        ctx.arc(proj.x2d, proj.y2d, Math.max(1.2, proj.radius * 1.1), 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
}

export const searchingPreset = new SearchingPreset();
