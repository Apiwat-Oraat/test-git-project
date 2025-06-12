import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useGame } from '../contexts/GameContext';
import { Play, Trophy, Target, Clock, Star, TrendingUp, Award, Users } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { games, progress, getTotalScore, achievements } = useGame();

  if (!user) return null;

  const completedLevels = progress.length;
  const totalLevels = games.length * 7;
  const completionRate = Math.round((completedLevels / totalLevels) * 100);
  const unlockedAchievements = achievements.filter(a => a.unlocked).length;

  const stats = [
    {
      icon: Trophy,
      label: 'Total Score',
      value: getTotalScore().toLocaleString(),
      color: 'from-yellow-400 to-orange-500',
      textColor: 'text-yellow-600',
    },
    {
      icon: Target,
      label: 'Levels Completed',
      value: `${completedLevels}/${totalLevels}`,
      color: 'from-green-400 to-green-600',
      textColor: 'text-green-600',
    },
    {
      icon: Star,
      label: 'Current Streak',
      value: `${user.streak} days`,
      color: 'from-purple-400 to-purple-600',
      textColor: 'text-purple-600',
    },
    {
      icon: Award,
      label: 'Achievements',
      value: `${unlockedAchievements}/${achievements.length}`,
      color: 'from-blue-400 to-blue-600',
      textColor: 'text-blue-600',
    },
  ];

  const recentGames = games.slice(0, 3);

  return (
    <div className="min-h-screen pt-8 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-primary-500 via-secondary-500 to-purple-500 rounded-3xl p-8 mb-8 text-white overflow-hidden relative"
        >
          <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="text-8xl opacity-20"
            >
              🌟
            </motion.div>
          </div>
          
          <div className="relative z-10">
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl md:text-5xl font-black mb-4"
            >
              Welcome back, {user.name}! 👋
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg md:text-xl opacity-90 mb-6 max-w-2xl"
            >
              Ready to continue your learning adventure? You're on level {user.level} and doing amazing!
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Link
                to="/games"
                className="inline-flex items-center space-x-2 bg-white text-primary-600 font-bold py-3 px-6 rounded-full hover:bg-gray-100 transition-all duration-200 shadow-lg"
              >
                <Play size={20} />
                <span>Continue Playing</span>
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 * index }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
                  <Icon className="text-white" size={24} />
                </div>
                <div className={`text-2xl font-bold ${stat.textColor} mb-1`}>
                  {stat.value}
                </div>
                <div className="text-gray-600 text-sm font-medium">
                  {stat.label}
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Progress Overview */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <div className="flex items-center space-x-3 mb-6">
              <TrendingUp className="text-primary-600" size={24} />
              <h2 className="text-2xl font-bold text-gray-800">Your Progress</h2>
            </div>
            
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-700 font-medium">Overall Completion</span>
                <span className="text-primary-600 font-bold">{completionRate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${completionRate}%` }}
                  transition={{ duration: 1, delay: 0.8 }}
                  className="bg-gradient-to-r from-primary-500 to-secondary-500 h-4 rounded-full"
                ></motion.div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recentGames.map((game, index) => {
                const gameProgress = progress.filter(p => p.gameId === game.id);
                const completed = gameProgress.length;
                const percentage = Math.round((completed / 7) * 100);
                
                return (
                  <motion.div
                    key={game.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="bg-gray-50 rounded-xl p-4"
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <div className={`w-10 h-10 ${game.bgColor} rounded-lg flex items-center justify-center text-white text-lg`}>
                        {game.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 text-sm">{game.title}</h3>
                        <p className="text-xs text-gray-600">{completed}/7 levels</p>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`${game.bgColor} h-2 rounded-full transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Recent Achievements */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <div className="flex items-center space-x-3 mb-6">
              <Award className="text-yellow-500" size={24} />
              <h2 className="text-xl font-bold text-gray-800">Achievements</h2>
            </div>
            
            <div className="space-y-4">
              {achievements.slice(0, 4).map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${
                    achievement.unlocked
                      ? 'bg-yellow-50 border border-yellow-200'
                      : 'bg-gray-50 border border-gray-200'
                  }`}
                >
                  <div className={`text-2xl ${achievement.unlocked ? 'grayscale-0' : 'grayscale'}`}>
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-semibold text-sm ${
                      achievement.unlocked ? 'text-yellow-800' : 'text-gray-600'
                    }`}>
                      {achievement.title}
                    </h3>
                    <p className={`text-xs ${
                      achievement.unlocked ? 'text-yellow-600' : 'text-gray-500'
                    }`}>
                      {achievement.description}
                    </p>
                    {!achievement.unlocked && (
                      <div className="mt-1">
                        <div className="w-full bg-gray-200 rounded-full h-1">
                          <div
                            className="bg-primary-500 h-1 rounded-full"
                            style={{ width: `${(achievement.progress / achievement.requirement) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                  {achievement.unlocked && (
                    <div className="text-yellow-500">
                      <Star size={16} fill="currentColor" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
            
            <Link
              to="/profile"
              className="block w-full text-center bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold py-3 px-4 rounded-xl mt-6 hover:from-primary-600 hover:to-secondary-600 transition-all duration-200"
            >
              View All Achievements
            </Link>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8 bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Quick Actions</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Play, label: 'Play Games', path: '/games', color: 'from-green-400 to-green-600' },
              { icon: Trophy, label: 'Leaderboard', path: '/leaderboard', color: 'from-yellow-400 to-orange-500' },
              { icon: Users, label: 'Profile', path: '/profile', color: 'from-blue-400 to-blue-600' },
              { icon: Clock, label: 'Time Controls', path: '/parental-controls', color: 'from-purple-400 to-purple-600' },
            ].map((action, index) => {
              const Icon = action.icon;
              return (
                <Link
                  key={index}
                  to={action.path}
                  className="group bg-gray-50 hover:bg-gray-100 rounded-xl p-4 transition-all duration-200 text-center"
                >
                  <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-200`}>
                    <Icon className="text-white" size={24} />
                  </div>
                  <span className="text-gray-700 font-medium text-sm">{action.label}</span>
                </Link>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;