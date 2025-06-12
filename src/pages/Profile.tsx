import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useGame } from '../contexts/GameContext';
import { User, Trophy, Star, Calendar, Clock, Award, Edit3, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';

const Profile: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { progress, achievements, getTotalScore } = useGame();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: user?.name || '',
    avatar: user?.avatar || '🌟',
  });

  if (!user) return null;

  const totalLevels = progress.filter(p => p.completed).length;
  const totalStars = progress.reduce((sum, p) => sum + p.stars, 0);
  const totalTime = Math.floor(progress.reduce((sum, p) => sum + p.timeSpent, 0) / 60);
  const unlockedAchievements = achievements.filter(a => a.unlocked);

  const avatarOptions = ['🌟', '🦄', '🚀', '🎨', '🎮', '🏆', '⚡', '🌈', '🎯', '🎪', '🎭', '🎨'];

  const handleSave = () => {
    updateProfile(editData);
    setIsEditing(false);
    toast.success('Profile updated successfully! ✨');
  };

  const stats = [
    {
      icon: Trophy,
      label: 'Total Score',
      value: getTotalScore().toLocaleString(),
      color: 'from-yellow-400 to-orange-500',
      textColor: 'text-yellow-600',
    },
    {
      icon: Star,
      label: 'Stars Earned',
      value: totalStars,
      color: 'from-purple-400 to-purple-600',
      textColor: 'text-purple-600',
    },
    {
      icon: Award,
      label: 'Levels Complete',
      value: totalLevels,
      color: 'from-green-400 to-green-600',
      textColor: 'text-green-600',
    },
    {
      icon: Clock,
      label: 'Time Played',
      value: `${totalTime} hours`,
      color: 'from-blue-400 to-blue-600',
      textColor: 'text-blue-600',
    },
  ];

  return (
    <div className="min-h-screen pt-8 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-primary-500 via-secondary-500 to-purple-500 rounded-3xl p-8 mb-8 text-white relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 transform translate-x-8 -translate-y-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="text-8xl opacity-20"
            >
              ⭐
            </motion.div>
          </div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
            <div className="relative">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="w-32 h-32 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-6xl border-4 border-white/30"
              >
                {isEditing ? (
                  <div className="grid grid-cols-3 gap-1 p-2">
                    {avatarOptions.slice(0, 9).map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => setEditData({ ...editData, avatar: emoji })}
                        className={`w-8 h-8 text-lg rounded-lg transition-all ${
                          editData.avatar === emoji ? 'bg-white/40 scale-110' : 'hover:bg-white/20'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                ) : (
                  user.avatar
                )}
              </motion.div>
              
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="absolute -bottom-2 -right-2 bg-white text-primary-600 rounded-full p-2 shadow-lg hover:shadow-xl transition-all"
                >
                  <Edit3 size={16} />
                </button>
              )}
            </div>
            
            <div className="flex-1 text-center md:text-left">
              {isEditing ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    className="bg-white/20 backdrop-blur-md border border-white/30 rounded-xl px-4 py-2 text-white placeholder-white/70 text-2xl font-bold w-full md:w-auto"
                    placeholder="Your Name"
                  />
                  <div className="flex space-x-3">
                    <button
                      onClick={handleSave}
                      className="bg-white text-primary-600 font-bold py-2 px-6 rounded-xl hover:bg-gray-100 transition-all flex items-center space-x-2"
                    >
                      <Save size={18} />
                      <span>Save</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setEditData({ name: user.name, avatar: user.avatar });
                      }}
                      className="bg-white/20 backdrop-blur-md text-white font-bold py-2 px-6 rounded-xl hover:bg-white/30 transition-all flex items-center space-x-2"
                    >
                      <X size={18} />
                      <span>Cancel</span>
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h1 className="text-4xl font-bold mb-2">{user.name}</h1>
                  <p className="text-xl opacity-90 mb-4">Level {user.level} Explorer</p>
                  <div className="flex flex-col md:flex-row items-center md:items-start space-y-2 md:space-y-0 md:space-x-6 text-lg">
                    <div className="flex items-center space-x-2">
                      <Calendar size={20} />
                      <span>Joined {new Date(user.joinDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Star size={20} fill="currentColor" />
                      <span>{user.streak} day streak</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Achievements */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <div className="flex items-center space-x-3 mb-6">
              <Award className="text-yellow-500" size={24} />
              <h2 className="text-2xl font-bold text-gray-800">Achievements</h2>
            </div>
            
            <div className="space-y-4">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className={`flex items-center space-x-4 p-4 rounded-xl transition-all duration-200 ${
                    achievement.unlocked
                      ? 'bg-yellow-50 border border-yellow-200'
                      : 'bg-gray-50 border border-gray-200'
                  }`}
                >
                  <div className={`text-3xl ${achievement.unlocked ? 'grayscale-0' : 'grayscale'}`}>
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-semibold ${
                      achievement.unlocked ? 'text-yellow-800' : 'text-gray-600'
                    }`}>
                      {achievement.title}
                    </h3>
                    <p className={`text-sm ${
                      achievement.unlocked ? 'text-yellow-600' : 'text-gray-500'
                    }`}>
                      {achievement.description}
                    </p>
                    {!achievement.unlocked && (
                      <div className="mt-2">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>Progress</span>
                          <span>{achievement.progress}/{achievement.requirement}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-primary-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${(achievement.progress / achievement.requirement) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                  {achievement.unlocked && (
                    <div className="text-yellow-500">
                      <Trophy size={20} />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <div className="flex items-center space-x-3 mb-6">
              <Clock className="text-blue-500" size={24} />
              <h2 className="text-2xl font-bold text-gray-800">Recent Activity</h2>
            </div>
            
            <div className="space-y-4">
              {progress.slice(-5).reverse().map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                      L{activity.level}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">
                        Level {activity.level} Completed
                      </p>
                      <p className="text-xs text-gray-600">Score: {activity.score}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: 3 }, (_, i) => (
                      <Star
                        key={i}
                        size={12}
                        className={i < activity.stars ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                      />
                    ))}
                  </div>
                </motion.div>
              ))}
              
              {progress.length === 0 && (
                <div className="text-center py-8">
                  <div className="text-4xl mb-3">🎮</div>
                  <p className="text-gray-500">No activity yet</p>
                  <p className="text-sm text-gray-400">Start playing to see your progress here!</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;