/**
 * Property Service
 * 
 * API katmanını simüle eder.
 * Latency simülasyonu ile gerçek API gibi davranır.
 */

import { mockProperty, similarProperties, getPropertyById } from '../data/mock-properties';
import { Property } from '../types';

export interface PropertyResponse {
  property: Property;
  similarProperties: Property[];
  fetchedAt: string;
}

/**
 * Latency simülasyonu
 * @param ms - Bekleme süresi (milisaniye)
 */
async function simulateLatency(ms: number = 50): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Property verisini getir (API simülasyonu)
 * 
 * @param id - Property ID
 * @param latency - Simüle edilecek latency (ms), default 50ms
 */
export async function getPropertyData(id: string, latency: number = 50): Promise<PropertyResponse> {
  // API latency simülasyonu
  await simulateLatency(latency);
  
  const property = id === 'cf-demo-1' 
    ? mockProperty 
    : getPropertyById(id) || mockProperty;
  
  return {
    property,
    similarProperties: similarProperties.slice(0, 4),
    fetchedAt: new Date().toISOString()
  };
}

/**
 * Property'yi ID ile getir (API simülasyonu)
 * 
 * @param id - Property ID
 * @param latency - Simüle edilecek latency (ms), default 50ms
 */
export async function getProperty(id: string, latency: number = 50): Promise<Property> {
  // API latency simülasyonu
  await simulateLatency(latency);
  
  return id === 'cf-demo-1' 
    ? mockProperty 
    : getPropertyById(id) || mockProperty;
}
