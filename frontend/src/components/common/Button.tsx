/**
 * Button - Reusable button component with variants
 */

import { LucideIcon } from 'lucide-react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  icon?: LucideIcon;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export function Button({ 
  children, 
  onClick, 
  variant = 'primary', 
  icon: Icon,
  className = '',
  type = 'button'
}: ButtonProps) {
  const baseStyles = 'px-4 py-2.5 rounded-lg flex items-center gap-2 transition-all duration-200 whitespace-nowrap';
  
  const variantStyles = {
    primary: 'bg-[#2AB7CA] text-white hover:bg-[#239BAA]',
    secondary: 'bg-[#E2E0EA] text-[#1F1B2E] hover:bg-[#C9C7D3]',
    ghost: 'bg-transparent text-[#2AB7CA] hover:bg-[#F7F6FB]',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      style={{ fontSize: '14px', fontWeight: 500 }}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </button>
  );
}
