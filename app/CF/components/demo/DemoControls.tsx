'use client';

import { Button } from '../ui/Button';
import { CacheStrategy } from '../../types';
import { cn } from '@/lib/utils';

export interface DemoControlsProps {
  onClearCache: () => void;
  onReset: () => void;
  onFetchData: () => void;
  isLoading?: boolean;
  cacheStrategy?: CacheStrategy;
  onStrategyChange?: (strategy: CacheStrategy) => void;
  earlyHints?: boolean;
  onToggleEarlyHints?: (enabled: boolean) => void;
  showStrategySelect?: boolean;
  showEarlyHintsToggle?: boolean;
}

export function DemoControls({
  onClearCache,
  onReset,
  onFetchData,
  isLoading = false,
  cacheStrategy,
  onStrategyChange,
  earlyHints = false,
  onToggleEarlyHints,
  showStrategySelect = false,
  showEarlyHintsToggle = false
}: DemoControlsProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-4 shadow-sm">
      <div className="text-sm font-medium text-gray-700 mb-3">Demo Kontrolleri</div>
      
      {/* Ana Butonlar */}
      <div className="flex flex-wrap gap-3">
        <Button
          onClick={onFetchData}
          loading={isLoading}
          disabled={isLoading}
          variant="primary"
          size="md"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Veri Getir
        </Button>

        <Button
          onClick={onClearCache}
          variant="outline"
          size="md"
          disabled={isLoading}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Cache Temizle
        </Button>

        <Button
          onClick={onReset}
          variant="ghost"
          size="md"
          disabled={isLoading}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Sıfırla
        </Button>
      </div>

      {/* Strateji Seçimi */}
      {showStrategySelect && onStrategyChange && (
        <div className="space-y-2">
          <label className="text-xs text-gray-500">Cache Stratejisi</label>
          <div className="flex gap-2">
            {(['none', 'basic', 'swr', 'early-hints'] as CacheStrategy[]).map((strategy) => (
              <button
                key={strategy}
                onClick={() => onStrategyChange(strategy)}
                className={cn(
                  'px-3 py-1.5 text-xs rounded-lg border transition-all',
                  cacheStrategy === strategy
                    ? 'bg-blue-50 border-blue-300 text-blue-600'
                    : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                )}
              >
                {strategy === 'none' && 'Yok'}
                {strategy === 'basic' && 'Basit'}
                {strategy === 'swr' && 'SWR'}
                {strategy === 'early-hints' && 'Early Hints'}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Early Hints Toggle */}
      {showEarlyHintsToggle && onToggleEarlyHints && (
        <div className="flex items-center justify-between py-2">
          <div>
            <div className="text-sm text-gray-700">Early Hints (103)</div>
            <div className="text-xs text-gray-400">Kaynak preloading</div>
          </div>
          <button
            onClick={() => onToggleEarlyHints(!earlyHints)}
            className={cn(
              'relative w-12 h-6 rounded-full transition-colors',
              earlyHints ? 'bg-blue-500' : 'bg-gray-300'
            )}
          >
            <span
              className={cn(
                'absolute top-1 w-4 h-4 rounded-full bg-white transition-transform shadow',
                earlyHints ? 'left-7' : 'left-1'
              )}
            />
          </button>
        </div>
      )}
    </div>
  );
}

// Basit fetch butonu
export function FetchButton({ 
  onClick, 
  loading = false,
  label = 'Sayfa Yükle'
}: { 
  onClick: () => void; 
  loading?: boolean;
  label?: string;
}) {
  return (
    <Button
      onClick={onClick}
      loading={loading}
      disabled={loading}
      variant="primary"
      size="lg"
      className="w-full"
    >
      {!loading && (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )}
      {label}
    </Button>
  );
}

// Clear cache butonu
export function ClearCacheButton({ 
  onClick, 
  disabled = false 
}: { 
  onClick: () => void; 
  disabled?: boolean;
}) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      variant="danger"
      size="md"
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
      Cache Temizle
    </Button>
  );
}

// Demo step indicator
export function DemoStepIndicator({ 
  currentStep, 
  totalSteps,
  steps 
}: { 
  currentStep: number; 
  totalSteps: number;
  steps: string[];
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-500">Demo Adımı</span>
        <span className="text-gray-700 font-medium">{currentStep} / {totalSteps}</span>
      </div>
      <div className="flex gap-1">
        {steps.map((step, i) => (
          <div 
            key={i}
            className={cn(
              'flex-1 h-2 rounded-full transition-colors',
              i < currentStep ? 'bg-blue-500' : 'bg-gray-200'
            )}
            title={step}
          />
        ))}
      </div>
      <div className="text-xs text-gray-400">{steps[currentStep - 1]}</div>
    </div>
  );
}
