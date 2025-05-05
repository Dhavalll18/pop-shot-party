
import React, { useState, useEffect } from 'react';
import Bubble, { BubbleColor } from './Bubble';

interface GridProps {
  grid: (BubbleColor | null)[][];
  poppingBubbles: { row: number; col: number }[];
  onGridUpdated: () => void;
}

const Grid: React.FC<GridProps> = ({ grid, poppingBubbles, onGridUpdated }) => {
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    if (poppingBubbles.length > 0) {
      const timer = setTimeout(() => {
        setAnimationComplete(true);
      }, 300); // Match with pop animation duration
      
      return () => clearTimeout(timer);
    }
  }, [poppingBubbles]);

  useEffect(() => {
    if (animationComplete) {
      onGridUpdated();
      setAnimationComplete(false);
    }
  }, [animationComplete, onGridUpdated]);

  const getBubbleOffset = (row: number): number => {
    // Offset every other row to create the hexagonal grid effect
    return row % 2 === 0 ? 0 : 20;
  };

  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-b from-blue-50 to-purple-100 rounded-lg shadow-inner p-2">
      {grid.map((row, rowIndex) => (
        <div 
          key={`row-${rowIndex}`} 
          className="flex"
          style={{ marginLeft: `${getBubbleOffset(rowIndex)}px` }}
        >
          {row.map((color, colIndex) => (
            <div 
              key={`bubble-${rowIndex}-${colIndex}`}
              className="relative m-0.5"
              style={{ width: '40px', height: '40px' }}
            >
              {color && (
                <Bubble 
                  color={color} 
                  row={rowIndex} 
                  col={colIndex}
                  isPopping={poppingBubbles.some(
                    bubble => bubble.row === rowIndex && bubble.col === colIndex
                  )}
                />
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Grid;
