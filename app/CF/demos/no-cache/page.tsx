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
  status: string;
  ttfb: number;
  cacheStatus: string;
  headers: Record<string, string>;
}

export default function NoCacheDemoPage() {
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requestLogs, setRequestLogs] = useState<RequestLog[]>([]);
  const [currentHeaders, setCurrentHeaders] = useState<Record<string, string>>({});
  const [stats, setStats] = useState({ totalRequests: 0, avgTTFB: 0, totalTime: 0 });

  const fetchProperty = useCallback(async () => {
    const startTime = performance.now();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/CF/api/property/cf-demo-1?strategy=none&t=${Date.now()}`);
      const endTime = performance.now();
      const ttfb = Math.round(endTime - startTime);

      // Get headers
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

      // Add to request logs
      const newLog: RequestLog = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        status: `${response.status} ${response.statusText}`,
        ttfb,
        cacheStatus: headers['cf-cache-status'] || 'N/A',
        headers
      };

      setRequestLogs(prev => [newLog, ...prev].slice(0, 10));

      // Update stats
      setStats(prev => {
        const newTotal = prev.totalRequests + 1;
        const newTotalTime = prev.totalTime + ttfb;
        return {
          totalRequests: newTotal,
          avgTTFB: Math.round(newTotalTime / newTotal),
          totalTime: newTotalTime
        };
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  }, []);

  // Sayfa yüklendiğinde otomatik fetch
  useEffect(() => {
    fetchProperty();
  }, [fetchProperty]);

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
              Demo 1: Cache Yok (Origin Direct)
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              currentHeaders['cf-cache-status'] === 'DYNAMIC' 
                ? 'bg-purple-100 text-purple-700 border border-purple-200' 
                : 'bg-gray-100 text-gray-700'
            }`}>
              CF-Cache-Status: {currentHeaders['cf-cache-status'] || '—'}
            </span>
            <button
              onClick={fetchProperty}
              disabled={loading}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                    <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" fill="currentColor" className="opacity-75" />
                  </svg>
                  Yükleniyor...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Yenile (Origin'e Git)
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Info Banner */}
      <div className="bg-purple-50 border-b border-purple-200 px-4 py-3">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="font-medium text-purple-900">Cache Yok - Her istek Origin&apos;e gider</h3>
            <p className="text-sm text-purple-700 mt-1">
              Bu senaryoda her istek doğrudan origin sunucuya gider. <strong>CF-Cache-Status: DYNAMIC</strong> döner. 
              Network tab&apos;ını açın ve &quot;Yenile&quot; butonuna basarak her istekte ~800-1200ms latency olduğunu gözlemleyin.
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
        {/* Property Detail */}
        {property ? (
          <PropertyDetailPage property={property} loading={loading} />
        ) : loading ? (
          <PropertyDetailPage property={{} as Property} loading={true} />
        ) : null}
      </div>

      {/* Stats Panel - En altta */}
      <div className="bg-white border-t border-gray-200 mt-8">
        <div className="max-w-7xl mx-auto p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Performance İstatistikleri
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {/* TTFB Gauge */}
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
              <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all ${
                    (requestLogs[0]?.ttfb || 0) > 500 ? 'bg-red-500' : 
                    (requestLogs[0]?.ttfb || 0) > 100 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min((requestLogs[0]?.ttfb || 0) / 15, 100)}%` }}
                />
              </div>
            </div>

            {/* Total Requests */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-2">Toplam İstek</div>
              <div className="text-3xl font-bold text-gray-900">{stats.totalRequests}</div>
            </div>

            {/* Average TTFB */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-2">Ortalama TTFB</div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-gray-900">{stats.avgTTFB || '—'}</span>
                <span className="text-gray-500">ms</span>
              </div>
            </div>

            {/* Cache Hit Rate */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-2">Cache Hit Rate</div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-red-600">0</span>
                <span className="text-gray-500">%</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">Cache devre dışı</div>
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
                    <th className="px-4 py-2 text-left text-gray-600">Status</th>
                    <th className="px-4 py-2 text-left text-gray-600">CF-Cache-Status</th>
                    <th className="px-4 py-2 text-left text-gray-600">TTFB</th>
                    <th className="px-4 py-2 text-left text-gray-600">Timeline</th>
                  </tr>
                </thead>
                <tbody>
                  {requestLogs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                        Henüz istek yok
                      </td>
                    </tr>
                  ) : (
                    requestLogs.map((log, i) => (
                      <tr key={log.id} className={i === 0 ? 'bg-purple-50' : 'bg-white'}>
                        <td className="px-4 py-3 text-gray-600 font-mono text-xs">
                          {new Date(log.timestamp).toLocaleTimeString('tr-TR')}
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">
                            {log.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                            {log.cacheStatus}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-mono">
                          <span className={log.ttfb > 500 ? 'text-red-600' : 'text-gray-900'}>
                            {log.ttfb}ms
                          </span>
                        </td>
                        <td className="px-4 py-3 w-64">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-purple-500 transition-all"
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
                    key.toLowerCase().startsWith('cf-') || key.toLowerCase() === 'cache-control'
                      ? 'text-purple-700 font-medium'
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
