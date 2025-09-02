'use client';

import React from 'react';
import { LocationProvider } from './contexts/LocationContext.jsx';
import { CatProvider } from './contexts/CatContext.jsx';
import { CameraProvider } from './contexts/CameraContext.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx';

export default function Providers({ children }) {
  return (
    <AuthProvider>
      <LocationProvider>
        <CatProvider>
          <CameraProvider>{children}</CameraProvider>
        </CatProvider>
      </LocationProvider>
    </AuthProvider>
  );
}
