import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'text';
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '',
  ...props 
}) => {
  // 基礎樣式：圓角、對齊、焦點與動畫
  const baseStyle = "inline-flex items-center justify-center rounded-2xl text-sm font-bold tracking-wider transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent_hover focus-visible:ring-offset-2 focus-visible:ring-offset-bg active:scale-95";
  
  const variants = {
    // 1) Primary: 品牌主色實心按鈕
    primary: "bg-accent text-dark hover:bg-accent_hover shadow-sm px-6 py-3.5",
    
    // 2) Ghost (Outlined Ghost): 透明底、淡邊框、明確 hit area
    ghost: "border border-olive_border text-olive_muted bg-transparent hover:bg-surface/10 hover:text-ink hover:border-olive_hint px-6 py-3.5",
    
    // 3) Text (Link Action): 低存在感、無邊框、較小 padding
    text: "text-olive_muted hover:text-ink px-3 py-1.5 bg-transparent hover:bg-surface/5 rounded-lg",
  };

  const widthStyle = fullWidth ? "w-full" : "";

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${widthStyle} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;