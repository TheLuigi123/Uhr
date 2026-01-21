export type SoundEffect = 'chime' | 'fanfare' | 'warning' | 'alarm' | 'gong';

export interface ClockEvent {
  id: string;
  startMinute: number;
  endMinute: number;
  label: string;
  icon: string;
  color: string;
  textColor: string;
  type: 'range' | 'point';
  soundEffect: SoundEffect;
}

export interface Point {
  x: number;
  y: number;
}