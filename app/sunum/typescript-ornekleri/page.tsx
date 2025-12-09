import { Suspense } from "react";
import { Metadata } from "next";
import { getProperties } from "@/lib/api";
import { PropertyFilter } from "@/types/property";
import { PropertyCard } from "@/components/PropertyCard";
import { PropertyFilters } from "@/components/PropertyFilters";
import { trackPageView } from "@/lib/utils";

// =============================================================================
// PAGE PROPS - Next.js 16 async searchParams
// =============================================================================

interface SearchParams {
  listingType?: string;
  propertyType?: string;
  city?: string;
  minPrice?: string;
  maxPrice?: string;
}

interface PageProps {
  searchParams: Promise<SearchParams>;
}

// =============================================================================
// METADATA - generateMetadata ile dinamik SEO
// =============================================================================

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const params = await searchParams;
  const listingType = params.listingType === "rent" ? "Kiralık" : "Satılık";

  return {
    title: `${listingType} Emlak İlanları | TypeScript Örnekleri`,
    description: `Next.js 16 ve TypeScript ile ${listingType.toLowerCase()} emlak ilanları`,
  };
}

// =============================================================================
// ANA SAYFA KOMPONENTİ - Server Component (SSR)
// =============================================================================

export default async function PropertyListPage({ searchParams }: PageProps) {
  const params = await searchParams;

  // Search params'ı PropertyFilter tipine çevir
  const filter: PropertyFilter = {
    listingType: params.listingType as PropertyFilter["listingType"],
    propertyType: params.propertyType as PropertyFilter["propertyType"],
    city: params.city,
    minPrice: params.minPrice ? parseInt(params.minPrice) : undefined,
    maxPrice: params.maxPrice ? parseInt(params.maxPrice) : undefined,
  };

  // Generic fonksiyon ile veri çekme - PaginatedResponse<Property> döner
  const { items: properties, pagination } = await getProperties(filter);

  // Void fonksiyon - analytics
  trackPageView("property-list");

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {filter.listingType === "rent" ? "Kiralık" : "Satılık"} Emlak İlanları
          </h1>
          <p className="mt-2 text-gray-600">
            TypeScript İleri Seviye Kavramlar - Next.js 16 Örneği
          </p>
          <p className="text-sm text-gray-500">
            {pagination.total} ilan bulundu
          </p>
        </header>

        {/* Filters - Client Component */}

        <PropertyFilters currentFilter={filter} />

        {/* Property Grid */}
        {properties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg mt-8">
            <p className="text-gray-500">Aramanıza uygun ilan bulunamadı</p>
          </div>
        )}

        {/* TypeScript Kavramları Özeti */}
        <section className="mt-12 p-6 bg-white rounded-lg">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Bu Sayfada Kullanılan TypeScript Kavramları
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h3 className="font-semibold text-blue-600">Tip Tanımlama</h3>
              <p className="text-gray-600">Property, PropertyFilter interface&apos;leri</p>
            </div>
            <div>
              <h3 className="font-semibold text-blue-600">Generic Types</h3>
              <p className="text-gray-600">PaginatedResponse&lt;T&gt;, getProperties()</p>
            </div>
            <div>
              <h3 className="font-semibold text-blue-600">Utility Types</h3>
              <p className="text-gray-600">Pick, Partial, Record</p>
            </div>
            <div>
              <h3 className="font-semibold text-blue-600">Readonly</h3>
              <p className="text-gray-600">PROPERTY_TYPES, CITIES sabitleri</p>
            </div>
            <div>
              <h3 className="font-semibold text-blue-600">Void Functions</h3>
              <p className="text-gray-600">trackPageView(), updateFilter()</p>
            </div>
            <div>
              <h3 className="font-semibold text-blue-600">keyof</h3>
              <p className="text-gray-600">getPropertyValue&lt;K extends keyof Property&gt;</p>
            </div>
            <div>
              <h3 className="font-semibold text-blue-600">Mapped Types</h3>
              <p className="text-gray-600">ValidationErrors&lt;T&gt;</p>
            </div>
            <div>
              <h3 className="font-semibold text-blue-600">Rest Parameters</h3>
              <p className="text-gray-600">cn(...classes) fonksiyonu</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
