import Link from "next/link";
import { PropertyCard as PropertyCardType } from "@/types/property";
import { cn, createPropertySummary, formatPrice } from "@/lib/utils";

// =============================================================================
// PROPS TİPİ - Pick utility type ile sadece gerekli alanlar
// =============================================================================

interface Props {
  property: PropertyCardType;
}

export function PropertyCard({ property }: Props) {
  const summary = createPropertySummary(property);

  return (
    <article className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <Link href={`/typescript-ornekleri/${property.id}`}>
        {/* Image */}
        <div className="aspect-[4/3] bg-gray-200 relative">
          <img
            src={property.images[0] || "https://picsum.photos/400/300"}
            alt={property.title}
            className="w-full h-full object-cover"
          />
          {/* Badge - cn() ile conditional class */}
          <span
            className={cn(
              "absolute top-3 left-3 px-2 py-1 text-xs font-medium rounded",
              property.listingType === "rent"
                ? "bg-green-500 text-white"
                : "bg-blue-500 text-white"
            )}
          >
            {property.listingType === "rent" ? "Kiralık" : "Satılık"}
          </span>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 line-clamp-2">
            {property.title}
          </h3>

          <p className="mt-1 text-sm text-gray-500">{summary.location}</p>

          <div className="mt-2 flex gap-3 text-sm text-gray-600">
            <span>{property.details.roomCount}</span>
            <span>•</span>
            <span>{property.details.area} m²</span>
            {property.details.floor && (
              <>
                <span>•</span>
                <span>Kat {property.details.floor}</span>
              </>
            )}
          </div>

          <p className="mt-3 text-lg font-bold text-blue-600">
            {formatPrice(property.price, property.currency)}
            {property.listingType === "rent" && (
              <span className="text-sm font-normal text-gray-500"> /ay</span>
            )}
          </p>
        </div>
      </Link>
    </article>
  );
}
