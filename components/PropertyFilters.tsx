"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  PropertyFilter,
  PROPERTY_TYPES,
  CITIES,
  PROPERTY_TYPE_LABELS,
} from "@/types/property";

// =============================================================================
// PROPS TİPİ - Partial<T> utility type kullanımı
// =============================================================================

interface Props {
  currentFilter: Partial<PropertyFilter>;
}

export function PropertyFilters({ currentFilter }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Filter değiştiğinde URL'i güncelle
  const updateFilter = (key: string, value: string): void => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap gap-4 p-4 bg-gray-50 rounded-lg">
      {/* Listing Type */}
      <select
        value={currentFilter.listingType || ""}
        onChange={(e) => updateFilter("listingType", e.target.value)}
        className="px-3 py-2 border rounded-lg bg-white"
      >
        <option value="">Tüm İlanlar</option>
        <option value="sale">Satılık</option>
        <option value="rent">Kiralık</option>
      </select>

      {/* Property Type - readonly array üzerinde map */}
      <select
        value={currentFilter.propertyType || ""}
        onChange={(e) => updateFilter("propertyType", e.target.value)}
        className="px-3 py-2 border rounded-lg bg-white"
      >
        <option value="">Tüm Tipler</option>
        {PROPERTY_TYPES.map((type) => (
          <option key={type} value={type}>
            {PROPERTY_TYPE_LABELS[type]}
          </option>
        ))}
      </select>

      {/* City - readonly array */}
      <select
        value={currentFilter.city || ""}
        onChange={(e) => updateFilter("city", e.target.value)}
        className="px-3 py-2 border rounded-lg bg-white"
      >
        <option value="">Tüm Şehirler</option>
        {CITIES.map((city) => (
          <option key={city} value={city}>
            {city}
          </option>
        ))}
      </select>

      {/* Clear Filters */}
      {(currentFilter.listingType || currentFilter.propertyType || currentFilter.city) && (
        <button
          onClick={() => router.push("?")}
          className="px-3 py-2 text-sm text-red-600 hover:text-red-800"
        >
          Filtreleri Temizle
        </button>
      )}
    </div>
  );
}
