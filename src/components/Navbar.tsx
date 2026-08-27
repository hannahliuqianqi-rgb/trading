import React, { useState } from 'react';
import {
  TrendingUp,
  Search,
  Globe,
  User,
  Star,
  Bell,
  Menu,
  X,
  ChevronDown,
  ExternalLink,
  Activity,
  Layers,
  BarChart3,
  Sliders
} from 'lucide-react';

interface NavbarProps {
  onOpenSearch: () => void;
  onOpenWatchlist: () => void;
  watchlistCount: number;
  onOpenGetStarted: () => void;
  activeNav: string;
  setActiveNav: (nav: string) => void;
  isLiveTicking: boolean;
  setIsLiveTicking: (live: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenSearch,
  onOpenWatchlist,
  watchlistCount,
  onOpenGetStarted,
  activeNav,
  setActiveNav,
  isLiveTicking,
  setIsLiveTicking,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('EN');

  const languages = [
    { code: 'EN', name: 'English' },
    { code: 'ES', name: 'Español' },
    { code: 'DE', name: 'Deutsch' },
    { code: 'FR', name: 'Français' },
    { code: 'JA', name: '日本語' },
    { code: 'ZH', name: '简体中文' },
  ];

  const navLinks = ['Products', 'Community', 'Markets', 'Brokers', 'More'];

  return (
    <nav className="bg-[#0f131e]/90 backdrop-blur-md sticky top-0 z-40 w-full px-4 sm:px-6 h-16 border-b border-[#434656]/50 flex items-center justify-between">
      {/* Left: Brand & Search */}
      <div className="flex items-center gap-5 sm:gap-7">
        <a
          href="#"
          id="brand-logo"
          className="text-xl sm:text-2xl font-headline font-bold text-[#dfe2f2] flex items-center gap-2 hover:text-[#b6c4ff] transition-colors"
        >
          <div className="w-8 h-8 rounded-lg bg-[#2962ff] flex items-center justify-center text-white shadow-sm shadow-[#2962ff]/20">
            <TrendingUp className="w-5 h-5 stroke-[2.5]" />
          </div>
          <span>TradingView</span>
        </a>

        {/* Search Bar (Ctrl+K) */}
        <button
          id="nav-search-btn"
          onClick={onOpenSearch}
          className="relative hidden md:flex items-center w-64 bg-[#262a35] hover:bg-[#313441] border border-[#363A45] hover:border-[#b6c4ff]/50 rounded-full py-1.5 pl-9 pr-3 text-sm text-[#dfe2f2] focus:outline-none transition-all group text-left"
        >
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#c3c5d8] group-hover:text-[#b6c4ff] transition-colors" />
          <span className="text-[#c3c5d8] text-xs font-normal">Search symbols, markets...</span>
          <kbd className="ml-auto text-[10px] font-mono bg-[#1b1f2b] px-1.5 py-0.5 rounded text-[#8d90a2] border border-[#363A45]">
            Ctrl+K
          </kbd>
        </button>
      </div>

      {/* Center Links (Desktop) */}
      <div className="hidden lg:flex items-center gap-7">
        {navLinks.map((link) => {
          const isActive = activeNav === link;
          return (
            <button
              key={link}
              id={`nav-link-${link.toLowerCase()}`}
              onClick={() => setActiveNav(link)}
              className={`font-medium text-sm transition-colors relative py-1 ${
                isActive
                  ? 'text-[#b6c4ff] font-semibold'
                  : 'text-[#c3c5d8] hover:text-[#b6c4ff]'
              }`}
            >
              {link}
              {isActive && (
                <span className="absolute bottom-[-16px] left-0 right-0 h-[2px] bg-[#2962ff] rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Real-time simulation status toggle */}
        <button
          id="toggle-live-feed-btn"
          onClick={() => setIsLiveTicking(!isLiveTicking)}
          title={isLiveTicking ? 'Live Market Ticks Active (Click to pause)' : 'Market Feed Paused (Click to resume)'}
          className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono border transition-all ${
            isLiveTicking
              ? 'bg-[#089981]/15 text-[#089981] border-[#089981]/40'
              : 'bg-[#262a35] text-[#8d90a2] border-[#363A45]'
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              isLiveTicking ? 'bg-[#089981] animate-ping' : 'bg-[#8d90a2]'
            }`}
          />
          <span className="font-semibold">{isLiveTicking ? 'LIVE' : 'PAUSED'}</span>
        </button>

        {/* Watchlist Trigger */}
        <button
          id="watchlist-trigger-btn"
          onClick={onOpenWatchlist}
          title="Open Watchlist"
          className="relative text-[#c3c5d8] hover:text-[#b6c4ff] hover:bg-[#262a35] p-2 rounded-full transition-colors"
        >
          <Star className="w-5 h-5" />
          {watchlistCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-[#2962ff] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {watchlistCount}
            </span>
          )}
        </button>

        {/* Mobile Search Button */}
        <button
          id="mobile-search-btn"
          onClick={onOpenSearch}
          className="md:hidden text-[#c3c5d8] hover:text-[#b6c4ff] p-2 rounded-full transition-colors"
        >
          <Search className="w-5 h-5" />
        </button>

        {/* Language Selector */}
        <div className="relative">
          <button
            id="lang-selector-btn"
            onClick={() => setLangDropdownOpen(!langDropdownOpen)}
            className="text-[#c3c5d8] hover:text-[#b6c4ff] hover:bg-[#262a35] px-2.5 py-1.5 rounded-full transition-colors flex items-center gap-1 text-xs font-semibold"
          >
            <Globe className="w-4 h-4" />
            <span className="hidden sm:inline font-mono">{currentLang}</span>
            <ChevronDown className="w-3 h-3 ml-0.5 opacity-60" />
          </button>

          {langDropdownOpen && (
            <div className="absolute right-0 mt-2 w-36 bg-[#1b1f2b] border border-[#363A45] rounded-xl shadow-2xl py-1 z-50">
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => {
                    setCurrentLang(l.code);
                    setLangDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-[#262a35] ${
                    currentLang === l.code ? 'text-[#2962ff] font-semibold' : 'text-[#dfe2f2]'
                  }`}
                >
                  <span>{l.name}</span>
                  <span className="text-[10px] text-[#8d90a2] font-mono">{l.code}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* User profile / account */}
        <button
          id="user-profile-btn"
          onClick={onOpenGetStarted}
          className="text-[#c3c5d8] hover:text-[#b6c4ff] hover:bg-[#262a35] p-2 rounded-full transition-colors"
          title="Account Profile"
        >
          <User className="w-5 h-5" />
        </button>

        {/* Get Started CTA */}
        <button
          id="get-started-btn"
          onClick={onOpenGetStarted}
          className="bg-[#2962ff] hover:bg-[#004ee8] active:scale-95 text-white px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all shadow-md shadow-[#2962ff]/20"
        >
          Get started
        </button>

        {/* Mobile menu hamburger */}
        <button
          id="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden text-[#c3c5d8] hover:text-white p-2"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed top-16 left-0 right-0 bg-[#0f131e] border-b border-[#363A45] p-4 flex flex-col gap-3 shadow-2xl z-50 animate-in fade-in">
          {navLinks.map((link) => (
            <button
              key={link}
              onClick={() => {
                setActiveNav(link);
                setMobileMenuOpen(false);
              }}
              className={`text-left px-3 py-2 rounded-lg text-sm font-medium ${
                activeNav === link
                  ? 'bg-[#2962ff]/20 text-[#b6c4ff]'
                  : 'text-[#dfe2f2] hover:bg-[#262a35]'
              }`}
            >
              {link}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
};
