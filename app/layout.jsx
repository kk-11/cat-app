import React from 'react';
export const metadata = {
  title: 'Cat App',
  description: 'Find nearby cats',
};

import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
