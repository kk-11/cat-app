import { Router } from 'express';
import { mockCats } from '../data/cats.js';

const router = Router();

// In-memory storage (replace with database in production)
let cats = [...mockCats];

// Helper function to calculate distance between two points using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

// Helper function to get the closest cats to a given location
function getClosestCats(lat, lng, count = 5) {
  // Add distance to each cat
  const catsWithDistance = cats.map((cat) => ({
    ...cat,
    distance: calculateDistance(lat, lng, cat.location.lat, cat.location.lng),
  }));

  console.log({ catsWithDistance });
  // Sort by distance and return the closest ones
  return catsWithDistance
    .sort((a, b) => a.distance - b.distance)
    .slice(0, count)
    .map(({ distance, ...cat }) => ({
      ...cat,
      distance: parseFloat(distance.toFixed(2)),
    }));
}

// Get all cats or search by query
router.get('/', (req, res) => {
  try {
    const { lat, lng, q, count } = req.query;

    // If search query is provided
    if (q) {
      const query = q.toLowerCase();
      const filteredCats = cats.filter(
        (cat) =>
          cat.name.toLowerCase().includes(query) ||
          (cat.breed && cat.breed.toLowerCase().includes(query)) ||
          (cat.description && cat.description.toLowerCase().includes(query)),
      );
      return res.json({
        cats: filteredCats,
        totalCats: filteredCats.length,
      });
    }

    // If lat and lng are provided, return the closest cats
    if (lat && lng) {
      const latNum = parseFloat(lat);
      const lngNum = parseFloat(lng);
      const countNum = Number.isNaN(parseInt(count, 10))
        ? 5
        : parseInt(count, 10);

      if (isNaN(latNum) || isNaN(lngNum)) {
        return res.status(400).json({
          error: 'Invalid latitude or longitude parameters',
        });
      }

      const closestCats = getClosestCats(latNum, lngNum, countNum);
      return res.json({
        cats: closestCats,
        totalCats: cats.length,
      });
    }

    // Otherwise, return all cats
    res.json({
      cats,
      totalCats: cats.length,
    });
  } catch (error) {
    console.error('Error fetching cats:', error);
    res.status(500).json({ error: 'Failed to fetch cats' });
  }
});

// Get a single cat by ID
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const cat = cats.find((c) => c.id === id);

    if (!cat) {
      return res.status(404).json({ error: 'Cat not found' });
    }
    res.json(cat);
  } catch (error) {
    console.error('Error fetching cat:', error);
    res.status(500).json({ error: 'Failed to fetch cat' });
  }
});

export default router;
