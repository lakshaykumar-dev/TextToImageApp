import { FontFamilyType } from '../types';

export const COLOR_PALETTE = [
  '#18181B', // Onyx Dark
  '#2563EB', // Royal Blue
  '#EF4444', // Crimson Coral
  '#059669', // Emerald
  '#D97706', // Honey Amber
  '#7C3AED', // Violet
  '#0F172A', // Midnight Navy
  '#E11D48', // Rose
  '#FFFFFF', // Pure White
  '#475569', // Slate
];

export const STROKE_COLORS = [
  '#18181B', // Onyx Dark
  '#FFFFFF', // Pure White
  '#2563EB', // Royal Blue
  '#D97706', // Amber Gold
  '#EF4444', // Red
  '#059669', // Emerald
  '#7C3AED', // Purple
  '#06B6D4', // Cyan
];

export const FONT_OPTIONS: { label: string; value: FontFamilyType }[] = [
  { label: 'Serif (Editorial)', value: 'serif' },
  { label: 'Sans (Modern)', value: 'sans-serif' },
  { label: 'Mono (Minimal)', value: 'monospace' },
  { label: 'Condensed', value: 'sans-serif-condensed' },
  { label: 'Medium', value: 'sans-serif-medium' },
];

export const SAMPLE_QUOTES = [
  { text: 'Creativity is intelligence having fun.', author: 'Albert Einstein' },
  { text: 'Simplicity is the ultimate sophistication.', author: 'Leonardo da Vinci' },
  { text: 'Design is intelligence made visible.', author: 'Alina Wheeler' },
  { text: 'Turn your wounds into wisdom.', author: 'Oprah Winfrey' },
  { text: 'Make each day your masterpiece.', author: 'John Wooden' },
  { text: 'Stay hungry, stay foolish.', author: 'Steve Jobs' },
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
