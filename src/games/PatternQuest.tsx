import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, HelpCircle } from 'lucide-react';

interface PatternQuestProps {
  level: number;
  onComplete: (result: { score: number; stars: number; completed: boolean; timeSpent: number }) => void;
  gameState: 'playing' | 'completed' | 'loading';
}

interface Pattern {
  sequence: string[];
  options: string[];
  correct: number;
  type: 'shape' | 'color' | 'number' | 'mixed';
}

const PatternQuest: React.FC<PatternQuestProps> = ({ level, onComplete, gameState }) => {
  const [currentPattern, setCurrentPattern] = useState(0);
  const [score, setScore] = useState(0);
  const [patterns, setPatterns] = useState<Pattern[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(90);
  const [startTime] = useState(Date.now());

  const shapes = ['🔴', '🟡', '🟢', '🔵', '🟣', '🟠'];
  const numbers = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣'];
  const symbols = ['⭐', '❤️', '💎', '🌙', '☀️', '⚡'];

  useEffect(() => {
    if (gameState === 'playing') {
      generatePatterns();
      setTimeLeft(90 + (level - 1) * 15);
    }
  }, [level, gameState]);

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleGameEnd();
    }
  }, [timeLeft, gameState]);

  const generatePatterns = () => {
    const newPatterns: Pattern[] = [];
    const patternCount = 4 + level;
    
    for (let i = 0; i < patternCount; i++) {
      let pattern: Pattern;
      
      if (level <= 2) {
        // Simple repeating patterns
        pattern = generateSimplePattern();
      } else if (level <= 4) {
        // Arithmetic sequences
        pattern = generateArithmeticPattern();
      } else {
        // Complex mixed patterns
        pattern = generateComplexPattern();
      }
      
      newPatterns.push(pattern);
    }
    
    setPatterns(newPatterns);
  };

  const generateSimplePattern = (): Pattern => {
    const patternTypes = ['shape', 'color'];
    const type = patternTypes[Math.floor(Math.random() * patternTypes.length)] as 'shape' | 'color';
    
    if (type === 'shape') {
      const basePattern = shapes.slice(0, 3);
      const sequence = [];
      
      // Create ABAB or ABCABC pattern
      const patternLength = Math.random() > 0.5 ? 2 : 3;
      for (let i = 0; i < 6; i++) {
        sequence.push(basePattern[i % patternLength]);
      }
      
      const nextItem = basePattern[6 % patternLength];
      const options = [nextItem, ...shapes.filter(s => s !== nextItem).slice(0, 3)];
      
      return {
        sequence,
        options: options.sort(() => Math.random() - 0.5),
        correct: options.indexOf(nextItem),
        type: 'shape',
      };
    } else {
      const basePattern = shapes.slice(0, 2);
      const sequence = [];
      
      for (let i = 0; i < 6; i++) {
        sequence.push(basePattern[i % 2]);
      }
      
      const nextItem = basePattern[6 % 2];
      const options = [nextItem, ...shapes.filter(s => s !== nextItem).slice(0, 3)];
      
      return {
        sequence,
        options: options.sort(() => Math.random() - 0.5),
        correct: options.indexOf(nextItem),
        type: 'color',
      };
    }
  };

  const generateArithmeticPattern = (): Pattern => {
    const start = Math.floor(Math.random() * 5) + 1;
    const step = Math.floor(Math.random() * 3) + 1;
    const sequence = [];
    
    for (let i = 0; i < 5; i++) {
      const value = start + (i * step);
      sequence.push(numbers[Math.min(value - 1, 5)]);
    }
    
    const nextValue = start + (5 * step);
    const nextItem = numbers[Math.min(nextValue - 1, 5)];
    const options = [nextItem, ...numbers.filter(n => n !== nextItem).slice(0, 3)];
    
    return {
      sequence,
      options: options.sort(() => Math.random() - 0.5),
      correct: options.indexOf(nextItem),
      type: 'number',
    };
  };

  const generateComplexPattern = (): Pattern => {
    // Mixed pattern with shapes and symbols
    const elements = [...shapes.slice(0, 3), ...symbols.slice(0, 3)];
    const sequence = [];
    
    // Create a complex pattern like: shape, symbol, shape, symbol with rotation
    for (let i = 0; i < 6; i++) {
      if (i % 2 === 0) {
        sequence.push(shapes[Math.floor(i / 2) % 3]);
      } else {
        sequence.push(symbols[Math.floor(i / 2) % 3]);
      }
    }
    
    const nextItem = shapes[3 % 3]; // Next shape in sequence
    const options = [nextItem, ...elements.filter(e => e !== nextItem).slice(0, 3)];
    
    return {
      sequence,
      options: options.sort(() => Math.random() - 0.5),
      correct: options.indexOf(nextItem),
      type: 'mixed',
    };
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    
    if (answerIndex === patterns[currentPattern].correct) {
      setScore(score + 120);
    }
    
    setTimeout(() => {
      if (currentPattern + 1 >= patterns.length) {
        handleGameEnd();
      } else {
        setCurrentPattern(currentPattern + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      }
    }, 2500);
  };

  const handleGameEnd = () => {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    const maxScore = patterns.length * 120;
    const percentage = (score / maxScore) * 100;
    
    let stars = 1;
    if (percentage >= 90) stars = 3;
    else if (percentage >= 70) stars = 2;
    
    onComplete({
      score,
      stars,
      completed: true,
      timeSpent,
    });
  };

  if (gameState !== 'playing' || patterns.length === 0) {
    return null;
  }

  const currentPat = patterns[currentPattern];
  const progress = ((currentPattern + 1) / patterns.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 mb-6 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Pattern Quest</h2>
              <p className="text-gray-600">Level {level}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-indigo-600">{score}</div>
              <div className="text-sm text-gray-600">Score</div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full"
            />
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">
              Pattern {currentPattern + 1} of {patterns.length}
            </span>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Time:</span>
              <span className={`font-bold ${timeLeft <= 15 ? 'text-red-500' : 'text-indigo-600'}`}>
                {timeLeft}s
              </span>
            </div>
          </div>
        </div>

        {/* Pattern Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPattern}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="bg-white rounded-3xl p-8 shadow-2xl"
          >
            <div className="text-center mb-8">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="text-6xl mb-4"
              >
                🔍
              </motion.div>
              
              <div className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-semibold mb-6 inline-block">
                {currentPat.type.charAt(0).toUpperCase() + currentPat.type.slice(1)} Pattern
              </div>
              
              <h3 className="text-2xl font-bold text-gray-800 mb-6">
                What comes next in this pattern?
              </h3>
            </div>

            {/* Pattern Sequence */}
            <div className="flex justify-center items-center space-x-3 mb-8 flex-wrap">
              {currentPat.sequence.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.2 }}
                  className="w-16 h-16 bg-gradient-to-br from-indigo-200 to-purple-200 rounded-2xl flex items-center justify-center text-3xl shadow-lg m-1"
                >
                  {item}
                </motion.div>
              ))}
              
              {/* Question Mark */}
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: currentPat.sequence.length * 0.2 }}
                className="w-16 h-16 bg-gradient-to-br from-yellow-300 to-orange-300 rounded-2xl flex items-center justify-center text-3xl shadow-lg m-1"
              >
                <HelpCircle className="text-white" size={32} />
              </motion.div>
            </div>

            {/* Answer Options */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mb-8">
              {currentPat.options.map((option, index) => {
                let buttonClass = "bg-gradient-to-r from-indigo-400 to-purple-400 hover:from-indigo-500 hover:to-purple-500";
                
                if (showResult) {
                  if (index === currentPat.correct) {
                    buttonClass = "bg-gradient-to-r from-green-500 to-green-600";
                  } else if (index === selectedAnswer) {
                    buttonClass = "bg-gradient-to-r from-red-500 to-red-600";
                  } else {
                    buttonClass = "bg-gray-300";
                  }
                }
                
                return (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    whileHover={{ scale: showResult ? 1 : 1.05 }}
                    whileTap={{ scale: showResult ? 1 : 0.95 }}
                    onClick={() => !showResult && handleAnswerSelect(index)}
                    disabled={showResult}
                    className={`${buttonClass} text-white font-bold py-4 px-4 rounded-2xl text-3xl shadow-lg transition-all duration-200 flex items-center justify-center space-x-2 min-h-[80px]`}
                  >
                    <span>{option}</span>
                    {showResult && index === currentPat.correct && (
                      <Check size={24} />
                    )}
                    {showResult && index === selectedAnswer && index !== currentPat.correct && (
                      <X size={24} />
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Result Feedback */}
            <AnimatePresence>
              {showResult && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-center"
                >
                  {selectedAnswer === currentPat.correct ? (
                    <div className="text-green-600">
                      <motion.div
                        animate={{ scale: [1, 1.3, 1], rotate: [0, 360, 0] }}
                        transition={{ duration: 1 }}
                        className="text-5xl mb-4"
                      >
                        🎯
                      </motion.div>
                      <p className="text-2xl font-bold">Perfect Pattern Recognition! +120 points</p>
                    </div>
                  ) : (
                    <div className="text-red-600">
                      <div className="text-5xl mb-4">🧩</div>
                      <p className="text-2xl font-bold">Keep practicing pattern recognition!</p>
                      <p className="text-lg text-gray-600 mt-2">
                        The correct answer was: <span className="text-3xl">{currentPat.options[currentPat.correct]}</span>
                      </p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PatternQuest;