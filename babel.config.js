module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    // Remove console logs in production
    process.env.NODE_ENV === 'production' && 'babel-plugin-transform-remove-console',
  ].filter(Boolean),
};
