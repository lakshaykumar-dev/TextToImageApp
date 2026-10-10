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
          <View style={[styles.swatchPreview, { backgroundColor: selectedColor }]} />
          <Text style={styles.hexCode}>{selectedColor.toUpperCase()}</Text>
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.paletteScroll}>
        {palette.map((color) => {
          const isSelected = selectedColor.toLowerCase() === color.toLowerCase();
          return (
            <TouchableOpacity
              key={color}
              onPress={() => {
                setCustomHex(color);
                onSelectColor(color);
              }}
              style={[
                styles.colorCircle,
                { backgroundColor: color },
                isSelected && styles.selectedCircle,
                color.toLowerCase() === '#ffffff' && styles.whiteBorder,
              ]}
              activeOpacity={0.7}
            >
              {isSelected && (
                <View
                  style={[
                    styles.checkDot,
                    {
                      backgroundColor:
                        color.toLowerCase() === '#ffffff' || color.toLowerCase() === '#fbbf24'
                          ? '#000000'
                          : '#FFFFFF',
                    },
                  ]}
                />
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Custom HEX input */}
      <View style={styles.hexInputRow}>
        <Text style={styles.hexInputLabel}>Custom HEX:</Text>
        <TextInput
          value={customHex}
          onChangeText={handleCustomHexChange}
          placeholder="#123456"
          placeholderTextColor="#94A3B8"
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
    marginVertical: 8,
    backgroundColor: '#1E293B',
    padding: 14,
    borderRadius: 14,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '600',
  },
  currentPreviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  swatchPreview: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 8,
    borderWidth: 1.5,
    borderColor: '#475569',
  },
  hexCode: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '600',
    fontFamily: 'monospace',
  },
  paletteScroll: {
    flexDirection: 'row',
    paddingVertical: 4,
  },
  colorCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  whiteBorder: {
    borderWidth: 1.5,
    borderColor: '#94A3B8',
  },
  selectedCircle: {
    borderWidth: 3,
    borderColor: '#60A5FA',
    transform: [{ scale: 1.1 }],
  },
  checkDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  hexInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  hexInputLabel: {
    color: '#94A3B8',
    fontSize: 13,
    marginRight: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#0F172A',
    color: '#F8FAFC',
    fontSize: 14,
    fontFamily: 'monospace',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
});
