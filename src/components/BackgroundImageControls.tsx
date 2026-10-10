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

const BLUR_PRESETS = [
  { label: 'Sharp (0)', value: 0 },
  { label: 'Soft (3)', value: 3 },
  { label: 'Medium (6)', value: 6 },
  { label: 'Heavy (10)', value: 10 },
];

export const BackgroundImageControls: React.FC<BackgroundImageControlsProps> = ({
  backgroundImageUri,
  onSelectImageUri,
  darkness,
  onChangeDarkness,
  blueTint,
  onChangeBlueTint,
  blur,
  onChangeBlur,
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
          <Text style={styles.cardTitle}>Background Image / Wallpaper</Text>
          <Text style={styles.cardSubtitle}>
            {hasImage ? 'Image active with effects' : 'Select a wallpaper or upload photo'}
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
          <Text style={styles.uploadBtnText}>📸 Pick from Gallery</Text>
        </TouchableOpacity>
      </View>

      {/* Preset Wallpapers Carousel */}
      <Text style={styles.sectionTitle}>Curated Wallpapers</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.presetScroll}>
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
                    { backgroundColor: (preset as any).thumbColor || '#1E1B4B' },
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
          <Text style={styles.effectsHeading}>✨ Visual Effects & Overlays</Text>

          {/* Darkness Filter */}
          <View style={styles.effectGroup}>
            <View style={styles.effectHeader}>
              <Text style={styles.effectTitle}>🌑 Darkness (Dimming)</Text>
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
              <Text style={styles.effectTitle}>🌊 Blue Atmospheric Tint</Text>
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

          {/* Blur Filter */}
          <View style={styles.effectGroup}>
            <View style={styles.effectHeader}>
              <Text style={styles.effectTitle}>🌫️ Background Blur</Text>
              <Text style={styles.effectValue}>{blur}px</Text>
            </View>
            <View style={styles.chipRow}>
              {BLUR_PRESETS.map((p) => {
                const isActive = blur === p.value;
                return (
                  <TouchableOpacity
                    key={p.label}
                    onPress={() => onChangeBlur(p.value)}
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
        </View>
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTitle: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '700',
  },
  cardSubtitle: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 2,
  },
  clearBtn: {
    backgroundColor: '#334155',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  clearBtnText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '600',
  },
  actionRow: {
    marginBottom: 12,
  },
  uploadBtn: {
    backgroundColor: '#0F172A',
    borderWidth: 1.5,
    borderColor: '#3B82F6',
    borderStyle: 'dashed',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  uploadBtnText: {
    color: '#60A5FA',
    fontSize: 14,
    fontWeight: '700',
  },
  sectionTitle: {
    color: '#CBD5E1',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  presetScroll: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  presetThumbContainer: {
    width: 88,
    height: 72,
    borderRadius: 10,
    overflow: 'hidden',
    marginRight: 10,
    borderWidth: 2,
    borderColor: '#334155',
  },
  activePresetThumb: {
    borderColor: '#3B82F6',
    transform: [{ scale: 1.05 }],
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
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingVertical: 2,
    paddingHorizontal: 4,
  },
  presetNameText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '600',
    textAlign: 'center',
  },
  effectsSection: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  effectsHeading: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 10,
  },
  effectGroup: {
    marginBottom: 12,
  },
  effectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  effectTitle: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
  effectValue: {
    color: '#60A5FA',
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'monospace',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  effectChip: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  activeEffectChip: {
    backgroundColor: '#475569',
    borderColor: '#94A3B8',
  },
  activeBlueChip: {
    backgroundColor: '#1E3A8A',
    borderColor: '#3B82F6',
  },
  effectChipText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
  activeEffectChipText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
