import React, { useEffect, useState, useRef } from 'react';
import { ClockEvent } from '../types';
import { describeArc, minutesToDegrees, polarToCartesian } from '../utils/geometry';
import { playSound } from '../utils/audio';

interface ClockFaceProps {
  events: ClockEvent[];
}

const ClockFace: React.FC<ClockFaceProps> = ({ events }) => {
  const [time, setTime] = useState(new Date());
  // Track the last minute we processed to avoid double-firing alarms in the same minute
  const lastMinuteRef = useRef<number>(-1);

  useEffect(() => {
    // Update every second
    const timer = setInterval(() => {
      const now = new Date();
      setTime(now);
      
      const currentMinute = now.getMinutes();
      
      // Check for alarms (only trigger once per minute, at the start of the minute)
      if (currentMinute !== lastMinuteRef.current) {
        lastMinuteRef.current = currentMinute;
        
        // Find events that END at this minute
        const eventsEndingNow = events.filter(e => e.endMinute === currentMinute);
        
        if (eventsEndingNow.length > 0) {
          // If multiple events end, prioritize 'alarm' > 'warning' > others
          const priority = ['alarm', 'warning', 'fanfare', 'chime', 'gong'];
          
          const eventToPlay = eventsEndingNow.sort((a, b) => {
             return priority.indexOf(a.soundEffect) - priority.indexOf(b.soundEffect);
          })[0];
          
          if (eventToPlay) {
            playSound(eventToPlay.soundEffect);
          }
        }
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [events]);

  // Dimensions
  const size = 600;
  const center = size / 2;
  const radius = size / 2 - 20; // Padding
  const clockRadius = radius - 40;
  
  // Zone Radii
  const zoneOuterRadius = clockRadius - 50; // Where the events sit
  const zoneInnerRadius = 60; // Inner hole size

  // Time calculations
  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours() % 12;

  const minuteAngle = minutes * 6 + seconds * 0.1;
  const hourAngle = hours * 30 + minutes * 0.5;

  // Helper to render event zones
  const renderZone = (event: ClockEvent) => {
    if (event.type !== 'range') return null;

    const startDeg = minutesToDegrees(event.startMinute);
    const endDeg = minutesToDegrees(event.endMinute);
    
    // Calculate middle angle for icon placement
    let midDeg = (startDeg + endDeg) / 2;
    if (event.endMinute < event.startMinute) {
       // Handle crossing 12 o'clock (e.g., 40 to 05)
       const adjustedEnd = endDeg + 360;
       midDeg = (startDeg + adjustedEnd) / 2;
    }

    const pathData = describeArc(center, center, zoneInnerRadius, zoneOuterRadius, startDeg, endDeg);
    
    // Icon position
    const iconPos = polarToCartesian(center, center, (zoneInnerRadius + zoneOuterRadius) / 2, midDeg);
    
    const fontSize = event.icon.length > 5 ? "32" : "42";

    return (
      <g 
        key={event.id} 
        className="transition-opacity duration-500 hover:opacity-80 cursor-pointer"
        onClick={() => playSound(event.soundEffect)}
      >
        <title>Klicken für Ton-Test ({event.soundEffect})</title>
        <path d={pathData} fill={event.color} stroke="white" strokeWidth="2" />
        <text
          x={iconPos.x}
          y={iconPos.y + (event.icon.length > 5 ? 8 : 10)} 
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={fontSize}
          className="select-none pointer-events-none filter drop-shadow-md"
        >
          {event.icon}
        </text>
      </g>
    );
  };

  const renderPointEvent = (event: ClockEvent) => {
      if (event.type !== 'point') return null;
      const deg = minutesToDegrees(event.startMinute);
      
      const isLeave = event.id === 'leave';
      const offset = isLeave ? 45 : 25; 
      const circleSize = isLeave ? 40 : 28;
      const fontSize = isLeave ? 32 : 24;
      
      const pos = polarToCartesian(center, center, zoneOuterRadius + offset, deg);
      
      return (
          <g 
            key={event.id} 
            className="cursor-pointer hover:scale-110 transition-transform"
            onClick={() => playSound(event.soundEffect)}
          >
               <title>Klicken für Ton-Test ({event.soundEffect})</title>
               <line 
                x1={center} y1={center} 
                x2={pos.x} y2={pos.y} 
                stroke={event.color} 
                strokeWidth={isLeave ? "6" : "4"} 
                strokeDasharray="4 4"
                className="opacity-50 pointer-events-none"
               />
               {isLeave && (
                 <circle cx={pos.x} cy={pos.y} r={circleSize + 5} fill="none" stroke={event.color} strokeWidth="2" className="animate-pulse pointer-events-none" />
               )}
               <circle cx={pos.x} cy={pos.y} r={circleSize} fill="white" stroke={event.color} strokeWidth={isLeave ? "4" : "3"} />
               <text
                x={pos.x}
                y={pos.y + 2}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={fontSize}
                className="select-none"
               >
               {event.icon}
               </text>
          </g>
      )
  };

  // Generate Hour Markers
  const hourMarkers = Array.from({ length: 12 }, (_, i) => {
    const num = i + 1;
    const angle = num * 30;
    const pos = polarToCartesian(center, center, clockRadius, angle);
    return (
      <text
        key={num}
        x={pos.x}
        y={pos.y}
        fill="#374151"
        fontSize="48"
        fontWeight="bold"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        {num}
      </text>
    );
  });

  // Generate Minute Markers
  const minuteMarkers = Array.from({ length: 60 }, (_, i) => {
      if (i % 5 === 0) return null;
      const angle = i * 6;
      const pos = polarToCartesian(center, center, clockRadius, angle);
      return (
          <circle key={i} cx={pos.x} cy={pos.y} r="3" fill="#9CA3AF" />
      )
  });

  return (
    <div className="relative w-full h-full max-w-[90vh] max-h-[90vh] aspect-square mx-auto">
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="w-full h-full drop-shadow-2xl"
      >
        {/* Clock Frame */}
        <circle cx={center} cy={center} r={radius} fill="white" stroke="#E5E7EB" strokeWidth="15" />
        
        {/* Zones (Bottom Layer) */}
        {events.filter(e => e.type === 'range').map(renderZone)}
        
        {/* Ticks & Numbers */}
        {minuteMarkers}
        {hourMarkers}

        {/* Point Events (Top Layer) */}
        {events.filter(e => e.type === 'point').map(renderPointEvent)}

        {/* Clock Center Dot */}
        <circle cx={center} cy={center} r="12" fill="#1F2937" />

        {/* Hour Hand */}
        <line
          x1={center}
          y1={center}
          x2={center}
          y2={center - (clockRadius * 0.6)}
          stroke="#1F2937"
          strokeWidth="12"
          strokeLinecap="round"
          transform={`rotate(${hourAngle}, ${center}, ${center})`}
        />

        {/* Minute Hand */}
        <line
          x1={center}
          y1={center}
          x2={center}
          y2={center - (clockRadius * 0.95)}
          stroke="#4B5563"
          strokeWidth="8"
          strokeLinecap="round"
          transform={`rotate(${minuteAngle}, ${center}, ${center})`}
        />

        {/* Center Pin */}
        <circle cx={center} cy={center} r="6" fill="#9CA3AF" />

      </svg>
    </div>
  );
};

export default ClockFace;