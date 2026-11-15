import React from 'react';
import { BookOpen, Layers, Cpu, Zap, ShieldCheck } from 'lucide-react';
import { ORB_STATES_METADATA } from '../types';

export const Documentation: React.FC = () => {
  const presetsList = Object.values(ORB_STATES_METADATA);

  return (
    <section id="docs" className="py-20 border-t border-[#37393E]/60 bg-[#040404]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0A0A0C] border border-[#37393E] text-white/80 text-xs font-mono tracking-wide mb-4">
            <BookOpen className="w-3.5 h-3.5 text-white/60" />
            <span>SPECIFICATION & ARCHITECTURE</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-4">
            Technical Architecture & API
          </h2>

          <p className="text-base text-white/60 font-sans">
            High-DPI HTML5 Canvas 2D engine with zero external 3D runtime dependencies.
            Under 4KB minified + gzipped, achieving 60/120fps with minimal CPU overhead.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="p-6 rounded-2xl bg-[#0A0A0C] border border-[#37393E]">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
              <Zap className="w-5 h-5 text-emerald-400" />
            </div>
            <h3 className="text-base font-semibold text-white mb-2">Zero-Dependency Footprint</h3>
            <p className="text-xs text-white/60 leading-relaxed font-sans">
              No Three.js, Babylon.js, or heavyweight WebGL context overhead. Pure Canvas 2D rasterization with mathematical 3D Euler matrix projections.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0A0A0C] border border-[#37393E]">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-base font-semibold text-white mb-2">Auto High-DPI & Resize</h3>
            <p className="text-xs text-white/60 leading-relaxed font-sans">
              Automatic Retina/ProMotion DPR scaling with ResizeObserver integration. Delivers pin-sharp vector points on 4K and mobile OLED displays without blur.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0A0A0C] border border-[#37393E]">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5 text-white/80" />
            </div>
            <h3 className="text-base font-semibold text-white mb-2">Strict Design Tokens</h3>
            <p className="text-xs text-white/60 leading-relaxed font-sans">
              Engineered exclusively around canonical token palette: Background #040404, Foreground #FFFFFF, and Accent #37393E for hyper-minimalist elegance.
            </p>
          </div>
        </div>

        {/* Mathematical Preset Breakdown Table */}
        <div className="bg-[#070709] border border-[#37393E] rounded-3xl p-6 sm:p-8 shadow-xl mb-16">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Layers className="w-4 h-4 text-white/60" />
            Mathematical Preset Models
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-[#37393E] text-white/50">
                  <th className="py-3 px-4">State</th>
                  <th className="py-3 px-4">Pill Status Label</th>
                  <th className="py-3 px-4">Mathematical Model</th>
                  <th className="py-3 px-4">Kinetics & Physics</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#37393E]/40 text-white/80">
                {presetsList.map((preset) => (
                  <tr key={preset.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4 font-semibold text-white capitalize">{preset.id}</td>
                    <td className="py-3 px-4 text-emerald-400">{preset.pillLabel}</td>
                    <td className="py-3 px-4 text-white/70">{preset.mathModel}</td>
                    <td className="py-3 px-4 text-white/50">{preset.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Component Props Reference */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* AgentPill Props */}
          <div className="bg-[#070709] border border-[#37393E] rounded-3xl p-6 sm:p-8">
            <h3 className="text-base font-semibold text-white mb-2 font-mono">
              &lt;AgentPill /&gt; Props
            </h3>
            <p className="text-xs text-white/50 mb-4 font-sans">
              Capsule status pill container with embedded kinetic micro-orb.
            </p>
            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 rounded-xl bg-[#0A0A0C] border border-[#37393E]/60">
                <div className="text-white font-semibold">state?: OrbState</div>
                <div className="text-white/50 text-[11px] mt-0.5">
                  'solving' | 'thinking' | 'listening' | 'working' | 'searching' | 'streaming' | 'idle' | 'error'
                </div>
              </div>
              <div className="p-3 rounded-xl bg-[#0A0A0C] border border-[#37393E]/60">
                <div className="text-white font-semibold">size?: 'sm' | 'md' | 'lg'</div>
                <div className="text-white/50 text-[11px] mt-0.5">
                  Preset height: 'sm' (28px), 'md' (36px, default), 'lg' (48px)
                </div>
              </div>
              <div className="p-3 rounded-xl bg-[#0A0A0C] border border-[#37393E]/60">
                <div className="text-white font-semibold">label?: React.ReactNode</div>
                <div className="text-white/50 text-[11px] mt-0.5">
                  Custom label override; defaults to canonical reference status string
                </div>
              </div>
              <div className="p-3 rounded-xl bg-[#0A0A0C] border border-[#37393E]/60">
                <div className="text-white font-semibold">interactiveOrb?: boolean</div>
                <div className="text-white/50 text-[11px] mt-0.5">
                  Whether mouse drag rotates the embedded mini orb (default: false)
                </div>
              </div>
            </div>
          </div>

          {/* AgentOrb Props */}
          <div className="bg-[#070709] border border-[#37393E] rounded-3xl p-6 sm:p-8">
            <h3 className="text-base font-semibold text-white mb-2 font-mono">
              &lt;AgentOrb /&gt; Props
            </h3>
            <p className="text-xs text-white/50 mb-4 font-sans">
              Standalone 3D kinetic canvas element.
            </p>
            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 rounded-xl bg-[#0A0A0C] border border-[#37393E]/60">
                <div className="text-white font-semibold">size?: number</div>
                <div className="text-white/50 text-[11px] mt-0.5">
                  Diameter in pixels (width and height); defaults to 120px
                </div>
              </div>
              <div className="p-3 rounded-xl bg-[#0A0A0C] border border-[#37393E]/60">
                <div className="text-white font-semibold">speed?: number</div>
                <div className="text-white/50 text-[11px] mt-0.5">
                  Animation speed multiplier (default: 1.0)
                </div>
              </div>
              <div className="p-3 rounded-xl bg-[#0A0A0C] border border-[#37393E]/60">
                <div className="text-white font-semibold">particleCount?: number</div>
                <div className="text-white/50 text-[11px] mt-0.5">
                  Custom point cloud particle density override
                </div>
              </div>
              <div className="p-3 rounded-xl bg-[#0A0A0C] border border-[#37393E]/60">
                <div className="text-white font-semibold">interactive?: boolean</div>
                <div className="text-white/50 text-[11px] mt-0.5">
                  Pointer drag rotation with inertia physics (default: true)
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
