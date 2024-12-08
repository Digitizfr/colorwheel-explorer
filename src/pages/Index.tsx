import React, { useState } from 'react';
import { ColorWheel } from '@/components/ColorWheel';
import { ColorDisplay } from '@/components/ColorDisplay';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Footer } from '@/components/Footer';
import { Logo } from '@/components/Logo';

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
            <Logo />
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

        <section className="prose prose-gray max-w-none mt-12 bg-white/50 backdrop-blur-sm rounded-lg p-8 space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900">Le cercle chromatique : guide complet</h2>
          
          <div>
            <h3 className="text-xl font-medium text-gray-800">Histoire et origine</h3>
            <p>Le cercle chromatique tel que nous le connaissons aujourd'hui est le fruit d'une longue évolution. Sir Isaac Newton a posé les premières bases en 1666 en décomposant la lumière à travers un prisme, créant ainsi le premier diagramme circulaire des couleurs. Plus tard, au XVIIIe siècle, Moses Harris a développé l'un des premiers cercles chromatiques des pigments. Johann Wolfgang von Goethe a ensuite approfondi ces travaux avec sa "Théorie des couleurs" en 1810, ajoutant une dimension psychologique à la compréhension des couleurs. Le peintre Johannes Itten a révolutionné son utilisation au XXe siècle en l'intégrant dans l'enseignement du Bauhaus.</p>
          </div>

          <div>
            <h3 className="text-xl font-medium text-gray-800">Utilité du cercle chromatique</h3>
            <p>Le cercle chromatique est bien plus qu'un simple outil de représentation des couleurs. Il sert à :</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>comprendre les relations entre les couleurs et leur interaction</li>
              <li>identifier rapidement les combinaisons harmonieuses</li>
              <li>prévoir l'effet visuel d'une association de couleurs</li>
              <li>faciliter la communication entre professionnels du design et clients</li>
              <li>enseigner les principes fondamentaux de la théorie des couleurs</li>
              <li>résoudre les problèmes de composition colorée dans tout projet créatif</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-medium text-gray-800">Les types d'harmonies chromatiques</h3>
            <ul className="space-y-2">
              <li><strong>Complémentaire</strong> : utilise deux couleurs opposées sur le cercle chromatique, créant un contraste maximal et une harmonie dynamique.</li>
              <li><strong>Analogue</strong> : combine des couleurs adjacentes sur le cercle, produisant une harmonie naturelle et apaisante.</li>
              <li><strong>Monochrome</strong> : utilise différentes nuances et tons d'une même couleur pour créer une palette subtile et élégante.</li>
              <li><strong>Triadique</strong> : sélectionne trois couleurs équidistantes sur le cercle, offrant un équilibre entre harmonie et contraste.</li>
              <li><strong>Tétradique</strong> : utilise quatre couleurs disposées en rectangle sur le cercle, permettant une palette riche et variée.</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-medium text-gray-800">Comment utiliser le cercle chromatique</h3>
            <p>Pour tirer le meilleur parti du cercle chromatique, suivez ces étapes :</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Familiarisez-vous avec sa structure : le cercle est traditionnellement composé de 12 couleurs, comprenant les couleurs primaires (rouge, jaune, bleu), secondaires (vert, orange, violet) et tertiaires.</li>
              <li>Choisissez votre approche harmonique : selon votre projet, sélectionnez l'une des harmonies chromatiques (complémentaire, analogue, etc.) comme point de départ.</li>
              <li>Expérimentez avec les variations : une fois les couleurs de base choisies, explorez les nuances, les tons et les teintes pour affiner votre palette.</li>
              <li>Testez dans le contexte : appliquez votre sélection de couleurs dans votre projet et ajustez selon les besoins spécifiques de votre support (écran, impression, peinture, etc.).</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-medium text-gray-800">Applications pratiques</h3>
            <p>Notre outil de cercle chromatique en ligne vous permet d'explorer ces différentes harmonies de manière interactive. Idéal pour :</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>le design web et l'interface utilisateur</li>
              <li>la décoration d'intérieur</li>
              <li>les projets artistiques et créatifs</li>
              <li>le design graphique et l'identité visuelle</li>
              <li>la photographie et le traitement d'image</li>
            </ul>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
};

export default Index;