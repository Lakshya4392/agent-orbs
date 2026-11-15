import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { type OrbShapeType, type OrbState, type OrbTheme } from '@agent-orbs/core';
import { useAgentOrb } from './useAgentOrb.js';

export interface AgentOrbProps
  extends Omit<React.CanvasHTMLAttributes<HTMLCanvasElement>, 'children'> {
  /**
   * Kinetic state of the orb
   * @default 'idle'
   */
  state?: OrbState;
  /**
   * Geometric shape target (sphere, cube, cylinder, pyramid, torus, helix, star)
   * @default 'sphere'
   */
  shape?: OrbShapeType;
  /**
   * Size in pixels (width and height). If omitted, dimensions will adapt to container/CSS.
   * @default 120
   */
  size?: number;
  /**
   * Rotation and animation speed multiplier
   * @default 1.0
   */
  speed?: number;
  /**
   * Custom particle density override
   */
  particleCount?: number;
  /**
   * Whether the orb responds to mouse/touch drag rotation
   * @default true
   */
  interactive?: boolean;
  /**
   * Whether canvas background is transparent (true) or filled with theme.background (false)
   * @default true
   */
  transparent?: boolean;
  /**
   * Theme colors overriding default palette tokens
   */
  theme?: Partial<OrbTheme>;
  /**
   * Hook into 60/120fps render loop with live frame statistics
   */
  onFrame?: (stats: { fps: number; time: number }) => void;
  /**
   * Custom CSS class name
   */
  className?: string;
  /**
   * Custom inline style
   */
  style?: React.CSSProperties;
}

/**
 * Standalone mathematical 3D kinetic orb component powered by HTML5 Canvas.
 */
export const AgentOrb = forwardRef<HTMLCanvasElement, AgentOrbProps>(
  function AgentOrb(props, forwardedRef) {
    const {
      state = 'idle',
      shape = 'sphere',
      size = 120,
      speed = 1.0,
      particleCount,
      interactive = true,
      transparent = true,
      theme,
      onFrame,
      className,
      style,
      ...canvasProps
    } = props;

    const { canvasRef } = useAgentOrb({
      state,
      shape,
      size,
      speed,
      particleCount,
      interactive,
      transparent,
      theme,
      onFrame,
    });

    useImperativeHandle(forwardedRef, () => canvasRef.current as HTMLCanvasElement, [canvasRef]);

    const combinedStyle: React.CSSProperties = {
      width: size ? `${size}px` : undefined,
      height: size ? `${size}px` : undefined,
      display: 'inline-block',
      verticalAlign: 'middle',
      ...style,
    };

    return (
      <canvas
        ref={canvasRef}
        role="img"
        aria-label={`Agent Orb Loader: ${state}`}
        className={className}
        style={combinedStyle}
        {...canvasProps}
      />
    );
  }
);

AgentOrb.displayName = 'AgentOrb';
