import React, { forwardRef, useState } from 'react';
import { type OrbShapeType, type OrbState, type OrbTheme } from '@agent-orbs/core';
import { AgentOrb, type AgentOrbProps } from './AgentOrb.js';

export type AgentPillSize = 'sm' | 'md' | 'lg';

export const DEFAULT_PILL_LABELS: Record<OrbState, string> = {
  solving: 'Solving....',
  thinking: 'Thinking....',
  listening: 'Agent listening...',
  working: 'Working....',
  searching: 'Searching....',
  streaming: 'Streaming....',
  weaving: 'Weaving context...',
  diffusion: 'Generating image...',
  idle: 'Agent ready',
  error: 'Interrupted...',
};

export interface AgentPillProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * Kinetic state of the orb and pill
   * @default 'idle'
   */
  state?: OrbState;
  /**
   * Geometric shape target (sphere, cube, cylinder, pyramid, torus, helix, star)
   * @default 'sphere'
   */
  shape?: OrbShapeType;
  /**
   * Status label on the right. Defaults to the canonical status text for the state
   * (e.g. "Solving....", "Thinking....", "Agent listening...", "Working....", "Searching....")
   */
  label?: React.ReactNode;
  /**
   * Size preset: 'sm' (28px height), 'md' (36px height), 'lg' (48px height)
   * @default 'md'
   */
  size?: AgentPillSize;
  /**
   * Explicit override for mini orb diameter in pixels. Defaults to 24px on 'md', 18px on 'sm', 32px on 'lg'.
   */
  orbSize?: number;
  /**
   * Rotation and animation speed multiplier for embedded orb
   * @default 1.0
   */
  speed?: number;
  /**
   * Custom particle density override for embedded orb
   */
  particleCount?: number;
  /**
   * Whether the pill is in active / selected state
   * @default false
   */
  active?: boolean;
  /**
   * Whether direct mouse drag rotates the embedded mini orb
   * @default false
   */
  interactiveOrb?: boolean;
  /**
   * Whether to render as an interactive <button> or <div> container
   * @default 'button' if onClick is present, else 'div'
   */
  as?: 'button' | 'div';
  /**
   * Theme colors for the embedded orb
   */
  theme?: Partial<OrbTheme>;
  /**
   * Additional props forwarded directly to the embedded AgentOrb component
   */
  orbProps?: Partial<AgentOrbProps>;
}

const SIZE_CONFIGS: Record<
  AgentPillSize,
  {
    height: number;
    orbSize: number;
    fontSize: number;
    paddingLeft: number;
    paddingRight: number;
    gap: number;
  }
> = {
  sm: {
    height: 28,
    orbSize: 18,
    fontSize: 12,
    paddingLeft: 6,
    paddingRight: 12,
    gap: 8,
  },
  md: {
    height: 36,
    orbSize: 24, // Exact default 24px from Reference Image 2
    fontSize: 13,
    paddingLeft: 8,
    paddingRight: 16,
    gap: 10,
  },
  lg: {
    height: 48,
    orbSize: 32,
    fontSize: 15,
    paddingLeft: 10,
    paddingRight: 20,
    gap: 12,
  },
};

/**
 * Pixel-perfect reproduction of Reference Image 2:
 * Pill container with embedded mini mathematical AgentOrb on the left
 * and status label on the right.
 */
export const AgentPill = forwardRef<HTMLElement, AgentPillProps>(
  function AgentPill(props, forwardedRef) {
    const {
      state = 'idle',
      shape = 'sphere',
      label,
      size = 'md',
      orbSize: customOrbSize,
      speed = 1.0,
      particleCount,
      active = false,
      interactiveOrb = false,
      as,
      theme,
      orbProps,
      className,
      style,
      onClick,
      onMouseEnter,
      onMouseLeave,
      onFocus,
      onBlur,
      children,
      ...restProps
    } = props;

    const [isHovered, setIsHovered] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const config = SIZE_CONFIGS[size] || SIZE_CONFIGS.md;
    const finalOrbSize = customOrbSize ?? config.orbSize;
    const displayText = label !== undefined ? label : (DEFAULT_PILL_LABELS[state] ?? 'Agent ready');

    const ElementTag = as || (onClick ? 'button' : 'div');

    const baseStyle: React.CSSProperties = {
      boxSizing: 'border-box',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
      height: `${config.height}px`,
      paddingLeft: `${config.paddingLeft}px`,
      paddingRight: `${config.paddingRight}px`,
      gap: `${config.gap}px`,
      borderRadius: '9999px',
      backgroundColor: active
        ? '#141414'
        : isHovered
        ? '#101010'
        : '#080808',
      border: active
        ? '1px solid rgba(255, 255, 255, 0.45)'
        : isHovered
        ? '1px solid rgba(255, 255, 255, 0.28)'
        : '1px solid #222222',
      boxShadow: active
        ? '0 0 16px rgba(255, 255, 255, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.15)'
        : isHovered
        ? '0 0 12px rgba(255, 255, 255, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
        : 'inset 0 1px 0 rgba(255, 255, 255, 0.03)',
      color: '#FFFFFF',
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Inter, system-ui, sans-serif',
      fontSize: `${config.fontSize}px`,
      fontWeight: 450,
      letterSpacing: '-0.01em',
      lineHeight: 1,
      userSelect: 'none',
      cursor: onClick || ElementTag === 'button' ? 'pointer' : 'default',
      outline: isFocused ? '2px solid rgba(255, 255, 255, 0.4)' : 'none',
      outlineOffset: '2px',
      transition: 'all 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
      textDecoration: 'none',
      appearance: 'none',
      ...style,
    };

    const handleMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
      setIsHovered(true);
      onMouseEnter?.(e);
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLElement>) => {
      setIsHovered(false);
      onMouseLeave?.(e);
    };

    const handleFocus = (e: React.FocusEvent<HTMLElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLElement>) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    return React.createElement(
      ElementTag,
      {
        ref: forwardedRef,
        role: ElementTag === 'button' ? 'button' : 'status',
        tabIndex: ElementTag === 'button' || onClick ? 0 : undefined,
        className,
        style: baseStyle,
        onClick,
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave,
        onFocus: handleFocus,
        onBlur: handleBlur,
        ...restProps,
      },
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          width: `${finalOrbSize}px`,
          height: `${finalOrbSize}px`,
          pointerEvents: interactiveOrb ? 'auto' : 'none',
        }}
      >
        <AgentOrb
          state={state}
          shape={shape}
          size={finalOrbSize}
          speed={speed}
          particleCount={particleCount}
          interactive={interactiveOrb}
          transparent={true}
          theme={theme}
          {...orbProps}
        />
      </div>,
      <span
        style={{
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: 'inline-block',
          verticalAlign: 'middle',
        }}
      >
        {displayText}
      </span>,
      children
    );
  }
);

AgentPill.displayName = 'AgentPill';
