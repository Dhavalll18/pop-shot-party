
import React from 'react';
import { Button } from '@/components/ui/button';
import { Pause, Play, RefreshCw } from 'lucide-react';

interface GameControlsProps {
  score: number;
  isGameOver: boolean;
  isPaused: boolean;
  onTogglePause: () => void;
  onRestart: () => void;
}

const GameControls: React.FC<GameControlsProps> = ({ 
  score, 
  isGameOver, 
  isPaused,
  onTogglePause, 
  onRestart 
}) => {
  return (
    <div className="flex justify-between items-center p-4">
      <div className="flex flex-col">
        <h2 className="text-2xl font-bold text-purple-700">Score</h2>
        <p className="text-3xl font-bold">{score}</p>
      </div>
      
      <div className="flex gap-2">
        {!isGameOver && (
          <Button 
            variant="outline" 
            size="icon" 
            onClick={onTogglePause}
            className="bg-white hover:bg-gray-100"
          >
            {isPaused ? <Play size={20} /> : <Pause size={20} />}
          </Button>
        )}
        
        <Button 
          variant="outline" 
          size="icon" 
          onClick={onRestart}
          className="bg-white hover:bg-gray-100"
        >
          <RefreshCw size={20} />
        </Button>
      </div>
    </div>
  );
};

export default GameControls;
