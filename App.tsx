import React from 'react';
import ClockFace from './components/ClockFace';
import Legend from './components/Legend';
import { MORNING_EVENTS } from './constants';

const App: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center p-4 overflow-hidden font-sans">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none opacity-30">
        <div className="absolute top-0 left-0 w-64 h-64 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative w-full max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-8 items-center h-[90vh]">
        
        {/* Left Side: Clock (Takes up 2 cols on large screens) */}
        <div className="lg:col-span-2 w-full flex justify-center items-center h-full">
          <ClockFace events={MORNING_EVENTS} />
        </div>

        {/* Right Side: Legend/Info (Takes up 1 col) */}
        <div className="hidden lg:block h-full max-h-[600px]">
           <Legend events={MORNING_EVENTS} />
        </div>

        {/* Mobile/Small Tablet Warning: If screen is too small/portrait, we just show clock. 
            The requirements asked for tablet horizontal optimization, so the split view works best. 
            On smaller screens, the legend might push below or hide. */}
      </div>

      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default App;