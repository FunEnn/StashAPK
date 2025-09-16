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
        <Pressable className="absolute inset-0 bg-black/50 dark:bg-black/60" onPress={onDismiss} />

        <View className="w-11/12 max-w-sm rounded-2xl bg-white p-5 dark:bg-gray-900">
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
              const getButtonClasses = () => {
                const baseClasses = 'rounded-md px-4 py-2';
                switch (button.style) {
                  case 'cancel':
                    return `${baseClasses} bg-gray-200 dark:bg-gray-700`;
                  case 'destructive':
                    return `${baseClasses} bg-red-600 dark:bg-red-700`;
                  case 'default':
                  default:
                    return `${baseClasses} bg-blue-600 dark:bg-blue-700`;
                }
              };

              const getTextClasses = () => {
                switch (button.style) {
                  case 'cancel':
                    return 'text-sm font-medium text-gray-900 dark:text-gray-100';
                  case 'destructive':
                    return 'text-sm font-medium text-white';
                  case 'default':
                  default:
                    return 'text-sm font-medium text-white';
                }
              };

              return (
                <Pressable
                  key={`${button.text}-${index}`}
                  onPress={button.onPress}
                  className={getButtonClasses()}
                >
                  <Text className={getTextClasses()}>{button.text}</Text>
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
