/**
 * Emlakjet API Response Types
 * 
 * https://api.emlakjet.com/search/v1/listing/detail/{id}
 * https://api.emlakjet.com/search/v1/listing/similar/{id}
 */

// Listing Detail API Response
export interface EmlakjetListingDetail {
  id: number;
  createdAt: string;
  updateAt: string;
  tradeType: {
    key: string;
    typeId: number;
    oldId: number;
  };
  breadcrumbs: EmlakjetBreadcrumb[];
  images: string[];
  imagesFullPath: string[];
  title: string;
  description: string;
  url: string;
  fromOwner: boolean;
  quickInfos: EmlakjetQuickInfo[];
  location: EmlakjetLocation;
  priceDetail: EmlakjetPriceDetail;
  properties: EmlakjetProperty[];
  attributes: EmlakjetAttributes;
  owner: EmlakjetOwner;
  googleStructuredDataList: unknown[];
  gtmDataLayers: unknown[];
  ga4DataLayers: unknown[];
  seo: EmlakjetSeo;
  metaTags: EmlakjetMetaTag[];
  adTargetingList: unknown[];
  widgets: unknown[];
  ads: unknown[];
  endeksaValuation: {
    minPrice: number;
    maxPrice: number;
  } | null;
  whatsappNumber: string;
  listingLogo: string;
  videoUrl: string | null;
  virtualTourUrl: string | null;
  priceHistories: EmlakjetPriceHistory[];
  decorator: {
    boardUrl: string | null;
  };
  eidsRealEstate: {
    realEstateId: string | null;
    isDeedExist: boolean | null;
    isEidsVerified: boolean;
  };
  hasFiber: boolean;
}

export interface EmlakjetBreadcrumb {
  url: string;
  name: string;
}

export interface EmlakjetQuickInfo {
  key: string;
  name: string;
  value: string;
}

export interface EmlakjetLocation {
  summary: string;
  coordinate: {
    lat: number;
    lon: number;
  };
  city: {
    id: number;
    name: string;
    slug: string;
  };
  district: {
    id: number;
    name: string;
    slug: string;
  };
  locality: {
    id: number;
    name: string;
    slug: string;
  } | null;
  town: {
    id: number;
    name: string;
    slug: string;
  };
  geoShape: unknown | null;
}

export interface EmlakjetPriceDetail {
  trendType: 'up' | 'down' | null;
  previousCurrency: string;
  previousPrice: number;
  previousValueValid: boolean;
  currency: string;
  price: number;
  tlPrice: number;
  alternativeValue: string;
  firstPrice: number;
  differenceRate: number;
  squareMeterPrice: number;
  opportunity: boolean;
}

export interface EmlakjetProperty {
  key: string;
  name: string;
  value: string | null;
  unit: string | null;
}

export interface EmlakjetAttributes {
  'İç Özellikler'?: Record<string, string[]>;
  'Dış Özellikler'?: Record<string, string[]>;
  'Konum Özellikleri'?: Record<string, string[]>;
}

export interface EmlakjetOwner {
  account: {
    id: number;
    name: string;
    type: 'corporate' | 'individual';
    businessName: string;
    phoneNumber: string;
    locationSummary: string | null;
    membershipType: string;
    durationOfMembership: number;
    state: string;
    logo: string;
  };
  member: {
    id: number;
    name: string;
  };
  accountDocument: {
    state: string;
    no: string;
    receivedAt: string;
  };
  memberDocument: {
    state: string;
    no: string;
    visible: boolean;
    receivedAt: string | null;
  };
}

export interface EmlakjetSeo {
  title: string;
  description: string;
}

export interface EmlakjetMetaTag {
  name: string;
  content: string;
}

export interface EmlakjetPriceHistory {
  price: number;
  trend: 'UP' | 'DOWN' | null;
  currency: string;
  changedAt: string;
}

// Similar Listings API Response
export interface EmlakjetSimilarListing {
  id: number;
  title: string;
  url: string;
  coverPhoto: string;
  price: {
    value: number;
    currency: string;
    previousValue: number | null;
    previousCurrency: string | null;
    previousValueValid: boolean | null;
    trend: 'up' | 'down' | null;
    alternativeValue: string;
    firstPrice: number;
    differenceRate: number;
  };
  location: {
    cityId: number;
    cityName: string;
    districtName: string;
    townName: string;
  };
  locationSummary: string;
  quickInfo: EmlakjetQuickInfo[];
  badges: unknown[];
  category: string;
  estateType: string;
  tradeType: string;
  phoneNumber: string;
  ownerType: 'corporate' | 'individual';
  ownerId: number;
  ownerEstateName: string;
  firstPublishedAt: string;
}

// Helper functions
export function getPropertyValue(properties: EmlakjetProperty[], key: string): string | null {
  const prop = properties.find(p => p.key === key);
  return prop?.value || null;
}

export function getImageUrl(path: string): string {
  if (path.startsWith('http')) return path;
  return `https://imaj.emlakjet.com${path}`;
}

export function getLogoUrl(path: string): string {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `https://imaj.emlakjet.com${path}`;
}

export function parseRoomCount(value: string | null): string {
  return value || '-';
}

export function parseArea(value: string | null): number {
  if (!value) return 0;
  const match = value.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

export function parseFloor(value: string | null): string {
  return value || '-';
}

export function parseFloorCount(value: string | null): number {
  if (!value) return 0;
  return parseInt(value, 10) || 0;
}

export function parseBuildingAge(value: string | null): string {
  return value || '-';
}

export function flattenAttributes(attributes: EmlakjetAttributes): {
  interior: string[];
  exterior: string[];
  location: string[];
} {
  const interior: string[] = [];
  const exterior: string[] = [];
  const location: string[] = [];

  const icOzellikler = attributes['İç Özellikler'];
  if (icOzellikler) {
    Object.values(icOzellikler).forEach(arr => interior.push(...arr));
  }

  const disOzellikler = attributes['Dış Özellikler'];
  if (disOzellikler) {
    Object.values(disOzellikler).forEach(arr => exterior.push(...arr));
  }

  const konumOzellikleri = attributes['Konum Özellikleri'];
  if (konumOzellikleri) {
    Object.values(konumOzellikleri).forEach(arr => location.push(...arr));
  }

  return { interior, exterior, location };
}

// Strip HTML tags from description
export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

