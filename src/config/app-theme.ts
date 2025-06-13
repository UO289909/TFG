import { StyleSheet } from 'react-native';

export const globalColors = {
    primary: '#7037eb',
    primaryDark: '#5d2fc2',
    secondary: '#f72585',
    tertiary: '#3a0ca3',
    success: '#4cc9f0',
    warning: '#fca311',
    danger: '#e71d36',
    dark: '#22223b',

    background: '#fff',
};

export const globalStyles = StyleSheet.create({

    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },

    titleText: {
        fontSize: 30,
        textAlign: 'center',
        margin: 10,
    },

});
