import { NextResponse } from 'next/server';
import { mockCats } from '../../../data/cats.js';

// In-memory storage (replace with database in production)
let cats = [...mockCats];

// Mark this route as dynamic to avoid static rendering during export
export const dynamic = 'force-dynamic';

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function getClosestCats(lat, lng, count = 5) {
  const catsWithDistance = cats.map((cat) => ({
    ...cat,
    distance: calculateDistance(lat, lng, cat.location.lat, cat.location.lng),
  }));

  return catsWithDistance
    .sort((a, b) => a.distance - b.distance)
    .slice(0, count)
    .map(({ distance, ...cat }) => ({ ...cat, distance: parseFloat(distance.toFixed(2)) }));
}

export async function GET(request) {
  try {
    const { searchParams } = request.nextUrl;
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    const q = searchParams.get('q');
    const countParam = searchParams.get('count');

    if (q) {
      const query = q.toLowerCase();
      const filteredCats = cats.filter(
        (cat) =>
          cat.name.toLowerCase().includes(query) ||
          (cat.breed && cat.breed.toLowerCase().includes(query)) ||
          (cat.description && cat.description.toLowerCase().includes(query)),
      );
      return NextResponse.json({ cats: filteredCats, totalCats: filteredCats.length });
    }

    if (lat && lng) {
      const latNum = parseFloat(lat);
      const lngNum = parseFloat(lng);
      const countNum = Number.isNaN(parseInt(countParam, 10)) ? 5 : parseInt(countParam, 10);

      if (Number.isNaN(latNum) || Number.isNaN(lngNum)) {
        return NextResponse.json({ error: 'Invalid latitude or longitude parameters' }, { status: 400 });
      }

      const closestCats = getClosestCats(latNum, lngNum, countNum);
      return NextResponse.json({ cats: closestCats, totalCats: cats.length });
    }

    return NextResponse.json({ cats, totalCats: cats.length });
  } catch (error) {
    console.error('Error fetching cats:', error);
    return NextResponse.json({ error: 'Failed to fetch cats' }, { status: 500 });
  }
}
