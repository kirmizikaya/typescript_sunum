import Image from 'next/image';
import { EmlakjetSimilarListing, getImageUrl } from '../types/emlakjet-api';
import { formatListingPrice } from '../lib/property-service';

interface SimilarListingsSliderProps {
  listings: EmlakjetSimilarListing[];
  title?: string;
}

/**
 * Benzer İlanlar Slider - SSR Component
 * 
 * SEO için tüm ilanlar HTML'de render edilir.
 * Scroll için CSS overflow kullanılır (JS yok).
 */
export function SimilarListingsSlider({ listings, title = 'Benzer İlanlar' }: SimilarListingsSliderProps) {
  if (!listings || listings.length === 0) return null;

  return (
    <section className="border-t border-gray-200 py-6">
      <div className="px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <a href="#" className="text-[#58b847] hover:underline text-sm font-medium">
            Tümünü Gör →
          </a>
        </div>

        {/* Horizontal Scroll Container - CSS only, no JS */}
        <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
          {listings.map((listing) => (
            <SimilarListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </div>
    </section>
  );
}

function SimilarListingCard({ listing }: { listing: EmlakjetSimilarListing }) {
  const roomCount = listing.quickInfo.find(q => q.key === 'room_count')?.value || '-';
  const floorNumber = listing.quickInfo.find(q => q.key === 'floor_number')?.value || '-';
  const imageUrl = getImageUrl(listing.coverPhoto);

  return (
    <a
      href={`https://www.emlakjet.com${listing.url}`}
      className="flex-shrink-0 w-[280px] bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow snap-start group"
      itemScope
      itemType="https://schema.org/RealEstateListing"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] bg-gray-100">
        <Image
          src={imageUrl}
          alt={listing.title}
          fill
          className="object-cover"
          sizes="280px"
        />
        {/* Favorite Button (decorative) */}
        <button className="absolute top-2 right-2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center hover:bg-white">
          <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
        {/* Price trend badge */}
        {listing.price.trend === 'down' && (
          <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded">
            Fiyat Düştü
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-3">
        {/* Title */}
        <h3 
          className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-[#58b847] transition-colors min-h-[40px]"
          itemProp="name"
        >
          {listing.title}
        </h3>

        {/* Quick Info */}
        <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
          <span>{roomCount}</span>
          <span className="text-gray-300">|</span>
          <span>{floorNumber}</span>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span itemProp="address">{listing.locationSummary}</span>
        </div>

        {/* Price */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <span 
            className="text-lg font-bold text-gray-900"
            itemProp="price"
          >
            {formatListingPrice(listing.price.value, listing.price.currency)}
          </span>
          <meta itemProp="priceCurrency" content={listing.price.currency === 'TL' ? 'TRY' : listing.price.currency} />
        </div>
      </div>
    </a>
  );
}

// CSS için scrollbar-hide class'ı (globals.css'e eklenebilir)
// .scrollbar-hide::-webkit-scrollbar { display: none; }
// .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

