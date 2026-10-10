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
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [inputHeight, setInputHeight] = useState<number>(100);

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
      <StatusBar barStyle="dark-content" />
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
              Bespoke typography, strokes & high-res export
            </Text>
          </View>

          {/* Canvas Live Preview Card */}
          <View style={styles.canvasSection}>
            <View style={styles.previewHeader}>
              <Text style={styles.previewLabel}>LIVE PREVIEW</Text>
              <Text style={styles.ratioBadge}>{config.aspectRatio}</Text>
            </View>
            <View style={styles.canvasCard}>
              <ImageCanvas ref={canvasRef} config={config} />
            </View>
          </View>

          {/* Text Input Section */}
          <View style={styles.card}>
            <View style={styles.inputHeaderRow}>
              <Text style={styles.cardTitle}>Your Text</Text>
              <View style={styles.inputHeaderActions}>
                <TouchableOpacity
                  onPress={() => setIsExpanded(!isExpanded)}
                  style={styles.expandBtn}
                  activeOpacity={0.7}
                >
                  <Text style={styles.expandBtnText}>
                    {isExpanded ? '⤡ Compact' : '⤢ Expand'}
                  </Text>
                </TouchableOpacity>
                {Boolean(config.text) && (
                  <TouchableOpacity
                    onPress={() => updateConfig('text', '')}
                    style={styles.clearTextBtn}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.clearTextBtnText}>✕ Clear</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  onPress={handleApplyRandomQuote}
                  style={styles.sampleQuoteBtn}
                  activeOpacity={0.7}
                >
                  <Text style={styles.sampleQuoteText}>✨ Random</Text>
                </TouchableOpacity>
              </View>
            </View>
            <TextInput
              style={[
                styles.textInput,
                isExpanded
                  ? styles.textInputExpanded
                  : { height: Math.max(100, Math.min(inputHeight, 260)) },
              ]}
              value={config.text}
              onChangeText={(text) => updateConfig('text', text)}
              onContentSizeChange={(e) => {
                setInputHeight(e.nativeEvent.contentSize.height + 24);
              }}
              placeholder="Enter your thoughts or quote..."
              placeholderTextColor="#A1A1AA"
              multiline
              numberOfLines={isExpanded ? 10 : 4}
              scrollEnabled={true}
              maxLength={1000}
            />
            <View style={styles.textInputFooter}>
              <TouchableOpacity
                onPress={() => setIsExpanded(!isExpanded)}
                style={styles.expandTogglePrompt}
                activeOpacity={0.7}
              >
                <Text style={styles.expandTogglePromptText}>
                  {isExpanded ? '▲ Collapse text area' : '▼ Expand text area'}
                </Text>
              </TouchableOpacity>
              <Text style={styles.charCount}>{config.text.length} / 1000</Text>
            </View>

            {/* Author / Signature Section */}
            <View style={styles.authorSection}>
              <View style={styles.authorHeaderRow}>
                <Text style={styles.authorLabel}>Author / Signature</Text>
                {Boolean(config.author) && (
                  <TouchableOpacity
                    onPress={() => updateConfig('author', '')}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.clearAuthorText}>✕ Clear</Text>
                  </TouchableOpacity>
                )}
              </View>
              <TextInput
                style={styles.authorInput}
                value={config.author}
                onChangeText={(author) => updateConfig('author', author)}
                placeholder="e.g. Albert Einstein or @yourhandle"
                placeholderTextColor="#A1A1AA"
                maxLength={40}
              />

              {/* Author Style Options */}
              {Boolean(config.author) && (
                <View style={styles.authorStyleRow}>
                  <Text style={styles.authorStyleLabel}>Style:</Text>
                  {(
                    [
                      { id: 'classic', label: '— Line' },
                      { id: 'badge', label: '🏷️ Badge' },
                      { id: 'minimal', label: 'Minimal' },
                    ] as const
                  ).map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      onPress={() => updateConfig('authorStyle', item.id)}
                      style={[
                        styles.authorStyleChip,
                        config.authorStyle === item.id && styles.activeAuthorStyleChip,
                      ]}
                      activeOpacity={0.7}
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
              activeOpacity={0.7}
            >
              <Text style={[styles.tabText, activeTab === 'style' && styles.activeTabText]}>
                🔤 Typography
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setActiveTab('stroke')}
              style={[styles.tabButton, activeTab === 'stroke' && styles.activeTabButton]}
              activeOpacity={0.7}
            >
              <Text style={[styles.tabText, activeTab === 'stroke' && styles.activeTabText]}>
                🖋️ Stroke
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setActiveTab('bg')}
              style={[styles.tabButton, activeTab === 'bg' && styles.activeTabButton]}
              activeOpacity={0.7}
            >
              <Text style={[styles.tabText, activeTab === 'bg' && styles.activeTabText]}>
                🎨 Wallpaper
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
                label="Solid Canvas Background"
                selectedColor={config.backgroundColor}
                onSelectColor={(c) => updateConfig('backgroundColor', c)}
                palette={COLOR_PALETTE}
              />
            </>
          )}

          {/* Bottom Spacing */}
          <View style={{ height: 110 }} />
        </ScrollView>

        {/* Sticky Action Footer */}
        <View style={styles.footer}>
          <TouchableOpacity
            onPress={handleGenerateImage}
            disabled={isGenerating}
            style={[styles.generateBtn, isGenerating && styles.disabledBtn]}
            activeOpacity={0.85}
          >
            {isGenerating ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.generateBtnText}>⚡ Generate Image</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleQuickShare}
            disabled={isGenerating}
            style={[styles.quickShareBtn, isGenerating && styles.disabledBtn]}
            activeOpacity={0.85}
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
    backgroundColor: '#F8FAFC',
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
    marginTop: 6,
    marginBottom: 16,
    alignItems: 'center',
  },
  headerTitle: {
    color: '#18181B',
    fontSize: 24,
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    color: '#71717A',
    fontSize: 12,
    marginTop: 3,
    letterSpacing: 0.2,
  },
  canvasSection: {
    marginBottom: 18,
    alignItems: 'center',
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 4,
    marginBottom: 8,
    alignItems: 'center',
  },
  previewLabel: {
    color: '#71717A',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  ratioBadge: {
    backgroundColor: '#E4E4E7',
    color: '#3F3F46',
    fontSize: 11,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  canvasCard: {
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E4E4E7',
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E4E4E7',
    elevation: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
  },
  inputHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTitle: {
    color: '#18181B',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  inputHeaderActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  expandBtn: {
    backgroundColor: '#F4F4F5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E4E4E7',
  },
  expandBtnText: {
    color: '#3F3F46',
    fontSize: 11,
    fontWeight: '600',
  },
  clearTextBtn: {
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  clearTextBtnText: {
    color: '#DC2626',
    fontSize: 11,
    fontWeight: '600',
  },
  sampleQuoteBtn: {
    backgroundColor: '#F4F4F5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E4E4E7',
  },
  sampleQuoteText: {
    color: '#3F3F46',
    fontSize: 11,
    fontWeight: '600',
  },
  textInput: {
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    padding: 12,
    color: '#18181B',
    fontSize: 14,
    minHeight: 100,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#E4E4E7',
  },
  textInputExpanded: {
    minHeight: 240,
    maxHeight: 400,
  },
  textInputFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  expandTogglePrompt: {
    paddingVertical: 2,
  },
  expandTogglePromptText: {
    color: '#71717A',
    fontSize: 11,
    fontWeight: '500',
  },
  charCount: {
    color: '#A1A1AA',
    fontSize: 11,
  },
  authorSection: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F4F4F5',
  },
  authorHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  authorLabel: {
    color: '#3F3F46',
    fontSize: 12,
    fontWeight: '600',
  },
  clearAuthorText: {
    color: '#DC2626',
    fontSize: 11,
    fontWeight: '600',
  },
  authorInput: {
    backgroundColor: '#FAFAFA',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: '#18181B',
    fontSize: 13,
    borderWidth: 1,
    borderColor: '#E4E4E7',
  },
  authorStyleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    flexWrap: 'wrap',
    gap: 6,
  },
  authorStyleLabel: {
    color: '#71717A',
    fontSize: 11,
    marginRight: 4,
  },
  authorStyleChip: {
    backgroundColor: '#F4F4F5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E4E4E7',
  },
  activeAuthorStyleChip: {
    backgroundColor: '#18181B',
    borderColor: '#18181B',
  },
  authorStyleChipText: {
    color: '#71717A',
    fontSize: 11,
    fontWeight: '600',
  },
  activeAuthorStyleChipText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#F4F4F5',
    borderRadius: 14,
    padding: 4,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E4E4E7',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 10,
  },
  activeTabButton: {
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  tabText: {
    color: '#71717A',
    fontSize: 12,
    fontWeight: '600',
  },
  activeTabText: {
    color: '#18181B',
    fontWeight: '700',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: '#E4E4E7',
    elevation: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  generateBtn: {
    flex: 2,
    backgroundColor: '#18181B',
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  quickShareBtn: {
    flex: 1,
    backgroundColor: '#F4F4F5',
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E4E4E7',
  },
  disabledBtn: {
    opacity: 0.5,
  },
  generateBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  quickShareText: {
    color: '#18181B',
    fontSize: 14,
    fontWeight: '600',
  },
});
