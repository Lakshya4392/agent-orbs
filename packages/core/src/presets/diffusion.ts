import { hexToRgba } from '../tokens.js';
import {
  applyRotation,
  createRotationMatrix,
  projectPoint,
} from '../projection.js';
import { OrbPreset, Point3D, PresetContext, ProjectedPoint } from '../types.js';

export class DiffusionPreset implements OrbPreset {
  readonly name = 'diffusion' as const;

  render(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    context: PresetContext
  ): void {
    const { time, radius, speed, theme, interactiveOffset } = context;
    const centerX = width * 0.5;
    const centerY = height * 0.5;

    // Fixed front-facing canvas tilt
    const rotX = 0.22 + interactiveOffset.rx;
    const rotY = Math.sin(time * 0.3 * speed) * 0.08 + interactiveOffset.ry;
    const rotZ = 0.0;
    const rotMatrix = createRotationMatrix(rotX, rotY, rotZ);

    // Diffusion lifecycle period: ~4.0 seconds per denoising generation cycle
    const cycleDuration = 4.0 / Math.max(0.2, speed);
    const cycleProgress = (time % cycleDuration) / cycleDuration; // 0.0 to 1.0

    // Phase 1 (0.0 to 0.55): Noise -> Coherence (Reverse Diffusion Denoising)
    // Noise level decays from 1.0 to 0.0
    const noiseLevel = cycleProgress < 0.6
      ? Math.pow(1.0 - cycleProgress / 0.6, 2.0)
      : (cycleProgress > 0.9 ? (cycleProgress - 0.9) / 0.1 : 0.0);

    // Phase 2 (0.5 to 0.9): Generative Upscale Scanline Beam
    const scanProgress = cycleProgress >= 0.5 && cycleProgress <= 0.9
      ? (cycleProgress - 0.5) / 0.4
      : -1.0;

    // Grid dimension
    const gridSize = radius < 22 ? 8 : 12;
    const halfSide = radius * 0.85;

    const projectedPixels: (ProjectedPoint & { isScanned: boolean; intensity: number })[] = [];

    // Scanline Y position in 3D canvas coordinates
    const scanlineY = scanProgress >= 0
      ? -halfSide + scanProgress * 2 * halfSide
      : -999;

    for (let row = 0; row < gridSize; row++) {
      const v = (row / (gridSize - 1)) * 2 - 1; // -1 to 1
      const targetY = v * halfSide;

      for (let col = 0; col < gridSize; col++) {
        const u = (col / (gridSize - 1)) * 2 - 1; // -1 to 1
        const targetX = u * halfSide;

        // Pseudo-random deterministic noise hash per pixel
        const hash = Math.sin(col * 12.9898 + row * 78.233 + Math.floor(time * 12)) * 43758.5453;
        const randX = ((hash % 1) - 0.5) * 2;
        const randY = (((hash * 1.5) % 1) - 0.5) * 2;
        const randZ = (((hash * 2.3) % 1) - 0.5) * 2;

        // Brownian noise displacement
        const jitterMagnitude = radius * 0.55 * noiseLevel;
        const px = targetX + randX * jitterMagnitude;
        const py = targetY + randY * jitterMagnitude;
        const pz = randZ * jitterMagnitude * 0.6;

        const rotated = applyRotation({ x: px, y: py, z: pz }, rotMatrix);
        const proj = projectPoint(rotated, {
          centerX,
          centerY,
          sphereRadius: radius,
          baseRadius: 1.15,
          minOpacity: 0.18,
          maxOpacity: 0.98,
        });

        // Check if pixel is illuminated by the generative scanline beam
        const distToScan = Math.abs(py - scanlineY);
        const isNearScan = scanProgress >= 0 && distToScan < radius * 0.28;
        const scanIntensity = isNearScan ? 1.0 - distToScan / (radius * 0.28) : 0.0;

        projectedPixels.push({
          ...proj,
          isScanned: scanProgress >= 0 && py < scanlineY,
          intensity: scanIntensity,
        });
      }
    }

    // Sort pixels by depth
    projectedPixels.sort((a, b) => a.z - b.z);

    // Draw latent pixel field
    for (const px of projectedPixels) {
      if (px.intensity > 0.05) {
        // Bright glowing pixel during laser scanline sweep
        const alpha = Math.min(1.0, 0.5 + px.intensity * 0.5);
        const r = Math.max(1.0, px.radius * (1.0 + px.intensity * 0.9));

        ctx.fillStyle = hexToRgba(theme.foreground, alpha);
        ctx.beginPath();
        ctx.arc(px.x2d, px.y2d, r, 0, Math.PI * 2);
        ctx.fill();

        if (radius > 24 && px.intensity > 0.6) {
          ctx.fillStyle = hexToRgba(theme.foreground, 0.25 * px.intensity);
          ctx.beginPath();
          ctx.arc(px.x2d, px.y2d, r * 2.2, 0, Math.PI * 2);
          ctx.fill();
        }
      } else {
        // Clean high-contrast pixel
        const baseAlpha = px.isScanned
          ? Math.max(0.65, px.depthAlpha)
          : Math.max(0.32, px.depthAlpha * 0.7);
        const r = Math.max(0.75, px.radius * (px.isScanned ? 1.1 : 0.9));

        ctx.fillStyle = hexToRgba(theme.foreground, baseAlpha);
        ctx.beginPath();
        ctx.arc(px.x2d, px.y2d, r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Draw horizontal laser scanline beam when scanning
    if (scanProgress >= 0) {
      const leftPt3d: Point3D = { x: -halfSide * 1.08, y: scanlineY, z: 0 };
      const rightPt3d: Point3D = { x: halfSide * 1.08, y: scanlineY, z: 0 };

      const leftProj = projectPoint(applyRotation(leftPt3d, rotMatrix), {
        centerX,
        centerY,
        sphereRadius: radius,
      });
      const rightProj = projectPoint(applyRotation(rightPt3d, rotMatrix), {
        centerX,
        centerY,
        sphereRadius: radius,
      });

      // Luminous scan beam
      ctx.strokeStyle = hexToRgba(theme.foreground, 0.85);
      ctx.lineWidth = radius < 22 ? 1.0 : 1.5;
      ctx.beginPath();
      ctx.moveTo(leftProj.x2d, leftProj.y2d);
      ctx.lineTo(rightProj.x2d, rightProj.y2d);
      ctx.stroke();

      // Atmospheric scanline glow on larger viewports
      if (radius > 24) {
        ctx.strokeStyle = hexToRgba(theme.foreground, 0.22);
        ctx.lineWidth = 4.0;
        ctx.beginPath();
        ctx.moveTo(leftProj.x2d, leftProj.y2d);
        ctx.lineTo(rightProj.x2d, rightProj.y2d);
        ctx.stroke();
      }
    }
  }
}

export const diffusionPreset = new DiffusionPreset();
