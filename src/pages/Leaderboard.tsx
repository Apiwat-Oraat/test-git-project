import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useGame } from '../contexts/GameContext';
import { Trophy, Medal, Star, Crown, Users, TrendingUp } from 'lucide-react';

interface LeaderboardEntry {
  id: string;
  name: string;
  avatar: string;
  score: number;
  level: number;
  streak: number;
  completedLevels: number;
}

const Leaderboard: React.FC = () => {
  const { user } = useAuth();
  const { getTotalScore, progress } = useGame();
  const [activeTab, setActiveTab] = useState<'global' | 'friends'>('global');

  // Mock leaderboard data (in a real app, this would come from an API)
  const mockLeaderboard: LeaderboardEntry[] = [
    {
      id: '1',
      name: 'Emma the Explorer',
      avatar: '🦄',
      score: 15420,
      level: 12,
      streak: 15,
      completedLevels: 48,
    },
    {
      id: '2',
      name: 'Max the Magnificent',
      avatar: '🚀',
      score: 14850,
      level: 11,
      streak: 12,
      completedLevels: 45,
    },
    {
      id: '3',
      name: 'Luna the Learner',
      avatar: '🌟',
      score: 13920,
      level: 10,
      streak: 18,
      completedLevels: 42,
    },
    {
      id: '4',
      name: 'Alex the Achiever',
      avatar: '⚡',
      score: 12750,
      level: 9,
      streak: 8,
      completedLevels: 38,
    },
    {
      id: '5',
      name: 'Sam the Scholar',
      avatar: '🎯',
      score: 11680,
      level: 8,
      streak: 22,
      completedLevels: 35,
    },
  ];

  // Add current user to leaderboard if authenticated
  const fullLeaderboard = user ? [
    ...mockLeaderboard,
    {
      id: user.id,
      name: user.name,
      avatar: user.avatar,
      score: getTotalScore(),
      level: user.level,
      streak: user.streak,
      completedLevels: progress.filter(p => p.completed).length,
    }
  ].sort((a, b) => b.score - a.score) : mockLeaderboard;

  const currentUserRank = user ? fullLeaderboard.findIndex(entry => entry.id === user.id) + 1 : 0;

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return { icon: Crown, color: 'text-yellow-500', bg: 'bg-yellow-100' };
      case 2:
        return { icon: Medal, color: 'text-gray-400', bg: 'bg-gray-100' };
      case 3:
        return { icon: Medal, color: 'text-orange-500', bg: 'bg-orange-100' };
      default:
        return { icon: Trophy, color: 'text-blue-500', bg: 'bg-blue-100' };
    }
  };

  const getRankColors = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-orange-500';
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-400';
      case 3:
        return 'bg-gradient-to-r from-orange-400 to-red-500';
      default:
        return 'bg-gradient-to-r from-blue-400 to-blue-500';
    }
  };

  return (
    <div className="min-h-screen pt-8 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className="text-6xl md:text-8xl mb-6"
          >
            🏆
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-black text-gray-800 mb-4">
            <span className="bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
              Leaderboard
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            See how you stack up against other amazing learners!
          </p>
        </motion.div>

        {/* Current User Rank Card */}
        {user && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-r from-primary-500 via-secondary-500 to-purple-500 rounded-3xl p-6 mb-8 text-white"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-2xl border-2 border-white/30">
                  {user.avatar}
                </div>
                <div>
                  <h3 className="text-xl font-bold">Your Rank</h3>
                  <p className="text-lg opacity-90">#{currentUserRank} of {fullLeaderboard.length}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">{getTotalScore().toLocaleString()}</div>
                <div className="text-sm opacity-90">Total Score</div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tab Navigation */}
        <div className="flex mb-8">
          <div className="bg-white rounded-2xl p-1 shadow-lg border border-gray-100">
            {[
              { key: 'global', label: 'Global', icon: Users },
              { key: 'friends', label: 'Friends', icon: Star },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as 'global' | 'friends')}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                    activeTab === tab.key
                      ? 'bg-primary-500 text-white shadow-md'
                      : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={18} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden"
        >
          {/* Top 3 Podium */}
          <div className="bg-gradient-to-r from-primary-50 to-secondary-50 p-8">
            <div className="flex justify-center items-end space-x-4">
              {/* Second Place */}
              {fullLeaderboard[1] && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="text-center"
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center text-3xl mb-3 mx-auto border-4 border-white shadow-lg">
                    {fullLeaderboard[1].avatar}
                  </div>
                  <div className="bg-gradient-to-r from-gray-300 to-gray-400 text-white px-4 py-8 rounded-t-2xl min-h-[120px] flex flex-col justify-end">
                    <div className="text-2xl font-bold mb-1">2</div>
                    <div className="text-sm font-semibold mb-1">{fullLeaderboard[1].name}</div>
                    <div className="text-xs opacity-90">{fullLeaderboard[1].score.toLocaleString()}</div>
                  </div>
                </motion.div>
              )}

              {/* First Place */}
              {fullLeaderboard[0] && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="text-center"
                >
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                    className="text-4xl mb-2"
                  >
                    👑
                  </motion.div>
                  <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-4xl mb-3 mx-auto border-4 border-white shadow-lg">
                    {fullLeaderboard[0].avatar}
                  </div>
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-10 rounded-t-2xl min-h-[140px] flex flex-col justify-end">
                    <div className="text-3xl font-bold mb-1">1</div>
                    <div className="text-sm font-semibold mb-1">{fullLeaderboard[0].name}</div>
                    <div className="text-xs opacity-90">{fullLeaderboard[0].score.toLocaleString()}</div>
                  </div>
                </motion.div>
              )}

              {/* Third Place */}
              {fullLeaderboard[2] && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="text-center"
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-3xl mb-3 mx-auto border-4 border-white shadow-lg">
                    {fullLeaderboard[2].avatar}
                  </div>
                  <div className="bg-gradient-to-r from-orange-400 to-red-500 text-white px-4 py-6 rounded-t-2xl min-h-[100px] flex flex-col justify-end">
                    <div className="text-2xl font-bold mb-1">3</div>
                    <div className="text-sm font-semibold mb-1">{fullLeaderboard[2].name}</div>
                    <div className="text-xs opacity-90">{fullLeaderboard[2].score.toLocaleString()}</div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Rest of Leaderboard */}
          <div className="p-6">
            <div className="space-y-3">
              {fullLeaderboard.slice(3, 10).map((entry, index) => {
                const rank = index + 4;
                const rankInfo = getRankIcon(rank);
                const Icon = rankInfo.icon;
                const isCurrentUser = user && entry.id === user.id;
                
                return (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 + index * 0.1 }}
                    className={`flex items-center space-x-4 p-4 rounded-2xl transition-all duration-200 ${
                      isCurrentUser
                        ? 'bg-gradient-to-r from-primary-50 to-secondary-50 border-2 border-primary-200'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center space-x-3 min-w-0 flex-1">
                      <div className={`w-8 h-8 ${rankInfo.bg} rounded-full flex items-center justify-center`}>
                        <span className={`text-sm font-bold ${rankInfo.color}`}>#{rank}</span>
                      </div>
                      
                      <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-full flex items-center justify-center text-lg border-2 border-white shadow-md">
                        {entry.avatar}
                      </div>
                      
                      <div className="min-w-0 flex-1">
                        <h3 className={`font-semibold truncate ${
                          isCurrentUser ? 'text-primary-700' : 'text-gray-800'
                        }`}>
                          {entry.name} {isCurrentUser && '(You)'}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>Level {entry.level}</span>
                          <span>{entry.streak} streak</span>
                          <span>{entry.completedLevels} levels</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className={`text-xl font-bold ${
                        isCurrentUser ? 'text-primary-600' : 'text-gray-800'
                      }`}>
                        {entry.score.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">points</div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Friends Tab Content */}
        {activeTab === 'friends' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 bg-white rounded-3xl p-8 shadow-lg border border-gray-100 text-center"
          >
            <div className="text-6xl mb-4">👥</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Friends Feature Coming Soon!</h3>
            <p className="text-gray-600 mb-6">
              Connect with friends and compete in private leaderboards. This feature is currently in development.
            </p>
            <div className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-6 py-3 rounded-xl font-semibold inline-block">
              Stay tuned! 🚀
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;