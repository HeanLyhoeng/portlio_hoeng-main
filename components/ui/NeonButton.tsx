import React from 'react';
import { motion } from 'framer-motion';

interface NeonButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  onClick?: () => void;
  className?: string;
  href?: string;
}

export const NeonButton: React.FC<NeonButtonProps> = ({ 
  children, 
  variant = 'primary', 
  onClick, 
  className = '',
  href
}) => {
  // Apple-style base styles: rounded-full, smooth transitions, active scale
  const baseStyles = "relative px-8 py-3 font-medium tracking-normal text-base transition-all duration-300 ease-in-out rounded-full overflow-hidden group active:scale-95";
  
  const variants = {
    primary: "bg-white text-black hover:opacity-90 hover:shadow-lg",
    secondary: "bg-transparent border border-white/30 text-white hover:bg-white hover:text-black hover:border-white",
    outline: "bg-transparent border border-white text-white hover:bg-white hover:text-black"
  };

  const Component = href ? motion.a : motion.button;
  
  // If it's an anchor, we add href prop. If button, onClick.
  const props = href ? { href, onClick, target: href?.startsWith('http') ? '_blank' : undefined, rel: href?.startsWith('http') ? 'noopener noreferrer' : undefined } : { onClick };

  return (
    <Component
      {...props}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </Component>
  );
};