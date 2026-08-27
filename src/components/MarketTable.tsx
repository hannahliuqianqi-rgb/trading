import React, { useState } from 'react';
import { MarketCategory, MarketItem } from '../types';
import { Sparkline } from './Sparkline';
import {
  ArrowDown,
  ArrowUp,
  Star,
  Bell,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Layers,
  ArrowUpDown,
  Search
} from 'lucide-react';

interface MarketTableProps {
  category: MarketCategory;
  items: MarketItem[];
  watchlist: string[];
  onToggleWatchlist: (symbol: string) => void;
  onOpenAlert: (item: MarketItem) => void;
  onSelectItem: (item: MarketItem) => void;
}

type SubTab = 'all' | 'active' | 'gainers' | 'losers' | 'highs';

export const MarketTable: React.FC<MarketTableProps> = ({
  category,
  items,
  watchlist,
  onToggleWatchlist,
  onOpenAlert,
  onSelectItem,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('all');
  const [filterQuery, setFilterQuery] = useState('');
  const [sortBy, setSortBy] = useState<'volume' | 'price' | 'changePercent'>('changePercent');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const categoryTitles: Record<MarketCategory, { title: string; subtitle: string }> = {
    us_stocks: {
      title: 'US Stocks Overview',
      subtitle: 'Real-time quotes, technical momentum, and financial statistics from NYSE and NASDAQ',
    },
    world_stocks: {
      title: 'World Stocks & ADRs',
      subtitle: 'Global market leaders across Europe, Asia-Pacific, and Americas',
    },
    crypto: {
      title: 'Crypto Market Assets',
      subtitle: 'Top digital currencies, smart contract platforms, and 24/7 liquidity feeds',
    },
    futures: {
      title: 'Futures & Commodities',
      subtitle: 'Energy, precious metals, agriculture, and index mini contracts',
    },
    forex: {
      title: 'Forex Major Currencies',
      subtitle: 'Global foreign exchange rates, spreads, and purchasing power benchmarks',
    },
    bonds: {
      title: 'Government Bonds & Sovereign Yields',
      subtitle: 'Sovereign Treasury yields, European benchmarks, and interest rate term structures',
    },
  };

  // Filter and sort items
  let filtered = items.filter(
    (item) =>
      item.symbol.toLowerCase().includes(filterQuery.toLowerCase()) ||
      item.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
      (item.sector && item.sector.toLowerCase().includes(filterQuery.toLowerCase()))
  );

  if (activeSubTab === 'gainers') {
    filtered = filtered.filter((i) => i.changePercent > 0).sort((a, b) => b.changePercent - a.changePercent);
  } else if (activeSubTab === 'losers') {
    filtered = filtered.filter((i) => i.changePercent < 0).sort((a, b) => a.changePercent - b.changePercent);
  } else if (activeSubTab === 'highs') {
    filtered = filtered.filter((i) => i.high52w && i.price >= i.high52w * 0.95);
  } else if (activeSubTab === 'active') {
    filtered = [...filtered].sort((a, b) => (parseFloat(b.volume) || 0) - (parseFloat(a.volume) || 0));
  } else {
    // Dynamic sort
    filtered.sort((a, b) => {
      let valA = a[sortBy] || 0;
      let valB = b[sortBy] || 0;
      if (typeof valA === 'string') valA = parseFloat(valA) || 0;
      if (typeof valB === 'string') valB = parseFloat(valB) || 0;
      return sortOrder === 'desc' ? (valB as number) - (valA as number) : (valA as number) - (valB as number);
    });
  }

  const handleSort = (field: 'volume' | 'price' | 'changePercent') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const currentInfo = categoryTitles[category] || categoryTitles.us_stocks;

  return (
    <div className="bg-[#1b1f2b] border border-[#363A45] rounded-xl overflow-hidden shadow-xl mb-12">
      {/* Header & Sub-tabs */}
      <div className="p-4 sm:p-5 border-b border-[#363A45] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl sm:text-2xl font-headline font-bold text-white">
              {currentInfo.title}
            </h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#262a35] text-[#b6c4ff] border border-[#363A45] font-mono">
              {filtered.length} instruments
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#8d90a2] mt-1">{currentInfo.subtitle}</p>
        </div>

        {/* Subtab Pills & Local Filter */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center bg-[#171b26] p-1 rounded-lg border border-[#363A45]">
            {(
              [
                { id: 'all', label: 'All' },
                { id: 'active', label: 'Most Active' },
                { id: 'gainers', label: 'Gainers' },
                { id: 'losers', label: 'Losers' },
                { id: 'highs', label: '52W Highs' },
              ] as { id: SubTab; label: string }[]
            ).map((tab) => (
              <button
                key={tab.id}
                id={`subtab-${tab.id}`}
                onClick={() => setActiveSubTab(tab.id)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  activeSubTab === tab.id
                    ? 'bg-[#2962ff] text-white shadow-sm font-semibold'
                    : 'text-[#c3c5d8] hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#8d90a2]" />
            <input
              type="text"
              id="filter-table-input"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Filter ticker..."
              className="bg-[#262a35] border border-[#363A45] rounded-lg text-xs py-1.5 pl-8 pr-3 text-[#dfe2f2] placeholder-[#8d90a2] focus:outline-none focus:border-[#2962ff] w-32 sm:w-40 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#363A45] bg-[#171b26]/80 text-[#8d90a2] text-xs uppercase tracking-wider font-semibold">
              <th className="py-3 px-4 w-12 text-center">Fav</th>
              <th className="py-3 px-4">Symbol & Name</th>
              <th className="py-3 px-4">Sector / Type</th>
              <th
                className="py-3 px-4 text-right cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSort('price')}
              >
                <span className="inline-flex items-center gap-1">
                  Last Price <ArrowUpDown className="w-3 h-3" />
                </span>
              </th>
              <th
                className="py-3 px-4 text-right cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSort('changePercent')}
              >
                <span className="inline-flex items-center gap-1">
                  Chg % <ArrowUpDown className="w-3 h-3" />
                </span>
              </th>
              <th
                className="py-3 px-4 text-right cursor-pointer hover:text-white transition-colors hidden md:table-cell"
                onClick={() => handleSort('volume')}
              >
                <span className="inline-flex items-center gap-1">
                  Volume / Cap <ArrowUpDown className="w-3 h-3" />
                </span>
              </th>
              <th className="py-3 px-4 text-center">24h Trend</th>
              <th className="py-3 px-4 text-center">Tech Rating</th>
              <th className="py-3 px-4 text-center w-14">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#363A45]/60 text-sm">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-[#8d90a2]">
                  No matching instruments found. Try adjusting your search query.
                </td>
              </tr>
            ) : (
              filtered.map((item) => {
                const isPositive = item.changePercent >= 0;
                const isStarred = watchlist.includes(item.symbol);
                return (
                  <tr
                    key={item.id}
                    id={`table-row-${item.symbol.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                    onClick={() => onSelectItem(item)}
                    className="hover:bg-[#262a35]/60 transition-colors group cursor-pointer"
                  >
                    {/* Star favorite */}
                    <td
                      className="py-3 px-4 text-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleWatchlist(item.symbol);
                      }}
                    >
                      <button
                        title={isStarred ? 'Remove from Watchlist' : 'Add to Watchlist'}
                        className="text-[#8d90a2] hover:text-[#ffb59a] transition-colors p-1"
                      >
                        <Star
                          className={`w-4 h-4 ${
                            isStarred ? 'fill-[#ffb59a] text-[#ffb59a]' : ''
                          }`}
                        />
                      </button>
                    </td>

                    {/* Symbol & Name */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-[#262a35] border border-[#363A45] flex items-center justify-center font-bold text-xs font-headline text-[#dfe2f2] group-hover:border-[#2962ff] transition-colors">
                          {item.badge || item.symbol.slice(0, 3)}
                        </div>
                        <div>
                          <div className="font-bold text-white font-mono flex items-center gap-1.5">
                            <span>{item.symbol}</span>
                            {item.region && (
                              <span className="text-[10px] px-1.5 py-0.2 bg-[#262a35] text-[#8d90a2] rounded">
                                {item.region}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-[#c3c5d8] truncate max-w-[180px] sm:max-w-[240px]">
                            {item.name}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Sector */}
                    <td className="py-3 px-4 text-xs text-[#c3c5d8]">
                      <span className="px-2 py-0.5 rounded bg-[#262a35] text-[#c3c5d8] border border-[#363A45]/60">
                        {item.sector || 'Financial'}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="py-3 px-4 text-right font-mono font-semibold text-white">
                      {item.currency === '%'
                        ? ''
                        : item.currency === 'JPY'
                        ? '¥'
                        : item.currency === 'EUR'
                        ? '€'
                        : '$'}
                      {item.price.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 4,
                      })}
                      {item.currency === '%' ? '%' : ''}
                    </td>

                    {/* Change % */}
                    <td className="py-3 px-4 text-right font-mono font-medium">
                      <span
                        className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-xs ${
                          isPositive
                            ? 'text-[#089981] bg-[#089981]/10'
                            : 'text-[#F23645] bg-[#F23645]/10'
                        }`}
                      >
                        {isPositive ? (
                          <ArrowUp className="w-3 h-3 stroke-[2.5]" />
                        ) : (
                          <ArrowDown className="w-3 h-3 stroke-[2.5]" />
                        )}
                        <span>{Math.abs(item.changePercent).toFixed(2)}%</span>
                      </span>
                    </td>

                    {/* Volume / Market Cap */}
                    <td className="py-3 px-4 text-right font-mono text-xs text-[#c3c5d8] hidden md:table-cell">
                      <div>{item.volume}</div>
                      {item.marketCap && (
                        <div className="text-[11px] text-[#8d90a2]">{item.marketCap}</div>
                      )}
                    </td>

                    {/* Sparkline */}
                    <td className="py-3 px-4 text-center">
                      <div className="inline-block">
                        <Sparkline data={item.sparkline} isPositive={isPositive} width={80} height={24} />
                      </div>
                    </td>

                    {/* Technical Rating */}
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                          item.technicalRating === 'Strong Buy'
                            ? 'bg-[#089981]/20 text-[#089981] border border-[#089981]/40'
                            : item.technicalRating === 'Buy'
                            ? 'bg-[#089981]/10 text-[#66dabf]'
                            : item.technicalRating === 'Strong Sell'
                            ? 'bg-[#F23645]/20 text-[#F23645] border border-[#F23645]/40'
                            : item.technicalRating === 'Sell'
                            ? 'bg-[#F23645]/10 text-[#ffb4ab]'
                            : 'bg-[#262a35] text-[#8d90a2]'
                        }`}
                      >
                        {item.technicalRating || 'Neutral'}
                      </span>
                    </td>

                    {/* Alert trigger */}
                    <td
                      className="py-3 px-4 text-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenAlert(item);
                      }}
                    >
                      <button
                        id={`alert-btn-${item.symbol.toLowerCase()}`}
                        title="Set Price Alert"
                        className="text-[#8d90a2] hover:text-[#b6c4ff] hover:bg-[#262a35] p-1.5 rounded transition-colors"
                      >
                        <Bell className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
