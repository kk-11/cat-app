'use client';

import React, { useRef } from 'react';
import Providers from './providers.jsx';
import Map from './components/Map.jsx';
import CatList from './components/CatList.jsx';
import { CameraStuff } from './components/CameraStuff.jsx';
import { useCats } from './contexts/CatContext.jsx';

function Content() {
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
}

export default function Page() {
  return (
    <Providers>
      <Content />
    </Providers>
  );
}
