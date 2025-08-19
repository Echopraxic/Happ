import React, { useState, useEffect } from 'react';
import { Plus, Clock, Edit2, Trash2, Bell, Calendar, X } from 'lucide-react';
import { Theme } from '../types/theme';

interface Routine {
  id: string;
  title: string;
  time: string;
  days: string[];
  notifications: boolean;
  category: string;
  completions: { [date: string]: boolean };
}

interface RoutineSchedulerProps {
  theme: Theme;
}

const RoutineScheduler: React.FC<RoutineSchedulerProps> = ({ theme }) => {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [selectedRoutine, setSelectedRoutine] = useState<Routine | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingRoutine, setEditingRoutine] = useState<Routine | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    time: '',
    days: [] as string[],
    notifications: true,
    category: 'personal'
  });

  const categories = [
    { id: 'personal', label: 'Personal', color: '#3b82f6' },
    { id: 'work', label: 'Work', color: '#10b981' },
    { id: 'health', label: 'Health', color: '#f59e0b' },
    { id: 'hobby', label: 'Hobby', color: '#8b5cf6' }
  ];

  const daysOfWeek = [
    { id: 'monday', label: 'Mon' },
    { id: 'tuesday', label: 'Tue' },
    { id: 'wednesday', label: 'Wed' },
    { id: 'thursday', label: 'Thu' },
    { id: 'friday', label: 'Fri' },
    { id: 'saturday', label: 'Sat' },
    { id: 'sunday', label: 'Sun' }
  ];

  useEffect(() => {
    const savedRoutines = localStorage.getItem('routines');
    if (savedRoutines) {
      setRoutines(JSON.parse(savedRoutines));
    }
  }, []);

  const saveRoutines = (newRoutines: Routine[]) => {
    setRoutines(newRoutines);
    localStorage.setItem('routines', JSON.stringify(newRoutines));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.time || formData.days.length === 0) return;

    const routine: Routine = {
      id: editingRoutine?.id || Date.now().toString(),
      title: formData.title,
      time: formData.time,
      days: formData.days,
      notifications: formData.notifications,
      category: formData.category,
      completions: editingRoutine?.completions || {}
    };

    if (editingRoutine) {
      const updatedRoutines = routines.map(r => r.id === editingRoutine.id ? routine : r);
      saveRoutines(updatedRoutines);
    } else {
      saveRoutines([...routines, routine]);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      time: '',
      days: [],
      notifications: true,
      category: 'personal'
    });
    setShowAddForm(false);
    setEditingRoutine(null);
  };

  const handleEdit = (routine: Routine) => {
    setEditingRoutine(routine);
    setFormData({
      title: routine.title,
      time: routine.time,
      days: routine.days,
      notifications: routine.notifications,
      category: routine.category
    });
    setShowAddForm(true);
  };

  const handleDelete = (id: string) => {
    const updatedRoutines = routines.filter(r => r.id !== id);
    saveRoutines(updatedRoutines);
  };

  const toggleDay = (day: string) => {
    setFormData(prev => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter(d => d !== day)
        : [...prev.days, day]
    }));
  };

  const getCategoryColor = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.color || theme.accent;
  };

  const toggleCompletion = (routineId: string, date: string) => {
    const updatedRoutines = routines.map(routine => {
      if (routine.id === routineId) {
        const completions = { ...routine.completions };
        completions[date] = !completions[date];
        return { ...routine, completions };
      }
      return routine;
    });
    saveRoutines(updatedRoutines);
  };

  const getHeatmapData = (routine: Routine) => {
    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth() - 2, 1);
    const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    const data = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      const dateStr = currentDate.toDateString();
      const dayOfWeek = currentDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
      const isScheduledDay = routine.days.includes(dayOfWeek);
      const isCompleted = (routine.completions || {})[dateStr] || false;
      
      data.push({
        date: new Date(currentDate),
        dateStr,
        isScheduledDay,
        isCompleted,
        isPast: currentDate < today
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return data;
  };

  const HeatmapModal = ({ routine, onClose }: { routine: Routine; onClose: () => void }) => {
    const heatmapData = getHeatmapData(routine);
    const weeks = [];
    
    for (let i = 0; i < heatmapData.length; i += 7) {
      weeks.push(heatmapData.slice(i, i + 7));
    }
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div
          className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
          style={{ backgroundColor: theme.cardBackground }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold" style={{ color: theme.textPrimary }}>
              {routine.title} - Progress Heatmap
            </h3>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" style={{ color: theme.textSecondary }} />
            </button>
          </div>
          
          <div className="space-y-2">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex gap-1">
                {week.map((day, dayIndex) => (
                  <button
                    key={dayIndex}
                    onClick={() => day.isScheduledDay && toggleCompletion(routine.id, day.dateStr)}
                    className={`w-8 h-8 rounded text-xs font-medium transition-all duration-200 ${
                      day.isScheduledDay ? 'cursor-pointer hover:scale-110' : 'cursor-default'
                    }`}
                    style={{
                      backgroundColor: day.isScheduledDay 
                        ? (day.isCompleted ? getCategoryColor(routine.category) : theme.border)
                        : 'transparent',
                      color: day.isCompleted ? 'white' : theme.textSecondary,
                      border: day.isScheduledDay ? `1px solid ${theme.border}` : 'none'
                    }}
                    title={`${day.date.toLocaleDateString()} - ${day.isCompleted ? 'Completed' : 'Not completed'}`}
                  >
                    {day.date.getDate()}
                  </button>
                ))}
              </div>
            ))}
          </div>
          
          <div className="mt-6 flex items-center gap-4 text-sm" style={{ color: theme.textSecondary }}>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded border" style={{ backgroundColor: getCategoryColor(routine.category) }}></div>
              <span>Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded border" style={{ backgroundColor: theme.border }}></div>
              <span>Scheduled</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold mb-2" style={{ color: theme.textPrimary }}>
            Routine Scheduler
          </h2>
          <p style={{ color: theme.textSecondary }}>
            Build healthy habits with scheduled routines
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center px-4 py-2 rounded-lg font-medium text-white shadow-sm hover:shadow-md transition-all duration-200"
          style={{ backgroundColor: theme.accent }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Routine
        </button>
      </div>

      {(showAddForm || editingRoutine) && (
        <div
          className="p-6 rounded-xl shadow-sm border"
          style={{
            backgroundColor: theme.cardBackground,
            borderColor: theme.border
          }}
        >
          <h3 className="text-xl font-semibold mb-4" style={{ color: theme.textPrimary }}>
            {editingRoutine ? 'Edit Routine' : 'Add New Routine'}
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
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ 
                  borderColor: theme.border
                }}
                placeholder="Morning workout"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: theme.textPrimary }}>
                  Time
                </label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                  style={{ borderColor: theme.border }}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: theme.textPrimary }}>
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                  style={{ borderColor: theme.border }}
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: theme.textPrimary }}>
                Days of Week
              </label>
              <div className="flex flex-wrap gap-2">
                {daysOfWeek.map(day => (
                  <button
                    key={day.id}
                    type="button"
                    onClick={() => toggleDay(day.id)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      formData.days.includes(day.id) ? 'text-white shadow-sm' : 'border'
                    }`}
                    style={{
                      backgroundColor: formData.days.includes(day.id) ? theme.accent : 'transparent',
                      borderColor: theme.border,
                      color: formData.days.includes(day.id) ? 'white' : theme.textPrimary
                    }}
                  >
                    {day.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="notifications"
                checked={formData.notifications}
                onChange={(e) => setFormData(prev => ({ ...prev, notifications: e.target.checked }))}
                className="mr-2"
              />
              <label htmlFor="notifications" className="text-sm" style={{ color: theme.textPrimary }}>
                Enable notifications
              </label>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="px-4 py-2 rounded-lg font-medium text-white shadow-sm hover:shadow-md transition-all duration-200"
                style={{ backgroundColor: theme.accent }}
              >
                {editingRoutine ? 'Update' : 'Add'} Routine
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {routines.map(routine => (
          <div
            key={routine.id}
            className="p-6 rounded-xl shadow-sm border hover:shadow-md transition-all duration-200 cursor-pointer"
            style={{
              backgroundColor: theme.cardBackground,
              borderColor: theme.border
            }}
            onClick={() => setSelectedRoutine(routine)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div
                  className="w-3 h-3 rounded-full mr-3"
                  style={{ backgroundColor: getCategoryColor(routine.category) }}
                ></div>
                <h3 className="font-semibold" style={{ color: theme.textPrimary }}>
                  {routine.title}
                </h3>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                  e.stopPropagation();
                  handleEdit(routine); }}
                  className="p-1 rounded hover:bg-gray-100 transition-colors"
                  style={{ color: theme.textSecondary }}
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                 onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(routine.id); }}
                  className="p-1 rounded hover:bg-red-50 transition-colors text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center" style={{ color: theme.textSecondary }}>
                <Clock className="w-4 h-4 mr-2" />
                <span className="text-sm">{routine.time}</span>
              </div>

              <div className="flex flex-wrap gap-1">
                {routine.days.map(day => (
                  <span
                    key={day}
                    className="px-2 py-1 text-xs rounded-full"
                    style={{ 
                      backgroundColor: theme.hover,
                      color: theme.textPrimary
                    }}
                  >
                    {daysOfWeek.find(d => d.id === day)?.label}
                  </span>
                ))}
              </div>

              {routine.notifications && (
                <div className="flex items-center" style={{ color: theme.textSecondary }}>
                  <Bell className="w-4 h-4 mr-2" />
                  <span className="text-sm">Notifications on</span>
                </div>
              )}
            </div>
            
            <div className="mt-4 pt-4 border-t" style={{ borderColor: theme.border }}>
              <div className="flex items-center text-sm" style={{ color: theme.textSecondary }}>
                <Calendar className="w-4 h-4 mr-1" />
                <span>Click to view progress heatmap</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedRoutine && (
        <HeatmapModal
          routine={selectedRoutine}
          onClose={() => setSelectedRoutine(null)}
        />
      )}

      {routines.length === 0 && !showAddForm && (
        <div className="text-center py-12">
          <Clock className="w-16 h-16 mx-auto mb-4" style={{ color: theme.textSecondary }} />
          <h3 className="text-xl font-semibold mb-2" style={{ color: theme.textPrimary }}>
            No routines yet
          </h3>
          <p style={{ color: theme.textSecondary }} className="mb-4">
            Create your first routine to start building healthy habits
          </p>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 rounded-lg font-medium text-white shadow-sm hover:shadow-md transition-all duration-200"
            style={{ backgroundColor: theme.accent }}
          >
            <Plus className="w-4 h-4 mr-2 inline" />
            Add Your First Routine
          </button>
        </div>
      )}
    </div>
  );
};

export default RoutineScheduler;