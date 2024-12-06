import React, { useState } from 'react';
import { ColorWheel } from '@/components/ColorWheel';
import { ColorDisplay } from '@/components/ColorDisplay';

const Index = () => {
  const [selectedColor, setSelectedColor] = useState('#FFFFFF');

  const calculateComplementaryColor = (hex: string) => {
    const rgb = parseInt(hex.slice(1), 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = rgb & 0xff;
    
    const complementary = {
      r: 255 - r,
      g: 255 - g,
      b: 255 - b
    };
    
    return `#${(complementary.r << 16 | complementary.g << 8 | complementary.b).toString(16).padStart(6, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Interactive Color Wheel</h1>
          <p className="text-lg text-gray-600">
            Click or drag on the wheel to explore colors and their complementary pairs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="flex justify-center">
            <ColorWheel
              onColorSelect={setSelectedColor}
              className="transform hover:scale-105 transition-transform duration-300"
            />
          </div>

          <ColorDisplay
            color={selectedColor}
            complementaryColor={calculateComplementaryColor(selectedColor)}
            className="bg-white p-6 rounded-xl shadow-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default Index;