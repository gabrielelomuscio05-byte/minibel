import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Check, Sparkles, Info } from 'lucide-react';
import SocialCards from './ui/card-fan-carousel';

const makeSvgColorCard = (hex: string, name: string) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 700" width="400" height="700">
    <rect width="400" height="700" fill="${hex}"/>
    <rect x="20" y="520" width="360" height="160" rx="16" fill="#161616" fill-opacity="0.95"/>
    <text x="40" y="570" font-family="system-ui, -apple-system, sans-serif" font-size="24" font-weight="bold" fill="white">${name}</text>
    <text x="40" y="605" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="semibold" fill="#9ca3af" letter-spacing="1">IDROPITTURA PREMIUM</text>
    <text x="40" y="640" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="light" fill="#6b7280">COLORIFICIO ROSSI</text>
    <circle cx="335" cy="600" r="18" fill="${hex}" stroke="white" stroke-opacity="0.1" stroke-width="2"/>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

export interface PaintColor {
  id: string;
  name: string;
  hex: string;
  description: string;
  properties: {
    coverage: string;
    dilution: string;
    drying: string;
    voc: string;
  };
}

interface ColorDetailViewProps {
  onBack: () => void;
  colors: PaintColor[];
  selectedColor: PaintColor;
  onSelectColor: (color: PaintColor) => void;
}

export default function ColorDetailView({ onBack, colors, selectedColor, onSelectColor }: ColorDetailViewProps) {
  const [finish, setFinish] = useState<'opaca' | 'satinata' | 'lucida'>('opaca');
  const [useCase, setUseCase] = useState<'interno' | 'esterno'>('interno');
  const [size, setSize] = useState<'1L' | '5L' | '14L'>('5L');

  const carouselCards = colors.map((color) => ({
    imgUrl: makeSvgColorCard(color.hex, color.name),
    alt: color.name,
    onClick: () => {
      onSelectColor(color);
      // Soft scroll to simulator on mobile
      const container = canvasRef.current;
      if (container && window.innerWidth < 1024) {
        container.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }));

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);

  // Animation state inside Canvas
  const paintProgressRef = useRef<number>(0);
  const rollerYRef = useRef<number>(50);
  const rollerDirectionRef = useRef<number>(1); // 1 = down, -1 = up

  useEffect(() => {
    // Reset paint progress when color or useCase changes
    paintProgressRef.current = 0;
  }, [selectedColor, useCase]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas sizes
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resizeCanvas();

    const hexToRgb = (hex: string) => {
      const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
      const fullHex = hex.replace(shorthandRegex, (_, r, g, b) => r + r + g + g + b + b);
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
      return result 
        ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
        : '255, 255, 255';
    };

    const draw = () => {
      const w = canvas.width / window.devicePixelRatio;
      const h = canvas.height / window.devicePixelRatio;

      ctx.clearRect(0, 0, w, h);

      if (useCase === 'interno') {
        // Background - Studio Space
        ctx.fillStyle = '#12161A'; // Nero Lavagna
        ctx.fillRect(0, 0, w, h);

        // Draw standard wall border/outlines (isometric/perspective helper)
        ctx.strokeStyle = '#1E252B'; // Graphite
        ctx.lineWidth = 1.5;

        // Draw a 3D isometric room outline
        ctx.beginPath();
        // Floor corners
        ctx.moveTo(0, h * 0.85);
        ctx.lineTo(w * 0.5, h * 0.7);
        ctx.lineTo(w, h * 0.85);
        ctx.stroke();

        // Corner line
        ctx.beginPath();
        ctx.moveTo(w * 0.5, 0);
        ctx.lineTo(w * 0.5, h * 0.7);
        ctx.stroke();

        // Left Wall Base Color (light gray base)
        ctx.fillStyle = '#181E23';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(w * 0.5, 0);
        ctx.lineTo(w * 0.5, h * 0.7);
        ctx.lineTo(0, h * 0.85);
        ctx.closePath();
        ctx.fill();

        // Right Wall Base Color (medium gray base)
        ctx.fillStyle = '#13181C';
        ctx.beginPath();
        ctx.moveTo(w * 0.5, 0);
        ctx.lineTo(w, 0);
        ctx.lineTo(w, h * 0.85);
        ctx.lineTo(w * 0.5, h * 0.7);
        ctx.closePath();
        ctx.fill();

        // Floor (dark slate)
        ctx.fillStyle = '#0a0d10';
        ctx.beginPath();
        ctx.moveTo(0, h * 0.85);
        ctx.lineTo(w * 0.5, h * 0.7);
        ctx.lineTo(w, h * 0.85);
        ctx.lineTo(w, h);
        ctx.lineTo(0, h);
        ctx.closePath();
        ctx.fill();

        // Let's paint the LEFT wall dynamically with the selected color!
        // Animate progress up to 100%
        if (paintProgressRef.current < 1) {
          paintProgressRef.current += 0.005;
        } else {
          paintProgressRef.current = 1;
        }

        const progress = paintProgressRef.current;

        // Clip the selected color painting to the left wall
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(w * 0.5, 0);
        ctx.lineTo(w * 0.5, h * 0.7);
        ctx.lineTo(0, h * 0.85);
        ctx.closePath();
        ctx.clip();

        // Draw the selected paint color, creeping in from left to right based on progress
        ctx.fillStyle = selectedColor.hex;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(w * 0.5 * progress, 0);
        ctx.lineTo(w * 0.5 * progress, h * 0.7 + (h * 0.15) * (1 - progress));
        ctx.lineTo(0, h * 0.85);
        ctx.closePath();
        ctx.fill();

        // Add overlay shadow to left wall for 3D realism
        const gradientLeft = ctx.createLinearGradient(0, 0, w * 0.5, 0);
        gradientLeft.addColorStop(0, 'rgba(0, 0, 0, 0.4)');
        gradientLeft.addColorStop(0.8, 'rgba(0, 0, 0, 0.05)');
        gradientLeft.addColorStop(1, 'rgba(0, 0, 0, 0.25)'); // corner shadow
        ctx.fillStyle = gradientLeft;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(w * 0.5, 0);
        ctx.lineTo(w * 0.5, h * 0.7);
        ctx.lineTo(0, h * 0.85);
        ctx.closePath();
        ctx.fill();

        ctx.restore();

        // Right Wall Painting (Optional contrast overlay)
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(w * 0.5, 0);
        ctx.lineTo(w, 0);
        ctx.lineTo(w, h * 0.85);
        ctx.lineTo(w * 0.5, h * 0.7);
        ctx.closePath();
        ctx.clip();

        // Draw a subtle soft-light reflection of the selected color on the right wall
        ctx.fillStyle = selectedColor.hex;
        ctx.globalAlpha = 0.15;
        ctx.fill();
        ctx.globalAlpha = 1.0;

        // Right wall shadow
        const gradientRight = ctx.createLinearGradient(w * 0.5, 0, w, 0);
        gradientRight.addColorStop(0, 'rgba(0, 0, 0, 0.35)'); // corner shadow
        gradientRight.addColorStop(0.2, 'rgba(0, 0, 0, 0.1)');
        gradientRight.addColorStop(1, 'rgba(0, 0, 0, 0.5)');
        ctx.fillStyle = gradientRight;
        ctx.fill();

        ctx.restore();

        // Animate the Roller brush on the left wall
        const rollerX = w * 0.5 * Math.min(progress, 0.95);
        
        // Let the roller Y bob up and down
        rollerYRef.current += rollerDirectionRef.current * 2.5;
        const minRollerY = h * 0.15;
        const maxRollerY = h * 0.65;
        if (rollerYRef.current > maxRollerY) {
          rollerYRef.current = maxRollerY;
          rollerDirectionRef.current = -1;
        } else if (rollerYRef.current < minRollerY) {
          rollerYRef.current = minRollerY;
          rollerDirectionRef.current = 1;
        }

        const rollerY = rollerYRef.current;

        // Draw painter roller
        if (progress < 1) {
          ctx.save();
          ctx.translate(rollerX, rollerY);

          // Draw roller rod
          ctx.strokeStyle = '#9ca3af';
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(-20, 10);
          ctx.lineTo(-20, 45);
          ctx.lineTo(-5, 60);
          ctx.stroke();

          // Handle
          ctx.strokeStyle = '#000000';
          ctx.lineWidth = 8;
          ctx.beginPath();
          ctx.moveTo(-20, 45);
          ctx.lineTo(-20, 80);
          ctx.stroke();

          // Roller head
          ctx.fillStyle = selectedColor.hex;
          ctx.strokeStyle = '#e5e7eb';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.roundRect(-4, -15, 8, 30, 3);
          ctx.fill();
          ctx.stroke();

          // Wet paint droplets flying off
          ctx.fillStyle = selectedColor.hex;
          ctx.globalAlpha = 0.6;
          for (let i = 0; i < 3; i++) {
            const dropX = -25 - Math.random() * 20;
            const dropY = -10 + Math.random() * 40;
            ctx.beginPath();
            ctx.arc(dropX, dropY, 2 + Math.random() * 2, 0, Math.PI * 2);
            ctx.fill();
          }

          ctx.restore();
        }

        // Overlay text
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.font = '12px Courier New';
        ctx.textAlign = 'center';
        ctx.fillText(
          `[Simulatore Pareti Interno - Colore: ${selectedColor.name}]`,
          w / 2,
          h - 30
        );

      } else {
        // Background - Dusk/Evening Sky
        const skyGrad = ctx.createLinearGradient(0, 0, 0, h * 0.8);
        skyGrad.addColorStop(0, '#0d1013');
        skyGrad.addColorStop(0.5, '#161b22');
        skyGrad.addColorStop(1, '#1b2330');
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, w, h);

        // Subtle glowing stars
        ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
        const starCoords = [[w * 0.15, h * 0.1], [w * 0.3, h * 0.08], [w * 0.75, h * 0.12], [w * 0.9, h * 0.06]];
        starCoords.forEach(([sx, sy]) => {
          ctx.beginPath();
          ctx.arc(sx, sy, 1.2, 0, Math.PI * 2);
          ctx.fill();
        });

        // Ground / lawn base
        ctx.fillStyle = '#15201a';
        ctx.fillRect(0, h * 0.8, w, h * 0.2);
        
        ctx.strokeStyle = '#1e2e26';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, h * 0.8);
        ctx.lineTo(w, h * 0.8);
        ctx.stroke();

        // Architectural linear helper functions for 3D coordinate mapping
        const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

         const getFrontWallPoint = (rx: number, ry: number) => {
          const bx = lerp(w * 0.25, w * 0.6, rx);
          const by = lerp(h * 0.8, h * 0.85, rx); 
          const ty = lerp(h * 0.45, h * 0.5, rx); 
          return { x: bx, y: lerp(by, ty, ry) };
        };

        const getSideWallPoint = (rx: number, ry: number) => {
          const bx = lerp(w * 0.6, w * 0.85, rx);
          const by = lerp(h * 0.85, h * 0.78, rx); 
          const ty = lerp(h * 0.5, h * 0.43, rx); 
          return { x: bx, y: lerp(by, ty, ry) };
        };

        // 1. Draw Side Wall (Textured Concrete)
        ctx.fillStyle = '#222831';
        ctx.beginPath();
        ctx.moveTo(w * 0.6, h * 0.5);
        ctx.lineTo(w * 0.85, h * 0.43);
        ctx.lineTo(w * 0.85, h * 0.78);
        ctx.lineTo(w * 0.6, h * 0.85);
        ctx.closePath();
        ctx.fill();

        // Panels lining
        ctx.strokeStyle = 'rgba(0,0,0,0.18)';
        ctx.lineWidth = 1;
        for (let i = 1; i <= 4; i++) {
          const frac = i / 5;
          const topP = getSideWallPoint(frac, 1);
          const botP = getSideWallPoint(frac, 0);
          ctx.beginPath();
          ctx.moveTo(topP.x, topP.y);
          ctx.lineTo(botP.x, botP.y);
          ctx.stroke();
        }

        // Shade overlay
        const sideShade = ctx.createLinearGradient(w * 0.6, h * 0.5, w * 0.85, h * 0.78);
        sideShade.addColorStop(0, 'rgba(0, 0, 0, 0.25)'); 
        sideShade.addColorStop(1, 'rgba(0, 0, 0, 0.5)'); 
        ctx.fillStyle = sideShade;
        ctx.beginPath();
        ctx.moveTo(w * 0.6, h * 0.5);
        ctx.lineTo(w * 0.85, h * 0.43);
        ctx.lineTo(w * 0.85, h * 0.78);
        ctx.lineTo(w * 0.6, h * 0.85);
        ctx.closePath();
        ctx.fill();

        // Large side window (glowing)
        const sideWinBL = getSideWallPoint(0.3, 0.1);
        const sideWinBR = getSideWallPoint(0.55, 0.1);
        const sideWinTL = getSideWallPoint(0.3, 0.85);
        const sideWinTR = getSideWallPoint(0.55, 0.85);

        const sideGlassGlow = ctx.createLinearGradient(sideWinTL.x, sideWinTL.y, sideWinBR.x, sideWinBR.y);
        sideGlassGlow.addColorStop(0, '#fef08a');
        sideGlassGlow.addColorStop(1, '#eab308');
        ctx.fillStyle = sideGlassGlow;
        ctx.beginPath();
        ctx.moveTo(sideWinTL.x, sideWinTL.y);
        ctx.lineTo(sideWinTR.x, sideWinTR.y);
        ctx.lineTo(sideWinBR.x, sideWinBR.y);
        ctx.lineTo(sideWinBL.x, sideWinBL.y);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#111827';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(sideWinTL.x, sideWinTL.y);
        ctx.lineTo(sideWinTR.x, sideWinTR.y);
        ctx.lineTo(sideWinBR.x, sideWinBR.y);
        ctx.lineTo(sideWinBL.x, sideWinBL.y);
        ctx.closePath();
        ctx.stroke();

        ctx.strokeStyle = '#111827';
        ctx.lineWidth = 1.5;
        for (let j = 1; j <= 3; j++) {
          const frac = j / 4;
          const leftP = getSideWallPoint(0.3, 0.1 + 0.75 * frac);
          const rightP = getSideWallPoint(0.55, 0.1 + 0.75 * frac);
          ctx.beginPath();
          ctx.moveTo(leftP.x, leftP.y);
          ctx.lineTo(rightP.x, rightP.y);
          ctx.stroke();
        }

        // 2. Draw Front Wall Base (Unpainted)
        ctx.fillStyle = '#1E252B'; // Graphite surface
        ctx.beginPath();
        ctx.moveTo(w * 0.25, h * 0.45);
        ctx.lineTo(w * 0.6, h * 0.5);
        ctx.lineTo(w * 0.6, h * 0.85);
        ctx.lineTo(w * 0.25, h * 0.8);
        ctx.closePath();
        ctx.fill();

        // 3. Paint Front Wall Dynamically
        if (paintProgressRef.current < 1) {
          paintProgressRef.current += 0.005;
        } else {
          paintProgressRef.current = 1;
        }
        const progress = paintProgressRef.current;

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(w * 0.25, h * 0.45);
        ctx.lineTo(w * 0.6, h * 0.5);
        ctx.lineTo(w * 0.6, h * 0.85);
        ctx.lineTo(w * 0.25, h * 0.8);
        ctx.closePath();
        ctx.clip();

        // Selected paint creep
        ctx.fillStyle = selectedColor.hex;
        ctx.beginPath();
        ctx.moveTo(w * 0.25, h * 0.45);
        const topX = w * 0.25 + (w * 0.35) * progress;
        const topY = h * 0.45 + (h * 0.05) * progress;
        ctx.lineTo(topX, topY);
        const botX = w * 0.25 + (w * 0.35) * progress;
        const botY = h * 0.8 + (h * 0.05) * progress;
        ctx.lineTo(botX, botY);
        ctx.lineTo(w * 0.25, h * 0.8);
        ctx.closePath();
        ctx.fill();

        // Shade overlay front wall
        const facadeShade = ctx.createLinearGradient(w * 0.25, h * 0.45, w * 0.6, h * 0.85);
        facadeShade.addColorStop(0, 'rgba(255, 255, 255, 0.08)');
        facadeShade.addColorStop(1, 'rgba(0, 0, 0, 0.25)');
        ctx.fillStyle = facadeShade;
        ctx.fill();
        ctx.restore();

        // 4. Draw Wooden Door on Front Wall
        const doorBL = getFrontWallPoint(0.18, 0);
        const doorBR = getFrontWallPoint(0.38, 0);
        const doorTL = getFrontWallPoint(0.18, 0.55);
        const doorTR = getFrontWallPoint(0.38, 0.55);

        ctx.fillStyle = '#7c2d12'; // Oak wood
        ctx.beginPath();
        ctx.moveTo(doorTL.x, doorTL.y);
        ctx.lineTo(doorTR.x, doorTR.y);
        ctx.lineTo(doorBR.x, doorBR.y);
        ctx.lineTo(doorBL.x, doorBL.y);
        ctx.closePath();
        ctx.fill();

        // Wood slats lines
        ctx.strokeStyle = '#431407';
        ctx.lineWidth = 1;
        for (let i = 1; i <= 3; i++) {
          const frac = i / 4;
          const topP = getFrontWallPoint(0.18 + 0.2 * frac, 0.55);
          const botP = getFrontWallPoint(0.18 + 0.2 * frac, 0);
          ctx.beginPath();
          ctx.moveTo(topP.x, topP.y);
          ctx.lineTo(botP.x, botP.y);
          ctx.stroke();
        }

        // Metal Handle
        const handleTop = getFrontWallPoint(0.35, 0.3);
        const handleBot = getFrontWallPoint(0.35, 0.12);
        ctx.strokeStyle = '#d1d5db';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(handleTop.x, handleTop.y);
        ctx.lineTo(handleBot.x, handleBot.y);
        ctx.stroke();

        // 5. Draw Window on Front Wall
        const winBL = getFrontWallPoint(0.55, 0.35);
        const winBR = getFrontWallPoint(0.85, 0.35);
        const winTL = getFrontWallPoint(0.55, 0.75);
        const winTR = getFrontWallPoint(0.85, 0.75);

        const glassGlow = ctx.createLinearGradient(winTL.x, winTL.y, winBR.x, winBR.y);
        glassGlow.addColorStop(0, '#fef08a');
        glassGlow.addColorStop(1, '#fde047');
        ctx.fillStyle = glassGlow;
        ctx.beginPath();
        ctx.moveTo(winTL.x, winTL.y);
        ctx.lineTo(winTR.x, winTR.y);
        ctx.lineTo(winBR.x, winBR.y);
        ctx.lineTo(winBL.x, winBL.y);
        ctx.closePath();
        ctx.fill();

        // Window glow overflow
        ctx.fillStyle = 'rgba(251, 191, 36, 0.12)';
        ctx.beginPath();
        ctx.arc((winTL.x + winBR.x)/2, (winTL.y + winBR.y)/2, 30, 0, Math.PI * 2);
        ctx.fill();

        // Window Frame
        ctx.strokeStyle = '#111827';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(winTL.x, winTL.y);
        ctx.lineTo(winTR.x, winTR.y);
        ctx.lineTo(winBR.x, winBR.y);
        ctx.lineTo(winBL.x, winBL.y);
        ctx.closePath();
        ctx.stroke();

        ctx.strokeStyle = '#111827';
        ctx.lineWidth = 1.5;
        const winMidT = getFrontWallPoint(0.7, 0.75);
        const winMidB = getFrontWallPoint(0.7, 0.35);
        const winMidL = getFrontWallPoint(0.55, 0.55);
        const winMidR = getFrontWallPoint(0.85, 0.55);
        ctx.beginPath();
        ctx.moveTo(winMidT.x, winMidT.y);
        ctx.lineTo(winMidB.x, winMidB.y);
        ctx.moveTo(winMidL.x, winMidL.y);
        ctx.lineTo(winMidR.x, winMidR.y);
        ctx.stroke();

        // 6. Draw Roof Slab
        ctx.fillStyle = '#2d3748'; // dark slate roof
        ctx.beginPath();
        ctx.moveTo(w * 0.2, h * 0.44);
        ctx.lineTo(w * 0.6, h * 0.49);
        ctx.lineTo(w * 0.9, h * 0.41);
        ctx.lineTo(w * 0.9, h * 0.38);
        ctx.lineTo(w * 0.6, h * 0.46);
        ctx.lineTo(w * 0.2, h * 0.41);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#4a5568';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(w * 0.2, h * 0.44);
        ctx.lineTo(w * 0.6, h * 0.49);
        ctx.lineTo(w * 0.9, h * 0.41);
        ctx.stroke();

        // 7. Draw Architectural cypress pot
        const potX = w * 0.15;
        const potY = h * 0.81;

        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.roundRect(potX - 8, potY - 10, 16, 10, 1.5);
        ctx.fill();

        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.moveTo(potX, potY - 50);
        ctx.lineTo(potX + 10, potY - 10);
        ctx.lineTo(potX - 10, potY - 10);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#14532d';
        ctx.beginPath();
        ctx.moveTo(potX, potY - 42);
        ctx.lineTo(potX + 8, potY - 10);
        ctx.lineTo(potX - 8, potY - 10);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#166534';
        ctx.beginPath();
        ctx.moveTo(potX, potY - 32);
        ctx.lineTo(potX + 6, potY - 10);
        ctx.lineTo(potX - 6, potY - 10);
        ctx.closePath();
        ctx.fill();

        // 8. Spray Gun painting animation
        const currentProgress = Math.min(progress, 0.95);
        const sprayBottomY = h * 0.8 + (h * 0.05) * currentProgress;
        const sprayTopY = h * 0.45 + (h * 0.05) * currentProgress;

        rollerYRef.current += rollerDirectionRef.current * 3;
        if (rollerYRef.current > sprayBottomY - 15) {
          rollerYRef.current = sprayBottomY - 15;
          rollerDirectionRef.current = -1;
        } else if (rollerYRef.current < sprayTopY + 15) {
          rollerYRef.current = sprayTopY + 15;
          rollerDirectionRef.current = 1;
        }
        const sprayY = rollerYRef.current;
        const sprayX = w * 0.25 + (w * 0.35) * currentProgress;

        if (progress < 1) {
          ctx.save();
          ctx.translate(sprayX, sprayY);

          // Spray mist gradient
          const rgb = hexToRgb(selectedColor.hex);
          const mistGrad = ctx.createRadialGradient(-25, 0, 1, 0, 0, 20);
          mistGrad.addColorStop(0, selectedColor.hex);
          mistGrad.addColorStop(0.5, `rgba(${rgb}, 0.55)`);
          mistGrad.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = mistGrad;

          ctx.beginPath();
          ctx.moveTo(-25, -2);
          ctx.lineTo(0, -18);
          ctx.lineTo(0, 18);
          ctx.lineTo(-25, 2);
          ctx.closePath();
          ctx.fill();

          // Particle droplets
          ctx.fillStyle = selectedColor.hex;
          ctx.globalAlpha = 0.7;
          for (let i = 0; i < 5; i++) {
            const dropX = -20 + Math.random() * 22;
            const dropY = -12 + Math.random() * 24;
            ctx.beginPath();
            ctx.arc(dropX, dropY, 1 + Math.random() * 2, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.globalAlpha = 1.0;

          // Spray gun shape
          ctx.strokeStyle = '#374151'; // Dark metal grey
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(-25, 0);
          ctx.lineTo(-42, 0);
          ctx.stroke();

          ctx.fillStyle = '#9ca3af';
          ctx.fillRect(-28, -4, 4, 8);

          ctx.strokeStyle = '#111827';
          ctx.lineWidth = 6;
          ctx.beginPath();
          ctx.moveTo(-40, 0);
          ctx.lineTo(-47, 18);
          ctx.stroke();

          // Container cup
          ctx.fillStyle = '#e5e7eb';
          ctx.beginPath();
          ctx.roundRect(-48, -14, 12, 12, 1.5);
          ctx.fill();
          ctx.strokeStyle = '#9ca3af';
          ctx.lineWidth = 1;
          ctx.stroke();

          ctx.restore();
        }

        // Overlay text
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.font = '12px Courier New';
        ctx.textAlign = 'center';
        ctx.fillText(
          `[Simulatore Facciata Esterna - Colore: ${selectedColor.name}]`,
          w / 2,
          h - 30
        );
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [selectedColor, useCase]);

  return (
    <div className="bg-bg-main px-6 py-28 animate-fade-in text-text-primary">
      <div className="max-w-[88rem] mx-auto">
        {/* Navigation / Header */}
        <button
          onClick={onBack}
          className="btn-glass px-5 py-2.5 text-sm text-text-muted hover:text-accent-link mb-12 flex items-center space-x-2 group focus:outline-none cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
          <span>Torna a tutti i prodotti</span>
        </button>

        {/* Split Screen Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:h-[80vh]">
          {/* Left Column (Canvas Animation) */}
          <div className="relative w-full h-[45vh] lg:h-full rounded-3xl overflow-hidden shadow-inner border border-white/5 flex flex-col bg-bg-surface">
            <canvas ref={canvasRef} className="w-full flex-1 block" />
            
            {/* Simulation Controls Overlay (floating badge) */}
            <div className="absolute top-6 left-6 bg-bg-surface/80 backdrop-blur-md text-text-primary text-xs px-4 py-2 rounded-full flex items-center space-x-2 border border-white/10 shadow-lg">
              <Sparkles className="w-3.5 h-3.5 text-accent-link animate-spin" />
              <span>Simulatore Pareti 3D Attivo</span>
            </div>
            
            <div className="absolute bottom-6 right-6">
              <button 
                onClick={() => { paintProgressRef.current = 0; }} 
                className="bg-bg-surface border border-white/10 hover:border-accent-link/50 px-4 py-2 rounded-full text-xs text-text-primary transition-all cursor-pointer shadow-md focus:outline-none"
              >
                Ripristina Colore
              </button>
            </div>
          </div>

          {/* Right Column (Controls & Selection) */}
          <div className="flex flex-col justify-between space-y-8 lg:space-y-0 lg:overflow-y-auto lg:pr-4 scrollbar-hide">
            <div>
              {/* Swatch & Title Section */}
              <div className="flex items-start justify-between mb-8">
                <div>
                  <span className="text-sm font-semibold uppercase tracking-wider text-text-muted block mb-2">
                    Smalti & Finiture
                  </span>
                  <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-text-primary mb-4">
                    {selectedColor.name}
                  </h2>
                  <p className="text-text-muted leading-relaxed max-w-lg">
                    {selectedColor.description}
                  </p>
                </div>

                {/* Color Swatch */}
                <div 
                  className="w-24 h-24 rounded-2xl shadow-md border border-white/10 flex-shrink-0 transition-transform duration-300 hover:scale-105"
                  style={{ backgroundColor: selectedColor.hex }}
                  title={selectedColor.name}
                />
              </div>

              {/* Interactive Color Selection Palette */}
              <div className="mb-10">
                <span className="text-xs font-semibold uppercase tracking-wider text-text-muted block mb-4">
                  Seleziona un'altra tonalità d'accento:
                </span>
                <div className="flex flex-wrap gap-3">
                  {colors.map((color) => {
                    const isSelected = color.id === selectedColor.id;
                    return (
                      <button
                        key={color.id}
                        onClick={() => onSelectColor(color)}
                        className={`flex items-center space-x-2 px-4 py-2.5 rounded-full border transition-all duration-200 focus:outline-none cursor-pointer ${
                          isSelected 
                            ? 'border-accent-link bg-accent-link text-bg-main shadow-md font-semibold' 
                            : 'border-white/5 hover:border-accent-link/50 bg-bg-surface text-text-muted hover:text-text-primary'
                        }`}
                      >
                        <span 
                          className="w-4 h-4 rounded-full border border-white/10 inline-block"
                          style={{ backgroundColor: color.hex }}
                        />
                        <span className="text-sm font-medium">{color.name}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 ml-1 text-bg-main" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Toggles for Finish, Use, and Size */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                {/* Finish Toggle */}
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-text-muted block mb-3">
                    Finitura Superficie
                  </label>
                  <div className="flex border border-white/5 rounded-xl overflow-hidden p-1 bg-bg-main">
                    {(['opaca', 'satinata', 'lucida'] as const).map((f) => (
                      <button
                        key={f}
                        onClick={() => setFinish(f)}
                        className={`flex-1 text-xs font-medium py-2 rounded-lg capitalize transition-all duration-200 focus:outline-none cursor-pointer ${
                          finish === f 
                            ? 'bg-bg-surface text-text-primary shadow-sm font-semibold border border-white/5' 
                            : 'text-text-muted hover:text-accent-link hover:text-text-primary'
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Use Case Toggle */}
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-text-muted block mb-3">
                    Destinazione d'Uso
                  </label>
                  <div className="flex border border-white/5 rounded-xl overflow-hidden p-1 bg-bg-main">
                    {(['interno', 'esterno'] as const).map((u) => (
                      <button
                        key={u}
                        onClick={() => setUseCase(u)}
                        className={`flex-1 text-xs font-medium py-2 rounded-lg capitalize transition-all duration-200 focus:outline-none cursor-pointer ${
                          useCase === u 
                            ? 'bg-bg-surface text-text-primary shadow-sm font-semibold border border-white/5' 
                            : 'text-text-muted hover:text-accent-link hover:text-text-primary'
                        }`}
                      >
                        {u}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Technical Specifications */}
              <div className="border border-white/5 rounded-2xl p-6 bg-bg-surface/50 mb-8">
                <h4 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
                  <Info className="w-4 h-4 text-accent-link" />
                  Specifiche Tecniche & Resa
                </h4>
                <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
                  {[
                    { label: 'Resa Teorica', value: selectedColor.properties.coverage },
                    { label: 'Diluizione', value: selectedColor.properties.dilution },
                    { label: 'Asciugatura', value: selectedColor.properties.drying },
                    { label: 'Classe VOC', value: selectedColor.properties.voc },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex flex-col gap-1 border-b border-white/5 pb-3">
                      <span className="text-[11px] uppercase tracking-wider text-text-muted">{label}</span>
                      <span className="font-medium text-text-primary leading-snug">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center pt-6 border-t border-white/5">
              {/* Formato Selection */}
              <div className="flex items-center space-x-2 border border-white/5 rounded-full px-3 py-1 bg-bg-main">
                {(['1L', '5L', '14L'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`w-10 h-10 rounded-full text-xs font-semibold transition-all duration-200 focus:outline-none cursor-pointer ${
                      size === s
                        ? 'bg-bg-surface text-text-primary border border-white/5'
                        : 'text-text-muted hover:text-text-primary'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Ventaglio Colori Interactive Carousel */}
        <div className="hidden md:block mt-24 border-t border-white/5 pt-16 text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-text-muted block mb-3">
            La Collezione Cromatica
          </span>
          <h3 className="text-3xl font-medium tracking-tight text-text-primary mb-4">
            Seleziona la Tonalità dal Ventaglio
          </h3>
          <p className="text-text-muted text-sm max-w-md mx-auto mb-10">
            Sfoglia il nostro ventaglio di colori d'accento. Clicca su una scheda per applicarla direttamente sul simulatore pareti 3D in tempo reale.
          </p>
          
          <div className="w-full overflow-hidden">
            <SocialCards cards={carouselCards} />
          </div>
        </div>
      </div>
    </div>
  );
}
