'use client';

import React, { useRef } from 'react';
import Providers from './providers.jsx';
import nextDynamic from 'next/dynamic';
import Cats from './components/Cats.jsx';
import Header from './components/Header.jsx';

const Map = nextDynamic(() => import('./components/Map.jsx'), { ssr: false });
const Camera = nextDynamic(
  () => import('./components/Camera.jsx').then((m) => m.Camera ?? m.default),
  { ssr: false },
);
import { useCats } from './contexts/CatContext.jsx';

// Ensure this page is treated as dynamic (no static HTML prerender)
export const dynamic = 'force-dynamic';

function Content() {
  const { cats, loading, fetchCats } = useCats();
  const mapInstance = useRef(null);

  const handleMapInit = (map) => {
    mapInstance.current = map;
  };

  return (
    <div className="app">
      <Header />
      <main>
        <Cats cats={cats} loading={loading} />
        <Map onMapInit={handleMapInit} fetchCats={fetchCats} cats={cats} />
        <Camera />
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
