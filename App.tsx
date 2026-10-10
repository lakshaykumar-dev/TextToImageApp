import React, { useState, useRef } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { captureRef } from 'react-native-view-shot';
import Share from 'react-native-share';

import { ImageCanvas } from './src/components/ImageCanvas';
import { ColorPickerRow } from './src/components/ColorPickerRow';
import { FontControls } from './src/components/FontControls';
import { StrokeControls } from './src/components/StrokeControls';
import { BackgroundImageControls } from './src/components/BackgroundImageControls';
import { GeneratedImageModal } from './src/components/GeneratedImageModal';
import { COLOR_PALETTE, SAMPLE_QUOTES } from './src/constants/presets';
import { ImageConfig } from './src/types';

const DEFAULT_CONFIG: ImageConfig = {
  text: 'Creativity is intelligence having fun.',
  author: 'Albert Einstein',
  authorStyle: 'classic',
  backgroundColor: '#0F172A',
  textColor: '#FFFFFF',
  fontFamily: 'sans-serif',
  fontSize: 28,
  fontWeight: 'bold',
  isItalic: false,
  strokeColor: '#000000',
  strokeWidth: 2,
  textAlign: 'center',
  aspectRatio: '1:1',
  padding: 24,
  backgroundImageUri: null,
  backgroundDarkness: 0.5,
  backgroundBlueTint: 0.35,
  backgroundBlur: 0,
};

type ActiveTab = 'style' | 'stroke' | 'bg';

export default function App() {
  return (
    <SafeAreaProvider>
      <StudioContent />
    </SafeAreaProvider>
  );
}

function StudioContent() {
  const insets = useSafeAreaInsets();
  const topInset = Math.max(
    insets.top,
    Platform.OS === 'android' ? (StatusBar.currentHeight ?? 0) : 0
  );
  const [config, setConfig] = useState<ImageConfig>(DEFAULT_CONFIG);
  const [activeTab, setActiveTab] = useState<ActiveTab>('style');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedUri, setGeneratedUri] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const canvasRef = useRef<any>(null);

  const updateConfig = <K extends keyof ImageConfig>(key: K, value: ImageConfig[K]) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const handleApplyRandomQuote = () => {
    const randomQuote = SAMPLE_QUOTES[Math.floor(Math.random() * SAMPLE_QUOTES.length)];
    setConfig((prev) => ({
      ...prev,
      text: randomQuote.text,
      author: randomQuote.author,
    }));
  };

  const handleGenerateImage = async () => {
    if (!canvasRef.current) {
      Alert.alert('Error', 'Canvas reference not ready.');
      return;
    }

    try {
      setIsGenerating(true);
      const uri = await captureRef(canvasRef, {
        format: 'png',
        quality: 1,
        result: 'tmpfile',
      });
      setGeneratedUri(uri);
      setIsModalVisible(true);
    } catch (error: any) {
      Alert.alert('Generation Failed', error?.message || 'Could not generate image from text');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleQuickShare = async () => {
    if (!canvasRef.current) {
      Alert.alert('Error', 'Canvas reference not ready.');
      return;
    }

    try {
      setIsGenerating(true);
      const uri = await captureRef(canvasRef, {
        format: 'png',
        quality: 1,
        result: 'tmpfile',
      });
      setGeneratedUri(uri);

      await Share.open({
        title: 'Share Generated Image',
        message: config.author ? `"${config.text}"\n— ${config.author}` : config.text,
        url: uri,
        type: 'image/png',
        failOnCancel: false,
      });
    } catch (error: any) {
      if (error?.message !== 'User did not share') {
        Alert.alert('Notice', error?.message || 'Share cancelled or not available');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  React.useEffect(() => {
    if (Platform.OS === 'android') {
      (StatusBar as any).setTranslucent?.(true);
      (StatusBar as any).setBackgroundColor?.('transparent', true);
    }
  }, []);

  return (
    <View style={[styles.safeArea, { paddingTop: topInset, paddingBottom: insets.bottom }]}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Text to Image Studio</Text>
            <Text style={styles.headerSubtitle}>
              Customize fonts, colors, strokes & share anywhere
            </Text>
          </View>

          {/* Canvas Live Preview */}
          <View style={styles.canvasSection}>
            <View style={styles.previewHeader}>
              <Text style={styles.previewLabel}>LIVE PREVIEW</Text>
              <Text style={styles.ratioBadge}>{config.aspectRatio}</Text>
            </View>
            <ImageCanvas ref={canvasRef} config={config} />
          </View>

          {/* Text Input Section */}
          <View style={styles.card}>
            <View style={styles.inputHeaderRow}>
              <Text style={styles.cardTitle}>Your Text</Text>
              <TouchableOpacity onPress={handleApplyRandomQuote} style={styles.sampleQuoteBtn}>
                <Text style={styles.sampleQuoteText}>✨ Random Quote</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.textInput}
              value={config.text}
              onChangeText={(text) => updateConfig('text', text)}
              placeholder="Enter your text here..."
              placeholderTextColor="#64748B"
              multiline
              numberOfLines={3}
              maxLength={200}
            />
            <Text style={styles.charCount}>{config.text.length} / 200 characters</Text>

            {/* Author / Signature Section */}
            <View style={styles.authorSection}>
              <View style={styles.authorHeaderRow}>
                <Text style={styles.authorLabel}>Author / Signature (Optional)</Text>
                {Boolean(config.author) && (
                  <TouchableOpacity onPress={() => updateConfig('author', '')}>
                    <Text style={styles.clearAuthorText}>✕ Clear</Text>
                  </TouchableOpacity>
                )}
              </View>
              <TextInput
                style={styles.authorInput}
                value={config.author}
                onChangeText={(author) => updateConfig('author', author)}
                placeholder="e.g. Albert Einstein or @yourhandle"
                placeholderTextColor="#64748B"
                maxLength={40}
              />

              {/* Author Style Options */}
              {Boolean(config.author) && (
                <View style={styles.authorStyleRow}>
                  <Text style={styles.authorStyleLabel}>Display Style:</Text>
                  {(
                    [
                      { id: 'classic', label: '— Line Accent' },
                      { id: 'badge', label: '🏷️ Badge Pill' },
                      { id: 'minimal', label: 'Minimalist' },
                    ] as const
                  ).map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      onPress={() => updateConfig('authorStyle', item.id)}
                      style={[
                        styles.authorStyleChip,
                        config.authorStyle === item.id && styles.activeAuthorStyleChip,
                      ]}
                    >
                      <Text
                        style={[
                          styles.authorStyleChipText,
                          config.authorStyle === item.id && styles.activeAuthorStyleChipText,
                        ]}
                      >
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>

          {/* Customization Tabs */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              onPress={() => setActiveTab('style')}
              style={[styles.tabButton, activeTab === 'style' && styles.activeTabButton]}
            >
              <Text style={[styles.tabText, activeTab === 'style' && styles.activeTabText]}>
                🔤 Font & Text
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setActiveTab('stroke')}
              style={[styles.tabButton, activeTab === 'stroke' && styles.activeTabButton]}
            >
              <Text style={[styles.tabText, activeTab === 'stroke' && styles.activeTabText]}>
                🖋️ Font Stroke
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setActiveTab('bg')}
              style={[styles.tabButton, activeTab === 'bg' && styles.activeTabButton]}
            >
              <Text style={[styles.tabText, activeTab === 'bg' && styles.activeTabText]}>
                🎨 Background
              </Text>
            </TouchableOpacity>
          </View>

          {/* Tab Content */}
          {activeTab === 'style' && (
            <>
              <FontControls
                fontFamily={config.fontFamily}
                onChangeFontFamily={(f) => updateConfig('fontFamily', f)}
                fontSize={config.fontSize}
                onChangeFontSize={(sz) => updateConfig('fontSize', sz)}
                fontWeight={config.fontWeight}
                onChangeFontWeight={(w) => updateConfig('fontWeight', w)}
                isItalic={config.isItalic}
                onToggleItalic={() => updateConfig('isItalic', !config.isItalic)}
                textAlign={config.textAlign}
                onChangeTextAlign={(al) => updateConfig('textAlign', al)}
                aspectRatio={config.aspectRatio}
                onChangeAspectRatio={(r) => updateConfig('aspectRatio', r)}
              />

              <ColorPickerRow
                label="Font / Text Color"
                selectedColor={config.textColor}
                onSelectColor={(c) => updateConfig('textColor', c)}
                palette={COLOR_PALETTE}
              />
            </>
          )}

          {activeTab === 'stroke' && (
            <StrokeControls
              strokeWidth={config.strokeWidth}
              onChangeStrokeWidth={(w) => updateConfig('strokeWidth', w)}
              strokeColor={config.strokeColor}
              onChangeStrokeColor={(c) => updateConfig('strokeColor', c)}
            />
          )}

          {activeTab === 'bg' && (
            <>
              <BackgroundImageControls
                backgroundImageUri={config.backgroundImageUri}
                onSelectImageUri={(uri) => updateConfig('backgroundImageUri', uri)}
                darkness={config.backgroundDarkness}
                onChangeDarkness={(val) => updateConfig('backgroundDarkness', val)}
                blueTint={config.backgroundBlueTint}
                onChangeBlueTint={(val) => updateConfig('backgroundBlueTint', val)}
                blur={config.backgroundBlur}
                onChangeBlur={(val) => updateConfig('backgroundBlur', val)}
              />

              <ColorPickerRow
                label="Fallback / Solid Background Color"
                selectedColor={config.backgroundColor}
                onSelectColor={(c) => updateConfig('backgroundColor', c)}
                palette={COLOR_PALETTE}
              />
            </>
          )}

          {/* Bottom Spacing */}
          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Sticky Action Footer */}
        <View style={styles.footer}>
          <TouchableOpacity
            onPress={handleGenerateImage}
            disabled={isGenerating}
            style={[styles.generateBtn, isGenerating && styles.disabledBtn]}
          >
            {isGenerating ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.generateBtnText}>⚡ Generate Image</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleQuickShare}
            disabled={isGenerating}
            style={[styles.quickShareBtn, isGenerating && styles.disabledBtn]}
          >
            <Text style={styles.quickShareText}>📤 Share</Text>
          </TouchableOpacity>
        </View>

        {/* Modal for viewing & sharing generated image */}
        <GeneratedImageModal
          visible={isModalVisible}
          imageUri={generatedUri}
          onClose={() => setIsModalVisible(false)}
          textMessage={config.author ? `"${config.text}"\n— ${config.author}` : config.text}
        />
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0B0F19',
  },
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    marginBottom: 16,
    alignItems: 'center',
  },
  headerTitle: {
    color: '#F8FAFC',
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    color: '#94A3B8',
    fontSize: 13,
    marginTop: 4,
    textAlign: 'center',
  },
  canvasSection: {
    marginBottom: 18,
    alignItems: 'center',
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 8,
    marginBottom: 8,
    alignItems: 'center',
  },
  previewLabel: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
  },
  ratioBadge: {
    backgroundColor: '#1E293B',
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  card: {
    backgroundColor: '#1E293B',
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
  },
  inputHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '600',
  },
  sampleQuoteBtn: {
    backgroundColor: '#334155',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  sampleQuoteText: {
    color: '#93C5FD',
    fontSize: 12,
    fontWeight: '600',
  },
  textInput: {
    backgroundColor: '#0F172A',
    borderRadius: 10,
    padding: 12,
    color: '#F8FAFC',
    fontSize: 15,
    minHeight: 80,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#334155',
  },
  charCount: {
    color: '#64748B',
    fontSize: 11,
    textAlign: 'right',
    marginTop: 6,
  },
  authorSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  authorHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  authorLabel: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '600',
  },
  clearAuthorText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '600',
  },
  authorInput: {
    backgroundColor: '#0F172A',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: '#F8FAFC',
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  authorStyleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    flexWrap: 'wrap',
    gap: 6,
  },
  authorStyleLabel: {
    color: '#64748B',
    fontSize: 12,
    marginRight: 4,
  },
  authorStyleChip: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#334155',
  },
  activeAuthorStyleChip: {
    backgroundColor: '#3B82F6',
    borderColor: '#60A5FA',
  },
  authorStyleChipText: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '600',
  },
  activeAuthorStyleChipText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#0F172A',
    borderRadius: 12,
    padding: 4,
    marginBottom: 10,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTabButton: {
    backgroundColor: '#3B82F6',
  },
  tabText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
  activeTabText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#0B0F19',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
  },
  generateBtn: {
    flex: 2,
    backgroundColor: '#3B82F6',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  quickShareBtn: {
    flex: 1,
    backgroundColor: '#10B981',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  disabledBtn: {
    opacity: 0.6,
  },
  generateBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  quickShareText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
