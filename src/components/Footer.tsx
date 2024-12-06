import React from 'react';
import { Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="mt-8 py-6 text-center text-sm text-gray-600 flex items-center justify-center gap-2">
      <span>Créé avec</span>
      <Heart className="w-4 h-4 text-red-500 animate-pulse" />
      <span>par</span>
      <a
        href="https://digitiz.fr/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:text-blue-800 transition-colors font-medium"
      >
        Digitiz
      </a>
    </footer>
  );
};