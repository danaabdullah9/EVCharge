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
  
  // Generate SVG for avatar fallback with modern Saudi-themed female character in abaya
  const generateSaudiAvatarSvg = (initial: string) => {
    // Colors
    const primaryColor = '#006c35'; // Saudi green
    const secondaryColor = '#ffffff'; // White
    const abayaColor = '#222222'; // Dark color for abaya
    const skinTone = '#f9d3a5'; // Warm skin tone
    const thirdColor = '#f0f0f0'; // Light gray for background
    const accentColor = '#8d0000'; // Accent color (dark red)
    
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <!-- Background - gradient circle -->
        <circle cx="50" cy="50" r="50" fill="${thirdColor}" />
        
        <!-- Saudi green bottom accent -->
        <path d="M0,80 L100,80 L100,100 L0,100 Z" fill="${primaryColor}" opacity="0.3" />
        <path d="M0,85 L100,85 L100,95 L0,95 Z" fill="${primaryColor}" opacity="0.6" />
        
        <!-- Abaya outline - upper body -->
        <path d="M25,58 C25,75 35,90 50,90 C65,90 75,75 75,58 L75,40 C75,25 65,15 50,15 C35,15 25,25 25,40 Z" fill="${abayaColor}" />
        
        <!-- Face - small oval within the abaya -->
        <ellipse cx="50" cy="35" rx="18" ry="20" fill="${skinTone}" />
        
        <!-- Shayla/hijab -->
        <path d="M50,15 C35,15 28,25 28,35 C28,45 32,55 50,55 C68,55 72,45 72,35 C72,25 65,15 50,15 Z" fill="${abayaColor}" />
        
        <!-- Abaya front detail -->
        <path d="M45,55 L45,85 L55,85 L55,55 Z" fill="${abayaColor}" opacity="0.7" />
        
        <!-- Modern cartoon-style features -->
        <ellipse cx="43" cy="35" rx="2.5" ry="3.5" fill="#333333" /> <!-- Left eye -->
        <ellipse cx="57" cy="35" rx="2.5" ry="3.5" fill="#333333" /> <!-- Right eye -->
        
        <!-- Eyebrows - more feminine style -->
        <path d="M38,30 C40,28 46,29 48,31" fill="none" stroke="#333333" stroke-width="1.5" stroke-linecap="round" />
        <path d="M62,30 C60,28 54,29 52,31" fill="none" stroke="#333333" stroke-width="1.5" stroke-linecap="round" />
        
        <!-- Smile - gentle smile -->
        <path d="M42,42 C46,46 54,46 58,42" fill="none" stroke="#333333" stroke-width="1.5" stroke-linecap="round" />
        
        <!-- Saudi flag-inspired decoration on abaya -->
        <path d="M40,65 L60,65 L60,70 L40,70 Z" fill="${primaryColor}" opacity="0.5" />
        
        <!-- Traditional pattern detail at bottom of abaya -->
        <path d="M30,80 L70,80 L70,85 L30,85 Z" fill="${primaryColor}" opacity="0.3" />
        
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