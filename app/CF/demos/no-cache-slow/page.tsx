import Link from 'next/link';
import { Metadata } from 'next';
import { PropertyDetailSSR } from '../../components/PropertyDetailSSR';
import { DemoControlsClient } from '../../components/DemoControlsClient';
import { getListingDetail } from '../../lib/property-service';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Default listing ID - gerçek Emlakjet ilanı
const LISTING_ID = '18248872';

// SEO Metadata
export async function generateMetadata(): Promise<Metadata> {
  const listing = await getListingDetail(LISTING_ID, 1000);
  
  return {
    title: `${listing.seo.title} | Backend Yavaş Demo`,
    description: `Demo: Yavaş backend (~1000ms). ${listing.seo.description}`,
  };
}

/**
 * Demo 1a: No Cache - Backend Yavaş
 * 
 * Gerçek 1000ms latency - PageSpeed'de fark göreceksin
 * Emlakjet API'den gerçek veri çekiyor
 */
export default async function NoCacheSlowPage() {
  // GERÇEK 1000ms bekleme + API call
  const listing = await getListingDetail(LISTING_ID, 1000);

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
            <span className="ml-2 text-sm">İlan: #{listing.id}</span>
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto">
        <PropertyDetailSSR listing={listing} />
      </main>

      <DemoControlsClient 
        strategy="none"
        propertyId={String(listing.id)}
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
