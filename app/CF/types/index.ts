// CF-Cache-Status değerleri
export type CFCacheStatus = 
  | 'HIT' 
  | 'MISS' 
  | 'EXPIRED' 
  | 'STALE' 
  | 'BYPASS' 
  | 'REVALIDATED' 
  | 'UPDATING' 
  | 'DYNAMIC';

// Cache stratejileri
export type CacheStrategy = 'none' | 'basic' | 'swr' | 'early-hints';

// Simulator konfigürasyonu
export interface SimulatorConfig {
  cacheEnabled: boolean;
  cacheStrategy: CacheStrategy;
  originLatency: number;
  cacheMaxAge: number;
  staleWhileRevalidate: number;
  earlyHintsEnabled: boolean;
}

// Cache girişi
export interface CacheEntry {
  data: unknown;
  timestamp: number;
  maxAge: number;
  swr: number;
  headers: Record<string, string>;
}

// Simüle edilmiş yanıt
export interface SimulatedResponse {
  data: unknown;
  headers: Record<string, string>;
  status: number;
  cacheStatus: CFCacheStatus;
  responseTime: number;
  fromCache: boolean;
  backgroundRevalidating: boolean;
}

// Request log
export interface RequestLog {
  id: string;
  timestamp: number;
  url: string;
  cacheStatus: CFCacheStatus;
  responseTime: number;
  fromCache: boolean;
}

// Performance metrikleri
export interface PerformanceMetrics {
  ttfb: number;
  fcp: number;
  lcp: number;
  cacheStatus: CFCacheStatus;
  originCalls: number;
  cacheHits: number;
  cacheMisses: number;
  avgResponseTime: number;
  requestHistory: RequestLog[];
}

// Property tipleri
export interface PropertyLocation {
  city: string;
  district: string;
  neighborhood: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface PropertySpecs {
  roomCount: string;
  grossArea: number;
  netArea: number;
  floor: number;
  totalFloors: number;
  buildingAge: number;
  heatingType: string;
  bathroomCount: number;
  balcony: boolean;
  furnished: 'yes' | 'no' | 'partial';
  usageStatus: 'empty' | 'tenant' | 'owner';
  inComplex: boolean;
  dues: number | null;
  deposit: number | null;
  deedStatus: string;
  exchange: boolean;
}

export interface PropertyFeatures {
  interior: string[];
  exterior: string[];
  location: string[];
}

export interface PropertyImage {
  url: string;
  alt: string;
  width: number;
  height: number;
}

export interface Agency {
  name: string;
  logo: string;
  verified: boolean;
}

export interface Agent {
  id: string;
  name: string;
  phone: string;
  whatsapp: string;
  photo: string;
  agency: Agency;
}

export interface Property {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: number;
  currency: 'TRY' | 'USD' | 'EUR';
  pricePerSqm: number;
  listingType: 'sale' | 'rent';
  propertyType: 'apartment' | 'villa' | 'land' | 'office' | 'shop';
  location: PropertyLocation;
  specs: PropertySpecs;
  features: PropertyFeatures;
  images: PropertyImage[];
  agent: Agent;
  createdAt: string;
  updatedAt: string;
  viewCount: number;
  favoriteCount: number;
  status: 'active' | 'sold' | 'rented' | 'inactive';
  priceDrop?: {
    oldPrice: number;
    dropDate: string;
  };
}

// Demo sayfa props
export interface DemoPageProps {
  demoId: string;
  title: string;
  description: string;
}

// Cache status konfigürasyonu
export interface CacheStatusConfig {
  status: CFCacheStatus;
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
  ttfbRange: { min: number; max: number };
}

// Early Hints header
export interface EarlyHint {
  resource: string;
  rel: 'preload' | 'preconnect' | 'prefetch';
  as?: 'style' | 'script' | 'font' | 'image';
  crossorigin?: boolean;
}

// Demo state
export interface DemoState {
  currentDemo: string;
  cacheCleared: boolean;
  requestCount: number;
  lastResponse: SimulatedResponse | null;
  isLoading: boolean;
  metrics: PerformanceMetrics;
}

