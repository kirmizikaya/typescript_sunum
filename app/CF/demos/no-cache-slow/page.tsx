import Link from 'next/link';
import { Metadata } from 'next';
import { PropertyDetailSSR } from '../../components/PropertyDetailSSR';
import { DemoControlsClient } from '../../components/DemoControlsClient';
import { getProperty } from '../../lib/property-service';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// SEO Metadata
export async function generateMetadata(): Promise<Metadata> {
  const property = await getProperty('cf-demo-1', 1000); // 1000ms latency
  
  return {
    title: `${property.title} | Backend Yavaş Demo`,
    description: `Demo: Yavaş backend (~1000ms). PageSpeed'de düşük skor.`,
  };
}

/**
 * Demo 1a: No Cache - Backend Yavaş
 * 
 * Gerçek 1000ms latency - PageSpeed'de fark göreceksin
 */
export default async function NoCacheSlowPage() {
  // GERÇEK 1000ms bekleme
  const property = await getProperty('cf-demo-1', 1000);

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
              Demo 1a: Backend Yavaş (~1000ms)
            </h1>
          </div>
          <Link 
            href="/CF/demos/no-cache-fast" 
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm"
          >
            Hızlı versiyona git →
          </Link>
        </div>
      </header>

      <div className="bg-red-50 border-b border-red-200 px-4 py-3">
        <div className="max-w-7xl mx-auto">
          <p className="text-red-700">
            🐌 Bu sayfa <strong>~1000ms</strong> backend latency ile render edildi. PageSpeed skorun düşük olacak!
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto">
        <PropertyDetailSSR property={property} />
      </main>

      <DemoControlsClient 
        strategy="none"
        propertyId="cf-demo-1"
        infoBanner={{
          title: 'Yavaş Backend - Her istek ~1000ms',
          description: 'PageSpeed testinde bu sayfayı test et, sonra <a href="/CF/demos/no-cache-fast" class="underline">hızlı versiyonu</a> test et ve skorları karşılaştır!',
          color: 'orange'
        }}
        showAge={false}
        showClearCache={false}
      />
    </div>
  );
}

