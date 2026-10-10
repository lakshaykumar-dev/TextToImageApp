# TextToImageApp 🎨📱

A modern React Native mobile app that transforms user-entered text into high-resolution images with extensive styling controls and native sharing.

---

## ✨ Features

- **Text Input & Presets**:
  - Multi-line text input with character limit and counter.
  - ✨ Random Quote generator for instant inspiration.
- **Background Customization**:
  - Rich color palette picker (dark, light, pastel, vibrant).
  - Custom HEX color input with real-time validation.
  - Aspect Ratio controls:
    - **1:1** Square (Instagram / Profile)
    - **4:5** Portrait / Story
    - **16:9** Banner / Landscape
- **Font & Typography Controls**:
  - **Font Families**: System Sans-Serif, Serif Classic, Monospace Code, Condensed Tall, Medium.
  - **Font Size**: Interactive steppers (- / +) and quick presets (20, 28, 36, 44, 52px).
  - **Font Weight**: Regular, Bold, Heavy (900).
  - **Font Style**: Normal and Italic toggles.
  - **Text Alignment**: Left, Center, Right with automatic word wrapping.
  - **Font Color**: Curated palette + custom HEX color input.
- **Font Stroke (Outline)**:
  - Toggle font stroke on/off.
  - Stroke thickness stepper & chips (1px to 12px).
  - Stroke outline color selector + custom HEX color input.
  - Crisp dual-layer SVG rendering ensuring fill remains clear and stroke wraps smoothly.
- **Image Generation & Sharing**:
  - High-res PNG capture using `react-native-view-shot`.
  - Preview modal for generated image.
  - One-tap native sharing via `react-native-share` and native fallback to share across WhatsApp, Instagram, Telegram, Email, and Files.

---

## 📁 Project Structure

```text
TextToImageApp/
├── App.tsx                     # Main studio interface & canvas coordinator
├── src/
│   ├── types/
│   │   └── index.ts            # ImageConfig & typography types
│   ├── constants/
│   │   └── presets.ts          # Color palettes, stroke colors, font families & quotes
│   └── components/
│       ├── ImageCanvas.tsx     # SVG vector renderer with stroke & word-wrapping
│       ├── ColorPickerRow.tsx  # Palette chips + custom HEX input
│       ├── FontControls.tsx    # Font family, size, weight, italic & ratio controls
│       ├── StrokeControls.tsx  # Font stroke toggle, thickness & color
│       └── GeneratedImageModal.tsx # Generated image viewer & sharing dialog
├── android/                    # Native Android project files
└── ios/                        # Native iOS project files
```

---

## 🚀 Running the Project

### 1. Start Metro Bundler
```sh
npm start
```

### 2. Run on Android
```sh
npm run android
```

### 3. Run on iOS (macOS only)
```sh
cd ios && pod install && cd ..
npm run ios
```
