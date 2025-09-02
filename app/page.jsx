'use client';

import React, { useRef } from 'react';
import Providers from './providers.jsx';
import nextDynamic from 'next/dynamic';
import CatList from './components/CatList.jsx';
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

// Ensure this page is treated as dynamic (no static HTML prerender)
export const dynamic = 'force-dynamic';

function Content() {
  const { cats, fetchCats } = useCats();
  const mapInstance = useRef(null);

  const handleMapInit = (map) => {
    mapInstance.current = map;
  };

  return (
    <div className="app">
      <Header />
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
