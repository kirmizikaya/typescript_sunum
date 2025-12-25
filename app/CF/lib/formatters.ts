/**
 * Fiyatı Türk Lirası formatında gösterir
 */
export function formatPrice(price: number, currency: 'TRY' | 'USD' | 'EUR' = 'TRY'): string {
  const formatter = new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
  
  return formatter.format(price);
}

/**
 * Metrekare fiyatını formatlar
 */
export function formatPricePerSqm(price: number): string {
  return `${formatPrice(price)}/m²`;
}

/**
 * Tarihi Türkçe formatında gösterir
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date);
}

/**
 * Tarihi kısa formatta gösterir
 */
export function formatDateShort(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('tr-TR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date);
}

/**
 * Göreli tarih (örn: 2 gün önce)
 */
export function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Bugün';
  if (diffDays === 1) return 'Dün';
  if (diffDays < 7) return `${diffDays} gün önce`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} hafta önce`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} ay önce`;
  return `${Math.floor(diffDays / 365)} yıl önce`;
}

/**
 * Sayıyı kısaltarak gösterir (örn: 1.2M)
 */
export function formatCompactNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
}

/**
 * Metrekareyi formatlar
 */
export function formatArea(sqm: number): string {
  return `${sqm} m²`;
}

/**
 * Telefon numarasını formatlar
 */
export function formatPhone(phone: string): string {
  // +90 532 123 45 67 formatı
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 12 && cleaned.startsWith('90')) {
    return `+90 ${cleaned.slice(2, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8, 10)} ${cleaned.slice(10)}`;
  }
  return phone;
}

/**
 * Oda sayısını Türkçe formatlar
 */
export function formatRoomCount(roomCount: string): string {
  return `${roomCount} Oda`;
}

/**
 * Kat bilgisini formatlar
 */
export function formatFloor(floor: number, totalFloors: number): string {
  if (floor === 0) return `Giriş Kat / ${totalFloors}`;
  if (floor === -1) return 'Bodrum Kat';
  return `${floor}. Kat / ${totalFloors}`;
}

/**
 * Bina yaşını formatlar
 */
export function formatBuildingAge(age: number): string {
  if (age === 0) return 'Sıfır Bina';
  if (age === 1) return '1 Yaşında';
  if (age <= 5) return `${age} Yaşında`;
  if (age <= 10) return `${age} Yaşında`;
  if (age <= 20) return `${age} Yaşında`;
  return `${age}+ Yaşında`;
}

/**
 * Listing tipini Türkçe döner
 */
export function formatListingType(type: 'sale' | 'rent'): string {
  return type === 'sale' ? 'Satılık' : 'Kiralık';
}

/**
 * Property tipini Türkçe döner
 */
export function formatPropertyType(type: 'apartment' | 'villa' | 'land' | 'office' | 'shop'): string {
  const types: Record<string, string> = {
    apartment: 'Daire',
    villa: 'Villa',
    land: 'Arsa',
    office: 'Ofis',
    shop: 'Dükkan'
  };
  return types[type] || type;
}

/**
 * Aidat bilgisini formatlar
 */
export function formatDues(dues: number | null): string {
  if (dues === null || dues === 0) return 'Aidat Yok';
  return `${formatPrice(dues)} / Ay`;
}

/**
 * Kullanım durumunu formatlar
 */
export function formatUsageStatus(status: 'empty' | 'tenant' | 'owner'): string {
  const statuses: Record<string, string> = {
    empty: 'Boş',
    tenant: 'Kiracılı',
    owner: 'Mülk Sahibi Oturuyor'
  };
  return statuses[status] || status;
}

/**
 * Mobilya durumunu formatlar
 */
export function formatFurnished(status: 'yes' | 'no' | 'partial'): string {
  const statuses: Record<string, string> = {
    yes: 'Eşyalı',
    no: 'Eşyasız',
    partial: 'Yarı Eşyalı'
  };
  return statuses[status] || status;
}

/**
 * Yüzdeyi formatlar
 */
export function formatPercentage(value: number): string {
  return `%${value.toFixed(1)}`;
}

/**
 * Byte'ı insan okunabilir formata çevirir
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Cache duration'ı insan okunabilir formata çevirir
 */
export function formatCacheDuration(seconds: number): string {
  if (seconds < 60) return `${seconds} saniye`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)} dakika`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} saat`;
  return `${Math.floor(seconds / 86400)} gün`;
}

