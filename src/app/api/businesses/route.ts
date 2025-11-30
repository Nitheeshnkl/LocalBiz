import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');

  if (!lat || !lng) {
    return NextResponse.json(
      { error: 'Latitude and longitude are required' },
      { status: 400 }
    );
  }

  const latNum = parseFloat(lat);
  const lngNum = parseFloat(lng);

  if (isNaN(latNum) || isNaN(lngNum)) {
    return NextResponse.json(
      { error: 'Invalid latitude or longitude' },
      { status: 400 }
    );
  }

  console.log(`Fetching businesses for lat: ${latNum}, lng: ${lngNum}`);

  // Overpass API query to fetch amenities within 1500m
  const overpassQuery = `
    [out:json][timeout:25];
    (
      node(around:1500,${latNum},${lngNum})["amenity"];
      node(around:1500,${latNum},${lngNum})["shop"];
      node(around:1500,${latNum},${lngNum})["leisure"];
      node(around:1500,${latNum},${lngNum})["tourism"];
    );
    out center;
  `;

  const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`;

  let businesses = [];

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'LocalBusinessDirectory/1.0'
      }
    });

    if (!response.ok) {
      throw new Error(`Overpass API error: ${response.status}`);
    }

    const data = await response.json();

    // Transform Overpass data to our format
    businesses = data.elements
      .filter((element: any) => element.type === 'node' && element.tags)
      .map((element: any) => {
        const tags = element.tags;
        let category = 'business';

        // Determine category based on amenity/shop/leisure/tourism tags
        if (tags.amenity) {
          category = tags.amenity.replace(/_/g, ' ');
        } else if (tags.shop) {
          category = tags.shop.replace(/_/g, ' ');
        } else if (tags.leisure) {
          category = tags.leisure.replace(/_/g, ' ');
        } else if (tags.tourism) {
          category = tags.tourism.replace(/_/g, ' ');
        }

        // Calculate approximate distance (simple Euclidean distance)
        const distance = Math.sqrt(
          Math.pow(element.lat - latNum, 2) +
          Math.pow(element.lon - lngNum, 2)
        ) * 111000; // Rough conversion to meters

        return {
          name: tags.name || `${category} (${element.id})`,
          category: category,
          open_now: false, // Overpass doesn't provide opening hours
          rating: 0, // Overpass doesn't provide ratings
          address: tags['addr:full'] || tags['addr:street'] || '',
          distance: Math.round(distance),
          lat: element.lat,
          lng: element.lon,
          place_id: `osm_${element.id}`
        };
      })
      .filter((business: any) => business.name && business.name !== business.category) // Filter out unnamed businesses
      .slice(0, 50); // Limit results
  } catch (error) {
    console.error('Error fetching from Overpass API:', error);
    // businesses remains []
  }

  return NextResponse.json(businesses);
}
