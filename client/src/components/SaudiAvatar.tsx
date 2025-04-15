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
    const secondaryColor = '#ffffff'; // White
    const accentColor = '#8d0000'; // Dark red for agal (headband)
    const skinTone = '#ffe0b2'; // Light skin tone
    
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <!-- Background -->
        <rect width="100" height="100" fill="${primaryColor}" />
        
        <!-- Saudi flag sword symbol -->
        <path d="M20,85 L80,85 L80,80 L20,80 Z" fill="${secondaryColor}" />
        <path d="M50,75 L50,85 L55,85 L55,75 Z" fill="${secondaryColor}" />
        
        <!-- Traditional Saudi geometric pattern border -->
        <rect x="5" y="5" width="90" height="90" rx="10" ry="10" fill="none" stroke="${secondaryColor}" stroke-width="2" />
        <rect x="10" y="10" width="80" height="80" rx="5" ry="5" fill="none" stroke="${secondaryColor}" stroke-width="1" />
        
        <!-- Saudi man with traditional ghutra and agal -->
        <circle cx="50" cy="48" r="22" fill="${skinTone}" /> <!-- Face -->
        
        <!-- Ghutra (headdress) -->
        <path d="M50,20 C30,20 25,35 25,45 C25,55 30,65 50,65 C70,65 75,55 75,45 C75,35 70,20 50,20 Z" fill="${secondaryColor}" />
        
        <!-- Agal (headband) -->
        <path d="M28,35 C28,35 40,30 50,30 C60,30 72,35 72,35 C72,35 65,25 50,25 C35,25 28,35 28,35 Z" fill="${accentColor}" />
        <path d="M25,36 C25,36 40,32 50,32 C60,32 75,36 75,36" fill="none" stroke="${accentColor}" stroke-width="3" />
        
        <!-- Stylized beard -->
        <path d="M40,55 C40,65 50,70 50,70 C50,70 60,65 60,55" fill="none" stroke="#5e3200" stroke-width="1" />
        
        <!-- Saudi national dress suggestion at bottom -->
        <path d="M30,70 L70,70 L70,90 L30,90 Z" fill="${secondaryColor}" />
        <path d="M45,70 L55,70 L55,90 L45,90 Z" fill="${primaryColor}" opacity="0.3" />
        
        <!-- Initial text -->
        <text x="50" y="53" font-family="Arial, sans-serif" font-size="18" 
          font-weight="bold" fill="#000" text-anchor="middle" dominant-baseline="middle">
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