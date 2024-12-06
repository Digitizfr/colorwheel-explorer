import React, { useState } from 'react';
import { ColorWheel } from '@/components/ColorWheel';
import { ColorDisplay } from '@/components/ColorDisplay';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
            Harmonie des Couleurs
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explorez les harmonies de couleurs et trouvez la combinaison parfaite pour votre projet
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <Card className="p-8 bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl space-y-8">
            <div className="flex justify-center">
              <ColorWheel
                onColorSelect={setSelectedColor}
                harmonyColors={harmonyColors}
                harmonyType={harmonyType}
                className="transform hover:scale-105 transition-transform duration-300"
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Type d'Harmonie</h3>
              <RadioGroup
                defaultValue="complementary"
                onValueChange={(value) => setHarmonyType(value as HarmonyType)}
                className="grid grid-cols-2 gap-4"
              >
                <div className="flex items-center space-x-2 bg-white/50 p-3 rounded-lg hover:bg-white/80 transition-colors">
                  <RadioGroupItem value="complementary" id="complementary" />
                  <Label htmlFor="complementary" className="cursor-pointer">Complémentaire</Label>
                </div>
                <div className="flex items-center space-x-2 bg-white/50 p-3 rounded-lg hover:bg-white/80 transition-colors">
                  <RadioGroupItem value="analogous" id="analogous" />
                  <Label htmlFor="analogous" className="cursor-pointer">Analogue</Label>
                </div>
                <div className="flex items-center space-x-2 bg-white/50 p-3 rounded-lg hover:bg-white/80 transition-colors">
                  <RadioGroupItem value="monochromatic" id="monochromatic" />
                  <Label htmlFor="monochromatic" className="cursor-pointer">Monochrome</Label>
                </div>
                <div className="flex items-center space-x-2 bg-white/50 p-3 rounded-lg hover:bg-white/80 transition-colors">
                  <RadioGroupItem value="triadic" id="triadic" />
                  <Label htmlFor="triadic" className="cursor-pointer">Triadique</Label>
                </div>
                <div className="flex items-center space-x-2 bg-white/50 p-3 rounded-lg hover:bg-white/80 transition-colors">
                  <RadioGroupItem value="tetradic" id="tetradic" />
                  <Label htmlFor="tetradic" className="cursor-pointer">Tétradique</Label>
                </div>
              </RadioGroup>
            </div>
          </Card>

          <Card className="p-8 bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl">
            <ColorDisplay
              color={selectedColor}
              harmonyColors={harmonyColors}
              harmonyType={harmonyType}
            />
          </Card>
        </div>

        <footer className="mt-16 text-center text-gray-600">
          <p className="text-sm">
            Créez des palettes de couleurs harmonieuses pour vos projets de design
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;