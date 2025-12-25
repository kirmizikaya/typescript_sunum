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
    title: `${property.title} | Edge Cache Demo`,
    description: `Demo: Basic Edge Cache. İlk istek MISS, sonrakiler HIT.`,
  };
}

/**
 * Demo 2: Basic Edge Cache
 * 
 * İlk istek: MISS (~800-1200ms)
 * Sonraki istekler: HIT (~10-25ms)
 */
export default async function EdgeCacheDemoPage() {
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
              Demo 2: Basic Edge Cache
            </h1>
          </div>
        </div>
      </header>

      <div className="bg-green-50 border-b border-green-200 px-4 py-3">
        <div className="max-w-7xl mx-auto">
          <p className="text-green-700">
            💾 İlk istek <strong>MISS</strong>, sonrakiler <strong>HIT</strong>. 
            Sayfayı yenile ve Network tab'ında CF-Cache-Status'u kontrol et!
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
          title: 'Basic Edge Cache - İlk istek MISS, sonrakiler HIT',
          description: 'Network tab\'ında CF-Cache-Status header\'ını kontrol et. İlk istekte MISS, sonrakilerde HIT görmelisin.',
          color: 'green'
        }}
        showAge={true}
        showClearCache={true}
      />
    </div>
  );
}
