import React from 'react';
import { Check, Lock, ShoppingCart } from 'lucide-react';
import { Theme, themes } from '../types/theme';

interface ThemeSelectorProps {
  theme: Theme;
  onThemeChange: (themeName: string) => void;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ theme, onThemeChange }) => {
  const [purchasedThemes, setPurchasedThemes] = React.useState<string[]>([]);
  const [purchasedStickers, setPurchasedStickers] = React.useState<string[]>([]);

  React.useEffect(() => {
    const saved = localStorage.getItem('purchasedThemes');
    if (saved) {
      setPurchasedThemes(JSON.parse(saved));
    }
    const savedStickers = localStorage.getItem('purchasedStickers');
    if (savedStickers) {
      setPurchasedStickers(JSON.parse(savedStickers));
    }
  }, []);

  const handlePurchase = (itemKey: string, type: 'theme' | 'sticker') => {
    // Simulate purchase
    if (type === 'theme') {
      const newPurchased = [...purchasedThemes, itemKey];
      setPurchasedThemes(newPurchased);
      localStorage.setItem('purchasedThemes', JSON.stringify(newPurchased));
      onThemeChange(itemKey);
    } else {
      const newPurchased = [...purchasedStickers, itemKey];
      setPurchasedStickers(newPurchased);
      localStorage.setItem('purchasedStickers', JSON.stringify(newPurchased));
    }
  };

  const canUseTheme = (themeKey: string, themeData: Theme) => {
    return !themeData.isPremium || purchasedThemes.includes(themeKey);
  };

  const stickerPacks = [
    {
      id: 'cats',
      name: 'Cat Faces',
      price: 0.99,
      preview: ['😸', '😹', '😻', '😼', '😽'],
      description: 'Adorable cat expressions for your mood tracking'
    },
    {
      id: 'theatre',
      name: 'Theatre Masks',
      price: 0.99,
      preview: ['🎭', '🎪', '🎨', '🎬', '🎤'],
      description: 'Dramatic expressions for creative moods'
    },
    {
      id: 'nature',
      name: 'Nature Vibes',
      price: 0.99,
      preview: ['🌸', '🌿', '🌞', '🌙', '⭐'],
      description: 'Natural elements to express your connection with nature'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2" style={{ color: theme.textPrimary }}>
          Theme Settings
        </h2>
        <p style={{ color: theme.textSecondary }}>
          Customize your app's appearance with beautiful themes
        </p>
      </div>

      <div
        className="p-6 rounded-xl shadow-sm border"
        style={{
          backgroundColor: theme.cardBackground,
          borderColor: theme.border
        }}
      >
        <h3 className="text-xl font-semibold mb-6" style={{ color: theme.textPrimary }}>
          Choose Your Theme
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(themes).map(([key, themeOption]) => (
            <button
              key={key}
              onClick={() => {
                if (canUseTheme(key, themeOption)) {
                  onThemeChange(key);
                } else {
                  handlePurchase(key, 'theme');
                }
              }}
              className={`relative p-6 rounded-xl border-2 transition-all duration-200 hover:shadow-md ${
                theme.name === themeOption.name ? 'ring-2' : ''
              }`}
              style={{
                background: themeOption.background,
                borderColor: theme.name === themeOption.name ? theme.accent : 'transparent',
                ringColor: theme.accent
              }}
            >
              {theme.name === themeOption.name && (
                <div className="absolute top-3 right-3">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: theme.accent }}
                  >
                    <Check className="w-4 h-4 text-white" />
                  </div>
                </div>
              )}
              
              {themeOption.isPremium && !canUseTheme(key, themeOption) && (
                <div className="absolute top-3 left-3">
                  <div className="bg-black bg-opacity-50 rounded-full p-2">
                    <Lock className="w-4 h-4 text-white" />
                  </div>
                </div>
              )}
              
              <div
                className="bg-white bg-opacity-95 rounded-lg p-4 mb-4"
                style={{ backgroundColor: themeOption.cardBackground }}
              >
                <div className="space-y-2">
                  <div
                    className="h-2 rounded"
                    style={{ backgroundColor: themeOption.accent, width: '80%' }}
                  ></div>
                  <div
                    className="h-2 rounded"
                    style={{ backgroundColor: themeOption.textSecondary, width: '60%' }}
                  ></div>
                  <div
                    className="h-2 rounded"
                    style={{ backgroundColor: themeOption.textSecondary, width: '40%' }}
                  ></div>
                </div>
                
                <div className="flex gap-2 mt-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: themeOption.accent }}
                  ></div>
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: themeOption.textSecondary }}
                  ></div>
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: themeOption.border }}
                  ></div>
                </div>
              </div>
              
              <h4 className="text-white font-semibold text-lg mb-2">
                {themeOption.name}
              </h4>
              {themeOption.isPremium && (
                <div className="flex items-center justify-center mb-2">
                  <ShoppingCart className="w-4 h-4 text-white mr-1" />
                  <span className="text-white font-medium">€{themeOption.price}</span>
                </div>
              )}
              <p className="text-white text-opacity-80 text-sm">
                {canUseTheme(key, themeOption) ? 'Available' : 'Premium theme'}
              </p>
            </button>
          ))}
        </div>
      </div>

      <div
        className="p-6 rounded-xl shadow-sm border"
        style={{
          backgroundColor: theme.cardBackground,
          borderColor: theme.border
        }}
      >
        <h3 className="text-xl font-semibold mb-6" style={{ color: theme.textPrimary }}>
          Mood Tracker Sticker Packs
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stickerPacks.map(pack => (
            <div
              key={pack.id}
              className="p-6 rounded-xl border hover:shadow-md transition-all duration-200"
              style={{
                backgroundColor: theme.cardBackground,
                borderColor: theme.border
              }}
            >
              <div className="text-center mb-4">
                <div className="text-3xl mb-2">
                  {pack.preview.join(' ')}
                </div>
                <h4 className="font-semibold text-lg mb-1" style={{ color: theme.textPrimary }}>
                  {pack.name}
                </h4>
                <p className="text-sm mb-3" style={{ color: theme.textSecondary }}>
                  {pack.description}
                </p>
              </div>
              
              {purchasedStickers.includes(pack.id) ? (
                <div className="text-center">
                  <div
                    className="inline-flex items-center px-4 py-2 rounded-lg font-medium"
                    style={{ backgroundColor: theme.hover, color: theme.accent }}
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Purchased
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => handlePurchase(pack.id, 'sticker')}
                  className="w-full flex items-center justify-center px-4 py-2 rounded-lg font-medium text-white shadow-sm hover:shadow-md transition-all duration-200"
                  style={{ backgroundColor: theme.accent }}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Buy for €{pack.price}
                </button>
              )}
            </div>
          ))}
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
          Current Theme: {theme.name}
        </h3>
        <p style={{ color: theme.textSecondary }} className="mb-4">
          Your selected theme will be saved automatically and applied across all features of the app.
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div
              className="w-12 h-12 rounded-lg mx-auto mb-2"
              style={{ backgroundColor: theme.accent }}
            ></div>
            <p className="text-sm" style={{ color: theme.textSecondary }}>Accent</p>
          </div>
          <div className="text-center">
            <div
              className="w-12 h-12 rounded-lg mx-auto mb-2 border"
              style={{ 
                backgroundColor: theme.cardBackground,
                borderColor: theme.border
              }}
            ></div>
            <p className="text-sm" style={{ color: theme.textSecondary }}>Cards</p>
          </div>
          <div className="text-center">
            <div
              className="w-12 h-12 rounded-lg mx-auto mb-2"
              style={{ backgroundColor: theme.textPrimary }}
            ></div>
            <p className="text-sm" style={{ color: theme.textSecondary }}>Text</p>
          </div>
          <div className="text-center">
            <div
              className="w-12 h-12 rounded-lg mx-auto mb-2 border"
              style={{ backgroundColor: theme.hover }}
            ></div>
            <p className="text-sm" style={{ color: theme.textSecondary }}>Hover</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeSelector;