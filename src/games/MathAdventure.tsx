import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Star } from 'lucide-react';

interface MathAdventureProps {
  level: number;
  onComplete: (result: { score: number; stars: number; completed: boolean; timeSpent: number }) => void;
  gameState: 'playing' | 'completed' | 'loading';
}

interface Question {
  question: string;
  answer: number;
  options: number[];
}

const MathAdventure: React.FC<MathAdventureProps> = ({ level, onComplete, gameState }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    if (gameState === 'playing') {
      generateQuestions();
      setTimeLeft(60 + (level - 1) * 10); // More time for higher levels
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

  const generateQuestions = () => {
    const newQuestions: Question[] = [];
    const questionCount = 5 + level; // More questions for higher levels
    
    for (let i = 0; i < questionCount; i++) {
      let question: Question;
      
      if (level <= 2) {
        // Simple addition/subtraction
        const a = Math.floor(Math.random() * 10) + 1;
        const b = Math.floor(Math.random() * 10) + 1;
        const operation = Math.random() > 0.5 ? '+' : '-';
        const answer = operation === '+' ? a + b : Math.max(a, b) - Math.min(a, b);
        
        question = {
          question: `${Math.max(a, b)} ${operation} ${Math.min(a, b)} = ?`,
          answer,
          options: generateOptions(answer),
        };
      } else if (level <= 4) {
        // Multiplication/division
        const a = Math.floor(Math.random() * 12) + 1;
        const b = Math.floor(Math.random() * 12) + 1;
        const operation = Math.random() > 0.5 ? '×' : '÷';
        
        if (operation === '×') {
          const answer = a * b;
          question = {
            question: `${a} × ${b} = ?`,
            answer,
            options: generateOptions(answer),
          };
        } else {
          const answer = a;
          const dividend = a * b;
          question = {
            question: `${dividend} ÷ ${b} = ?`,
            answer,
            options: generateOptions(answer),
          };
        }
      } else {
        // Mixed operations with larger numbers
        const a = Math.floor(Math.random() * 50) + 10;
        const b = Math.floor(Math.random() * 20) + 5;
        const operations = ['+', '-', '×'];
        const operation = operations[Math.floor(Math.random() * operations.length)];
        
        let answer: number;
        switch (operation) {
          case '+':
            answer = a + b;
            break;
          case '-':
            answer = a - b;
            break;
          case '×':
            answer = a * b;
            break;
          default:
            answer = a + b;
        }
        
        question = {
          question: `${a} ${operation} ${b} = ?`,
          answer,
          options: generateOptions(answer),
        };
      }
      
      newQuestions.push(question);
    }
    
    setQuestions(newQuestions);
  };

  const generateOptions = (correctAnswer: number): number[] => {
    const options = [correctAnswer];
    
    while (options.length < 4) {
      const wrongAnswer = correctAnswer + Math.floor(Math.random() * 20) - 10;
      if (wrongAnswer !== correctAnswer && wrongAnswer > 0 && !options.includes(wrongAnswer)) {
        options.push(wrongAnswer);
      }
    }
    
    return options.sort(() => Math.random() - 0.5);
  };

  const handleAnswerSelect = (answer: number) => {
    setSelectedAnswer(answer);
    setShowResult(true);
    
    if (answer === questions[currentQuestion].answer) {
      setScore(score + 100);
    }
    
    setTimeout(() => {
      if (currentQuestion + 1 >= questions.length) {
        handleGameEnd();
      } else {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      }
    }, 1500);
  };

  const handleGameEnd = () => {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    const maxScore = questions.length * 100;
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

  if (gameState !== 'playing' || questions.length === 0) {
    return null;
  }

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 mb-6 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Math Adventure</h2>
              <p className="text-gray-600">Level {level}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600">{score}</div>
              <div className="text-sm text-gray-600">Score</div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full"
            />
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Time:</span>
              <span className={`font-bold ${timeLeft <= 10 ? 'text-red-500' : 'text-blue-600'}`}>
                {timeLeft}s
              </span>
            </div>
          </div>
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="bg-white rounded-3xl p-8 shadow-2xl"
          >
            <div className="text-center mb-8">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-6xl mb-4"
              >
                🧮
              </motion.div>
              <h3 className="text-4xl font-bold text-gray-800 mb-4">
                {currentQ.question}
              </h3>
            </div>

            {/* Answer Options */}
            <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
              {currentQ.options.map((option, index) => {
                let buttonClass = "bg-gradient-to-r from-blue-400 to-purple-400 hover:from-blue-500 hover:to-purple-500 text-white";
                
                if (showResult) {
                  if (option === currentQ.answer) {
                    buttonClass = "bg-gradient-to-r from-green-400 to-green-500 text-white";
                  } else if (option === selectedAnswer) {
                    buttonClass = "bg-gradient-to-r from-red-400 to-red-500 text-white";
                  } else {
                    buttonClass = "bg-gray-300 text-gray-600";
                  }
                }
                
                return (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: showResult ? 1 : 1.05 }}
                    whileTap={{ scale: showResult ? 1 : 0.95 }}
                    onClick={() => !showResult && handleAnswerSelect(option)}
                    disabled={showResult}
                    className={`${buttonClass} font-bold py-6 px-8 rounded-2xl text-2xl shadow-lg transition-all duration-200 flex items-center justify-center space-x-3`}
                  >
                    <span>{option}</span>
                    {showResult && option === currentQ.answer && (
                      <Check size={24} />
                    )}
                    {showResult && option === selectedAnswer && option !== currentQ.answer && (
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
                  className="text-center mt-8"
                >
                  {selectedAnswer === currentQ.answer ? (
                    <div className="text-green-600">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                        className="text-4xl mb-2"
                      >
                        ⭐
                      </motion.div>
                      <p className="text-2xl font-bold">Correct! +100 points</p>
                    </div>
                  ) : (
                    <div className="text-red-600">
                      <div className="text-4xl mb-2">💫</div>
                      <p className="text-2xl font-bold">
                        Oops! The answer was {currentQ.answer}
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

export default MathAdventure;