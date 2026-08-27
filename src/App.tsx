import React, { useState, useEffect, useMemo } from 'react';
import {
  MarketCategory,
  MarketRegion,
  MarketItem,
  MarketIndex,
  PriceAlert,
} from './types';
import {
  INITIAL_INDICES,
  INITIAL_MARKET_ITEMS,
  SECTOR_PERFORMANCE,
} from './data/marketData';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { IndicesRow } from './components/IndicesRow';
import { MarketTable } from './components/MarketTable';
import { MarketHeatmap } from './components/MarketHeatmap';
import { SymbolDetailModal } from './components/SymbolDetailModal';
import { SearchModal } from './components/SearchModal';
import { WatchlistDrawer } from './components/WatchlistDrawer';
import { AlertModal } from './components/AlertModal';
import { GetStartedModal } from './components/GetStartedModal';
import { Footer } from './components/Footer';
import { Bell, CheckCircle2, Star } from 'lucide-react';

export default function App() {
  const [indices, setIndices] = useState<MarketIndex[]>(INITIAL_INDICES);
  const [marketItems, setMarketItems] = useState<MarketItem[]>(INITIAL_MARKET_ITEMS);
  const [selectedCategory, setSelectedCategory] = useState<MarketCategory>('us_stocks');
  const [selectedRegion, setSelectedRegion] = useState<MarketRegion>('Everywhere');
  const [activeNav, setActiveNav] = useState<string>('Markets');
  const [isLiveTicking, setIsLiveTicking] = useState<boolean>(true);

  // Watchlist & Alerts
  const [watchlist, setWatchlist] = useState<string[]>(['NVDA', 'BTC/USD', 'AAPL', 'GOLD']);
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals & Drawers state
  const [selectedItemForModal, setSelectedItemForModal] = useState<MarketItem | MarketIndex | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isWatchlistOpen, setIsWatchlistOpen] = useState<boolean>(false);
  const [alertTargetItem, setAlertTargetItem] = useState<MarketItem | MarketIndex | null>(null);
  const [isGetStartedOpen, setIsGetStartedOpen] = useState<boolean>(false);

  // Keyboard shortcut Ctrl+K / Cmd+K for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Real-time market price simulation engine
  useEffect(() => {
    if (!isLiveTicking) return;

    const interval = setInterval(() => {
      // Tick indices
      setIndices((prevIndices) =>
        prevIndices.map((idx) => {
          const deltaPercent = (Math.random() - 0.49) * 0.08;
          const newPrice = Number(Math.max(idx.price * (1 + deltaPercent / 100), 10).toFixed(2));
          const newChange = Number((idx.change + (newPrice - idx.price)).toFixed(2));
          const newChangePercent = Number(((newChange / (newPrice - newChange)) * 100).toFixed(2));
          const newSparkline = [...idx.sparkline.slice(1), newPrice];

          return {
            ...idx,
            price: newPrice,
            change: newChange,
            changePercent: newChangePercent,
            sparkline: newSparkline,
          };
        })
      );

      // Tick market items
      setMarketItems((prevItems) =>
        prevItems.map((item) => {
          // Selectively tick ~50% of items per interval for realism
          if (Math.random() > 0.6) return item;

          const deltaPercent = (Math.random() - 0.48) * 0.15;
          const precision = item.category === 'forex' ? 4 : item.category === 'bonds' ? 3 : 2;
          const newPrice = Number(
            Math.max(item.price * (1 + deltaPercent / 100), 0.0001).toFixed(precision)
          );
          const newChange = Number((item.change + (newPrice - item.price)).toFixed(precision));
          const newChangePercent = Number(
            ((newChange / (newPrice - newChange || 1)) * 100).toFixed(2)
          );
          const newSparkline = [...item.sparkline.slice(1), newPrice];

          // Check Price Alerts
          alerts.forEach((alert) => {
            if (alert.symbol === item.symbol && !alert.triggered) {
              if (
                (alert.condition === 'above' && newPrice >= alert.targetPrice) ||
                (alert.condition === 'below' && newPrice <= alert.targetPrice)
              ) {
                alert.triggered = true;
                showToast(`🔔 Price Alert Triggered: ${item.symbol} reached $${newPrice}!`);
              }
            }
          });

          return {
            ...item,
            price: newPrice,
            change: newChange,
            changePercent: newChangePercent,
            sparkline: newSparkline,
          };
        })
      );
    }, 3200);

    return () => clearInterval(interval);
  }, [isLiveTicking, alerts]);

  // Keep modal item updated if real-time ticks occur
  useEffect(() => {
    if (!selectedItemForModal) return;
    const sym = 'symbol' in selectedItemForModal ? selectedItemForModal.symbol : selectedItemForModal.name;
    const foundItem = marketItems.find((i) => i.symbol === sym);
    const foundIndex = indices.find((i) => i.name === sym);
    if (foundItem) setSelectedItemForModal(foundItem);
    else if (foundIndex) setSelectedItemForModal(foundIndex);
  }, [marketItems, indices]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleToggleWatchlist = (symbol: string) => {
    if (watchlist.includes(symbol)) {
      setWatchlist((prev) => prev.filter((s) => s !== symbol));
      showToast(`Removed ${symbol} from watchlist`);
    } else {
      setWatchlist((prev) => [...prev, symbol]);
      showToast(`Added ${symbol} to watchlist`);
    }
  };

  const handleSaveAlert = (alert: PriceAlert) => {
    setAlerts((prev) => [...prev, alert]);
    showToast(`Alert set for ${alert.symbol} at $${alert.targetPrice}`);
  };

  // Filter items for current category and region
  const categoryItems = useMemo(() => {
    let result = marketItems.filter((i) => i.category === selectedCategory);
    if (selectedRegion !== 'Everywhere') {
      const regionFiltered = result.filter((i) => i.region === selectedRegion);
      if (regionFiltered.length > 0) result = regionFiltered;
    }
    return result;
  }, [marketItems, selectedCategory, selectedRegion]);

  return (
    <div className="min-h-screen bg-[#0f131e] text-[#dfe2f2] font-sans flex flex-col selection:bg-[#2962ff]/30 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1b1f2b] border border-[#2962ff] text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-5 h-5 text-[#089981] shrink-0" />
          <span className="text-xs sm:text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Top Navigation Bar */}
      <Navbar
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenWatchlist={() => setIsWatchlistOpen(true)}
        watchlistCount={watchlist.length}
        onOpenGetStarted={() => setIsGetStartedOpen(true)}
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        isLiveTicking={isLiveTicking}
        setIsLiveTicking={setIsLiveTicking}
      />

      {/* Main Content Container */}
      <main className="max-w-[1280px] w-full mx-auto px-4 sm:px-6 flex-1 py-8">
        {/* Hero Section with Dropdown & Category Pills */}
        <HeroSection
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          selectedRegion={selectedRegion}
          onSelectRegion={setSelectedRegion}
        />

        {/* Indices Row (S&P 500, Nasdaq 100, Dow 30) */}
        <IndicesRow
          indices={indices}
          onSelectIndex={(idx) => setSelectedItemForModal(idx)}
          onExploreAllIndices={() => {
            setSelectedCategory('us_stocks');
            window.scrollTo({ top: 380, behavior: 'smooth' });
          }}
        />

        {/* Dynamic Category Market Table */}
        <MarketTable
          category={selectedCategory}
          items={categoryItems}
          watchlist={watchlist}
          onToggleWatchlist={handleToggleWatchlist}
          onOpenAlert={(item) => setAlertTargetItem(item)}
          onSelectItem={(item) => setSelectedItemForModal(item)}
        />

        {/* Market Heatmap / Sector Breadth */}
        <MarketHeatmap
          sectors={SECTOR_PERFORMANCE}
          onSelectSector={(sectorName) => {
            showToast(`Filtered for ${sectorName} sector`);
          }}
        />
      </main>

      {/* Footer */}
      <Footer
        onOpenGetStarted={() => setIsGetStartedOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Symbol Detail Modal */}
      {selectedItemForModal && (
        <SymbolDetailModal
          item={selectedItemForModal}
          onClose={() => setSelectedItemForModal(null)}
          isStarred={watchlist.includes(
            'symbol' in selectedItemForModal
              ? selectedItemForModal.symbol
              : selectedItemForModal.name
          )}
          onToggleWatchlist={handleToggleWatchlist}
          onOpenAlert={(item) => setAlertTargetItem(item)}
        />
      )}

      {/* Global Search Modal (Ctrl+K) */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        items={marketItems}
        indices={indices}
        onSelectItem={(item) => setSelectedItemForModal(item)}
      />

      {/* Watchlist Drawer */}
      <WatchlistDrawer
        isOpen={isWatchlistOpen}
        onClose={() => setIsWatchlistOpen(false)}
        watchlistSymbols={watchlist}
        allItems={marketItems}
        allIndices={indices}
        onRemoveFromWatchlist={handleToggleWatchlist}
        onSelectItem={(item) => setSelectedItemForModal(item)}
      />

      {/* Price Alert Modal */}
      {alertTargetItem && (
        <AlertModal
          item={alertTargetItem}
          onClose={() => setAlertTargetItem(null)}
          onSaveAlert={handleSaveAlert}
        />
      )}

      {/* Get Started / Account Modal */}
      <GetStartedModal
        isOpen={isGetStartedOpen}
        onClose={() => setIsGetStartedOpen(false)}
      />
    </div>
  );
}
