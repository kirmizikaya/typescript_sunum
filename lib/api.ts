import {
  Property,
  PropertyFilter,
  PaginatedResponse,
} from "@/types/property";
import { DUMMY_PROPERTIES } from "@/types/data";

// =============================================================================
// GENERIC DATA FETCHING - Promise dönüş tipi
// =============================================================================

export async function getProperties(
  filter?: PropertyFilter
): Promise<PaginatedResponse<Property>> {
  // Simüle edilmiş API gecikmesi
  await new Promise((resolve) => setTimeout(resolve, 100));

  let filtered = [...DUMMY_PROPERTIES];

  // Filtreleme
  if (filter?.listingType) {
    filtered = filtered.filter((p) => p.listingType === filter.listingType);
  }
  if (filter?.propertyType) {
    filtered = filtered.filter((p) => p.propertyType === filter.propertyType);
  }
  if (filter?.city) {
    filtered = filtered.filter((p) => p.location.city === filter.city);
  }
  if (filter?.minPrice) {
    filtered = filtered.filter((p) => p.price >= filter.minPrice!);
  }
  if (filter?.maxPrice) {
    filtered = filtered.filter((p) => p.price <= filter.maxPrice!);
  }

  return {
    items: filtered,
    pagination: {
      total: filtered.length,
      page: 1,
      perPage: 20,
      totalPages: 1,
    },
  };
}

// Tek property getir - Union return type (Property | null)
export async function getPropertyById(id: string): Promise<Property | null> {
  await new Promise((resolve) => setTimeout(resolve, 50));
  return DUMMY_PROPERTIES.find((p) => p.id === id) || null;
}
