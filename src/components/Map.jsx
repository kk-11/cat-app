import { h } from 'preact';
import { useEffect, useRef } from 'preact/hooks';

const Map = ({ onMapInit, className = '' }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const customTiles = useRef(null);
  const buildingOverlay = useRef(null);

  useEffect(() => {
    if (!mapRef.current || !window.L) return;

    // Initialize map
    customTiles.current = window.L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png",
      {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 20,
      }
    );

    buildingOverlay.current = window.L.tileLayer(
      "https://tiles.wmflabs.org/osm-no-labels/{z}/{x}/{y}.png",
      {
        maxZoom: 20,
        opacity: 0.9,
      }
    );

    mapInstance.current = window.L.map(mapRef.current, {
      layers: [customTiles.current, buildingOverlay.current],
      zoomControl: true,
    }).setView([0, 0], 2);

    // Notify parent that map is initialized
    if (onMapInit && typeof onMapInit === 'function') {
      onMapInit(mapInstance.current);
    }

    // Cleanup function
    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  return <div ref={mapRef} className={`map ${className}`} style={{ height: '400px', width: '100%' }}></div>;
};

export default Map;
