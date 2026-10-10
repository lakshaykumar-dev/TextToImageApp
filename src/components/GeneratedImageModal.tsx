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
      await Share.open({
        title: 'Share Generated Image',
        message: textMessage ? `"${textMessage}"` : 'Generated with TextToImage Studio',
        url: imageUri,
        type: 'image/png',
        failOnCancel: false,
      });
    } catch (error: any) {
      try {
        await RNShare.share({
          message: `${textMessage ? `"${textMessage}"\n` : ''}${imageUri}`,
          url: imageUri,
        });
      } catch (fallbackError: any) {
        if (error?.message !== 'User did not share') {
          Alert.alert('Notice', error?.message || 'Unable to open share dialog');
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
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Artwork Generated</Text>
              <Text style={styles.subtitle}>Ready to share or save to camera roll</Text>
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
              <ActivityIndicator size="large" color="#18181B" />
            )}
          </View>

          {/* Action Buttons */}
          <View style={styles.actionContainer}>
            <TouchableOpacity
              onPress={handleShare}
              disabled={sharing || !imageUri}
              style={[styles.shareBtn, (!imageUri || sharing) && styles.disabledBtn]}
              activeOpacity={0.85}
            >
              {sharing ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.shareBtnText}>📤 Share Artwork</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={onClose} style={styles.doneBtn} activeOpacity={0.8}>
              <Text style={styles.doneBtnText}>Continue Editing</Text>
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
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxHeight: '92%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    color: '#18181B',
    fontSize: 20,
    fontFamily: 'serif',
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  subtitle: {
    color: '#71717A',
    fontSize: 13,
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F4F4F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtnText: {
    color: '#71717A',
    fontSize: 14,
    fontWeight: 'bold',
  },
  imageContainer: {
    width: '100%',
    height: 320,
    backgroundColor: '#F4F4F5',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E4E4E7',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  actionContainer: {
    marginTop: 18,
    gap: 10,
  },
  shareBtn: {
    backgroundColor: '#18181B',
    paddingVertical: 15,
    borderRadius: 24,
    alignItems: 'center',
    shadowColor: '#18181B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  disabledBtn: {
    opacity: 0.6,
  },
  shareBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  doneBtn: {
    backgroundColor: '#F4F4F5',
    paddingVertical: 13,
    borderRadius: 24,
    alignItems: 'center',
  },
  doneBtnText: {
    color: '#71717A',
    fontSize: 14,
    fontWeight: '600',
  },
});
