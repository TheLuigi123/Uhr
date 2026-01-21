import React from 'react';
import { ClockEvent } from '../types';

interface LegendProps {
  events: ClockEvent[];
}

const Legend: React.FC<LegendProps> = ({ events }) => {
  // Sort by execution order starting from minute 25 (Start of cycle)
  const sortedEvents = [...events].sort((a, b) => {
     if (a.id === 'wakeup') return -1;
     if (b.id === 'wakeup') return 1;
     
     let startA = a.startMinute < 25 ? a.startMinute + 60 : a.startMinute;
     let startB = b.startMinute < 25 ? b.startMinute + 60 : b.startMinute;
     
     if (a.id === 'leave') return 1;
     if (b.id === 'leave') return -1;

     return startA - startB;
  });

  return (
    <div className="flex flex-col gap-4 p-6 bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl h-full overflow-y-auto border border-white/50">
      <h2 className="text-2xl font-bold text-gray-700 mb-2 text-center">Dein Morgen ☀️</h2>
      <div className="space-y-3">
        {sortedEvents.map((evt) => (
           <div key={evt.id} className="flex items-center gap-3 p-2 rounded-xl transition-transform hover:scale-105" style={{ backgroundColor: evt.type === 'range' ? `${evt.color}40` : 'transparent' }}>
             <div 
                className="w-14 h-14 flex items-center justify-center rounded-full text-2xl shadow-sm border-2 border-white shrink-0"
                style={{ backgroundColor: evt.color }}
             >
               <span className="text-xl">{evt.icon}</span>
             </div>
             <div className="flex flex-col">
                <span className="text-lg font-bold text-gray-800 leading-tight">
                    {evt.type === 'range' ? 
                        `${evt.startMinute.toString().padStart(2, '0')} - ${evt.endMinute.toString().padStart(2, '0')}` : 
                        `${evt.startMinute.toString().padStart(2, '0')}`
                    }
                </span>
                <span className="text-gray-600 font-medium leading-tight text-sm">
                    {evt.id === 'routine' && "Klo, anziehen, Bett"}
                    {evt.id === 'breakfast' && "Frühstück essen"}
                    {evt.id === 'teeth' && "Zähne & Haare"}
                    {evt.id === 'shoes' && "Schuhe anziehen"}
                    {evt.id === 'wakeup' && "Aufwachen!"}
                    {evt.id === 'leave' && "Los zur Schule!"}
                </span>
             </div>
           </div>
        ))}
      </div>
    </div>
  );
};

export default Legend;