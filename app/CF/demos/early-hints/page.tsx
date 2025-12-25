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
  earlyHints: boolean;
  headers: Record<string, string>;
}

// Early Hints simülasyonu için link header'ları
const EARLY_HINTS_HEADERS = [
  'Link: </fonts/inter.woff2>; rel=preload; as=font; crossorigin',
  'Link: </api/property/cf-demo-1>; rel=preload; as=fetch',
  'Link: <https://images.unsplash.com>; rel=preconnect',
  'Link: </styles/critical.css>; rel=preload; as=style',
];

export default function EarlyHintsDemoPage() {
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [earlyHintsEnabled, setEarlyHintsEnabled] = useState(true);
  const [requestLogs, setRequestLogs] = useState<RequestLog[]>([]);
  const [currentHeaders, setCurrentHeaders] = useState<Record<string, string>>({});
  const [stats, setStats] = useState({ 
    withEarlyHints: { count: 0, totalTTFB: 0 },
    withoutEarlyHints: { count: 0, totalTTFB: 0 }
  });
  const [showingEarlyHints, setShowingEarlyHints] = useState(false);

  const fetchProperty = useCallback(async () => {
    const startTime = performance.now();
    setLoading(true);
    setError(null);

    // Simulate Early Hints (103 response)
    if (earlyHintsEnabled) {
      setShowingEarlyHints(true);
      // Simüle edilen Early Hints gecikmesi (browser preload başlatır)
      await new Promise(resolve => setTimeout(resolve, 50));
      setShowingEarlyHints(false);
    }

    try {
      // Early hints ile cache daha hızlı olmalı (simülasyon)
      const strategy = earlyHintsEnabled ? 'basic' : 'none';
      const response = await fetch(`/CF/api/property/cf-demo-1?strategy=${strategy}&earlyHints=${earlyHintsEnabled}&t=${Date.now()}`);
      const endTime = performance.now();
      const ttfb = Math.round(endTime - startTime);

      const headers: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        headers[key] = value;
      });

      // Early hints header'ını ekle (simülasyon)
      if (earlyHintsEnabled) {
        headers['103-early-hints'] = 'sent';
        headers['link'] = EARLY_HINTS_HEADERS.join(', ');
      }

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
        cacheStatus: headers['cf-cache-status'] || 'N/A',
        earlyHints: earlyHintsEnabled,
        headers
      };

      setRequestLogs(prev => [newLog, ...prev].slice(0, 10));

      // Update stats
      setStats(prev => {
        if (earlyHintsEnabled) {
          return {
            ...prev,
            withEarlyHints: {
              count: prev.withEarlyHints.count + 1,
              totalTTFB: prev.withEarlyHints.totalTTFB + ttfb
            }
          };
        } else {
          return {
            ...prev,
            withoutEarlyHints: {
              count: prev.withoutEarlyHints.count + 1,
              totalTTFB: prev.withoutEarlyHints.totalTTFB + ttfb
            }
          };
        }
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  }, [earlyHintsEnabled]);

  // Sayfa yüklendiğinde otomatik fetch
  useEffect(() => {
    fetchProperty();
  }, [fetchProperty]);

  const avgWithEarlyHints = stats.withEarlyHints.count > 0 
    ? Math.round(stats.withEarlyHints.totalTTFB / stats.withEarlyHints.count) 
    : 0;
  const avgWithoutEarlyHints = stats.withoutEarlyHints.count > 0 
    ? Math.round(stats.withoutEarlyHints.totalTTFB / stats.withoutEarlyHints.count) 
    : 0;
  const improvement = avgWithoutEarlyHints > 0 && avgWithEarlyHints > 0
    ? Math.round(((avgWithoutEarlyHints - avgWithEarlyHints) / avgWithoutEarlyHints) * 100)
    : 0;

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
              Demo 4: Early Hints (103)
            </h1>
          </div>
          <div className="flex items-center gap-4">
            {showingEarlyHints && (
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-cyan-100 text-cyan-700 animate-pulse flex items-center gap-2">
                <span className="w-2 h-2 bg-cyan-500 rounded-full animate-ping" />
                103 Early Hints
              </span>
            )}
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              currentHeaders['cf-cache-status'] === 'HIT' 
                ? 'bg-green-100 text-green-700' 
                : currentHeaders['cf-cache-status'] === 'MISS'
                ? 'bg-yellow-100 text-yellow-700'
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
                  Yenile
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Early Hints Toggle */}
      <div className="bg-cyan-50 border-b border-cyan-200 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-cyan-100 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-cyan-900">Early Hints (HTTP 103) - Tarayıcıya erken ipuçları</h3>
              <p className="text-sm text-cyan-700 mt-1">
                Sunucu ana yanıtı hazırlarken, tarayıcıya önceden <strong>preload/preconnect</strong> ipuçları gönderir.
                Kritik kaynaklar (fontlar, stiller, API) önceden yüklenir. LCP iyileşir.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-cyan-700">Early Hints:</span>
            <button
              onClick={() => setEarlyHintsEnabled(!earlyHintsEnabled)}
              className={`relative w-14 h-7 rounded-full transition-colors ${
                earlyHintsEnabled ? 'bg-cyan-500' : 'bg-gray-300'
              }`}
            >
              <span className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                earlyHintsEnabled ? 'translate-x-7' : ''
              }`} />
            </button>
            <span className={`text-sm font-medium ${earlyHintsEnabled ? 'text-cyan-700' : 'text-gray-500'}`}>
              {earlyHintsEnabled ? 'Açık' : 'Kapalı'}
            </span>
          </div>
        </div>
      </div>

      {/* Early Hints Headers Preview */}
      {earlyHintsEnabled && (
        <div className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="max-w-7xl mx-auto">
            <div className="text-sm text-gray-600 mb-2">103 Early Hints Header&apos;ları:</div>
            <div className="font-mono text-xs bg-gray-50 p-3 rounded-lg space-y-1">
              {EARLY_HINTS_HEADERS.map((header, i) => (
                <div key={i} className="text-cyan-700">{header}</div>
              ))}
            </div>
          </div>
        </div>
      )}

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
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Early Hints Karşılaştırması
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* With Early Hints */}
            <div className="bg-cyan-50 rounded-lg p-4 border border-cyan-200">
              <div className="text-sm text-cyan-700 mb-2">Early Hints Açık</div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-cyan-600">
                  {avgWithEarlyHints || '—'}
                </span>
                <span className="text-gray-500">ms avg</span>
              </div>
              <div className="text-xs text-cyan-600 mt-1">{stats.withEarlyHints.count} istek</div>
            </div>

            {/* Without Early Hints */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="text-sm text-gray-600 mb-2">Early Hints Kapalı</div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-gray-700">
                  {avgWithoutEarlyHints || '—'}
                </span>
                <span className="text-gray-500">ms avg</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">{stats.withoutEarlyHints.count} istek</div>
            </div>

            {/* Improvement */}
            <div className={`rounded-lg p-4 border ${
              improvement > 0 ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="text-sm text-gray-600 mb-2">İyileşme</div>
              <div className="flex items-baseline gap-2">
                <span className={`text-3xl font-bold ${improvement > 0 ? 'text-green-600' : 'text-gray-700'}`}>
                  {improvement > 0 ? `${improvement}%` : '—'}
                </span>
                {improvement > 0 && (
                  <span className="text-green-600">daha hızlı</span>
                )}
              </div>
            </div>
          </div>

          {/* How Early Hints Work */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-gray-900 mb-3">Early Hints Nasıl Çalışır?</h3>
            <div className="flex items-center gap-4 overflow-x-auto pb-2">
              <div className="flex-shrink-0 text-center">
                <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-cyan-700 font-bold">1</span>
                </div>
                <div className="text-xs text-gray-600">İstek Gelir</div>
              </div>
              <svg className="w-6 h-6 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
              <div className="flex-shrink-0 text-center">
                <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-cyan-700 font-bold">103</span>
                </div>
                <div className="text-xs text-gray-600">Early Hints</div>
              </div>
              <svg className="w-6 h-6 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
              <div className="flex-shrink-0 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </div>
                <div className="text-xs text-gray-600">Preload Başlar</div>
              </div>
              <svg className="w-6 h-6 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
              <div className="flex-shrink-0 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-green-700 font-bold">200</span>
                </div>
                <div className="text-xs text-gray-600">Ana Yanıt</div>
              </div>
              <svg className="w-6 h-6 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
              <div className="flex-shrink-0 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="text-xs text-gray-600">Hızlı Render</div>
              </div>
            </div>
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
                    <th className="px-4 py-2 text-left text-gray-600">Early Hints</th>
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
                      <tr key={log.id} className={i === 0 ? (log.earlyHints ? 'bg-cyan-50' : 'bg-gray-100') : 'bg-white'}>
                        <td className="px-4 py-3 text-gray-600 font-mono text-xs">
                          {new Date(log.timestamp).toLocaleTimeString('tr-TR')}
                        </td>
                        <td className="px-4 py-3">
                          {log.earlyHints ? (
                            <span className="px-2 py-0.5 bg-cyan-100 text-cyan-700 rounded text-xs font-medium">
                              ✓ Açık
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-xs">
                              Kapalı
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                            log.cacheStatus === 'HIT' ? 'bg-green-100 text-green-700' :
                            log.cacheStatus === 'MISS' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {log.cacheStatus}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-mono">
                          <span className={log.ttfb > 500 ? 'text-red-600' : log.ttfb > 100 ? 'text-yellow-600' : 'text-green-600'}>
                            {log.ttfb}ms
                          </span>
                        </td>
                        <td className="px-4 py-3 w-48">
                          <div className="flex items-center gap-2">
                            {log.earlyHints && (
                              <div className="w-2 h-3 bg-cyan-400 rounded-sm" title="103 Early Hints" />
                            )}
                            <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className={`h-full transition-all ${log.earlyHints ? 'bg-cyan-500' : 'bg-gray-400'}`}
                                style={{ width: `${Math.min(log.ttfb / 15, 100)}%` }}
                              />
                            </div>
                            <span className="text-xs text-gray-500 w-14">{log.ttfb}ms</span>
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
                    key.toLowerCase() === 'link' || key.toLowerCase() === '103-early-hints'
                      ? 'text-cyan-700 font-medium'
                      : key.toLowerCase().startsWith('cf-')
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
    </div>
  );
}
