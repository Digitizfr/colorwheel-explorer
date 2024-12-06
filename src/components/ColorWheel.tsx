import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

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

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Nettoyer complètement le canvas avant chaque rendu
    ctx.clearRect(0, 0, canvas.width, canvas.height);

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

    // Créer un masque circulaire pour éviter les débordements
    ctx.globalCompositeOperation = 'destination-in';
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';

    // Dessiner l'indicateur de sélection principal
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

    // Dessiner les indicateurs des couleurs d'harmonie
    harmonyPoints.forEach((point) => {
      ctx.beginPath();
      ctx.arc(point.x, point.y, 6, 0, 2 * Math.PI);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(point.x, point.y, 4, 0, 2 * Math.PI);
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.lineWidth = 1;
      ctx.stroke();
    });
  }, [selectedPoint, harmonyPoints]);

  const polarToCartesian = (angle: number, radius: number, centerX: number, centerY: number) => {
    return {
      x: centerX + radius * Math.cos(angle * Math.PI / 180),
      y: centerY + radius * Math.sin(angle * Math.PI / 180)
    };
  };

  useEffect(() => {
    if (!selectedPoint || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 20;

    const dx = selectedPoint.x - centerX;
    const dy = selectedPoint.y - centerY;
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;

    // Calculer les angles selon le type d'harmonie
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
        return polarToCartesian(harmonyAngle, radius * radiusMultiplier, centerX, centerY);
      }
      return polarToCartesian(harmonyAngle, radius * 0.8, centerX, centerY);
    });

    setHarmonyPoints(newHarmonyPoints);
  }, [selectedPoint, harmonyType]);

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

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 20;
    
    const dx = x - centerX;
    const dy = y - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > radius) {
      const angle = Math.atan2(dy, dx);
      const newX = centerX + radius * Math.cos(angle);
      const newY = centerY + radius * Math.sin(angle);
      setSelectedPoint({ x: newX, y: newY });
      
      const imageData = ctx.getImageData(newX, newY, 1, 1).data;
      const color = `#${imageData[0].toString(16).padStart(2, '0')}${imageData[1].toString(16).padStart(2, '0')}${imageData[2].toString(16).padStart(2, '0')}`;
      setSelectedColor(color);
      onColorSelect?.(color);
    } else {
      setSelectedPoint({ x, y });
      
      const imageData = ctx.getImageData(x, y, 1, 1).data;
      const color = `#${imageData[0].toString(16).padStart(2, '0')}${imageData[1].toString(16).padStart(2, '0')}${imageData[2].toString(16).padStart(2, '0')}`;
      setSelectedColor(color);
      onColorSelect?.(color);
    }
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