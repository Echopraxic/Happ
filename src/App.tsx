import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Bell, BookOpen, Palette, Home, Timer, Menu, X } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import MoodTracker from './components/MoodTracker';
import RoutineScheduler from './components/RoutineScheduler';
import Reminders from './components/Reminders';
import BulletJournal from './components/BulletJournal';
import ThemeSelector from './components/ThemeSelector';
import PomodoroTimer from './components/PomodoroTimer';
import { Theme, themes } from './types/theme';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentTheme, setCurrentTheme] = useState<Theme>(themes.default);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('notesAppTheme');
    if (savedTheme) {
      const theme = themes[savedTheme as keyof typeof themes];
      if (theme) setCurrentTheme(theme);
    }
  }, []);

  const handleThemeChange = (themeName: string) => {
    const theme = themes[themeName as keyof typeof themes];
    if (theme) {
      setCurrentTheme(theme);
      localStorage.setItem('notesAppTheme', themeName);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    
    if (isLeftSwipe && sidebarOpen) {
      setSidebarOpen(false);
    }
    if (isRightSwipe && !sidebarOpen) {
      setSidebarOpen(true);
    }
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const navigation = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'mood', label: 'Mood Tracker', icon: Calendar },
    { id: 'routine', label: 'Routines', icon: Clock },
    { id: 'reminders', label: 'Reminders', icon: Bell },
    { id: 'journal', label: 'Journal', icon: BookOpen },
    { id: 'pomodoro', label: 'Pomodoro', icon: Timer },
    { id: 'themes', label: 'Themes', icon: Palette },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard theme={currentTheme} />;
      case 'mood':
        return <MoodTracker theme={currentTheme} />;
      case 'routine':
        return <RoutineScheduler theme={currentTheme} />;
      case 'reminders':
        return <Reminders theme={currentTheme} />;
      case 'journal':
        return <BulletJournal theme={currentTheme} />;
      case 'pomodoro':
        return <PomodoroTimer theme={currentTheme} />;
      case 'themes':
        return <ThemeSelector theme={currentTheme} onThemeChange={handleThemeChange} />;
      default:
        return <Dashboard theme={currentTheme} />;
    }
  };

  return (
    <div 
      className="min-h-screen flex relative"
      style={{ background: currentTheme.background }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 rounded-lg shadow-lg"
        style={{ 
          backgroundColor: currentTheme.cardBackground,
          color: currentTheme.textPrimary
        }}
      >
        {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={closeSidebar}
        />
      )}

      <Sidebar
        navigation={navigation}
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setSidebarOpen(false);
        }}
        theme={currentTheme}
        isOpen={sidebarOpen}
        onClose={closeSidebar}
      />
      
      <main className="flex-1 p-4 lg:p-6 lg:ml-64 transition-all duration-300">
        <div className="max-w-6xl mx-auto pt-16 lg:pt-0">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default App;