import React from 'react';
import {
  Modal,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Share as RNShare,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Share from 'react-native-share';

interface GeneratedImageModalProps {
  visible: boolean;
  imageUri: string | null;
  onClose: () => void;
  textMessage: string;
}

export const GeneratedImageModal: React.FC<GeneratedImageModalProps> = ({
  visible,
  imageUri,
  onClose,
  textMessage,
}) => {
  const [sharing, setSharing] = React.useState(false);

  const handleShare = async () => {
    if (!imageUri) {
      Alert.alert('Error', 'No image available to share.');
      return;
    }

    setSharing(true);
    try {
      // First attempt using react-native-share for rich file sharing
      await Share.open({
        title: 'Share Generated Image',
        message: textMessage ? `"${textMessage}"` : 'Generated with TextToImageApp',
        url: imageUri,
        type: 'image/png',
        failOnCancel: false,
      });
    } catch (error: any) {
      // Fallback to React Native core Share API
      try {
        await RNShare.share({
          message: `${textMessage ? `"${textMessage}"\n` : ''}${imageUri}`,
          url: imageUri,
        });
      } catch (fallbackError: any) {
        if (error?.message !== 'User did not share') {
          Alert.alert('Sharing Notice', error?.message || 'Unable to open share dialog');
        }
      }
    } finally {
      setSharing(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Image Generated!</Text>
              <Text style={styles.subtitle}>Ready to share or save</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Image Display */}
          <View style={styles.imageContainer}>
            {imageUri ? (
              <Image
                source={{ uri: imageUri }}
                style={styles.imagePreview}
                resizeMode="contain"
              />
            ) : (
              <ActivityIndicator size="large" color="#3B82F6" />
            )}
          </View>

          {/* Action Buttons */}
          <View style={styles.actionContainer}>
            <TouchableOpacity
              onPress={handleShare}
              disabled={sharing || !imageUri}
              style={[styles.shareBtn, (!imageUri || sharing) && styles.disabledBtn]}
            >
              {sharing ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.shareBtnText}>📤 Share Image</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={onClose} style={styles.doneBtn}>
              <Text style={styles.doneBtnText}>Close / Edit More</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxHeight: '90%',
    backgroundColor: '#0F172A',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#334155',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '700',
  },
  subtitle: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtnText: {
    color: '#CBD5E1',
    fontSize: 16,
    fontWeight: 'bold',
  },
  imageContainer: {
    width: '100%',
    height: 320,
    backgroundColor: '#020617',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  actionContainer: {
    marginTop: 20,
    gap: 10,
  },
  shareBtn: {
    backgroundColor: '#3B82F6',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  disabledBtn: {
    opacity: 0.6,
  },
  shareBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  doneBtn: {
    backgroundColor: '#1E293B',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  doneBtnText: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '600',
  },
});
