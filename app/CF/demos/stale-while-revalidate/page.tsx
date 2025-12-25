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
    title: `${property.title} | SWR Demo`,
    description: `Demo: Stale-While-Revalidate. Eski veri hemen sunulur, arka planda güncellenir.`,
  };
}

/**
 * Demo 3: Stale-While-Revalidate
 * 
 * 0-10sn: HIT (fresh)
 * 10-25sn: STALE (eski veri sunulur)
 * 25sn+: EXPIRED
 */
export default async function SWRDemoPage() {
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
              Demo 3: Stale-While-Revalidate
            </h1>
          </div>
        </div>
      </header>

      <div className="bg-blue-50 border-b border-blue-200 px-4 py-3">
        <div className="max-w-7xl mx-auto">
          <p className="text-blue-700">
            🔄 <strong>SWR</strong>: Cache süresi dolsa bile eski veri hemen sunulur. 
            Arka planda güncelleme yapılır. Kullanıcı beklemez!
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto">
        <PropertyDetailSSR property={property} />
      </main>

      <DemoControlsClient 
        strategy="swr"
        propertyId="cf-demo-1"
        infoBanner={{
          title: 'SWR - Eski veriyi hemen sun, arka planda güncelle',
          description: '<strong>0-10sn:</strong> HIT | <strong>10-25sn:</strong> STALE | <strong>25sn+:</strong> EXPIRED',
          color: 'blue'
        }}
        showAge={true}
        showClearCache={true}
      />
    </div>
  );
}
