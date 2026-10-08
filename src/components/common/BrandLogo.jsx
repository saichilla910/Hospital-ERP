import React from 'react';

const sizeMap = {
  24: 'w-6 h-6 rounded-md',
  26: 'w-[26px] h-[26px] rounded-md',
  28: 'w-7 h-7 rounded-md',
  32: 'w-8 h-8 rounded-lg',
  36: 'w-9 h-9 rounded-lg',
  38: 'w-[38px] h-[38px] rounded-lg',
  40: 'w-10 h-10 rounded-lg',
  48: 'w-12 h-12 rounded-lg'
};

export const BrandLogo = ({ size = 38, className = '' }) => {
  const sizeClass = sizeMap[size] || 'w-[38px] h-[38px] rounded-lg';

  return (
    <div
      className={`flex items-center justify-center shadow-[0_4px_16px_rgba(37,99,235,0.35)] shrink-0 relative overflow-hidden bg-gradient-to-br from-[#1e40af] via-[#2563eb] to-[#3b82f6] ${sizeClass} ${className}`}
    >
      {/* Subtle shine glass overlay */}
      <div className="absolute -top-[40%] -left-[40%] w-[180%] h-[180%] bg-[radial-gradient(circle,rgba(255,255,255,0.3)_0%,rgba(255,255,255,0)_65%)] pointer-events-none" />

      {/* CarePulse Dynamic Shield, Cross & Lifeline ECG SVG */}
      <svg
        width={size * 0.68}
        height={size * 0.68}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="carepulse-grad" x1="2" y1="12" x2="22" y2="12" gradientUnits="userSpaceOnUse">
            <stop stopColor="#ffffff" />
            <stop offset="0.45" stopColor="#bfdbfe" />
            <stop offset="0.75" stopColor="#60a5fa" />
            <stop offset="1" stopColor="#ffffff" />
          </linearGradient>
          <filter id="carepulse-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1" stdDeviation="0.8" floodColor="rgba(0,0,0,0.25)" />
          </filter>
        </defs>

        {/* Outer Protective Shield Emblem */}
        <path
          d="M12 2.5C7.2 4.2 4 4.8 4 9C4 15.2 8.5 19.8 12 21.5C15.5 19.8 20 15.2 20 9C20 4.8 16.8 4.2 12 2.5Z"
          fill="rgba(255, 255, 255, 0.22)"
          stroke="#ffffff"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />

        {/* Clean Center Healthcare Cross */}
        <path
          d="M10 6.5C10 5.95 10.45 5.5 11 5.5H13C13.55 5.5 14 5.95 14 6.5V9H16.5C17.05 9 17.5 9.45 17.5 10V12C17.5 12.55 17.05 13 16.5 13H14V15.5C14 16.05 13.55 16.5 13 16.5H11C10.45 16.5 10 16.05 10 15.5V13H7.5C6.95 13 6.5 12.55 6.5 12V10C6.5 9.45 6.95 9 7.5 9H10V6.5Z"
          fill="#ffffff"
          opacity="0.92"
        />

        {/* Luminous ECG Heartbeat Line Across Center */}
        <path
          d="M3.5 11H7L8.8 7.5L11.8 16.5L14.2 9L15.8 12H20.5"
          stroke="url(#carepulse-grad)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#carepulse-glow)"
        />

        {/* Pulse Radiant Dot */}
        <circle cx="11.8" cy="16.5" r="1.2" fill="#38bdf8" />
      </svg>
    </div>
  );
};
