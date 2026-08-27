import React, { useState } from 'react';
import { MarketCategory, MarketRegion } from '../types';
import { ChevronDown, Check } from 'lucide-react';

interface HeroSectionProps {
  selectedCategory: MarketCategory;
  onSelectCategory: (cat: MarketCategory) => void;
  selectedRegion: MarketRegion;
  onSelectRegion: (reg: MarketRegion) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  selectedCategory,
  onSelectCategory,
  selectedRegion,
  onSelectRegion,
}) => {
  const [regionDropdownOpen, setRegionDropdownOpen] = useState(false);

  const categories: { id: MarketCategory; label: string }[] = [
    { id: 'us_stocks', label: 'US stocks' },
    { id: 'world_stocks', label: 'World stocks' },
    { id: 'crypto', label: 'Crypto' },
    { id: 'futures', label: 'Futures' },
    { id: 'forex', label: 'Forex' },
    { id: 'bonds', label: 'Government bonds' },
  ];

  const regions: MarketRegion[] = [
    'Everywhere',
    'United States',
    'Europe',
    'Asia-Pacific',
    'Americas',
    'Global Emerging',
  ];

  return (
    <section className="text-center flex flex-col items-center pt-8 pb-10">
      {/* Hero Title with Region Dropdown */}
      <div className="relative inline-block">
        <h1
          id="hero-title-btn"
          onClick={() => setRegionDropdownOpen(!regionDropdownOpen)}
          className="text-4xl sm:text-5xl md:text-[64px] font-headline font-bold text-[#dfe2f2] flex items-center justify-center gap-2 sm:gap-3 cursor-pointer hover:text-[#b6c4ff] transition-colors group tracking-tight"
        >
          <span>
            Markets, {selectedRegion === 'Everywhere' ? 'everywhere' : selectedRegion.toLowerCase()}
          </span>
          <ChevronDown className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-[#dfe2f2] group-hover:text-[#b6c4ff] group-hover:translate-y-1 transition-all" />
        </h1>

        {regionDropdownOpen && (
          <div className="absolute left-1/2 -translate-x-1/2 mt-3 w-56 bg-[#1b1f2b] border border-[#363A45] rounded-xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95">
            <div className="px-3 py-1.5 text-[11px] font-semibold text-[#8d90a2] uppercase tracking-wider text-left border-b border-[#363A45]">
              Select Region Scope
            </div>
            {regions.map((reg) => (
              <button
                key={reg}
                id={`region-opt-${reg.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => {
                  onSelectRegion(reg);
                  setRegionDropdownOpen(false);
                }}
                className={`w-full text-left px-3.5 py-2 text-sm flex items-center justify-between hover:bg-[#262a35] transition-colors ${
                  selectedRegion === reg ? 'text-[#2962ff] font-semibold bg-[#2962ff]/10' : 'text-[#dfe2f2]'
                }`}
              >
                <span>{reg}</span>
                {selectedRegion === reg && <Check className="w-4 h-4 text-[#2962ff]" />}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Pill Filter Tabs */}
      <div className="mt-8 flex flex-wrap justify-center gap-2 px-2 max-w-3xl">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              id={`filter-pill-${cat.id}`}
              onClick={() => onSelectCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                isActive
                  ? 'bg-[#262a35] text-[#dfe2f2] border-[#363A45] shadow-sm font-semibold'
                  : 'bg-[#1b1f2b] text-[#c3c5d8] border-transparent hover:bg-[#262a35] hover:text-[#dfe2f2]'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>
    </section>
  );
};
