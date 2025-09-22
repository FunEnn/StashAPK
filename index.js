import 'expo-router/entry';
import { configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated';
import './global.css';

// 配置 react-native-reanimated 日志器，禁用严格模式
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false, // 禁用严格模式
});
