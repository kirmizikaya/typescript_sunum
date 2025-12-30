/**
 * Property Service
 * 
 * Emlakjet API'den veri çeker.
 * Latency simülasyonu ile farklı demo senaryoları oluşturur.
 */

import {
  EmlakjetListingDetail,
  EmlakjetSimilarListing,
  getImageUrl,
  getLogoUrl,
  getPropertyValue,
  flattenAttributes,
  stripHtml,
} from '../types/emlakjet-api';

// API endpoints
const EMLAKJET_API_BASE = 'https://api.emlakjet.com/search/v1';
const DEFAULT_LISTING_ID = '18248872'; // Demo için default ilan

export interface PropertyResponse {
  listing: EmlakjetListingDetail;
  similarListings: EmlakjetSimilarListing[];
  fetchedAt: string;
}

/**
 * Latency simülasyonu
 * @param ms - Bekleme süresi (milisaniye)
 */
async function simulateLatency(ms: number = 50): Promise<void> {
  if (ms > 0) {
    await new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * Emlakjet API'den ilan detayı getir
 * 
 * @param id - Listing ID
 * @param latency - Simüle edilecek latency (ms), default 50ms
 */
export async function getListingDetail(id: string = DEFAULT_LISTING_ID, latency: number = 50): Promise<EmlakjetListingDetail> {
  // API latency simülasyonu
  await simulateLatency(latency);
  
  const response = await fetch(`${EMLAKJET_API_BASE}/listing/detail/${id}`, {
    next: { revalidate: 0 }, // Her zaman fresh data
    headers: {
      'Accept': 'application/json',
    },
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch listing: ${response.status}`);
  }
  
  return response.json();
}

/**
 * Emlakjet API'den benzer ilanları getir
 * 
 * @param id - Listing ID
 * @param limit - Kaç ilan getirilecek
 */
export async function getSimilarListings(id: string = DEFAULT_LISTING_ID, limit: number = 20): Promise<EmlakjetSimilarListing[]> {
  const response = await fetch(
    `${EMLAKJET_API_BASE}/listing/similar/${id}?accountOnly=false&limit=${limit}`,
    {
      next: { revalidate: 0 },
      headers: {
        'Accept': 'application/json',
      },
    }
  );
  
  if (!response.ok) {
    throw new Error(`Failed to fetch similar listings: ${response.status}`);
  }
  
  return response.json();
}

/**
 * Tüm property verisini getir (listing + similar)
 * 
 * @param id - Listing ID
 * @param latency - Simüle edilecek latency (ms), default 50ms
 */
export async function getPropertyData(id: string = DEFAULT_LISTING_ID, latency: number = 50): Promise<PropertyResponse> {
  // Paralel fetch
  const [listing, similarListings] = await Promise.all([
    getListingDetail(id, latency),
    getSimilarListings(id, latency),
  ]);
  
  return {
    listing,
    similarListings,
    fetchedAt: new Date().toISOString(),
  };
}

/**
 * Property'yi ID ile getir (basit versiyon)
 * 
 * @param id - Listing ID
 * @param latency - Simüle edilecek latency (ms), default 50ms
 */
export async function getProperty(id: string = DEFAULT_LISTING_ID, latency: number = 50): Promise<EmlakjetListingDetail> {
  return getListingDetail(id, latency);
}

// Helper: Image'leri full URL'e çevir
export function getListingImages(listing: EmlakjetListingDetail): string[] {
  return listing.imagesFullPath || listing.images.map(img => getImageUrl(img));
}

// Helper: Özellikleri düzleştir
export function getListingFeatures(listing: EmlakjetListingDetail) {
  return flattenAttributes(listing.attributes);
}

// Helper: Açıklamayı temizle
export function getCleanDescription(listing: EmlakjetListingDetail): string {
  return stripHtml(listing.description);
}

// Helper: Property değerini key ile al
export function getListingProperty(listing: EmlakjetListingDetail, key: string): string | null {
  return getPropertyValue(listing.properties, key);
}

// Helper: Fiyatı formatla
export function formatListingPrice(price: number, currency: string = 'TL'): string {
  return new Intl.NumberFormat('tr-TR', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price) + ' ' + currency;
}

// Re-export helpers
export { getImageUrl, getLogoUrl, stripHtml };
