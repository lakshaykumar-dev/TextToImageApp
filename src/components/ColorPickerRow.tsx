import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
} from 'react-native';

interface ColorPickerRowProps {
  label: string;
  selectedColor: string;
  onSelectColor: (color: string) => void;
  palette: string[];
}

export const ColorPickerRow: React.FC<ColorPickerRowProps> = ({
  label,
  selectedColor,
  onSelectColor,
  palette,
}) => {
  const [customHex, setCustomHex] = useState(selectedColor);

  const handleCustomHexChange = (text: string) => {
    setCustomHex(text);
    if (/^#[0-9A-Fa-f]{6}$/.test(text)) {
      onSelectColor(text);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.currentPreviewRow}>
          <View style={[styles.swatchMini, { backgroundColor: selectedColor }]} />
          <Text style={styles.hexCode}>{selectedColor.toUpperCase()}</Text>
        </View>
      </View>

      {/* Luxury Swatch Dots (exact look from reference) */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.paletteScroll}>
        {palette.map((color) => {
          const isSelected = selectedColor.toLowerCase() === color.toLowerCase();
          return (
            <TouchableOpacity
              key={color}
              onPress={() => {
                setCustomHex(color);
                onSelectColor(color);
              }}
              style={styles.ringContainer}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.outerRing,
                  isSelected && styles.activeOuterRing,
                ]}
              >
                <View
                  style={[
                    styles.colorCircle,
                    { backgroundColor: color },
                    color.toLowerCase() === '#ffffff' && styles.whiteBorder,
                  ]}
                />
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Minimalist HEX input */}
      <View style={styles.hexInputRow}>
        <Text style={styles.hexInputLabel}>Custom HEX</Text>
        <TextInput
          value={customHex}
          onChangeText={handleCustomHexChange}
          placeholder="#18181B"
          placeholderTextColor="#A1A1AA"
          maxLength={7}
          autoCapitalize="characters"
          style={styles.input}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#F4F4F5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    color: '#18181B',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  currentPreviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F4F5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  swatchMini: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: 6,
    borderWidth: 1,
    borderColor: '#E4E4E7',
  },
  hexCode: {
    color: '#71717A',
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'monospace',
  },
  paletteScroll: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    gap: 4,
  },
  ringContainer: {
    padding: 2,
  },
  outerRing: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  activeOuterRing: {
    borderColor: '#18181B',
  },
  colorCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  whiteBorder: {
    borderWidth: 1,
    borderColor: '#E4E4E7',
  },
  hexInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F4F4F5',
  },
  hexInputLabel: {
    color: '#71717A',
    fontSize: 12,
    fontWeight: '500',
    marginRight: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#F4F4F5',
    color: '#18181B',
    fontSize: 13,
    fontFamily: 'monospace',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E4E4E7',
  },
});
