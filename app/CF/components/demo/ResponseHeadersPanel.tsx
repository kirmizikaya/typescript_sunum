'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { CACHE_STATUS_CONFIG } from '../../lib/cloudflare-simulator';
import { CFCacheStatus } from '../../types';

export interface ResponseHeadersPanelProps {
  headers: Record<string, string>;
  highlightKeys?: string[];
  showTimestamp?: boolean;
  collapsed?: boolean;
}

const DEFAULT_HIGHLIGHT_KEYS = [
  'CF-Cache-Status',
  'Cache-Control',
  'Age',
  'CF-Ray'
];

export function ResponseHeadersPanel({ 
  headers, 
  highlightKeys = DEFAULT_HIGHLIGHT_KEYS,
  showTimestamp = true,
  collapsed: initialCollapsed = false
}: ResponseHeadersPanelProps) {
  const [collapsed, setCollapsed] = useState(initialCollapsed);
  
  const cacheStatus = headers['CF-Cache-Status'] as CFCacheStatus;
  const statusConfig = cacheStatus ? CACHE_STATUS_CONFIG[cacheStatus] : null;

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden font-mono text-sm shadow-sm">
      {/* Header */}
      <div 
        className="flex items-center justify-between px-4 py-3 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors border-b border-gray-200"
        onClick={() => setCollapsed(!collapsed)}
      >
        <div className="flex items-center gap-3">
          <span className="text-gray-600 font-medium">Response Headers</span>
          {statusConfig && (
            <span 
              className={cn(
                'px-2 py-0.5 rounded text-xs font-semibold border',
                statusConfig.bgColor,
                statusConfig.textColor,
                statusConfig.borderColor
              )}
            >
              {cacheStatus}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 text-gray-400">
          {showTimestamp && (
            <span className="text-xs">
              {new Date().toLocaleTimeString('tr-TR')}
            </span>
          )}
          <svg 
            className={cn(
              'w-4 h-4 transition-transform duration-200',
              !collapsed && 'rotate-180'
            )}
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Content */}
      {!collapsed && (
        <div className="p-4 space-y-1 max-h-96 overflow-y-auto bg-gray-50/50">
          {Object.entries(headers).map(([key, value]) => {
            const isHighlighted = highlightKeys.includes(key);
            const isCacheStatus = key === 'CF-Cache-Status';
            
            return (
              <div 
                key={key}
                className={cn(
                  'flex py-1 rounded px-2 -mx-2',
                  isHighlighted && 'bg-blue-50'
                )}
              >
                <span className={cn(
                  'w-44 flex-shrink-0',
                  isHighlighted ? 'text-blue-600' : 'text-gray-500'
                )}>
                  {key}:
                </span>
                <span className={cn(
                  isCacheStatus ? statusConfig?.textColor : 'text-gray-800'
                )}>
                  {value}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Tek satırlık header gösterimi
export function HeaderLine({ 
  name, 
  value, 
  highlighted = false 
}: { 
  name: string; 
  value: string; 
  highlighted?: boolean;
}) {
  return (
    <div className={cn(
      'flex items-center gap-2 font-mono text-sm py-1 px-2 rounded',
      highlighted && 'bg-blue-50'
    )}>
      <span className={cn(
        highlighted ? 'text-blue-600' : 'text-gray-500'
      )}>
        {name}:
      </span>
      <span className="text-gray-800">{value}</span>
    </div>
  );
}

// Cache-Control açıklaması
export function CacheControlExplainer({ value }: { value: string }) {
  const directives = value.split(',').map(d => d.trim());
  
  const explanations: Record<string, string> = {
    'public': 'Herkes cache\'leyebilir (CDN, browser)',
    'private': 'Sadece browser cache\'leyebilir',
    'no-store': 'Hiçbir cache yapılmamalı',
    'no-cache': 'Her seferinde revalidate et',
    'max-age': 'Browser\'da bu kadar saniye cache\'le',
    's-maxage': 'CDN\'de bu kadar saniye cache\'le',
    'stale-while-revalidate': 'Eski veriyi sun, arka planda güncelle',
    'must-revalidate': 'Expire olunca mutlaka revalidate et'
  };

  return (
    <div className="space-y-2">
      <div className="font-mono text-sm text-gray-600 bg-gray-100 px-3 py-2 rounded">
        Cache-Control: {value}
      </div>
      <div className="grid gap-2">
        {directives.map((directive, i) => {
          const [key] = directive.split('=');
          const explanation = explanations[key] || 'Bilinmeyen direktif';
          
          return (
            <div 
              key={i}
              className="flex items-start gap-2 text-sm"
            >
              <code className="px-1.5 py-0.5 bg-blue-50 rounded text-blue-600 text-xs border border-blue-100">
                {directive}
              </code>
              <span className="text-gray-600">{explanation}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
