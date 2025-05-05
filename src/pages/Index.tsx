
import React from 'react';
import Shooter from '@/components/Shooter';
import Grid from '@/components/Grid';
import GameControls from '@/components/GameControls';
import GameOverModal from '@/components/GameOverModal';
import { useBubbleGame } from '@/hooks/useBubbleGame';

const Index = () => {
  const {
    grid,
    currentBubble,
    score,
    isGameOver,
    isPaused,
    poppingBubbles,
    shootBubble,
    resetGame,
    togglePause,
    handleGridUpdated
  } = useBubbleGame();

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-blue-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
        <h1 className="text-3xl font-bold text-center p-4 bg-gradient-to-r from-purple-600 to-blue-500 text-white">
          Pop Shot Party
        </h1>
        
        <GameControls 
          score={score} 
          isGameOver={isGameOver} 
          isPaused={isPaused}
          onTogglePause={togglePause} 
          onRestart={resetGame} 
        />
        
        <div className="px-2 pb-2">
          <Grid 
            grid={grid} 
            poppingBubbles={poppingBubbles}
            onGridUpdated={handleGridUpdated}
          />
        </div>
        
        <Shooter 
          onShoot={shootBubble} 
          nextColor={currentBubble} 
          canShoot={!isGameOver && !isPaused} 
        />
      </div>
      
      <div className="mt-6 text-center text-gray-600">
        <p className="text-sm">Click to shoot bubbles. Match 3+ of the same color!</p>
      </div>
      
      <GameOverModal 
        score={score} 
        onRestart={resetGame} 
        isVisible={isGameOver}
      />
    </div>
  );
};

export default Index;
