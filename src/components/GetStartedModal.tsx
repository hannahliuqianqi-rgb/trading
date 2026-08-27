import React, { useState } from 'react';
import { X, TrendingUp, Check, Shield, Zap, Sparkles } from 'lucide-react';

interface GetStartedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GetStartedModal: React.FC<GetStartedModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div
        className="bg-[#171b26] border border-[#363A45] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-[#363A45] flex items-center justify-between bg-[#1b1f2b]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#2962ff] flex items-center justify-center text-white">
              <TrendingUp className="w-5 h-5 stroke-[2.5]" />
            </div>
            <span className="font-headline font-bold text-white text-lg">TradingView Account</span>
          </div>

          <button onClick={onClose} className="text-[#8d90a2] hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#089981]/20 text-[#089981] mx-auto flex items-center justify-center">
              <Check className="w-6 h-6 stroke-[3]" />
            </div>
            <h4 className="text-xl font-bold text-white font-headline">Welcome to TradingView!</h4>
            <p className="text-xs text-[#c3c5d8]">
              Your workspace is ready with real-time streaming market data and unlimited chart layouts.
            </p>
          </div>
        ) : (
          <div className="p-6 space-y-5">
            <div className="text-center space-y-1">
              <h3 className="text-xl font-bold text-white font-headline">Look first / Then leap</h3>
              <p className="text-xs text-[#c3c5d8]">
                Join 50+ million traders & investors around the world making smarter decisions.
              </p>
            </div>

            <div className="space-y-2 text-xs text-[#dfe2f2]">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#089981]" />
                <span>Zero latency quotes across all global asset classes</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#089981]" />
                <span>Multi-timeframe candlestick & indicator overlays</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#089981]" />
                <span>Custom price alerts & synced cloud watchlists</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 pt-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full bg-[#1b1f2b] border border-[#363A45] focus:border-[#2962ff] rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none placeholder-[#8d90a2]"
              />

              <button
                type="submit"
                className="w-full bg-[#2962ff] hover:bg-[#004ee8] active:scale-98 text-white py-2.5 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-[#2962ff]/25"
              >
                Continue with Email
              </button>
            </form>

            <p className="text-[11px] text-[#8d90a2] text-center leading-relaxed">
              By proceeding, you agree to TradingView's Terms of Service and Privacy Policy.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
