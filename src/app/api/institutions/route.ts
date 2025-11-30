import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city') || 'Coimbatore';

    // Use Nominatim to search for colleges and universities in Coimbatore
    const queries = [
      'college Coimbatore Tamil Nadu India',
      'university Coimbatore Tamil Nadu India',
      'school Coimbatore Tamil Nadu India'
    ];

    const allInstitutions: any[] = [];

    for (const query of queries) {
      try {
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=20&bounded=1&viewbox=76.5,11.5,77.5,10.5`;

        const response = await fetch(url, {
          headers: {
            'User-Agent': 'LocalBusinessDirectory/1.0'
          }
        });

        if (!response.ok) {
          console.warn(`Failed to fetch for query: ${query}, status: ${response.status}`);
          continue;
        }

        const data = await response.json();
        console.log(`Query "${query}" returned ${data.length} results`);

        // Filter results to ensure they are in Coimbatore area
        const filteredData = data.filter((item: any) => {
          const displayName = item.display_name.toLowerCase();
          return displayName.includes('coimbatore') ||
                 displayName.includes('tamil nadu') ||
                 (item.lat && item.lon &&
                  parseFloat(item.lat) >= 10.5 && parseFloat(item.lat) <= 11.5 &&
                  parseFloat(item.lon) >= 76.5 && parseFloat(item.lon) <= 77.5);
        });

        allInstitutions.push(...filteredData);
      } catch (error) {
        console.warn(`Error fetching for query: ${query}`, error);
        continue;
      }
    }

    // Remove duplicates based on place_id or coordinates
    const uniqueInstitutions = allInstitutions.filter((item, index, self) =>
      index === self.findIndex(i =>
        i.place_id === item.place_id ||
        (i.lat === item.lat && i.lon === item.lon)
      )
    );

    // Transform to our Institution interface
    const institutions = uniqueInstitutions.map((item: any) => ({
      name: item.display_name.split(',')[0] || item.display_name,
      display_name: item.display_name,
      latitude: parseFloat(item.lat),
      longitude: parseFloat(item.lon),
      place_id: item.place_id,
      type: item.display_name.toLowerCase().includes('college') ||
           item.display_name.toLowerCase().includes('university') ? 'college' : 'school',
      address: item.display_name
    }));

    return NextResponse.json(institutions);
  } catch (error) {
    console.error('Error fetching institutions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch institutions' },
      { status: 500 }
    );
  }
}
