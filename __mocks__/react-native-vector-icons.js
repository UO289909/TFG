// Mock de @react-native-vector-icons para Jest
const React = require('react');
const { Text } = require('react-native');

function Icon({ name, ...props }) {
  return React.createElement(Text, props, name);
}

module.exports = Icon;
module.exports.default = Icon;
module.exports.Ionicons = Icon;
module.exports.MaterialIcons = Icon;
