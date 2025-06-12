import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { Clock, Shield, Settings, User, Bell, Eye, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

const ParentalControls: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [settings, setSettings] = useState({
    timeLimit: user?.timeLimit || 60, // minutes per day
    notifications: true,
    contentFilter: 'safe',
    reportProgress: true,
  });

  if (!user) return null;

  const handleSaveSettings = () => {
    updateProfile({ timeLimit: settings.timeLimit });
    toast.success('Parental controls updated successfully! 🔒');
  };

  const timeUsedToday = user.timeSpent || 0;
  const timeRemaining = Math.max(0, settings.timeLimit - timeUsedToday);
  const usagePercentage = Math.min(100, (timeUsedToday / settings.timeLimit) * 100);

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
            🛡️
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-black text-gray-800 mb-4">
            Parental <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">Controls</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Keep your child's learning journey safe, balanced, and age-appropriate
          </p>
        </motion.div>

        {/* Time Usage Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-primary-500 via-secondary-500 to-purple-500 rounded-3xl p-8 mb-8 text-white"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Today's Screen Time</h2>
              <p className="text-lg opacity-90">
                {timeRemaining > 0 
                  ? `${timeRemaining} minutes remaining`
                  : 'Daily limit reached'
                }
              </p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold">{timeUsedToday}m</div>
              <div className="text-sm opacity-90">of {settings.timeLimit}m</div>
            </div>
          </div>
          
          <div className="w-full bg-white/20 backdrop-blur-md rounded-full h-4">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${usagePercentage}%` }}
              transition={{ duration: 1, delay: 0.5 }}
              className={`h-4 rounded-full ${
                usagePercentage >= 90 
                  ? 'bg-red-400'
                  : usagePercentage >= 70
                  ? 'bg-yellow-400'
                  : 'bg-green-400'
              }`}
            ></motion.div>
          </div>
          
          <div className="flex justify-between text-sm opacity-90 mt-2">
            <span>0m</span>
            <span>{settings.timeLimit}m</span>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Time Management */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <div className="flex items-center space-x-3 mb-6">
              <Clock className="text-blue-500" size={24} />
              <h2 className="text-2xl font-bold text-gray-800">Time Management</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Daily Time Limit
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="range"
                    min="15"
                    max="180"
                    step="15"
                    value={settings.timeLimit}
                    onChange={(e) => setSettings({ ...settings, timeLimit: parseInt(e.target.value) })}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="bg-primary-100 text-primary-700 px-3 py-1 rounded-lg font-semibold min-w-[80px] text-center">
                    {settings.timeLimit}m
                  </div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>15m</span>
                  <span>3h</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[30, 60, 120].map((minutes) => (
                  <button
                    key={minutes}
                    onClick={() => setSettings({ ...settings, timeLimit: minutes })}
                    className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                      settings.timeLimit === minutes
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {minutes}m
                  </button>
                ))}
              </div>

              <div className="bg-blue-50 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <Clock className="text-blue-500 mt-0.5" size={20} />
                  <div>
                    <h4 className="font-semibold text-blue-800 mb-1">Smart Breaks</h4>
                    <p className="text-sm text-blue-600">
                      Automatic 5-minute breaks every 20 minutes of play time to protect young eyes and encourage healthy habits.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Safety Settings */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <div className="flex items-center space-x-3 mb-6">
              <Shield className="text-green-500" size={24} />
              <h2 className="text-2xl font-bold text-gray-800">Safety Settings</h2>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <Bell className="text-orange-500" size={20} />
                  <div>
                    <h4 className="font-semibold text-gray-800">Progress Notifications</h4>
                    <p className="text-sm text-gray-600">Get updates about your child's learning</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notifications}
                    onChange={(e) => setSettings({ ...settings, notifications: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <Eye className="text-blue-500" size={20} />
                  <div>
                    <h4 className="font-semibold text-gray-800">Weekly Reports</h4>
                    <p className="text-sm text-gray-600">Detailed progress summaries via email</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.reportProgress}
                    onChange={(e) => setSettings({ ...settings, reportProgress: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Content Filter Level
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'strict', label: 'Strict', desc: 'Maximum safety, ages 3-6' },
                    { value: 'safe', label: 'Safe', desc: 'Balanced approach, ages 7-12' },
                    { value: 'open', label: 'Open', desc: 'More freedom, ages 13+' },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className={`flex items-center p-3 rounded-lg cursor-pointer transition-all ${
                        settings.contentFilter === option.value
                          ? 'bg-primary-50 border-2 border-primary-200'
                          : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                      }`}
                    >
                      <input
                        type="radio"
                        name="contentFilter"
                        value={option.value}
                        checked={settings.contentFilter === option.value}
                        onChange={(e) => setSettings({ ...settings, contentFilter: e.target.value })}
                        className="sr-only"
                      />
                      <div className="flex-1">
                        <div className="font-semibold text-gray-800">{option.label}</div>
                        <div className="text-sm text-gray-600">{option.desc}</div>
                      </div>
                      {settings.contentFilter === option.value && (
                        <div className="text-primary-500">
                          <Lock size={20} />
                        </div>
                      )}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8 bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex items-center space-x-3 mb-6">
            <Settings className="text-purple-500" size={24} />
            <h2 className="text-2xl font-bold text-gray-800">This Week's Summary</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Total Play Time', value: '4h 32m', icon: Clock, color: 'text-blue-500' },
              { label: 'Levels Completed', value: '12', icon: User, color: 'text-green-500' },
              { label: 'Average Session', value: '23m', icon: Clock, color: 'text-orange-500' },
              { label: 'Streak Days', value: '5', icon: Shield, color: 'text-purple-500' },
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className={`w-12 h-12 ${stat.color} bg-opacity-10 rounded-xl flex items-center justify-center mx-auto mb-3`}>
                    <Icon className={stat.color} size={24} />
                  </div>
                  <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Save Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-8 text-center"
        >
          <button
            onClick={handleSaveSettings}
            className="bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white font-bold py-4 px-8 rounded-xl text-lg shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            Save Parental Controls
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default ParentalControls;