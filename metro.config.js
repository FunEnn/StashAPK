const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(process.cwd());

// 添加额外的解析配置
config.resolver = {
  ...config.resolver,
  sourceExts: [...config.resolver.sourceExts, 'mjs'],
  resolverMainFields: ['react-native', 'browser', 'main'],
};

module.exports = withNativeWind(config, {
  input: './global.css',
});
