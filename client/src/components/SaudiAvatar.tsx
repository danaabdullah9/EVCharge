import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface SaudiAvatarProps {
  username?: string | null;
  profileImage?: string | null;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const SaudiAvatar: React.FC<SaudiAvatarProps> = ({ 
  username, 
  profileImage, 
  size = 'md',
  className = '' 
}) => {
  // Size mappings
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };
  
  // Generate SVG for avatar fallback with Saudi-themed colors and design
  const generateSaudiAvatarSvg = (initial: string) => {
    // Saudi flag colors
    const primaryColor = '#006c35'; // Saudi green
    const textColor = '#ffffff';
    
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <rect width="100" height="100" fill="${primaryColor}" />
        
        <!-- Traditional Saudi pattern (Sadu weaving inspired) -->
        <rect x="0" y="70" width="100" height="6" fill="#00562b" />
        <rect x="0" y="82" width="100" height="6" fill="#00562b" />
        <rect x="0" y="76" width="100" height="6" fill="#004020" />
        
        <!-- Curved headdress (shemagh) shape -->
        <path d="M50,20 C30,20 20,35 20,50 C20,65 30,75 50,75 C70,75 80,65 80,50 C80,35 70,20 50,20 Z" fill="#f8f8f8" />
        
        <!-- Face area -->
        <circle cx="50" cy="50" r="20" fill="#ffe0b2" />
        
        <!-- Saudi headdress (shemagh) accent -->
        <path d="M50,30 C40,30 35,40 35,50 C35,60 40,65 50,65 C60,65 65,60 65,50 C65,40 60,30 50,30 Z" fill="#f8f8f8" />
        <path d="M30,30 L70,30 L70,40 L30,40 Z" fill="#c80000" opacity="0.2" />
        
        <!-- Initial text -->
        <text x="50" y="55" font-family="Arial, sans-serif" font-size="24" 
          font-weight="bold" fill="${textColor}" text-anchor="middle" dominant-baseline="middle">
          ${initial}
        </text>
      </svg>
    `;
  };
  
  // Get initial from username
  const getInitial = () => {
    if (!username) return '?';
    return username.charAt(0).toUpperCase();
  };

  // Create data URL for SVG
  const getSvgUrl = () => {
    const initial = getInitial();
    const svgContent = generateSaudiAvatarSvg(initial);
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgContent)}`;
  };

  return (
    <Avatar className={`${sizeClasses[size]} ${className}`}>
      <AvatarImage src={profileImage || getSvgUrl()} alt={username || 'User'} />
      <AvatarFallback 
        className="bg-gradient-to-br from-green-600 to-green-800 text-white"
        style={{ backgroundImage: `url(${getSvgUrl()})` }}
      >
        {getInitial()}
      </AvatarFallback>
    </Avatar>
  );
};

export default SaudiAvatar;