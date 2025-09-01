import React, { useRef } from 'react';
import './styles/reset.css';
import './styles/main.css';

import Map from './components/Map';
import CatList from './components/CatList.jsx';
import { CatProvider } from './contexts/CatContext';
import { CameraStuff } from './components/CameraStuff.jsx';
import { LocationProvider } from './contexts/LocationContext';
import { CameraProvider } from './contexts/CameraContext';
import { useCats } from './contexts/CatContext';

// Main App component that wraps everything with context providers
const AppContent = () => {
  const { cats, loading, error, fetchCats } = useCats();

  const mapInstance = useRef(null);

  const handleMapInit = (map) => {
    mapInstance.current = map;
  };

  return (
    <div className="app">
      <main>
        <CatList cats={cats} />
        <div className="map-container">
          <Map onMapInit={handleMapInit} fetchCats={fetchCats} cats={cats} />
        </div>
        <CameraStuff />
      </main>
    </div>
  );
};

// Main App component with all providers
const App = () => (
  <LocationProvider>
    <CatProvider>
      <CameraProvider>
        <AppContent />
      </CameraProvider>
    </CatProvider>
  </LocationProvider>
);

export default App;
