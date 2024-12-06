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

  const getColorAtPoint = (x: number, y: number, ctx: CanvasRenderingContext2D) => {
    const imageData = ctx.getImageData(x, y, 1, 1).data;
    return `#${imageData[0].toString(16).padStart(2, '0')}${imageData[1].toString(16).padStart(2, '0')}${imageData[2].toString(16).padStart(2, '0')}`;
  };

  const calculateHarmonyPoints = (angle: number, distance: number, centerX: number, centerY: number, radius: number) => {
    let points: Array<{ x: number, y: number }> = [];
    const normalizedDistance = Math.min(distance, radius) / radius;

    switch (harmonyType) {
      case 'complementary':
        points = [{
          x: centerX + radius * normalizedDistance * Math.cos((angle + Math.PI) % (2 * Math.PI)),
          y: centerY + radius * normalizedDistance * Math.sin((angle + Math.PI) % (2 * Math.PI))
        }];
        break;
      case 'analogous':
        points = [
          {
            x: centerX + radius * normalizedDistance * Math.cos((angle + Math.PI / 6) % (2 * Math.PI)),
            y: centerY + radius * normalizedDistance * Math.sin((angle + Math.PI / 6) % (2 * Math.PI))
          },
          {
            x: centerX + radius * normalizedDistance * Math.cos((angle - Math.PI / 6) % (2 * Math.PI)),
            y: centerY + radius * normalizedDistance * Math.sin((angle - Math.PI / 6) % (2 * Math.PI))
          }
        ];
        break;
      case 'triadic':
        points = [
          {
            x: centerX + radius * normalizedDistance * Math.cos((angle + (2 * Math.PI / 3)) % (2 * Math.PI)),
            y: centerY + radius * normalizedDistance * Math.sin((angle + (2 * Math.PI / 3)) % (2 * Math.PI))
          },
          {
            x: centerX + radius * normalizedDistance * Math.cos((angle + (4 * Math.PI / 3)) % (2 * Math.PI)),
            y: centerY + radius * normalizedDistance * Math.sin((angle + (4 * Math.PI / 3)) % (2 * Math.PI))
          }
        ];
        break;
      case 'tetradic':
        points = [
          {
            x: centerX + radius * normalizedDistance * Math.cos((angle + Math.PI / 2) % (2 * Math.PI)),
            y: centerY + radius * normalizedDistance * Math.sin((angle + Math.PI / 2) % (2 * Math.PI))
          },
          {
            x: centerX + radius * normalizedDistance * Math.cos((angle + Math.PI) % (2 * Math.PI)),
            y: centerY + radius * normalizedDistance * Math.sin((angle + Math.PI) % (2 * Math.PI))
          },
          {
            x: centerX + radius * normalizedDistance * Math.cos((angle + (3 * Math.PI / 2)) % (2 * Math.PI)),
            y: centerY + radius * normalizedDistance * Math.sin((angle + (3 * Math.PI / 2)) % (2 * Math.PI))
          }
        ];
        break;
      case 'monochromatic':
        const baseDistance = normalizedDistance * radius;
        points = [
          {
            x: centerX + (baseDistance * 0.6) * Math.cos(angle),
            y: centerY + (baseDistance * 0.6) * Math.sin(angle)
          },
          {
            x: centerX + (baseDistance * 0.8) * Math.cos(angle),
            y: centerY + (baseDistance * 0.8) * Math.sin(angle)
          }
        ];
        break;
    }
    return points;
  };

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
    const angle = Math.atan2(dy, dx);

    if (distance > radius) {
      const newX = centerX + radius * Math.cos(angle);
      const newY = centerY + radius * Math.sin(angle);
      setSelectedPoint({ x: newX, y: newY });
      
      const color = getColorAtPoint(newX, newY, ctx);
      setSelectedColor(color);
      onColorSelect?.(color);

      const harmonyPoints = calculateHarmonyPoints(angle, radius, centerX, centerY, radius);
      setHarmonyPoints(harmonyPoints);
    } else {
      setSelectedPoint({ x, y });
      
      const color = getColorAtPoint(x, y, ctx);
      setSelectedColor(color);
      onColorSelect?.(color);

      const harmonyPoints = calculateHarmonyPoints(angle, distance, centerX, centerY, radius);
      setHarmonyPoints(harmonyPoints);
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