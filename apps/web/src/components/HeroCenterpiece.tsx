import React, { useState } from 'react';
import { AgentOrb, AgentPill } from '@agent-orbs/react';
import { Terminal, Copy, Check } from 'lucide-react';
import { ColorPreset, HERO_COLORS } from '../types';

interface HeroCenterpieceProps {
  onOpenStudio?: () => void;
}

export const HeroCenterpiece: React.FC<HeroCenterpieceProps> = () => {
  const [selectedColor, setSelectedColor] = useState<ColorPreset>(HERO_COLORS[0]);
  const [copied, setCopied] = useState(false);

  const handleCopyInstall = () => {
    navigator.clipboard.writeText('pnpm add @agent-orbs/react @agent-orbs/core');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative w-full min-h-[calc(100vh-3.5rem)] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden py-12 select-none">
      {/* Subtle radial ambient spotlight matching selected palette */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[520px] opacity-[0.04] rounded-full blur-3xl pointer-events-none transition-colors duration-700"
        style={{
          background: `radial-gradient(circle, ${selectedColor.hex} 0%, transparent 70%)`,
        }}
      />

      {/* =========================================================================
          DISTRIBUTED KINETIC CONSTELLATION (Wide gap, Big sizes, NO floating bobbing)
          Anchored gracefully across the screen: Left, Bottom, Right
          ========================================================================= */}
      <div className="absolute inset-0 pointer-events-none w-full h-full overflow-hidden hidden xl:block">
        
        {/* 1. TOP-LEFT: Thinking Pill */}
        <div className="absolute top-[14%] left-[4%] 2xl:left-[7%] pointer-events-auto transition-transform duration-300 hover:scale-105">
          <AgentPill
            state="thinking"
            size="md"
            theme={selectedColor.theme}
            interactiveOrb
          />
        </div>

        {/* 2. MID-LEFT: Big Solving Still Shape Metamorphosis (140px, Pure Canvas, No Border Box) */}
        <div className="absolute top-[48%] -translate-y-1/2 left-[3%] 2xl:left-[6%] pointer-events-auto cursor-grab active:cursor-grabbing transition-transform duration-300 hover:scale-105">
          <AgentOrb
            state="solving"
            size={140}
            theme={selectedColor.theme}
            interactive
            transparent
          />
        </div>

        {/* 3. BOTTOM-LEFT: Listening Pill */}
        <div className="absolute bottom-[14%] left-[5%] 2xl:left-[8%] pointer-events-auto transition-transform duration-300 hover:scale-105">
          <AgentPill
            state="listening"
            size="md"
            theme={selectedColor.theme}
            interactiveOrb
          />
        </div>

        {/* 4. BOTTOM-CENTER-LEFT: Weaving Context Pill */}
        <div className="absolute bottom-[5%] left-[24%] 2xl:left-[27%] pointer-events-auto transition-transform duration-300 hover:scale-105">
          <AgentPill
            state="weaving"
            size="sm"
            theme={selectedColor.theme}
            interactiveOrb
          />
        </div>

        {/* 5. BOTTOM-CENTER-RIGHT: Diffusion Image Pill */}
        <div className="absolute bottom-[5%] right-[24%] 2xl:right-[27%] pointer-events-auto transition-transform duration-300 hover:scale-105">
          <AgentPill
            state="diffusion"
            size="sm"
            theme={selectedColor.theme}
            interactiveOrb
          />
        </div>

        {/* 6. TOP-RIGHT: Searching Radar Pill */}
        <div className="absolute top-[14%] right-[4%] 2xl:right-[7%] pointer-events-auto transition-transform duration-300 hover:scale-105">
          <AgentPill
            state="searching"
            size="md"
            theme={selectedColor.theme}
            interactiveOrb
          />
        </div>

        {/* 7. MID-RIGHT: Big Working Tool Nexus (140px, Pure Canvas, No Border Box) */}
        <div className="absolute top-[48%] -translate-y-1/2 right-[3%] 2xl:right-[6%] pointer-events-auto cursor-grab active:cursor-grabbing transition-transform duration-300 hover:scale-105">
          <AgentOrb
            state="working"
            size={140}
            theme={selectedColor.theme}
            interactive
            transparent
          />
        </div>

        {/* 8. BOTTOM-RIGHT: Streaming Token Pill */}
        <div className="absolute bottom-[14%] right-[5%] 2xl:right-[8%] pointer-events-auto transition-transform duration-300 hover:scale-105">
          <AgentPill
            state="streaming"
            size="md"
            theme={selectedColor.theme}
            interactiveOrb
          />
        </div>
      </div>

      {/* =========================================================================
          CENTER HERO CONTENT: Clean, Big Bold Title, Short Paragraph, CLI Pill
          ========================================================================= */}
      <div className="max-w-3xl mx-auto text-center relative z-20 flex flex-col items-center">
        
        {/* Big Bold Clean Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white mb-5 leading-[1.08]">
          Turn boring loaders into{' '}
          <span className="text-white/95 underline decoration-white/20 decoration-2 underline-offset-8">
            kinetic AI orbs.
          </span>
        </h1>

        {/* Short, Small Crisp Paragraph */}
        <p className="text-sm sm:text-base text-white/50 max-w-md mx-auto mb-8 font-sans">
          Mathematical 3D particle spheres for modern AI agents. Zero WebGL overhead, 120 FPS.
        </p>

        {/* Clean Install Command Snippet on its own line: Pure Neutral Dark */}
        <div className="mb-6">
          <button
            onClick={handleCopyInstall}
            className="group flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-[#080808] border border-[#1A1A1A] hover:border-white/40 text-xs font-mono text-white/80 hover:text-white transition-all shadow-md active:scale-95"
            title="Click to copy install command"
          >
            <Terminal className="w-3.5 h-3.5 text-white/40 group-hover:text-white transition-colors" />
            <span className="text-white/40 font-normal">pnpm add</span>
            <span className="text-white font-medium">@agent-orbs/react</span>
            <span className="w-3.5 h-3.5 flex items-center justify-center ml-1">
              {copied ? (
                <Check className="w-3 h-3 text-emerald-400" />
              ) : (
                <Copy className="w-3 h-3 text-white/40 group-hover:text-white" />
              )}
            </span>
          </button>
        </div>

        {/* Minimalist Color Palette Chips: Pure Neutral Dark */}
        <div className="flex items-center gap-2 p-1.5 rounded-full bg-[#080808] border border-[#1A1A1A]">
          <span className="text-[10px] font-mono text-white/40 px-2 uppercase tracking-wider">
            Palette:
          </span>
          <div className="flex items-center gap-1.5">
            {HERO_COLORS.map((c) => {
              const isActive = selectedColor.id === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedColor(c)}
                  className={`w-3.5 h-3.5 rounded-full transition-transform ${
                    isActive ? 'scale-125 ring-2 ring-white/50 ring-offset-2 ring-offset-[#040404]' : 'hover:scale-110 opacity-70 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
