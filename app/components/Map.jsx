'use client';

import React, { useEffect, useCallback, useRef, useState } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Create a DivIcon for emoji markers
const EmojiIcon = (emoji) =>
  L.divIcon({
    html: emoji,
    className: 'emoji-marker', // no default Leaflet styles
    iconSize: [50, 50],
    iconAnchor: [25, 25], // center the emoji
  });

// Component to handle map move events
const MapEvents = ({ onMoveEnd }) => {
  useMapEvents({ moveend: onMoveEnd });
  return null;
};

const Map = ({ fetchCats, cats = [] }) => {
  const mapRef = useRef(null);
  const [position, setPosition] = useState(null);

  // Initialize map at some default position
  useEffect(() => {
    const staticPosition = [48.1362654, 11.4918432]; // Example: Munich
    setPosition(staticPosition);

    if (fetchCats) {
      fetchCats({
        latitude: staticPosition[0],
        longitude: staticPosition[1],
        radius: 5,
      });
    }
  }, [fetchCats]);

  // Handle map movement to fetch new nearby cats
  const handleMoveEnd = useCallback(() => {
    if (!mapRef.current || !fetchCats) return;
    const center = mapRef.current.getCenter();
    fetchCats({
      latitude: center.lat,
      longitude: center.lng,
      radius: 5,
    });
  }, [fetchCats]);

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
        <MapEvents onMoveEnd={handleMoveEnd} />

        {/* User location marker */}
        <Marker position={position} icon={EmojiIcon('📍')}>
          <Popup>Your Location</Popup>
        </Marker>

        {/* Cat / Pokémon markers */}
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
