import { 
  CFCacheStatus, 
  CacheEntry, 
  SimulatorConfig, 
  SimulatedResponse,
  EarlyHint 
} from '../types';
import { 
  simulateLatency, 
  calculateLatency, 
  waitFor,
  LATENCY_PROFILES 
} from './latency-simulator';

// Varsayılan konfigürasyon
const DEFAULT_CONFIG: SimulatorConfig = {
  cacheEnabled: true,
  cacheStrategy: 'basic',
  originLatency: 1000,
  cacheMaxAge: 3600,
  staleWhileRevalidate: 30,
  earlyHintsEnabled: false
};

// Cache status renk ve açıklamaları
export const CACHE_STATUS_CONFIG: Record<CFCacheStatus, {
  color: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  description: string;
  descriptionTR: string;
}> = {
  HIT: {
    color: '#22c55e',
    bgColor: 'bg-green-500/20',
    borderColor: 'border-green-500',
    textColor: 'text-green-500',
    description: 'Content served from edge cache',
    descriptionTR: 'İçerik edge cache\'den sunuldu'
  },
  MISS: {
    color: '#eab308',
    bgColor: 'bg-yellow-500/20',
    borderColor: 'border-yellow-500',
    textColor: 'text-yellow-500',
    description: 'Not in cache, fetched from origin',
    descriptionTR: 'Cache\'de yok, origin\'den alındı'
  },
  EXPIRED: {
    color: '#f97316',
    bgColor: 'bg-orange-500/20',
    borderColor: 'border-orange-500',
    textColor: 'text-orange-500',
    description: 'Cache TTL exceeded, must refetch',
    descriptionTR: 'Cache süresi doldu, yeniden alınması gerekiyor'
  },
  STALE: {
    color: '#3b82f6',
    bgColor: 'bg-blue-500/20',
    borderColor: 'border-blue-500',
    textColor: 'text-blue-500',
    description: 'Serving stale while revalidating',
    descriptionTR: 'Eski içerik sunuluyor, arka planda güncelleniyor'
  },
  BYPASS: {
    color: '#6b7280',
    bgColor: 'bg-gray-500/20',
    borderColor: 'border-gray-500',
    textColor: 'text-gray-500',
    description: 'Cache intentionally bypassed',
    descriptionTR: 'Cache kasıtlı olarak atlandı'
  },
  REVALIDATED: {
    color: '#06b6d4',
    bgColor: 'bg-cyan-500/20',
    borderColor: 'border-cyan-500',
    textColor: 'text-cyan-500',
    description: 'Stale content successfully revalidated',
    descriptionTR: 'Eski içerik başarıyla güncellendi'
  },
  UPDATING: {
    color: '#a855f7',
    bgColor: 'bg-purple-500/20',
    borderColor: 'border-purple-500',
    textColor: 'text-purple-500',
    description: 'Cache being updated in background',
    descriptionTR: 'Cache arka planda güncelleniyor'
  },
  DYNAMIC: {
    color: '#ef4444',
    bgColor: 'bg-red-500/20',
    borderColor: 'border-red-500',
    textColor: 'text-red-500',
    description: 'Not eligible for caching',
    descriptionTR: 'Cache için uygun değil'
  }
};

// Early Hints varsayılan kaynaklar - gerçek harici domainler
export const DEFAULT_EARLY_HINTS: EarlyHint[] = [
  { resource: 'https://imaj.emlakjet.com', rel: 'preconnect' },
  { resource: 'https://api.emlakjet.com', rel: 'preconnect' },
  { resource: 'https://www.googletagmanager.com', rel: 'preconnect' },
  { resource: 'https://connect.facebook.net', rel: 'dns-prefetch' }
];

// CF-Ray ID üreteci
function generateCFRay(): string {
  const chars = '0123456789abcdef';
  let ray = '';
  for (let i = 0; i < 16; i++) {
    ray += chars[Math.floor(Math.random() * chars.length)];
  }
  return `${ray}-IST`;
}

export class CloudflareSimulator {
  private cache: Map<string, CacheEntry>;
  private config: SimulatorConfig;
  private requestCount: number;
  private cacheHits: number;
  private cacheMisses: number;
  private responseTimes: number[];
  private revalidatingKeys: Set<string>;
  private onRevalidationComplete?: (key: string) => void;

  constructor(config: Partial<SimulatorConfig> = {}) {
    this.cache = new Map();
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.requestCount = 0;
    this.cacheHits = 0;
    this.cacheMisses = 0;
    this.responseTimes = [];
    this.revalidatingKeys = new Set();
  }

  /**
   * Konfigürasyonu günceller
   */
  updateConfig(config: Partial<SimulatorConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Ana fetch metodu - Cloudflare davranışını simüle eder
   */
  async fetch(url: string, data: unknown, options?: RequestInit): Promise<SimulatedResponse> {
    this.requestCount++;
    const startTime = performance.now();

    // POST/PUT/DELETE = DYNAMIC
    if (options?.method && ['POST', 'PUT', 'DELETE'].includes(options.method)) {
      const latency = await simulateLatency('origin');
      return this.createResponse(data, 'DYNAMIC', latency, false);
    }

    // Cache devre dışı = DYNAMIC
    if (!this.config.cacheEnabled || this.config.cacheStrategy === 'none') {
      const latency = await simulateLatency('origin');
      return this.createResponse(data, 'DYNAMIC', latency, false);
    }

    const cacheKey = url;
    const cached = this.cache.get(cacheKey);
    const now = Date.now();

    // Cache'de yok = MISS
    if (!cached) {
      const latency = await simulateLatency('origin');
      this.cacheMisses++;
      
      // Cache'e kaydet
      this.cache.set(cacheKey, {
        data,
        timestamp: now,
        maxAge: this.config.cacheMaxAge * 1000, // saniye -> ms
        swr: this.config.staleWhileRevalidate * 1000,
        headers: this.getResponseHeaders('MISS')
      });

      return this.createResponse(data, 'MISS', latency, false);
    }

    const age = now - cached.timestamp;
    const isExpired = age > cached.maxAge;
    const isStale = age > cached.maxAge && age <= (cached.maxAge + cached.swr);
    const isFullyExpired = age > (cached.maxAge + cached.swr);

    // Tamamen expire olmuş
    if (isFullyExpired) {
      const latency = await simulateLatency('origin');
      this.cacheMisses++;
      
      // Cache'i güncelle
      this.cache.set(cacheKey, {
        data,
        timestamp: now,
        maxAge: this.config.cacheMaxAge * 1000,
        swr: this.config.staleWhileRevalidate * 1000,
        headers: this.getResponseHeaders('EXPIRED')
      });

      return this.createResponse(data, 'EXPIRED', latency, false);
    }

    // Stale-while-revalidate window'unda
    if (isStale && this.config.cacheStrategy === 'swr') {
      const latency = calculateLatency('stale');
      await waitFor(latency);
      this.cacheHits++;

      // Arka plan revalidation başlat
      const isRevalidating = this.revalidatingKeys.has(cacheKey);
      if (!isRevalidating) {
        this.triggerBackgroundRevalidation(cacheKey, data);
      }

      return this.createResponse(cached.data, 'STALE', latency, true, true);
    }

    // Fresh cache hit
    if (!isExpired) {
      const latency = calculateLatency('edgeHit');
      await waitFor(latency);
      this.cacheHits++;
      
      return this.createResponse(cached.data, 'HIT', latency, true, false, Math.floor(age / 1000));
    }

    // Expired ama SWR yok
    const latency = await simulateLatency('origin');
    this.cacheMisses++;
    
    this.cache.set(cacheKey, {
      data,
      timestamp: now,
      maxAge: this.config.cacheMaxAge * 1000,
      swr: this.config.staleWhileRevalidate * 1000,
      headers: this.getResponseHeaders('MISS')
    });

    return this.createResponse(data, 'MISS', latency, false);
  }

  /**
   * Arka plan revalidation
   */
  private async triggerBackgroundRevalidation(key: string, freshData: unknown): Promise<void> {
    this.revalidatingKeys.add(key);
    
    // Revalidation süresini simüle et
    await simulateLatency('backgroundRevalidation');
    
    // Cache'i güncelle
    this.cache.set(key, {
      data: freshData,
      timestamp: Date.now(),
      maxAge: this.config.cacheMaxAge * 1000,
      swr: this.config.staleWhileRevalidate * 1000,
      headers: this.getResponseHeaders('REVALIDATED')
    });
    
    this.revalidatingKeys.delete(key);
    this.onRevalidationComplete?.(key);
  }

  /**
   * Revalidation callback'i ayarla
   */
  setRevalidationCallback(callback: (key: string) => void): void {
    this.onRevalidationComplete = callback;
  }

  /**
   * Response objesi oluşturur
   */
  private createResponse(
    data: unknown,
    cacheStatus: CFCacheStatus,
    responseTime: number,
    fromCache: boolean,
    backgroundRevalidating = false,
    age?: number
  ): SimulatedResponse {
    this.responseTimes.push(responseTime);

    const headers = this.getResponseHeaders(cacheStatus, age);

    return {
      data,
      headers,
      status: 200,
      cacheStatus,
      responseTime,
      fromCache,
      backgroundRevalidating
    };
  }

  /**
   * Response header'larını oluşturur
   */
  getResponseHeaders(status: CFCacheStatus, age?: number): Record<string, string> {
    const headers: Record<string, string> = {
      'CF-Cache-Status': status,
      'CF-Ray': generateCFRay(),
      'Content-Type': 'application/json',
      'X-Response-Time': `${calculateLatency(status === 'HIT' || status === 'STALE' ? 'edgeHit' : 'origin')}ms`
    };

    // Cache-Control header'ı
    switch (this.config.cacheStrategy) {
      case 'none':
        headers['Cache-Control'] = 'private, no-store';
        break;
      case 'basic':
        headers['Cache-Control'] = `public, max-age=${this.config.cacheMaxAge}`;
        break;
      case 'swr':
        headers['Cache-Control'] = `public, max-age=0, s-maxage=${this.config.cacheMaxAge}, stale-while-revalidate=${this.config.staleWhileRevalidate}`;
        break;
      case 'early-hints':
        headers['Cache-Control'] = `public, max-age=${this.config.cacheMaxAge}`;
        break;
    }

    // Age header (sadece cache hit'lerde)
    if (age !== undefined && status === 'HIT') {
      headers['Age'] = String(age);
    }

    return headers;
  }

  /**
   * Early Hints header'larını döner
   */
  getEarlyHintsHeaders(): string[] {
    if (!this.config.earlyHintsEnabled) return [];
    
    return DEFAULT_EARLY_HINTS.map(hint => {
      let header = `<${hint.resource}>; rel=${hint.rel}`;
      if (hint.as) header += `; as=${hint.as}`;
      if (hint.crossorigin) header += '; crossorigin';
      return header;
    });
  }

  /**
   * Belirli bir key için cache durumunu döner
   */
  getCacheStatus(key: string): CFCacheStatus {
    const cached = this.cache.get(key);
    if (!cached) return 'MISS';

    const age = Date.now() - cached.timestamp;
    
    if (age <= cached.maxAge) return 'HIT';
    if (age <= cached.maxAge + cached.swr) return 'STALE';
    return 'EXPIRED';
  }

  /**
   * Cache age'i döner (saniye)
   */
  getCacheAge(key: string): number | null {
    const cached = this.cache.get(key);
    if (!cached) return null;
    return Math.floor((Date.now() - cached.timestamp) / 1000);
  }

  /**
   * Cache'i temizler
   */
  clearCache(): void {
    this.cache.clear();
    this.revalidatingKeys.clear();
  }

  /**
   * Metrikleri döner
   */
  getMetrics(): {
    totalRequests: number;
    cacheHits: number;
    cacheMisses: number;
    hitRate: number;
    avgResponseTime: number;
  } {
    const total = this.cacheHits + this.cacheMisses;
    const hitRate = total > 0 ? (this.cacheHits / total) * 100 : 0;
    const avgResponseTime = this.responseTimes.length > 0
      ? this.responseTimes.reduce((a, b) => a + b, 0) / this.responseTimes.length
      : 0;

    return {
      totalRequests: this.requestCount,
      cacheHits: this.cacheHits,
      cacheMisses: this.cacheMisses,
      hitRate: Math.round(hitRate * 100) / 100,
      avgResponseTime: Math.round(avgResponseTime)
    };
  }

  /**
   * Her şeyi sıfırlar
   */
  reset(): void {
    this.cache.clear();
    this.requestCount = 0;
    this.cacheHits = 0;
    this.cacheMisses = 0;
    this.responseTimes = [];
    this.revalidatingKeys.clear();
  }

  /**
   * Belirli bir status'u zorla simüle eder (demo için)
   */
  async simulateStatus(status: CFCacheStatus, data: unknown): Promise<SimulatedResponse> {
    let latency: number;
    let fromCache = false;
    
    switch (status) {
      case 'HIT':
      case 'REVALIDATED':
        latency = calculateLatency('edgeHit');
        fromCache = true;
        break;
      case 'STALE':
      case 'UPDATING':
        latency = calculateLatency('stale');
        fromCache = true;
        break;
      default:
        latency = calculateLatency('origin');
    }
    
    await waitFor(latency);
    
    return this.createResponse(
      data,
      status,
      latency,
      fromCache,
      status === 'STALE' || status === 'UPDATING'
    );
  }

  /**
   * Aktif revalidation var mı?
   */
  isRevalidating(key: string): boolean {
    return this.revalidatingKeys.has(key);
  }

  /**
   * Cache'deki tüm key'leri döner
   */
  getCacheKeys(): string[] {
    return Array.from(this.cache.keys());
  }
}

// Singleton instance
let simulatorInstance: CloudflareSimulator | null = null;

export function getSimulator(config?: Partial<SimulatorConfig>): CloudflareSimulator {
  if (!simulatorInstance) {
    simulatorInstance = new CloudflareSimulator(config);
  } else if (config) {
    simulatorInstance.updateConfig(config);
  }
  return simulatorInstance;
}

export function resetSimulator(): void {
  if (simulatorInstance) {
    simulatorInstance.reset();
  }
}

