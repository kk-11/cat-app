'use client';

import React, { useEffect, useRef } from 'react';
import Providers from './providers.jsx';
import nextDynamic from 'next/dynamic';
import Cats from './components/Cats.jsx';
import Header from './components/Header.jsx';

const Map = nextDynamic(() => import('./components/Map.jsx'), { ssr: false });
const CameraStuff = nextDynamic(
  () =>
    import('./components/CameraStuff.jsx').then(
      (m) => m.CameraStuff ?? m.default,
    ),
  { ssr: false },
);
import { useCats } from './contexts/CatContext.jsx';

export const dynamic = 'force-dynamic';

function Content() {
  const { cats, loading, fetchCats } = useCats();
  const mapInstance = useRef(null);
  useEffect(() => {
    fetchCats();
  }, []);

  const handleMapInit = (map) => {
    mapInstance.current = map;
  };

  return (
    <div className="app">
      <Header />
      <main>
        <Cats cats={cats} loading={loading} />
        <Map onMapInit={handleMapInit} cats={cats} />
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
