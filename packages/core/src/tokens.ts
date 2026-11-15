export const ORB_TOKENS = {
  background: '#040404',
  foreground: '#FFFFFF',
  accent: '#37393E',
} as const;

export type OrbTokens = typeof ORB_TOKENS;

/**
 * Converts a hex string (#RGB or #RRGGBB) to rgba string with given alpha [0..1]
 */
export function hexToRgba(hex: string, alpha: number): string {
  const cleanHex = hex.replace('#', '').trim();
  let r = 255;
  let g = 255;
  let b = 255;

  if (cleanHex.length === 3) {
    r = parseInt(cleanHex[0] + cleanHex[0], 16);
    g = parseInt(cleanHex[1] + cleanHex[1], 16);
    b = parseInt(cleanHex[2] + cleanHex[2], 16);
  } else if (cleanHex.length === 6) {
    r = parseInt(cleanHex.substring(0, 2), 16);
    g = parseInt(cleanHex.substring(2, 4), 16);
    b = parseInt(cleanHex.substring(4, 6), 16);
  }

  const clampedAlpha = Math.max(0, Math.min(1, alpha));
  return `rgba(${r}, ${g}, ${b}, ${clampedAlpha.toFixed(3)})`;
}
