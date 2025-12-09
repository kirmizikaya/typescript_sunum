import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { getPropertyById } from "@/lib/api";
import { formatPrice } from "@/lib/utils";

// =============================================================================
// PAGE PROPS - Next.js 16 async params
// =============================================================================

interface PageProps {
  params: Promise<{ id: string }>;
}

// =============================================================================
// METADATA
// =============================================================================

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const property = await getPropertyById(id);

  if (!property) {
    return { title: "İlan Bulunamadı" };
  }

  return {
    title: `${property.title} | TypeScript Örnekleri`,
    description: property.description,
  };
}

// =============================================================================
// DETAY SAYFASI
// =============================================================================

export default async function PropertyDetailPage({ params }: PageProps) {
  const { id } = await params;

  // Union return type: Property | null
  const property = await getPropertyById(id);

  if (!property) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Back Link */}
        <Link
          href="/typescript-ornekleri"
          className="text-blue-600 hover:underline mb-4 inline-block"
        >
          ← İlanlara Dön
        </Link>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Image */}
          <div className="aspect-video bg-gray-200">
            <img
              src={property.images[0] || "https://picsum.photos/800/400"}
              alt={property.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <span
                  className={`inline-block px-3 py-1 text-sm font-medium rounded ${
                    property.listingType === "rent"
                      ? "bg-green-100 text-green-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {property.listingType === "rent" ? "Kiralık" : "Satılık"}
                </span>
                <h1 className="mt-2 text-2xl font-bold text-gray-900">
                  {property.title}
                </h1>
                <p className="mt-1 text-gray-500">
                  {property.location.district}, {property.location.city}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-600">
                  {formatPrice(property.price, property.currency)}
                </p>
                {property.listingType === "rent" && (
                  <p className="text-sm text-gray-500">/ay</p>
                )}
              </div>
            </div>

            {/* Details */}
            <div className="mt-6 grid grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg text-center">
                <p className="text-sm text-gray-500">Oda Sayısı</p>
                <p className="text-lg font-semibold">{property.details.roomCount}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg text-center">
                <p className="text-sm text-gray-500">Alan</p>
                <p className="text-lg font-semibold">{property.details.area} m²</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg text-center">
                <p className="text-sm text-gray-500">Kat</p>
                <p className="text-lg font-semibold">{property.details.floor || "-"}</p>
              </div>
            </div>

            {/* Description */}
            <div className="mt-6">
              <h2 className="font-semibold text-gray-900">Açıklama</h2>
              <p className="mt-2 text-gray-600">{property.description}</p>
            </div>

            {/* Stats */}
            <div className="mt-6 pt-6 border-t text-sm text-gray-500">
              <p>İlan No: {property.id}</p>
              <p>Görüntülenme: {property.viewCount}</p>
              <p>Yayın Tarihi: {property.createdAt.toLocaleDateString("tr-TR")}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
