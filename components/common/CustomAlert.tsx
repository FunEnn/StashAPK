import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';

interface ButtonProps {
  text: string;
  onPress: () => void;
  style?: 'default' | 'cancel' | 'destructive';
}

interface CustomAlertProps {
  visible: boolean;
  title: string;
  message: string;
  buttons: ButtonProps[];
  onDismiss: () => void;
}

const CustomAlert: React.FC<CustomAlertProps> = ({
  visible,
  title,
  message,
  buttons,
  onDismiss,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onDismiss}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onDismiss}>
        <View style={styles.container} onStartShouldSetResponder={() => true}>
          <View style={styles.alertBox}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>{message}</Text>
            <View
              style={buttons.length > 2 ? styles.buttonColumnContainer : styles.buttonRowContainer}
            >
              {buttons.map((button, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.button,
                    button.style === 'cancel' && styles.cancelButton,
                    button.style === 'destructive' && styles.destructiveButton,
                    buttons.length > 2
                      ? styles.fullWidthButton
                      : buttons.length === 2 && index === 0
                        ? styles.leftButton
                        : buttons.length === 2 && index === 1
                          ? styles.rightButton
                          : styles.singleButton,
                  ]}
                  onPress={() => {
                    button.onPress();
                  }}
                >
                  <Text
                    style={[
                      styles.buttonText,
                      button.style === 'destructive' && styles.destructiveButtonText,
                    ]}
                  >
                    {button.text}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: width * 0.8,
    maxWidth: 400,
    padding: 5,
  },
  alertBox: {
    backgroundColor: '#1F2937',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    color: '#333333',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  buttonRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonColumnContainer: {
    flexDirection: 'column',
  },
  button: {
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
  },
  cancelButton: {
    backgroundColor: '#374151',
  },
  destructiveButton: {
    backgroundColor: '#DC2626',
  },
  singleButton: {
    flex: 1,
  },
  leftButton: {
    flex: 1,
    marginRight: 8,
  },
  rightButton: {
    flex: 1,
    marginLeft: 8,
  },
  fullWidthButton: {
    marginBottom: 8,
    width: '100%',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  destructiveButtonText: {
    color: '#FFFFFF',
  },
});

export default CustomAlert;
