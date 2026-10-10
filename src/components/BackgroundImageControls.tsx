import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { PRESET_BACKGROUND_IMAGES } from '../constants/presets';

interface BackgroundImageControlsProps {
  backgroundImageUri?: string | null;
  onSelectImageUri: (uri: string | null) => void;
  darkness: number;
  onChangeDarkness: (val: number) => void;
  blueTint: number;
  onChangeBlueTint: (val: number) => void;
  blur: number;
  onChangeBlur: (val: number) => void;
}

const DARKNESS_PRESETS = [
  { label: 'Off', value: 0 },
  { label: '30%', value: 0.3 },
  { label: '50%', value: 0.5 },
  { label: '70%', value: 0.7 },
  { label: '85%', value: 0.85 },
];

const BLUE_TINT_PRESETS = [
  { label: 'Off', value: 0 },
  { label: '25%', value: 0.25 },
  { label: '45%', value: 0.45 },
  { label: '65%', value: 0.65 },
  { label: '80%', value: 0.8 },
];

export const BackgroundImageControls: React.FC<BackgroundImageControlsProps> = ({
  backgroundImageUri,
  onSelectImageUri,
  darkness,
  onChangeDarkness,
  blueTint,
  onChangeBlueTint,
}) => {
  const handlePickFromGallery = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 1,
        selectionLimit: 1,
      });

      if (result.didCancel) {
        return;
      }

      if (result.errorCode) {
        Alert.alert('Image Picker Error', result.errorMessage || 'Unable to open gallery');
        return;
      }

      const selectedAsset = result.assets?.[0];
      if (selectedAsset?.uri) {
        onSelectImageUri(selectedAsset.uri);
      }
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Could not pick image');
    }
  };

  const hasImage = Boolean(backgroundImageUri);

  return (
    <View style={styles.card}>
      {/* Pick / Remove Header */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.cardTitle}>Background Wallpaper</Text>
          <Text style={styles.cardSubtitle}>
            {hasImage ? 'Custom wallpaper active' : 'Select a curated wallpaper or upload photo'}
          </Text>
        </View>

        {hasImage && (
          <TouchableOpacity onPress={() => onSelectImageUri(null)} style={styles.clearBtn}>
            <Text style={styles.clearBtnText}>✕ Remove</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Action Buttons */}
      <View style={styles.actionRow}>
        <TouchableOpacity onPress={handlePickFromGallery} style={styles.uploadBtn}>
          <Text style={styles.uploadBtnText}>📸 Choose Photo from Gallery</Text>
        </TouchableOpacity>
      </View>

      {/* Preset Wallpapers Carousel */}
      <Text style={styles.sectionTitle}>Curated Textures & Wallpapers</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.presetScroll}>
        {PRESET_BACKGROUND_IMAGES.map((preset) => {
          const isSelected = backgroundImageUri === preset.uri;
          return (
            <TouchableOpacity
              key={preset.name}
              onPress={() => onSelectImageUri(preset.uri)}
              style={[styles.presetThumbContainer, isSelected && styles.activePresetThumb]}
              activeOpacity={0.8}
            >
              {preset.type === 'gradient' ? (
                <View
                  style={[
                    styles.presetThumb,
                    { backgroundColor: (preset as any).thumbColor || '#18181B' },
                  ]}
                />
              ) : (
                <Image source={{ uri: preset.uri }} style={styles.presetThumb} />
              )}
              <View style={styles.presetNameBadge}>
                <Text style={styles.presetNameText} numberOfLines={1}>
                  {preset.name}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Image Effects Section */}
      {hasImage && (
        <View style={styles.effectsSection}>
          <Text style={styles.effectsHeading}>Atmosphere & Overlays</Text>

          {/* Darkness Filter */}
          <View style={styles.effectGroup}>
            <View style={styles.effectHeader}>
              <Text style={styles.effectTitle}>Darkness (Dimming)</Text>
              <Text style={styles.effectValue}>{Math.round(darkness * 100)}%</Text>
            </View>
            <View style={styles.chipRow}>
              {DARKNESS_PRESETS.map((p) => {
                const isActive = Math.abs(darkness - p.value) < 0.05;
                return (
                  <TouchableOpacity
                    key={p.label}
                    onPress={() => onChangeDarkness(p.value)}
                    style={[styles.effectChip, isActive && styles.activeEffectChip]}
                  >
                    <Text style={[styles.effectChipText, isActive && styles.activeEffectChipText]}>
                      {p.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Blue Tint Filter */}
          <View style={styles.effectGroup}>
            <View style={styles.effectHeader}>
              <Text style={styles.effectTitle}>Blue Atmospheric Tint</Text>
              <Text style={styles.effectValue}>{Math.round(blueTint * 100)}%</Text>
            </View>
            <View style={styles.chipRow}>
              {BLUE_TINT_PRESETS.map((p) => {
                const isActive = Math.abs(blueTint - p.value) < 0.05;
                return (
                  <TouchableOpacity
                    key={p.label}
                    onPress={() => onChangeBlueTint(p.value)}
                    style={[styles.effectChip, isActive && styles.activeBlueChip]}
                  >
                    <Text
                      style={[
                        styles.effectChipText,
                        isActive && styles.activeEffectChipText,
                      ]}
                    >
                      {p.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    color: '#18181B',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  cardSubtitle: {
    color: '#71717A',
    fontSize: 12,
    marginTop: 2,
  },
  clearBtn: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  clearBtnText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '600',
  },
  actionRow: {
    marginBottom: 14,
  },
  uploadBtn: {
    backgroundColor: '#F4F4F5',
    borderWidth: 1.5,
    borderColor: '#E4E4E7',
    borderStyle: 'dashed',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  uploadBtnText: {
    color: '#18181B',
    fontSize: 13,
    fontWeight: '600',
  },
  sectionTitle: {
    color: '#18181B',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 10,
  },
  presetScroll: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  presetThumbContainer: {
    width: 90,
    height: 76,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#E4E4E7',
  },
  activePresetThumb: {
    borderColor: '#18181B',
    transform: [{ scale: 1.04 }],
  },
  presetThumb: {
    width: '100%',
    height: '100%',
  },
  presetNameBadge: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(24, 24, 27, 0.75)',
    paddingVertical: 3,
    paddingHorizontal: 4,
  },
  presetNameText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '600',
    textAlign: 'center',
  },
  effectsSection: {
    marginTop: 10,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#F4F4F5',
  },
  effectsHeading: {
    color: '#18181B',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 10,
  },
  effectGroup: {
    marginBottom: 14,
  },
  effectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  effectTitle: {
    color: '#71717A',
    fontSize: 12,
    fontWeight: '500',
  },
  effectValue: {
    color: '#18181B',
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'monospace',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  effectChip: {
    backgroundColor: '#F4F4F5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E4E4E7',
  },
  activeEffectChip: {
    backgroundColor: '#18181B',
    borderColor: '#18181B',
  },
  activeBlueChip: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  effectChipText: {
    color: '#52525B',
    fontSize: 12,
    fontWeight: '500',
  },
  activeEffectChipText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
