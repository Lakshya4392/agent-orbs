import React, { useEffect, useRef, useState } from 'react';
import { createOrbRenderer, OrbRenderer, OrbState } from '@agent-orbs/core';
import { ORB_STATES_METADATA } from '../types';
import { Sliders, Play, Pause, Zap } from 'lucide-react';

interface HeroOrbProps {
  onOpenStudio?: (state: OrbState) => void;
  onOpenExporters?: (state: OrbState) => void;
}

export const HeroOrb: React.FC<HeroOrbProps> = ({ onOpenStudio, onOpenExporters }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rendererRef = useRef<OrbRenderer | null>(null);

  const [activeState, setActiveState] = useState<OrbState>('solving');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [fps, setFps] = useState<number>(60);
  const [speed, setSpeed] = useState<number>(1.0);
  const [particleCount, setParticleCount] = useState<number>(420);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const metadata = ORB_STATES_METADATA[activeState];

  useEffect(() => {
    if (!canvasRef.current) return;

    const renderer = createOrbRenderer(canvasRef.current, {
      state: activeState,
      size: 420,
      speed: speed,
      particleCount: particleCount,
      interactive: true,
      transparent: true,
      onFrame: ({ fps }) => {
        setFps(fps);
      },
    });

    rendererRef.current = renderer;

    return () => {
      renderer.destroy();
      rendererRef.current = null;
    };
  }, []);

  // Update state when activeState changes
  useEffect(() => {
    if (rendererRef.current) {
      rendererRef.current.setState(activeState);
      const meta = ORB_STATES_METADATA[activeState];
      setParticleCount(meta.defaultParticles);
      setSpeed(meta.defaultSpeed);
      rendererRef.current.setParticleCount(meta.defaultParticles);
      rendererRef.current.setSpeed(meta.defaultSpeed);
    }
  }, [activeState]);

  const handleStateChange = (state: OrbState) => {
    setActiveState(state);
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

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left - rect.width / 2);
    const y = Math.round(e.clientY - rect.top - rect.height / 2);
    setMousePos({ x, y });
  };

  const primaryStates: OrbState[] = ['solving', 'thinking', 'listening', 'working', 'searching'];
  const secondaryStates: OrbState[] = ['streaming', 'idle', 'error'];

  return (
    <section id="hero" className="relative pt-12 pb-24 overflow-hidden">
      {/* Background radial gradient spotlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-white/[0.02] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Title Section */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0A0A0C] border border-[#37393E] text-white/80 text-xs font-mono tracking-wide mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>ZERO-DEPENDENCY HIGH-DPI CANVAS 2D • &lt;4KB</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white mb-6">
            Mathematical kinetic loaders for{' '}
            <span className="bg-gradient-to-r from-white via-white/90 to-white/60 bg-clip-text text-transparent">
              AI agents
            </span>
          </h1>

          <p className="text-base sm:text-lg text-white/60 leading-relaxed font-sans">
            Lightweight 3D projection point clouds and spherical wave lattices.
            Calibrated specifically for agent reasoning, tool execution, and voice streams.
          </p>
        </div>

        {/* Centered Large Interactive Hero Orb Showcase */}
        <div
          className="relative max-w-2xl mx-auto flex flex-col items-center"
          onMouseMove={handleMouseMove}
        >
          {/* Circular HUD Frame Ring */}
          <div className="relative w-[340px] h-[340px] sm:w-[420px] sm:h-[420px] rounded-full border border-[#37393E]/60 p-2 sm:p-4 flex items-center justify-center glow-subtle">
            {/* Outer concentric dashed ring */}
            <div className="absolute inset-0 rounded-full border border-dashed border-[#37393E]/40 pointer-events-none animate-spin" style={{ animationDuration: '60s' }} />

            {/* Micro Degree Markers */}
            <span className="absolute top-2 text-[9px] font-mono text-white/30 uppercase tracking-widest pointer-events-none">000° N</span>
            <span className="absolute bottom-2 text-[9px] font-mono text-white/30 uppercase tracking-widest pointer-events-none">180° S</span>
            <span className="absolute left-2 text-[9px] font-mono text-white/30 uppercase tracking-widest pointer-events-none">270° W</span>
            <span className="absolute right-2 text-[9px] font-mono text-white/30 uppercase tracking-widest pointer-events-none">090° E</span>

            {/* Inner canvas container */}
            <div className="relative w-full h-full rounded-full overflow-hidden flex items-center justify-center bg-[#040404]/80 backdrop-blur-sm cursor-grab active:cursor-grabbing">
              <canvas
                ref={canvasRef}
                className="w-full h-full block touch-none"
              />

              {/* Central crosshair guides */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-10">
                <div className="w-16 h-px bg-white" />
                <div className="h-16 w-px bg-white absolute" />
              </div>
            </div>

            {/* Play/Pause Control overlay */}
            <button
              onClick={togglePlay}
              className="absolute bottom-4 right-4 z-10 w-8 h-8 rounded-full bg-[#0A0A0C]/90 border border-[#37393E] hover:border-white text-white/80 hover:text-white flex items-center justify-center transition-all shadow-md focus:outline-none"
              title={isPlaying ? 'Pause kinetic animation' : 'Resume animation'}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 translate-x-0.5" />}
            </button>
          </div>

          {/* Real-time Telemetry HUD readout bar */}
          <div className="w-full max-w-lg mt-6 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center font-mono">
            <div className="px-3 py-2 rounded-lg bg-[#0A0A0C] border border-[#37393E]/60">
              <div className="text-[10px] text-white/40 uppercase">State</div>
              <div className="text-xs font-semibold text-white tracking-wide uppercase mt-0.5">{metadata.label}</div>
            </div>
            <div className="px-3 py-2 rounded-lg bg-[#0A0A0C] border border-[#37393E]/60">
              <div className="text-[10px] text-white/40 uppercase">Performance</div>
              <div className="text-xs font-semibold text-emerald-400 mt-0.5">{fps} FPS</div>
            </div>
            <div className="px-3 py-2 rounded-lg bg-[#0A0A0C] border border-[#37393E]/60">
              <div className="text-[10px] text-white/40 uppercase">Particles</div>
              <div className="text-xs font-semibold text-white/90 mt-0.5">{particleCount} pts</div>
            </div>
            <div className="px-3 py-2 rounded-lg bg-[#0A0A0C] border border-[#37393E]/60">
              <div className="text-[10px] text-white/40 uppercase">Delta (X, Y)</div>
              <div className="text-xs font-semibold text-white/70 mt-0.5">{mousePos.x}, {mousePos.y}</div>
            </div>
          </div>

          {/* Math Algorithm Readout Banner */}
          <div className="mt-4 px-4 py-1.5 rounded-full bg-[#0A0A0C]/80 border border-[#37393E]/40 text-center">
            <span className="text-[11px] font-mono text-white/60">
              <span className="text-white/30 mr-1.5">ALGO:</span>
              {metadata.mathModel}
            </span>
          </div>

          {/* Interactive State Selector Pills (Requirement: Reacting to click & displaying status pills) */}
          <div className="mt-8 w-full">
            <div className="text-center mb-3">
              <span className="text-[11px] uppercase tracking-wider font-mono text-white/40">
                Select Agent Reasoning State:
              </span>
            </div>

            {/* Primary 5 Reference States */}
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              {primaryStates.map((st) => {
                const meta = ORB_STATES_METADATA[st];
                const isSelected = activeState === st;
                return (
                  <button
                    key={st}
                    onClick={() => handleStateChange(st)}
                    className={`group relative flex items-center gap-2.5 px-4 py-2 rounded-full font-mono text-xs transition-all ${
                      isSelected
                        ? 'bg-[#141418] text-white border border-white/60 shadow-lg glow-pill ring-1 ring-white/20'
                        : 'bg-[#0A0A0C] text-white/70 hover:text-white border border-[#37393E] hover:border-white/40'
                    }`}
                  >
                    {/* Embedded micro orb indicator */}
                    <span
                      className={`w-2.5 h-2.5 rounded-full transition-transform ${
                        isSelected ? 'bg-white scale-110 shadow-[0_0_8px_rgba(255,255,255,0.8)]' : 'bg-[#37393E] group-hover:bg-white/60'
                      }`}
                    />
                    <span className="font-medium tracking-tight">{meta.pillLabel}</span>
                  </button>
                );
              })}
            </div>

            {/* Secondary Extended States */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-2.5">
              {secondaryStates.map((st) => {
                const meta = ORB_STATES_METADATA[st];
                const isSelected = activeState === st;
                return (
                  <button
                    key={st}
                    onClick={() => handleStateChange(st)}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-mono text-[11px] transition-all ${
                      isSelected
                        ? 'bg-[#1A1A1A] text-white border border-white/40'
                        : 'bg-[#0A0A0C]/60 text-white/50 hover:text-white/80 border border-[#37393E]/40 hover:border-[#37393E]'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-white/30'}`} />
                    <span>{meta.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick CTA Actions */}
          <div className="mt-8 flex items-center justify-center gap-3">
            <button
              onClick={() => onOpenStudio?.(activeState)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black hover:bg-white/90 text-xs font-semibold tracking-tight transition-all shadow-md"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Customize in Studio</span>
            </button>
            <button
              onClick={() => onOpenExporters?.(activeState)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0A0A0C] border border-[#37393E] hover:border-white/40 text-white text-xs font-medium transition-all"
            >
              <Zap className="w-3.5 h-3.5 text-white/70" />
              <span>Copy Component Code</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
