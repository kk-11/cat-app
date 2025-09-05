'use client';

import React from 'react';
import { LocationProvider } from './contexts/LocationContext.jsx';
import { CatProvider } from './contexts/CatContext.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx';

export default function Providers({ children }) {
  return (
    <AuthProvider>
      <LocationProvider>
        <CatProvider>{children}</CatProvider>
      </LocationProvider>
    </AuthProvider>
  );
}
