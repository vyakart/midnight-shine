import React, { useEffect, useRef, useState } from 'react';

interface MatrixRainProps {
  isActive: boolean;
  intensity?: 'low' | 'medium' | 'high';
  className?: string;
}

interface Drop {
  x: number;
  y: number;
  speed: number;
  length: number;
  opacity: number;
  chars: string[];
}

export const MatrixRain: React.FC<MatrixRainProps> = ({
  isActive,
  intensity = 'medium',
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const dropsRef = useRef<Drop[]>([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Matrix characters
  const matrixChars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヰヱヲン';
  
  // Intensity settings
  const intensitySettings = {
    low: { dropCount: 15, speed: 0.5, opacity: 0.3 },
    medium: { dropCount: 25, speed: 0.8, opacity: 0.5 },
    high: { dropCount: 40, speed: 1.2, opacity: 0.7 }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateDimensions = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      setDimensions({ width: rect.width, height: rect.height });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  useEffect(() => {
    if (!isActive) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas || dimensions.width === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const settings = intensitySettings[intensity];
    const fontSize = 14;
    const columns = Math.floor(dimensions.width / fontSize);

    // Initialize drops
    dropsRef.current = Array.from({ length: settings.dropCount }, () => ({
      x: Math.random() * columns,
      y: Math.random() * dimensions.height,
      speed: (Math.random() * 0.5 + 0.5) * settings.speed,
      length: Math.random() * 20 + 10,
      opacity: Math.random() * settings.opacity + 0.2,
      chars: Array.from({ length: 20 }, () => 
        matrixChars[Math.floor(Math.random() * matrixChars.length)]
      )
    }));

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, dimensions.width, dimensions.height);

      ctx.font = `${fontSize}px monospace`;

      dropsRef.current.forEach(drop => {
        // Draw the trail
        for (let i = 0; i < drop.length; i++) {
          const alpha = (drop.opacity * (drop.length - i)) / drop.length;
          const y = (drop.y - i * fontSize) % dimensions.height;
          
          if (y > 0) {
            // Bright green for the head, fading to darker
            if (i === 0) {
              ctx.fillStyle = `rgba(100, 255, 100, ${alpha})`;
            } else {
              ctx.fillStyle = `rgba(0, 200, 0, ${alpha * 0.8})`;
            }
            
            const char = drop.chars[i % drop.chars.length];
            ctx.fillText(char, drop.x * fontSize, y);
          }
        }

        // Update drop position
        drop.y += drop.speed;

        // Reset drop when it goes off screen
        if (drop.y > dimensions.height + drop.length * fontSize) {
          drop.y = -drop.length * fontSize;
          drop.x = Math.random() * columns;
          drop.speed = (Math.random() * 0.5 + 0.5) * settings.speed;
          
          // Occasionally change characters
          if (Math.random() < 0.1) {
            drop.chars = Array.from({ length: 20 }, () => 
              matrixChars[Math.floor(Math.random() * matrixChars.length)]
            );
          }
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, intensity, dimensions]);

  if (!isActive) return null;

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none z-0 ${className}`}
      style={{
        background: 'linear-gradient(to bottom, #0a0a0a, #000)',
      }}
    />
  );
};

export default MatrixRain;