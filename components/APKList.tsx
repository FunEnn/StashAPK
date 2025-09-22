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
    <View className="flex-row flex-wrap px-4 py-3">
      {apks.map((apk, index) => (
        <View key={index} className="w-1/3 px-2 py-3">
          <APKItem {...apk} />
        </View>
      ))}
    </View>
  );
}
