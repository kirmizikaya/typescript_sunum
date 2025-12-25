'use client';

import { cn } from '@/lib/utils';
import { formatResponseTime, getTTFBZone } from '../../lib/latency-simulator';
import { formatPercentage } from '../../lib/formatters';
import { CFCacheStatus } from '../../types';
import { CACHE_STATUS_CONFIG } from '../../lib/cloudflare-simulator';

export interface PerformanceMetricsPanelProps {
  ttfb: number;
  cacheStatus: CFCacheStatus;
  originCalls: number;
  cacheHits: number;
  cacheMisses: number;
  avgResponseTime?: number;
  showComparison?: boolean;
  comparisonData?: {
    withoutCache: number;
    withCache: number;
  };
}

export function PerformanceMetricsPanel({
  ttfb,
  cacheStatus,
  originCalls,
  cacheHits,
  cacheMisses,
  avgResponseTime,
  showComparison = false,
  comparisonData
}: PerformanceMetricsPanelProps) {
  const zone = getTTFBZone(ttfb);
  const statusConfig = CACHE_STATUS_CONFIG[cacheStatus];
  const hitRate = cacheHits + cacheMisses > 0 
    ? (cacheHits / (cacheHits + cacheMisses)) * 100 
    : 0;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-5 shadow-sm">
      {/* Ana TTFB Göstergesi */}
      <div className="text-center space-y-2">
        <div className="text-gray-500 text-sm">Time to First Byte (TTFB)</div>
        <div 
          className="text-5xl font-mono font-bold"
          style={{ color: zone.color }}
        >
          {formatResponseTime(ttfb)}
        </div>
        <div className="flex items-center justify-center gap-2">
          <span 
            className={cn(
              'px-3 py-1 rounded-full text-sm font-medium border',
              statusConfig.bgColor,
              statusConfig.textColor,
              statusConfig.borderColor
            )}
          >
            {cacheStatus}
          </span>
          <span 
            className="px-3 py-1 rounded-full text-sm"
            style={{ 
              backgroundColor: `${zone.color}10`,
              color: zone.color 
            }}
          >
            {zone.label}
          </span>
        </div>
      </div>

      {/* Metrik Kartları */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard
          label="Origin Çağrıları"
          value={originCalls}
          icon="🖥️"
          color="#ef4444"
        />
        <MetricCard
          label="Cache HIT"
          value={cacheHits}
          icon="✓"
          color="#22c55e"
        />
        <MetricCard
          label="Cache MISS"
          value={cacheMisses}
          icon="✗"
          color="#eab308"
        />
        <MetricCard
          label="Hit Rate"
          value={formatPercentage(hitRate)}
          icon="📊"
          color="#3b82f6"
        />
      </div>

      {/* Ortalama Response Time */}
      {avgResponseTime !== undefined && (
        <div className="text-center py-3 bg-gray-50 rounded-lg">
          <div className="text-gray-400 text-xs mb-1">Ortalama Response Time</div>
          <div className="text-xl font-mono font-semibold text-gray-700">
            {formatResponseTime(avgResponseTime)}
          </div>
        </div>
      )}

      {/* Karşılaştırma */}
      {showComparison && comparisonData && (
        <ComparisonBar 
          withoutCache={comparisonData.withoutCache} 
          withCache={comparisonData.withCache} 
        />
      )}
    </div>
  );
}

// Tek metrik kartı
function MetricCard({ 
  label, 
  value, 
  icon, 
  color 
}: { 
  label: string; 
  value: string | number; 
  icon: string; 
  color: string;
}) {
  return (
    <div className="bg-gray-50 rounded-lg p-3 text-center">
      <div className="text-xl mb-1">{icon}</div>
      <div 
        className="text-2xl font-bold font-mono"
        style={{ color }}
      >
        {value}
      </div>
      <div className="text-xs text-gray-400 mt-1">{label}</div>
    </div>
  );
}

// Karşılaştırma bar'ı
function ComparisonBar({ 
  withoutCache, 
  withCache 
}: { 
  withoutCache: number; 
  withCache: number;
}) {
  const improvement = ((withoutCache - withCache) / withoutCache * 100).toFixed(0);
  
  return (
    <div className="space-y-3 pt-3 border-t border-gray-100">
      <div className="text-sm text-gray-500 text-center">Performans Karşılaştırması</div>
      
      {/* Cache Yok */}
      <div className="space-y-1">
        <div className="flex justify-between text-sm">
          <span className="text-red-500">❌ Cache Yok</span>
          <span className="font-mono text-red-500">{formatResponseTime(withoutCache)}</span>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-red-500 rounded-full"
            style={{ width: '100%' }}
          />
        </div>
      </div>

      {/* Cache Var */}
      <div className="space-y-1">
        <div className="flex justify-between text-sm">
          <span className="text-green-500">✓ Edge Cache</span>
          <span className="font-mono text-green-500">{formatResponseTime(withCache)}</span>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-green-500 rounded-full transition-all duration-700"
            style={{ width: `${(withCache / withoutCache) * 100}%` }}
          />
        </div>
      </div>

      {/* Sonuç */}
      <div className="text-center py-2 bg-green-50 border border-green-200 rounded-lg">
        <span className="text-green-600 font-bold text-lg">%{improvement}</span>
        <span className="text-gray-500 text-sm"> daha hızlı</span>
      </div>
    </div>
  );
}

// Request sayacı
export function RequestCounter({ 
  count, 
  label = 'Toplam İstek' 
}: { 
  count: number; 
  label?: string;
}) {
  return (
    <div className="flex items-center gap-3 bg-white rounded-lg px-4 py-2 border border-gray-200 shadow-sm">
      <div className="text-2xl">📊</div>
      <div>
        <div className="text-2xl font-mono font-bold text-gray-800">{count}</div>
        <div className="text-xs text-gray-400">{label}</div>
      </div>
    </div>
  );
}

// Origin hit sayacı
export function OriginHitCounter({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
      <div className="text-2xl">🖥️</div>
      <div>
        <div className="text-2xl font-mono font-bold text-red-500">{count}</div>
        <div className="text-xs text-red-400">Origin Çağrısı</div>
      </div>
    </div>
  );
}
