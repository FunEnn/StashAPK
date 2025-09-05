import { View } from 'react-native';
import APKItem from './APKItem';

interface APKListProps {
  apks: {
    name: string;
    icon: string;
    downloadUrl: string;
  }[];
}

export default function APKList({ apks }: APKListProps) {
  return (
    <View className="flex-row flex-wrap p-2">
      {apks.map((apk, index) => (
        <View key={index} className="w-1/2 p-1">
          <APKItem {...apk} />
        </View>
      ))}
    </View>
  );
}
