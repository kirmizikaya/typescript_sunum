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
  const { listing } = await getPropertyData(LISTING_ID, 0);
  
  return {
    title: `${listing.seo.title} | Edge Cache Demo`,
    description: `Demo: Basic Edge Cache. İlk istek MISS, sonrakiler HIT.`,
  };
}

/**
 * Demo 2: Basic Edge Cache
 * 
 * İlk istek: MISS (~800-1200ms)
 * Sonraki istekler: HIT (~10-25ms)
 * Emlakjet API'den gerçek veri çekiyor + Benzer İlanlar
 */
export default async function EdgeCacheDemoPage() {
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
        strategy="basic"
        propertyId={String(listing.id)}
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
