'use client';

import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useLocation } from '../contexts/LocationContext.jsx';

const EmojiIcon = (emoji) =>
  L.divIcon({
    html: emoji,
    className: 'emoji-marker',
    iconSize: [50, 50],
    iconAnchor: [25, 25],
  });

const Map = ({ fetchCats, cats = [] }) => {
  const mapRef = useRef(null);
  const [position, setPosition] = useState(null);
  const { currentLocation } = useLocation();

  // Initialize map at some default position
  useEffect(() => {
    // const gotthardstrasse = [48.1362654, 11.4918432];
    // const acricolastrasse = [48.1426927, 11.4931448];
    const location = [currentLocation.latitude, currentLocation.longitude];

    setPosition(location);

    if (fetchCats) {
      fetchCats({
        latitude: location[0],
        longitude: location[1],
        radius: 5,
      });
    }
  }, [fetchCats, currentLocation]);

  if (!position) return <div>Loading map...</div>;

  return (
    <div style={{ height: '100%', width: '100%', minHeight: '400px' }}>
      <MapContainer
        center={position}
        zoom={18}
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={position} icon={EmojiIcon('⌾')}>
          <Popup>Your Location</Popup>
        </Marker>

        {cats.map(
          (cat) =>
            cat?.location && (
              <Marker
                key={cat.id}
                position={[cat.location.lat, cat.location.lng]}
                icon={EmojiIcon('😸')}
              >
                <Popup>
                  <h3>{cat.name || 'Unnamed Cat'}</h3>
                  <div>😸</div>
                </Popup>
              </Marker>
            ),
        )}
      </MapContainer>
    </div>
  );
};

export default Map;
