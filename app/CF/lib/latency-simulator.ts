// Latency profilleri - gerçekçi değerler
export const LATENCY_PROFILES = {
  origin: {
    min: 800,
    max: 1200,
    jitter: 100,
    description: 'Origin sunucu yanıt süresi'
  },
  edgeHit: {
    min: 10,
    max: 25,
    jitter: 5,
    description: 'Edge cache HIT yanıt süresi'
  },
  stale: {
    min: 10,
    max: 20,
    jitter: 3,
    description: 'Stale content yanıt süresi'
  },
  backgroundRevalidation: {
    min: 2000,
    max: 3000,
    jitter: 200,
    description: 'Arka plan revalidation süresi'
  },
  earlyHints: {
    min: 5,
    max: 10,
    jitter: 2,
    description: '103 Early Hints yanıt süresi'
  }
} as const;

export type LatencyProfile = keyof typeof LATENCY_PROFILES;

/**
 * Rastgele jitter ekler
 */
export function addJitter(base: number, jitter: number): number {
  const variance = (Math.random() - 0.5) * 2 * jitter;
  return Math.max(0, Math.round(base + variance));
}

/**
 * Min-max arasında rastgele değer üretir
 */
export function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Belirli bir profil için latency simüle eder
 */
export async function simulateLatency(profile: LatencyProfile): Promise<number> {
  const config = LATENCY_PROFILES[profile];
  const baseLatency = randomBetween(config.min, config.max);
  const finalLatency = addJitter(baseLatency, config.jitter);
  
  await new Promise(resolve => setTimeout(resolve, finalLatency));
  
  return finalLatency;
}

/**
 * Sadece latency değerini hesaplar (beklemeden)
 */
export function calculateLatency(profile: LatencyProfile): number {
  const config = LATENCY_PROFILES[profile];
  const baseLatency = randomBetween(config.min, config.max);
  return addJitter(baseLatency, config.jitter);
}

/**
 * Özel latency ile bekler
 */
export async function waitFor(ms: number): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * TTFB zone'unu belirler
 */
export function getTTFBZone(ttfb: number): {
  zone: 'excellent' | 'good' | 'needs-improvement' | 'poor';
  color: string;
  label: string;
} {
  if (ttfb < 100) {
    return { zone: 'excellent', color: '#22c55e', label: 'Mükemmel' };
  } else if (ttfb < 300) {
    return { zone: 'good', color: '#84cc16', label: 'İyi' };
  } else if (ttfb < 600) {
    return { zone: 'needs-improvement', color: '#eab308', label: 'Geliştirilmeli' };
  } else {
    return { zone: 'poor', color: '#ef4444', label: 'Kötü' };
  }
}

/**
 * Response time'ı formatlar
 */
export function formatResponseTime(ms: number): string {
  if (ms < 1000) {
    return `${Math.round(ms)}ms`;
  }
  return `${(ms / 1000).toFixed(2)}s`;
}

