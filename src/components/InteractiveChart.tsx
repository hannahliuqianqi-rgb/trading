import React, { useState, useRef, useEffect } from 'react';
import { PricePoint, Timeframe, ChartType } from '../types';
import { Sparkles, BarChart2, TrendingUp } from 'lucide-react';

interface InteractiveChartProps {
  data: PricePoint[];
  symbol: string;
  name: string;
  currentPrice: number;
  change: number;
  changePercent: number;
  selectedTimeframe: Timeframe;
  onTimeframeChange: (tf: Timeframe) => void;
  currency?: string;
  height?: number;
}

export const InteractiveChart: React.FC<InteractiveChartProps> = ({
  data,
  symbol,
  name,
  currentPrice,
  change,
  changePercent,
  selectedTimeframe,
  onTimeframeChange,
  currency = 'USD',
  height = 360,
}) => {
  const [chartType, setChartType] = useState<ChartType>('line');
  const [hoveredPoint, setHoveredPoint] = useState<PricePoint | null>(null);
  const [hoverX, setHoverX] = useState<number | null>(null);
  const [hoverY, setHoverY] = useState<number | null>(null);
  const [showMa, setShowMa] = useState<boolean>(true);
  const [containerWidth, setContainerWidth] = useState<number>(720);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };
    updateSize();
    const observer = new ResizeObserver(updateSize);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const timeframes: Timeframe[] = ['1D', '5D', '1M', '3M', '6M', '1Y', '5Y', 'ALL'];

  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-[#c3c5d8]">
        Loading chart data...
      </div>
    );
  }

  const prices = data.map((d) => d.close || d.price);
  const minPrice = Math.min(...data.map((d) => d.low || d.price));
  const maxPrice = Math.max(...data.map((d) => d.high || d.price));
  const priceRange = maxPrice - minPrice || 1;

  const maxVolume = Math.max(...data.map((d) => d.volume || 1000));

  const padLeft = 12;
  const padRight = 64;
  const padTop = 20;
  const padBottom = 40;
  const chartWidth = Math.max(containerWidth - padLeft - padRight, 100);
  const chartHeight = height - padTop - padBottom;
  const volumeHeight = chartHeight * 0.22;

  // Coordinate transforms
  const getX = (index: number) => padLeft + (index / (data.length - 1)) * chartWidth;
  const getY = (val: number) => padTop + chartHeight - ((val - minPrice) / priceRange) * chartHeight;

  // Simple Moving Average (SMA 7)
  const smaPeriod = 5;
  const smaPoints: { x: number; y: number }[] = [];
  if (showMa && data.length >= smaPeriod) {
    for (let i = smaPeriod - 1; i < data.length; i++) {
      const slice = prices.slice(i - smaPeriod + 1, i + 1);
      const avg = slice.reduce((a, b) => a + b, 0) / smaPeriod;
      smaPoints.push({ x: getX(i), y: getY(avg) });
    }
  }

  // Path generators
  const linePoints = data.map((d, i) => `${getX(i).toFixed(1)},${getY(d.close || d.price).toFixed(1)}`).join(' ');
  const areaPath = `M ${getX(0)},${getY(prices[0])} L ${data
    .map((d, i) => `${getX(i).toFixed(1)},${getY(d.close || d.price).toFixed(1)}`)
    .join(' L ')} L ${getX(data.length - 1)},${padTop + chartHeight} L ${getX(0)},${padTop + chartHeight} Z`;

  const isPositive = (hoveredPoint ? hoveredPoint.price - data[0].price : change) >= 0;
  const strokeColor = isPositive ? '#089981' : '#F23645';

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    if (mouseX < padLeft || mouseX > padLeft + chartWidth) {
      setHoveredPoint(null);
      setHoverX(null);
      setHoverY(null);
      return;
    }
    const relativeX = (mouseX - padLeft) / chartWidth;
    const index = Math.min(
      Math.max(Math.round(relativeX * (data.length - 1)), 0),
      data.length - 1
    );
    const point = data[index];
    setHoveredPoint(point);
    setHoverX(getX(index));
    setHoverY(getY(point.close || point.price));
  };

  const handleMouseLeave = () => {
    setHoveredPoint(null);
    setHoverX(null);
    setHoverY(null);
  };

  // Price y-axis levels (4 levels)
  const yTicks = [
    maxPrice,
    maxPrice - priceRange * 0.33,
    maxPrice - priceRange * 0.66,
    minPrice,
  ];

  const activePoint = hoveredPoint || data[data.length - 1];
  const displayPrice = activePoint.close || activePoint.price;
  const displayChange = activePoint.price - data[0].price;
  const displayChangePercent = ((displayChange / data[0].price) * 100);

  return (
    <div ref={containerRef} className="w-full bg-[#1b1f2b] border border-[#363A45] rounded-xl p-4 flex flex-col gap-3">
      {/* Top Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#363A45]">
        <div className="flex items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold font-headline text-white">{symbol}</span>
              <span className="text-sm text-[#c3c5d8] truncate max-w-[200px]">{name}</span>
            </div>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-bold font-mono text-white">
                {currency === '%' ? '' : currency === 'JPY' ? '¥' : currency === 'EUR' ? '€' : '$'}
                {displayPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                {currency === '%' ? '%' : ''}
              </span>
              <span
                className={`text-sm font-mono font-medium flex items-center ${
                  displayChange >= 0 ? 'text-[#089981]' : 'text-[#F23645]'
                }`}
              >
                {displayChange >= 0 ? '+' : ''}
                {displayChange.toFixed(2)} ({displayChange >= 0 ? '+' : ''}
                {displayChangePercent.toFixed(2)}%)
              </span>
            </div>
          </div>
        </div>

        {/* Chart type & indicator toggles */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="bg-[#262a35] rounded-lg p-0.5 flex items-center border border-[#363A45]">
            <button
              id="chart-type-line-btn"
              onClick={() => setChartType('line')}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                chartType === 'line' ? 'bg-[#2962ff] text-white' : 'text-[#c3c5d8] hover:text-white'
              }`}
            >
              Line
            </button>
            <button
              id="chart-type-candle-btn"
              onClick={() => setChartType('candlestick')}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                chartType === 'candlestick' ? 'bg-[#2962ff] text-white' : 'text-[#c3c5d8] hover:text-white'
              }`}
            >
              Candles
            </button>
          </div>

          <button
            id="toggle-ma-btn"
            onClick={() => setShowMa(!showMa)}
            className={`px-2.5 py-1 text-xs font-medium rounded border transition-colors flex items-center gap-1 ${
              showMa
                ? 'bg-[#2962ff]/20 text-[#b6c4ff] border-[#2962ff]/40'
                : 'bg-[#262a35] text-[#c3c5d8] border-[#363A45] hover:text-white'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            SMA(5)
          </button>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative w-full select-none" style={{ height: `${height}px` }}>
        <svg
          width="100%"
          height={height}
          className="overflow-visible cursor-crosshair"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <defs>
            <linearGradient id="area-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={strokeColor} stopOpacity="0.28" />
              <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid horizontal lines */}
          {yTicks.map((val, idx) => {
            const y = getY(val);
            return (
              <g key={idx}>
                <line
                  x1={padLeft}
                  y1={y}
                  x2={containerWidth - padRight}
                  y2={y}
                  stroke="#363A45"
                  strokeDasharray="3 3"
                  strokeOpacity="0.5"
                />
                <text
                  x={containerWidth - padRight + 6}
                  y={y + 4}
                  fill="#8d90a2"
                  fontSize="10"
                  fontFamily="JetBrains Mono"
                >
                  {val.toFixed(2)}
                </text>
              </g>
            );
          })}

          {/* Volume Histogram (at the bottom) */}
          {data.map((d, idx) => {
            const barWidth = Math.max(chartWidth / data.length - 2, 2);
            const vHeight = ((d.volume || 1000) / maxVolume) * volumeHeight;
            const barX = getX(idx) - barWidth / 2;
            const barY = padTop + chartHeight - vHeight;
            const isUp = (d.close || d.price) >= (d.open || d.price);

            return (
              <rect
                key={`vol-${idx}`}
                x={barX}
                y={barY}
                width={barWidth}
                height={vHeight}
                fill={isUp ? 'rgba(8, 153, 129, 0.25)' : 'rgba(242, 54, 69, 0.25)'}
              />
            );
          })}

          {/* Area & Line mode */}
          {chartType === 'line' && (
            <>
              <path d={areaPath} fill="url(#area-grad)" />
              <polyline
                fill="none"
                stroke={strokeColor}
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={linePoints}
              />
            </>
          )}

          {/* Candlestick mode */}
          {chartType === 'candlestick' &&
            data.map((d, idx) => {
              const x = getX(idx);
              const openY = getY(d.open || d.price);
              const closeY = getY(d.close || d.price);
              const highY = getY(d.high || Math.max(d.open || d.price, d.close || d.price));
              const lowY = getY(d.low || Math.min(d.open || d.price, d.close || d.price));

              const isCandleGreen = (d.close || d.price) >= (d.open || d.price);
              const candleColor = isCandleGreen ? '#089981' : '#F23645';
              const candleWidth = Math.max(chartWidth / data.length - 3, 3);

              return (
                <g key={`candle-${idx}`}>
                  {/* Wick */}
                  <line
                    x1={x}
                    y1={highY}
                    x2={x}
                    y2={lowY}
                    stroke={candleColor}
                    strokeWidth="1.2"
                  />
                  {/* Body */}
                  <rect
                    x={x - candleWidth / 2}
                    y={Math.min(openY, closeY)}
                    width={candleWidth}
                    height={Math.max(Math.abs(closeY - openY), 1.5)}
                    fill={candleColor}
                    stroke={candleColor}
                    strokeWidth="0.5"
                    rx="0.5"
                  />
                </g>
              );
            })}

          {/* Moving Average line */}
          {showMa && smaPoints.length > 1 && (
            <polyline
              fill="none"
              stroke="#b6c4ff"
              strokeWidth="1.5"
              strokeDasharray="4 2"
              points={smaPoints.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')}
            />
          )}

          {/* Crosshairs & Active Indicator on Hover */}
          {hoverX !== null && hoverY !== null && hoveredPoint && (
            <g>
              {/* Vertical Crosshair */}
              <line
                x1={hoverX}
                y1={padTop}
                x2={hoverX}
                y2={padTop + chartHeight}
                stroke="#8d90a2"
                strokeWidth="1"
                strokeDasharray="3 3"
              />
              {/* Horizontal Crosshair */}
              <line
                x1={padLeft}
                y1={hoverY}
                x2={containerWidth - padRight}
                y2={hoverY}
                stroke="#8d90a2"
                strokeWidth="1"
                strokeDasharray="3 3"
              />
              {/* Dot on price point */}
              <circle
                cx={hoverX}
                cy={hoverY}
                r="4.5"
                fill={strokeColor}
                stroke="#ffffff"
                strokeWidth="2"
              />
              {/* Price Callout badge */}
              <rect
                x={containerWidth - padRight + 2}
                y={hoverY - 10}
                width={56}
                height={20}
                fill="#2962ff"
                rx="3"
              />
              <text
                x={containerWidth - padRight + 6}
                y={hoverY + 4}
                fill="#ffffff"
                fontSize="10"
                fontFamily="JetBrains Mono"
                fontWeight="bold"
              >
                {(hoveredPoint.close || hoveredPoint.price).toFixed(2)}
              </text>
            </g>
          )}

          {/* Time x-axis labels */}
          {data
            .filter((_, idx) => idx % Math.max(Math.floor(data.length / 5), 1) === 0)
            .map((d, idx, arr) => {
              const originalIndex = data.indexOf(d);
              return (
                <text
                  key={`time-${idx}`}
                  x={getX(originalIndex)}
                  y={padTop + chartHeight + 22}
                  fill="#8d90a2"
                  fontSize="10"
                  fontFamily="Inter"
                  textAnchor="middle"
                >
                  {d.time}
                </text>
              );
            })}
        </svg>
      </div>

      {/* Timeframe Selectors */}
      <div className="flex items-center justify-between pt-2 border-t border-[#363A45] overflow-x-auto">
        <div className="flex items-center gap-1">
          {timeframes.map((tf) => (
            <button
              key={tf}
              id={`tf-btn-${tf}`}
              onClick={() => onTimeframeChange(tf)}
              className={`px-3 py-1 text-xs font-semibold rounded transition-colors ${
                selectedTimeframe === tf
                  ? 'bg-[#2962ff] text-white shadow-sm'
                  : 'text-[#c3c5d8] hover:bg-[#262a35] hover:text-white'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>

        <div className="text-xs text-[#8d90a2] flex items-center gap-3">
          {hoveredPoint && (
            <span>
              Vol: <strong className="text-white font-mono">{hoveredPoint.volume?.toLocaleString() || 'N/A'}</strong>
            </span>
          )}
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#089981] animate-pulse"></span>
            Real-time feed
          </span>
        </div>
      </div>
    </div>
  );
};
