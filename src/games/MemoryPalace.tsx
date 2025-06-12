import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, RotateCcw } from 'lucide-react';

interface MemoryPalaceProps {
  level: number;
  onComplete: (result: { score: number; stars: number; completed: boolean; timeSpent: number }) => void;
  gameState: 'playing' | 'completed' | 'loading';
}

interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const MemoryPalace: React.FC<MemoryPalaceProps> = ({ level, onComplete, gameState }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120);
  const [startTime] = useState(Date.now());
  const [gamePhase, setGamePhase] = useState<'memorize' | 'play' | 'complete'>('memorize');
  const [memorizeTime, setMemorizeTime] = useState(10);

  const emojis = [
    '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼',
    '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔',
    '🦄', '🐝', '🐛', '🦋', '🐌', '🐞', '🐜', '🕷️',
    '🌸', '🌺', '🌻', '🌷', '🌹', '🌼', '🌿', '🍀',
    '⭐', '🌟', '✨', '💫', '🌙', '☀️', '🌈', '🔥',
    '🎈', '🎁', '🎂', '🎉', '🎊', '🎯', '🎨', '🎭'
  ];

  useEffect(() => {
    if (gameState === 'playing') {
      initializeGame();
    }
  }, [level, gameState]);

  useEffect(() => {
    if (gamePhase === 'memorize' && memorizeTime > 0) {
      const timer = setTimeout(() => setMemorizeTime(memorizeTime - 1), 1000);
      return () => clearTimeout(timer);
    } else if (gamePhase === 'memorize' && memorizeTime === 0) {
      setGamePhase('play');
      setCards(cards.map(card => ({ ...card, isFlipped: false })));
    }
  }, [memorizeTime, gamePhase, cards]);

  useEffect(() => {
    if (gamePhase === 'play' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleGameEnd();
    }
  }, [timeLeft, gamePhase]);

  useEffect(() => {
    if (flippedCards.length === 2) {
      const [first, second] = flippedCards;
      const firstCard = cards.find(card => card.id === first);
      const secondCard = cards.find(card => card.id === second);
      
      if (firstCard && secondCard && firstCard.emoji === secondCard.emoji) {
        // Match found
        setTimeout(() => {
          setCards(cards.map(card => 
            card.id === first || card.id === second 
              ? { ...card, isMatched: true }
              : card
          ));
          setScore(score + 100);
          setFlippedCards([]);
          
          // Check if game is complete
          const newCards = cards.map(card => 
            card.id === first || card.id === second 
              ? { ...card, isMatched: true }
              : card
          );
          if (newCards.every(card => card.isMatched)) {
            setTimeout(() => handleGameEnd(), 500);
          }
        }, 1000);
      } else {
        // No match
        setTimeout(() => {
          setCards(cards.map(card => 
            card.id === first || card.id === second 
              ? { ...card, isFlipped: false }
              : card
          ));
          setFlippedCards([]);
        }, 1000);
      }
      setMoves(moves + 1);
    }
  }, [flippedCards, cards, score, moves]);

  const initializeGame = () => {
    const gridSize = Math.min(4 + level, 6); // 4x4 to 6x6 grid
    const totalCards = gridSize * gridSize;
    const pairsNeeded = totalCards / 2;
    
    const selectedEmojis = emojis.slice(0, pairsNeeded);
    const cardEmojis = [...selectedEmojis, ...selectedEmojis];
    
    const shuffledCards = cardEmojis
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: true, // Start with all cards visible for memorization
        isMatched: false,
      }));
    
    setCards(shuffledCards);
    setFlippedCards([]);
    setScore(0);
    setMoves(0);
    setGamePhase('memorize');
    setMemorizeTime(8 + level * 2); // More time for higher levels
    setTimeLeft(60 + level * 15);
  };

  const handleCardClick = (cardId: number) => {
    if (gamePhase !== 'play' || flippedCards.length >= 2) return;
    
    const card = cards.find(c => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched) return;
    
    setCards(cards.map(c => 
      c.id === cardId ? { ...c, isFlipped: true } : c
    ));
    setFlippedCards([...flippedCards, cardId]);
  };

  const handleGameEnd = () => {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    const matchedPairs = cards.filter(card => card.isMatched).length / 2;
    const totalPairs = cards.length / 2;
    const completionRate = (matchedPairs / totalPairs) * 100;
    
    let stars = 1;
    if (completionRate === 100 && moves <= totalPairs * 1.5) stars = 3;
    else if (completionRate >= 80) stars = 2;
    
    onComplete({
      score,
      stars,
      completed: completionRate === 100,
      timeSpent,
    });
  };

  if (gameState !== 'playing' || cards.length === 0) {
    return null;
  }

  const gridSize = Math.sqrt(cards.length);
  const matchedPairs = cards.filter(card => card.isMatched).length / 2;
  const totalPairs = cards.length / 2;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 mb-6 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Memory Palace</h2>
              <p className="text-gray-600">Level {level}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-pink-600">{score}</div>
              <div className="text-sm text-gray-600">Score</div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-gray-800">{matchedPairs}/{totalPairs}</div>
              <div className="text-sm text-gray-600">Pairs Found</div>
            </div>
            <div>
              <div className="text-lg font-bold text-gray-800">{moves}</div>
              <div className="text-sm text-gray-600">Moves</div>
            </div>
            <div>
              <div className={`text-lg font-bold ${timeLeft <= 10 ? 'text-red-500' : 'text-pink-600'}`}>
                {gamePhase === 'memorize' ? memorizeTime : timeLeft}s
              </div>
              <div className="text-sm text-gray-600">
                {gamePhase === 'memorize' ? 'Memorize' : 'Time Left'}
              </div>
            </div>
          </div>
        </div>

        {/* Game Phase Indicator */}
        <AnimatePresence>
          {gamePhase === 'memorize' && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-yellow-100 border border-yellow-300 rounded-2xl p-4 mb-6 text-center"
            >
              <div className="flex items-center justify-center space-x-2 text-yellow-800">
                <Eye size={24} />
                <span className="text-lg font-bold">
                  Memorize the cards! {memorizeTime}s remaining
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Game Board */}
        <div className="bg-white rounded-3xl p-6 shadow-2xl">
          <div className="text-center mb-6">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-6xl mb-4"
            >
              🧠
            </motion.div>
            <h3 className="text-2xl font-bold text-gray-800">
              {gamePhase === 'memorize' ? 'Study the Pattern' : 'Find the Matching Pairs'}
            </h3>
          </div>

          {/* Card Grid */}
          <div 
            className={`grid gap-3 max-w-2xl mx-auto`}
            style={{ 
              gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
              aspectRatio: '1'
            }}
          >
            {cards.map((card) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: card.id * 0.05 }}
                whileHover={{ scale: gamePhase === 'play' && !card.isFlipped && !card.isMatched ? 1.05 : 1 }}
                whileTap={{ scale: gamePhase === 'play' && !card.isFlipped && !card.isMatched ? 0.95 : 1 }}
                onClick={() => handleCardClick(card.id)}
                className={`
                  aspect-square rounded-xl cursor-pointer transition-all duration-300 flex items-center justify-center text-2xl md:text-3xl font-bold shadow-lg
                  ${card.isFlipped || card.isMatched
                    ? card.isMatched 
                      ? 'bg-gradient-to-br from-green-400 to-green-500 text-white'
                      : 'bg-gradient-to-br from-pink-400 to-purple-400 text-white'
                    : 'bg-gradient-to-br from-gray-300 to-gray-400 hover:from-gray-400 hover:to-gray-500'
                  }
                  ${gamePhase === 'play' && !card.isFlipped && !card.isMatched ? 'hover:shadow-xl' : ''}
                `}
              >
                <AnimatePresence mode="wait">
                  {card.isFlipped || card.isMatched ? (
                    <motion.span
                      key="emoji"
                      initial={{ rotateY: -90 }}
                      animate={{ rotateY: 0 }}
                      exit={{ rotateY: 90 }}
                      transition={{ duration: 0.3 }}
                    >
                      {card.emoji}
                    </motion.span>
                  ) : (
                    <motion.div
                      key="back"
                      initial={{ rotateY: -90 }}
                      animate={{ rotateY: 0 }}
                      exit={{ rotateY: 90 }}
                      transition={{ duration: 0.3 }}
                      className="text-gray-600"
                    >
                      <EyeOff size={24} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          {/* Game Controls */}
          {gamePhase === 'play' && (
            <div className="flex justify-center mt-6">
              <button
                onClick={initializeGame}
                className="bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center space-x-2"
              >
                <RotateCcw size={20} />
                <span>Restart Level</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemoryPalace;