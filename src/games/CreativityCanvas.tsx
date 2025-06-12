import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, RotateCcw, Check, Sparkles } from 'lucide-react';

interface CreativityCanvasProps {
  level: number;
  onComplete: (result: { score: number; stars: number; completed: boolean; timeSpent: number }) => void;
  gameState: 'playing' | 'completed' | 'loading';
}

interface DrawingChallenge {
  prompt: string;
  category: string;
  timeLimit: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

const CreativityCanvas: React.FC<CreativityCanvasProps> = ({ level, onComplete, gameState }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentColor, setCurrentColor] = useState('#FF6B6B');
  const [brushSize, setBrushSize] = useState(5);
  const [score, setScore] = useState(0);
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [challenges, setChallenges] = useState<DrawingChallenge[]>([]);
  const [timeLeft, setTimeLeft] = useState(120);
  const [startTime] = useState(Date.now());
  const [hasDrawn, setHasDrawn] = useState(false);

  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
  ];

  const challengeData = {
    easy: [
      { prompt: "Draw a happy sun with a smiling face", category: "Nature", timeLimit: 90, difficulty: 'easy' as const },
      { prompt: "Draw your favorite animal", category: "Animals", timeLimit: 90, difficulty: 'easy' as const },
      { prompt: "Draw a house with windows and a door", category: "Buildings", timeLimit: 90, difficulty: 'easy' as const },
      { prompt: "Draw a flower with colorful petals", category: "Nature", timeLimit: 90, difficulty: 'easy' as const },
      { prompt: "Draw a rainbow in the sky", category: "Nature", timeLimit: 90, difficulty: 'easy' as const },
    ],
    medium: [
      { prompt: "Draw a magical castle with towers", category: "Fantasy", timeLimit: 120, difficulty: 'medium' as const },
      { prompt: "Draw an underwater scene with fish", category: "Ocean", timeLimit: 120, difficulty: 'medium' as const },
      { prompt: "Draw a robot with cool features", category: "Technology", timeLimit: 120, difficulty: 'medium' as const },
      { prompt: "Draw a forest with different trees", category: "Nature", timeLimit: 120, difficulty: 'medium' as const },
      { prompt: "Draw a space scene with planets", category: "Space", timeLimit: 120, difficulty: 'medium' as const },
    ],
    hard: [
      { prompt: "Draw a detailed cityscape at sunset", category: "Urban", timeLimit: 180, difficulty: 'hard' as const },
      { prompt: "Draw a fantasy creature in its habitat", category: "Fantasy", timeLimit: 180, difficulty: 'hard' as const },
      { prompt: "Draw an invention that could help the world", category: "Innovation", timeLimit: 180, difficulty: 'hard' as const },
      { prompt: "Draw a scene from your favorite story", category: "Literature", timeLimit: 180, difficulty: 'hard' as const },
      { prompt: "Draw what friendship looks like to you", category: "Abstract", timeLimit: 180, difficulty: 'hard' as const },
    ]
  };

  useEffect(() => {
    if (gameState === 'playing') {
      generateChallenges();
      initializeCanvas();
    }
  }, [level, gameState]);

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleChallengeComplete();
    }
  }, [timeLeft, gameState]);

  const generateChallenges = () => {
    let dataSet: typeof challengeData.easy;
    
    if (level <= 2) {
      dataSet = challengeData.easy;
    } else if (level <= 5) {
      dataSet = challengeData.medium;
    } else {
      dataSet = challengeData.hard;
    }

    const selectedChallenges = dataSet
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.min(3 + Math.floor(level / 2), dataSet.length));

    setChallenges(selectedChallenges);
    if (selectedChallenges.length > 0) {
      setTimeLeft(selectedChallenges[0].timeLimit);
    }
  };

  const initializeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 600;
    canvas.height = 400;

    // Fill with white background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Set drawing properties
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    setHasDrawn(true);
    draw(e);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineWidth = brushSize;
    ctx.strokeStyle = currentColor;
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.beginPath();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const handleChallengeComplete = () => {
    // Award points based on participation and time used
    const timeUsed = challenges[currentChallenge]?.timeLimit - timeLeft;
    const basePoints = hasDrawn ? 100 : 50;
    const timeBonus = Math.max(0, timeLeft * 2); // Bonus for finishing early
    const challengePoints = basePoints + timeBonus;
    
    setScore(score + challengePoints);

    if (currentChallenge + 1 >= challenges.length) {
      handleGameEnd();
    } else {
      // Move to next challenge
      setTimeout(() => {
        setCurrentChallenge(currentChallenge + 1);
        setTimeLeft(challenges[currentChallenge + 1].timeLimit);
        setHasDrawn(false);
        clearCanvas();
      }, 2000);
    }
  };

  const handleGameEnd = () => {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    const maxScore = challenges.reduce((sum, challenge) => sum + 200, 0); // Max possible score
    const percentage = (score / maxScore) * 100;
    
    let stars = 1;
    if (percentage >= 80) stars = 3;
    else if (percentage >= 60) stars = 2;
    
    onComplete({
      score,
      stars,
      completed: true,
      timeSpent,
    });
  };

  if (gameState !== 'playing' || challenges.length === 0) {
    return null;
  }

  const currentChal = challenges[currentChallenge];
  const progress = ((currentChallenge + 1) / challenges.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 to-pink-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 mb-6 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Creativity Canvas</h2>
              <p className="text-gray-600">Level {level}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-orange-600">{score}</div>
              <div className="text-sm text-gray-600">Score</div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="bg-gradient-to-r from-orange-500 to-pink-500 h-3 rounded-full"
            />
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">
              Challenge {currentChallenge + 1} of {challenges.length}
            </span>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Time:</span>
              <span className={`font-bold ${timeLeft <= 30 ? 'text-red-500' : 'text-orange-600'}`}>
                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Drawing Tools */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center space-x-2">
                <Palette size={20} />
                <span>Drawing Tools</span>
              </h3>
              
              {/* Color Palette */}
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-700 mb-3">Colors</p>
                <div className="grid grid-cols-5 gap-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setCurrentColor(color)}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        currentColor === color ? 'border-gray-800 scale-110' : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              {/* Brush Size */}
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-700 mb-3">Brush Size</p>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={brushSize}
                  onChange={(e) => setBrushSize(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Thin</span>
                  <span>Thick</span>
                </div>
              </div>

              {/* Clear Button */}
              <button
                onClick={clearCanvas}
                className="w-full bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <RotateCcw size={18} />
                <span>Clear Canvas</span>
              </button>
            </div>

            {/* Challenge Info */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="text-center">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-4xl mb-3"
                >
                  🎨
                </motion.div>
                <div className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-semibold mb-3 inline-block">
                  {currentChal.category}
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  {currentChal.prompt}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Let your creativity flow! There's no wrong way to express yourself.
                </p>
                <button
                  onClick={handleChallengeComplete}
                  disabled={!hasDrawn}
                  className={`w-full font-semibold py-2 px-4 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 ${
                    hasDrawn
                      ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <Check size={18} />
                  <span>I'm Done!</span>
                </button>
              </div>
            </div>
          </div>

          {/* Canvas Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="text-center mb-4">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Your Canvas</h3>
                <p className="text-gray-600">Click and drag to draw!</p>
              </div>
              
              <div className="flex justify-center">
                <canvas
                  ref={canvasRef}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  className="border-2 border-gray-300 rounded-xl cursor-crosshair shadow-inner bg-white"
                  style={{ maxWidth: '100%', height: 'auto' }}
                />
              </div>

              {/* Drawing Tips */}
              <div className="mt-6 bg-gradient-to-r from-orange-50 to-pink-50 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <Sparkles className="text-orange-500 mt-1" size={20} />
                  <div>
                    <h4 className="font-bold text-orange-800 mb-1">Creative Tips:</h4>
                    <ul className="text-sm text-orange-700 space-y-1">
                      <li>• Use different colors to make your drawing vibrant</li>
                      <li>• Try different brush sizes for details and bold strokes</li>
                      <li>• Don't worry about perfection - focus on having fun!</li>
                      <li>• Add your own creative twist to the prompt</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreativityCanvas;