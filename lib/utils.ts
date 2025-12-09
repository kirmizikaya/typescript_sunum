import { Property, PropertyCard } from "@/types/property";

// =============================================================================
// 1. VOID FONKSİYONLAR - Değer döndürmez
// =============================================================================

export function trackPageView(pageName: string): void {
  console.log(`[Analytics] Page viewed: ${pageName}`);
}

// =============================================================================
// 2. REST PARAMETRELERİ - CSS class birleştirme
// =============================================================================

export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

// =============================================================================
// 3. FONKSİYON DÖNÜŞ TİPLERİ
// =============================================================================

// Object dönüş tipi
export function createPropertySummary(property: PropertyCard): {
  id: string;
  title: string;
  price: string;
  location: string;
} {
  return {
    id: property.id,
    title: property.title,
    price: formatPrice(property.price, property.currency),
    location: `${property.location.district}, ${property.location.city}`,
  };
}

// =============================================================================
// 4. GENERIC FONKSİYON - Tip güvenli filtreleme
// =============================================================================

export function filterItems<T>(items: T[], predicate: (item: T) => boolean): T[] {
  return items.filter(predicate);
}

// =============================================================================
// 5. KEYOF KULLANIMI - Güvenli property erişimi
// =============================================================================

export function getPropertyValue<K extends keyof Property>(
  property: Property,
  key: K
): Property[K] {
  return property[key];
}

// =============================================================================
// 6. TUPLE DÖNDÜREN FONKSİYON
// =============================================================================

export function parseSearchParams(params: URLSearchParams): [string | null, string | null] {
  return [params.get("listingType"), params.get("city")];
}

// =============================================================================
// 7. YARDIMCI FONKSİYONLAR
// =============================================================================

export function formatPrice(price: number, currency: string): string {
  return `${price.toLocaleString("tr-TR")} ${currency}`;
}
