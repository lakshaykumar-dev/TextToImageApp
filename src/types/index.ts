export type AspectRatioType = '1:1' | '4:5' | '16:9';

export type FontFamilyType = 'sans-serif' | 'serif' | 'monospace' | 'sans-serif-condensed' | 'sans-serif-medium';

export interface ImageConfig {
  text: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: FontFamilyType;
  fontSize: number;
  fontWeight: 'normal' | 'bold' | '900';
  isItalic: boolean;
  strokeColor: string;
  strokeWidth: number;
  textAlign: 'center' | 'left' | 'right';
  aspectRatio: AspectRatioType;
  padding: number;
  author: string;
  authorStyle: 'classic' | 'badge' | 'minimal';
  backgroundImageUri?: string | null;
  backgroundDarkness: number;
  backgroundBlueTint: number;
  backgroundBlur: number;
}
