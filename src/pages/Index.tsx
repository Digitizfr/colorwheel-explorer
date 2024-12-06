import React, { useState } from 'react';
import { ColorWheel } from '@/components/ColorWheel';
import { ColorDisplay } from '@/components/ColorDisplay';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Palette } from "lucide-react";

type HarmonyType = 'complementary' | 'analogous' | 'monochromatic' | 'triadic' | 'tetradic';

const Index = () => {
  const [selectedColor, setSelectedColor] = useState('#FFFFFF');
  const [harmonyType, setHarmonyType] = useState<HarmonyType>('complementary');

  const calculateHarmonyColors = (color: string, type: HarmonyType): string[] => {
    // Convertir la couleur hex en HSL
    const hexToHsl = (hex: string): [number, number, number] => {
      let r = parseInt(hex.slice(1, 3), 16) / 255;
      let g = parseInt(hex.slice(3, 5), 16) / 255;
      let b = parseInt(hex.slice(5, 7), 16) / 255;

      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h = 0, s, l = (max + min) / 2;

      if (max === min) {
        h = s = 0;
      } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
      }

      return [h * 360, s * 100, l * 100];
    };

    // Convertir HSL en hex
    const hslToHex = (h: number, s: number, l: number): string => {
      s /= 100;
      l /= 100;
      const a = s * Math.min(l, 1 - l);
      const f = (n: number) => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
      };
      return `#${f(0)}${f(8)}${f(4)}`;
    };

    const [h, s, l] = hexToHsl(color);

    switch (type) {
      case 'complementary':
        return [color, hslToHex((h + 180) % 360, s, l)];
      case 'analogous':
        return [
          color,
          hslToHex((h + 30) % 360, s, l),
          hslToHex((h - 30 + 360) % 360, s, l)
        ];
      case 'monochromatic':
        return [
          color,
          hslToHex(h, s, l * 0.8),
          hslToHex(h, s * 0.8, l)
        ];
      case 'triadic':
        return [
          color,
          hslToHex((h + 120) % 360, s, l),
          hslToHex((h + 240) % 360, s, l)
        ];
      case 'tetradic':
        return [
          color,
          hslToHex((h + 90) % 360, s, l),
          hslToHex((h + 180) % 360, s, l),
          hslToHex((h + 270) % 360, s, l)
        ];
      default:
        return [color];
    }
  };

  const harmonyColors = calculateHarmonyColors(selectedColor, harmonyType);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <header className="text-center space-y-2">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Palette className="w-8 h-8 text-blue-600 animate-color-shift" />
            <h1 className="text-3xl font-bold text-gray-900">Cercle chromatique en ligne</h1>
          </div>
          <p className="text-gray-600">Créez votre palette de couleurs harmonieuse</p>
        </header>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Colonne de gauche : Sélection de couleur et type d'harmonie */}
          <div className="space-y-6">
            <Card className="p-6 backdrop-blur-sm bg-white/50">
              <h2 className="text-lg font-semibold mb-4">1. Choisissez votre couleur</h2>
              <div className="flex justify-center">
                <ColorWheel
                  onColorSelect={setSelectedColor}
                  harmonyColors={harmonyColors}
                  harmonyType={harmonyType}
                />
              </div>
            </Card>

            <Card className="p-6 backdrop-blur-sm bg-white/50">
              <h2 className="text-lg font-semibold mb-4">2. Type d'harmonie</h2>
              <RadioGroup
                defaultValue="complementary"
                onValueChange={(value) => setHarmonyType(value as HarmonyType)}
                className="grid grid-cols-2 gap-3"
              >
                <div className="flex items-center space-x-2 bg-white/80 p-3 rounded-lg">
                  <RadioGroupItem value="complementary" id="complementary" />
                  <Label htmlFor="complementary">Complémentaire</Label>
                </div>
                <div className="flex items-center space-x-2 bg-white/80 p-3 rounded-lg">
                  <RadioGroupItem value="analogous" id="analogous" />
                  <Label htmlFor="analogous">Analogue</Label>
                </div>
                <div className="flex items-center space-x-2 bg-white/80 p-3 rounded-lg">
                  <RadioGroupItem value="monochromatic" id="monochromatic" />
                  <Label htmlFor="monochromatic">Monochrome</Label>
                </div>
                <div className="flex items-center space-x-2 bg-white/80 p-3 rounded-lg">
                  <RadioGroupItem value="triadic" id="triadic" />
                  <Label htmlFor="triadic">Triadique</Label>
                </div>
                <div className="flex items-center space-x-2 bg-white/80 p-3 rounded-lg">
                  <RadioGroupItem value="tetradic" id="tetradic" />
                  <Label htmlFor="tetradic">Tétradique</Label>
                </div>
              </RadioGroup>
            </Card>
          </div>

          {/* Colonne de droite : Affichage des couleurs */}
          <div>
            <Card className="p-6 backdrop-blur-sm bg-white/50 h-full">
              <h2 className="text-lg font-semibold mb-4">Votre palette de couleurs</h2>
              <ColorDisplay
                color={selectedColor}
                harmonyColors={harmonyColors}
                harmonyType={harmonyType}
              />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;