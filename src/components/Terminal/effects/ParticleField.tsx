import React, { useEffect, useRef, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
  life: number;
  maxLife: number;
}

interface ParticleFieldProps {
  isActive: boolean;
  particleCount?: number;
  intensity?: 'low' | 'medium' | 'high';
  className?: string;
}

export const ParticleField: React.FC<ParticleFieldProps> = ({
  isActive,
  particleCount = 50,
  intensity = 'medium',
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const particlesRef = useRef<Particle[]>([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Color schemes for particles
  const colors = ['#00ff41', '#00d4aa', '#0099cc', '#6600cc', '#ff0066'];

  // Intensity settings
  const intensitySettings = {
    low: { speed: 0.3, sizeMultiplier: 0.5, opacityMax: 0.3 },
    medium: { speed: 0.6, sizeMultiplier: 1, opacityMax: 0.5 },
    high: { speed: 1, sizeMultiplier: 1.5, opacityMax: 0.7 }
  };

  const settings = intensitySettings[intensity];

  // Create a particle
  const createParticle = (width: number, height: number): Particle => {
    const maxLife = Math.random() * 300 + 200;
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * settings.speed,
      vy: (Math.random() - 0.5) * settings.speed,
      size: Math.random() * 2 * settings.sizeMultiplier + 0.5,
      opacity: Math.random() * settings.opacityMax + 0.1,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: maxLife,
      maxLife: maxLife
    };
  };

  // Update dimensions when canvas size changes
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

  // Initialize particles
  useEffect(() => {
    if (!isActive || dimensions.width === 0) return;

    particlesRef.current = Array.from({ length: particleCount }, () =>
      createParticle(dimensions.width, dimensions.height)
    );
  }, [isActive, particleCount, dimensions, settings]);

  // Animation loop
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

    const animate = () => {
      // Clear canvas with slight trail effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, dimensions.width, dimensions.height);

      particlesRef.current.forEach((particle, index) => {
        // Update particle position
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life--;

        // Wrap around screen edges
        if (particle.x < 0) particle.x = dimensions.width;
        if (particle.x > dimensions.width) particle.x = 0;
        if (particle.y < 0) particle.y = dimensions.height;
        if (particle.y > dimensions.height) particle.y = 0;

        // Calculate life-based opacity
        const lifeRatio = particle.life / particle.maxLife;
        const currentOpacity = particle.opacity * lifeRatio;

        // Draw particle
        if (currentOpacity > 0.01) {
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fillStyle = particle.color.replace(')', `, ${currentOpacity})`).replace('#', 'rgba(').replace(/(.{2})(.{2})(.{2})/, (_, r, g, b) => {
            return `rgba(${parseInt(r, 16)}, ${parseInt(g, 16)}, ${parseInt(b, 16)}, ${currentOpacity})`;
          });
          ctx.fill();

          // Add subtle glow
          ctx.shadowColor = particle.color;
          ctx.shadowBlur = particle.size * 2;
          ctx.fill();
          ctx.shadowBlur = 0;
        }

        // Respawn particle if dead
        if (particle.life <= 0) {
          particlesRef.current[index] = createParticle(dimensions.width, dimensions.height);
        }
      });

      // Draw connections between nearby particles
      if (intensity !== 'low') {
        particlesRef.current.forEach((particle1, i) => {
          particlesRef.current.slice(i + 1).forEach(particle2 => {
            const dx = particle1.x - particle2.x;
            const dy = particle1.y - particle2.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
              const opacity = (1 - distance / 100) * 0.2;
              ctx.beginPath();
              ctx.moveTo(particle1.x, particle1.y);
              ctx.lineTo(particle2.x, particle2.y);
              ctx.strokeStyle = `rgba(0, 255, 65, ${opacity})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          });
        });
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, dimensions, intensity]);

  if (!isActive) return null;

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none z-0 ${className}`}
      style={{
        mixBlendMode: 'screen',
      }}
    />
  );
};

export default ParticleField;