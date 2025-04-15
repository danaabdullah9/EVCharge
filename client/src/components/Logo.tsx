import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Logo: React.FC<LogoProps> = ({ className = '', size = 'md' }) => {
  const sizeMap = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const sizeClass = sizeMap[size];

  return (
    <div className={`relative ${sizeClass} ${className}`}>
      {/* Background Circle with Saudi Green */}
      <svg viewBox="0 0 100 100" className="absolute top-0 left-0 w-full h-full">
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0d9f61" />
            <stop offset="100%" stopColor="#046c41" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#logoGradient)" />
        
        {/* Charging Bolt */}
        <path 
          d="M50 20 L35 50 L48 50 L45 80 L65 45 L52 45 L58 20 Z" 
          fill="white" 
          stroke="white" 
          strokeWidth="1" 
        />
        
        {/* Palm Tree Silhouette - Saudi Symbol */}
        <path 
          d="M60 25 C70 20, 80 30, 75 35 C85 30, 80 40, 75 42 C75 25, 70 35, 65 30 Z" 
          fill="rgba(255,255,255,0.7)" 
        />
      </svg>
    </div>
  );
};

export default Logo;