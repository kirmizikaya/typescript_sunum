'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { PropertyDetailPage } from '../../components/PropertyDetailPage';
import { Property } from '../../types';

interface ApiResponse {
  property: Property;
  fetchedAt: string;
}

interface RequestLog {
  id: string;
  timestamp: string;
  ttfb: number;
  cacheStatus: string;
  headers: Record<string, string>;
}

const CACHE_STATUSES = [
  { value: 'HIT', label: 'HIT', description: 'İçerik edge cache\'de bulundu', color: 'bg-green-500', textColor: 'text-green-700', bgColor: 'bg-green-100' },
  { value: 'MISS', label: 'MISS', description: 'İçerik cache\'de yok, origin\'den alındı', color: 'bg-yellow-500', textColor: 'text-yellow-700', bgColor: 'bg-yellow-100' },
  { value: 'EXPIRED', label: 'EXPIRED', description: 'Cache süresi doldu, yeniden alındı', color: 'bg-orange-500', textColor: 'text-orange-700', bgColor: 'bg-orange-100' },
  { value: 'STALE', label: 'STALE', description: 'Eski veri sunuldu, arka planda güncelleniyor', color: 'bg-blue-500', textColor: 'text-blue-700', bgColor: 'bg-blue-100' },
  { value: 'BYPASS', label: 'BYPASS', description: 'Cache atlandı (cookie/header nedeniyle)', color: 'bg-gray-500', textColor: 'text-gray-700', bgColor: 'bg-gray-100' },
  { value: 'REVALIDATED', label: 'REVALIDATED', description: 'Arka plan güncelleme tamamlandı', color: 'bg-teal-500', textColor: 'text-teal-700', bgColor: 'bg-teal-100' },
  { value: 'UPDATING', label: 'UPDATING', description: 'Cache güncelleniyor', color: 'bg-purple-500', textColor: 'text-purple-700', bgColor: 'bg-purple-100' },
  { value: 'DYNAMIC', label: 'DYNAMIC', description: 'İçerik dinamik, cache edilemez', color: 'bg-red-500', textColor: 'text-red-700', bgColor: 'bg-red-100' },
];

export default function CacheStatusDemoPage() {
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState('HIT');
  const [requestLogs, setRequestLogs] = useState<RequestLog[]>([]);
  const [currentHeaders, setCurrentHeaders] = useState<Record<string, string>>({});

  const fetchWithStatus = useCallback(async (status: string) => {
    const startTime = performance.now();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/CF/api/property/cf-demo-1?forceStatus=${status}&t=${Date.now()}`);
      const endTime = performance.now();
      const ttfb = Math.round(endTime - startTime);

      const headers: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        headers[key] = value;
      });

      setCurrentHeaders(headers);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data: ApiResponse = await response.json();
      setProperty(data.property);

      const newLog: RequestLog = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        ttfb,
        cacheStatus: headers['cf-cache-status'] || status,
        headers
      };

      setRequestLogs(prev => [newLog, ...prev].slice(0, 10));

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  }, []);

  // Sayfa yüklendiğinde otomatik fetch
  useEffect(() => {
    fetchWithStatus(selectedStatus);
  }, [fetchWithStatus, selectedStatus]);

  const getStatusConfig = (status: string) => {
    return CACHE_STATUSES.find(s => s.value === status) || CACHE_STATUSES[0];
  };

  const currentStatusConfig = getStatusConfig(currentHeaders['cf-cache-status'] || selectedStatus);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/CF" className="text-gray-600 hover:text-gray-900">
              ← Dashboard
            </Link>
            <div className="h-6 w-px bg-gray-300" />
            <h1 className="text-lg font-semibold text-gray-900">
              Demo 5: Tüm CF-Cache-Status Değerleri
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${currentStatusConfig.bgColor} ${currentStatusConfig.textColor}`}>
              CF-Cache-Status: {currentHeaders['cf-cache-status'] || selectedStatus}
            </span>
          </div>
        </div>
      </header>

      {/* Status Selector */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Bir Cache Status Seçin:</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
            {CACHE_STATUSES.map((status) => (
              <button
                key={status.value}
                onClick={() => setSelectedStatus(status.value)}
                className={`p-3 rounded-lg border-2 transition-all text-left ${
                  selectedStatus === status.value
                    ? `${status.bgColor} border-current ${status.textColor} ring-2 ring-offset-2`
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className={`w-3 h-3 rounded-full ${status.color}`} />
                  <span className="font-bold text-sm">{status.label}</span>
                </div>
                <p className="text-xs text-gray-600 line-clamp-2">{status.description}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Status Explanation */}
      <div className={`${currentStatusConfig.bgColor} border-b border-gray-200 px-4 py-3`}>
        <div className="max-w-7xl mx-auto flex items-start gap-3">
          <div className={`w-8 h-8 ${currentStatusConfig.color} rounded-full flex items-center justify-center flex-shrink-0`}>
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className={`font-medium ${currentStatusConfig.textColor}`}>
              CF-Cache-Status: {selectedStatus}
            </h3>
            <p className={`text-sm mt-1 ${currentStatusConfig.textColor} opacity-90`}>
              {getStatusConfig(selectedStatus).description}
            </p>
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border-b border-red-200 px-4 py-3">
          <div className="flex items-center gap-2 text-red-700">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>Hata: {error}</span>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        {property ? (
          <PropertyDetailPage property={property} loading={loading} />
        ) : loading ? (
          <PropertyDetailPage property={{} as Property} loading={true} />
        ) : null}
      </div>

      {/* Stats Panel */}
      <div className="bg-white border-t border-gray-200 mt-8">
        <div className="max-w-7xl mx-auto p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">CF-Cache-Status Referans Tablosu</h2>

          {/* All Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {CACHE_STATUSES.map((status) => (
              <div key={status.value} className={`rounded-lg border-2 p-4 ${
                currentHeaders['cf-cache-status'] === status.value 
                  ? `${status.bgColor} border-current`
                  : 'bg-white border-gray-200'
              }`}>
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-4 h-4 rounded-full ${status.color}`} />
                  <span className={`font-bold ${status.textColor}`}>{status.label}</span>
                </div>
                <p className="text-sm text-gray-600">{status.description}</p>
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="text-xs text-gray-500">
                    <strong>Latency:</strong>{' '}
                    {['HIT', 'STALE', 'REVALIDATED', 'UPDATING'].includes(status.value) ? '~10-25ms' : '~800-1200ms'}
                  </div>
                </div>
              </div>
            ))}
          </div>

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
                    <th className="px-4 py-2 text-left text-gray-600">TTFB</th>
                    <th className="px-4 py-2 text-left text-gray-600">CF-Ray</th>
                  </tr>
                </thead>
                <tbody>
                  {requestLogs.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                        Henüz istek yok
                      </td>
                    </tr>
                  ) : (
                    requestLogs.map((log, i) => {
                      const statusConfig = getStatusConfig(log.cacheStatus);
                      return (
                        <tr key={log.id} className={i === 0 ? statusConfig.bgColor : 'bg-white'}>
                          <td className="px-4 py-3 text-gray-600 font-mono text-xs">
                            {new Date(log.timestamp).toLocaleTimeString('tr-TR')}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusConfig.bgColor} ${statusConfig.textColor}`}>
                              {log.cacheStatus}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-mono">
                            <span className={log.ttfb > 500 ? 'text-red-600' : log.ttfb > 100 ? 'text-yellow-600' : 'text-green-600'}>
                              {log.ttfb}ms
                            </span>
                          </td>
                          <td className="px-4 py-3 font-mono text-xs text-gray-500">
                            {log.headers['cf-ray'] || '—'}
                          </td>
                        </tr>
                      );
                    })
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
                    key.toLowerCase().startsWith('cf-') || key.toLowerCase() === 'cache-control'
                      ? `${currentStatusConfig.textColor} font-medium`
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
    </div>
  );
}
