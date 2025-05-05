import { useState, useCallback, useEffect } from 'react';
import { BubbleColor, BUBBLE_COLORS } from '@/components/Bubble';
import { useToast } from '@/components/ui/use-toast';

// Number of rows and columns in the grid
const ROWS = 10;
const COLS = 10;

// Generate random color
const getRandomColor = (): BubbleColor => {
  return BUBBLE_COLORS[Math.floor(Math.random() * BUBBLE_COLORS.length)];
};

// Create initial grid with some random bubbles
const createInitialGrid = (): (BubbleColor | null)[][] => {
  const grid: (BubbleColor | null)[][] = [];
  
  for (let i = 0; i < ROWS; i++) {
    grid[i] = [];
    // Only fill the top 5 rows initially
    for (let j = 0; j < COLS; j++) {
      grid[i][j] = i < 5 ? getRandomColor() : null;
    }
  }
  
  return grid;
};

interface Position {
  row: number;
  col: number;
}

export const useBubbleGame = () => {
  const [grid, setGrid] = useState<(BubbleColor | null)[][]>(createInitialGrid);
  const [currentBubble, setCurrentBubble] = useState<BubbleColor>(getRandomColor);
  const [nextBubble, setNextBubble] = useState<BubbleColor>(getRandomColor);
  const [score, setScore] = useState<number>(0);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [poppingBubbles, setPoppingBubbles] = useState<Position[]>([]);
  const { toast } = useToast();

  // Reset game state
  const resetGame = useCallback(() => {
    setGrid(createInitialGrid());
    setCurrentBubble(getRandomColor());
    setNextBubble(getRandomColor());
    setScore(0);
    setIsGameOver(false);
    setPoppingBubbles([]);
  }, []);

  // Find connected bubbles of the same color
  const findConnectedBubbles = useCallback((row: number, col: number, color: BubbleColor, visited: boolean[][] = []): Position[] => {
    if (!visited.length) {
      // Initialize visited array
      visited = Array(ROWS).fill(0).map(() => Array(COLS).fill(false));
    }
    
    // Check if position is valid
    if (row < 0 || row >= ROWS || col < 0 || col >= COLS || visited[row][col] || grid[row][col] !== color) {
      return [];
    }
    
    visited[row][col] = true;
    const connected: Position[] = [{ row, col }];
    
    // Check surrounding positions
    // Adjustments for hexagonal grid
    const directions = [
      { row: -1, col: 0 }, // up
      { row: -1, col: row % 2 === 0 ? -1 : 1 }, // up-left or up-right
      { row: 0, col: -1 }, // left
      { row: 0, col: 1 },  // right
      { row: 1, col: row % 2 === 0 ? -1 : 1 }, // down-left or down-right
      { row: 1, col: 0 }   // down
    ];
    
    for (const dir of directions) {
      const newRow = row + dir.row;
      const newCol = col + dir.col;
      
      connected.push(...findConnectedBubbles(newRow, newCol, color, visited));
    }
    
    return connected;
  }, [grid]);

  // Check if any bubbles are floating (not connected to the top)
  const findFloatingBubbles = useCallback(() => {
    const visited = Array(ROWS).fill(0).map(() => Array(COLS).fill(false));
    const floating: Position[] = [];
    
    // First, mark all bubbles connected to the top row
    const markConnectedToTop = (row: number, col: number) => {
      if (row < 0 || row >= ROWS || col < 0 || col >= COLS || visited[row][col] || grid[row][col] === null) {
        return;
      }
      
      visited[row][col] = true;
      
      // Check surrounding positions
      const directions = [
        { row: -1, col: 0 }, // up
        { row: -1, col: row % 2 === 0 ? -1 : 1 }, // up-left or up-right
        { row: 0, col: -1 }, // left
        { row: 0, col: 1 },  // right
        { row: 1, col: row % 2 === 0 ? -1 : 1 }, // down-left or down-right
        { row: 1, col: 0 }   // down
      ];
      
      for (const dir of directions) {
        markConnectedToTop(row + dir.row, col + dir.col);
      }
    };
    
    // Start from all bubbles in the top row
    for (let col = 0; col < COLS; col++) {
      if (grid[0][col] !== null) {
        markConnectedToTop(0, col);
      }
    }
    
    // Find all bubbles that are not visited (floating)
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        if (grid[row][col] !== null && !visited[row][col]) {
          floating.push({ row, col });
        }
      }
    }
    
    return floating;
  }, [grid]);

  // Shoot a bubble
  const shootBubble = useCallback((angle: number, color: BubbleColor) => {
    if (isPaused || isAnimating) return;
    
    setIsAnimating(true);
    
    // Convert angle to radians
    const radians = (angle * Math.PI) / 180;
    
    // Determine the trajectory
    let row = ROWS - 1;
    let col = Math.floor(COLS / 2);
    let dx = Math.cos(radians);
    let dy = -Math.sin(radians); // negative because y increases downward
    
    // Simple collision detection
    const findCollision = () => {
      let newRow = row;
      let newCol = col;
      
      // Keep moving until we hit a wall or another bubble
      while (true) {
        newRow += dy;
        newCol += dx;
        
        // Round to nearest grid position
        const gridRow = Math.round(newRow);
        const gridCol = Math.round(newCol);
        
        // Check if we hit a wall
        if (gridCol < 0 || gridCol >= COLS) {
          dx = -dx; // Bounce off the wall
          continue;
        }
        
        // Check if we hit the top
        if (gridRow < 0) {
          return { row: 0, col: gridCol };
        }
        
        // Check if we hit another bubble
        if (gridRow < ROWS && gridRow >= 0 && gridCol < COLS && gridCol >= 0 && grid[gridRow][gridCol] !== null) {
          // Find the adjacent empty spot
          for (const dir of [
            { row: 0, col: -1 }, // left
            { row: 0, col: 1 },  // right
            { row: 1, col: 0 },  // down
            { row: -1, col: 0 }, // up
            { row: -1, col: gridRow % 2 === 0 ? -1 : 1 }, // up-left or up-right
            { row: 1, col: gridRow % 2 === 0 ? -1 : 1 }   // down-left or down-right
          ]) {
            const adjRow = gridRow + dir.row;
            const adjCol = gridCol + dir.col;
            
            if (adjRow >= 0 && adjRow < ROWS && adjCol >= 0 && adjCol < COLS && grid[adjRow][adjCol] === null) {
              return { row: adjRow, col: adjCol };
            }
          }
          
          // If no empty spots, just place at the position where it would go
          return { row: gridRow, col: gridCol };
        }
      }
    };
    
    const { row: newRow, col: newCol } = findCollision();
    
    // Update the grid
    const newGrid = [...grid];
    if (newRow >= 0 && newRow < ROWS && newCol >= 0 && newCol < COLS) {
      newGrid[newRow][newCol] = color;
      setGrid(newGrid);
      
      // Check for matches (3+ bubbles of the same color)
      const matches = findConnectedBubbles(newRow, newCol, color);
      
      if (matches.length >= 3) {
        // Show popping animation
        setPoppingBubbles(matches);
        
        // Update score
        const newScore = score + matches.length * 10;
        setScore(newScore);
        
        // Show toast for combos
        if (matches.length >= 5) {
          toast({
            title: "Great combo!",
            description: `You popped ${matches.length} bubbles!`,
          });
        }
      } else {
        // No matches, check for floating bubbles
        const floating = findFloatingBubbles();
        
        if (floating.length > 0) {
          setPoppingBubbles(floating);
          
          // Update score
          const newScore = score + floating.length * 5;
          setScore(newScore);
        } else {
          setIsAnimating(false);
          
          // Prep for next bubble
          setCurrentBubble(nextBubble);
          setNextBubble(getRandomColor());
          
          // Check if game is over (bubbles reached the bottom row)
          if (grid[ROWS - 2].some(bubble => bubble !== null)) {
            setIsGameOver(true);
          }
        }
      }
    } else {
      setIsAnimating(false);
    }
  }, [grid, isPaused, isAnimating, score, findConnectedBubbles, findFloatingBubbles, nextBubble, toast]);

  // Handle grid update after animations
  const handleGridUpdated = useCallback(() => {
    if (poppingBubbles.length === 0) {
      setIsAnimating(false);
      return;
    }
    
    // Remove popped bubbles from grid
    const newGrid = [...grid];
    for (const { row, col } of poppingBubbles) {
      if (row >= 0 && row < ROWS && col >= 0 && col < COLS) {
        newGrid[row][col] = null;
      }
    }
    
    setGrid(newGrid);
    setPoppingBubbles([]);
    
    // Check for floating bubbles after popping
    setTimeout(() => {
      const floating = findFloatingBubbles();
      
      if (floating.length > 0) {
        setPoppingBubbles(floating);
        
        // Update score
        const newScore = score + floating.length * 5;
        setScore(newScore);
      } else {
        setIsAnimating(false);
        
        // Prep for next bubble
        setCurrentBubble(nextBubble);
        setNextBubble(getRandomColor());
      }
    }, 100);
  }, [grid, poppingBubbles, score, findFloatingBubbles, nextBubble]);

  // Toggle pause state
  const togglePause = useCallback(() => {
    setIsPaused(prev => !prev);
  }, []);

  return {
    grid,
    currentBubble,
    nextBubble,
    score,
    isGameOver,
    isPaused,
    poppingBubbles,
    shootBubble,
    resetGame,
    togglePause,
    handleGridUpdated
  };
};
