import React from 'react';
import { TrendingUp, Globe2, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onOpenGetStarted: () => void;
  onOpenSearch: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenGetStarted, onOpenSearch }) => {
  return (
    <footer className="w-full py-12 px-4 sm:px-6 max-w-[1280px] mx-auto border-t border-[#434656]/50 mt-12 bg-[#0a0e19] text-[#c3c5d8]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        {/* Brand info */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-white font-headline font-bold text-lg">
            <div className="w-6 h-6 rounded-md bg-[#2962ff] flex items-center justify-center text-white">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
            <span>TradingView</span>
          </div>
          <p className="text-xs text-[#8d90a2]">© 2024 TradingView, Inc. All rights reserved.</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="w-2 h-2 rounded-full bg-[#089981] animate-pulse"></span>
            <span className="text-[11px] text-[#089981] font-mono font-medium">
              Market feeds operating normally
            </span>
          </div>
        </div>

        {/* Links */}
        <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm">
          {['Features', 'News', 'Pricing', 'About', 'Contact', 'Terms'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              onClick={(e) => {
                e.preventDefault();
                if (item === 'Features' || item === 'Pricing') {
                  onOpenGetStarted();
                } else if (item === 'News') {
                  onOpenSearch();
                }
              }}
              className="text-[#c3c5d8] hover:text-[#b6c4ff] underline transition-colors"
            >
              {item}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};
