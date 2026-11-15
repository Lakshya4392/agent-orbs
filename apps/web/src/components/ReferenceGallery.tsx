import React, { useState } from 'react';
import { AgentPill, OrbState } from '@agent-orbs/react';
import { ORB_STATES_METADATA } from '../types';
import { Copy, Check, ExternalLink } from 'lucide-react';

interface ReferenceGalleryProps {
  onSelectState?: (state: OrbState) => void;
}

export const ReferenceGallery: React.FC<ReferenceGalleryProps> = ({ onSelectState }) => {
  const [copiedState, setCopiedState] = useState<string | null>(null);

  const referenceStates: OrbState[] = [
    'solving',
    'thinking',
    'listening',
    'working',
    'searching',
    'streaming',
    'weaving',
    'diffusion',
  ];

  const handleCopyCode = (st: OrbState, e: React.MouseEvent) => {
    e.stopPropagation();
    const code = `<AgentPill state="${st}" size="md" interactiveOrb />`;
    navigator.clipboard.writeText(code);
    setCopiedState(st);
    setTimeout(() => setCopiedState(null), 2000);
  };

  return (
    <section id="gallery" className="py-24 md:py-32 border-t border-[#141414] bg-[#040404]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header: Pure Monochrome, No Slop Badges */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-3">
            Pure Monochrome Pill Cards
          </h2>
          <p className="text-sm sm:text-base text-white/50">
            Click any card to inspect in the studio, tune physics parameters, or copy code.
          </p>
        </div>

        {/* Spacious 2-Column Grid: Pure Deep Black (#080808 / #171717) - Zero Blue/Gray Tint */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {referenceStates.map((state) => {
            const meta = ORB_STATES_METADATA[state];
            const isCopied = copiedState === state;

            return (
              <div
                key={state}
                onClick={() => onSelectState?.(state)}
                className="group relative rounded-3xl bg-[#080808] border border-[#171717] hover:border-[#2A2A2A] p-12 sm:p-16 flex flex-col items-center justify-center min-h-[260px] sm:min-h-[300px] cursor-pointer transition-all duration-300 hover:bg-[#0D0D0D] hover:shadow-2xl"
              >
                {/* Top Corner Meta Label */}
                <div className="absolute top-5 left-6 flex items-center gap-2 text-xs font-mono text-white/40 group-hover:text-white/70 transition-colors">
                  <span>{meta.label}</span>
                </div>

                {/* Top Right Quick Copy */}
                <div className="absolute top-5 right-6 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => handleCopyCode(state, e)}
                    className="p-2 rounded-lg bg-[#121212] border border-[#222222] text-white/70 hover:text-white text-xs flex items-center gap-1.5 transition-colors"
                    title="Copy React JSX"
                  >
                    {isCopied ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                {/* Center: The Authentic Pill Component in Generous Space */}
                <div className="py-6 pointer-events-none transform transition-transform group-hover:scale-105 duration-200">
                  <AgentPill
                    state={state}
                    size="md"
                    interactiveOrb={false}
                    className="shadow-xl"
                  />
                </div>

                {/* Bottom Corner Hint */}
                <div className="absolute bottom-5 right-6 text-[11px] text-white/30 font-mono flex items-center gap-1 opacity-0 group-hover:opacity-70 transition-opacity">
                  <span>Open in studio</span>
                  <ExternalLink className="w-3 h-3" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
