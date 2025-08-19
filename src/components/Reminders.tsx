import React, { useState, useEffect } from 'react';
import { Plus, Bell, Calendar, Clock, Trash2, Edit2 } from 'lucide-react';
import { Theme } from '../types/theme';

interface Reminder {
  id: string;
  title: string;
  description: string;
  datetime: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
}

interface RemindersProps {
  theme: Theme;
}

const Reminders: React.FC<RemindersProps> = ({ theme }) => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    datetime: '',
    priority: 'medium' as 'low' | 'medium' | 'high'
  });

  const priorities = [
    { id: 'low', label: 'Low', color: '#10b981' },
    { id: 'medium', label: 'Medium', color: '#f59e0b' },
    { id: 'high', label: 'High', color: '#ef4444' }
  ];

  useEffect(() => {
    const savedReminders = localStorage.getItem('reminders');
    if (savedReminders) {
      setReminders(JSON.parse(savedReminders));
    }
  }, []);

  const saveReminders = (newReminders: Reminder[]) => {
    setReminders(newReminders);
    localStorage.setItem('reminders', JSON.stringify(newReminders));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.datetime) return;

    const reminder: Reminder = {
      id: editingReminder?.id || Date.now().toString(),
      title: formData.title,
      description: formData.description,
      datetime: formData.datetime,
      priority: formData.priority,
      completed: false
    };

    if (editingReminder) {
      const updatedReminders = reminders.map(r => r.id === editingReminder.id ? reminder : r);
      saveReminders(updatedReminders);
    } else {
      saveReminders([...reminders, reminder]);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      datetime: '',
      priority: 'medium'
    });
    setShowAddForm(false);
    setEditingReminder(null);
  };

  const handleEdit = (reminder: Reminder) => {
    setEditingReminder(reminder);
    setFormData({
      title: reminder.title,
      description: reminder.description,
      datetime: reminder.datetime,
      priority: reminder.priority
    });
    setShowAddForm(true);
  };

  const handleDelete = (id: string) => {
    const updatedReminders = reminders.filter(r => r.id !== id);
    saveReminders(updatedReminders);
  };

  const toggleComplete = (id: string) => {
    const updatedReminders = reminders.map(r =>
      r.id === id ? { ...r, completed: !r.completed } : r
    );
    saveReminders(updatedReminders);
  };

  const getPriorityColor = (priority: string) => {
    const priorityObj = priorities.find(p => p.id === priority);
    return priorityObj?.color || theme.accent;
  };

  const formatDateTime = (datetime: string) => {
    const date = new Date(datetime);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  const sortedReminders = reminders.sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    return new Date(a.datetime).getTime() - new Date(b.datetime).getTime();
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold mb-2" style={{ color: theme.textPrimary }}>
            Reminders
          </h2>
          <p style={{ color: theme.textSecondary }}>
            Never miss important tasks and events
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center px-4 py-2 rounded-lg font-medium text-white shadow-sm hover:shadow-md transition-all duration-200"
          style={{ backgroundColor: theme.accent }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Reminder
        </button>
      </div>

      {(showAddForm || editingReminder) && (
        <div
          className="p-6 rounded-xl shadow-sm border"
          style={{
            backgroundColor: theme.cardBackground,
            borderColor: theme.border
          }}
        >
          <h3 className="text-xl font-semibold mb-4" style={{ color: theme.textPrimary }}>
            {editingReminder ? 'Edit Reminder' : 'Add New Reminder'}
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
                placeholder="Doctor appointment"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: theme.textPrimary }}>
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 h-24 resize-none"
                style={{ borderColor: theme.border }}
                placeholder="Additional details..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: theme.textPrimary }}>
                  Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={formData.datetime}
                  onChange={(e) => setFormData(prev => ({ ...prev, datetime: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                  style={{ borderColor: theme.border }}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: theme.textPrimary }}>
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as 'low' | 'medium' | 'high' }))}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                  style={{ borderColor: theme.border }}
                >
                  {priorities.map(priority => (
                    <option key={priority.id} value={priority.id}>
                      {priority.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="px-4 py-2 rounded-lg font-medium text-white shadow-sm hover:shadow-md transition-all duration-200"
                style={{ backgroundColor: theme.accent }}
              >
                {editingReminder ? 'Update' : 'Add'} Reminder
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

      <div className="space-y-4">
        {sortedReminders.map(reminder => {
          const { date, time } = formatDateTime(reminder.datetime);
          return (
            <div
              key={reminder.id}
              className={`p-6 rounded-xl shadow-sm border hover:shadow-md transition-all duration-200 ${
                reminder.completed ? 'opacity-60' : ''
              }`}
              style={{
                backgroundColor: theme.cardBackground,
                borderColor: theme.border
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start flex-1">
                  <input
                    type="checkbox"
                    checked={reminder.completed}
                    onChange={() => toggleComplete(reminder.id)}
                    className="mt-1 mr-4"
                  />
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h3
                        className={`font-semibold mr-3 ${reminder.completed ? 'line-through' : ''}`}
                        style={{ color: theme.textPrimary }}
                      >
                        {reminder.title}
                      </h3>
                      <span
                        className="px-2 py-1 text-xs rounded-full text-white"
                        style={{ backgroundColor: getPriorityColor(reminder.priority) }}
                      >
                        {priorities.find(p => p.id === reminder.priority)?.label}
                      </span>
                    </div>
                    
                    {reminder.description && (
                      <p 
                        className={`mb-3 ${reminder.completed ? 'line-through' : ''}`}
                        style={{ color: theme.textSecondary }}
                      >
                        {reminder.description}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-4" style={{ color: theme.textSecondary }}>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span className="text-sm">{date}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        <span className="text-sm">{time}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(reminder)}
                    className="p-2 rounded hover:bg-gray-100 transition-colors"
                    style={{ color: theme.textSecondary }}
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(reminder.id)}
                    className="p-2 rounded hover:bg-red-50 transition-colors text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {reminders.length === 0 && !showAddForm && (
        <div className="text-center py-12">
          <Bell className="w-16 h-16 mx-auto mb-4" style={{ color: theme.textSecondary }} />
          <h3 className="text-xl font-semibold mb-2" style={{ color: theme.textPrimary }}>
            No reminders yet
          </h3>
          <p style={{ color: theme.textSecondary }} className="mb-4">
            Create your first reminder to stay organized
          </p>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 rounded-lg font-medium text-white shadow-sm hover:shadow-md transition-all duration-200"
            style={{ backgroundColor: theme.accent }}
          >
            <Plus className="w-4 h-4 mr-2 inline" />
            Add Your First Reminder
          </button>
        </div>
      )}
    </div>
  );
};

export default Reminders;