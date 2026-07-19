import logger from "./logger.js";

const OVERPASS_API = 'https://overpass-api.de/api/interpreter'

export async function searchOverpass(city) {

    const overpassQuery = `[out:json][timeout:10];

        area["name"="${city}"]->.searchArea;

        (
        node["amenity"="hospital"](area.searchArea);
        way["amenity"="hospital"](area.searchArea);
        relation["amenity"="hospital"](area.searchArea);
        );

        out center;
    `

    const body = new URLSearchParams({
        data: overpassQuery
    })

    const response = await fetch(OVERPASS_API, {
        method: "POST",
        headers: {
            "User-Agent": "BloodWeb/1.0 (https://github.com/codenamann/BloodWeb)",
            'Content-Type': 'application/x-www-form-urlencoded',
            Accept: 'application/json'
        },
        body
    });

    if (response.status === 504 || response.status === 429) {
        throw new Error('OVERPASS_UNAVAILABLE');
    }

    if (!response.ok) {
        logger.error(await response.text());
        throw new Error(`Overpass API failed: (${response.status})`);
    }

    const data = await response.json();

    return data.elements.map((element) => ({
        osmId: String(element.id),
        name: element.tags?.name ?? 'Unknown',
        address: element.tags?.['addr:full'] ?? null,
        state: element.tags?.['addr:state'] ?? null,
        city: element.tags?.['addr:district'] ?? null,
        coordinates: {
            lat: element.lat ?? element.center?.lat,
            lng: element.lon ?? element.center?.lon
        },
    })).filter((h) => h.coordinates.lat && h.coordinates.lng);
}