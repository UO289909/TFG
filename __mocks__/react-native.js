// __mocks__/react-native.js
const React = require('react');

module.exports = {
    Text: (props) => React.createElement('Text', props, props.children),
    View: (props) => React.createElement('View', props, props.children),
    Pressable: (props) => React.createElement('Pressable', props, props.children),
    StyleSheet: { create: (styles) => styles },
    Platform: { OS: 'android', select: (objs) => objs.android },
    NativeModules: {},
    Animated: {
        View: (props) => React.createElement('AnimatedView', props, props.children),
    },
};
