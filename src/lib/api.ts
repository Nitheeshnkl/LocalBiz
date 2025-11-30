import { Institution, NearbyBusiness, Business } from './types';
import institutionsData from '../data/institutions_coimbatore.json';

export async function fetchInstitutions(city: string = 'Coimbatore'): Promise<Institution[]> {
  try {
    // Return local data instead of API call
    return institutionsData as Institution[];
  } catch (error) {
    console.error('Failed to fetch institutions:', error);
    return [];
  }
}

export async function fetchNearbyBusinesses(
  lat: number,
  lng: number
): Promise<NearbyBusiness[]> {
  try {
    const response = await fetch(`/api/businesses?lat=${lat}&lng=${lng}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch nearby businesses:', error);
    return [];
  }
}

export async function getBusinesses(lat?: number, lng?: number): Promise<Business[]> {
  try {
    if (!lat || !lng) {
      // Return empty array if no location provided
      return [];
    }

    const businesses = await fetchNearbyBusinesses(lat, lng);

    // Transform NearbyBusiness[] to Business[]
    const transformedBusinesses: Business[] = businesses.map((nb: NearbyBusiness) => ({
      id: nb.place_id || `business_${Math.random()}`,
      name: nb.name,
      description: `${nb.category} business`,
      category: nb.category,
      address: nb.address || '',
      latitude: nb.lat,
      longitude: nb.lng,
      phone: '',
      email: '',
      website: '',
      image: '',
      rating: nb.rating,
      reviewCount: 0,
      priceRange: '₹',
      hours: {},
      operatingHours: nb.open_now ? 'Open now' : 'Closed',
      amenities: [],
      studentDiscount: false,
      nearbyInstitutions: [],
      photos: []
    }));
    return transformedBusinesses;
  } catch (error) {
    console.error('Failed to fetch businesses:', error);
    return [];
  }
}
