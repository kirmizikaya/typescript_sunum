'use client';

import { useState, useEffect } from 'react';

export type CacheStrategy = 'none' | 'basic' | 'swr';

interface RequestLog {
  id: string;
  timestamp: string;
  ttfb: number;
  cacheStatus: string;
  age?: string;
  headers: Record<string, string>;
}

interface DemoControlsClientProps {
  strategy: CacheStrategy;
  propertyId: string;
  infoBanner: {
    title: string;
    description: string;
    color: 'purple' | 'green' | 'blue' | 'cyan' | 'orange';
  };
  showAge?: boolean;
  showClearCache?: boolean;
}

const colorMap = {
  purple: {
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    icon: 'bg-purple-100 text-purple-600',
    title: 'text-purple-900',
    text: 'text-purple-700',
    badge: 'bg-purple-100 text-purple-700 border-purple-200'
  },
  green: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    icon: 'bg-green-100 text-green-600',
    title: 'text-green-900',
    text: 'text-green-700',
    badge: 'bg-green-100 text-green-700 border-green-200'
  },
  blue: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    icon: 'bg-blue-100 text-blue-600',
    title: 'text-blue-900',
    text: 'text-blue-700',
    badge: 'bg-blue-100 text-blue-700 border-blue-200'
  },
  cyan: {
    bg: 'bg-cyan-50',
    border: 'border-cyan-200',
    icon: 'bg-cyan-100 text-cyan-600',
    title: 'text-cyan-900',
    text: 'text-cyan-700',
    badge: 'bg-cyan-100 text-cyan-700 border-cyan-200'
  },
  orange: {
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    icon: 'bg-orange-100 text-orange-600',
    title: 'text-orange-900',
    text: 'text-orange-700',
    badge: 'bg-orange-100 text-orange-700 border-orange-200'
  }
};

/**
 * Client component for demo controls and stats
 * Handles API fetching, stats tracking, and interactive controls
 */
export function DemoControlsClient({ 
  strategy, 
  propertyId,
  infoBanner,
  showAge = false,
  showClearCache = false 
}: DemoControlsClientProps) {
  const [loading, setLoading] = useState(false);
  const [requestLogs, setRequestLogs] = useState<RequestLog[]>([]);
  const [currentHeaders, setCurrentHeaders] = useState<Record<string, string>>({});
  const [stats, setStats] = useState({ 
    totalRequests: 0, 
    hits: 0, 
    misses: 0, 
    stale: 0,
    avgTTFB: 0, 
    totalTime: 0 
  });

  const colors = colorMap[infoBanner.color];

  const fetchProperty = async () => {
    const startTime = performance.now();
    setLoading(true);

    try {
      const response = await fetch(`/CF/api/property/${propertyId}?strategy=${strategy}&t=${Date.now()}`);
      const endTime = performance.now();
      const ttfb = Math.round(endTime - startTime);

      const headers: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        headers[key] = value;
      });

      setCurrentHeaders(headers);

      const cacheStatus = headers['cf-cache-status'] || 'N/A';
      const isHit = cacheStatus === 'HIT';
      const isStale = cacheStatus === 'STALE';

      const newLog: RequestLog = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        ttfb,
        cacheStatus,
        age: headers['age'],
        headers
      };

      setRequestLogs(prev => [newLog, ...prev].slice(0, 10));

      setStats(prev => {
        const newTotal = prev.totalRequests + 1;
        const newTotalTime = prev.totalTime + ttfb;
        return {
          totalRequests: newTotal,
          hits: prev.hits + (isHit ? 1 : 0),
          misses: prev.misses + (!isHit && !isStale ? 1 : 0),
          stale: prev.stale + (isStale ? 1 : 0),
          avgTTFB: Math.round(newTotalTime / newTotal),
          totalTime: newTotalTime
        };
      });

    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const clearCache = async () => {
    try {
      // API cache'ini temizle
      await fetch(`/CF/api/property/${propertyId}`, { method: 'DELETE' });
      
      // Middleware cookie'lerini temizle
      document.cookie = 'cf-edge-cache-ts=; path=/CF/demos/edge-cache; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      document.cookie = 'cf-swr-cache-ts=; path=/CF/demos/stale-while-revalidate; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      document.cookie = 'cf-hints-cache-ts=; path=/CF/demos/early-hints; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      
      setStats({ totalRequests: 0, hits: 0, misses: 0, stale: 0, avgTTFB: 0, totalTime: 0 });
      setRequestLogs([]);
      
      // Sayfayı yenile ki middleware yeni cache durumunu görsün
      window.location.reload();
    } catch (err) {
      console.error('Cache clear error:', err);
    }
  };

  // Auto-fetch on mount to show initial stats
  useEffect(() => {
    fetchProperty();
  }, []);

  const getCacheStatusColor = (status: string) => {
    switch (status) {
      case 'HIT': return 'bg-green-100 text-green-700 border-green-200';
      case 'MISS': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'STALE': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'EXPIRED': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'DYNAMIC': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const cacheHitRate = stats.totalRequests > 0 
    ? Math.round(((stats.hits + stats.stale) / stats.totalRequests) * 100) 
    : 0;

  return (
    <>
      {/* Controls Bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getCacheStatusColor(currentHeaders['cf-cache-status'] || '')}`}>
              CF-Cache-Status: {currentHeaders['cf-cache-status'] || '—'}
            </span>
            {showAge && (
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${currentHeaders['age'] ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-gray-100 text-gray-400 border-gray-200'}`}>
                Age: {currentHeaders['age'] || '—'}s
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {showClearCache && (
              <button
                onClick={clearCache}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center gap-2 text-sm"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Cache Temizle
              </button>
            )}
            <button
              onClick={fetchProperty}
              disabled={loading}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
            >
              <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {loading ? 'Yükleniyor...' : 'Yenile'}
            </button>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className={`${colors.bg} border-b ${colors.border} px-4 py-3`}>
        <div className="max-w-7xl mx-auto flex items-start gap-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${colors.icon}`}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className={`font-medium ${colors.title}`}>{infoBanner.title}</h3>
            <p className={`text-sm mt-1 ${colors.text}`} dangerouslySetInnerHTML={{ __html: infoBanner.description }} />
          </div>
        </div>
      </div>

      {/* Stats Panel */}
      <div className="bg-white border-t border-gray-200 mt-8">
        <div className="max-w-7xl mx-auto p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Performance İstatistikleri
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-2">Son TTFB</div>
              <div className="flex items-baseline gap-2">
                <span className={`text-3xl font-bold ${
                  (requestLogs[0]?.ttfb || 0) > 500 ? 'text-red-600' : 
                  (requestLogs[0]?.ttfb || 0) > 100 ? 'text-yellow-600' : 'text-green-600'
                }`}>
                  {requestLogs[0]?.ttfb || '—'}
                </span>
                <span className="text-gray-500">ms</span>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-2">Cache Hit Rate</div>
              <div className="flex items-baseline gap-2">
                <span className={`text-3xl font-bold ${cacheHitRate > 50 ? 'text-green-600' : 'text-yellow-600'}`}>
                  {cacheHitRate}
                </span>
                <span className="text-gray-500">%</span>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-2">Toplam İstek</div>
              <div className="text-3xl font-bold text-gray-900">{stats.totalRequests}</div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-2">Ortalama TTFB</div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-gray-900">{stats.avgTTFB || '—'}</span>
                <span className="text-gray-500">ms</span>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-2">HIT / MISS / STALE</div>
              <div className="text-lg font-bold text-gray-900">
                <span className="text-green-600">{stats.hits}</span>
                {' / '}
                <span className="text-yellow-600">{stats.misses}</span>
                {' / '}
                <span className="text-blue-600">{stats.stale}</span>
              </div>
            </div>
          </div>

          {/* Request Logs */}
          <div className="bg-gray-50 rounded-lg overflow-hidden">
            <div className="px-4 py-3 bg-gray-100 border-b border-gray-200">
              <h3 className="font-medium text-gray-900">Son İstekler (Network Timeline)</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left text-gray-600">Zaman</th>
                    <th className="px-4 py-2 text-left text-gray-600">CF-Cache-Status</th>
                    {showAge && <th className="px-4 py-2 text-left text-gray-600">Age</th>}
                    <th className="px-4 py-2 text-left text-gray-600">TTFB</th>
                    <th className="px-4 py-2 text-left text-gray-600">Timeline</th>
                  </tr>
                </thead>
                <tbody>
                  {requestLogs.length === 0 ? (
                    <tr>
                      <td colSpan={showAge ? 5 : 4} className="px-4 py-8 text-center text-gray-500">
                        Henüz istek yok
                      </td>
                    </tr>
                  ) : (
                    requestLogs.map((log, i) => (
                      <tr key={log.id} className={i === 0 ? (
                        log.cacheStatus === 'HIT' ? 'bg-green-50' : 
                        log.cacheStatus === 'STALE' ? 'bg-blue-50' : 
                        log.cacheStatus === 'DYNAMIC' ? 'bg-purple-50' : 'bg-yellow-50'
                      ) : 'bg-white'}>
                        <td className="px-4 py-3 text-gray-600 font-mono text-xs">
                          {new Date(log.timestamp).toLocaleTimeString('tr-TR')}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded text-xs font-medium border ${getCacheStatusColor(log.cacheStatus)}`}>
                            {log.cacheStatus}
                          </span>
                        </td>
                        {showAge && <td className="px-4 py-3 text-gray-600">{log.age || '—'}s</td>}
                        <td className="px-4 py-3 font-mono">
                          <span className={log.ttfb > 500 ? 'text-red-600' : log.ttfb > 100 ? 'text-yellow-600' : 'text-green-600'}>
                            {log.ttfb}ms
                          </span>
                        </td>
                        <td className="px-4 py-3 w-48">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className={`h-full transition-all ${
                                  log.cacheStatus === 'HIT' ? 'bg-green-500' : 
                                  log.cacheStatus === 'STALE' ? 'bg-blue-500' : 
                                  log.cacheStatus === 'DYNAMIC' ? 'bg-purple-500' : 'bg-yellow-500'
                                }`}
                                style={{ width: `${Math.min(log.ttfb / 15, 100)}%` }}
                              />
                            </div>
                            <span className="text-xs text-gray-500 w-16">{log.ttfb}ms</span>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Response Headers */}
          {Object.keys(currentHeaders).length > 0 && (
            <div className="mt-6 bg-gray-50 rounded-lg overflow-hidden">
              <div className="px-4 py-3 bg-gray-100 border-b border-gray-200">
                <h3 className="font-medium text-gray-900">Response Headers</h3>
              </div>
              <div className="p-4 font-mono text-sm">
                {Object.entries(currentHeaders).map(([key, value]) => (
                  <div key={key} className={`py-1 ${
                    key.toLowerCase().startsWith('cf-') || 
                    key.toLowerCase() === 'cache-control' || 
                    key.toLowerCase() === 'age'
                      ? 'text-orange-700 font-medium'
                      : 'text-gray-600'
                  }`}>
                    <span className="text-gray-400">{key}:</span> {value}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

