import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Beaker } from 'lucide-react';

interface ScienceLabProps {
  level: number;
  onComplete: (result: { score: number; stars: number; completed: boolean; timeSpent: number }) => void;
  gameState: 'playing' | 'completed' | 'loading';
}

interface Experiment {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  category: string;
}

const ScienceLab: React.FC<ScienceLabProps> = ({ level, onComplete, gameState }) => {
  const [currentExperiment, setCurrentExperiment] = useState(0);
  const [score, setScore] = useState(0);
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(75);
  const [startTime] = useState(Date.now());

  const experimentData = {
    easy: [
      {
        question: "What do plants need to grow?",
        options: ["Only water", "Sunlight, water, and air", "Only sunlight", "Only soil"],
        correct: 1,
        explanation: "Plants need sunlight for photosynthesis, water for nutrients, and air for carbon dioxide!",
        category: "Biology"
      },
      {
        question: "What happens to water when it gets very cold?",
        options: ["It disappears", "It becomes ice", "It becomes hot", "It changes color"],
        correct: 1,
        explanation: "When water freezes at 0°C (32°F), it becomes ice!",
        category: "Physics"
      },
      {
        question: "How many legs does a spider have?",
        options: ["6", "8", "10", "4"],
        correct: 1,
        explanation: "All spiders have 8 legs, which makes them arachnids, not insects!",
        category: "Biology"
      },
      {
        question: "What makes the sound during thunder?",
        options: ["Clouds bumping", "Lightning heating air", "Rain falling", "Wind blowing"],
        correct: 1,
        explanation: "Lightning heats the air so quickly that it expands and creates the thunder sound!",
        category: "Weather"
      }
    ],
    medium: [
      {
        question: "What is the process called when a caterpillar becomes a butterfly?",
        options: ["Evolution", "Metamorphosis", "Transformation", "Mutation"],
        correct: 1,
        explanation: "Metamorphosis is the amazing process where caterpillars transform into butterflies!",
        category: "Biology"
      },
      {
        question: "Which planet is known as the Red Planet?",
        options: ["Venus", "Mars", "Jupiter", "Saturn"],
        correct: 1,
        explanation: "Mars appears red because of iron oxide (rust) on its surface!",
        category: "Astronomy"
      },
      {
        question: "What gas do plants absorb from the air during photosynthesis?",
        options: ["Oxygen", "Carbon dioxide", "Nitrogen", "Hydrogen"],
        correct: 1,
        explanation: "Plants absorb carbon dioxide and release oxygen during photosynthesis!",
        category: "Biology"
      },
      {
        question: "What is the hardest natural substance on Earth?",
        options: ["Gold", "Iron", "Diamond", "Quartz"],
        correct: 2,
        explanation: "Diamond is the hardest natural substance, made of carbon atoms arranged in a crystal structure!",
        category: "Chemistry"
      }
    ],
    hard: [
      {
        question: "What is the powerhouse of the cell?",
        options: ["Nucleus", "Mitochondria", "Ribosome", "Cytoplasm"],
        correct: 1,
        explanation: "Mitochondria produce energy (ATP) for the cell, earning them the nickname 'powerhouse of the cell'!",
        category: "Biology"
      },
      {
        question: "What is the chemical symbol for gold?",
        options: ["Go", "Gd", "Au", "Ag"],
        correct: 2,
        explanation: "Au comes from the Latin word 'aurum' meaning gold!",
        category: "Chemistry"
      },
      {
        question: "What type of wave is sound?",
        options: ["Electromagnetic", "Longitudinal", "Transverse", "Light"],
        correct: 1,
        explanation: "Sound waves are longitudinal waves that travel through compression and rarefaction of air!",
        category: "Physics"
      },
      {
        question: "What is the study of earthquakes called?",
        options: ["Geology", "Seismology", "Meteorology", "Volcanology"],
        correct: 1,
        explanation: "Seismology is the scientific study of earthquakes and seismic waves!",
        category: "Earth Science"
      }
    ]
  };

  useEffect(() => {
    if (gameState === 'playing') {
      generateExperiments();
      setTimeLeft(75 + (level - 1) * 10);
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

  const generateExperiments = () => {
    let dataSet: typeof experimentData.easy;
    
    if (level <= 2) {
      dataSet = experimentData.easy;
    } else if (level <= 5) {
      dataSet = experimentData.medium;
    } else {
      dataSet = experimentData.hard;
    }

    const selectedExperiments = dataSet
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.min(4 + level, dataSet.length));

    setExperiments(selectedExperiments);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    
    if (answerIndex === experiments[currentExperiment].correct) {
      setScore(score + 150);
    }
    
    setTimeout(() => {
      if (currentExperiment + 1 >= experiments.length) {
        handleGameEnd();
      } else {
        setCurrentExperiment(currentExperiment + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      }
    }, 3000);
  };

  const handleGameEnd = () => {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    const maxScore = experiments.length * 150;
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

  if (gameState !== 'playing' || experiments.length === 0) {
    return null;
  }

  const currentExp = experiments[currentExperiment];
  const progress = ((currentExperiment + 1) / experiments.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 mb-6 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Science Lab</h2>
              <p className="text-gray-600">Level {level}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-green-600">{score}</div>
              <div className="text-sm text-gray-600">Score</div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full"
            />
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">
              Experiment {currentExperiment + 1} of {experiments.length}
            </span>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Time:</span>
              <span className={`font-bold ${timeLeft <= 15 ? 'text-red-500' : 'text-green-600'}`}>
                {timeLeft}s
              </span>
            </div>
          </div>
        </div>

        {/* Experiment Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentExperiment}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="bg-white rounded-3xl p-8 shadow-2xl"
          >
            <div className="text-center mb-8">
              <motion.div
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-6xl mb-4"
              >
                🔬
              </motion.div>
              
              <div className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold mb-6 inline-block">
                {currentExp.category}
              </div>
              
              <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 leading-relaxed">
                {currentExp.question}
              </h3>
            </div>

            {/* Answer Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto mb-8">
              {currentExp.options.map((option, index) => {
                let buttonClass = "bg-gradient-to-r from-green-400 to-blue-400 hover:from-green-500 hover:to-blue-500 text-white";
                
                if (showResult) {
                  if (index === currentExp.correct) {
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
                    {showResult && index === currentExp.correct && (
                      <Check size={24} />
                    )}
                    {showResult && index === selectedAnswer && index !== currentExp.correct && (
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
                  {selectedAnswer === currentExp.correct ? (
                    <div className="text-green-600">
                      <motion.div
                        animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.8 }}
                        className="text-5xl mb-4"
                      >
                        🧪
                      </motion.div>
                      <p className="text-2xl font-bold mb-3">Excellent Discovery! +150 points</p>
                    </div>
                  ) : (
                    <div className="text-red-600">
                      <div className="text-5xl mb-4">🔍</div>
                      <p className="text-2xl font-bold mb-3">Let's learn from this experiment!</p>
                    </div>
                  )}
                  
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-blue-50 border border-blue-200 rounded-2xl p-6 max-w-2xl mx-auto"
                  >
                    <div className="flex items-start space-x-3">
                      <Beaker className="text-blue-500 mt-1" size={24} />
                      <div className="text-left">
                        <h4 className="font-bold text-blue-800 mb-2">Scientific Explanation:</h4>
                        <p className="text-blue-700 leading-relaxed">{currentExp.explanation}</p>
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

export default ScienceLab;