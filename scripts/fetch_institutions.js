const fs = require('fs');
const path = require('path');

// Overpass API query for institutions in Coimbatore bbox
const query = `
[out:json][timeout:25];
(
  node["amenity"~"school|college|university"](10.5,76.5,11.5,77.5);
  node["education"~"school|college|university"](10.5,76.5,11.5,77.5);
);
out;
`;

async function fetchInstitutions() {
  try {
    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
    console.log('Fetching institutions from Overpass API...');

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Overpass API error: ${response.status}`);
    }

    const data = await response.json();
    console.log(`Fetched ${data.elements.length} raw elements`);

    // Process and clean data
    const institutions = data.elements
      .filter(element => element.type === 'node' && element.tags && element.tags.name)
      .map(element => {
        const tags = element.tags;

        // Determine type
        let type = 'school';
        if (tags.amenity) {
          if (tags.amenity.includes('college') || tags.amenity.includes('university')) {
            type = tags.amenity.includes('university') ? 'university' : 'college';
          }
        } else if (tags.education) {
          if (tags.education.includes('college') || tags.education.includes('university')) {
            type = tags.education.includes('university') ? 'university' : 'college';
          }
        }

        // Build address
        const addressParts = [];
        if (tags['addr:street']) addressParts.push(tags['addr:street']);
        if (tags['addr:city']) addressParts.push(tags['addr:city']);
        if (tags['addr:postcode']) addressParts.push(tags['addr:postcode']);
        const address = addressParts.join(', ') || tags.display_name || '';

        return {
          id: `inst_${element.id}`,
          name: tags.name,
          type,
          lat: element.lat,
          lon: element.lon,
          address: address || undefined
        };
      })
      .filter(inst => inst.name && inst.lat && inst.lon) // Ensure required fields
      .filter((inst, index, self) =>
        index === self.findIndex(i => i.name === inst.name && i.lat === inst.lat && i.lon === inst.lon)
      ); // Deduplicate

    console.log(`Processed ${institutions.length} unique institutions`);

    // Save to file
    const outputPath = path.join(__dirname, '..', 'src', 'data', 'institutions_coimbatore.json');
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, JSON.stringify(institutions, null, 2));
    console.log(`Saved to ${outputPath}`);

  } catch (error) {
    console.error('Error fetching institutions:', error);
    process.exit(1);
  }
}

fetchInstitutions();
