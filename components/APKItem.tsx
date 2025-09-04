import { View, Text, Image, Pressable, Linking } from 'react-native';

interface APKItemProps {
  name: string;
  icon: string;
  downloadUrl: string;
}

export default function APKItem({ name, icon, downloadUrl }: APKItemProps) {
  return (
    <Pressable onPress={() => Linking.openURL(downloadUrl)}>
      <View className="bg-white p-3 rounded-xl mb-3">
        <Image
          source={{ uri: icon || '../assets/images/adaptive.png' }}
          className="w-16 h-16 mx-auto"
        />
        <Text className="text-center mt-1 text-sm" numberOfLines={1}>
          {name}
        </Text>
      </View>
    </Pressable>
  );
}
