import React from 'react';
import { Github } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-[#141418] bg-[#040404] py-8 text-white/50 text-xs font-mono">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        {/* Creator Identity */}
        <div className="flex items-center gap-2 text-white/70">
          <span className="text-white font-semibold">Agent Orbs</span>
          <span className="text-white/30">•</span>
          <span>Crafted by</span>
          <a
            href="https://github.com/Lakshya4392"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:underline font-semibold"
          >
            Lakshya (@Lakshya4392)
          </a>
        </div>

        {/* Minimal Links */}
        <div className="flex items-center gap-4 text-white/50">
          <span>MIT License</span>
          <span className="text-white/20">•</span>
          <a
            href="https://github.com/Lakshya4392/agent-orbs"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors flex items-center gap-1.5"
          >
            <Github className="w-3.5 h-3.5" />
            <span>GitHub</span>
          </a>
        </div>
      </div>
    </footer>
  );
};
