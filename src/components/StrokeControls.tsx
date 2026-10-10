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
          <Text style={styles.title}>Font Stroke Outline</Text>
          <Text style={styles.subtitle}>
            {isEnabled ? `Active outline (${strokeWidth}px)` : 'Disabled'}
          </Text>
        </View>
        <Switch
          value={isEnabled}
          onValueChange={handleToggle}
          trackColor={{ false: '#E4E4E7', true: '#18181B' }}
          thumbColor="#FFFFFF"
        />
      </View>

      {isEnabled && (
        <>
          {/* Stroke Width Stepper & Chips */}
          <View style={styles.section}>
            <View style={styles.stepperRow}>
              <Text style={styles.sectionTitle}>Outline Thickness</Text>
              <View style={styles.counterRow}>
                <TouchableOpacity
                  onPress={() => onChangeStrokeWidth(Math.max(1, strokeWidth - 1))}
                  style={styles.stepperBtn}
                >
                  <Text style={styles.stepperText}>−</Text>
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
            label="Outline Color"
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
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 18,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: '#F4F4F5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: '#18181B',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  subtitle: {
    color: '#71717A',
    fontSize: 12,
    marginTop: 2,
  },
  section: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F4F4F5',
  },
  stepperRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    color: '#18181B',
    fontSize: 13,
    fontWeight: '600',
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F4F5',
    borderRadius: 20,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  stepperBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  stepperText: {
    color: '#18181B',
    fontSize: 16,
    fontWeight: 'bold',
  },
  widthDisplay: {
    color: '#18181B',
    fontSize: 13,
    fontWeight: '700',
    marginHorizontal: 10,
    fontFamily: 'monospace',
  },
  chipRow: {
    flexDirection: 'row',
    gap: 8,
  },
  widthChip: {
    backgroundColor: '#F4F4F5',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E4E4E7',
  },
  activeChip: {
    backgroundColor: '#18181B',
    borderColor: '#18181B',
  },
  chipText: {
    color: '#52525B',
    fontSize: 12,
    fontWeight: '500',
  },
  activeChipText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
