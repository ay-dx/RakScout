import React from 'react';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="text-center py-4 text-xs font-bold text-stone-400">
      &copy; {year} RakScout. All rights reserved.
    </footer>
  );
}