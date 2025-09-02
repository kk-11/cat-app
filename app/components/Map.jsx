'use client';

import React, { useEffect, useCallback, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

// Fix for default marker icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const mapStyle = { height: '100%', width: '100%', minHeight: '400px', borderRadius: '8px' };

const MapEvents = ({ onMoveEnd }) => {
  useMapEvents({ moveend: onMoveEnd });
  return null;
};

const Map = ({ fetchCats, cats = [] }) => {
  const mapRef = useRef();
  const [position, setPosition] = React.useState(null);

  useEffect(() => {
    const staticPosition = [48.1362654, 11.4918432];
    setPosition(staticPosition);
    if (fetchCats) {
      fetchCats({ latitude: staticPosition[0], longitude: staticPosition[1], radius: 5 });
    }
  }, [fetchCats]);

  const handleMoveEnd = useCallback(() => {
    if (!mapRef.current || !fetchCats) return;
    const center = mapRef.current.getCenter();
    fetchCats({ latitude: center.lat, longitude: center.lng, radius: 5 });
  }, [fetchCats]);

  if (!position) return <div>Loading map...</div>;

  return (
    <div className="map-container">
      <div style={mapStyle}>
        <MapContainer center={position} zoom={18} style={mapStyle} ref={mapRef}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapEvents onMoveEnd={handleMoveEnd} />
          <Marker position={position}>
            <Popup>Your Location</Popup>
          </Marker>
          {cats.map((cat) =>
            cat?.location ? (
              <Marker key={cat.id} position={[cat.location.lat, cat.location.lng]}>
                <Popup>
                  <h3>{cat.name || 'Unnamed Cat'}</h3>
                  {cat.pic && <img src={cat.pic} alt={cat.name || 'Cat'} style={{ maxWidth: '150px', height: 'auto' }} />}
                </Popup>
              </Marker>
            ) : null,
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default Map;
