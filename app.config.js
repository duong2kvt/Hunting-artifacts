const { expo } = require('./app.json');

module.exports = {
  ...expo,
  experiments: {
    ...expo.experiments,
    baseUrl: process.env.EXPO_PUBLIC_BASE_URL || '',
  },
};
