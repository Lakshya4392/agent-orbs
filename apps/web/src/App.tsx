import { useState } from 'react';
import { OrbState } from '@agent-orbs/core';
import { Header } from './components/Header';
import { HeroCenterpiece } from './components/HeroCenterpiece';
import { BigStudioCard } from './components/BigStudioCard';
import { ReferenceGallery } from './components/ReferenceGallery';
import { Footer } from './components/Footer';

export function App() {
  const [activeView, setActiveView] = useState<'showcase' | 'studio'>('showcase');
  const [selectedState, setSelectedState] = useState<OrbState>('solving');

  const handleNavigate = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectStateFromGallery = (state: OrbState) => {
    setSelectedState(state);
    setActiveView('studio');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#040404] text-[#FFFFFF] font-sans selection:bg-white selection:text-black">
      {/* 1. Sticky Navigation Header with Showcase/Studio Switcher */}
      <Header
        activeView={activeView}
        onViewChange={setActiveView}
        onNavigate={handleNavigate}
      />

      {/* Main Content Area */}
      <main>
        {activeView === 'showcase' ? (
          <>
            {/* 2. Hero Centerpiece: Text in Center + Floating Constellation of Orbs */}
            <HeroCenterpiece onOpenStudio={() => setActiveView('studio')} />

            {/* 3. Canonical Reference Gallery Grid (Matching Reference Image 2) */}
            <ReferenceGallery onSelectState={handleSelectStateFromGallery} />
          </>
        ) : (
          /* Dedicated Developer Studio View (Separate Page) */
          <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1">
                    Developer Studio & Parameter Playground
                  </h2>
                  <p className="text-xs sm:text-sm text-white/50">
                    Interactive 3D canvas stage with real-time velocity, particle density, and theme customization.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setActiveView('showcase');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-4 py-2 rounded-full bg-[#0A0A0A] border border-[#1E1E1E] text-xs font-medium text-white/80 hover:text-white hover:border-white/30 transition-all"
                >
                  ← Back to Showcase
                </button>
              </div>

              {/* 3-Column Studio Workbench: Left Selector | Center Stage | Right Parameters */}
              <BigStudioCard
                selectedState={selectedState}
                onStateChange={setSelectedState}
              />
            </div>
          </section>
        )}
      </main>

      {/* 4. Minimal 1-line Footer */}
      <Footer />
    </div>
  );
}

export default App;
