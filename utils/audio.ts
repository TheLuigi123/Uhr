import { SoundEffect } from '../types';

export const playSound = (effect: SoundEffect) => {
  // Prevent execution during SSR or if AudioContext is missing
  if (typeof window === 'undefined') return;
  
  const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContext) return;
  
  const ctx = new AudioContext();
  const t = ctx.currentTime;
  const masterGain = ctx.createGain();
  masterGain.connect(ctx.destination);

  // Helper to play a tone
  const playTone = (freq: number, start: number, dur: number, type: OscillatorType = 'sine', vol = 0.2) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, start);
    
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(vol, start + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, start + dur);
    
    osc.connect(gain);
    gain.connect(masterGain);
    
    osc.start(start);
    osc.stop(start + dur);
  };

  switch (effect) {
    case 'chime': // Magical/Dreamy (End of Routine -> Breakfast)
      masterGain.gain.setValueAtTime(1, t);
      // E Major 7 add 9 arpeggio, slow and reverberant feel - Doubled Duration
      playTone(329.63, t, 6.0, 'sine', 0.15); // E4
      playTone(415.30, t + 0.4, 6.0, 'sine', 0.15); // G#4
      playTone(493.88, t + 0.8, 6.0, 'sine', 0.15); // B4
      playTone(622.25, t + 1.2, 6.0, 'sine', 0.15); // D#5
      playTone(659.25, t + 1.6, 8.0, 'sine', 0.2); // E5
      break;

    case 'fanfare': // Energetic/Success (End of Breakfast -> Teeth)
      masterGain.gain.setValueAtTime(0.8, t);
      // Trumpet-ish fanfare - Slower tempo (half speed)
      const type = 'triangle';
      playTone(523.25, t, 0.4, type, 0.2); // C5
      playTone(523.25, t + 0.4, 0.4, type, 0.2); // C5
      playTone(523.25, t + 0.8, 0.4, type, 0.2); // C5
      playTone(659.25, t + 1.2, 1.2, type, 0.2); // E5
      playTone(783.99, t + 2.4, 3.0, type, 0.25); // G5
      break;

    case 'warning': // Urgent Pulse (End of Teeth -> Shoes)
      masterGain.gain.setValueAtTime(1, t);
      // Urgent repeated pattern - Doubled iterations (12 instead of 6)
      for(let i = 0; i < 12; i++) {
        const startTime = t + (i * 0.4);
        playTone(440, startTime, 0.2, 'square', 0.1); // A4
        playTone(349.23, startTime + 0.2, 0.2, 'square', 0.1); // F4
      }
      break;

    case 'alarm': // School Siren (End of Shoes -> Leave)
      masterGain.gain.setValueAtTime(1, t);
      // Long sweeping siren - 8 seconds total
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      gain.gain.setValueAtTime(0.1, t);
      gain.gain.linearRampToValueAtTime(0.001, t + 8.0);
      
      // Sweep up and down slower
      osc.frequency.setValueAtTime(440, t);
      osc.frequency.linearRampToValueAtTime(880, t + 2.0);
      osc.frequency.linearRampToValueAtTime(440, t + 4.0);
      osc.frequency.linearRampToValueAtTime(880, t + 6.0);
      osc.frequency.linearRampToValueAtTime(440, t + 8.0);
      
      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(t);
      osc.stop(t + 8.0);
      break;

    case 'gong': // Gentle wake up
      masterGain.gain.setValueAtTime(1, t);
      // Low complex gong - 10s decay
      playTone(220, t, 10.0, 'sine', 0.3); // A3
      playTone(329.63, t, 8.0, 'triangle', 0.1); // E4 harmonic
      playTone(440, t, 6.0, 'sine', 0.05); // A4 harmonic
      break;
  }
};