import React from 'react';
import { MarketIndex } from '../types';
import { Sparkline } from './Sparkline';
import { ChevronRight, ArrowDown, ArrowUp } from 'lucide-react';

interface IndicesRowProps {
  indices: MarketIndex[];
  onSelectIndex: (index: MarketIndex) => void;
  onExploreAllIndices: () => void;
}

export const IndicesRow: React.FC<IndicesRowProps> = ({
  indices,
  onSelectIndex,
  onExploreAllIndices,
}) => {
  return (
    <section className="mb-10">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <h2
          id="indices-heading"
          onClick={onExploreAllIndices}
          className="text-2xl sm:text-3xl font-headline font-semibold text-[#dfe2f2] flex items-center gap-1 cursor-pointer hover:text-[#b6c4ff] transition-colors group"
        >
          <span>Indices</span>
          <ChevronRight className="w-6 h-6 text-[#dfe2f2] group-hover:text-[#b6c4ff] group-hover:translate-x-1 transition-transform" />
        </h2>
        <span className="text-xs text-[#8d90a2] hidden sm:inline-block">
          Click index for real-time chart & metrics
        </span>
      </div>

      {/* Indices 3-Column Grid (matches image) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {indices.slice(0, 3).map((idx) => {
          const isPositive = idx.changePercent >= 0;
          return (
            <div
              key={idx.id}
              id={`index-card-${idx.id}`}
              onClick={() => onSelectIndex(idx)}
              className="bg-[#1E222D] border border-[#363A45] hover:border-[#434656] rounded-xl p-4 transition-all duration-200 group cursor-pointer flex items-center gap-4 hover:shadow-lg hover:shadow-black/30 active:scale-[0.99]"
            >
              {/* Index Number Badge */}
              <div className="w-12 h-12 rounded-full bg-[#1b1f2b] flex items-center justify-center border border-[#363A45] group-hover:border-[#b6c4ff] transition-colors shrink-0">
                <span
                  className={`text-sm font-bold font-headline ${
                    isPositive ? 'text-[#089981]' : 'text-[#F23645]'
                  }`}
                >
                  {idx.badge}
                </span>
              </div>

              {/* Text Info */}
              <div className="flex-1 min-w-0">
                <div className="text-base font-medium text-[#dfe2f2] truncate group-hover:text-white transition-colors">
                  {idx.name}
                </div>
                <div
                  className={`text-sm font-mono flex items-center gap-1 font-medium ${
                    isPositive ? 'text-[#089981]' : 'text-[#F23645]'
                  }`}
                >
                  <span>
                    {idx.price.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                  {isPositive ? (
                    <ArrowUp className="w-3.5 h-3.5 stroke-[2.5]" />
                  ) : (
                    <ArrowDown className="w-3.5 h-3.5 stroke-[2.5]" />
                  )}
                  <span>{Math.abs(idx.changePercent).toFixed(2)}%</span>
                </div>
              </div>

              {/* Sparkline Visual */}
              <div className="w-24 h-8 shrink-0 flex items-center justify-end">
                <Sparkline data={idx.sparkline} isPositive={isPositive} width={96} height={32} />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
