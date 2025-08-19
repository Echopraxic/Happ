import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';
import { Theme } from '../types/theme';

interface NavigationItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface SidebarProps {
  navigation: NavigationItem[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  theme: Theme;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  navigation, 
  activeTab, 
  onTabChange, 
  theme, 
  isOpen, 
  onClose 
}) => {
  return (
    <div 
      className={`fixed left-0 top-0 h-full w-64 p-4 lg:p-6 backdrop-blur-sm border-r z-40 transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}
      style={{ 
        backgroundColor: theme.cardBackground,
        borderColor: theme.border
      }}
    >
      <div className="mb-6 lg:mb-8 pt-16 lg:pt-0">
        <h1 
          className="text-xl lg:text-2xl font-bold"
          style={{ color: theme.textPrimary }}
        >
          NotesApp
        </h1>
        <p style={{ color: theme.textSecondary }} className="text-xs lg:text-sm mt-1">
          Your personal companion
        </p>
      </div>
      
      <nav className="space-y-1 lg:space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center px-3 lg:px-4 py-2 lg:py-3 rounded-lg text-left transition-all duration-200 ${
                isActive ? 'shadow-md transform scale-105' : 'hover:shadow-sm'
              }`}
              style={{
                backgroundColor: isActive ? theme.accent : 'transparent',
                color: isActive ? 'white' : theme.textPrimary,
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = theme.hover;
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <Icon className="w-4 h-4 lg:w-5 lg:h-5 mr-2 lg:mr-3" />
              <span className="font-medium text-sm lg:text-base">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;