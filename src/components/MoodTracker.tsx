import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Theme } from '../types/theme';

interface MoodTrackerProps {
  theme: Theme;
}

const MoodTracker: React.FC<MoodTrackerProps> = ({ theme }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [moods, setMoods] = useState<{ [key: string]: string }>({});
  const [purchasedStickers, setPurchasedStickers] = useState<string[]>([]);
  const [selectedStickerPack, setSelectedStickerPack] = useState<string>('default');

  useEffect(() => {
    const savedMoods = localStorage.getItem('moods');
    if (savedMoods) {
      setMoods(JSON.parse(savedMoods));
    }
    const savedStickers = localStorage.getItem('purchasedStickers');
    if (savedStickers) {
      setPurchasedStickers(JSON.parse(savedStickers));
    }
  }, []);

  const saveMood = (date: string, mood: string) => {
    const newMoods = { ...moods, [date]: mood };
    setMoods(newMoods);
    localStorage.setItem('moods', JSON.stringify(newMoods));
  };

  const moodOptions = [
    { id: 'very-happy', emoji: '😄', label: 'Very Happy', color: '#10b981' },
    { id: 'happy', emoji: '😊', label: 'Happy', color: '#84cc16' },
    { id: 'neutral', emoji: '😐', label: 'Neutral', color: '#f59e0b' },
    { id: 'sad', emoji: '😢', label: 'Sad', color: '#f97316' },
    { id: 'very-sad', emoji: '😭', label: 'Very Sad', color: '#ef4444' },
  ];

  const stickerPacks = {
    default: {
      name: 'Default',
      moods: [
        { id: 'very-happy', emoji: '😄', label: 'Very Happy', color: '#10b981' },
        { id: 'happy', emoji: '😊', label: 'Happy', color: '#84cc16' },
        { id: 'neutral', emoji: '😐', label: 'Neutral', color: '#f59e0b' },
        { id: 'sad', emoji: '😢', label: 'Sad', color: '#f97316' },
        { id: 'very-sad', emoji: '😭', label: 'Very Sad', color: '#ef4444' },
      ]
    },
    cats: {
      name: 'Cat Faces',
      moods: [
        { id: 'very-happy', emoji: '😸', label: 'Very Happy', color: '#10b981' },
        { id: 'happy', emoji: '😹', label: 'Happy', color: '#84cc16' },
        { id: 'neutral', emoji: '😼', label: 'Neutral', color: '#f59e0b' },
        { id: 'sad', emoji: '😿', label: 'Sad', color: '#f97316' },
        { id: 'very-sad', emoji: '🙀', label: 'Very Sad', color: '#ef4444' },
      ]
    },
    theatre: {
      name: 'Theatre Masks',
      moods: [
        { id: 'very-happy', emoji: '🎭', label: 'Very Happy', color: '#10b981' },
        { id: 'happy', emoji: '🎪', label: 'Happy', color: '#84cc16' },
        { id: 'neutral', emoji: '🎨', label: 'Neutral', color: '#f59e0b' },
        { id: 'sad', emoji: '🎬', label: 'Sad', color: '#f97316' },
        { id: 'very-sad', emoji: '🎤', label: 'Very Sad', color: '#ef4444' },
      ]
    },
    nature: {
      name: 'Nature Vibes',
      moods: [
        { id: 'very-happy', emoji: '🌞', label: 'Very Happy', color: '#10b981' },
        { id: 'happy', emoji: '🌸', label: 'Happy', color: '#84cc16' },
        { id: 'neutral', emoji: '🌿', label: 'Neutral', color: '#f59e0b' },
        { id: 'sad', emoji: '🌙', label: 'Sad', color: '#f97316' },
        { id: 'very-sad', emoji: '⭐', label: 'Very Sad', color: '#ef4444' },
      ]
    }
  };

  const getCurrentMoodOptions = () => {
    const pack = stickerPacks[selectedStickerPack as keyof typeof stickerPacks];
    return pack ? pack.moods : moodOptions;
  };

  const getAvailablePacks = () => {
    const available = ['default'];
    purchasedStickers.forEach(pack => {
      if (stickerPacks[pack as keyof typeof stickerPacks]) {
        available.push(pack);
      }
    });
    return available;
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const getMoodForDate = (date: Date) => {
    return moods[date.toDateString()];
  };

  const getMoodEmoji = (moodId: string) => {
    const currentOptions = getCurrentMoodOptions();
    const mood = currentOptions.find(m => m.id === moodId);
    return mood ? mood.emoji : '';
  };

  const days = getDaysInMonth(currentDate);
  const monthYear = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2" style={{ color: theme.textPrimary }}>
          Mood Tracker
        </h2>
        <p style={{ color: theme.textSecondary }}>
          Track your daily emotions and see patterns over time
        </p>
      </div>

      {getAvailablePacks().length > 1 && (
        <div
          className="p-4 rounded-xl shadow-sm border mb-6"
          style={{
            backgroundColor: theme.cardBackground,
            borderColor: theme.border
          }}
        >
          <label className="block text-sm font-medium mb-2" style={{ color: theme.textPrimary }}>
            Sticker Pack
          </label>
          <select
            value={selectedStickerPack}
            onChange={(e) => setSelectedStickerPack(e.target.value)}
            className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
            style={{ borderColor: theme.border }}
          >
            {getAvailablePacks().map(packKey => (
              <option key={packKey} value={packKey}>
                {stickerPacks[packKey as keyof typeof stickerPacks].name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div
        className="p-4 lg:p-6 rounded-xl shadow-sm border"
        style={{
          backgroundColor: theme.cardBackground,
          borderColor: theme.border
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={previousMonth}
            className="p-2 rounded-lg hover:shadow-sm transition-all duration-200"
            style={{ color: theme.accent }}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h3 className="text-xl font-semibold" style={{ color: theme.textPrimary }}>
            {monthYear}
          </h3>
          <button
            onClick={nextMonth}
            className="p-2 rounded-lg hover:shadow-sm transition-all duration-200"
            style={{ color: theme.accent }}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center py-2 font-medium" style={{ color: theme.textSecondary }}>
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {days.map((day, index) => (
            <div key={index} className="aspect-square min-h-[60px] lg:min-h-[80px]">
              {day && (
                <div
                  className="w-full h-full flex flex-col items-center justify-center rounded-lg border cursor-pointer hover:shadow-sm transition-all duration-200"
                  style={{ borderColor: theme.border }}
                >
                  <span className="text-xs lg:text-sm font-medium mb-1" style={{ color: theme.textPrimary }}>
                    {day.getDate()}
                  </span>
                  <div className="text-lg lg:text-2xl">
                    {getMoodEmoji(getMoodForDate(day))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div
        className="p-4 lg:p-6 rounded-xl shadow-sm border"
        style={{
          backgroundColor: theme.cardBackground,
          borderColor: theme.border
        }}
      >
        <h3 className="text-xl font-semibold mb-4" style={{ color: theme.textPrimary }}>
          How are you feeling today?
        </h3>
        <div className="grid grid-cols-5 gap-4">
          {getCurrentMoodOptions().map(mood => (
            <button
              key={mood.id}
              onClick={() => saveMood(new Date().toDateString(), mood.id)}
              className="flex flex-col items-center p-2 lg:p-4 rounded-lg border hover:shadow-md transition-all duration-200 transform hover:scale-105"
              style={{ borderColor: theme.border }}
            >
              <div className="text-2xl lg:text-4xl mb-1 lg:mb-2">{mood.emoji}</div>
              <span className="text-xs lg:text-sm font-medium text-center" style={{ color: theme.textPrimary }}>
                {mood.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MoodTracker;