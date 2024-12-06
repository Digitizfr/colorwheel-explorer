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

        <section className="prose prose-gray max-w-none mt-12 bg-white/50 backdrop-blur-sm rounded-lg p-8 space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">Le Cercle Chromatique : Guide Complet</h2>
          
          <p>Le cercle chromatique est un outil fondamental pour comprendre les relations entre les couleurs. Il permet de visualiser comment les couleurs s'harmonisent entre elles et aide à créer des palettes de couleurs cohérentes pour vos projets de design, d'art ou de décoration.</p>
          
          <h3 className="text-xl font-medium text-gray-800">Les Types d'Harmonies Chromatiques</h3>
          
          <ul className="space-y-2">
            <li><strong>Complémentaire</strong> : Utilise deux couleurs opposées sur le cercle chromatique, créant un contraste maximal et une harmonie dynamique.</li>
            <li><strong>Analogue</strong> : Combine des couleurs adjacentes sur le cercle, produisant une harmonie naturelle et apaisante.</li>
            <li><strong>Monochrome</strong> : Utilise différentes nuances et tons d'une même couleur pour créer une palette subtile et élégante.</li>
            <li><strong>Triadique</strong> : Sélectionne trois couleurs équidistantes sur le cercle, offrant un équilibre entre harmonie et contraste.</li>
            <li><strong>Tétradique</strong> : Utilise quatre couleurs disposées en rectangle sur le cercle, permettant une palette riche et variée.</li>
          </ul>

          <h3 className="text-xl font-medium text-gray-800">Applications Pratiques</h3>
          
          <p>Notre outil de cercle chromatique en ligne vous permet d'explorer ces différentes harmonies de manière interactive. Idéal pour :</p>
          
          <ul className="space-y-2">
            <li>Le design web et l'interface utilisateur</li>
            <li>La décoration d'intérieur</li>
            <li>Les projets artistiques et créatifs</li>
            <li>Le design graphique et l'identité visuelle</li>
            <li>La photographie et le traitement d'image</li>
          </ul>

          <p>Expérimentez avec notre outil pour découvrir les combinaisons qui correspondent le mieux à vos besoins créatifs. La théorie des couleurs n'aura plus de secrets pour vous !</p>
        </section>
      </div>
    </div>
  );
};

export default Index;
