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
    <View className="flex-row flex-wrap px-2 py-1">
      {apks.map((apk, index) => (
        <View key={index} className="w-1/3 px-1 py-2">
          <APKItem {...apk} />
        </View>
      ))}
    </View>
  );
}
