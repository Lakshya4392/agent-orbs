import React, { useEffect, useRef, useState } from 'react';
import { createOrbRenderer, OrbRenderer, OrbState, ORB_TOKENS } from '@agent-orbs/core';
import { ORB_STATES_METADATA } from '../types';
import {
  Sliders,
  RotateCcw,
  Play,
  Pause,
  Copy,
  Check,
} from 'lucide-react';

interface StudioPanelProps {
  initialState?: OrbState;
  onExportConfig?: (config: Record<string, any>) => void;
}

export const StudioPanel: React.FC<StudioPanelProps> = ({
  initialState = 'solving',
  onExportConfig,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rendererRef = useRef<OrbRenderer | null>(null);

  // Studio configuration states
  const [state, setState] = useState<OrbState>(initialState);
  const [particleCount, setParticleCount] = useState<number>(420);
  const [speed, setSpeed] = useState<number>(1.0);
  const [radius, setRadius] = useState<number>(140);
  const [dotSize, setDotSize] = useState<number>(2.0);
  const [isInteractive, setIsInteractive] = useState<boolean>(true);
  const [isTransparent, setIsTransparent] = useState<boolean>(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [fps, setFps] = useState<number>(60);
  const [copied, setCopied] = useState<boolean>(false);

  // Theme overrides
  const [foreground, setForeground] = useState<string>(ORB_TOKENS.foreground);
  const [accent, setAccent] = useState<string>(ORB_TOKENS.accent);
  const [background, setBackground] = useState<string>(ORB_TOKENS.background);

  const meta = ORB_STATES_METADATA[state];

  // Initialize Canvas Renderer
  useEffect(() => {
    if (!canvasRef.current) return;

    const renderer = createOrbRenderer(canvasRef.current, {
      state,
      size: 380,
      speed,
      particleCount,
      interactive: isInteractive,
      transparent: isTransparent,
      theme: { foreground, accent, background },
      onFrame: ({ fps }) => setFps(fps),
    });

    rendererRef.current = renderer;

    return () => {
      renderer.destroy();
      rendererRef.current = null;
    };
  }, [isInteractive, isTransparent]);

  // Synchronize dynamic state
  useEffect(() => {
    if (rendererRef.current) {
      rendererRef.current.setState(state);
    }
  }, [state]);

  // Synchronize speed
  useEffect(() => {
    if (rendererRef.current) {
      rendererRef.current.setSpeed(speed);
    }
  }, [speed]);

  // Synchronize particleCount
  useEffect(() => {
    if (rendererRef.current) {
      rendererRef.current.setParticleCount(particleCount);
    }
  }, [particleCount]);

  // Synchronize theme
  useEffect(() => {
    if (rendererRef.current) {
      rendererRef.current.setTheme({ foreground, accent, background });
    }
  }, [foreground, accent, background]);

  // Reset to default presets
  const handleResetDefaults = () => {
    const defaultMeta = ORB_STATES_METADATA[state];
    setParticleCount(defaultMeta.defaultParticles);
    setSpeed(defaultMeta.defaultSpeed);
    setRadius(140);
    setDotSize(2.0);
    setForeground(ORB_TOKENS.foreground);
    setAccent(ORB_TOKENS.accent);
    setBackground(ORB_TOKENS.background);
  };

  const handleStateSelect = (newState: OrbState) => {
    setState(newState);
    const newMeta = ORB_STATES_METADATA[newState];
    setParticleCount(newMeta.defaultParticles);
    setSpeed(newMeta.defaultSpeed);
  };

  const togglePlay = () => {
    if (!rendererRef.current) return;
    if (isPlaying) {
      rendererRef.current.pause();
      setIsPlaying(false);
    } else {
      rendererRef.current.resume();
      setIsPlaying(true);
    }
  };

  const handleCopyTSX = () => {
    const snippet = `<AgentOrb
  state="${state}"
  size={${radius * 2}}
  speed={${speed.toFixed(2)}}
  particleCount={${particleCount}}
  interactive={${isInteractive}}
  transparent={${isTransparent}}
/>`;
    navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);

    onExportConfig?.({
      state,
      size: radius * 2,
      speed,
      particleCount,
      dotSize,
      isInteractive,
      isTransparent,
      theme: { foreground, accent, background },
    });
  };

  const allStates: OrbState[] = [
    'solving',
    'thinking',
    'listening',
    'working',
    'searching',
    'streaming',
    'idle',
    'error',
  ];

  return (
    <section id="studio" className="py-20 border-t border-[#37393E]/60 bg-[#040404]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0A0A0C] border border-[#37393E] text-white/80 text-xs font-mono tracking-wide mb-4">
            <Sliders className="w-3.5 h-3.5 text-white/60" />
            <span>INTERACTIVE STUDIO BENCH</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-4">
            Real-Time Kinetic Parameter Studio
          </h2>

          <p className="text-base text-white/60 font-sans">
            Fine-tune mathematical density, rotation harmonics, radius bounds, and shader falloffs
            with instant 60/120fps canvas rendering.
          </p>
        </div>

        {/* Workbench Layout: Canvas on Left, Controls on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Interactive Canvas Preview Display (7 Cols) */}
          <div className="lg:col-span-7 bg-[#070709] border border-[#37393E] rounded-3xl p-6 sm:p-8 flex flex-col items-center shadow-xl relative overflow-hidden">
            {/* Top Toolbar */}
            <div className="w-full flex items-center justify-between pb-4 border-b border-[#37393E]/50 mb-6">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-mono font-medium uppercase text-white/80 tracking-wider">
                  Live Viewport • {fps} FPS
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={togglePlay}
                  className="p-1.5 rounded-lg bg-[#0A0A0C] border border-[#37393E] hover:border-white text-white/70 hover:text-white transition-colors"
                  title={isPlaying ? 'Pause simulation' : 'Play simulation'}
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={handleResetDefaults}
                  className="p-1.5 rounded-lg bg-[#0A0A0C] border border-[#37393E] hover:border-white text-white/70 hover:text-white transition-colors"
                  title="Reset sliders to preset defaults"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Central Canvas Ring */}
            <div
              className={`relative w-[300px] h-[300px] sm:w-[380px] sm:h-[380px] rounded-full border border-[#37393E]/50 flex items-center justify-center transition-all ${
                isTransparent ? 'bg-transparent' : 'bg-[#040404]'
              }`}
            >
              {/* Radial backdrop */}
              <div className="absolute inset-4 rounded-full border border-dashed border-white/10 pointer-events-none" />

              <canvas
                ref={canvasRef}
                className="w-full h-full block cursor-grab active:cursor-grabbing touch-none"
              />
            </div>

            {/* Bottom Status bar */}
            <div className="w-full mt-6 pt-4 border-t border-[#37393E]/50 flex flex-wrap items-center justify-between text-xs font-mono text-white/50 gap-2">
              <div className="flex items-center gap-3">
                <span>STATE: <span className="text-white uppercase">{state}</span></span>
                <span>PARTICLES: <span className="text-white">{particleCount}</span></span>
              </div>
              <div>
                <span>DRAG: <span className="text-emerald-400">{isInteractive ? 'ENABLED' : 'LOCKED'}</span></span>
              </div>
            </div>
          </div>

          {/* Right: Parameter Controls & Sliders (5 Cols) */}
          <div className="lg:col-span-5 bg-[#070709] border border-[#37393E] rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col gap-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">Orb Controls</h3>
              <p className="text-xs text-white/50 font-mono">{meta.mathModel}</p>
            </div>

            {/* Preset Selector Chips */}
            <div>
              <label className="text-xs font-mono uppercase text-white/60 mb-2.5 block">
                Kinetic State Preset
              </label>
              <div className="grid grid-cols-4 gap-1.5 font-mono text-[11px]">
                {allStates.map((st) => (
                  <button
                    key={st}
                    onClick={() => handleStateSelect(st)}
                    className={`py-1.5 px-2 rounded-lg text-center transition-all capitalize ${
                      state === st
                        ? 'bg-white text-black font-semibold shadow-sm'
                        : 'bg-[#0A0A0C] text-white/70 hover:text-white border border-[#37393E]'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Sliders */}
            <div className="space-y-4 pt-2 border-t border-[#37393E]/50">
              {/* Slider 1: Particle Count */}
              <div>
                <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                  <span className="text-white/70">Particle Density (N)</span>
                  <span className="text-white font-semibold">{particleCount} pts</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="1000"
                  step="10"
                  value={particleCount}
                  onChange={(e) => setParticleCount(Number(e.target.value))}
                  className="w-full accent-white bg-[#141418] h-1.5 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-white/30 mt-1">
                  <span>50 pts</span>
                  <span>1000 pts</span>
                </div>
              </div>

              {/* Slider 2: Rotation Speed */}
              <div>
                <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                  <span className="text-white/70">Rotation Speed Multiplier</span>
                  <span className="text-white font-semibold">{speed.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="3.0"
                  step="0.05"
                  value={speed}
                  onChange={(e) => setSpeed(Number(e.target.value))}
                  className="w-full accent-white bg-[#141418] h-1.5 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-white/30 mt-1">
                  <span>0.10x</span>
                  <span>3.00x</span>
                </div>
              </div>

              {/* Slider 3: Sphere Radius */}
              <div>
                <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                  <span className="text-white/70">Sphere Radius Bound</span>
                  <span className="text-white font-semibold">{radius} px</span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="220"
                  step="5"
                  value={radius}
                  onChange={(e) => setRadius(Number(e.target.value))}
                  className="w-full accent-white bg-[#141418] h-1.5 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-white/30 mt-1">
                  <span>60 px</span>
                  <span>220 px</span>
                </div>
              </div>

              {/* Slider 4: Dot / Particle Size */}
              <div>
                <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                  <span className="text-white/70">Point Base Size</span>
                  <span className="text-white font-semibold">{dotSize.toFixed(1)} px</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="4.0"
                  step="0.1"
                  value={dotSize}
                  onChange={(e) => setDotSize(Number(e.target.value))}
                  className="w-full accent-white bg-[#141418] h-1.5 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-white/30 mt-1">
                  <span>0.5 px</span>
                  <span>4.0 px</span>
                </div>
              </div>
            </div>

            {/* Toggles */}
            <div className="pt-2 border-t border-[#37393E]/50 space-y-2">
              <label className="flex items-center justify-between text-xs font-mono cursor-pointer py-1">
                <span className="text-white/70">Pointer Drag Interactivity</span>
                <input
                  type="checkbox"
                  checked={isInteractive}
                  onChange={(e) => setIsInteractive(e.target.checked)}
                  className="rounded bg-[#141418] border-[#37393E] text-white focus:ring-0 w-4 h-4 accent-white"
                />
              </label>

              <label className="flex items-center justify-between text-xs font-mono cursor-pointer py-1">
                <span className="text-white/70">Transparent Canvas Background</span>
                <input
                  type="checkbox"
                  checked={isTransparent}
                  onChange={(e) => setIsTransparent(e.target.checked)}
                  className="rounded bg-[#141418] border-[#37393E] text-white focus:ring-0 w-4 h-4 accent-white"
                />
              </label>
            </div>

            {/* Quick Export Button */}
            <div className="pt-4 border-t border-[#37393E]/50">
              <button
                onClick={handleCopyTSX}
                className="w-full py-3 px-4 rounded-xl bg-white text-black hover:bg-white/90 font-medium text-xs flex items-center justify-center gap-2 transition-all shadow-md"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Configuration Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Configured Component (TSX)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
