import React from 'react';
import { SectorPerformance } from '../types';
import { Layers, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';

interface MarketHeatmapProps {
  sectors: SectorPerformance[];
  onSelectSector?: (sectorName: string) => void;
}

export const MarketHeatmap: React.FC<MarketHeatmapProps> = ({
  sectors,
  onSelectSector,
}) => {
  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl sm:text-2xl font-headline font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#2962ff]" />
            Sector Performance & Market Breadth
          </h3>
          <p className="text-xs sm:text-sm text-[#8d90a2] mt-0.5">
            S&P 500 industry group performance relative to market opening
          </p>
        </div>
      </div>

      {/* Grid of Sector Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {sectors.map((sector) => {
          const isUp = sector.changePercent >= 0;
          const intensity = Math.min(Math.abs(sector.changePercent) / 2.5, 1);
          const bgColor = isUp
            ? `rgba(8, 153, 129, ${0.12 + intensity * 0.2})`
            : `rgba(242, 54, 69, ${0.12 + intensity * 0.2})`;
          const borderColor = isUp ? 'rgba(8, 153, 129, 0.4)' : 'rgba(242, 54, 69, 0.4)';

          return (
            <div
              key={sector.name}
              id={`sector-card-${sector.name.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => onSelectSector && onSelectSector(sector.name)}
              style={{ backgroundColor: bgColor, borderColor: borderColor }}
              className="border rounded-xl p-3.5 transition-all duration-200 hover:scale-[1.02] cursor-pointer group flex flex-col justify-between h-28"
            >
              <div className="flex items-start justify-between">
                <span className="font-semibold text-xs text-white truncate max-w-[130px]">
                  {sector.name}
                </span>
                <span
                  className={`text-xs font-mono font-bold px-1.5 py-0.5 rounded ${
                    isUp ? 'text-[#089981] bg-[#089981]/20' : 'text-[#F23645] bg-[#F23645]/20'
                  }`}
                >
                  {isUp ? '+' : ''}
                  {sector.changePercent.toFixed(2)}%
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] text-[#c3c5d8] pt-2 border-t border-white/5">
                <span>Leader: <strong className="text-white font-mono">{sector.leadingStock}</strong></span>
                <span className={`font-mono ${sector.leadChange >= 0 ? 'text-[#089981]' : 'text-[#F23645]'}`}>
                  {sector.leadChange >= 0 ? '+' : ''}{sector.leadChange.toFixed(1)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
