import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2 } from 'lucide-react';
import { Theme } from '../types/theme';

interface PomodoroTimerProps {
  theme: Theme;
}

const PomodoroTimer: React.FC<PomodoroTimerProps> = ({ theme }) => {
  const [selectedDuration, setSelectedDuration] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const timerOptions = [
    { duration: 25, label: '25 min', color: '#dc2626', bgColor: '#fef2f2' },
    { duration: 15, label: '15 min', color: '#f59e0b', bgColor: '#fffbeb' },
    { duration: 5, label: '5 min', color: '#22c55e', bgColor: '#f0fdf4' }
  ];

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsCompleted(true);
            // Play notification sound (browser notification)
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification('Pomodoro Complete!', {
                body: 'Time to take a break!',
                icon: '🍅'
              });
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  const handleDurationChange = (duration: number) => {
    setSelectedDuration(duration);
    setTimeLeft(duration * 60);
    setIsRunning(false);
    setIsCompleted(false);
  };

  const toggleTimer = () => {
    if (timeLeft === 0) {
      handleReset();
    } else {
      setIsRunning(!isRunning);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(selectedDuration * 60);
    setIsCompleted(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    const totalSeconds = selectedDuration * 60;
    return ((totalSeconds - timeLeft) / totalSeconds) * 100;
  };

  const currentOption = timerOptions.find(opt => opt.duration === selectedDuration);

  // Request notification permission on component mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2" style={{ color: theme.textPrimary }}>
          Pomodoro Timer
        </h2>
        <p style={{ color: theme.textSecondary }}>
          Stay focused with the Pomodoro Technique
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div
            className="p-4 lg:p-8 rounded-xl shadow-sm border text-center"
            style={{
              backgroundColor: theme.cardBackground,
              borderColor: theme.border
            }}
          >
            {/* Timer Options */}
            <div className="flex justify-center gap-2 lg:gap-4 mb-6 lg:mb-8">
              {timerOptions.map(option => (
                <button
                  key={option.duration}
                  onClick={() => handleDurationChange(option.duration)}
                  className={`px-3 lg:px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm lg:text-base ${
                    selectedDuration === option.duration ? 'shadow-md transform scale-105' : 'hover:shadow-sm'
                  }`}
                  style={{
                    backgroundColor: selectedDuration === option.duration ? option.color : option.bgColor,
                    color: selectedDuration === option.duration ? 'white' : option.color,
                    border: `2px solid ${option.color}`
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>

            {/* Tomato Timer Display */}
            <div className="relative mb-6 lg:mb-8">
              <div
                className="w-48 h-48 lg:w-64 lg:h-64 mx-auto rounded-full flex items-center justify-center relative overflow-hidden shadow-lg"
                style={{ backgroundColor: currentOption?.bgColor }}
              >
                {/* Progress Ring */}
                <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                <circle
                  cx="50%"
                  cy="50%"
                  r="90"
                  className="lg:hidden"
                  fill="none"
                  stroke={currentOption?.color}
                  strokeWidth="6"
                  strokeOpacity="0.2"
                />
                <circle
                  cx="50%"
                  cy="50%"
                  r="90"
                  className="lg:hidden transition-all duration-1000 ease-out"
                  fill="none"
                  stroke={currentOption?.color}
                  strokeWidth="6"
                  strokeDasharray={`${2 * Math.PI * 90}`}
                  strokeDashoffset={`${2 * Math.PI * 90 * (1 - getProgress() / 100)}`}
                  strokeLinecap="round"
                />
                <circle
                  cx="50%"
                  cy="50%"
                  r="120"
                  className="hidden lg:block"
                  fill="none"
                  stroke={currentOption?.color}
                  strokeWidth="8"
                  strokeOpacity="0.2"
                />
                <circle
                  cx="50%"
                  cy="50%"
                  r="120"
                  className="hidden lg:block transition-all duration-1000 ease-out"
                  fill="none"
                  stroke={currentOption?.color}
                  strokeWidth="8"
                  strokeDasharray={`${2 * Math.PI * 120}`}
                  strokeDashoffset={`${2 * Math.PI * 120 * (1 - getProgress() / 100)}`}
                  strokeLinecap="round"
                />
              </svg>

                {/* Tomato Shape */}
                <div className="relative z-10 text-center">
                  <div 
                    className="text-6xl lg:text-8xl mb-1 lg:mb-2 filter drop-shadow-lg"
                    style={{ 
                      color: currentOption?.color,
                      textShadow: '0 4px 8px rgba(0,0,0,0.1)'
                    }}
                  >
                    🍅
                  </div>
                  <div 
                    className="text-2xl lg:text-3xl font-bold"
                    style={{ color: currentOption?.color }}
                  >
                    {formatTime(timeLeft)}
                  </div>
                  {isCompleted && (
                    <div className="text-lg font-medium mt-2" style={{ color: currentOption?.color }}>
                      Complete! 🎉
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex justify-center gap-2 lg:gap-4">
              <button
                onClick={toggleTimer}
                className="flex items-center px-4 lg:px-6 py-2 lg:py-3 rounded-lg font-medium text-white shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-105 text-sm lg:text-base"
                style={{ backgroundColor: currentOption?.color }}
              >
                {isRunning ? (
                  <>
                    <Pause className="w-4 h-4 lg:w-5 lg:h-5 mr-1 lg:mr-2" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 lg:w-5 lg:h-5 mr-1 lg:mr-2" />
                    {timeLeft === 0 ? 'Start' : 'Resume'}
                  </>
                )}
              </button>
              
              <button
                onClick={handleReset}
                className="flex items-center px-4 lg:px-6 py-2 lg:py-3 rounded-lg font-medium border transition-all duration-200 hover:shadow-sm text-sm lg:text-base"
                style={{ 
                  borderColor: currentOption?.color,
                  color: currentOption?.color
                }}
              >
                <RotateCcw className="w-4 h-4 lg:w-5 lg:h-5 mr-1 lg:mr-2" />
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Panel */}
        <div className="space-y-6">
          <div
            className="p-6 rounded-xl shadow-sm border"
            style={{
              backgroundColor: theme.cardBackground,
              borderColor: theme.border
            }}
          >
            <h3 className="text-xl font-semibold mb-4" style={{ color: theme.textPrimary }}>
              Session Stats
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span style={{ color: theme.textSecondary }}>Current Session</span>
                <span style={{ color: theme.textPrimary }} className="font-medium">
                  {selectedDuration} min
                </span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: theme.textSecondary }}>Progress</span>
                <span style={{ color: theme.textPrimary }} className="font-medium">
                  {Math.round(getProgress())}%
                </span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: theme.textSecondary }}>Status</span>
                <span 
                  className="font-medium"
                  style={{ 
                    color: isCompleted ? '#22c55e' : isRunning ? '#f59e0b' : theme.textSecondary 
                  }}
                >
                  {isCompleted ? 'Complete' : isRunning ? 'Running' : 'Paused'}
                </span>
              </div>
            </div>
          </div>

          <div
            className="p-6 rounded-xl shadow-sm border"
            style={{
              backgroundColor: theme.cardBackground,
              borderColor: theme.border
            }}
          >
            <h3 className="text-xl font-semibold mb-4" style={{ color: theme.textPrimary }}>
              Pomodoro Tips
            </h3>
            <div className="space-y-3 text-sm" style={{ color: theme.textSecondary }}>
              <div className="flex items-start">
                <span className="w-2 h-2 rounded-full mr-3 mt-2" style={{ backgroundColor: '#dc2626' }}></span>
                <span>25 min: Deep focus work sessions</span>
              </div>
              <div className="flex items-start">
                <span className="w-2 h-2 rounded-full mr-3 mt-2" style={{ backgroundColor: '#f59e0b' }}></span>
                <span>15 min: Quick tasks and reviews</span>
              </div>
              <div className="flex items-start">
                <span className="w-2 h-2 rounded-full mr-3 mt-2" style={{ backgroundColor: '#22c55e' }}></span>
                <span>5 min: Short breaks and stretches</span>
              </div>
            </div>
          </div>

          <div
            className="p-6 rounded-xl shadow-sm border"
            style={{
              backgroundColor: theme.cardBackground,
              borderColor: theme.border
            }}
          >
            <div className="flex items-center mb-3">
              <Volume2 className="w-5 h-5 mr-2" style={{ color: theme.accent }} />
              <h4 className="font-semibold" style={{ color: theme.textPrimary }}>
                Notifications
              </h4>
            </div>
            <p className="text-sm" style={{ color: theme.textSecondary }}>
              Browser notifications will alert you when your session is complete.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PomodoroTimer;