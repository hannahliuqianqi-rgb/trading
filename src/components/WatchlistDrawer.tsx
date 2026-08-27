import React from 'react';
import { MarketItem, MarketIndex } from '../types';
import { Sparkline } from './Sparkline';
import { X, Star, Trash2, ArrowUp, ArrowDown, ExternalLink } from 'lucide-react';

interface WatchlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  watchlistSymbols: string[];
  allItems: MarketItem[];
  allIndices: MarketIndex[];
  onRemoveFromWatchlist: (symbol: string) => void;
  onSelectItem: (item: MarketItem | MarketIndex) => void;
}

export const WatchlistDrawer: React.FC<WatchlistDrawerProps> = ({
  isOpen,
  onClose,
  watchlistSymbols,
  allItems,
  allIndices,
  onRemoveFromWatchlist,
  onSelectItem,
}) => {
  if (!isOpen) return null;

  const combined = [...allIndices, ...allItems];
  const watchedItems = combined.filter((item) => {
    const sym = 'symbol' in item ? item.symbol : item.name;
    return watchlistSymbols.includes(sym);
  });

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end animate-in fade-in">
      <div
        className="w-full max-w-md bg-[#171b26] border-l border-[#363A45] h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-[#363A45] flex items-center justify-between bg-[#1b1f2b]">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 fill-[#ffb59a] text-[#ffb59a]" />
            <h3 className="text-lg font-bold font-headline text-white">Your Watchlist</h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#262a35] text-[#b6c4ff] font-mono">
              {watchedItems.length}
            </span>
          </div>

          <button
            id="close-watchlist-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8d90a2] hover:text-white hover:bg-[#262a35] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of Watched symbols */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {watchedItems.length === 0 ? (
            <div className="text-center py-16 px-4">
              <Star className="w-12 h-12 text-[#363A45] mx-auto mb-3" />
              <p className="text-sm text-[#dfe2f2] font-medium">Your watchlist is empty</p>
              <p className="text-xs text-[#8d90a2] mt-1">
                Click the star icon next to any stock, index, or cryptocurrency to track it here.
              </p>
            </div>
          ) : (
            watchedItems.map((item) => {
              const sym = 'symbol' in item ? item.symbol : item.name;
              const isPositive = item.changePercent >= 0;

              return (
                <div
                  key={item.id}
                  id={`watched-item-${sym.toLowerCase()}`}
                  onClick={() => {
                    onSelectItem(item);
                    onClose();
                  }}
                  className="bg-[#1b1f2b] hover:bg-[#262a35] border border-[#363A45] rounded-xl p-3 flex items-center justify-between transition-all cursor-pointer group"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white font-mono text-sm">{sym}</span>
                      <span className="text-xs text-[#8d90a2] truncate max-w-[130px]">{item.name}</span>
                    </div>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="font-mono text-sm font-semibold text-white">
                        {item.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </span>
                      <span
                        className={`text-xs font-mono flex items-center gap-0.5 ${
                          isPositive ? 'text-[#089981]' : 'text-[#F23645]'
                        }`}
                      >
                        {isPositive ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                        {Math.abs(item.changePercent).toFixed(2)}%
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <Sparkline data={item.sparkline} isPositive={isPositive} width={64} height={22} />
                    <button
                      title="Remove from Watchlist"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveFromWatchlist(sym);
                      }}
                      className="text-[#8d90a2] hover:text-[#F23645] p-1.5 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-[#363A45] bg-[#131722] text-xs text-[#8d90a2] text-center">
          Real-time watchlist sync enabled
        </div>
      </div>
    </div>
  );
};
