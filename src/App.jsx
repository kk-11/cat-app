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

const Content = () => {
  const { cats, fetchCats } = useCats();

  const mapInstance = useRef(null);

  const handleMapInit = (map) => {
    mapInstance.current = map;
  };

  return (
    <div className="app">
      <main>
        <CatList cats={cats} />

        <Map onMapInit={handleMapInit} fetchCats={fetchCats} cats={cats} />

        <CameraStuff />
      </main>
    </div>
  );
};

const App = () => (
  <LocationProvider>
    <CatProvider>
      <CameraProvider>
        <Content />
      </CameraProvider>
    </CatProvider>
  </LocationProvider>
);

export default App;
