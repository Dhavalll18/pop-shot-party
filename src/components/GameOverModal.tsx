
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface GameOverModalProps {
  score: number;
  onRestart: () => void;
  isVisible: boolean;
}

const GameOverModal: React.FC<GameOverModalProps> = ({ score, onRestart, isVisible }) => {
  if (!isVisible) return null;
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
      <Card className="w-full max-w-md animate-fade-in bg-white">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-purple-700">Game Over!</CardTitle>
          <CardDescription>You popped as many bubbles as you could.</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-4xl font-bold mb-4">{score}</p>
          <p className="text-gray-600">Final Score</p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={onRestart} className="bg-purple-600 hover:bg-purple-700">
            Play Again
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default GameOverModal;
