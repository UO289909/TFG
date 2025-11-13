const React = require('react');

const RNMock = {
    View: (props) => React.createElement('View', props, props.children),
    Text: (props) => React.createElement('Text', props, props.children),
    TextInput: (props) => React.createElement('TextInput', props, props.children),
    ScrollView: (props) => React.createElement('ScrollView', props, props.children),
    TouchableOpacity: (props) => React.createElement('TouchableOpacity', props, props.children),
    Pressable: ({ children, onPress, testID, ...rest }) =>
        React.createElement(
            'Pressable',
            { testID, ...rest, onClick: onPress },
            typeof children === 'function' ? children({ pressed: false }) : children
        ),
    StyleSheet: {
        create: (styles) => styles,
        flatten: (style) => {
            if (Array.isArray(style)) {
                return Object.assign({}, ...style);
            }
            return style || {};
        },
    },
    Platform: { OS: 'android', select: (obj) => obj.android },
    Dimensions: { get: () => ({ width: 400, height: 800 }) },
    Keyboard: {
        dismiss: jest.fn(),
    },
    KeyboardAvoidingView: (props) => React.createElement('KeyboardAvoidingView', props, props.children),
    SafeAreaView: (props) => React.createElement('SafeAreaView', props, props.children),
    StatusBar: (props) => React.createElement('StatusBar', props, props.children),
    ActivityIndicator: (props) => React.createElement('ActivityIndicator', props, props.children),
    Animated: {
        View: (props) => React.createElement('Animated.View', props, props.children),
        Value: function () { },
        timing: () => ({ start: (cb) => cb && cb() }),
    },
    NativeModules: {},
    useWindowDimensions: () => ({ width: 400, height: 800 }),
    RefreshControl: (props) =>
        React.createElement('RefreshControl', props, props.children),
    FlatList: (props) => {
    const { data = [], renderItem, ListHeaderComponent, ListFooterComponent, keyExtractor } = props;
    return React.createElement(
      'FlatList',
      props,
      <>
        {ListHeaderComponent ? React.createElement(ListHeaderComponent) : null}
        {data.map((item, index) =>
          renderItem
            ? React.createElement('View', { key: keyExtractor ? keyExtractor(item, index) : index }, renderItem({ item, index }))
            : null
        )}
        {ListFooterComponent ? React.createElement(ListFooterComponent) : null}
      </>
    );
  },
  VirtualizedList: (props) => RNMock.FlatList(props),

};

module.exports = RNMock;
