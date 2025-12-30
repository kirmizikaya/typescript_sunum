import Image from 'next/image';
import { EmlakjetOwner, EmlakjetSimilarListing, getImageUrl, getLogoUrl } from '../types/emlakjet-api';
import { formatListingPrice } from '../lib/property-service';

interface CompanyCardProps {
  owner: EmlakjetOwner;
  companyListings?: EmlakjetSimilarListing[];
}

/**
 * Firma Künyesi Component - SSR
 * 
 * Firmanın bilgileri ve diğer ilanları gösterir.
 * SEO-friendly, tüm içerik HTML'de render edilir.
 */
export function CompanyCard({ owner, companyListings = [] }: CompanyCardProps) {
  const { account, member, accountDocument } = owner;
  const logoUrl = getLogoUrl(account.logo);

  // Firmanın diğer ilanlarını filtrele (max 3)
  const otherListings = companyListings
    .filter(l => l.ownerId === account.id)
    .slice(0, 3);

  return (
    <section className="border-t border-gray-200 py-6">
      <div className="px-4">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Firma Künyesi</h2>

        {/* Company Info Card */}
        <div className="border border-gray-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-4">
            {/* Logo */}
            {logoUrl && (
              <div className="flex-shrink-0 w-20 h-20 border border-gray-200 rounded flex items-center justify-center bg-white">
                <Image
                  src={logoUrl}
                  alt={account.name}
                  width={72}
                  height={72}
                  className="object-contain"
                />
              </div>
            )}

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded">
                  {account.durationOfMembership}. Yıl
                </span>
              </div>
              <p className="text-gray-600 text-sm mt-1">{account.name}</p>
            </div>
          </div>

          {/* Document Info */}
          {accountDocument.state === 'yes' && accountDocument.no && (
            <div className="mt-4 pt-4 border-t border-gray-200 text-sm text-gray-600">
              <span className="font-medium">Taşınmaz Ticari Yetki Belgesi</span>
              <span className="ml-2">{accountDocument.no}</span>
            </div>
          )}
        </div>

        {/* Company's Other Listings */}
        {otherListings.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Firmanın Diğer İlanları</h3>
              <a href="#" className="text-[#58b847] hover:underline text-sm font-medium">
                Diğer İlanlarını Gör
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {otherListings.map((listing) => (
                <CompanyListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function CompanyListingCard({ listing }: { listing: EmlakjetSimilarListing }) {
  const roomCount = listing.quickInfo.find(q => q.key === 'room_count')?.value || '-';
  const floorNumber = listing.quickInfo.find(q => q.key === 'floor_number')?.value || '-';
  const imageUrl = getImageUrl(listing.coverPhoto);

  return (
    <a
      href={`https://www.emlakjet.com${listing.url}`}
      className="block border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow group"
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
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        {/* Favorite */}
        <button className="absolute top-2 right-2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center">
          <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="p-3">
        <h4 
          className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-[#58b847] min-h-[40px]"
          itemProp="name"
        >
          {listing.title}
        </h4>

        <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
          <span>{roomCount}</span>
          <span className="text-gray-300">|</span>
          <span>{floorNumber}</span>
        </div>

        <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>{listing.locationSummary}</span>
        </div>

        <div className="mt-3 pt-3 border-t border-gray-100">
          <span className="text-lg font-bold text-gray-900">
            {formatListingPrice(listing.price.value, listing.price.currency)}
          </span>
        </div>
      </div>
    </a>
  );
}

