import { FontFamilyType } from '../types';

export const COLOR_PALETTE = [
  '#000000', // Black
  '#FFFFFF', // White
  '#6366F1', // Indigo
  '#EC4899', // Pink
  '#EF4444', // Red
  '#F59E0B', // Amber
  '#10B981', // Emerald
  '#06B6D4', // Cyan
  '#3B82F6', // Blue
  '#8B5CF6', // Purple
  '#14B8A6', // Teal
  '#F97316', // Orange
  '#1E293B', // Slate Dark
  '#0F172A', // Midnight
  '#7C3AED', // Violet
  '#E11D48', // Rose
  '#FBBF24', // Yellow
  '#84CC16', // Lime
];

export const STROKE_COLORS = [
  '#000000',
  '#FFFFFF',
  '#FBBF24',
  '#EF4444',
  '#3B82F6',
  '#10B981',
  '#EC4899',
  '#8B5CF6',
  '#F97316',
  '#06B6D4',
];

export const FONT_OPTIONS: { label: string; value: FontFamilyType }[] = [
  { label: 'Default (Sans)', value: 'sans-serif' },
  { label: 'Serif (Classic)', value: 'serif' },
  { label: 'Monospace (Code)', value: 'monospace' },
  { label: 'Condensed (Tall)', value: 'sans-serif-condensed' },
  { label: 'Medium (Modern)', value: 'sans-serif-medium' },
];

export const SAMPLE_QUOTES = [
  { text: 'Creativity is intelligence having fun.', author: 'Albert Einstein' },
  { text: 'Stay hungry, stay foolish.', author: 'Steve Jobs' },
  { text: 'Turn your wounds into wisdom.', author: 'Oprah Winfrey' },
  { text: 'Be the change you wish to see in the world.', author: 'Mahatma Gandhi' },
  { text: 'Make each day your masterpiece.', author: 'John Wooden' },
  { text: 'It always seems impossible until it is done.', author: 'Nelson Mandela' },
];

export const PRESET_BACKGROUND_IMAGES = [
  {
    name: '🌌 Deep Cosmic',
    type: 'gradient',
    uri: 'gradient:cosmic',
    thumbColor: '#1E1B4B',
  },
  {
    name: '🌊 Ocean Night',
    type: 'gradient',
    uri: 'gradient:ocean',
    thumbColor: '#0B132B',
  },
  {
    name: '🌅 Sunset Glow',
    type: 'gradient',
    uri: 'gradient:sunset',
    thumbColor: '#450A0A',
  },
  {
    name: '🌲 Emerald Deep',
    type: 'gradient',
    uri: 'gradient:emerald',
    thumbColor: '#022C22',
  },
  {
    name: '✨ Stars Cosmos',
    type: 'photo',
    uri: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=800&q=80',
  },
  {
    name: '🌫️ Foggy Forest',
    type: 'photo',
    uri: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80',
  },
  {
    name: '🌆 Cyber City',
    type: 'photo',
    uri: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800&q=80',
  },
];
