'use client';

import { useEffect, useState } from 'react';
import { getTTFBZone, formatResponseTime } from '../../lib/latency-simulator';
import { cn } from '@/lib/utils';

export interface TTFBGaugeProps {
  value: number;
  maxValue?: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

export function TTFBGauge({ 
  value, 
  maxValue = 1500, 
  showLabel = true,
  size = 'md',
  animated = true 
}: TTFBGaugeProps) {
  const [displayValue, setDisplayValue] = useState(animated ? 0 : value);
  const zone = getTTFBZone(value);
  
  useEffect(() => {
    if (!animated) {
      setDisplayValue(value);
      return;
    }

    // Animasyonlu sayaç
    const duration = 500;
    const steps = 30;
    const increment = value / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.round(current));
      }
    }, duration / steps);
    
    return () => clearInterval(timer);
  }, [value, animated]);

  const percentage = Math.min((value / maxValue) * 100, 100);

  const sizes = {
    sm: { height: 'h-2', text: 'text-lg', label: 'text-xs' },
    md: { height: 'h-3', text: 'text-2xl', label: 'text-sm' },
    lg: { height: 'h-4', text: 'text-4xl', label: 'text-base' }
  };

  return (
    <div className="space-y-2">
      {/* Değer ve Label */}
      <div className="flex items-baseline justify-between">
        <div className="flex items-baseline gap-2">
          <span 
            className={cn('font-mono font-bold', sizes[size].text)}
            style={{ color: zone.color }}
          >
            {formatResponseTime(displayValue)}
          </span>
          {showLabel && (
            <span className={cn('text-gray-500', sizes[size].label)}>TTFB</span>
          )}
        </div>
        <span 
          className={cn('font-medium px-2 py-0.5 rounded-full text-xs')}
          style={{ 
            backgroundColor: `${zone.color}15`,
            color: zone.color 
          }}
        >
          {zone.label}
        </span>
      </div>

      {/* Progress Bar */}
      <div className={cn('w-full bg-gray-200 rounded-full overflow-hidden', sizes[size].height)}>
        {/* Zone göstergeleri */}
        <div className="relative h-full">
          <div 
            className="absolute inset-y-0 left-0 transition-all duration-500 ease-out rounded-full"
            style={{ 
              width: `${percentage}%`,
              backgroundColor: zone.color,
              boxShadow: `0 0 10px ${zone.color}50`
            }}
          />
          
          {/* Zone işaretleri */}
          <div className="absolute inset-0 flex">
            <div className="w-[6.67%] border-r border-gray-300/50" title="100ms" />
            <div className="w-[13.33%] border-r border-gray-300/50" title="300ms" />
            <div className="w-[26.67%] border-r border-gray-300/50" title="600ms" />
          </div>
        </div>
      </div>

      {/* Zone etiketleri */}
      <div className="flex text-[10px] text-gray-400">
        <div className="w-[6.67%]">0</div>
        <div className="w-[13.33%]">100ms</div>
        <div className="w-[26.67%]">300ms</div>
        <div className="flex-1">600ms</div>
        <div className="text-right">{maxValue}ms</div>
      </div>
    </div>
  );
}

// Karşılaştırmalı TTFB
export function TTFBComparison({ 
  withoutCache, 
  withCache,
  size = 'md' 
}: { 
  withoutCache: number; 
  withCache: number;
  size?: 'sm' | 'md' | 'lg';
}) {
  const improvement = ((withoutCache - withCache) / withoutCache * 100).toFixed(0);
  const withoutZone = getTTFBZone(withoutCache);
  const withZone = getTTFBZone(withCache);

  return (
    <div className="space-y-4">
      {/* Cache Yok */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            Cache Yok (Origin)
          </span>
          <span className="font-mono" style={{ color: withoutZone.color }}>
            {formatResponseTime(withoutCache)}
          </span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full rounded-full transition-all duration-700"
            style={{ 
              width: '100%',
              backgroundColor: withoutZone.color 
            }}
          />
        </div>
      </div>

      {/* Cache Var */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            Edge Cache (HIT)
          </span>
          <span className="font-mono" style={{ color: withZone.color }}>
            {formatResponseTime(withCache)}
          </span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full rounded-full transition-all duration-700"
            style={{ 
              width: `${(withCache / withoutCache) * 100}%`,
              backgroundColor: withZone.color 
            }}
          />
        </div>
      </div>

      {/* İyileşme */}
      <div className="text-center py-2 px-4 bg-green-50 border border-green-200 rounded-lg">
        <span className="text-green-600 font-semibold text-lg">
          %{improvement} Daha Hızlı
        </span>
        <span className="text-gray-500 text-sm block">
          {formatResponseTime(withoutCache - withCache)} tasarruf
        </span>
      </div>
    </div>
  );
}

// Mini TTFB göstergesi
export function TTFBMini({ value }: { value: number }) {
  const zone = getTTFBZone(value);
  
  return (
    <div className="flex items-center gap-2">
      <span 
        className="w-2 h-2 rounded-full"
        style={{ backgroundColor: zone.color }}
      />
      <span 
        className="font-mono text-sm font-medium"
        style={{ color: zone.color }}
      >
        {formatResponseTime(value)}
      </span>
    </div>
  );
}
