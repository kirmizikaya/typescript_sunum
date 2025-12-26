import { EmlakjetListingDetail, getPropertyValue } from '../types/emlakjet-api';

/**
 * DataLayer için listing verilerini hazırlayan yardımcı fonksiyon
 */
export interface DataLayerListingData {
  id: string;
  title: string;
  price: string;
  currency: string;
  city: string;
  district: string;
  town: string;
  type: string;
  category: string;
  subcategory: string;
  roomCount: string;
  grossArea: string;
  netArea: string;
  buildingAge: string;
  floorNumber: string;
  totalFloors: string;
  accountType: string;
  accountId: string;
  accountName: string;
}

export function createDataLayerData(listing: EmlakjetListingDetail): DataLayerListingData {
  return {
    id: String(listing.id),
    title: listing.title,
    price: String(listing.priceDetail.price),
    currency: listing.priceDetail.currency,
    city: listing.location.city.name,
    district: listing.location.district.name,
    town: listing.location.town.name,
    type: 'Konut',
    category: 'Satılık',
    subcategory: 'Daire',
    roomCount: String(getPropertyValue(listing.properties, 'room_count') || ''),
    grossArea: String(getPropertyValue(listing.properties, 'gross_square') || ''),
    netArea: String(getPropertyValue(listing.properties, 'net_square') || ''),
    buildingAge: String(getPropertyValue(listing.properties, 'building_age') || ''),
    floorNumber: String(getPropertyValue(listing.properties, 'floor') || ''),
    totalFloors: String(getPropertyValue(listing.properties, 'building_floor_count') || ''),
    accountType: listing.owner.account.type || 'kurumsal',
    accountId: String(listing.owner.account.id),
    accountName: listing.owner.account.name,
  };
}

