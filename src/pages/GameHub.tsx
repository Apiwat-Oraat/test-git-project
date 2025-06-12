import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useGame } from '../contexts/GameContext';
import { Play, Lock, Star, Trophy, Clock } from 'lucide-react';

const GameHub: React.FC = () => {
  const { games, progress, getGameProgress } = useGame();

  return (
    <div className="min-h-screen pt-8 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className="text-6xl md:text-8xl mb-6"
          >
            🎮
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-black text-gray-800 mb-4">
            Choose Your <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">Adventure!</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Dive into 7 exciting educational games, each with 7 challenging levels. Learn while having fun!
          </p>
        </motion.div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {games.map((game, index) => {
            const gameProgress = getGameProgress(game.id);
            const completedLevels = gameProgress.filter(p => p.completed).length;
            const totalStars = gameProgress.reduce((sum, p) => sum + p.stars, 0);
            const completionPercentage = Math.round((completedLevels / game.totalLevels) * 100);
            
            return (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative"
              >
                <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 h-full flex flex-col group-hover:shadow-2xl transition-all duration-300">
                  {/* Game Icon & Header */}
                  <div className="text-center mb-6">
                    <motion.div
                      className={`w-20 h-20 ${game.bgColor} rounded-2xl flex items-center justify-center text-4xl mx-auto mb-4 shadow-lg`}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      {game.icon}
                    </motion.div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{game.title}</h3>
                    <p className="text-gray-600 text-sm mb-3">{game.description}</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${game.color} bg-opacity-10`}>
                      {game.category}
                    </span>
                  </div>

                  {/* Progress Section */}
                  <div className="flex-1 mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Progress</span>
                      <span className={`text-sm font-bold ${game.color}`}>
                        {completedLevels}/{game.totalLevels}
                      </span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${completionPercentage}%` }}
                        transition={{ duration: 1, delay: index * 0.1 + 0.5 }}
                        className={`${game.bgColor} h-2 rounded-full`}
                      ></motion.div>
                    </div>

                    {/* Stats */}
                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center space-x-1">
                        <Star className="text-yellow-500" size={16} fill="currentColor" />
                        <span className="font-semibold text-gray-700">{totalStars}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Trophy className="text-orange-500" size={16} />
                        <span className="font-semibold text-gray-700">{completionPercentage}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Link
                    to={`/game/${game.id}`}
                    className={`w-full ${game.bgColor} hover:shadow-lg text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 group-hover:scale-105`}
                  >
                    <Play size={20} />
                    <span>{completedLevels > 0 ? 'Continue' : 'Start Playing'}</span>
                  </Link>
                </div>

                {/* Achievement Badge */}
                {completionPercentage === 100 && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 1, type: "spring", stiffness: 200 }}
                    className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full p-2 shadow-lg"
                  >
                    <Trophy size={20} />
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Stats Summary */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-16 bg-gradient-to-r from-primary-500 via-secondary-500 to-purple-500 rounded-3xl p-8 text-white"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Your Gaming Stats</h2>
            <p className="text-lg opacity-90">Keep up the amazing progress!</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              {
                icon: Play,
                label: 'Games Played',
                value: games.filter(g => getGameProgress(g.id).length > 0).length,
                suffix: `/${games.length}`,
              },
              {
                icon: Trophy,
                label: 'Levels Completed',
                value: progress.filter(p => p.completed).length,
                suffix: `/${games.length * 7}`,
              },
              {
                icon: Star,
                label: 'Stars Earned',
                value: progress.reduce((sum, p) => sum + p.stars, 0),
                suffix: '',
              },
              {
                icon: Clock,
                label: 'Time Played',
                value: Math.floor(progress.reduce((sum, p) => sum + p.timeSpent, 0) / 60),
                suffix: ' hrs',
              },
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 mb-3 mx-auto w-fit">
                    <Icon size={32} />
                  </div>
                  <div className="text-2xl font-bold">
                    {stat.value}
                    <span className="text-lg opacity-75">{stat.suffix}</span>
                  </div>
                  <div className="text-sm opacity-90">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default GameHub;