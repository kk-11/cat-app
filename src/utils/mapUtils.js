/**
 * Adds a cat marker to the map
 * @param {Object} map - The Leaflet map instance
 * @param {Object} location - The location { lat, lng }
 * @param {string} photoUrl - URL of the cat's photo
 * @param {string} name - The cat's name
 * @param {number} catNumber - The cat's number
 * @returns {Object} The created marker
 */
export const addCatMarker = (map, { lat, lng }, photoUrl, name, catNumber) => {
  if (!map || !window.L) return null;

  // Create a custom marker
  const marker = window.L.marker([lat, lng], {
    icon: window.L.divIcon({
      html: `<div class="cat-marker">🐱</div>`,
      className: 'cat-icon',
      iconSize: [40, 40],
      iconAnchor: [20, 40]
    })
  }).addTo(map);

  // Create popup content
  const popupContent = `
    <div style="text-align: center;">
      <img src="${photoUrl}" style="max-width: 200px; max-height: 200px; border-radius: 8px; margin-bottom: 8px;"/>
      <p>${name} #${catNumber}</p>
      <p>Spotted at: ${new Date().toLocaleString()}</p>
    </div>
  `;

  // Add popup to marker and open it
  marker.bindPopup(popupContent).openPopup();
  
  // Center map on the new marker
  map.flyTo([lat, lng], 15, {
    duration: 1,
    easeLinearity: 0.25,
  });

  return marker;
};

/**
 * Creates a photo marker for the map
 * @param {Object} location - The location { lat, lng }
 * @param {string} photoUrl - URL of the photo
 * @returns {Object} The created marker
 */
export const createPhotoMarker = (location, photoUrl) => {
  if (!window.L) return null;
  
  return window.L.marker([location.lat, location.lng], {
    icon: window.L.divIcon({
      className: 'photo-marker',
      html: `<img src="${photoUrl}" style="width: 44px; height: 44px; border-radius: 50%; object-fit: cover;">`,
      iconSize: [50, 50],
      popupAnchor: [0, -25],
    }),
  });
};
