import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Shuffle } from 'lucide-react';

interface WordWizardProps {
  level: number;
  onComplete: (result: { score: number; stars: number; completed: boolean; timeSpent: number }) => void;
  gameState: 'playing' | 'completed' | 'loading';
}

interface WordChallenge {
  word: string;
  scrambled: string;
  hint: string;
  category: string;
}

const WordWizard: React.FC<WordWizardProps> = ({ level, onComplete, gameState }) => {
  const [currentWord, setCurrentWord] = useState(0);
  const [score, setScore] = useState(0);
  const [words, setWords] = useState<WordChallenge[]>([]);
  const [userInput, setUserInput] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(90);
  const [startTime] = useState(Date.now());
  const [showHint, setShowHint] = useState(false);

  const wordLists = {
    easy: [
      { word: 'CAT', hint: 'A furry pet that meows', category: 'Animals' },
      { word: 'DOG', hint: 'A loyal pet that barks', category: 'Animals' },
      { word: 'SUN', hint: 'Bright star in the sky', category: 'Nature' },
      { word: 'TREE', hint: 'Tall plant with leaves', category: 'Nature' },
      { word: 'BOOK', hint: 'You read this', category: 'Objects' },
      { word: 'CAKE', hint: 'Sweet birthday treat', category: 'Food' },
      { word: 'FISH', hint: 'Swims in water', category: 'Animals' },
      { word: 'STAR', hint: 'Twinkles at night', category: 'Nature' },
    ],
    medium: [
      { word: 'ELEPHANT', hint: 'Large animal with a trunk', category: 'Animals' },
      { word: 'RAINBOW', hint: 'Colorful arc in the sky', category: 'Nature' },
      { word: 'COMPUTER', hint: 'Electronic device for work', category: 'Technology' },
      { word: 'BUTTERFLY', hint: 'Colorful flying insect', category: 'Animals' },
      { word: 'MOUNTAIN', hint: 'Very tall landform', category: 'Geography' },
      { word: 'CHOCOLATE', hint: 'Sweet brown treat', category: 'Food' },
      { word: 'DINOSAUR', hint: 'Extinct giant reptile', category: 'History' },
      { word: 'ADVENTURE', hint: 'Exciting journey', category: 'Concepts' },
    ],
    hard: [
      { word: 'MAGNIFICENT', hint: 'Extremely beautiful or impressive', category: 'Adjectives' },
      { word: 'ENCYCLOPEDIA', hint: 'Book with lots of information', category: 'Education' },
      { word: 'EXTRAORDINARY', hint: 'Very unusual or remarkable', category: 'Adjectives' },
      { word: 'KALEIDOSCOPE', hint: 'Tube with colorful patterns', category: 'Objects' },
      { word: 'CONSTELLATION', hint: 'Group of stars forming a pattern', category: 'Astronomy' },
      { word: 'METAMORPHOSIS', hint: 'Complete change of form', category: 'Science' },
      { word: 'ARCHAEOLOGY', hint: 'Study of ancient civilizations', category: 'Science' },
      { word: 'PHOTOSYNTHESIS', hint: 'How plants make food from sunlight', category: 'Biology' },
    ],
  };

  useEffect(() => {
    if (gameState === 'playing') {
      generateWords();
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

  const generateWords = () => {
    let wordList: typeof wordLists.easy;
    
    if (level <= 2) {
      wordList = wordLists.easy;
    } else if (level <= 5) {
      wordList = wordLists.medium;
    } else {
      wordList = wordLists.hard;
    }

    const selectedWords = wordList
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.min(5 + level, wordList.length))
      .map(item => ({
        ...item,
        scrambled: scrambleWord(item.word),
      }));

    setWords(selectedWords);
  };

  const scrambleWord = (word: string): string => {
    const letters = word.split('');
    for (let i = letters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [letters[i], letters[j]] = [letters[j], letters[i]];
    }
    return letters.join('');
  };

  const handleSubmit = () => {
    const isCorrect = userInput.toUpperCase() === words[currentWord].word;
    setShowResult(true);
    
    if (isCorrect) {
      const points = words[currentWord].word.length * 10;
      setScore(score + points);
    }
    
    setTimeout(() => {
      if (currentWord + 1 >= words.length) {
        handleGameEnd();
      } else {
        setCurrentWord(currentWord + 1);
        setUserInput('');
        setShowResult(false);
        setShowHint(false);
      }
    }, 2000);
  };

  const handleGameEnd = () => {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    const maxScore = words.reduce((sum, word) => sum + word.word.length * 10, 0);
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

  const reshuffleWord = () => {
    const currentWordData = words[currentWord];
    const newScrambled = scrambleWord(currentWordData.word);
    setWords(words.map((word, index) => 
      index === currentWord ? { ...word, scrambled: newScrambled } : word
    ));
  };

  if (gameState !== 'playing' || words.length === 0) {
    return null;
  }

  const currentWordData = words[currentWord];
  const progress = ((currentWord + 1) / words.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 mb-6 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Word Wizard</h2>
              <p className="text-gray-600">Level {level}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-purple-600">{score}</div>
              <div className="text-sm text-gray-600">Score</div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full"
            />
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">
              Word {currentWord + 1} of {words.length}
            </span>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Time:</span>
              <span className={`font-bold ${timeLeft <= 15 ? 'text-red-500' : 'text-purple-600'}`}>
                {timeLeft}s
              </span>
            </div>
          </div>
        </div>

        {/* Word Challenge Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentWord}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="bg-white rounded-3xl p-8 shadow-2xl"
          >
            <div className="text-center mb-8">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-6xl mb-4"
              >
                📚
              </motion.div>
              <div className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold mb-4 inline-block">
                {currentWordData.category}
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Unscramble this word:
              </h3>
              
              {/* Scrambled Letters */}
              <div className="flex justify-center space-x-2 mb-6">
                {currentWordData.scrambled.split('').map((letter, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 text-white font-bold text-xl rounded-lg flex items-center justify-center shadow-lg"
                  >
                    {letter}
                  </motion.div>
                ))}
              </div>

              {/* Hint Section */}
              <div className="mb-6">
                {showHint ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-yellow-100 text-yellow-800 p-4 rounded-xl"
                  >
                    <p className="font-semibold">💡 Hint: {currentWordData.hint}</p>
                  </motion.div>
                ) : (
                  <button
                    onClick={() => setShowHint(true)}
                    className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-2 px-6 rounded-xl transition-all duration-200"
                  >
                    💡 Show Hint
                  </button>
                )}
              </div>

              {/* Input Section */}
              <div className="max-w-md mx-auto">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value.toUpperCase())}
                  onKeyPress={(e) => e.key === 'Enter' && !showResult && handleSubmit()}
                  placeholder="Type your answer..."
                  disabled={showResult}
                  className="w-full text-center text-2xl font-bold py-4 px-6 border-2 border-purple-300 rounded-xl focus:border-purple-500 focus:outline-none mb-4"
                />
                
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={reshuffleWord}
                    disabled={showResult}
                    className="bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded-xl transition-all duration-200 flex items-center space-x-2 disabled:opacity-50"
                  >
                    <Shuffle size={18} />
                    <span>Shuffle</span>
                  </button>
                  
                  <button
                    onClick={handleSubmit}
                    disabled={showResult || !userInput.trim()}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-2 px-8 rounded-xl transition-all duration-200 disabled:opacity-50"
                  >
                    Submit
                  </button>
                </div>
              </div>
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
                  {userInput.toUpperCase() === currentWordData.word ? (
                    <div className="text-green-600">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.5 }}
                        className="text-4xl mb-2"
                      >
                        🌟
                      </motion.div>
                      <p className="text-2xl font-bold">
                        Excellent! +{currentWordData.word.length * 10} points
                      </p>
                      <p className="text-lg text-gray-600 mt-2">
                        The word was: <span className="font-bold">{currentWordData.word}</span>
                      </p>
                    </div>
                  ) : (
                    <div className="text-red-600">
                      <div className="text-4xl mb-2">📖</div>
                      <p className="text-2xl font-bold">
                        The correct word was: {currentWordData.word}
                      </p>
                      <p className="text-lg text-gray-600 mt-2">Keep practicing!</p>
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

export default WordWizard;