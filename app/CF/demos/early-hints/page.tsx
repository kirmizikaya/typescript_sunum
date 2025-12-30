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
    title: `${listing.seo.title} | Early Hints Demo`,
    description: `Demo: HTTP 103 Early Hints. Kritik kaynaklar önceden yüklenir.`,
  };
}

/**
 * Demo 4: Early Hints (103)
 * 
 * Link header ile kritik kaynaklar preload edilir.
 * Browser, ana response gelmeden font/CSS yüklemeye başlar.
 * Emlakjet API'den gerçek veri çekiyor + Benzer İlanlar
 */
export default async function EarlyHintsDemoPage() {
  const { listing, similarListings } = await getPropertyData(LISTING_ID, 0);
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
          title: '103 Early Hints - Kritik kaynakları önceden yükle',
          description: 'Network tab\'ında response headers\'a bak: <strong>Link</strong> header ile imaj ve API host preload/preconnect ediliyor.',
          color: 'cyan'
        }}
        showAge={true}
        showClearCache={true}
      />
    </div>
  );
}
