import { registerRootComponent } from 'expo';
import { ExpoRoot } from 'expo-router';
import 'expo-router/entry';

// LogRocket.init('wdchdb/debaox', {
//   updateId: Updates.isEmbeddedLaunch ? null : Updates.updateId, // 如果是嵌入式启动，则不设置 Update ID
//   expoChannel: Updates.channel, // 设置 Expo 更新通道
//   shouldCaptureInDev: true,
// });

// expo-router 的 ExpoRoot 作为入口点
export default function App() {
  return <ExpoRoot context={require.context('./app')} />;
}

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
