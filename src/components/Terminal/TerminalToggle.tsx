import React, { useState } from 'react';
import { Terminal } from './Terminal';
import { SimpleTerminal } from './SimpleTerminal';
import type { TerminalConfig } from '../../types/terminal';

interface TerminalToggleProps extends Partial<TerminalConfig> {
  className?: string;
  defaultMode?: 'simple' | 'enhanced';
}

export const TerminalToggle: React.FC<TerminalToggleProps> = ({
  className = '',
  defaultMode = 'simple',
  ...config
}) => {
  const [terminalMode, setTerminalMode] = useState<'simple' | 'enhanced'>(defaultMode);

  return (
    <div className={`relative ${className}`}>
      {/* Mode Toggle Controls */}
      <div className="absolute top-4 right-4 z-50 flex items-center space-x-2 bg-black/80 backdrop-blur-sm rounded-lg p-2 border border-green-500/30">
        <span className="text-xs text-green-400/70">Mode:</span>
        <button
          onClick={() => setTerminalMode('simple')}
          className={`px-3 py-1 text-xs rounded transition-colors ${
            terminalMode === 'simple'
              ? 'bg-green-500/20 text-green-400 border border-green-500/50'
              : 'text-green-400/60 hover:text-green-400 border border-green-500/20'
          }`}
        >
          Simple
        </button>
        <button
          onClick={() => setTerminalMode('enhanced')}
          className={`px-3 py-1 text-xs rounded transition-colors ${
            terminalMode === 'enhanced'
              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
              : 'text-cyan-400/60 hover:text-cyan-400 border border-cyan-500/20'
          }`}
        >
          Enhanced
        </button>
      </div>

      {/* Terminal Mode Info */}
      <div className="absolute top-16 right-4 z-40 bg-black/80 backdrop-blur-sm rounded-lg p-3 border border-green-500/30 text-xs max-w-xs">
        {terminalMode === 'simple' ? (
          <div className="text-green-400/80">
            <div className="font-semibold text-green-400 mb-1">Simple Mode</div>
            <div className="space-y-1">
              <div>• Clean, focused interface</div>
              <div>• Better input responsiveness</div>
              <div>• Standard cursor behavior</div>
              <div>• Reduced visual effects</div>
            </div>
          </div>
        ) : (
          <div className="text-cyan-400/80">
            <div className="font-semibold text-cyan-400 mb-1">Enhanced Mode</div>
            <div className="space-y-1">
              <div>• Atmospheric visual effects</div>
              <div>• Matrix rain & particles</div>
              <div>• CRT-style appearance</div>
              <div>• Advanced animations</div>
            </div>
          </div>
        )}
      </div>

      {/* Terminal Component */}
      {terminalMode === 'simple' ? (
        <SimpleTerminal
          className="w-full"
          {...config}
        />
      ) : (
        <Terminal
          className="w-full"
          enableBootSequence={false}
          enableEffects={true}
          {...config}
        />
      )}
    </div>
  );
};

export default TerminalToggle;