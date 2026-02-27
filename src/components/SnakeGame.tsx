import React, { useEffect, useRef, useState } from 'react';

interface SnakeGameProps {
  onScoreChange: (score: number) => void;
}

type Point = { x: number; y: number };

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SPEED = 120;

export default function SnakeGame({ onScoreChange }: SnakeGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<Point>({ x: 1, y: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Use refs for state that needs to be accessed in the game loop without causing re-renders
  const snakeRef = useRef(snake);
  const foodRef = useRef(food);
  const directionRef = useRef(direction);
  const gameOverRef = useRef(gameOver);
  const isPausedRef = useRef(isPaused);

  useEffect(() => {
    snakeRef.current = snake;
    foodRef.current = food;
    directionRef.current = direction;
    gameOverRef.current = gameOver;
    isPausedRef.current = isPaused;
  }, [snake, food, direction, gameOver, isPaused]);

  useEffect(() => {
    onScoreChange(score);
  }, [score, onScoreChange]);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setDirection({ x: 1, y: 0 });
    setFood({
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    });
    setGameOver(false);
    setScore(0);
    setIsPaused(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default scrolling for arrow keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ') {
        if (gameOverRef.current) {
          resetGame();
        } else {
          setIsPaused((prev) => !prev);
        }
        return;
      }

      if (isPausedRef.current || gameOverRef.current) return;

      const currentDir = directionRef.current;
      switch (e.key) {
        case 'ArrowUp':
          if (currentDir.y !== 1) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (currentDir.y !== -1) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (currentDir.x !== 1) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (currentDir.x !== -1) setDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    let lastTime = 0;
    let animationFrameId: number;

    const gameLoop = (time: number) => {
      animationFrameId = requestAnimationFrame(gameLoop);

      if (gameOverRef.current || isPausedRef.current) {
        draw();
        return;
      }

      if (time - lastTime < INITIAL_SPEED) {
        return;
      }
      lastTime = time;

      update();
      draw();
    };

    const update = () => {
      const currentSnake = [...snakeRef.current];
      const head = { ...currentSnake[0] };
      const currentDir = directionRef.current;

      head.x += currentDir.x;
      head.y += currentDir.y;

      // Wall collision
      if (
        head.x < 0 ||
        head.x >= GRID_SIZE ||
        head.y < 0 ||
        head.y >= GRID_SIZE
      ) {
        setGameOver(true);
        return;
      }

      // Self collision
      if (currentSnake.some((segment) => segment.x === head.x && segment.y === head.y)) {
        setGameOver(true);
        return;
      }

      currentSnake.unshift(head);

      // Food collision
      if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
        setScore((s) => s + 10);
        setFood({
          x: Math.floor(Math.random() * GRID_SIZE),
          y: Math.floor(Math.random() * GRID_SIZE),
        });
      } else {
        currentSnake.pop();
      }

      setSnake(currentSnake);
    };

    const draw = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Clear canvas
      ctx.fillStyle = '#000000'; // Pure black
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw grid (glitchy effect)
      ctx.strokeStyle = 'rgba(0, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      for (let i = 0; i <= GRID_SIZE; i++) {
        ctx.beginPath();
        ctx.moveTo(i * CELL_SIZE, 0);
        ctx.lineTo(i * CELL_SIZE, canvas.height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * CELL_SIZE);
        ctx.lineTo(canvas.width, i * CELL_SIZE);
        ctx.stroke();
      }

      // Draw food
      ctx.fillStyle = '#FF00FF'; // Magenta
      // Glitch offset for food
      const glitchOffset = Math.random() > 0.9 ? (Math.random() * 4 - 2) : 0;
      ctx.fillRect(
        foodRef.current.x * CELL_SIZE + 2 + glitchOffset,
        foodRef.current.y * CELL_SIZE + 2,
        CELL_SIZE - 4,
        CELL_SIZE - 4
      );

      // Draw snake
      snakeRef.current.forEach((segment, index) => {
        if (index === 0) {
          ctx.fillStyle = '#FFFFFF'; // Head is white
        } else {
          // Alternating colors for body
          ctx.fillStyle = index % 2 === 0 ? '#00FFFF' : '#FF00FF';
        }
        
        // Occasional glitch effect on snake body
        const sGlitchX = Math.random() > 0.95 ? (Math.random() * 2 - 1) : 0;
        
        ctx.fillRect(
          segment.x * CELL_SIZE + 1 + sGlitchX,
          segment.y * CELL_SIZE + 1,
          CELL_SIZE - 2,
          CELL_SIZE - 2
        );
      });

      if (gameOverRef.current) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#FF00FF';
        ctx.font = '24px "Press Start 2P"';
        ctx.textAlign = 'center';
        
        // Manual text shadow for glitch effect on canvas
        ctx.fillStyle = '#00FFFF';
        ctx.fillText('SYS.FAILURE', canvas.width / 2 - 2, canvas.height / 2 - 20 + 2);
        ctx.fillStyle = '#FF00FF';
        ctx.fillText('SYS.FAILURE', canvas.width / 2 + 2, canvas.height / 2 - 20 - 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText('SYS.FAILURE', canvas.width / 2, canvas.height / 2 - 20);
        
        ctx.fillStyle = '#00FFFF';
        ctx.font = '10px "Press Start 2P"';
        ctx.fillText('> PRESS SPACE TO REBOOT', canvas.width / 2, canvas.height / 2 + 20);
      } else if (isPausedRef.current) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#00FFFF';
        ctx.font = '24px "Press Start 2P"';
        ctx.textAlign = 'center';
        
        ctx.fillStyle = '#FF00FF';
        ctx.fillText('HALTED', canvas.width / 2 - 2, canvas.height / 2 + 2);
        ctx.fillStyle = '#00FFFF';
        ctx.fillText('HALTED', canvas.width / 2 + 2, canvas.height / 2 - 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText('HALTED', canvas.width / 2, canvas.height / 2);
      }
    };

    animationFrameId = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={GRID_SIZE * CELL_SIZE}
        height={GRID_SIZE * CELL_SIZE}
        className="block bg-black"
      />
    </div>
  );
}
