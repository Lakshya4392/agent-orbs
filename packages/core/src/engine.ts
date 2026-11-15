import { getPreset } from './presets/index.js';
import { ORB_TOKENS } from './tokens.js';
import {
  OrbOptions,
  OrbPreset,
  OrbRenderer,
  OrbState,
  OrbTheme,
  PresetContext,
} from './types.js';

export function createOrbRenderer(
  canvas: HTMLCanvasElement,
  options: OrbOptions = {}
): OrbRenderer {
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Canvas 2D context is not supported or could not be acquired');
  }

  // State & configurations
  let currentState: OrbState = options.state || 'idle';
  let currentShape = options.shape || 'sphere';
  let currentPreset: OrbPreset = getPreset(currentState);
  let speedMultiplier = options.speed !== undefined ? options.speed : 1.0;
  let customParticleCount = options.particleCount || 0;
  const isInteractive = options.interactive !== false;
  const isTransparent = Boolean(options.transparent);

  const theme: OrbTheme = {
    background: options.theme?.background || ORB_TOKENS.background,
    foreground: options.theme?.foreground || ORB_TOKENS.foreground,
    accent: options.theme?.accent || ORB_TOKENS.accent,
  };

  // Dimensions & DPI
  let displayWidth = options.size || canvas.clientWidth || 200;
  let displayHeight = options.size || canvas.clientHeight || displayWidth;
  let dpr = 1;

  // Interactivity physics
  let isDragging = false;
  let lastPointerX = 0;
  let lastPointerY = 0;
  let interactiveOffset = { rx: 0, ry: 0 };
  let dragVelocity = { vx: 0, vy: 0 };

  // Loop & timing
  let isRunning = true;
  let animationFrameId: number | null = null;
  let lastTimestamp = performance.now();
  let accumulatedTime = 0;

  // Setup High-DPI buffer
  function applyDPI(width: number, height: number) {
    displayWidth = Math.max(1, width);
    displayHeight = Math.max(1, height);
    dpr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 2) : 1;

    canvas.width = Math.round(displayWidth * dpr);
    canvas.height = Math.round(displayHeight * dpr);

    // Maintain CSS aspect ratio if explicit style not set
    if (!canvas.style.width) canvas.style.width = `${displayWidth}px`;
    if (!canvas.style.height) canvas.style.height = `${displayHeight}px`;

    ctx?.setTransform(1, 0, 0, 1, 0, 0);
    ctx?.scale(dpr, dpr);
  }

  // Pointer event listeners for interactive rotation & momentum
  function onPointerDown(e: PointerEvent) {
    if (!isInteractive) return;
    isDragging = true;
    lastPointerX = e.clientX;
    lastPointerY = e.clientY;
    dragVelocity = { vx: 0, vy: 0 };
    canvas.setPointerCapture?.(e.pointerId);
  }

  function onPointerMove(e: PointerEvent) {
    if (!isInteractive || !isDragging) return;
    const dx = e.clientX - lastPointerX;
    const dy = e.clientY - lastPointerY;
    lastPointerX = e.clientX;
    lastPointerY = e.clientY;

    const sensitivity = 0.008;
    interactiveOffset.ry += dx * sensitivity;
    interactiveOffset.rx -= dy * sensitivity;

    dragVelocity = {
      vx: dx * sensitivity,
      vy: -dy * sensitivity,
    };
  }

  function onPointerUp(e: PointerEvent) {
    if (!isInteractive) return;
    isDragging = false;
    canvas.releasePointerCapture?.(e.pointerId);
  }

  if (isInteractive && typeof window !== 'undefined') {
    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('pointercancel', onPointerUp);
  }

  // ResizeObserver for responsive canvas scaling
  let resizeObserver: ResizeObserver | null = null;
  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          applyDPI(width, height);
        }
      }
    });
    resizeObserver.observe(canvas);
  }

  // Initial DPI configuration
  applyDPI(displayWidth, displayHeight);

  // Main render loop
  function loop(timestamp: number) {
    if (!isRunning) return;

    const rawDelta = (timestamp - lastTimestamp) / 1000;
    lastTimestamp = timestamp;

    // Clamp delta time to avoid large physics steps when switching tabs
    const dt = Math.max(0, Math.min(rawDelta, 0.1));
    accumulatedTime += dt;

    // Apply drag inertia decay when not dragging
    if (!isDragging) {
      interactiveOffset.rx += dragVelocity.vy;
      interactiveOffset.ry += dragVelocity.vx;
      dragVelocity.vx *= 0.94;
      dragVelocity.vy *= 0.94;
    }

    // Clear background
    if (isTransparent) {
      ctx?.clearRect(0, 0, displayWidth, displayHeight);
    } else {
      if (ctx) {
        ctx.fillStyle = theme.background;
        ctx.fillRect(0, 0, displayWidth, displayHeight);
      }
    }

    // Sphere radius calibrated to ~40% of smallest dimension with padding
    const radius = Math.min(displayWidth, displayHeight) * 0.40;

    // Automatically adapt particle count to radius if custom count not explicitly specified
    // Small pill orbs (r ~ 10px) get ~42-55 particles so they stay crisp and never blob
    // Large viewports (r ~ 70-160px) get ~180-260 particles for rich volumetric depth
    const adaptiveParticleCount =
      customParticleCount > 0
        ? customParticleCount
        : Math.round(Math.max(42, Math.min(260, radius * 2.6)));

    const context: PresetContext = {
      time: accumulatedTime,
      dt,
      radius,
      speed: speedMultiplier,
      particleCount: adaptiveParticleCount,
      shape: currentShape,
      theme,
      rotation: { rx: 0, ry: 0, rz: 0 },
      interactiveOffset,
    };

    if (ctx) {
      currentPreset.render(ctx, displayWidth, displayHeight, context);
    }

    if (options.onFrame) {
      const fps = dt > 0 ? Math.round(1 / dt) : 60;
      options.onFrame({ fps, time: accumulatedTime });
    }

    animationFrameId = requestAnimationFrame(loop);
  }

  // Start animation loop
  animationFrameId = requestAnimationFrame(loop);

  // Return public API
  return {
    canvas,

    getState(): OrbState {
      return currentState;
    },

    setState(state: OrbState) {
      if (currentState === state) return;
      currentState = state;
      currentPreset = getPreset(state);
    },

    getShape() {
      return currentShape;
    },

    setShape(shape) {
      currentShape = shape;
    },

    setSpeed(speed: number) {
      speedMultiplier = Math.max(0, speed);
    },

    setTheme(newTheme: Partial<OrbTheme>) {
      if (newTheme.background !== undefined) theme.background = newTheme.background;
      if (newTheme.foreground !== undefined) theme.foreground = newTheme.foreground;
      if (newTheme.accent !== undefined) theme.accent = newTheme.accent;
    },

    setParticleCount(count: number) {
      customParticleCount = Math.max(10, count);
    },

    resize(width?: number, height?: number) {
      const w = width || canvas.clientWidth || displayWidth;
      const h = height || canvas.clientHeight || displayHeight;
      applyDPI(w, h);
    },

    pause() {
      if (!isRunning) return;
      isRunning = false;
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    },

    resume() {
      if (isRunning) return;
      isRunning = true;
      lastTimestamp = performance.now();
      animationFrameId = requestAnimationFrame(loop);
    },

    destroy() {
      isRunning = false;
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }

      if (resizeObserver) {
        resizeObserver.disconnect();
        resizeObserver = null;
      }

      if (isInteractive && typeof window !== 'undefined') {
        canvas.removeEventListener('pointerdown', onPointerDown);
        canvas.removeEventListener('pointermove', onPointerMove);
        canvas.removeEventListener('pointerup', onPointerUp);
        canvas.removeEventListener('pointercancel', onPointerUp);
      }
    },
  };
}
