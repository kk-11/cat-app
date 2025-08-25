import { Router } from "express";
import { mockCats } from "../../src/data/cats.js";

const router = Router();

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
    const distance = R * c; // Distance in km
    return distance;
}

// Helper function to get the 3 closest cats to a given location
function getClosestCats(lat, lng, count = 3) {
    // Add distance to each cat
    const catsWithDistance = mockCats.map((cat) => ({
        ...cat,
        distance: calculateDistance(
            lat,
            lng,
            cat.location.lat,
            cat.location.lng
        ),
    }));

    // Sort by distance and return the closest ones
    return catsWithDistance
        .sort((a, b) => a.distance - b.distance)
        .slice(0, count)
        .map(({ distance, ...cat }) => ({
            ...cat,
            distance: parseFloat(distance.toFixed(2)), // Round to 2 decimal places
        }));
}

// Get all cats
router.get("/", (req, res) => {
    try {
        const { lat, lng } = req.query;

        // If lat and lng are provided, return the 3 closest cats
        if (lat && lng) {
            const latNum = parseFloat(lat);
            const lngNum = parseFloat(lng);

            if (isNaN(latNum) || isNaN(lngNum)) {
                return res.status(400).json({
                    error: "Invalid latitude or longitude parameters",
                });
            }

            const closestCats = getClosestCats(latNum, lngNum);
            return res.json({
                cats: closestCats,
                userLocation: { lat: latNum, lng: lngNum },
                totalCats: mockCats.length,
            });
        }

        // Otherwise, return all cats
        res.json({
            cats: mockCats,
            totalCats: mockCats.length,
        });
    } catch (error) {
        console.error("Error fetching cats:", error);
        res.status(500).json({ error: "Failed to fetch cats" });
    }
});

// Get single cat by ID
router.get("/:id", (req, res) => {
    try {
        const catId = parseInt(req.params.id, 10);
        const cat = mockCats.find((c) => c.id === catId);
        if (!cat) {
            return res.status(404).json({ error: "Cat not found" });
        }
        res.json(cat);
    } catch (error) {
        console.error("Error fetching cat:", error);
        res.status(500).json({ error: "Failed to fetch cat" });
    }
});

export default router;
