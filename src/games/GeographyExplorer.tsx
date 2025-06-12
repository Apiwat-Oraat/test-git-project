import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, MapPin, Globe } from 'lucide-react';

interface GeographyExplorerProps {
  level: number;
  onComplete: (result: { score: number; stars: number; completed: boolean; timeSpent: number }) => void;
  gameState: 'playing' | 'completed' | 'loading';
}

interface GeographyQuestion {
  question: string;
  options: string[];
  correct: number;
  category: string;
  fact: string;
}

const GeographyExplorer: React.FC<GeographyExplorerProps> = ({ level, onComplete, gameState }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [questions, setQuestions] = useState<GeographyQuestion[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(100);
  const [startTime] = useState(Date.now());

  const questionData = {
    easy: [
      {
        question: "Which continent is known as the 'Land Down Under'?",
        options: ["Africa", "Australia", "South America", "Antarctica"],
        correct: 1,
        category: "Continents",
        fact: "Australia is called 'Land Down Under' because it's located in the Southern Hemisphere!"
      },
      {
        question: "What is the largest ocean on Earth?",
        options: ["Atlantic Ocean", "Indian Ocean", "Pacific Ocean", "Arctic Ocean"],
        correct: 2,
        category: "Oceans",
        fact: "The Pacific Ocean covers about 46% of Earth's water surface!"
      },
      {
        question: "Which country is famous for the Eiffel Tower?",
        options: ["Italy", "Spain", "France", "Germany"],
        correct: 2,
        category: "Landmarks",
        fact: "The Eiffel Tower in Paris, France, was built in 1889 and is 330 meters tall!"
      },
      {
        question: "What is the longest river in the world?",
        options: ["Amazon River", "Nile River", "Mississippi River", "Yangtze River"],
        correct: 1,
        category: "Rivers",
        fact: "The Nile River flows for about 6,650 kilometers through northeastern Africa!"
      }
    ],
    medium: [
      {
        question: "Which mountain range contains Mount Everest?",
        options: ["Andes", "Rocky Mountains", "Himalayas", "Alps"],
        correct: 2,
        category: "Mountains",
        fact: "Mount Everest is 8,848 meters tall and located in the Himalayas between Nepal and Tibet!"
      },
      {
        question: "What is the capital city of Canada?",
        options: ["Toronto", "Vancouver", "Montreal", "Ottawa"],
        correct: 3,
        category: "Capitals",
        fact: "Ottawa became Canada's capital in 1857 and is located in Ontario province!"
      },
      {
        question: "Which desert is the largest hot desert in the world?",
        options: ["Gobi Desert", "Sahara Desert", "Kalahari Desert", "Arabian Desert"],
        correct: 1,
        category: "Deserts",
        fact: "The Sahara Desert covers about 9 million square kilometers across North Africa!"
      },
      {
        question: "In which country would you find Machu Picchu?",
        options: ["Chile", "Peru", "Bolivia", "Ecuador"],
        correct: 1,
        category: "Landmarks",
        fact: "Machu Picchu is an ancient Incan city built around 1450 CE high in the Andes Mountains!"
      }
    ],
    hard: [
      {
        question: "Which strait separates Europe and Asia at their closest point?",
        options: ["Strait of Gibraltar", "Bosphorus Strait", "Strait of Hormuz", "Bering Strait"],
        correct: 1,
        category: "Geography",
        fact: "The Bosphorus Strait in Turkey is only 700 meters wide at its narrowest point!"
      },
      {
        question: "What is the smallest country in the world by area?",
        options: ["Monaco", "San Marino", "Vatican City", "Liechtenstein"],
        correct: 2,
        category: "Countries",
        fact: "Vatican City is only 0.17 square miles (0.44 square kilometers) in area!"
      },
      {
        question: "Which African country has three capital cities?",
        options: ["Nigeria", "South Africa", "Kenya", "Egypt"],
        correct: 1,
        category: "Capitals",
        fact: "South Africa has Cape Town (legislative), Pretoria (executive), and Bloemfontein (judicial) as capitals!"
      },
      {
        question: "What is the deepest point in Earth's oceans?",
        options: ["Puerto Rico Trench", "Java Trench", "Mariana Trench", "Peru-Chile Trench"],
        correct: 2,
        category: "Oceans",
        fact: "The Mariana Trench's deepest point, Challenger Deep, is about 11,000 meters below sea level!"
      }
    ]
  };

  useEffect(() => {
    if (gameState === 'playing') {
      generateQuestions();
      setTimeLeft(100 + (level - 1) * 20);
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
    let dataSet: typeof questionData.easy;
    
    if (level <= 2) {
      dataSet = questionData.easy;
    } else if (level <= 5) {
      dataSet = questionData.medium;
    } else {
      dataSet = questionData.hard;
    }

    const selectedQuestions = dataSet
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.min(5 + level, dataSet.length));

    setQuestions(selectedQuestions);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    
    if (answerIndex === questions[currentQuestion].correct) {
      setScore(score + 140);
    }
    
    setTimeout(() => {
      if (currentQuestion + 1 >= questions.length) {
        handleGameEnd();
      } else {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      }
    }, 3500);
  };

  const handleGameEnd = () => {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    const maxScore = questions.length * 140;
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
    <div className="min-h-screen bg-gradient-to-br from-teal-100 to-blue-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 mb-6 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Geography Explorer</h2>
              <p className="text-gray-600">Level {level}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-teal-600">{score}</div>
              <div className="text-sm text-gray-600">Score</div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="bg-gradient-to-r from-teal-500 to-blue-500 h-3 rounded-full"
            />
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Time:</span>
              <span className={`font-bold ${timeLeft <= 20 ? 'text-red-500' : 'text-teal-600'}`}>
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
                animate={{ 
                  rotate: [0, 360],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="text-6xl mb-4"
              >
                🌍
              </motion.div>
              
              <div className="bg-teal-100 text-teal-700 px-4 py-2 rounded-full text-sm font-semibold mb-6 inline-block">
                {currentQ.category}
              </div>
              
              <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 leading-relaxed">
                {currentQ.question}
              </h3>
            </div>

            {/* Answer Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto mb-8">
              {currentQ.options.map((option, index) => {
                let buttonClass = "bg-gradient-to-r from-teal-400 to-blue-400 hover:from-teal-500 hover:to-blue-500 text-white";
                
                if (showResult) {
                  if (index === currentQ.correct) {
                    buttonClass = "bg-gradient-to-r from-green-500 to-green-600 text-white";
                  } else if (index === selectedAnswer) {
                    buttonClass = "bg-gradient-to-r from-red-500 to-red-600 text-white";
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
                    whileHover={{ scale: showResult ? 1 : 1.02 }}
                    whileTap={{ scale: showResult ? 1 : 0.98 }}
                    onClick={() => !showResult && handleAnswerSelect(index)}
                    disabled={showResult}
                    className={`${buttonClass} font-semibold py-4 px-6 rounded-2xl text-lg shadow-lg transition-all duration-200 flex items-center justify-center space-x-3 min-h-[80px]`}
                  >
                    <span className="text-center">{option}</span>
                    {showResult && index === currentQ.correct && (
                      <Check size={24} />
                    )}
                    {showResult && index === selectedAnswer && index !== currentQ.correct && (
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
                  {selectedAnswer === currentQ.correct ? (
                    <div className="text-green-600">
                      <motion.div
                        animate={{ 
                          rotate: [0, 360],
                          scale: [1, 1.3, 1] 
                        }}
                        transition={{ duration: 1 }}
                        className="text-5xl mb-4"
                      >
                        🗺️
                      </motion.div>
                      <p className="text-2xl font-bold mb-3">Excellent Explorer! +140 points</p>
                    </div>
                  ) : (
                    <div className="text-red-600">
                      <div className="text-5xl mb-4">🧭</div>
                      <p className="text-2xl font-bold mb-3">Keep exploring to learn more!</p>
                    </div>
                  )}
                  
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-blue-50 border border-blue-200 rounded-2xl p-6 max-w-2xl mx-auto"
                  >
                    <div className="flex items-start space-x-3">
                      <Globe className="text-blue-500 mt-1" size={24} />
                      <div className="text-left">
                        <h4 className="font-bold text-blue-800 mb-2">Did You Know?</h4>
                        <p className="text-blue-700 leading-relaxed">{currentQ.fact}</p>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default GeographyExplorer;