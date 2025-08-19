export interface Theme {
  name: string;
  background: string;
  cardBackground: string;
  textPrimary: string;
  textSecondary: string;
  accent: string;
  border: string;
  hover: string;
  isPremium: boolean;
  price: number;
}

export const themes = {
  default: {
    name: 'Ocean Breeze',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    cardBackground: 'rgba(255, 255, 255, 0.95)',
    textPrimary: '#1f2937',
    textSecondary: '#6b7280',
    accent: '#3b82f6',
    border: '#e5e7eb',
    hover: 'rgba(59, 130, 246, 0.1)',
    isPremium: false,
    price: 0,
  },
  sunset: {
    name: 'Sunset Glow',
    background: 'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)',
    cardBackground: 'rgba(255, 255, 255, 0.95)',
    textPrimary: '#1f2937',
    textSecondary: '#6b7280',
    accent: '#f59e0b',
    border: '#e5e7eb',
    hover: 'rgba(245, 158, 11, 0.1)',
    isPremium: false,
    price: 0,
  },
  forest: {
    name: 'Forest Dream',
    background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    cardBackground: 'rgba(255, 255, 255, 0.95)',
    textPrimary: '#1f2937',
    textSecondary: '#6b7280',
    accent: '#10b981',
    border: '#e5e7eb',
    hover: 'rgba(16, 185, 129, 0.1)',
    isPremium: false,
    price: 0,
  },
  midnight: {
    name: 'Midnight Sky',
    background: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)',
    cardBackground: 'rgba(255, 255, 255, 0.95)',
    textPrimary: '#1f2937',
    textSecondary: '#6b7280',
    accent: '#8b5cf6',
    border: '#e5e7eb',
    hover: 'rgba(139, 92, 246, 0.1)',
    isPremium: false,
    price: 0,
  },
  lavender: {
    name: 'Lavender Fields',
    background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    cardBackground: 'rgba(255, 255, 255, 0.95)',
    textPrimary: '#1f2937',
    textSecondary: '#6b7280',
    accent: '#ec4899',
    border: '#e5e7eb',
    hover: 'rgba(236, 72, 153, 0.1)',
    isPremium: false,
    price: 0,
  },
  checkerboard: {
    name: 'Red Checkerboard',
    background: `
      repeating-conic-gradient(
        from 0deg at 50% 50%,
        #dc2626 0deg 90deg,
        #fca5a5 90deg 180deg,
        #dc2626 180deg 270deg,
        #fca5a5 270deg 360deg
      )
    `,
    cardBackground: 'rgba(255, 255, 255, 0.95)',
    textPrimary: '#1f2937',
    textSecondary: '#6b7280',
    accent: '#dc2626',
    border: '#e5e7eb',
    hover: 'rgba(220, 38, 38, 0.1)',
    isPremium: true,
    price: 0.99,
  },
  argyle: {
    name: 'Blue Argyle',
    background: `
      repeating-linear-gradient(
        45deg,
        #3b82f6 0px,
        #3b82f6 20px,
        #93c5fd 20px,
        #93c5fd 40px
      ),
      repeating-linear-gradient(
        -45deg,
        #1e40af 0px,
        #1e40af 20px,
        #dbeafe 20px,
        #dbeafe 40px
      )
    `,
    cardBackground: 'rgba(255, 255, 255, 0.95)',
    textPrimary: '#1f2937',
    textSecondary: '#6b7280',
    accent: '#3b82f6',
    border: '#e5e7eb',
    hover: 'rgba(59, 130, 246, 0.1)',
    isPremium: true,
    price: 0.99,
  },
  leafPattern: {
    name: 'Verdant Leaves',
    background: `
      radial-gradient(circle at 25% 25%, #22c55e 0%, transparent 50%),
      radial-gradient(circle at 75% 75%, #16a34a 0%, transparent 50%),
      radial-gradient(circle at 75% 25%, #15803d 0%, transparent 50%),
      radial-gradient(circle at 25% 75%, #166534 0%, transparent 50%),
      linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)
    `,
    cardBackground: 'rgba(255, 255, 255, 0.95)',
    textPrimary: '#1f2937',
    textSecondary: '#6b7280',
    accent: '#22c55e',
    border: '#e5e7eb',
    hover: 'rgba(34, 197, 94, 0.1)',
    isPremium: true,
    price: 0.99,
  }
};