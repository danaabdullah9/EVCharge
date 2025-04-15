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
  
  // Generate SVG for avatar fallback with modern cartoon-style Saudi character
  const generateSaudiAvatarSvg = (initial: string) => {
    // Colors
    const primaryColor = '#006c35'; // Saudi green
    const secondaryColor = '#ffffff'; // White
    const accentColor = '#000000'; // Black for agal (headband)
    const skinTone = '#f9d3a5'; // Warm skin tone
    const thirdColor = '#f0f0f0'; // Light gray
    const fourthColor = '#e0e0e0'; // Darker gray
    
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <!-- Background - gradient circle -->
        <circle cx="50" cy="50" r="50" fill="${thirdColor}" />
        
        <!-- Modern styled background pattern -->
        <path d="M0,80 L100,80 L100,100 L0,100 Z" fill="${primaryColor}" opacity="0.3" />
        <path d="M0,85 L100,85 L100,95 L0,95 Z" fill="${primaryColor}" opacity="0.6" />
        
        <!-- Face - modern cartoon style -->
        <circle cx="50" cy="45" r="30" fill="${skinTone}" />
        
        <!-- Modern Saudi headdress (shemagh) -->
        <path d="M50,15 C25,15 20,35 20,45 C20,55 25,70 50,70 C75,70 80,55 80,45 C80,35 75,15 50,15 Z" fill="${secondaryColor}" />
        
        <!-- Modern cartoon-style features -->
        <ellipse cx="43" cy="43" rx="3" ry="4" fill="#333333" /> <!-- Left eye -->
        <ellipse cx="57" cy="43" rx="3" ry="4" fill="#333333" /> <!-- Right eye -->
        
        <!-- Eyebrows -->
        <path d="M38,37 C40,35 46,36 48,38" fill="none" stroke="#333333" stroke-width="1.5" stroke-linecap="round" />
        <path d="M62,37 C60,35 54,36 52,38" fill="none" stroke="#333333" stroke-width="1.5" stroke-linecap="round" />
        
        <!-- Smile -->
        <path d="M40,55 C45,61 55,61 60,55" fill="none" stroke="#333333" stroke-width="1.5" stroke-linecap="round" />
        
        <!-- Modern agal (headband) -->
        <path d="M20,35 C35,25 65,25 80,35" fill="none" stroke="${accentColor}" stroke-width="4" />
        <path d="M22,31 C35,21 65,21 78,31" fill="none" stroke="${accentColor}" stroke-width="4" />
        
        <!-- Saudi flag-inspired decoration -->
        <rect x="15" y="87" width="70" height="6" rx="3" ry="3" fill="${primaryColor}" />
        <path d="M45,87 L55,87 L55,93 L45,93 Z" fill="${secondaryColor}" />
        
        <!-- Subtle pattern on headdress -->
        <path d="M30,25 L70,25 L70,30 L30,30 Z" fill="${fourthColor}" opacity="0.1" />
        
        <!-- Initial styling at bottom -->
        <circle cx="50" cy="80" r="10" fill="${primaryColor}" />
        <text x="50" y="84" font-family="Arial, sans-serif" font-size="12" 
          font-weight="bold" fill="${secondaryColor}" text-anchor="middle" dominant-baseline="middle">
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