import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import { useGame } from '../contexts/GameContext';
import { ArrowLeft, Star, Trophy, Clock, RefreshCw, Home } from 'lucide-react';
import toast from 'react-hot-toast';

// Import mini-games
import MathAdventure from '../games/MathAdventure';
import WordWizard from '../games/WordWizard';
import ScienceLab from '../games/ScienceLab';
import MemoryPalace from '../games/MemoryPalace';
import PatternQuest from '../games/PatternQuest';
import GeographyExplorer from '../games/GeographyExplorer';
import CreativityCanvas from '../games/CreativityCanvas';

interface GameResult {
  score: number;
  stars: number;
  completed: boolean;
  timeSpent: number;
}

const GamePlay: React.FC = () => {
  const { gameId, level } = useParams();
  const navigate = useNavigate();
  const { games, updateProgress, getGameProgress } = useGame();
  const [currentLevel, setCurrentLevel] = useState(parseInt(level || '1'));
  const [gameState, setGameState] = useState<'playing' | 'completed' | 'loading'>('loading');
  const [gameResult, setGameResult] = useState<GameResult | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());

  const game = games.find(g => g.id === gameId);
  const gameProgress = game ? getGameProgress(game.id) : [];
  const currentLevelProgress = gameProgress.find(p => p.level === currentLevel);

  useEffect(() => {
    setStartTime(Date.now());
    setGameState('playing');
  }, [currentLevel]);

  if (!game) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Game Not Found</h1>
          <button
            onClick={() => navigate('/games')}
            className="bg-primary-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-600 transition-colors"
          >
            Back to Games
          </button>
        </div>
      </div>
    );
  }

  const handleGameComplete = (result: GameResult) => {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    const finalResult = { ...result, timeSpent };
    
    setGameResult(finalResult);
    setGameState('completed');
    
    // Update progress
    updateProgress(game.id, currentLevel, finalResult.score, finalResult.stars);
    
    // Show confetti for good performance
    if (finalResult.stars >= 2) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }

    // Show toast notification
    if (finalResult.stars === 3) {
      toast.success('Perfect! 3 stars! ⭐⭐⭐');
    } else if (finalResult.stars === 2) {
      toast.success('Great job! 2 stars! ⭐⭐');
    } else {
      toast.success('Good effort! Keep practicing! ⭐');
    }
  };

  const nextLevel = () => {
    if (currentLevel < game.totalLevels) {
      setCurrentLevel(currentLevel + 1);
      setGameState('loading');
      setGameResult(null);
    } else {
      navigate('/games');
      toast.success('Congratulations! You completed all levels! 🎉');
    }
  };

  const restartLevel = () => {
    setGameState('loading');
    setGameResult(null);
    setStartTime(Date.now());
    setTimeout(() => setGameState('playing'), 500);
  };

  const GameComponent = () => {
    const commonProps = {
      level: currentLevel,
      onComplete: handleGameComplete,
      gameState,
    };

    switch (gameId) {
      case 'math-adventure':
        return <MathAdventure {...commonProps} />;
      case 'word-wizard':
        return <WordWizard {...commonProps} />;
      case 'science-lab':
        return <ScienceLab {...commonProps} />;
      case 'memory-palace':
        return <MemoryPalace {...commonProps} />;
      case 'pattern-quest':
        return <PatternQuest {...commonProps} />;
      case 'geography-explorer':
        return <GeographyExplorer {...commonProps} />;
      case 'creativity-canvas':
        return <CreativityCanvas {...commonProps} />;
      default:
        return <div>Game not implemented yet</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={200}
        />
      )}

      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/games')}
                className="p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition-all"
              >
                <ArrowLeft size={24} />
              </button>
              
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 ${game.bgColor} rounded-lg flex items-center justify-center text-white text-lg`}>
                  {game.icon}
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-800">{game.title}</h1>
                  <p className="text-sm text-gray-600">Level {currentLevel}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Level Progress */}
              <div className="flex items-center space-x-2">
                {Array.from({ length: game.totalLevels }, (_, i) => {
                  const levelNum = i + 1;
                  const levelProgress = gameProgress.find(p => p.level === levelNum);
                  const isCompleted = levelProgress?.completed;
                  const isCurrent = levelNum === currentLevel;
                  
                  return (
                    <div
                      key={levelNum}
                      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all ${
                        isCurrent
                          ? `${game.bgColor} text-white border-transparent`
                          : isCompleted
                          ? 'bg-green-500 text-white border-green-500'
                          : 'bg-gray-200 text-gray-600 border-gray-300'
                      }`}
                    >
                      {isCompleted ? '✓' : levelNum}
                    </div>
                  );
                })}
              </div>

              {/* Current Level Stars */}
              {currentLevelProgress && (
                <div className="flex items-center space-x-1">
                  {Array.from({ length: 3 }, (_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={i < currentLevelProgress.stars ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Game Content */}
      <div className="relative">
        <AnimatePresence mode="wait">
          {gameState === 'loading' && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="min-h-screen flex items-center justify-center"
            >
              <div className="text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="text-6xl mb-4"
                >
                  {game.icon}
                </motion.div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Level {currentLevel}
                </h2>
                <p className="text-gray-600 mb-6">{game.description}</p>
                <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              </div>
            </motion.div>
          )}

          {gameState === 'playing' && (
            <motion.div
              key="playing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <GameComponent />
            </motion.div>
          )}

          {gameState === 'completed' && gameResult && (
            <motion.div
              key="completed"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="min-h-screen flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="text-6xl mb-6"
                >
                  {gameResult.stars === 3 ? '🏆' : gameResult.stars === 2 ? '🌟' : '👍'}
                </motion.div>
                
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  Level {currentLevel} Complete!
                </h2>
                
                <div className="flex justify-center items-center space-x-1 mb-6">
                  {Array.from({ length: 3 }, (_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.5 + i * 0.2, type: "spring" }}
                    >
                      <Star
                        size={32}
                        className={i < gameResult.stars ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                      />
                    </motion.div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-primary-50 rounded-xl p-4">
                    <Trophy className="text-primary-600 mx-auto mb-2" size={24} />
                    <div className="text-2xl font-bold text-primary-600">{gameResult.score}</div>
                    <div className="text-sm text-gray-600">Score</div>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-4">
                    <Clock className="text-blue-600 mx-auto mb-2" size={24} />
                    <div className="text-2xl font-bold text-blue-600">{gameResult.timeSpent}s</div>
                    <div className="text-sm text-gray-600">Time</div>
                  </div>
                </div>

                <div className="space-y-3">
                  {currentLevel < game.totalLevels ? (
                    <button
                      onClick={nextLevel}
                      className={`w-full ${game.bgColor} text-white font-bold py-4 px-6 rounded-xl text-lg hover:shadow-lg transition-all`}
                    >
                      Next Level
                    </button>
                  ) : (
                    <button
                      onClick={() => navigate('/games')}
                      className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold py-4 px-6 rounded-xl text-lg hover:shadow-lg transition-all"
                    >
                      🎉 All Levels Complete!
                    </button>
                  )}
                  
                  <div className="flex space-x-3">
                    <button
                      onClick={restartLevel}
                      className="flex-1 bg-gray-100 text-gray-700 font-semibold py-3 px-4 rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center space-x-2"
                    >
                      <RefreshCw size={18} />
                      <span>Retry</span>
                    </button>
                    <button
                      onClick={() => navigate('/games')}
                      className="flex-1 bg-gray-100 text-gray-700 font-semibold py-3 px-4 rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center space-x-2"
                    >
                      <Home size={18} />
                      <span>Home</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default GamePlay;