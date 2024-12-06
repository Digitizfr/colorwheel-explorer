import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { calculateWheelDimensions, getColorFromPoint, polarToCartesian } from '@/utils/colorWheelUtils';
import { renderColorWheel } from '@/utils/colorWheelRenderer';

interface ColorWheelProps {
  onColorSelect?: (color: string) => void;
  harmonyColors?: string[];
  harmonyType: 'complementary' | 'analogous' | 'monochromatic' | 'triadic' | 'tetradic';
  className?: string;
}

export const ColorWheel: React.FC<ColorWheelProps> = ({ 
  onColorSelect, 
  harmonyColors = [], 
  harmonyType,
  className 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedColor, setSelectedColor] = useState<string>('#FFFFFF');
  const [selectedPoint, setSelectedPoint] = useState<{ x: number, y: number } | null>(null);
  const [harmonyPoints, setHarmonyPoints] = useState<Array<{ x: number, y: number }>>([]);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const { centerX, centerY, radius, dpr } = calculateWheelDimensions(canvas);
    
    renderColorWheel(ctx, centerX, centerY, radius, selectedPoint, harmonyPoints, dpr);
  }, [selectedPoint, harmonyPoints]);

  const handleInteraction = (event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let clientX: number, clientY: number;

    if ('touches' in event) {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else {
      clientX = event.clientX;
      clientY = event.clientY;
    }

    const { centerX, centerY, radius, dpr } = calculateWheelDimensions(canvas);
    
    // Convertir les coordonnées du clic en coordonnées canvas
    const x = (clientX - rect.left) * dpr;
    const y = (clientY - rect.top) * dpr;

    // Vérifier si le clic est dans le cercle
    const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));

    if (distance <= radius) {
      // Convertir les coordonnées canvas en coordonnées d'affichage
      const displayX = (clientX - rect.left);
      const displayY = (clientY - rect.top);
      
      setSelectedPoint({ x: displayX, y: displayY });
      
      const color = getColorFromPoint(ctx, x, y);
      setSelectedColor(color);
      onColorSelect?.(color);
    }
  };

  useEffect(() => {
    if (!selectedPoint || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const { centerX, centerY, radius, dpr } = calculateWheelDimensions(canvas);

    const dx = (selectedPoint.x * dpr) - centerX;
    const dy = (selectedPoint.y * dpr) - centerY;
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;

    let harmonies: number[] = [];
    switch (harmonyType) {
      case 'complementary':
        harmonies = [angle + 180];
        break;
      case 'analogous':
        harmonies = [angle + 30, angle - 30];
        break;
      case 'monochromatic':
        harmonies = [angle, angle, angle];
        break;
      case 'triadic':
        harmonies = [angle + 120, angle - 120];
        break;
      case 'tetradic':
        harmonies = [angle + 90, angle + 180, angle + 270];
        break;
    }

    const newHarmonyPoints = harmonies.map((harmonyAngle, index) => {
      if (harmonyType === 'monochromatic') {
        const radiusMultiplier = 0.6 + (index * 0.2);
        return polarToCartesian(harmonyAngle, (radius / dpr) * radiusMultiplier, centerX / dpr, centerY / dpr);
      }
      return polarToCartesian(harmonyAngle, (radius / dpr) * 0.8, centerX / dpr, centerY / dpr);
    });

    setHarmonyPoints(newHarmonyPoints);
  }, [selectedPoint, harmonyType]);

  return (
    <div className={cn("relative inline-block w-[300px]", className)}>
      <canvas
        ref={canvasRef}
        className="cursor-crosshair rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300"
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onMouseMove={(e) => isDragging && handleInteraction(e)}
        onTouchStart={() => setIsDragging(true)}
        onTouchEnd={() => setIsDragging(false)}
        onTouchMove={(e) => isDragging && handleInteraction(e)}
        onClick={handleInteraction}
      />
      <div
        className="absolute -bottom-16 left-1/2 -translate-x-1/2 text-sm font-medium"
        style={{ color: selectedColor }}
      >
        {selectedColor.toUpperCase()}
      </div>
    </div>
  );
};