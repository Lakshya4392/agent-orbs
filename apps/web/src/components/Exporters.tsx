import React, { useState } from 'react';
import { Copy, Check, Terminal, FileCode, Bot, Cpu, Sparkles } from 'lucide-react';
import { OrbState } from '@agent-orbs/core';

interface ExportersProps {
  initialState?: OrbState;
}

export const Exporters: React.FC<ExportersProps> = ({ initialState = 'solving' }) => {
  const [activeTab, setActiveTab] = useState<'react' | 'vanilla' | 'prompt' | 'cli'>('react');
  const [selectedState, setSelectedState] = useState<OrbState>(initialState);
  const [selectedCli, setSelectedCli] = useState<'pnpm' | 'npm' | 'yarn' | 'bun'>('pnpm');
  const [copied, setCopied] = useState<boolean>(false);

  const getReactCode = (state: OrbState) => {
    return `import React from 'react';
import { AgentPill, AgentOrb } from '@agent-orbs/react';

export function AgentReasoningIndicator() {
  return (
    <div className="flex flex-col items-center gap-6 p-8 bg-[#040404] min-h-screen">
      {/* Canonical Status Pill (from Reference Image 2) */}
      <AgentPill
        state="${state}"
        size="md"
        className="shadow-lg hover:border-white/40 transition-all"
      />

      {/* Standalone Kinetic Orb */}
      <AgentOrb
        state="${state}"
        size={240}
        speed={1.0}
        particleCount={450}
        interactive={true}
        transparent={true}
      />
    </div>
  );
}`;
  };

  const getVanillaCode = (state: OrbState) => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Agent Orb Vanilla Showcase</title>
  <style>
    body {
      margin: 0;
      background: #040404;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }
    .pill {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      height: 36px;
      padding: 0 16px 0 8px;
      border-radius: 9999px;
      background: #0A0A0C;
      border: 1px solid rgba(55, 57, 62, 0.7);
      color: #FFFFFF;
      font-family: monospace;
      font-size: 13px;
    }
  </style>
</head>
<body>
  <div class="pill">
    <canvas id="miniOrb" width="24" height="24"></canvas>
    <span id="pillLabel">Solving....</span>
  </div>

  <script type="module">
    import { createOrbRenderer } from 'https://esm.sh/@agent-orbs/core';

    const canvas = document.getElementById('miniOrb');
    const renderer = createOrbRenderer(canvas, {
      state: '${state}',
      size: 24,
      transparent: true,
      interactive: false,
    });
  </script>
</body>
</html>`;
  };

  const getAIPrompt = () => {
    return `# AGENT ORBS UI SPECIFICATION
When creating or updating AI agent interfaces, use @agent-orbs/react for all reasoning, tool execution, and thinking indicators.

## 1. Design Tokens & Palette
- Background: #040404
- Foreground: #FFFFFF
- Accent: #37393E
- Pill Container: #0A0A0C, border rgba(55, 57, 62, 0.7), border-radius 9999px

## 2. Canonical Status States (Reference Image 2)
1. "Solving...."      -> <AgentPill state="solving" size="md" />   (Fibonacci 3D sphere golden spiral)
2. "Thinking...."     -> <AgentPill state="thinking" size="md" />  (Harmonic spherical moiré lattice)
3. "Agent listening..." -> <AgentPill state="listening" size="md" /> (Acoustic latitude harmonic rings)
4. "Working...."      -> <AgentPill state="working" size="md" />   (Dynamic Keplerian orbital field)
5. "Searching...."    -> <AgentPill state="searching" size="md" /> (Lat/long coordinate radar sweep)

## 3. Usage Pattern
\`\`\`tsx
import { AgentPill } from '@agent-orbs/react';

// Render within chat messages, agent headers, or floating islands
<AgentPill state="thinking" size="md" />
\`\`\``;
  };

  const getCliCode = (cli: 'pnpm' | 'npm' | 'yarn' | 'bun') => {
    switch (cli) {
      case 'pnpm':
        return 'pnpm add @agent-orbs/react @agent-orbs/core';
      case 'npm':
        return 'npm install @agent-orbs/react @agent-orbs/core';
      case 'yarn':
        return 'yarn add @agent-orbs/react @agent-orbs/core';
      case 'bun':
        return 'bun add @agent-orbs/react @agent-orbs/core';
    }
  };

  const getActiveCode = () => {
    switch (activeTab) {
      case 'react':
        return getReactCode(selectedState);
      case 'vanilla':
        return getVanillaCode(selectedState);
      case 'prompt':
        return getAIPrompt();
      case 'cli':
        return getCliCode(selectedCli);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getActiveCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tabs = [
    { id: 'react', label: 'React TSX', icon: FileCode },
    { id: 'vanilla', label: 'Vanilla Canvas HTML/JS', icon: Cpu },
    { id: 'prompt', label: 'AI Agent Prompt', icon: Bot },
    { id: 'cli', label: 'CLI Install', icon: Terminal },
  ] as const;

  return (
    <section id="exporters" className="py-20 border-t border-[#37393E]/60 bg-[#040404]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0A0A0C] border border-[#37393E] text-white/80 text-xs font-mono tracking-wide mb-4">
            <Sparkles className="w-3.5 h-3.5 text-white/60" />
            <span>PRODUCTION EXPORTERS</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-4">
            1-Click Code & Prompt Exporters
          </h2>

          <p className="text-base text-white/60 font-sans">
            Instantly copy ready-to-run React components, standalone HTML canvases,
            or AI system prompts for Cursor, Claude Code, and v0.
          </p>
        </div>

        {/* Exporter Card */}
        <div className="max-w-4xl mx-auto bg-[#070709] border border-[#37393E] rounded-3xl overflow-hidden shadow-2xl">
          {/* Header Bar with Tabs */}
          <div className="bg-[#0A0A0C] border-b border-[#37393E] px-6 py-4 flex flex-wrap items-center justify-between gap-4">
            {/* Tabs */}
            <div className="flex flex-wrap items-center gap-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-white text-black font-semibold shadow-sm'
                        : 'text-white/70 hover:text-white hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Right Action: Copy */}
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-black hover:bg-white/90 text-xs font-semibold transition-all shadow-sm"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>

          {/* Subheader Options Bar (State selector or CLI selector) */}
          <div className="bg-[#070709] px-6 py-3 border-b border-[#37393E]/50 flex items-center justify-between text-xs font-mono">
            {activeTab === 'react' || activeTab === 'vanilla' ? (
              <div className="flex items-center gap-2">
                <span className="text-white/40 uppercase">State Preset:</span>
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value as OrbState)}
                  className="bg-[#0A0A0C] border border-[#37393E] text-white rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-white/40"
                >
                  <option value="solving">solving</option>
                  <option value="thinking">thinking</option>
                  <option value="listening">listening</option>
                  <option value="working">working</option>
                  <option value="searching">searching</option>
                  <option value="streaming">streaming</option>
                  <option value="idle">idle</option>
                  <option value="error">error</option>
                </select>
              </div>
            ) : activeTab === 'cli' ? (
              <div className="flex items-center gap-2">
                <span className="text-white/40 uppercase">Package Manager:</span>
                {(['pnpm', 'npm', 'yarn', 'bun'] as const).map((cli) => (
                  <button
                    key={cli}
                    onClick={() => setSelectedCli(cli)}
                    className={`px-2.5 py-1 rounded-md text-xs transition-colors ${
                      selectedCli === cli
                        ? 'bg-white/10 text-white border border-white/30'
                        : 'text-white/50 hover:text-white'
                    }`}
                  >
                    {cli}
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-white/50 text-[11px]">
                Target: Cursor (.cursorrules), Claude Projects, v0, Bolt.new, ChatGPT Instructions
              </div>
            )}

            <div className="text-white/40 text-[11px] hidden sm:block">
              {activeTab === 'react'
                ? 'TSX (React 18+)'
                : activeTab === 'vanilla'
                ? 'HTML5 / ESM'
                : activeTab === 'prompt'
                ? 'Markdown'
                : 'Shell'}
            </div>
          </div>

          {/* Code Body */}
          <div className="p-6 overflow-x-auto bg-[#040404]">
            <pre className="font-mono text-xs sm:text-sm text-white/90 leading-relaxed">
              <code>{getActiveCode()}</code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
};
