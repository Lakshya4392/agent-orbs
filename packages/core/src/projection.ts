import { Point3D, ProjectedPoint } from './types.js';

export const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5)); // ~2.399963229728653

export interface RotationMatrix {
  m00: number;
  m01: number;
  m02: number;
  m10: number;
  m11: number;
  m12: number;
  m20: number;
  m21: number;
  m22: number;
}

/**
 * Creates a combined 3D Euler rotation matrix (Rz * Ry * Rx)
 */
export function createRotationMatrix(rx: number, ry: number, rz: number): RotationMatrix {
  const cx = Math.cos(rx);
  const sx = Math.sin(rx);
  const cy = Math.cos(ry);
  const sy = Math.sin(ry);
  const cz = Math.cos(rz);
  const sz = Math.sin(rz);

  return {
    m00: cy * cz,
    m01: sx * sy * cz - cx * sz,
    m02: cx * sy * cz + sx * sz,

    m10: cy * sz,
    m11: sx * sy * sz + cx * cz,
    m12: cx * sy * sz - sx * cz,

    m20: -sy,
    m21: sx * cy,
    m22: cx * cy,
  };
}

/**
 * Applies a 3D rotation matrix to a point
 */
export function applyRotation(p: Point3D, m: RotationMatrix): Point3D {
  return {
    x: m.m00 * p.x + m.m01 * p.y + m.m02 * p.z,
    y: m.m10 * p.x + m.m11 * p.y + m.m12 * p.z,
    z: m.m20 * p.x + m.m21 * p.y + m.m22 * p.z,
  };
}

/**
 * Perspective projection options
 */
export interface ProjectionConfig {
  centerX: number;
  centerY: number;
  sphereRadius: number;
  cameraDistance?: number;
  baseRadius?: number;
  minOpacity?: number;
  maxOpacity?: number;
}

/**
 * Projects a 3D point onto a 2D screen with perspective and depth falloff
 */
export function projectPoint(p: Point3D, config: ProjectionConfig): ProjectedPoint {
  const {
    centerX,
    centerY,
    sphereRadius,
    cameraDistance = sphereRadius * 3.2,
    baseRadius = 1.3,
    minOpacity = 0.12,
    maxOpacity = 0.98,
  } = config;

  // Camera is positioned at +Z looking towards origin (0, 0, 0)
  // Distance to point along Z axis
  const zDist = Math.max(cameraDistance * 0.25, cameraDistance - p.z);
  const scale = cameraDistance / zDist;

  // 2D screen coordinates
  const x2d = centerX + p.x * scale;
  const y2d = centerY + p.y * scale;

  // Normalized depth [-1..1]
  const safeRadius = Math.max(sphereRadius, 1);
  const zNorm = Math.max(-1, Math.min(1, p.z / safeRadius));
  const depthT = (zNorm + 1) * 0.5; // 0 (far) to 1 (near)

  // Non-linear depth cues for rich volumetric depth
  const depthAlpha = minOpacity + Math.pow(depthT, 1.4) * (maxOpacity - minOpacity);

  // Scale particle radius dynamically with sphere radius so small orbs never bloat into white blobs
  const sizeFactor = Math.max(0.38, Math.min(1.15, safeRadius / 38));
  const effectiveBase = baseRadius * sizeFactor;
  const radius = Math.max(0.35, effectiveBase * scale * (0.65 + 0.6 * depthT));

  return {
    x2d,
    y2d,
    scale,
    depthAlpha,
    radius,
    z: p.z,
  };
}

/**
 * Generates an even distribution of points on a sphere using the Fibonacci lattice (golden spiral)
 */
export function createFibonacciSphere(count: number, radius: number): Point3D[] {
  const points: Point3D[] = new Array(count);
  for (let i = 0; i < count; i++) {
    // Height from -1 to 1
    const y = 1 - ((i + 0.5) * 2) / count;
    const rCircle = Math.sqrt(Math.max(0, 1 - y * y));
    const phi = i * GOLDEN_ANGLE;

    points[i] = {
      x: Math.cos(phi) * rCircle * radius,
      y: y * radius,
      z: Math.sin(phi) * rCircle * radius,
    };
  }
  return points;
}
