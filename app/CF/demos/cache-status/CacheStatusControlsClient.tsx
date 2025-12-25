'use client';

import { useState, useEffect } from 'react';

interface RequestLog {
  id: string;
  timestamp: string;
  ttfb: number;
  cacheStatus: string;
  age?: string;
  headers: Record<string, string>;
}

interface CacheStatusControlsClientProps {
  propertyId: string;
}

const CACHE_STATUSES = [
  { value: 'HIT', label: 'HIT', color: 'green', description: 'Edge cache\'den servis edildi' },
  { value: 'MISS', label: 'MISS', color: 'yellow', description: 'Cache\'de yok, origin\'den alındı' },
  { value: 'STALE', label: 'STALE', color: 'blue', description: 'Eski veri, arka planda güncelleniyor' },
  { value: 'EXPIRED', label: 'EXPIRED', color: 'orange', description: 'Cache süresi doldu' },
  { value: 'BYPASS', label: 'BYPASS', color: 'gray', description: 'Cache atlandı' },
  { value: 'REVALIDATED', label: 'REVALIDATED', color: 'teal', description: 'Arka plan güncelleme tamamlandı' },
  { value: 'UPDATING', label: 'UPDATING', color: 'purple', description: 'Cache güncelleniyor' },
  { value: 'DYNAMIC', label: 'DYNAMIC', color: 'red', description: 'Dinamik içerik, cache edilemez' },
];

/**
 * Client component for Cache Status demo
 * Allows forcing specific CF-Cache-Status values
 */
export function CacheStatusControlsClient({ propertyId }: CacheStatusControlsClientProps) {
  const [selectedStatus, setSelectedStatus] = useState('HIT');
  const [loading, setLoading] = useState(false);
  const [requestLogs, setRequestLogs] = useState<RequestLog[]>([]);
  const [currentHeaders, setCurrentHeaders] = useState<Record<string, string>>({});

  const fetchWithStatus = async (forceStatus: string) => {
    const startTime = performance.now();
    setLoading(true);

    try {
      const response = await fetch(
        `/CF/api/property/${propertyId}?forceStatus=${forceStatus}&t=${Date.now()}`
      );
      const endTime = performance.now();
      const ttfb = Math.round(endTime - startTime);

      const headers: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        headers[key] = value;
      });

      setCurrentHeaders(headers);

      const newLog: RequestLog = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        ttfb,
        cacheStatus: headers['cf-cache-status'] || forceStatus,
        age: headers['age'],
        headers
      };

      setRequestLogs(prev => [newLog, ...prev].slice(0, 10));

    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch on mount
  useEffect(() => {
    fetchWithStatus(selectedStatus);
  }, []);

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
    fetchWithStatus(status);
  };

  const getCacheStatusColor = (status: string) => {
    switch (status) {
      case 'HIT': return 'bg-green-100 text-green-700 border-green-200';
      case 'MISS': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'STALE': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'EXPIRED': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'BYPASS': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'REVALIDATED': return 'bg-teal-100 text-teal-700 border-teal-200';
      case 'UPDATING': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'DYNAMIC': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getButtonClasses = (status: string) => {
    const base = 'px-4 py-2 rounded-lg text-sm font-medium border-2 transition-all';
    const isSelected = selectedStatus === status;
    
    const colorMap: Record<string, { selected: string; unselected: string }> = {
      green: {
        selected: 'bg-green-500 text-white border-green-600',
        unselected: 'bg-white text-green-600 border-green-300 hover:bg-green-50'
      },
      yellow: {
        selected: 'bg-yellow-500 text-white border-yellow-600',
        unselected: 'bg-white text-yellow-600 border-yellow-300 hover:bg-yellow-50'
      },
      blue: {
        selected: 'bg-blue-500 text-white border-blue-600',
        unselected: 'bg-white text-blue-600 border-blue-300 hover:bg-blue-50'
      },
      orange: {
        selected: 'bg-orange-500 text-white border-orange-600',
        unselected: 'bg-white text-orange-600 border-orange-300 hover:bg-orange-50'
      },
      gray: {
        selected: 'bg-gray-500 text-white border-gray-600',
        unselected: 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
      },
      teal: {
        selected: 'bg-teal-500 text-white border-teal-600',
        unselected: 'bg-white text-teal-600 border-teal-300 hover:bg-teal-50'
      },
      purple: {
        selected: 'bg-purple-500 text-white border-purple-600',
        unselected: 'bg-white text-purple-600 border-purple-300 hover:bg-purple-50'
      },
      red: {
        selected: 'bg-red-500 text-white border-red-600',
        unselected: 'bg-white text-red-600 border-red-300 hover:bg-red-50'
      },
    };

    const statusConfig = CACHE_STATUSES.find(s => s.value === status);
    const color = statusConfig?.color || 'gray';
    
    return `${base} ${isSelected ? colorMap[color].selected : colorMap[color].unselected}`;
  };

  return (
    <>
      {/* Status Selector */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-3">
            <h3 className="text-sm font-medium text-gray-700 mb-2">CF-Cache-Status Seçin:</h3>
            <div className="flex flex-wrap gap-2">
              {CACHE_STATUSES.map(status => (
                <button
                  key={status.value}
                  onClick={() => handleStatusChange(status.value)}
                  disabled={loading}
                  className={getButtonClasses(status.value)}
                >
                  {status.value}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4 pt-3 border-t border-gray-100">
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getCacheStatusColor(currentHeaders['cf-cache-status'] || selectedStatus)}`}>
              CF-Cache-Status: {currentHeaders['cf-cache-status'] || selectedStatus}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium border bg-blue-100 text-blue-700 border-blue-200`}>
              Age: {currentHeaders['age'] || '—'}s
            </span>
            {loading && (
              <span className="text-sm text-gray-500 flex items-center gap-2">
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Yükleniyor...
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-indigo-50 border-b border-indigo-200 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-start gap-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-indigo-100 text-indigo-600">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="font-medium text-indigo-900">CF-Cache-Status Referans</h3>
            <p className="text-sm mt-1 text-indigo-700">
              Her bir status değerini seçip test edebilirsiniz. Network tab&apos;ında response header&apos;larını ve latency farklarını gözlemleyin.
            </p>
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
            Test Sonuçları
          </h2>

          {/* Request Logs */}
          <div className="bg-gray-50 rounded-lg overflow-hidden">
            <div className="px-4 py-3 bg-gray-100 border-b border-gray-200">
              <h3 className="font-medium text-gray-900">Son İstekler</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left text-gray-600">Zaman</th>
                    <th className="px-4 py-2 text-left text-gray-600">CF-Cache-Status</th>
                    <th className="px-4 py-2 text-left text-gray-600">Age</th>
                    <th className="px-4 py-2 text-left text-gray-600">TTFB</th>
                    <th className="px-4 py-2 text-left text-gray-600">Latency Karşılaştırma</th>
                  </tr>
                </thead>
                <tbody>
                  {requestLogs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                        Henüz istek yok - yukarıdan bir status seçin
                      </td>
                    </tr>
                  ) : (
                    requestLogs.map((log, i) => (
                      <tr key={log.id} className={i === 0 ? getCacheStatusColor(log.cacheStatus).replace('text-', 'bg-').split(' ')[0] + '/30' : 'bg-white'}>
                        <td className="px-4 py-3 text-gray-600 font-mono text-xs">
                          {new Date(log.timestamp).toLocaleTimeString('tr-TR')}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded text-xs font-medium border ${getCacheStatusColor(log.cacheStatus)}`}>
                            {log.cacheStatus}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-600">{log.age || '—'}s</td>
                        <td className="px-4 py-3 font-mono">
                          <span className={log.ttfb > 500 ? 'text-red-600' : log.ttfb > 100 ? 'text-yellow-600' : 'text-green-600'}>
                            {log.ttfb}ms
                          </span>
                        </td>
                        <td className="px-4 py-3 w-48">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className={`h-full transition-all ${getCacheStatusColor(log.cacheStatus).split(' ')[0].replace('bg-', 'bg-').replace('-100', '-500')}`}
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
                <h3 className="font-medium text-gray-900">Son Response Headers</h3>
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
