import { DarkTheme, DefaultTheme, Theme } from '@react-navigation/native';
import { StyleSheet } from 'react-native';

export const globalColors = {
    primary: '#7037eb',
    primaryDark: '#5d2fc2',
    secondary: '#f72585',
    tertiary: '#3a0ca3',
    success: '#4cc9f0',
    warning: '#fca311',
    danger: '#e71d36',
    dangerDark: '#b00020',
    dark: '#22223b',
    grey: '#ccc',
    greyLight: '#eee',
    greyDark: '#999',
    white: '#fff',
    black: '#000',

    background: '#fff',
};

export interface CustomTheme extends Theme {
    colors: Theme['colors'] & {
        primaryDark: string;
        danger: string;
        dangerDark: string;
        grey: string;
        greyLight: string;
        greyDark: string;
        cardPressed: string;
        shadow: string;
        secondaryText: string;
        field: string;
        fieldDisabled: string;
        buttonDisabled: string;
        navigationBackground: string;
    };
}

export const CustomLightTheme: CustomTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: '#7037eb',
        primaryDark: '#5d2fc2',
        danger: '#e71d36',
        dangerDark: '#b00020',
        border: '#eee',
        grey: '#ccc',
        greyLight: '#eee',
        greyDark: '#999',
        card: '#fff',
        cardPressed: '#eee',
        text: '#000',
        secondaryText: '#5d2fc2',
        shadow: '#000',
        field: '#fff',
        fieldDisabled: '#eee',
        buttonDisabled: '#ccc',
        navigationBackground: '#fff',
    },
};

export const CustomDarkTheme: CustomTheme = {
    ...DarkTheme,
    colors: {
        ...DarkTheme.colors,
        primary: '#7037eb',
        primaryDark: '#5d2fc2',
        danger: '#e71d36',
        dangerDark: '#b00020',
        border: '#999',
        grey: '#ccc',
        greyLight: '#eee',
        greyDark: '#999',
        card: '#333',
        cardPressed: '#999',
        text: '#fff',
        secondaryText: '#7037eb',
        shadow: '#777',
        field: '#777',
        fieldDisabled: '#333',
        buttonDisabled: '#333',
        navigationBackground: '#222',
    },
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

    separator: {
        height: 1,
        borderRadius: 1,
        shadowColor: globalColors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
    },

    separatorLandscape: {
        width: 1,
        height: '100%',
        borderRadius: 1,
        shadowColor: globalColors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
    },

});
