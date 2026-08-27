import React, { useState } from 'react';
import { MarketItem, MarketIndex, Timeframe } from '../types';
import { InteractiveChart } from './InteractiveChart';
import {
  X,
  Star,
  Bell,
  TrendingUp,
  TrendingDown,
  Info,
  ExternalLink,
  ShieldCheck,
  Zap,
  Activity,
  Check
} from 'lucide-react';

interface SymbolDetailModalProps {
  item: MarketItem | MarketIndex | null;
  onClose: () => void;
  isStarred: boolean;
  onToggleWatchlist: (symbol: string) => void;
  onOpenAlert: (item: any) => void;
}

export const SymbolDetailModal: React.FC<SymbolDetailModalProps> = ({
  item,
  onClose,
  isStarred,
  onToggleWatchlist,
  onOpenAlert,
}) => {
  const [selectedTf, setSelectedTf] = useState<Timeframe>('1D');
  const [copied, setCopied] = useState(false);

  if (!item) return null;

  const isIndex = !('category' in item);
  const symbol = 'symbol' in item ? item.symbol : item.name;
  const name = item.name;
  const price = item.price;
  const change = item.change;
  const changePercent = item.changePercent;
  const isPositive = changePercent >= 0;
  const historyData = item.historicalData?.[selectedTf] || [];
  const currency = 'currency' in item ? item.currency : 'USD';

  const handleCopy = () => {
    navigator.clipboard.writeText(symbol);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div
        className="bg-[#171b26] border border-[#363A45] rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="px-5 py-4 border-b border-[#363A45] flex items-center justify-between bg-[#1b1f2b]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#262a35] border border-[#363A45] flex items-center justify-center font-bold text-sm text-white">
              {item.badge || symbol.slice(0, 3)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold font-headline text-white">{symbol}</h2>
                <button
                  onClick={handleCopy}
                  className="text-[11px] px-1.5 py-0.5 rounded bg-[#262a35] text-[#8d90a2] hover:text-white transition-colors"
                  title="Copy symbol"
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <p className="text-xs text-[#c3c5d8]">{name}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="modal-watchlist-star"
              onClick={() => onToggleWatchlist(symbol)}
              className={`p-2 rounded-xl border transition-colors flex items-center gap-1.5 text-xs font-semibold ${
                isStarred
                  ? 'bg-[#ffb59a]/15 text-[#ffb59a] border-[#ffb59a]/30'
                  : 'bg-[#262a35] text-[#c3c5d8] border-[#363A45] hover:text-white'
              }`}
            >
              <Star className={`w-4 h-4 ${isStarred ? 'fill-[#ffb59a]' : ''}`} />
              <span className="hidden sm:inline">{isStarred ? 'Saved' : 'Watchlist'}</span>
            </button>

            <button
              id="modal-alert-btn"
              onClick={() => onOpenAlert(item)}
              className="p-2 rounded-xl bg-[#262a35] text-[#c3c5d8] border border-[#363A45] hover:text-white transition-colors flex items-center gap-1.5 text-xs font-semibold"
            >
              <Bell className="w-4 h-4" />
              <span className="hidden sm:inline">Set Alert</span>
            </button>

            <button
              id="modal-close-btn"
              onClick={onClose}
              className="p-2 rounded-xl text-[#8d90a2] hover:text-white hover:bg-[#262a35] transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 overflow-y-auto space-y-6 flex-1">
          {/* Main Chart */}
          <InteractiveChart
            data={historyData}
            symbol={symbol}
            name={name}
            currentPrice={price}
            change={change}
            changePercent={changePercent}
            selectedTimeframe={selectedTf}
            onTimeframeChange={setSelectedTf}
            currency={currency}
            height={320}
          />

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-[#1b1f2b] p-3.5 rounded-xl border border-[#363A45]">
              <div className="text-xs text-[#8d90a2]">Day Range</div>
              <div className="text-sm font-mono font-bold text-white mt-1">
                {'dayLow' in item && item.dayLow
                  ? `${item.dayLow.toFixed(2)} - ${item.dayHigh?.toFixed(2)}`
                  : `${(price * 0.985).toFixed(2)} - ${(price * 1.015).toFixed(2)}`}
              </div>
            </div>

            <div className="bg-[#1b1f2b] p-3.5 rounded-xl border border-[#363A45]">
              <div className="text-xs text-[#8d90a2]">52-Week Range</div>
              <div className="text-sm font-mono font-bold text-white mt-1">
                {item.low52w.toFixed(2)} - {item.high52w.toFixed(2)}
              </div>
            </div>

            <div className="bg-[#1b1f2b] p-3.5 rounded-xl border border-[#363A45]">
              <div className="text-xs text-[#8d90a2]">Technical Rating</div>
              <div
                className={`text-sm font-bold mt-1 ${
                  isPositive ? 'text-[#089981]' : 'text-[#F23645]'
                }`}
              >
                {'technicalRating' in item ? item.technicalRating : isPositive ? 'Strong Buy' : 'Neutral'}
              </div>
            </div>

            <div className="bg-[#1b1f2b] p-3.5 rounded-xl border border-[#363A45]">
              <div className="text-xs text-[#8d90a2]">RSI (14-period)</div>
              <div className="text-sm font-mono font-bold text-white mt-1">
                {'rsi' in item && item.rsi ? item.rsi : (55.4).toFixed(1)}{' '}
                <span className="text-xs text-[#8d90a2] font-normal">(Neutral)</span>
              </div>
            </div>
          </div>

          {/* Description & Technical Summary */}
          {'description' in item && item.description && (
            <div className="bg-[#1b1f2b] p-4 rounded-xl border border-[#363A45]">
              <h4 className="text-sm font-bold text-white mb-1 flex items-center gap-1.5">
                <Info className="w-4 h-4 text-[#2962ff]" />
                About {item.name}
              </h4>
              <p className="text-xs text-[#c3c5d8] leading-relaxed">{item.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
