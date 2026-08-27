import React, { useState, useEffect, useRef } from 'react';
import { MarketItem, MarketIndex, MarketCategory } from '../types';
import { Sparkline } from './Sparkline';
import { Search, X, TrendingUp, TrendingDown, ArrowRight, CornerDownLeft } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: MarketItem[];
  indices: MarketIndex[];
  onSelectItem: (item: MarketItem | MarketIndex) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  items,
  indices,
  onSelectItem,
}) => {
  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Combine search entries
  const allEntries: (MarketItem | MarketIndex)[] = [
    ...indices,
    ...items,
  ];

  const filtered = allEntries.filter((item) => {
    const symbol = 'symbol' in item ? item.symbol : item.name;
    const name = item.name;
    const matchesQuery =
      symbol.toLowerCase().includes(query.toLowerCase()) ||
      name.toLowerCase().includes(query.toLowerCase());

    if (!matchesQuery) return false;
    if (filterType === 'all') return true;
    if (filterType === 'indices' && !('category' in item)) return true;
    if ('category' in item && item.category === filterType) return true;
    return false;
  });

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(filtered.length, 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filtered.length) % Math.max(filtered.length, 1));
      } else if (e.key === 'Enter' && filtered[selectedIndex]) {
        e.preventDefault();
        onSelectItem(filtered[selectedIndex]);
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filtered, selectedIndex, onClose, onSelectItem]);

  if (!isOpen) return null;

  const filterTabs = [
    { id: 'all', label: 'All' },
    { id: 'indices', label: 'Indices' },
    { id: 'us_stocks', label: 'US Stocks' },
    { id: 'crypto', label: 'Crypto' },
    { id: 'futures', label: 'Futures' },
    { id: 'forex', label: 'Forex' },
    { id: 'bonds', label: 'Bonds' },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/75 backdrop-blur-sm animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="bg-[#171b26] border border-[#363A45] rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Header */}
        <div className="p-4 border-b border-[#363A45] flex items-center gap-3 bg-[#1b1f2b]">
          <Search className="w-5 h-5 text-[#2962ff] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            id="global-search-input"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search symbols, indices, crypto, forex..."
            className="w-full bg-transparent text-base text-white placeholder-[#8d90a2] focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-[#8d90a2] hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block text-[10px] font-mono bg-[#262a35] px-1.5 py-0.5 rounded text-[#8d90a2] border border-[#363A45]">
            ESC
          </kbd>
        </div>

        {/* Category Filters */}
        <div className="px-4 py-2 bg-[#131722] border-b border-[#363A45] flex items-center gap-1.5 overflow-x-auto">
          {filterTabs.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                setFilterType(t.id);
                setSelectedIndex(0);
              }}
              className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                filterType === t.id
                  ? 'bg-[#2962ff] text-white font-semibold'
                  : 'bg-[#262a35] text-[#c3c5d8] hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-2 divide-y divide-[#363A45]/40 flex-1">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-[#8d90a2] text-sm">
              No matching instruments found for "{query}"
            </div>
          ) : (
            filtered.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              const isPositive = item.changePercent >= 0;
              const symbol = 'symbol' in item ? item.symbol : item.name;
              const name = item.name;

              return (
                <div
                  key={item.id}
                  id={`search-item-${idx}`}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  onClick={() => {
                    onSelectItem(item);
                    onClose();
                  }}
                  className={`p-3 rounded-xl flex items-center justify-between transition-colors cursor-pointer ${
                    isSelected ? 'bg-[#262a35] border border-[#2962ff]/40' : 'hover:bg-[#1b1f2b]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-[#1b1f2b] border border-[#363A45] flex items-center justify-center font-bold text-xs text-white shrink-0">
                      {item.badge || symbol.slice(0, 3)}
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-white font-mono text-sm truncate flex items-center gap-1.5">
                        <span>{symbol}</span>
                        {'category' in item && (
                          <span className="text-[10px] uppercase font-sans text-[#8d90a2] bg-[#171b26] px-1.5 py-0.2 rounded">
                            {item.category.replace('_', ' ')}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-[#c3c5d8] truncate">{name}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="hidden sm:block">
                      <Sparkline data={item.sparkline} isPositive={isPositive} width={64} height={20} />
                    </div>

                    <div className="text-right">
                      <div className="font-mono font-bold text-sm text-white">
                        {item.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </div>
                      <div
                        className={`text-xs font-mono font-medium ${
                          isPositive ? 'text-[#089981]' : 'text-[#F23645]'
                        }`}
                      >
                        {isPositive ? '+' : ''}
                        {item.changePercent.toFixed(2)}%
                      </div>
                    </div>

                    {isSelected && (
                      <CornerDownLeft className="w-4 h-4 text-[#2962ff] hidden sm:block" />
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 bg-[#131722] border-t border-[#363A45] text-xs text-[#8d90a2] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span>
              Use <strong className="text-white">↑</strong> <strong className="text-white">↓</strong> to navigate
            </span>
            <span>
              <strong className="text-white">Enter</strong> to select
            </span>
          </div>
          <span>Showing {filtered.length} instruments</span>
        </div>
      </div>
    </div>
  );
};
