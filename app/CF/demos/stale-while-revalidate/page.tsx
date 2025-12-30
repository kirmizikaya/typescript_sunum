import { Metadata } from 'next';
import { PropertyDetailSSR } from '../../components/PropertyDetailSSR';
import { DemoControlsClient } from '../../components/DemoControlsClient';
import { getPropertyData } from '../../lib/property-service';
import { DataLayerScript } from '../../components/Scripts';
import { createDataLayerData } from '../../lib/dataLayerUtils';
import { EmlakjetHeader } from '../../components/EmlakjetHeader';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Default listing ID - gerçek Emlakjet ilanı
const LISTING_ID = '18248872';

// SEO Metadata
export async function generateMetadata(): Promise<Metadata> {
  const { listing } = await getPropertyData(LISTING_ID, 50);
  
  return {
    title: `${listing.seo.title} | SWR Demo`,
    description: `Demo: Stale-While-Revalidate. Eski veri hemen sunulur, arka planda güncellenir.`,
  };
}

/**
 * Demo 3: Stale-While-Revalidate
 * 
 * 0-10sn: HIT (fresh)
 * 10-25sn: STALE (eski veri sunulur)
 * 25sn+: EXPIRED
 * Emlakjet API'den gerçek veri çekiyor + Benzer İlanlar
 */
export default async function SWRDemoPage() {
  const { listing, similarListings } = await getPropertyData(LISTING_ID, 50);
  const dataLayerData = createDataLayerData(listing);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* SSR DataLayer */}
      <DataLayerScript listingData={dataLayerData} />
      
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/CF" className="text-gray-600 hover:text-gray-900">
              ← Dashboard
            </a>
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
            <span className="ml-2 text-sm">İlan: #{listing.id}</span>
          </p>
        </div>
      </div>

      {/* Emlakjet Header - Full Width */}
      <EmlakjetHeader />

      <main className="max-w-7xl mx-auto">
        <PropertyDetailSSR listing={listing} similarListings={similarListings} />
      </main>

      <DemoControlsClient 
        strategy="swr"
        propertyId={String(listing.id)}
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
