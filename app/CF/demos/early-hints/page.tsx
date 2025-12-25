import Link from 'next/link';
import { Metadata } from 'next';
import { PropertyDetailSSR } from '../../components/PropertyDetailSSR';
import { DemoControlsClient } from '../../components/DemoControlsClient';
import { getProperty } from '../../lib/property-service';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// SEO Metadata - basit tutuyoruz
export async function generateMetadata(): Promise<Metadata> {
  const property = await getProperty('cf-demo-1', 50);
  
  return {
    title: `${property.title} | Early Hints Demo`,
    description: `Demo: HTTP 103 Early Hints. Kritik kaynaklar önceden yüklenir.`,
  };
}

/**
 * Demo 4: Early Hints (103)
 * 
 * Link header ile kritik kaynaklar preload edilir.
 * Browser, ana response gelmeden font/CSS yüklemeye başlar.
 */
export default async function EarlyHintsDemoPage() {
  const property = await getProperty('cf-demo-1', 50);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/CF" className="text-gray-600 hover:text-gray-900">
              ← Dashboard
            </Link>
            <div className="h-6 w-px bg-gray-300" />
            <h1 className="text-lg font-semibold text-gray-900">
              Demo 4: Early Hints (103)
            </h1>
          </div>
        </div>
      </header>

      <div className="bg-cyan-50 border-b border-cyan-200 px-4 py-3">
        <div className="max-w-7xl mx-auto">
          <p className="text-cyan-700">
            🚀 Bu sayfa <strong>Link header</strong> ile kritik kaynakları preload ediyor. 
            Network tab'ında <code className="bg-cyan-100 px-1 rounded">Link</code> header'ını gör!
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto">
        <PropertyDetailSSR property={property} />
      </main>

      <DemoControlsClient 
        strategy="basic"
        propertyId="cf-demo-1"
        infoBanner={{
          title: '103 Early Hints - Kritik kaynakları önceden yükle',
          description: 'Network tab\'ında response headers\'a bak: <strong>Link</strong> header ile font ve image host preload/preconnect ediliyor.',
          color: 'cyan'
        }}
        showAge={true}
        showClearCache={true}
      />
    </div>
  );
}
