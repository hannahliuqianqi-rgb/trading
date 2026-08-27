import React, { useState } from 'react';
import { MarketItem, MarketIndex, PriceAlert } from '../types';
import { Bell, X, Check, ShieldAlert } from 'lucide-react';

interface AlertModalProps {
  item: MarketItem | MarketIndex | null;
  onClose: () => void;
  onSaveAlert: (alert: PriceAlert) => void;
}

export const AlertModal: React.FC<AlertModalProps> = ({ item, onClose, onSaveAlert }) => {
  if (!item) return null;

  const symbol = 'symbol' in item ? item.symbol : item.name;
  const [targetPrice, setTargetPrice] = useState<string>(item.price.toString());
  const [condition, setCondition] = useState<'above' | 'below'>('above');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = parseFloat(targetPrice);
    if (isNaN(priceNum) || priceNum <= 0) return;

    const newAlert: PriceAlert = {
      id: `alert-${Date.now()}`,
      symbol,
      targetPrice: priceNum,
      condition,
      createdAt: new Date().toLocaleTimeString(),
    };

    onSaveAlert(newAlert);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div
        className="bg-[#171b26] border border-[#363A45] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-[#363A45] flex items-center justify-between bg-[#1b1f2b]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#2962ff]/20 text-[#2962ff] flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Create Price Alert</h3>
              <p className="text-xs text-[#8d90a2]">{symbol} • Current: ${item.price.toFixed(2)}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-[#8d90a2] hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {savedSuccess ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#089981]/20 text-[#089981] mx-auto flex items-center justify-center">
              <Check className="w-6 h-6 stroke-[3]" />
            </div>
            <h4 className="text-lg font-bold text-white">Alert Configured!</h4>
            <p className="text-xs text-[#c3c5d8]">
              You will be notified when {symbol} crosses ${parseFloat(targetPrice).toFixed(2)}.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSave} className="p-5 space-y-4">
            <div>
              <label className="text-xs font-semibold text-[#c3c5d8] block mb-1.5">
                Trigger Condition
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setCondition('above')}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all ${
                    condition === 'above'
                      ? 'bg-[#089981]/20 text-[#089981] border-[#089981]'
                      : 'bg-[#1b1f2b] text-[#8d90a2] border-[#363A45] hover:text-white'
                  }`}
                >
                  Price Rises Above (≥)
                </button>
                <button
                  type="button"
                  onClick={() => setCondition('below')}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all ${
                    condition === 'below'
                      ? 'bg-[#F23645]/20 text-[#F23645] border-[#F23645]'
                      : 'bg-[#1b1f2b] text-[#8d90a2] border-[#363A45] hover:text-white'
                  }`}
                >
                  Price Drops Below (≤)
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#c3c5d8] block mb-1.5">
                Target Threshold Price ($)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="any"
                  id="target-price-input"
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(e.target.value)}
                  className="w-full bg-[#1b1f2b] border border-[#363A45] focus:border-[#2962ff] rounded-xl py-2 px-3 text-sm font-mono text-white focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-medium text-[#c3c5d8] hover:bg-[#262a35] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                id="save-alert-btn"
                className="bg-[#2962ff] hover:bg-[#004ee8] active:scale-95 text-white px-5 py-2 rounded-xl text-xs font-semibold transition-all shadow-md shadow-[#2962ff]/20"
              >
                Set Alert
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
