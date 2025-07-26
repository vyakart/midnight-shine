import React, { useEffect, useState } from 'react';

interface GlitchTextProps {
  text: string;
  isActive: boolean;
  duration?: number;
  intensity?: 'low' | 'medium' | 'high';
  className?: string;
  onComplete?: () => void;
}

export const GlitchText: React.FC<GlitchTextProps> = ({
  text,
  isActive,
  duration = 3000,
  intensity = 'medium',
  className = '',
  onComplete
}) => {
  const [displayText, setDisplayText] = useState(text);
  const [isGlitching, setIsGlitching] = useState(false);

  // Glitch characters
  const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?~`';
  const matrixChars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヰヱヲン';

  // Intensity settings
  const intensitySettings = {
    low: { frequency: 50, corruptionRate: 0.1, maxGlitches: 2 },
    medium: { frequency: 30, corruptionRate: 0.2, maxGlitches: 5 },
    high: { frequency: 20, corruptionRate: 0.4, maxGlitches: 10 }
  };

  const settings = intensitySettings[intensity];

  const corruptText = (originalText: string): string => {
    let corrupted = originalText.split('');
    const numCorruptions = Math.min(
      Math.floor(originalText.length * settings.corruptionRate),
      settings.maxGlitches
    );

    for (let i = 0; i < numCorruptions; i++) {
      const randomIndex = Math.floor(Math.random() * corrupted.length);
      const useMatrix = Math.random() < 0.6;
      const charSet = useMatrix ? matrixChars : glitchChars;
      corrupted[randomIndex] = charSet[Math.floor(Math.random() * charSet.length)];
    }

    return corrupted.join('');
  };

  useEffect(() => {
    if (!isActive) {
      setDisplayText(text);
      setIsGlitching(false);
      return;
    }

    setIsGlitching(true);
    let timeoutId: number;
    let intervalId: number;

    // Start glitching
    intervalId = window.setInterval(() => {
      if (Math.random() < 0.3) {
        setDisplayText(corruptText(text));
      } else {
        setDisplayText(text);
      }
    }, settings.frequency);

    // Stop glitching after duration
    timeoutId = window.setTimeout(() => {
      clearInterval(intervalId);
      setDisplayText(text);
      setIsGlitching(false);
      onComplete?.();
    }, duration);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [isActive, text, duration, intensity, onComplete]);

  if (!isActive && displayText === text) {
    return <span className={className}>{text}</span>;
  }

  return (
    <span
      className={`relative inline-block ${className}`}
      style={{
        animation: isGlitching ? 'glitch-skew 0.5s infinite linear alternate-reverse' : 'none',
      }}
      data-text={text}
    >
      {displayText}
      
      {/* Glitch layers */}
      {isGlitching && (
        <>
          <span
            className="absolute top-0 left-0 text-cyan-400 opacity-80"
            style={{
              animation: 'glitch-1 0.3s infinite linear alternate-reverse',
              clipPath: 'inset(0 0 95% 0)',
              transform: 'translate(-2px, 2px)',
            }}
          >
            {corruptText(text)}
          </span>
          <span
            className="absolute top-0 left-0 text-purple-400 opacity-60"
            style={{
              animation: 'glitch-2 0.4s infinite linear alternate-reverse',
              clipPath: 'inset(85% 0 0 0)',
              transform: 'translate(2px, -2px)',
            }}
          >
            {corruptText(text)}
          </span>
        </>
      )}
    </span>
  );
};

export default GlitchText;