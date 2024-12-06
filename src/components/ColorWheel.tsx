import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface ColorWheelProps {
  onColorSelect?: (color: string) => void;
  className?: string;
}

export const ColorWheel: React.FC<ColorWheelProps> = ({ onColorSelect, className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedColor, setSelectedColor] = useState<string>('#FFFFFF');
  const [selectedPoint, setSelectedPoint] = useState<{ x: number, y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 20;

    // Dessiner la roue chromatique
    for (let angle = 0; angle < 360; angle++) {
      const startAngle = (angle - 2) * Math.PI / 180;
      const endAngle = (angle + 2) * Math.PI / 180;

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();

      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
      gradient.addColorStop(0, 'white');
      gradient.addColorStop(1, `hsl(${angle}, 100%, 50%)`);

      ctx.fillStyle = gradient;
      ctx.fill();
    }

    // Dessiner l'indicateur de sélection si un point est sélectionné
    if (selectedPoint) {
      ctx.beginPath();
      ctx.arc(selectedPoint.x, selectedPoint.y, 8, 0, 2 * Math.PI);
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(selectedPoint.x, selectedPoint.y, 6, 0, 2 * Math.PI);
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }, [selectedPoint]);

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

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    // Mettre à jour le point sélectionné
    setSelectedPoint({ x, y });

    const imageData = ctx.getImageData(x, y, 1, 1).data;
    const color = `#${imageData[0].toString(16).padStart(2, '0')}${imageData[1].toString(16).padStart(2, '0')}${imageData[2].toString(16).padStart(2, '0')}`;

    setSelectedColor(color);
    onColorSelect?.(color);
  };

  return (
    <div className={cn("relative inline-block", className)}>
      <canvas
        ref={canvasRef}
        width={300}
        height={300}
        className="cursor-crosshair rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300"
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
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