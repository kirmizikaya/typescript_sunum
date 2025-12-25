'use client';

import { RequestLog, CFCacheStatus } from '../../types';
import { CACHE_STATUS_CONFIG } from '../../lib/cloudflare-simulator';
import { formatResponseTime } from '../../lib/latency-simulator';
import { cn } from '@/lib/utils';

export interface NetworkTimelineProps {
  requests: RequestLog[];
  showEarlyHints?: boolean;
  showRevalidation?: boolean;
  maxItems?: number;
}

export function NetworkTimeline({ 
  requests, 
  showEarlyHints = false,
  showRevalidation = false,
  maxItems = 10 
}: NetworkTimelineProps) {
  const displayRequests = requests.slice(-maxItems);
  const maxTime = Math.max(...displayRequests.map(r => r.responseTime), 1500);

  if (displayRequests.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-6 text-center shadow-sm">
        <div className="text-gray-400 text-sm">Henüz istek yok</div>
        <div className="text-gray-300 text-xs mt-1">Veri getirmek için butona tıklayın</div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
        <span className="text-sm text-gray-700 font-medium">Network Timeline</span>
        <span className="text-xs text-gray-400">{displayRequests.length} istek</span>
      </div>

      {/* Timeline */}
      <div className="p-4 space-y-2 max-h-96 overflow-y-auto">
        {/* Zaman çizelgesi ölçeği */}
        <div className="flex items-center text-xs text-gray-400 mb-3">
          <span className="w-24 flex-shrink-0">Durum</span>
          <div className="flex-1 flex justify-between px-2">
            <span>0ms</span>
            <span>{Math.round(maxTime / 4)}ms</span>
            <span>{Math.round(maxTime / 2)}ms</span>
            <span>{Math.round(maxTime * 3 / 4)}ms</span>
            <span>{Math.round(maxTime)}ms</span>
          </div>
        </div>

        {displayRequests.map((request, index) => (
          <TimelineItem 
            key={request.id || index}
            request={request}
            maxTime={maxTime}
            showRevalidation={showRevalidation}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
        <div className="flex flex-wrap gap-3 text-xs">
          <LegendItem status="HIT" />
          <LegendItem status="MISS" />
          <LegendItem status="STALE" />
          <LegendItem status="DYNAMIC" />
        </div>
      </div>
    </div>
  );
}

// Tek timeline item
function TimelineItem({ 
  request, 
  maxTime,
  showRevalidation 
}: { 
  request: RequestLog; 
  maxTime: number;
  showRevalidation?: boolean;
}) {
  const config = CACHE_STATUS_CONFIG[request.cacheStatus];
  const widthPercent = (request.responseTime / maxTime) * 100;
  
  return (
    <div className="flex items-center gap-2 group">
      {/* Status badge */}
      <div 
        className={cn(
          'w-20 flex-shrink-0 px-2 py-1 rounded text-xs font-mono text-center border',
          config.bgColor,
          config.textColor,
          config.borderColor
        )}
      >
        {request.cacheStatus}
      </div>

      {/* Bar container */}
      <div className="flex-1 h-6 bg-gray-100 rounded relative overflow-hidden">
        {/* Progress bar */}
        <div
          className="absolute inset-y-0 left-0 rounded transition-all duration-500 flex items-center"
          style={{
            width: `${widthPercent}%`,
            backgroundColor: config.color,
            boxShadow: `0 0 8px ${config.color}30`
          }}
        >
          {widthPercent > 15 && (
            <span className="absolute right-2 text-xs font-mono text-white">
              {formatResponseTime(request.responseTime)}
            </span>
          )}
        </div>
        
        {widthPercent <= 15 && (
          <span 
            className="absolute text-xs font-mono"
            style={{ 
              left: `${widthPercent + 2}%`,
              top: '50%',
              transform: 'translateY(-50%)',
              color: config.color
            }}
          >
            {formatResponseTime(request.responseTime)}
          </span>
        )}
      </div>

      {/* Cache indicator */}
      <div className="w-6 flex-shrink-0 text-center">
        {request.fromCache ? (
          <span className="text-green-500 text-sm" title="Cache'den">⚡</span>
        ) : (
          <span className="text-red-500 text-sm" title="Origin'den">🖥️</span>
        )}
      </div>
    </div>
  );
}

// Legend item
function LegendItem({ status }: { status: CFCacheStatus }) {
  const config = CACHE_STATUS_CONFIG[status];
  
  return (
    <div className="flex items-center gap-1.5">
      <span 
        className="w-2.5 h-2.5 rounded-sm"
        style={{ backgroundColor: config.color }}
      />
      <span className="text-gray-500">{status}</span>
    </div>
  );
}

// Early Hints karşılaştırma
export function EarlyHintsComparison({ enabled }: { enabled: boolean }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-4 shadow-sm">
      <div className="text-sm font-medium text-gray-700">
        Kaynak Yükleme Karşılaştırması
      </div>

      {/* Without Early Hints */}
      <div className="space-y-2">
        <div className="text-xs text-gray-500 flex items-center gap-2">
          <span className={!enabled ? 'text-blue-600 font-medium' : ''}>❌ Early Hints Kapalı</span>
        </div>
        <div className="bg-gray-50 rounded p-2 font-mono text-xs space-y-1">
          <ResourceBar label="HTML" start={0} duration={100} total={350} />
          <ResourceBar label="CSS" start={100} duration={80} total={350} delayed />
          <ResourceBar label="JS" start={180} duration={120} total={350} delayed />
          <ResourceBar label="Font" start={180} duration={60} total={350} delayed />
        </div>
        <div className="text-xs text-gray-400 text-right">Toplam: ~350ms</div>
      </div>

      {/* With Early Hints */}
      <div className="space-y-2">
        <div className="text-xs text-gray-500 flex items-center gap-2">
          <span className={enabled ? 'text-green-600 font-medium' : ''}>✓ Early Hints Açık</span>
        </div>
        <div className="bg-gray-50 rounded p-2 font-mono text-xs space-y-1">
          <ResourceBar label="HTML" start={0} duration={100} total={200} />
          <ResourceBar label="CSS" start={0} duration={80} total={200} parallel />
          <ResourceBar label="JS" start={0} duration={120} total={200} parallel />
          <ResourceBar label="Font" start={0} duration={60} total={200} parallel />
        </div>
        <div className="text-xs text-green-600 text-right">Toplam: ~200ms (%43 hızlı)</div>
      </div>
    </div>
  );
}

// Resource loading bar
function ResourceBar({ 
  label, 
  start, 
  duration, 
  total,
  delayed = false,
  parallel = false
}: { 
  label: string; 
  start: number; 
  duration: number; 
  total: number;
  delayed?: boolean;
  parallel?: boolean;
}) {
  const startPercent = (start / total) * 100;
  const widthPercent = (duration / total) * 100;
  
  return (
    <div className="flex items-center gap-2">
      <span className="w-10 text-gray-400">{label}</span>
      <div className="flex-1 h-4 bg-gray-200 rounded relative">
        <div
          className={cn(
            'absolute inset-y-0 rounded transition-all',
            parallel ? 'bg-green-500' : delayed ? 'bg-yellow-500' : 'bg-blue-500'
          )}
          style={{
            left: `${startPercent}%`,
            width: `${widthPercent}%`
          }}
        />
      </div>
      <span className="w-12 text-right text-gray-400">{duration}ms</span>
    </div>
  );
}
