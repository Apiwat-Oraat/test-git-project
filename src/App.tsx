import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { GameProvider } from './contexts/GameContext';
import Header from './components/Header';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import GameHub from './pages/GameHub';
import GamePlay from './pages/GamePlay';
import Profile from './pages/Profile';
import Leaderboard from './pages/Leaderboard';
import ParentalControls from './pages/ParentalControls';

function App() {
  return (
    <AuthProvider>
      <GameProvider>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-purple-50">
            <Header />
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/games" element={<GameHub />} />
                <Route path="/game/:gameId/:level?" element={<GamePlay />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/parental-controls" element={<ParentalControls />} />
              </Routes>
            </AnimatePresence>
            <Toaster
              position="top-center"
              toastOptions={{
                duration: 3000,
                style: {
                  background: '#22c55e',
                  color: 'white',
                  borderRadius: '20px',
                  fontSize: '16px',
                  fontWeight: '600',
                },
              }}
            />
          </div>
        </Router>
      </GameProvider>
    </AuthProvider>
  );
}

export default App;