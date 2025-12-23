const React = require('react');
const { Text } = require('react-native');

module.exports = ({ name, color, size }) =>
  React.createElement(Text, null, `mock-icon-${name}-${color}-${size}`);

