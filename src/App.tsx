import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Dashboard from './components/Dashboard';
import GuestCombiner from './components/GuestCombiner';
import BanChecker from './components/BanChecker';

function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const navigate = useNavigate();

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
    document.body.classList.toggle('light');
  };

  return (
    <div className={`min-h-screen ${isDarkTheme ? 'dark' : ''}`}>
      <header className="bg-header p-4 flex items-center justify-between shadow-lg">
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="text-2xl hover:opacity-80 transition-opacity p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label="Toggle Menu"
        >
          <svg className="w-6 h-6 text-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-indigo-600 text-transparent bg-clip-text">
          Exe Tools Hub
        </h2>
        <button 
          onClick={toggleTheme}
          className="hover:opacity-80 transition-opacity p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          {isDarkTheme ? '🌗' : '🌕'}
        </button>
      </header>

      <div className="flex">
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              initial={{ x: -200 }}
              animate={{ x: 0 }}
              exit={{ x: -200 }}
              className="w-64 bg-sidebar p-6 flex flex-col gap-4 fixed h-full z-10 shadow-xl"
            >
              <button
                onClick={() => {
                  navigate('/');
                  setIsSidebarOpen(false);
                }}
                className="p-3 button-gradient text-white rounded-lg font-semibold hover:opacity-90 transition-all duration-200 transform hover:-translate-y-0.5"
              >
                Dashboard
              </button>
              <button
                onClick={() => {
                  navigate('/guest-combiner');
                  setIsSidebarOpen(false);
                }}
                className="p-3 bg-tool text-text rounded-lg hover:bg-hover transition-all duration-200 transform hover:-translate-y-0.5 flex items-center justify-between"
              >
                <span>Guest Combiner</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <button
                onClick={() => {
                  navigate('/ban-checker');
                  setIsSidebarOpen(false);
                }}
                className="p-3 bg-tool text-text rounded-lg hover:bg-hover transition-all duration-200 transform hover:-translate-y-0.5 flex items-center justify-between"
              >
                <span>Ban Checker</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <main className="flex-1 p-8 bg-background min-h-[calc(100vh-4rem)]">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/guest-combiner" element={<GuestCombiner />} />
            <Route path="/ban-checker" element={<BanChecker />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}