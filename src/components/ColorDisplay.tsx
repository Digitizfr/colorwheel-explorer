import React from 'react';
import { cn } from '@/lib/utils';

interface ColorDisplayProps {
  color: string;
  harmonyColors: string[];
  harmonyType: 'complementary' | 'analogous' | 'monochromatic' | 'triadic' | 'tetradic';
  className?: string;
}

export const ColorDisplay: React.FC<ColorDisplayProps> = ({
  color,
  harmonyColors = [], // Provide default empty array
  harmonyType,
  className,
}) => {
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const rgbToString = (rgb: { r: number, g: number, b: number } | null) => {
    return rgb ? `RGB(${rgb.r}, ${rgb.g}, ${rgb.b})` : '';
  };

  const getHarmonyTitle = () => {
    switch (harmonyType) {
      case 'complementary': return 'Couleur Complémentaire';
      case 'analogous': return 'Couleurs Analogues';
      case 'monochromatic': return 'Couleurs Monochromatiques';
      case 'triadic': return 'Couleurs Triadiques';
      case 'tetradic': return 'Couleurs Tétradiques';
      default: return 'Harmonies de Couleurs';
    }
  };

  // Ensure harmonyColors exists and has elements before trying to slice
  const displayHarmonyColors = Array.isArray(harmonyColors) ? harmonyColors.slice(1) : [];

  return (
    <div className={cn("space-y-6 animate-fade-in", className)}>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Couleur Sélectionnée</h3>
        <div className="flex items-center space-x-4">
          <div
            className="w-16 h-16 rounded-lg shadow-md"
            style={{ backgroundColor: color }}
          />
          <div className="space-y-1">
            <p className="text-sm font-medium">HEX: {color}</p>
            <p className="text-sm text-gray-600">RGB: {rgbToString(hexToRgb(color))}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">{getHarmonyTitle()}</h3>
        <div className="grid grid-cols-2 gap-4">
          {displayHarmonyColors.map((harmonyColor, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div
                className="w-16 h-16 rounded-lg shadow-md"
                style={{ backgroundColor: harmonyColor }}
              />
              <div className="space-y-1">
                <p className="text-sm font-medium">HEX: {harmonyColor}</p>
                <p className="text-sm text-gray-600">RGB: {rgbToString(hexToRgb(harmonyColor))}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};