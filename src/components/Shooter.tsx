
import React, { useState, useRef, useEffect } from 'react';
import Bubble, { BUBBLE_COLORS, BubbleColor } from './Bubble';
import { ArrowUp } from 'lucide-react';

interface ShooterProps {
  onShoot: (angle: number, color: BubbleColor) => void;
  nextColor: BubbleColor;
  canShoot: boolean;
}

const Shooter: React.FC<ShooterProps> = ({ onShoot, nextColor, canShoot }) => {
  const [angle, setAngle] = useState<number>(0);
  const shooterRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!shooterRef.current || !canShoot) return;
    
    const rect = shooterRef.current.getBoundingClientRect();
    const shooterCenterX = rect.left + rect.width / 2;
    const shooterCenterY = rect.top + rect.height - 20;
    
    const deltaX = e.clientX - shooterCenterX;
    const deltaY = shooterCenterY - e.clientY;
    
    // Calculate angle in radians, then convert to degrees
    let newAngle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
    
    // Restrict angle between -80 and 80 degrees
    newAngle = Math.max(-80, Math.min(80, newAngle));
    
    setAngle(newAngle);
  };

  const handleShoot = () => {
    if (canShoot) {
      onShoot(angle, nextColor);
    }
  };

  return (
    <div 
      className="relative w-full h-24 flex items-center justify-center"
      onMouseMove={handleMouseMove}
      onClick={handleShoot}
      ref={shooterRef}
    >
      <div className="absolute bottom-0 left-1/2 -ml-6">
        <div 
          className="relative w-12 h-12 flex items-center justify-center bg-gray-300 rounded-full shadow-md"
          style={{
            transform: `rotate(${90 - angle}deg)`,
            transformOrigin: 'center bottom'
          }}
        >
          <ArrowUp className="text-gray-700" size={24} />
        </div>
        
        <div className="absolute -top-12 left-1/2 -ml-5">
          <Bubble
            color={nextColor}
            row={-1}
            col={-1}
            size={40}
            className="fade-in"
          />
        </div>
      </div>
    </div>
  );
};

export default Shooter;
