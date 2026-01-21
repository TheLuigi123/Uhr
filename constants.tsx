import { ClockEvent } from './types';

// Palette: Bright, distinct pastel colors for kids
export const MORNING_EVENTS: ClockEvent[] = [
  // 25-40 Klo gehen, anziehen, Bett machen
  {
    id: 'routine',
    startMinute: 25,
    endMinute: 40,
    label: 'Bad & Bett',
    icon: '🚽 🛏️ 👕', 
    color: '#93C5FD', // Blue-300
    textColor: '#1E3A8A',
    type: 'range',
    soundEffect: 'chime', // Ends at 40 -> Time for breakfast
  },
  // 40-05 Frühstück
  {
    id: 'breakfast',
    startMinute: 40,
    endMinute: 5, // Crosses 60
    label: 'Frühstück',
    icon: '🥣 🥛 🍎',
    color: '#FCD34D', // Amber-300
    textColor: '#78350F',
    type: 'range',
    soundEffect: 'fanfare', // Ends at 05 -> Time for hygiene
  },
  // 05-17 Zähne Putze, Haare frisieren
  {
    id: 'teeth',
    startMinute: 5,
    endMinute: 17,
    label: 'Pflege',
    icon: '🪥 💇‍♀️ 🚿',
    color: '#86EFAC', // Green-300
    textColor: '#14532D',
    type: 'range',
    soundEffect: 'warning', // Ends at 17 -> Hurry, shoes!
  },
  // 17-25 Anziehen (Shoes)
  {
    id: 'shoes',
    startMinute: 17,
    endMinute: 25,
    label: 'Schuhe an',
    icon: '👟 🎒',
    color: '#FCA5A5', // Red-300
    textColor: '#7F1D1D',
    type: 'range',
    soundEffect: 'alarm', // Ends at 25 -> LEAVE NOW
  },
  // Point events
  {
    id: 'wakeup',
    startMinute: 25,
    endMinute: 25,
    label: 'Aufwachen',
    icon: '☀️',
    color: '#FDBA74', // Orange
    textColor: 'black',
    type: 'point',
    soundEffect: 'gong',
  },
  {
    id: 'leave',
    startMinute: 25,
    endMinute: 25,
    label: 'Losgehen',
    icon: '🏃💨',
    color: '#EF4444', // Red-500
    textColor: 'white',
    type: 'point',
    soundEffect: 'alarm',
  },
];