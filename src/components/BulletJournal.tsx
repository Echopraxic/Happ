import React, { useState, useEffect } from 'react';
import { Plus, BookOpen, Edit2, Trash2, Search } from 'lucide-react';
import { Theme } from '../types/theme';

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  date: string;
  tags: string[];
  mood?: string;
}

interface BulletJournalProps {
  theme: Theme;
}

const BulletJournal: React.FC<BulletJournalProps> = ({ theme }) => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: '',
    mood: ''
  });

  const moodEmojis = {
    'very-happy': '😄',
    'happy': '😊',
    'neutral': '😐',
    'sad': '😢',
    'very-sad': '😭'
  };

  useEffect(() => {
    const savedEntries = localStorage.getItem('journalEntries');
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }
  }, []);

  const saveEntries = (newEntries: JournalEntry[]) => {
    setEntries(newEntries);
    localStorage.setItem('journalEntries', JSON.stringify(newEntries));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) return;

    const entry: JournalEntry = {
      id: editingEntry?.id || Date.now().toString(),
      title: formData.title,
      content: formData.content,
      date: editingEntry?.date || new Date().toISOString(),
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      mood: formData.mood || undefined
    };

    if (editingEntry) {
      const updatedEntries = entries.map(e => e.id === editingEntry.id ? entry : e);
      saveEntries(updatedEntries);
    } else {
      saveEntries([entry, ...entries]);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      tags: '',
      mood: ''
    });
    setShowAddForm(false);
    setEditingEntry(null);
  };

  const handleEdit = (entry: JournalEntry) => {
    setEditingEntry(entry);
    setFormData({
      title: entry.title,
      content: entry.content,
      tags: entry.tags.join(', '),
      mood: entry.mood || ''
    });
    setShowAddForm(true);
  };

  const handleDelete = (id: string) => {
    const updatedEntries = entries.filter(e => e.id !== id);
    saveEntries(updatedEntries);
  };

  const filteredEntries = entries.filter(entry =>
    entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold mb-2" style={{ color: theme.textPrimary }}>
            Bullet Journal
          </h2>
          <p style={{ color: theme.textSecondary }}>
            Capture your thoughts, ideas, and daily reflections
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center px-4 py-2 rounded-lg font-medium text-white shadow-sm hover:shadow-md transition-all duration-200"
          style={{ backgroundColor: theme.accent }}
        >
          <Plus className="w-4 h-4 mr-2" />
          New Entry
        </button>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: theme.textSecondary }} />
          <input
            type="text"
            placeholder="Search entries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
            style={{ borderColor: theme.border }}
          />
        </div>
      </div>

      {(showAddForm || editingEntry) && (
        <div
          className="p-6 rounded-xl shadow-sm border"
          style={{
            backgroundColor: theme.cardBackground,
            borderColor: theme.border
          }}
        >
          <h3 className="text-xl font-semibold mb-4" style={{ color: theme.textPrimary }}>
            {editingEntry ? 'Edit Entry' : 'New Journal Entry'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: theme.textPrimary }}>
                Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                style={{ borderColor: theme.border }}
                placeholder="What's on your mind?"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: theme.textPrimary }}>
                Content
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 h-48 resize-none"
                style={{ borderColor: theme.border }}
                placeholder="Write your thoughts here..."
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: theme.textPrimary }}>
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                  style={{ borderColor: theme.border }}
                  placeholder="personal, work, ideas"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: theme.textPrimary }}>
                  Current Mood
                </label>
                <select
                  value={formData.mood}
                  onChange={(e) => setFormData(prev => ({ ...prev, mood: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                  style={{ borderColor: theme.border }}
                >
                  <option value="">Select mood</option>
                  <option value="very-happy">😄 Very Happy</option>
                  <option value="happy">😊 Happy</option>
                  <option value="neutral">😐 Neutral</option>
                  <option value="sad">😢 Sad</option>
                  <option value="very-sad">😭 Very Sad</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="px-4 py-2 rounded-lg font-medium text-white shadow-sm hover:shadow-md transition-all duration-200"
                style={{ backgroundColor: theme.accent }}
              >
                {editingEntry ? 'Update' : 'Save'} Entry
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 rounded-lg font-medium border transition-all duration-200"
                style={{ 
                  borderColor: theme.border,
                  color: theme.textSecondary
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-6">
        {filteredEntries.map(entry => (
          <div
            key={entry.id}
            className="p-6 rounded-xl shadow-sm border hover:shadow-md transition-all duration-200"
            style={{
              backgroundColor: theme.cardBackground,
              borderColor: theme.border
            }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <h3 className="text-xl font-semibold mr-3" style={{ color: theme.textPrimary }}>
                  {entry.title}
                </h3>
                {entry.mood && (
                  <span className="text-2xl mr-2">
                    {moodEmojis[entry.mood as keyof typeof moodEmojis]}
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(entry)}
                  className="p-2 rounded hover:bg-gray-100 transition-colors"
                  style={{ color: theme.textSecondary }}
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(entry.id)}
                  className="p-2 rounded hover:bg-red-50 transition-colors text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <p className="mb-4 leading-relaxed" style={{ color: theme.textPrimary }}>
              {entry.content}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {entry.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs rounded-full"
                    style={{ 
                      backgroundColor: theme.hover,
                      color: theme.textPrimary
                    }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              <span className="text-sm" style={{ color: theme.textSecondary }}>
                {formatDate(entry.date)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {filteredEntries.length === 0 && searchTerm && (
        <div className="text-center py-12">
          <Search className="w-16 h-16 mx-auto mb-4" style={{ color: theme.textSecondary }} />
          <h3 className="text-xl font-semibold mb-2" style={{ color: theme.textPrimary }}>
            No entries found
          </h3>
          <p style={{ color: theme.textSecondary }}>
            Try adjusting your search terms
          </p>
        </div>
      )}

      {entries.length === 0 && !showAddForm && (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 mx-auto mb-4" style={{ color: theme.textSecondary }} />
          <h3 className="text-xl font-semibold mb-2" style={{ color: theme.textPrimary }}>
            Start your journal
          </h3>
          <p style={{ color: theme.textSecondary }} className="mb-4">
            Begin documenting your thoughts and experiences
          </p>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 rounded-lg font-medium text-white shadow-sm hover:shadow-md transition-all duration-200"
            style={{ backgroundColor: theme.accent }}
          >
            <Plus className="w-4 h-4 mr-2 inline" />
            Write Your First Entry
          </button>
        </div>
      )}
    </div>
  );
};

export default BulletJournal;