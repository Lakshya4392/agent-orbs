import React, { useState } from 'react';
import { OrbState } from '@agent-orbs/core';
import { AgentPill, AgentPillSize, AgentOrb } from '@agent-orbs/react';
import { ORB_STATES_METADATA, HERO_COLORS, ColorPreset } from '../types';
import {
  Copy,
  Check,
  Play,
  Pause,
  Terminal,
  RotateCw,
  Sparkles,
} from 'lucide-react';

interface BigStudioCardProps {
  selectedState: OrbState;
  onStateChange: (state: OrbState) => void;
}

export const BigStudioCard: React.FC<BigStudioCardProps> = ({
  selectedState,
  onStateChange,
}) => {
  const [viewMode, setViewMode] = useState<'pill' | 'orb'>('orb');
  const [pillSize, setPillSize] = useState<AgentPillSize>('md');
  const [orbDiameter, setOrbDiameter] = useState<number>(180);
  const [speed, setSpeed] = useState<number>(1.0);
  const [particleDensity, setParticleDensity] = useState<'light' | 'medium' | 'dense'>('medium');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [selectedColor, setSelectedColor] = useState<ColorPreset>(HERO_COLORS[0]);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [copiedCli, setCopiedCli] = useState<boolean>(false);

  const allStates: OrbState[] = [
    'solving',
    'thinking',
    'listening',
    'working',
    'searching',
    'streaming',
    'weaving',
    'diffusion',
    'idle',
    'error',
  ];

  const pillParticleMap = {
    light: 36,
    medium: 52,
    dense: 72,
  };

  const orbParticleMap = {
    light: 90,
    medium: 180,
    dense: 280,
  };

  const currentParticleCount =
    viewMode === 'pill'
      ? pillParticleMap[particleDensity]
      : orbParticleMap[particleDensity];

  // Clean snippet generator for clipboard copy (without displaying huge code box)
  const getComponentCode = () => {
    if (viewMode === 'pill') {
      return `<AgentPill state="${selectedState}" size="${pillSize}" speed={${speed}} interactiveOrb />`;
    }
    return `<AgentOrb state="${selectedState}" size={${orbDiameter}} speed={${speed}} interactive transparent />`;
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(getComponentCode());
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyCli = () => {
    navigator.clipboard.writeText(`npx agent-orbs add ${selectedState}`);
    setCopiedCli(true);
    setTimeout(() => setCopiedCli(false), 2000);
  };

  const currentMeta = ORB_STATES_METADATA[selectedState] || ORB_STATES_METADATA.solving;

  return (
    <div className="w-full rounded-3xl bg-[#060606] border border-[#161616] shadow-2xl overflow-hidden relative flex flex-col">
      
      {/* =========================================================================
          WORKBENCH BODY: 3-Column Studio Layout
          Left: State Selector Sidebar | Center: Big Canvas Stage | Right: Parameters
          ========================================================================= */}
      <div className="flex flex-col lg:flex-row min-h-[580px]">
        
        {/* =======================================================================
            1. LEFT SIDEBAR: Select Orb State (Full List with Live Indicators)
            ======================================================================= */}
        <aside className="w-full lg:w-64 shrink-0 border-b lg:border-b-0 lg:border-r border-[#161616] bg-[#080808] p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4 px-2">
              <Sparkles className="w-3.5 h-3.5 text-white/50" />
              <span className="text-xs font-mono uppercase tracking-wider text-white/50">
                Select Orb
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-1 gap-1.5">
              {allStates.map((st) => {
                const isSelected = selectedState === st;
                const meta = ORB_STATES_METADATA[st];

                return (
                  <button
                    key={st}
                    onClick={() => onStateChange(st)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-mono transition-all text-left ${
                      isSelected
                        ? 'bg-white text-black font-semibold shadow-md'
                        : 'text-white/60 hover:text-white hover:bg-[#121212]'
                    }`}
                  >
                    <span>{meta.label}</span>
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isSelected ? 'bg-black' : 'bg-white/20'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick info note */}
          <div className="hidden lg:block pt-6 border-t border-[#141414] mt-6 px-2 text-[11px] font-mono text-white/30">
            <span>High-DPI Canvas 2D</span>
            <br />
            <span>Zero WebGL Overhead</span>
          </div>
        </aside>

        {/* =======================================================================
            2. CENTER MAIN STAGE: Big Live Kinetic Canvas (NO Giant Code Box!)
            ======================================================================= */}
        <main className="flex-1 flex flex-col items-center justify-between p-6 sm:p-10 relative bg-[#040404] min-h-[440px] sm:min-h-[520px]">
          
          {/* Top Stage Bar: Meta & Performance indicator */}
          <div className="w-full flex items-center justify-between text-xs font-mono text-white/40 mb-4 z-10">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-white/80 font-semibold uppercase">{currentMeta.label}</span>
              <span>•</span>
              <span className="hidden sm:inline text-white/40">{currentMeta.mathModel}</span>
            </div>

            <div className="flex items-center gap-2">
              <span>120 FPS</span>
            </div>
          </div>

          {/* Ambient Spotlight behind the Center Orb */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[340px] opacity-[0.06] rounded-full blur-3xl pointer-events-none transition-colors duration-700"
            style={{
              background: `radial-gradient(circle, ${selectedColor.hex} 0%, transparent 70%)`,
            }}
          />

          {/* Centerpiece Display: Authentic Pill or Big 3D Kinetic Orb */}
          <div className="my-auto py-8 sm:py-12 flex flex-col items-center justify-center relative z-10">
            {viewMode === 'pill' ? (
              <div className="transform transition-transform hover:scale-105 duration-300">
                <AgentPill
                  state={selectedState}
                  size={pillSize}
                  speed={isPlaying ? speed : 0.0001}
                  particleCount={currentParticleCount}
                  theme={selectedColor.theme}
                  interactiveOrb
                  className="shadow-2xl"
                />
              </div>
            ) : (
              <div className="cursor-grab active:cursor-grabbing transform transition-transform hover:scale-105 duration-300">
                <AgentOrb
                  state={selectedState}
                  size={orbDiameter}
                  speed={isPlaying ? speed : 0.0001}
                  particleCount={currentParticleCount}
                  theme={selectedColor.theme}
                  interactive
                  transparent
                />
              </div>
            )}

            {/* Subtle Drag hint when in Orb mode */}
            {viewMode === 'orb' && (
              <span className="text-[11px] font-mono text-white/30 mt-4 flex items-center gap-1.5">
                <RotateCw className="w-3 h-3 text-white/30" />
                <span>Drag orb to interact with 3D projection</span>
              </span>
            )}
          </div>

          {/* ===================================================================
              CENTER BOTTOM ACTIONS: Clean CLI Pill + Copy Code (NO CODE BLOCK CLUTTER!)
              =================================================================== */}
          <div className="w-full flex flex-wrap items-center justify-center gap-3 pt-6 border-t border-[#121212] z-10">
            {/* CLI Command Pill */}
            <button
              onClick={handleCopyCli}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#090909] border border-[#1A1A1A] hover:border-white/40 text-xs font-mono text-white/80 hover:text-white transition-all shadow-sm active:scale-95"
              title="Copy CLI install command"
            >
              <Terminal className="w-3.5 h-3.5 text-white/40" />
              <span className="text-white/40">npx agent-orbs add</span>
              <span className="text-white font-semibold">{selectedState}</span>
              <span className="w-3.5 h-3.5 flex items-center justify-center ml-1">
                {copiedCli ? (
                  <Check className="w-3 h-3 text-emerald-400" />
                ) : (
                  <Copy className="w-3 h-3 text-white/40" />
                )}
              </span>
            </button>

            {/* Quick Copy React Component Button */}
            <button
              onClick={handleCopyCode}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white text-black hover:bg-white/90 text-xs font-semibold shadow-md transition-all active:scale-95"
              title="Copy JSX Component Snippet"
            >
              {copiedCode ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Copied JSX to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-black" />
                  <span>Copy React JSX</span>
                </>
              )}
            </button>
          </div>
        </main>

        {/* =======================================================================
            3. RIGHT SIDEBAR: Parameters & Customization Controls
            ======================================================================= */}
        <aside className="w-full lg:w-72 shrink-0 border-t lg:border-t-0 lg:border-l border-[#161616] bg-[#080808] p-5 sm:p-6 flex flex-col gap-6">
          
          {/* Section: View Mode */}
          <div>
            <span className="block text-[11px] font-mono text-white/40 uppercase tracking-wider mb-2.5">
              Display Mode
            </span>
            <div className="grid grid-cols-2 gap-1 bg-[#101010] p-1 rounded-xl border border-[#1C1C1C]">
              <button
                onClick={() => setViewMode('pill')}
                className={`py-1.5 rounded-lg text-xs font-medium transition-all ${
                  viewMode === 'pill'
                    ? 'bg-white text-black font-semibold shadow-sm'
                    : 'text-white/50 hover:text-white'
                }`}
              >
                Pill Badge
              </button>
              <button
                onClick={() => setViewMode('orb')}
                className={`py-1.5 rounded-lg text-xs font-medium transition-all ${
                  viewMode === 'orb'
                    ? 'bg-white text-black font-semibold shadow-sm'
                    : 'text-white/50 hover:text-white'
                }`}
              >
                Large 3D Orb
              </button>
            </div>
          </div>

          {/* Section: Sizing / Diameter */}
          <div>
            <span className="block text-[11px] font-mono text-white/40 uppercase tracking-wider mb-2.5">
              {viewMode === 'pill' ? 'Pill Size' : 'Orb Diameter'}
            </span>
            {viewMode === 'pill' ? (
              <div className="grid grid-cols-3 gap-1 bg-[#101010] p-1 rounded-xl border border-[#1C1C1C]">
                {(['sm', 'md', 'lg'] as const).map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setPillSize(sz)}
                    className={`py-1.5 rounded-lg text-xs font-mono uppercase transition-all ${
                      pillSize === sz
                        ? 'bg-white text-black font-semibold shadow-sm'
                        : 'text-white/50 hover:text-white'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-1 bg-[#101010] p-1 rounded-xl border border-[#1C1C1C]">
                {[140, 180, 220].map((d) => (
                  <button
                    key={d}
                    onClick={() => setOrbDiameter(d)}
                    className={`py-1.5 rounded-lg text-xs font-mono transition-all ${
                      orbDiameter === d
                        ? 'bg-white text-black font-semibold shadow-sm'
                        : 'text-white/50 hover:text-white'
                    }`}
                  >
                    {d}px
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Section: Animation Speed */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono text-white/40 uppercase tracking-wider">
                Velocity Speed
              </span>
              <span className="text-xs font-mono text-white/70">{speed}x</span>
            </div>
            <div className="grid grid-cols-4 gap-1 bg-[#101010] p-1 rounded-xl border border-[#1C1C1C]">
              {[0.5, 1.0, 1.5, 2.0].map((s) => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  className={`py-1 rounded-lg text-xs font-mono transition-all ${
                    speed === s
                      ? 'bg-white text-black font-semibold shadow-sm'
                      : 'text-white/50 hover:text-white'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>

          {/* Section: Particle Density */}
          <div>
            <span className="block text-[11px] font-mono text-white/40 uppercase tracking-wider mb-2.5">
              Particle Density
            </span>
            <div className="grid grid-cols-3 gap-1 bg-[#101010] p-1 rounded-xl border border-[#1C1C1C]">
              {(['light', 'medium', 'dense'] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => setParticleDensity(d)}
                  className={`py-1.5 rounded-lg text-xs capitalize transition-all ${
                    particleDensity === d
                      ? 'bg-white text-black font-semibold shadow-sm'
                      : 'text-white/50 hover:text-white'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Section: Color Palette */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[11px] font-mono text-white/40 uppercase tracking-wider">
                Theme Palette
              </span>
              <span className="text-[11px] font-mono text-white/60">{selectedColor.name}</span>
            </div>
            <div className="grid grid-cols-6 gap-2 bg-[#101010] p-2 rounded-xl border border-[#1C1C1C]">
              {HERO_COLORS.map((c) => {
                const isActive = selectedColor.id === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedColor(c)}
                    className={`w-full aspect-square rounded-full transition-transform ${
                      isActive
                        ? 'scale-125 ring-2 ring-white/70 ring-offset-2 ring-offset-[#080808]'
                        : 'opacity-60 hover:opacity-100 hover:scale-110'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  />
                );
              })}
            </div>
          </div>

          {/* Play/Pause Button */}
          <div className="pt-2 mt-auto">
            <button
              onClick={() => setIsPlaying((p) => !p)}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#121212] hover:bg-[#1A1A1A] border border-[#222222] text-xs font-mono text-white transition-all shadow-sm active:scale-98"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 text-white/60" />
                  <span>Pause Render Loop</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Resume Render Loop</span>
                </>
              )}
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};
