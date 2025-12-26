const DEMOS = [
  {
    id: '1a',
    title: 'Backend Yavaş (~1000ms)',
    path: '/CF/demos/no-cache-slow',
    description: 'Yavaş backend simülasyonu. PageSpeed skorun düşük olacak.',
    color: 'red',
    cacheStatus: 'DYNAMIC',
    avgTTFB: '~1000ms',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  {
    id: '1b',
    title: 'Backend Hızlı (~50ms)',
    path: '/CF/demos/no-cache-fast',
    description: 'Hızlı backend simülasyonu. PageSpeed skorun yüksek olacak.',
    color: 'green',
    cacheStatus: 'DYNAMIC',
    avgTTFB: '~50ms',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    )
  },
  {
    id: '2',
    title: 'Basic Edge Cache',
    path: '/CF/demos/edge-cache',
    description: 'İlk istek MISS, sonrakiler HIT. Klasik CDN caching.',
    color: 'emerald',
    cacheStatus: 'HIT / MISS',
    avgTTFB: '10-25ms (HIT)',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    )
  },
  {
    id: '3',
    title: 'Stale-While-Revalidate',
    path: '/CF/demos/stale-while-revalidate',
    description: 'Eski veri hemen sunulur, arka planda güncellenir. En iyi UX.',
    color: 'blue',
    cacheStatus: 'STALE / HIT',
    avgTTFB: '10-25ms (her zaman)',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    )
  },
  {
    id: '4',
    title: 'Early Hints (103)',
    path: '/CF/demos/early-hints',
    description: 'Tarayıcıya erken preload/preconnect ipuçları. LCP iyileşir.',
    color: 'cyan',
    cacheStatus: '103 + 200',
    avgTTFB: 'Paralel yükleme',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    )
  },
  {
    id: '5',
    title: 'Tüm Cache Status\'ları',
    path: '/CF/demos/cache-status',
    description: 'HIT, MISS, STALE, EXPIRED, BYPASS, DYNAMIC... hepsini test et.',
    color: 'purple',
    cacheStatus: 'Tümü',
    avgTTFB: 'Değişken',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
      </svg>
    )
  }
];

const colorClasses: Record<string, { bg: string; border: string; text: string; light: string }> = {
  red: { bg: 'bg-red-500', border: 'border-red-200', text: 'text-red-700', light: 'bg-red-50' },
  green: { bg: 'bg-green-500', border: 'border-green-200', text: 'text-green-700', light: 'bg-green-50' },
  emerald: { bg: 'bg-emerald-500', border: 'border-emerald-200', text: 'text-emerald-700', light: 'bg-emerald-50' },
  blue: { bg: 'bg-blue-500', border: 'border-blue-200', text: 'text-blue-700', light: 'bg-blue-50' },
  cyan: { bg: 'bg-cyan-500', border: 'border-cyan-200', text: 'text-cyan-700', light: 'bg-cyan-50' },
  purple: { bg: 'bg-purple-500', border: 'border-purple-200', text: 'text-purple-700', light: 'bg-purple-50' },
};

export default function CFDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
              <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Cloudflare Edge Cache Demo</h1>
              <p className="text-gray-600 mt-1">Frontend Takımı Sunumu - Edge Computing & Cache Layers</p>
            </div>
          </div>
          
          {/* PageSpeed Test Info */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mt-6">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-orange-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="font-medium text-orange-900">PageSpeed ile Test Et!</h3>
                <p className="text-sm text-orange-700 mt-1">
                  Her demo sayfası <strong>gerçek latency simülasyonu</strong> yapar. 
                  PageSpeed Insights ile test edip TTFB farklarını gör!
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Demo Cards */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Demo Senaryoları</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {DEMOS.map((demo) => {
            const colors = colorClasses[demo.color];
            return (
              <a
                key={demo.id}
                href={demo.path}
                className={`block bg-white rounded-xl border-2 ${colors.border} hover:shadow-lg transition-all group overflow-hidden`}
              >
                <div className={`${colors.light} p-4 border-b ${colors.border}`}>
                  <div className="flex items-center justify-between">
                    <div className={`${colors.text}`}>
                      {demo.icon}
                    </div>
                    <span className={`text-xs font-bold ${colors.text} ${colors.light} px-2 py-1 rounded`}>
                      Demo {demo.id}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                    {demo.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-2">{demo.description}</p>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex justify-between text-xs">
                      <div>
                        <span className="text-gray-500">Cache Status:</span>
                        <span className={`ml-1 font-medium ${colors.text}`}>{demo.cacheStatus}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">TTFB:</span>
                        <span className="ml-1 font-medium text-gray-700">{demo.avgTTFB}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            );
          })}
        </div>

        {/* Comparison Chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">TTFB Karşılaştırması (Gerçek Latency)</h2>
          
          <div className="space-y-4">
            {/* Slow Backend */}
            <div className="flex items-center gap-4">
              <div className="w-48 text-sm font-medium text-gray-700">Backend Yavaş (Demo 1a)</div>
              <div className="flex-1">
                <div className="h-8 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-red-500 rounded-full flex items-center justify-end pr-3" style={{ width: '100%' }}>
                    <span className="text-xs font-bold text-white">~1000ms</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Fast Backend */}
            <div className="flex items-center gap-4">
              <div className="w-48 text-sm font-medium text-gray-700">Backend Hızlı (Demo 1b)</div>
              <div className="flex-1">
                <div className="h-8 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full flex items-center justify-end pr-3" style={{ width: '5%', minWidth: '80px' }}>
                    <span className="text-xs font-bold text-white">~50ms</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Edge Cache HIT */}
            <div className="flex items-center gap-4">
              <div className="w-48 text-sm font-medium text-gray-700">Edge Cache HIT</div>
              <div className="flex-1">
                <div className="h-8 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full flex items-center justify-end pr-3" style={{ width: '5%', minWidth: '80px' }}>
                    <span className="text-xs font-bold text-white">~50ms</span>
                  </div>
                </div>
              </div>
            </div>

            {/* SWR */}
            <div className="flex items-center gap-4">
              <div className="w-48 text-sm font-medium text-gray-700">SWR (STALE)</div>
              <div className="flex-1">
                <div className="h-8 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full flex items-center justify-end pr-3" style={{ width: '5%', minWidth: '80px' }}>
                    <span className="text-xs font-bold text-white">~50ms</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              💡 <strong>PageSpeed ile test et:</strong> Yavaş backend (Demo 1a) ve Hızlı backend (Demo 1b) arasındaki 
              skor farkını göreceksin!
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>Cloudflare Edge Cache Demo - Frontend Takımı</span>
            <span>Built with Next.js + Tailwind CSS</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
