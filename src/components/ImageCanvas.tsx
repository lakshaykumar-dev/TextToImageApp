import React, { forwardRef } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, {
  Rect,
  Text as SvgText,
  Line,
  Defs,
  LinearGradient,
  Stop,
  ClipPath,
  G,
  Image as SvgImage,
} from 'react-native-svg';
import { ImageConfig } from '../types';

interface ImageCanvasProps {
  config: ImageConfig;
  previewWidth?: number;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Word wrap helper to prevent text overflowing the canvas
function wrapText(text: string, maxCharsPerLine: number): string[] {
  const paragraphs = text.split('\n');
  const result: string[] = [];

  for (const para of paragraphs) {
    if (!para.trim()) {
      result.push('');
      continue;
    }
    const words = para.split(/\s+/);
    let currentLine = '';

    for (const word of words) {
      if ((currentLine + (currentLine ? ' ' : '') + word).length <= maxCharsPerLine) {
        currentLine += (currentLine ? ' ' : '') + word;
      } else {
        if (currentLine) {
          result.push(currentLine);
        }
        currentLine = word;
      }
    }
    if (currentLine) {
      result.push(currentLine);
    }
  }

  return result.length > 0 ? result : [''];
}

export const ImageCanvas = forwardRef<any, ImageCanvasProps>(({ config, previewWidth }, ref) => {
  const canvasWidth = previewWidth || Math.min(SCREEN_WIDTH - 32, 380);

  let canvasHeight = canvasWidth;
  if (config.aspectRatio === '4:5') {
    canvasHeight = (canvasWidth * 5) / 4;
  } else if (config.aspectRatio === '16:9') {
    canvasHeight = (canvasWidth * 9) / 16;
  }

  // Estimate max characters per line based on canvas width and font size
  const maxChars = Math.max(10, Math.floor((canvasWidth - 48) / (config.fontSize * 0.58)));
  const lines = wrapText(config.text || 'Your Text Here', maxChars);

  const lineHeight = config.fontSize * 1.35;
  const totalQuoteHeight = lines.length * lineHeight;

  const hasAuthor = Boolean(config.author && config.author.trim());
  const authorFontSize = Math.max(13, Math.round(config.fontSize * 0.48));
  const authorSpacing = hasAuthor ? authorFontSize * 2.5 : 0;

  const totalContentHeight = totalQuoteHeight + authorSpacing;
  const startY = (canvasHeight - totalContentHeight) / 2 + config.fontSize * 0.85;
  const authorY = startY + (lines.length - 1) * lineHeight + authorSpacing;
  const dividerY = authorY - authorFontSize * 1.4;

  let textAnchor: 'middle' | 'start' | 'end' = 'middle';
  let anchorX = canvasWidth / 2;
  let dividerX1 = canvasWidth / 2 - 32;
  let dividerX2 = canvasWidth / 2 + 32;

  if (config.textAlign === 'left') {
    textAnchor = 'start';
    anchorX = 32;
    dividerX1 = 32;
    dividerX2 = 80;
  } else if (config.textAlign === 'right') {
    textAnchor = 'end';
    anchorX = canvasWidth - 32;
    dividerX1 = canvasWidth - 80;
    dividerX2 = canvasWidth - 32;
  }

  const hasStroke = config.strokeWidth > 0;
  const authorText =
    config.authorStyle === 'badge' ? config.author.trim() : `— ${config.author.trim()}`;

  // Pill badge dimensions for badge style
  const pillPadding = 16;
  const pillWidth = Math.min(
    canvasWidth - 64,
    authorText.length * (authorFontSize * 0.6) + pillPadding * 2
  );
  const pillHeight = authorFontSize * 1.9;
  let pillX = anchorX - pillWidth / 2;
  if (config.textAlign === 'left') {
    pillX = 32;
  } else if (config.textAlign === 'right') {
    pillX = canvasWidth - 32 - pillWidth;
  }

  const bgUri = config.backgroundImageUri || '';
  const isGradient = bgUri.startsWith('gradient:');
  const isPhoto = Boolean(bgUri && !isGradient);
  const hasBgImage = Boolean(bgUri);

  return (
    <View
      ref={ref}
      collapsable={false}
      style={[
        styles.canvasContainer,
        {
          width: canvasWidth,
          height: canvasHeight,
          backgroundColor: config.backgroundColor,
        },
      ]}
    >
      <Svg width={canvasWidth} height={canvasHeight} viewBox={`0 0 ${canvasWidth} ${canvasHeight}`}>
        <Defs>
          {/* Rounded Corner Clip */}
          <ClipPath id="canvasClip">
            <Rect width={canvasWidth} height={canvasHeight} rx={16} ry={16} />
          </ClipPath>

          {/* Gradients */}
          <LinearGradient id="grad_cosmic" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#0B0F19" />
            <Stop offset="50%" stopColor="#1E1B4B" />
            <Stop offset="100%" stopColor="#4A044E" />
          </LinearGradient>

          <LinearGradient id="grad_ocean" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#030712" />
            <Stop offset="45%" stopColor="#0F172A" />
            <Stop offset="100%" stopColor="#1E3A8A" />
          </LinearGradient>

          <LinearGradient id="grad_sunset" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#180424" />
            <Stop offset="50%" stopColor="#450A0A" />
            <Stop offset="100%" stopColor="#78350F" />
          </LinearGradient>

          <LinearGradient id="grad_emerald" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#021C16" />
            <Stop offset="50%" stopColor="#064E3B" />
            <Stop offset="100%" stopColor="#047857" />
          </LinearGradient>
        </Defs>

        <G clipPath="url(#canvasClip)">
          {/* 1. Base Layer */}
          {!hasBgImage && (
            <Rect width="100%" height="100%" fill={config.backgroundColor} />
          )}

          {/* 2. Gradient Wallpapers */}
          {bgUri === 'gradient:cosmic' && (
            <Rect width="100%" height="100%" fill="url(#grad_cosmic)" />
          )}
          {bgUri === 'gradient:ocean' && (
            <Rect width="100%" height="100%" fill="url(#grad_ocean)" />
          )}
          {bgUri === 'gradient:sunset' && (
            <Rect width="100%" height="100%" fill="url(#grad_sunset)" />
          )}
          {bgUri === 'gradient:emerald' && (
            <Rect width="100%" height="100%" fill="url(#grad_emerald)" />
          )}

          {/* 3. Photo Wallpaper (Device Gallery or Web URL) */}
          {isPhoto && (
            <SvgImage
              href={{ uri: bgUri }}
              width="100%"
              height="100%"
              preserveAspectRatio="xMidYMid slice"
            />
          )}

          {/* 4. Darkness Effect (Dimming Overlay) */}
          {hasBgImage && config.backgroundDarkness > 0 && (
            <Rect
              width="100%"
              height="100%"
              fill="#000000"
              fillOpacity={config.backgroundDarkness}
            />
          )}

          {/* 5. Blue Atmospheric Tint Effect */}
          {hasBgImage && config.backgroundBlueTint > 0 && (
            <Rect
              width="100%"
              height="100%"
              fill="#1E3A8A"
              fillOpacity={config.backgroundBlueTint}
            />
          )}

          {/* 6. Decorative Watermark Quote */}
          <SvgText
            x={28}
            y={60}
            fill={config.textColor}
            fillOpacity={0.08}
            fontSize={68}
            fontFamily="serif"
            fontWeight="900"
          >
            “
          </SvgText>

          {/* 7. Quote Outer Stroke (Behind Fill) */}
          {hasStroke &&
            lines.map((line, idx) => (
              <SvgText
                key={`stroke-${idx}`}
                x={anchorX}
                y={startY + idx * lineHeight}
                stroke={config.strokeColor}
                strokeWidth={config.strokeWidth * 2}
                strokeLinejoin="round"
                strokeLinecap="round"
                fill={config.strokeColor}
                fontSize={config.fontSize}
                fontWeight={config.fontWeight}
                fontFamily={config.fontFamily}
                fontStyle={config.isItalic ? 'italic' : 'normal'}
                textAnchor={textAnchor}
              >
                {line}
              </SvgText>
            ))}

          {/* 8. Quote Foreground Fill */}
          {lines.map((line, idx) => (
            <SvgText
              key={`fill-${idx}`}
              x={anchorX}
              y={startY + idx * lineHeight}
              fill={config.textColor}
              fontSize={config.fontSize}
              fontWeight={config.fontWeight}
              fontFamily={config.fontFamily}
              fontStyle={config.isItalic ? 'italic' : 'normal'}
              textAnchor={textAnchor}
            >
              {line}
            </SvgText>
          ))}

          {/* 9. Author Section */}
          {hasAuthor && (
            <>
              {config.authorStyle === 'classic' && (
                <Line
                  x1={dividerX1}
                  y1={dividerY}
                  x2={dividerX2}
                  y2={dividerY}
                  stroke={config.textColor}
                  strokeWidth={2}
                  strokeOpacity={0.4}
                  strokeLinecap="round"
                />
              )}

              {config.authorStyle === 'badge' && (
                <Rect
                  x={pillX}
                  y={authorY - authorFontSize * 1.15}
                  width={pillWidth}
                  height={pillHeight}
                  rx={pillHeight / 2}
                  fill={config.textColor}
                  fillOpacity={0.16}
                  stroke={config.textColor}
                  strokeWidth={1}
                  strokeOpacity={0.3}
                />
              )}

              {hasStroke && config.authorStyle !== 'badge' && (
                <SvgText
                  x={anchorX}
                  y={authorY}
                  stroke={config.strokeColor}
                  strokeWidth={Math.max(1, config.strokeWidth * 1.2)}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  fill={config.strokeColor}
                  fontSize={authorFontSize}
                  fontWeight="700"
                  fontFamily={config.fontFamily}
                  fontStyle="italic"
                  textAnchor={textAnchor}
                >
                  {authorText}
                </SvgText>
              )}

              <SvgText
                x={config.authorStyle === 'badge' ? pillX + pillWidth / 2 : anchorX}
                y={authorY}
                fill={config.textColor}
                fillOpacity={config.authorStyle === 'badge' ? 0.95 : 0.85}
                fontSize={authorFontSize}
                fontWeight="700"
                fontFamily={config.fontFamily}
                fontStyle={config.authorStyle === 'badge' ? 'normal' : 'italic'}
                textAnchor={config.authorStyle === 'badge' ? 'middle' : textAnchor}
              >
                {authorText}
              </SvgText>
            </>
          )}
        </G>
      </Svg>
    </View>
  );
});

const styles = StyleSheet.create({
  canvasContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
});
