import Link from 'next/link';
import { Metadata } from 'next';
import { PropertyDetailSSR } from '../../components/PropertyDetailSSR';
import { DemoControlsClient } from '../../components/DemoControlsClient';
import { getProperty } from '../../lib/property-service';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// SEO Metadata
export async function generateMetadata(): Promise<Metadata> {
  const property = await getProperty('cf-demo-1', 50); // 50ms latency
  
  return {
    title: `${property.title} | Backend Hızlı Demo`,
    description: `Demo: Hızlı backend (~50ms). PageSpeed'de yüksek skor.`,
  };
}

/**
 * Demo 1b: No Cache - Backend Hızlı
 * 
 * Gerçek 50ms latency - PageSpeed'de fark göreceksin
 */
export default async function NoCacheFastPage() {
  // GERÇEK 50ms bekleme
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
              Demo 1b: Backend Hızlı (~50ms)
            </h1>
          </div>
          <Link 
            href="/CF/demos/no-cache-slow" 
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm"
          >
            Yavaş versiyona git →
          </Link>
        </div>
      </header>

      <div className="bg-green-50 border-b border-green-200 px-4 py-3">
        <div className="max-w-7xl mx-auto">
          <p className="text-green-700">
            ⚡ Bu sayfa <strong>~50ms</strong> backend latency ile render edildi. PageSpeed skorun yüksek olacak!
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
          title: 'Hızlı Backend - Her istek ~50ms',
          description: 'PageSpeed testinde bu sayfayı test et, sonra <a href="/CF/demos/no-cache-slow" class="underline">yavaş versiyonu</a> test et ve skorları karşılaştır!',
          color: 'green'
        }}
        showAge={false}
        showClearCache={false}
      />
    </div>
  );
}

