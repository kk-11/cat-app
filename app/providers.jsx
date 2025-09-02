'use client';

import React from 'react';
import { LocationProvider } from './contexts/LocationContext.jsx';
import { CatProvider } from './contexts/CatContext.jsx';
import { CameraProvider } from './contexts/CameraContext.jsx';

export default function Providers({ children }) {
  return (
    <LocationProvider>
      <CatProvider>
        <CameraProvider>{children}</CameraProvider>
      </CatProvider>
    </LocationProvider>
  );
}
