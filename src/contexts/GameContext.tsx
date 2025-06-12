import React, { createContext, useContext, useState, useEffect } from 'react';

export interface GameProgress {
  gameId: string;
  level: number;
  completed: boolean;
  score: number;
  stars: number;
  timeSpent: number;
}

export interface Game {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  bgColor: string;
  totalLevels: number;
  category: string;
}

interface GameContextType {
  games: Game[];
  progress: GameProgress[];
  updateProgress: (gameId: string, level: number, score: number, stars: number) => void;
  getGameProgress: (gameId: string) => GameProgress[];
  getTotalScore: () => number;
  achievements: Achievement[];
  checkAchievements: () => void;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  requirement: number;
  progress: number;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

const GAMES: Game[] = [
  {
    id: 'math-adventure',
    title: 'Math Adventure',
    description: 'Solve puzzles and equations in magical lands!',
    icon: '🧮',
    color: 'text-blue-600',
    bgColor: 'bg-gradient-to-br from-blue-400 to-blue-600',
    totalLevels: 7,
    category: 'Mathematics',
  },
  {
    id: 'word-wizard',
    title: 'Word Wizard',
    description: 'Cast spells with vocabulary and spelling!',
    icon: '📚',
    color: 'text-purple-600',
    bgColor: 'bg-gradient-to-br from-purple-400 to-purple-600',
    totalLevels: 7,
    category: 'Language',
  },
  {
    id: 'science-lab',
    title: 'Science Lab',
    description: 'Conduct experiments and discover wonders!',
    icon: '🔬',
    color: 'text-green-600',
    bgColor: 'bg-gradient-to-br from-green-400 to-green-600',
    totalLevels: 7,
    category: 'Science',
  },
  {
    id: 'memory-palace',
    title: 'Memory Palace',
    description: 'Train your brain with memory challenges!',
    icon: '🧠',
    color: 'text-pink-600',
    bgColor: 'bg-gradient-to-br from-pink-400 to-pink-600',
    totalLevels: 7,
    category: 'Memory',
  },
  {
    id: 'pattern-quest',
    title: 'Pattern Quest',
    description: 'Discover sequences and logical patterns!',
    icon: '🔍',
    color: 'text-indigo-600',
    bgColor: 'bg-gradient-to-br from-indigo-400 to-indigo-600',
    totalLevels: 7,
    category: 'Logic',
  },
  {
    id: 'geography-explorer',
    title: 'Geography Explorer',
    description: 'Travel the world and learn about places!',
    icon: '🌍',
    color: 'text-teal-600',
    bgColor: 'bg-gradient-to-br from-teal-400 to-teal-600',
    totalLevels: 7,
    category: 'Geography',
  },
  {
    id: 'creativity-canvas',
    title: 'Creativity Canvas',
    description: 'Express yourself through art and imagination!',
    icon: '🎨',
    color: 'text-orange-600',
    bgColor: 'bg-gradient-to-br from-orange-400 to-orange-600',
    totalLevels: 7,
    category: 'Art',
  },
];

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [progress, setProgress] = useState<GameProgress[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: 'first-game',
      title: 'First Steps',
      description: 'Complete your first game level',
      icon: '🌟',
      unlocked: false,
      requirement: 1,
      progress: 0,
    },
    {
      id: 'speed-demon',
      title: 'Speed Demon',
      description: 'Complete a level in under 30 seconds',
      icon: '⚡',
      unlocked: false,
      requirement: 1,
      progress: 0,
    },
    {
      id: 'perfectionist',
      title: 'Perfectionist',
      description: 'Get 3 stars on 10 levels',
      icon: '⭐',
      unlocked: false,
      requirement: 10,
      progress: 0,
    },
    {
      id: 'explorer',
      title: 'Game Explorer',
      description: 'Try all 7 different games',
      icon: '🎮',
      unlocked: false,
      requirement: 7,
      progress: 0,
    },
    {
      id: 'master',
      title: 'Game Master',
      description: 'Complete all levels in any game',
      icon: '👑',
      unlocked: false,
      requirement: 7,
      progress: 0,
    },
  ]);

  useEffect(() => {
    const savedProgress = localStorage.getItem('learnThroughPlay_progress');
    const savedAchievements = localStorage.getItem('learnThroughPlay_achievements');
    
    if (savedProgress) {
      setProgress(JSON.parse(savedProgress));
    }
    if (savedAchievements) {
      setAchievements(JSON.parse(savedAchievements));
    }
  }, []);

  const updateProgress = (gameId: string, level: number, score: number, stars: number) => {
    const newProgress = {
      gameId,
      level,
      completed: true,
      score,
      stars,
      timeSpent: Math.floor(Math.random() * 120) + 30, // Random time for demo
    };

    setProgress(prev => {
      const existingIndex = prev.findIndex(p => p.gameId === gameId && p.level === level);
      let updated;
      
      if (existingIndex >= 0) {
        updated = [...prev];
        updated[existingIndex] = { ...updated[existingIndex], ...newProgress };
      } else {
        updated = [...prev, newProgress];
      }
      
      localStorage.setItem('learnThroughPlay_progress', JSON.stringify(updated));
      return updated;
    });

    checkAchievements();
  };

  const getGameProgress = (gameId: string) => {
    return progress.filter(p => p.gameId === gameId);
  };

  const getTotalScore = () => {
    return progress.reduce((total, p) => total + p.score, 0);
  };

  const checkAchievements = () => {
    setAchievements(prev => {
      const updated = prev.map(achievement => {
        let newProgress = achievement.progress;
        let unlocked = achievement.unlocked;

        switch (achievement.id) {
          case 'first-game':
            newProgress = progress.length > 0 ? 1 : 0;
            break;
          case 'perfectionist':
            newProgress = progress.filter(p => p.stars === 3).length;
            break;
          case 'explorer':
            const uniqueGames = new Set(progress.map(p => p.gameId));
            newProgress = uniqueGames.size;
            break;
          case 'master':
            const gameCompletions = GAMES.map(game => {
              const gameProgress = progress.filter(p => p.gameId === game.id);
              return gameProgress.length === game.totalLevels ? 1 : 0;
            });
            newProgress = gameCompletions.reduce((sum, completion) => sum + completion, 0);
            break;
        }

        if (newProgress >= achievement.requirement && !unlocked) {
          unlocked = true;
        }

        return { ...achievement, progress: newProgress, unlocked };
      });

      localStorage.setItem('learnThroughPlay_achievements', JSON.stringify(updated));
      return updated;
    });
  };

  const value = {
    games: GAMES,
    progress,
    updateProgress,
    getGameProgress,
    getTotalScore,
    achievements,
    checkAchievements,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};