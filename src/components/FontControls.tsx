import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { FontFamilyType, AspectRatioType } from '../types';
import { FONT_OPTIONS } from '../constants/presets';

interface FontControlsProps {
  fontFamily: FontFamilyType;
  onChangeFontFamily: (font: FontFamilyType) => void;
  fontSize: number;
  onChangeFontSize: (size: number) => void;
  fontWeight: 'normal' | 'bold' | '900';
  onChangeFontWeight: (weight: 'normal' | 'bold' | '900') => void;
  isItalic: boolean;
  onToggleItalic: () => void;
  textAlign: 'center' | 'left' | 'right';
  onChangeTextAlign: (align: 'center' | 'left' | 'right') => void;
  aspectRatio: AspectRatioType;
  onChangeAspectRatio: (ratio: AspectRatioType) => void;
}

const SIZE_PRESETS = [20, 28, 36, 44, 52];
const RATIOS: { label: string; value: AspectRatioType }[] = [
  { label: 'Square 1:1', value: '1:1' },
  { label: 'Story 4:5', value: '4:5' },
  { label: 'Banner 16:9', value: '16:9' },
];

export const FontControls: React.FC<FontControlsProps> = ({
  fontFamily,
  onChangeFontFamily,
  fontSize,
  onChangeFontSize,
  fontWeight,
  onChangeFontWeight,
  isItalic,
  onToggleItalic,
  textAlign,
  onChangeTextAlign,
  aspectRatio,
  onChangeAspectRatio,
}) => {
  return (
    <View style={styles.card}>
      {/* Aspect Ratio */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Image Shape / Ratio</Text>
        <View style={styles.chipRow}>
          {RATIOS.map((item) => {
            const isSelected = aspectRatio === item.value;
            return (
              <TouchableOpacity
                key={item.value}
                onPress={() => onChangeAspectRatio(item.value)}
                style={[styles.chip, isSelected && styles.activeChip]}
              >
                <Text style={[styles.chipText, isSelected && styles.activeChipText]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Font Family */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Font Family</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollChips}>
          {FONT_OPTIONS.map((f) => {
            const isSelected = fontFamily === f.value;
            return (
              <TouchableOpacity
                key={f.value}
                onPress={() => onChangeFontFamily(f.value)}
                style={[styles.chip, isSelected && styles.activeChip]}
              >
                <Text
                  style={[
                    styles.chipText,
                    isSelected && styles.activeChipText,
                    { fontFamily: f.value },
                  ]}
                >
                  {f.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Font Size */}
      <View style={styles.section}>
        <View style={styles.rowBetween}>
          <Text style={styles.sectionTitle}>Font Size</Text>
          <View style={styles.stepperRow}>
            <TouchableOpacity
              onPress={() => onChangeFontSize(Math.max(14, fontSize - 2))}
              style={styles.stepperButton}
            >
              <Text style={styles.stepperText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.sizeIndicator}>{fontSize}px</Text>
            <TouchableOpacity
              onPress={() => onChangeFontSize(Math.min(72, fontSize + 2))}
              style={styles.stepperButton}
            >
              <Text style={styles.stepperText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.chipRow}>
          {SIZE_PRESETS.map((sz) => (
            <TouchableOpacity
              key={sz}
              onPress={() => onChangeFontSize(sz)}
              style={[styles.sizeChip, fontSize === sz && styles.activeChip]}
            >
              <Text style={[styles.chipText, fontSize === sz && styles.activeChipText]}>
                {sz}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Font Weight & Style & Alignment */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Weight, Style & Align</Text>
        <View style={styles.chipRow}>
          <TouchableOpacity
            onPress={() => onChangeFontWeight('normal')}
            style={[styles.chip, fontWeight === 'normal' && styles.activeChip]}
          >
            <Text style={[styles.chipText, fontWeight === 'normal' && styles.activeChipText]}>
              Regular
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onChangeFontWeight('bold')}
            style={[styles.chip, fontWeight === 'bold' && styles.activeChip]}
          >
            <Text
              style={[
                styles.chipText,
                { fontWeight: 'bold' },
                fontWeight === 'bold' && styles.activeChipText,
              ]}
            >
              Bold
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onChangeFontWeight('900')}
            style={[styles.chip, fontWeight === '900' && styles.activeChip]}
          >
            <Text
              style={[
                styles.chipText,
                { fontWeight: '900' },
                fontWeight === '900' && styles.activeChipText,
              ]}
            >
              Heavy
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onToggleItalic}
            style={[styles.chip, isItalic && styles.activeChip]}
          >
            <Text
              style={[
                styles.chipText,
                { fontStyle: 'italic' },
                isItalic && styles.activeChipText,
              ]}
            >
              Italic
            </Text>
          </TouchableOpacity>
        </View>

        {/* Alignment */}
        <View style={[styles.chipRow, { marginTop: 8 }]}>
          {(['left', 'center', 'right'] as const).map((align) => (
            <TouchableOpacity
              key={align}
              onPress={() => onChangeTextAlign(align)}
              style={[styles.chip, textAlign === align && styles.activeChip, { flex: 1 }]}
            >
              <Text
                style={[
                  styles.chipText,
                  textAlign === align && styles.activeChipText,
                  { textAlign: 'center' },
                ]}
              >
                {align.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1E293B',
    padding: 14,
    borderRadius: 14,
    marginVertical: 8,
  },
  section: {
    marginBottom: 14,
  },
  sectionTitle: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  scrollChips: {
    flexDirection: 'row',
  },
  chip: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#334155',
    marginRight: 6,
    marginBottom: 4,
  },
  sizeChip: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  activeChip: {
    backgroundColor: '#3B82F6',
    borderColor: '#60A5FA',
  },
  chipText: {
    color: '#CBD5E1',
    fontSize: 13,
  },
  activeChipText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepperButton: {
    backgroundColor: '#334155',
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepperText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  sizeIndicator: {
    color: '#60A5FA',
    fontSize: 14,
    fontWeight: 'bold',
    marginHorizontal: 10,
    fontFamily: 'monospace',
  },
});
