/**
 * Test suite for enhanced matrix command functionality
 * Tests the command parser, parameter handling, and structured output generation
 */

import { handleCommand } from '../components/Terminal/commandHandler';

describe('Enhanced Matrix Command', () => {
  test('basic matrix command should use default parameters', async () => {
    const result = await handleCommand('matrix');
    
    expect(result.type).toBe('system');
    expect(result.content).toContain('Entering the Matrix... 🕶️');
    expect(result.content).toContain('MATRIX:');
    
    // Parse the JSON configuration
    const configStart = result.content.indexOf('MATRIX:') + 7;
    const config = JSON.parse(result.content.substring(configStart));
    
    expect(config.mode).toBe('classic');
    expect(config.duration).toBe(5000);
    expect(config.intensity).toBe('medium');
    expect(config.characterSet).toContain('01アイウエオ'); // Japanese characters for classic mode
  });

  test('matrix neo mode should have special configuration', async () => {
    const result = await handleCommand('matrix neo');
    
    expect(result.content).toContain('Welcome to the real world... 🔴');
    
    const configStart = result.content.indexOf('MATRIX:') + 7;
    const config = JSON.parse(result.content.substring(configStart));
    
    expect(config.mode).toBe('neo');
    expect(config.effects.bootSequence).toBe(true);
    expect(config.audio.bootSounds).toBe(true);
    expect(config.transitions.entryEffect).toBe('bootSequence');
    expect(config.theme.primaryColor).toBe('#ff0000'); // Red for neo mode
  });

  test('matrix digital mode should have binary characteristics', async () => {
    const result = await handleCommand('matrix digital');
    
    expect(result.content).toContain('Initiating digital rain sequence... 💾');
    
    const configStart = result.content.indexOf('MATRIX:') + 7;
    const config = JSON.parse(result.content.substring(configStart));
    
    expect(config.mode).toBe('digital');
    expect(config.characterSet).toBe('01010101010101010101010101010101010101010101010101010101010101010101010101010101'); // Binary only
    expect(config.audio.glitchSounds).toBe(true);
    expect(config.theme.primaryColor).toBe('#00ffff'); // Cyan for digital mode
  });

  test('matrix code mode should have programming elements', async () => {
    const result = await handleCommand('matrix code');
    
    expect(result.content).toContain('Compiling reality... 💻');
    
    const configStart = result.content.indexOf('MATRIX:') + 7;
    const config = JSON.parse(result.content.substring(configStart));
    
    expect(config.mode).toBe('code');
    expect(config.characterSet).toContain('const let var function');
    expect(config.transitions.messageRevealDelay).toBe(2000); // Longer delay for code mode
    expect(config.theme.primaryColor).toBe('#ff00ff'); // Purple for code mode
  });

  test('matrix with custom duration parameter', async () => {
    const result = await handleCommand('matrix classic --duration=10000');
    
    const configStart = result.content.indexOf('MATRIX:') + 7;
    const config = JSON.parse(result.content.substring(configStart));
    
    expect(config.duration).toBe(10000);
    expect(config.mode).toBe('classic');
  });

  test('matrix with custom intensity parameter', async () => {
    const result = await handleCommand('matrix --intensity=high');
    
    const configStart = result.content.indexOf('MATRIX:') + 7;
    const config = JSON.parse(result.content.substring(configStart));
    
    expect(config.intensity).toBe('high');
    expect(config.effects.particleField).toBe(true); // High intensity enables particle field
    expect(config.audio.volumeLevel).toBe(0.8); // High intensity has higher volume
    expect(config.theme.trailOpacity).toBe(0.8); // High intensity has more opacity
  });

  test('matrix with combined parameters', async () => {
    const result = await handleCommand('matrix neo --duration=15000 --intensity=low');
    
    const configStart = result.content.indexOf('MATRIX:') + 7;
    const config = JSON.parse(result.content.substring(configStart));
    
    expect(config.mode).toBe('neo');
    expect(config.duration).toBe(15000);
    expect(config.intensity).toBe('low');
    expect(config.audio.ambientHum).toBe(false); // Low intensity disables ambient hum
    expect(config.audio.volumeLevel).toBe(0.4); // Low intensity has lower volume
  });

  test('matrix stop command', async () => {
    const result = await handleCommand('matrix stop');
    
    expect(result.type).toBe('system');
    expect(result.content).toBe('MATRIX:stop');
  });

  test('matrix help command should show detailed help', async () => {
    const result = await handleCommand('matrix --help');
    
    expect(result.type).toBe('info');
    expect(result.isHTML).toBe(true);
    expect(result.content).toContain('MATRIX COMMAND REFERENCE');
    expect(result.content).toContain('classic');
    expect(result.content).toContain('digital');
    expect(result.content).toContain('code');
    expect(result.content).toContain('neo');
    expect(result.content).toContain('--duration');
    expect(result.content).toContain('--intensity');
  });

  test('invalid matrix mode should return error', async () => {
    const result = await handleCommand('matrix invalid');
    
    expect(result.type).toBe('error');
    expect(result.content).toContain('Invalid mode: invalid');
    expect(result.content).toContain('Valid modes: classic, digital, code, neo, stop');
  });

  test('invalid duration should return error', async () => {
    const result = await handleCommand('matrix --duration=500');
    
    expect(result.type).toBe('error');
    expect(result.content).toContain('Duration must be between 1000ms and 30000ms');
  });

  test('invalid intensity should return error', async () => {
    const result = await handleCommand('matrix --intensity=extreme');
    
    expect(result.type).toBe('error');
    expect(result.content).toContain('Invalid intensity: extreme');
    expect(result.content).toContain('Valid intensities: low, medium, high');
  });

  test('matrix alias "neo" should work', async () => {
    const result = await handleCommand('neo');
    
    expect(result.type).toBe('system');
    expect(result.content).toContain('Entering the Matrix... 🕶️');
    
    const configStart = result.content.indexOf('MATRIX:') + 7;
    const config = JSON.parse(result.content.substring(configStart));
    
    expect(config.mode).toBe('classic'); // Default mode when using alias without parameters
  });

  test('matrix content reveals should be mode-specific', async () => {
    const neoResult = await handleCommand('matrix neo');
    const configStart = neoResult.content.indexOf('MATRIX:') + 7;
    const neoConfig = JSON.parse(neoResult.content.substring(configStart));
    
    expect(neoConfig.contentReveals.philosophy).toBeDefined();
    expect(neoConfig.contentReveals.revelation).toBe('The bridge between ideas and impact');
    
    const digitalResult = await handleCommand('matrix digital');
    const digitalConfigStart = digitalResult.content.indexOf('MATRIX:') + 7;
    const digitalConfig = JSON.parse(digitalResult.content.substring(digitalConfigStart));
    
    expect(digitalConfig.contentReveals.binary).toBeDefined();
    expect(digitalConfig.contentReveals.message).toBe('Data streams converging...');
  });

  test('matrix messages should be mode-appropriate', async () => {
    const neoResult = await handleCommand('matrix neo');
    const configStart = neoResult.content.indexOf('MATRIX:') + 7;
    const config = JSON.parse(neoResult.content.substring(configStart));
    
    expect(config.messages).toContain('Mr. Anderson...');
    expect(config.messages).toContain('You are The One');
    expect(config.messages).toContain('Welcome to the real world');
  });
});