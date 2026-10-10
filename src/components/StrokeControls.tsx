import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Switch,
} from 'react-native';
import { STROKE_COLORS } from '../constants/presets';
import { ColorPickerRow } from './ColorPickerRow';

interface StrokeControlsProps {
  strokeWidth: number;
  onChangeStrokeWidth: (width: number) => void;
  strokeColor: string;
  onChangeStrokeColor: (color: string) => void;
}

const STROKE_WIDTH_PRESETS = [1, 2, 3, 5, 8];

export const StrokeControls: React.FC<StrokeControlsProps> = ({
  strokeWidth,
  onChangeStrokeWidth,
  strokeColor,
  onChangeStrokeColor,
}) => {
  const isEnabled = strokeWidth > 0;

  const handleToggle = (value: boolean) => {
    if (value) {
      onChangeStrokeWidth(strokeWidth > 0 ? strokeWidth : 2);
    } else {
      onChangeStrokeWidth(0);
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.toggleRow}>
        <View>
          <Text style={styles.title}>Font Stroke (Outline)</Text>
          <Text style={styles.subtitle}>
            {isEnabled ? `Active (${strokeWidth}px)` : 'Disabled'}
          </Text>
        </View>
        <Switch
          value={isEnabled}
          onValueChange={handleToggle}
          trackColor={{ false: '#334155', true: '#3B82F6' }}
          thumbColor={isEnabled ? '#FFFFFF' : '#94A3B8'}
        />
      </View>

      {isEnabled && (
        <>
          {/* Stroke Width Stepper & Chips */}
          <View style={styles.section}>
            <View style={styles.stepperRow}>
              <Text style={styles.sectionTitle}>Stroke Thickness</Text>
              <View style={styles.counterRow}>
                <TouchableOpacity
                  onPress={() => onChangeStrokeWidth(Math.max(1, strokeWidth - 1))}
                  style={styles.stepperBtn}
                >
                  <Text style={styles.stepperText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.widthDisplay}>{strokeWidth}px</Text>
                <TouchableOpacity
                  onPress={() => onChangeStrokeWidth(Math.min(12, strokeWidth + 1))}
                  style={styles.stepperBtn}
                >
                  <Text style={styles.stepperText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.chipRow}>
              {STROKE_WIDTH_PRESETS.map((w) => (
                <TouchableOpacity
                  key={w}
                  onPress={() => onChangeStrokeWidth(w)}
                  style={[styles.widthChip, strokeWidth === w && styles.activeChip]}
                >
                  <Text style={[styles.chipText, strokeWidth === w && styles.activeChipText]}>
                    {w}px
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Stroke Color Picker */}
          <ColorPickerRow
            label="Stroke Outline Color"
            selectedColor={strokeColor}
            onSelectColor={onChangeStrokeColor}
            palette={STROKE_COLORS}
          />
        </>
      )}
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
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '600',
  },
  subtitle: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 2,
  },
  section: {
    marginTop: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  stepperRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    color: '#CBD5E1',
    fontSize: 13,
    fontWeight: '600',
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepperBtn: {
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
  widthDisplay: {
    color: '#60A5FA',
    fontSize: 14,
    fontWeight: 'bold',
    marginHorizontal: 12,
    fontFamily: 'monospace',
  },
  chipRow: {
    flexDirection: 'row',
    gap: 8,
  },
  widthChip: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 14,
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
    fontSize: 12,
  },
  activeChipText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});
