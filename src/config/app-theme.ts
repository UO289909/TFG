import { DarkTheme, DefaultTheme, Theme } from '@react-navigation/native';

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
        border: '#eee',
        grey: '#ccc',
        greyLight: '#eee',
        greyDark: '#999',
        card: '#333',
        cardPressed: '#999',
        text: '#fff',
        secondaryText: '#7037eb',
        shadow: '#888',
        field: '#777',
        fieldDisabled: '#333',
        buttonDisabled: '#333',
        navigationBackground: '#222',
    },
};
