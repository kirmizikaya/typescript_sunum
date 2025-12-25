'use client';

import { CFCacheStatus } from '../../types';
import { CACHE_STATUS_CONFIG } from '../../lib/cloudflare-simulator';
import { cn } from '@/lib/utils';

export interface CacheStatusBadgeProps {
  status: CFCacheStatus;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  showTooltip?: boolean;
  showIcon?: boolean;
}

const STATUS_ICONS: Record<CFCacheStatus, string> = {
  HIT: '✓',
  MISS: '✗',
  EXPIRED: '⏰',
  STALE: '⚡',
  BYPASS: '⊘',
  REVALIDATED: '↻',
  UPDATING: '⟳',
  DYNAMIC: '◆'
};

export function CacheStatusBadge({ 
  status, 
  size = 'md', 
  animated = true,
  showTooltip = true,
  showIcon = true
}: CacheStatusBadgeProps) {
  const config = CACHE_STATUS_CONFIG[status];
  
  const sizes = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-3 py-1.5 text-sm gap-1.5',
    lg: 'px-4 py-2 text-base gap-2'
  };

  const iconSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  // Animasyonlar
  const shouldPulse = animated && (status === 'STALE' || status === 'UPDATING');
  const shouldSpin = animated && status === 'UPDATING';

  return (
    <div className="relative group">
      <span 
        className={cn(
          'inline-flex items-center font-mono font-semibold rounded-lg border-2 transition-all duration-300 bg-white',
          config.borderColor,
          config.textColor,
          sizes[size],
          shouldPulse && 'animate-pulse'
        )}
        style={{ 
          boxShadow: `0 0 15px ${config.color}20`,
        }}
      >
        {showIcon && (
          <span className={cn(
            iconSizes[size],
            shouldSpin && 'animate-spin'
          )}>
            {STATUS_ICONS[status]}
          </span>
        )}
        <span className="text-gray-600">CF-Cache-Status:</span>
        <span className="font-bold">{status}</span>
      </span>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50 pointer-events-none">
          <div className="font-semibold mb-1">{status}</div>
          <div className="text-gray-300">{config.descriptionTR}</div>
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
            <div className="border-4 border-transparent border-t-gray-900" />
          </div>
        </div>
      )}
    </div>
  );
}

// Küçük versiyon (sadece status gösterir)
export function CacheStatusDot({ status }: { status: CFCacheStatus }) {
  const config = CACHE_STATUS_CONFIG[status];
  
  return (
    <span 
      className="inline-block w-3 h-3 rounded-full"
      style={{ backgroundColor: config.color }}
      title={`${status}: ${config.descriptionTR}`}
    />
  );
}

// Tüm status'ları gösteren legend
export function CacheStatusLegend() {
  const statuses: CFCacheStatus[] = ['HIT', 'MISS', 'EXPIRED', 'STALE', 'BYPASS', 'REVALIDATED', 'UPDATING', 'DYNAMIC'];
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {statuses.map((status) => {
        const config = CACHE_STATUS_CONFIG[status];
        return (
          <div 
            key={status}
            className={cn(
              'flex items-center gap-2 p-2 rounded-lg border bg-white',
              config.borderColor
            )}
          >
            <span 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: config.color }}
            />
            <div>
              <div className={cn('font-mono text-xs font-semibold', config.textColor)}>
                {status}
              </div>
              <div className="text-xs text-gray-500 truncate max-w-[120px]">
                {config.descriptionTR}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
