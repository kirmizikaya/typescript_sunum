// =============================================================================
// 1. TİP TANIMLAMA & INTERFACE'LER
// =============================================================================

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: "TRY" | "USD" | "EUR";
  propertyType: "apartment" | "house" | "villa" | "land";
  listingType: "sale" | "rent";
  location: {
    city: string;
    district: string;
  };
  details: {
    area: number;
    roomCount: string;
    floor?: number;
  };
  images: string[];
  createdAt: Date;
  viewCount: number;
}

// =============================================================================
// 2. TUPLE - Sabit uzunluklu, farklı tipli diziler
// =============================================================================

// Fiyat aralığı tuple'ı - [min, max]
export type PriceRange = [number, number];

// =============================================================================
// 3. UTILITY TYPES KULLANIMI
// =============================================================================

// Partial<T> - Güncelleme için tüm alanlar opsiyonel
export type PropertyUpdate = Partial<Property>;

// Pick<T, K> - Kart görünümü için sadece gerekli alanlar
export type PropertyCard = Pick<
  Property,
  "id" | "title" | "price" | "currency" | "location" | "details" | "images" | "listingType"
>;

// Omit<T, K> - Oluşturma için otomatik alanları çıkar
export type PropertyCreate = Omit<Property, "id" | "createdAt" | "viewCount">;

// =============================================================================
// 4. MAPPED TYPES - Form validation için
// =============================================================================

export type ValidationErrors<T> = {
  [K in keyof T]?: string[];
};

export type PropertyErrors = ValidationErrors<Pick<Property, "title" | "price" | "description">>;

// örnek form validator fonksiyonu
type FormData = {
  email: string;
  password: string;
};
function validateForm(data: FormData): ValidationErrors<FormData> {
  const errors: ValidationErrors<FormData> = {};

  // Email validation
  if (!data.email) {
    errors.email = ["Email boş bırakılamaz"];
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = ["Geçersiz email formatı"];
  }

  // Password validation
  if (!data.password) {
    errors.password = ["Password boş bırakılamaz"];
  } else if (data.password.length < 6) {
    errors.password = ["Password en az 6 karakter olmalı"];
  }

  return errors;
}

const form: FormData = {
  email: "abc",
  password: "123",
};

const result = validateForm(form);
console.log(result);
// Çıktı:
// {
//   email: ["Geçersiz email formatı"],
//   password: ["Password en az 6 karakter olmalı"]
// }



// =============================================================================
// 5. GENERIC API RESPONSE
// =============================================================================

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
  };
}

// =============================================================================
// 6. FİLTRE TİPİ - keyof ve Partial kullanımı
// =============================================================================

export interface PropertyFilter {
  listingType?: Property["listingType"];
  propertyType?: Property["propertyType"];
  city?: string;
  minPrice?: number;
  maxPrice?: number;
}

// =============================================================================
// 7. READONLY SABİTLER
// =============================================================================

export const PROPERTY_TYPES: readonly Property["propertyType"][] = [
  "apartment",
  "house",
  "villa",
  "land",
];

export const CITIES: readonly string[] = [
  "İstanbul",
  "Ankara",
  "İzmir",
  "Antalya",
];

// Record<K, V> - Etiket mapping
export const PROPERTY_TYPE_LABELS: Record<Property["propertyType"], string> = {
  apartment: "Daire",
  house: "Müstakil Ev",
  villa: "Villa",
  land: "Arsa",
};
