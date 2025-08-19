import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Bell, BookOpen, TrendingUp } from 'lucide-react';
import { Theme } from '../types/theme';

interface DashboardProps {
  theme: Theme;
}

const Dashboard: React.FC<DashboardProps> = ({ theme }) => {
  const [todayMood, setTodayMood] = useState<string>('');
  const [upcomingReminders, setUpcomingReminders] = useState<any[]>([]);
  const [recentJournalEntries, setRecentJournalEntries] = useState<any[]>([]);

  useEffect(() => {
    // Load today's mood
    const moods = JSON.parse(localStorage.getItem('moods') || '{}');
    const today = new Date().toDateString();
    setTodayMood(moods[today] || '');

    // Load upcoming reminders
    const reminders = JSON.parse(localStorage.getItem('reminders') || '[]');
    const upcoming = reminders.filter((reminder: any) => 
      new Date(reminder.datetime) > new Date()
    ).slice(0, 3);
    setUpcomingReminders(upcoming);

    // Load recent journal entries
    const entries = JSON.parse(localStorage.getItem('journalEntries') || '[]');
    setRecentJournalEntries(entries.slice(0, 3));
  }, []);

  const getMoodEmoji = (mood: string) => {
    const moodEmojis: { [key: string]: string } = {
      'very-happy': '😄',
      'happy': '😊',
      'neutral': '😐',
      'sad': '😢',
      'very-sad': '😭'
    };
    return moodEmojis[mood] || '❓';
  };

  const cards = [
    {
      title: "Today's Mood",
      icon: Calendar,
      content: todayMood ? getMoodEmoji(todayMood) : 'Not set',
      subtitle: todayMood ? 'Mood tracked' : 'Track your mood today',
      color: theme.accent
    },
    {
      title: 'Upcoming Reminders',
      icon: Bell,
      content: upcomingReminders.length.toString(),
      subtitle: `${upcomingReminders.length} pending`,
      color: '#f59e0b'
    },
    {
      title: 'Journal Entries',
      icon: BookOpen,
      content: recentJournalEntries.length.toString(),
      subtitle: 'Recent entries',
      color: '#10b981'
    },
    {
      title: 'Weekly Progress',
      icon: TrendingUp,
      content: '85%',
      subtitle: 'Goals completed',
      color: '#8b5cf6'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2" style={{ color: theme.textPrimary }}>
          Welcome back!
        </h2>
        <p style={{ color: theme.textSecondary }}>
          Here's what's happening in your life today
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className="p-4 lg:p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border"
              style={{
                backgroundColor: theme.cardBackground,
                borderColor: theme.border
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <Icon className="w-6 h-6 lg:w-8 lg:h-8" style={{ color: card.color }} />
                <div className="text-right">
                  <div className="text-xl lg:text-2xl font-bold" style={{ color: theme.textPrimary }}>
                    {card.content}
                  </div>
                </div>
              </div>
              <h3 className="text-sm lg:text-base font-semibold mb-1" style={{ color: theme.textPrimary }}>
                {card.title}
              </h3>
              <p className="text-xs lg:text-sm" style={{ color: theme.textSecondary }}>
                {card.subtitle}
              </p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div
          className="p-4 lg:p-6 rounded-xl shadow-sm border"
          style={{
            backgroundColor: theme.cardBackground,
            borderColor: theme.border
          }}
        >
          <h3 className="text-lg lg:text-xl font-semibold mb-4" style={{ color: theme.textPrimary }}>
            Upcoming Reminders
          </h3>
          {upcomingReminders.length > 0 ? (
            <div className="space-y-3">
              {upcomingReminders.map((reminder, index) => (
                <div key={index} className="flex items-center p-3 rounded-lg border" style={{ borderColor: theme.border }}>
                  <Clock className="w-4 h-4 mr-3" style={{ color: theme.accent }} />
                  <div>
                    <p style={{ color: theme.textPrimary }} className="font-medium">{reminder.title}</p>
                    <p style={{ color: theme.textSecondary }} className="text-sm">
                      {new Date(reminder.datetime).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: theme.textSecondary }}>No upcoming reminders</p>
          )}
        </div>

        <div
          className="p-4 lg:p-6 rounded-xl shadow-sm border"
          style={{
            backgroundColor: theme.cardBackground,
            borderColor: theme.border
          }}
        >
          <h3 className="text-lg lg:text-xl font-semibold mb-4" style={{ color: theme.textPrimary }}>
            Recent Journal Entries
          </h3>
          {recentJournalEntries.length > 0 ? (
            <div className="space-y-3">
              {recentJournalEntries.map((entry, index) => (
                <div key={index} className="p-3 rounded-lg border" style={{ borderColor: theme.border }}>
                  <p style={{ color: theme.textPrimary }} className="font-medium">{entry.title}</p>
                  <p style={{ color: theme.textSecondary }} className="text-sm mt-1">
                    {entry.content.substring(0, 100)}...
                  </p>
                  <p style={{ color: theme.textSecondary }} className="text-xs mt-2">
                    {new Date(entry.date).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: theme.textSecondary }}>No journal entries yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;