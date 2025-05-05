
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export type BubbleColor = 'red' | 'blue' | 'green' | 'yellow' | 'purple';

export const BUBBLE_COLORS: BubbleColor[] = ['red', 'blue', 'green', 'yellow', 'purple'];

const colorStyles: Record<BubbleColor, string> = {
  red: 'bg-gradient-to-br from-red-400 to-red-500 shadow-red-500/50',
  blue: 'bg-gradient-to-br from-blue-400 to-blue-500 shadow-blue-500/50',
  green: 'bg-gradient-to-br from-green-400 to-green-500 shadow-green-500/50',
  yellow: 'bg-gradient-to-br from-yellow-400 to-yellow-500 shadow-yellow-500/50',
  purple: 'bg-gradient-to-br from-purple-400 to-purple-500 shadow-purple-500/50'
};

interface BubbleProps {
  color: BubbleColor;
  row: number;
  col: number;
  size?: number;
  isPopping?: boolean;
  onClick?: () => void;
  floating?: boolean;
  className?: string;
}

const Bubble: React.FC<BubbleProps> = ({
  color,
  row,
  col,
  size = 40,
  isPopping = false,
  onClick,
  floating = false,
  className = ''
}) => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div
      className={cn(
        'rounded-full shadow-md transition-transform duration-300 ease-in-out',
        colorStyles[color],
        isPopping ? 'bubble-pop' : '',
        floating ? 'bubble-bounce' : '',
        !mounted ? 'scale-0' : 'scale-100',
        'cursor-pointer',
        className
      )}
      style={{
        width: `${size}px`,
        height: `${size}px`,
      }}
      onClick={onClick}
    >
      <div className="absolute inset-0 rounded-full bg-white/30 w-1/3 h-1/3 top-1 left-1.5"></div>
    </div>
  );
};

export default Bubble;
