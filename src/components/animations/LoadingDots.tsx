import React from 'react';

interface LoadingDotsProps {
  variant?: 'dots' | 'bars' | 'pulse' | 'terminal' | 'matrix';
  size?: 'sm' | 'md' | 'lg';
  speed?: 'slow' | 'normal' | 'fast';
  color?: string;
  className?: string;
  text?: string;
}

export const LoadingDots: React.FC<LoadingDotsProps> = ({
  variant = 'dots',
  size = 'md',
  speed = 'normal',
  color,
  className = '',
  text
}) => {
  // Size configurations
  const sizeConfig = {
    sm: {
      dot: 'w-1 h-1',
      bar: 'w-1 h-3',
      text: 'text-xs',
      gap: 'gap-1'
    },
    md: {
      dot: 'w-2 h-2',
      bar: 'w-1.5 h-4',
      text: 'text-sm',
      gap: 'gap-1.5'
    },
    lg: {
      dot: 'w-3 h-3',
      bar: 'w-2 h-5',
      text: 'text-base',
      gap: 'gap-2'
    }
  };

  // Speed configurations (animation duration)
  const speedConfig = {
    slow: '2s',
    normal: '1.4s',
    fast: '0.8s'
  };

  const config = sizeConfig[size];
  const animationDuration = speedConfig[speed];

  // Color classes
  const colorClass = color || 'bg-green-400';
  const textColorClass = color ? `text-${color}` : 'text-green-400';

  const renderDots = () => (
    <div className={`flex items-center ${config.gap} ${className}`}>
      {text && (
        <span className={`${config.text} ${textColorClass} mr-2 font-mono`}>
          {text}
        </span>
      )}
      {[0, 1, 2].map((index) => (
        <div
          key={index}
          className={`${config.dot} ${colorClass} rounded-full`}
          style={{
            animation: `loading-bounce ${animationDuration} infinite`,
            animationDelay: `${index * 0.2}s`,
          }}
        />
      ))}
    </div>
  );

  const renderBars = () => (
    <div className={`flex items-end ${config.gap} ${className}`}>
      {text && (
        <span className={`${config.text} ${textColorClass} mr-2 font-mono`}>
          {text}
        </span>
      )}
      {[0, 1, 2, 3, 4].map((index) => (
        <div
          key={index}
          className={`${config.bar} ${colorClass} rounded-sm`}
          style={{
            animation: `loading-bars ${animationDuration} infinite`,
            animationDelay: `${index * 0.1}s`,
          }}
        />
      ))}
    </div>
  );

  const renderPulse = () => (
    <div className={`flex items-center ${config.gap} ${className}`}>
      {text && (
        <span className={`${config.text} ${textColorClass} mr-2 font-mono`}>
          {text}
        </span>
      )}
      <div
        className={`${config.dot} ${colorClass} rounded-full`}
        style={{
          animation: `loading-pulse ${animationDuration} infinite`,
        }}
      />
    </div>
  );

  const renderTerminal = () => (
    <div className={`flex items-center ${className}`}>
      {text && (
        <span className={`${config.text} ${textColorClass} mr-1 font-mono`}>
          {text}
        </span>
      )}
      <span
        className={`${config.text} ${textColorClass} font-mono`}
        style={{
          animation: `terminal-blink ${animationDuration} infinite`,
        }}
      >
        █
      </span>
    </div>
  );

  const renderMatrix = () => (
    <div className={`flex items-center ${config.gap} ${className}`}>
      {text && (
        <span className={`${config.text} ${textColorClass} mr-2 font-mono`}>
          {text}
        </span>
      )}
      {['01', '10', '11', '00'].map((binary, index) => (
        <span
          key={index}
          className={`${config.text} font-mono`}
          style={{
            animation: `matrix-flicker ${animationDuration} infinite`,
            animationDelay: `${index * 0.3}s`,
            color: '#00ff41',
          }}
        >
          {binary}
        </span>
      ))}
    </div>
  );

  const renderVariant = () => {
    switch (variant) {
      case 'bars':
        return renderBars();
      case 'pulse':
        return renderPulse();
      case 'terminal':
        return renderTerminal();
      case 'matrix':
        return renderMatrix();
      default:
        return renderDots();
    }
  };

  return (
    <>
      {renderVariant()}
      <style>
        {`
          @keyframes loading-bounce {
            0%, 80%, 100% {
              transform: scale(0);
              opacity: 0.5;
            }
            40% {
              transform: scale(1);
              opacity: 1;
            }
          }

          @keyframes loading-bars {
            0%, 40%, 100% {
              transform: scaleY(0.4);
              opacity: 0.5;
            }
            20% {
              transform: scaleY(1);
              opacity: 1;
            }
          }

          @keyframes loading-pulse {
            0% {
              transform: scale(0);
              opacity: 1;
            }
            100% {
              transform: scale(1.5);
              opacity: 0;
            }
          }

          @keyframes terminal-blink {
            0%, 50% {
              opacity: 1;
            }
            51%, 100% {
              opacity: 0;
            }
          }

          @keyframes matrix-flicker {
            0%, 70%, 100% {
              opacity: 0.3;
              text-shadow: none;
            }
            35% {
              opacity: 1;
              text-shadow: 0 0 5px #00ff41, 0 0 10px #00ff41;
            }
          }
        `}
      </style>
    </>
  );
};

export default LoadingDots;