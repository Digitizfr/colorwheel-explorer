import React from 'react';
import { cn } from '@/lib/utils';

interface ColorDisplayProps {
  color: string;
  complementaryColor: string;
  className?: string;
}

export const ColorDisplay: React.FC<ColorDisplayProps> = ({
  color,
  complementaryColor,
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

  return (
    <div className={cn("space-y-4 animate-fade-in", className)}>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Selected Color</h3>
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

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Complementary Color</h3>
        <div className="flex items-center space-x-4">
          <div
            className="w-16 h-16 rounded-lg shadow-md"
            style={{ backgroundColor: complementaryColor }}
          />
          <div className="space-y-1">
            <p className="text-sm font-medium">HEX: {complementaryColor}</p>
            <p className="text-sm text-gray-600">RGB: {rgbToString(hexToRgb(complementaryColor))}</p>
          </div>
        </div>
      </div>
    </div>
  );
};