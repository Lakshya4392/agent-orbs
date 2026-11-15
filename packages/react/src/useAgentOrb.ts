import { useEffect, useRef, useState, useCallback } from 'react';
import {
  createOrbRenderer,
  type OrbState,
  type OrbShapeType,
  type OrbOptions,
  type OrbRenderer,
  type OrbTheme,
} from '@agent-orbs/core';

export interface UseAgentOrbOptions extends OrbOptions {
  /**
   * Whether to automatically start rendering when mounted (default: true)
   */
  autoPlay?: boolean;
}

export interface UseAgentOrbReturn {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  renderer: OrbRenderer | null;
  state: OrbState;
  setState: (state: OrbState) => void;
  setShape: (shape: OrbShapeType) => void;
  setSpeed: (speed: number) => void;
  setParticleCount: (count: number) => void;
  setTheme: (theme: Partial<OrbTheme>) => void;
  pause: () => void;
  resume: () => void;
  resize: (width?: number, height?: number) => void;
}

export function useAgentOrb(options: UseAgentOrbOptions = {}): UseAgentOrbReturn {
  const {
    state: initialState = 'idle',
    shape = 'sphere',
    size,
    speed = 1.0,
    particleCount,
    interactive = true,
    transparent = true,
    theme,
    autoPlay = true,
    onFrame,
  } = options;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<OrbRenderer | null>(null);
  const [orbState, setOrbState] = useState<OrbState>(initialState);
  const [rendererInstance, setRendererInstance] = useState<OrbRenderer | null>(null);

  // Keep onFrame callback ref up to date to prevent recreating renderer
  const onFrameRef = useRef(onFrame);
  useEffect(() => {
    onFrameRef.current = onFrame;
  }, [onFrame]);

  // Initialize renderer when canvas ref becomes available
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = createOrbRenderer(canvas, {
      state: initialState,
      shape,
      size,
      speed,
      particleCount,
      interactive,
      transparent,
      theme,
      onFrame: (stats) => {
        onFrameRef.current?.(stats);
      },
    });

    rendererRef.current = renderer;
    setRendererInstance(renderer);

    if (autoPlay === false) {
      renderer.pause();
    }

    return () => {
      renderer.destroy();
      rendererRef.current = null;
      setRendererInstance(null);
    };
  }, [interactive, transparent]);

  // Synchronize dynamic shape
  useEffect(() => {
    if (rendererRef.current && options.shape) {
      rendererRef.current.setShape(options.shape);
    }
  }, [options.shape]);

  // Synchronize dynamic state
  useEffect(() => {
    if (rendererRef.current && options.state && options.state !== orbState) {
      rendererRef.current.setState(options.state);
      setOrbState(options.state);
    }
  }, [options.state, orbState]);

  // Synchronize speed
  useEffect(() => {
    if (rendererRef.current && options.speed !== undefined) {
      rendererRef.current.setSpeed(options.speed);
    }
  }, [options.speed]);

  // Synchronize particleCount
  useEffect(() => {
    if (rendererRef.current && options.particleCount !== undefined) {
      rendererRef.current.setParticleCount(options.particleCount);
    }
  }, [options.particleCount]);

  // Synchronize theme
  useEffect(() => {
    if (rendererRef.current && options.theme) {
      rendererRef.current.setTheme(options.theme);
    }
  }, [options.theme]);

  // Synchronize size
  useEffect(() => {
    if (rendererRef.current && options.size !== undefined) {
      rendererRef.current.resize(options.size, options.size);
    }
  }, [options.size]);

  const setState = useCallback((newState: OrbState) => {
    setOrbState(newState);
    rendererRef.current?.setState(newState);
  }, []);

  const setShape = useCallback((newShape: OrbShapeType) => {
    rendererRef.current?.setShape(newShape);
  }, []);

  const setSpeed = useCallback((newSpeed: number) => {
    rendererRef.current?.setSpeed(newSpeed);
  }, []);

  const setParticleCount = useCallback((count: number) => {
    rendererRef.current?.setParticleCount(count);
  }, []);

  const setTheme = useCallback((newTheme: Partial<OrbTheme>) => {
    rendererRef.current?.setTheme(newTheme);
  }, []);

  const pause = useCallback(() => {
    rendererRef.current?.pause();
  }, []);

  const resume = useCallback(() => {
    rendererRef.current?.resume();
  }, []);

  const resize = useCallback((width?: number, height?: number) => {
    rendererRef.current?.resize(width, height);
  }, []);

  return {
    canvasRef,
    renderer: rendererInstance,
    state: orbState,
    setState,
    setShape,
    setSpeed,
    setParticleCount,
    setTheme,
    pause,
    resume,
    resize,
  };
}
