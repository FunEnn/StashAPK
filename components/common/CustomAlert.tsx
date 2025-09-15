import React from 'react';
import { Modal, Pressable, Text, View } from 'react-native';

type AlertButton = {
  text: string;
  onPress: () => void;
  style?: 'default' | 'cancel' | 'destructive';
};

type CustomAlertProps = {
  visible: boolean;
  title: string;
  message: string;
  buttons: AlertButton[];
  onDismiss: () => void;
};

function getButtonClasses(style?: AlertButton['style']): { container: string; text: string } {
  switch (style) {
    case 'cancel':
      return {
        container: 'bg-gray-200 dark:bg-gray-700',
        text: 'text-gray-900 dark:text-gray-100',
      };
    case 'destructive':
      return { container: 'bg-red-600', text: 'text-white' };
    case 'default':
    default:
      return { container: 'bg-blue-600', text: 'text-white' };
  }
}

export const CustomAlert: React.FC<CustomAlertProps> = ({
  visible,
  title,
  message,
  buttons,
  onDismiss,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onDismiss}>
      <View className="flex-1 items-center justify-center">
        <Pressable className="absolute inset-0 bg-black/50" onPress={onDismiss} />

        <View className="w-11/12 max-w-md rounded-2xl bg-white p-5 dark:bg-gray-800">
          {title ? (
            <Text className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
              {title}
            </Text>
          ) : null}
          {message ? (
            <Text className="text-base leading-6 text-gray-700 dark:text-gray-300">{message}</Text>
          ) : null}

          <View className="mt-5 flex-row flex-wrap items-center justify-end gap-3">
            {buttons?.map((button, index) => {
              const classes = getButtonClasses(button.style);
              return (
                <Pressable
                  key={`${button.text}-${index}`}
                  onPress={button.onPress}
                  className={`rounded-md px-4 py-2 ${classes.container}`}
                >
                  <Text className={`text-sm font-medium ${classes.text}`}>{button.text}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CustomAlert;
