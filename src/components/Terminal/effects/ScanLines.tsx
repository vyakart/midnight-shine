import React from 'react';

interface ScanLinesProps {
  isActive: boolean;
  intensity?: 'low' | 'medium' | 'high';
  speed?: 'slow' | 'normal' | 'fast';
  className?: string;
}

export const ScanLines: React.FC<ScanLinesProps> = ({
  isActive,
  intensity = 'medium',
  speed = 'normal',
  className = ''
}) => {
  if (!isActive) return null;

  // Intensity settings for opacity and line density
  const intensitySettings = {
    low: { opacity: 0.1, lineHeight: 4 },
    medium: { opacity: 0.2, lineHeight: 3 },
    high: { opacity: 0.3, lineHeight: 2 }
  };

  // Speed settings for animation duration
  const speedSettings = {
    slow: '12s',
    normal: '8s',
    fast: '4s'
  };

  const settings = intensitySettings[intensity];
  const animationSpeed = speedSettings[speed];

  return (
    <>
      {/* Static horizontal scan lines */}
      <div
        className={`absolute inset-0 pointer-events-none z-10 ${className}`}
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent ${settings.lineHeight - 1}px,
            rgba(0, 255, 100, ${settings.opacity}) ${settings.lineHeight - 1}px,
            rgba(0, 255, 100, ${settings.opacity}) ${settings.lineHeight}px
          )`,
        }}
      />
      
      {/* Moving scan line */}
      <div
        className={`absolute inset-0 pointer-events-none z-20 ${className}`}
        style={{
          background: `linear-gradient(
            to bottom,
            transparent 0%,
            rgba(0, 255, 100, 0.6) 49%,
            rgba(100, 255, 100, 0.8) 50%,
            rgba(0, 255, 100, 0.6) 51%,
            transparent 100%
          )`,
          height: '2px',
          animation: `scanline-move ${animationSpeed} linear infinite`,
        }}
      />
      
      {/* CRT screen curvature effect */}
      <div
        className={`absolute inset-0 pointer-events-none z-30 ${className}`}
        style={{
          background: `radial-gradient(
            ellipse at center,
            rgba(0, 0, 0, 0) 0%,
            rgba(0, 0, 0, 0.1) 70%,
            rgba(0, 0, 0, 0.4) 100%
          )`,
        }}
      />

      {/* Add custom keyframes */}
      <style>
        {`
          @keyframes scanline-move {
            0% { 
              transform: translateY(-100vh); 
              opacity: 0;
            }
            10% { 
              opacity: 1; 
            }
            90% { 
              opacity: 1; 
            }
            100% { 
              transform: translateY(100vh); 
              opacity: 0;
            }
          }
        `}
      </style>
    </>
  );
};

export default ScanLines;