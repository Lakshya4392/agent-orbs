import React from 'react';
import { Github, Sparkles, Layers } from 'lucide-react';

interface HeaderProps {
  activeView?: 'showcase' | 'studio';
  onViewChange?: (view: 'showcase' | 'studio') => void;
  onNavigate?: (id: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeView = 'showcase',
  onViewChange,
  onNavigate,
}) => {
  const scrollTo = (id: string) => {
    if (activeView !== 'showcase' && onViewChange) {
      onViewChange('showcase');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 50);
      return;
    }

    if (onNavigate) {
      onNavigate(id);
    } else {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#141414] bg-[#040404]/90 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              onViewChange?.('showcase');
              scrollTo('hero');
            }}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
          >
            <div className="w-6 h-6 rounded-full bg-[#080808] border border-[#1E1E1E] flex items-center justify-center relative overflow-hidden group-hover:border-white/50 transition-colors">
              <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold tracking-tight text-white font-sans">
                Agent Orbs
              </span>
            </div>
          </button>
        </div>

        {/* Center: Clean Segmented View Switcher */}
        <div className="flex items-center gap-1 bg-[#080808] p-1 rounded-full border border-[#1E1E1E]">
          <button
            onClick={() => onViewChange?.('showcase')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
              activeView === 'showcase'
                ? 'bg-white text-black font-semibold shadow-sm'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            <span>Showcase</span>
          </button>

          <button
            onClick={() => onViewChange?.('studio')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
              activeView === 'studio'
                ? 'bg-white text-black font-semibold shadow-sm'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Layers className="w-3 h-3" />
            <span>Studio</span>
          </button>
        </div>

        {/* Right Action: GitHub Star */}
        <div className="flex items-center gap-2">
          <a
            href="https://github.com/Lakshya4392/agent-orbs"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-full bg-[#0A0A0A] border border-[#1E1E1E] hover:border-white/40 text-xs text-white/80 hover:text-white transition-all flex items-center gap-1.5"
            title="Star on GitHub"
          >
            <Github className="w-3.5 h-3.5" />
            <span className="font-medium">Star</span>
          </a>
        </div>
      </div>
    </header>
  );
};
