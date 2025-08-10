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
    white: '#fff',

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

export const globalDatePickerStyles = StyleSheet.create({
    selected: { backgroundColor: globalColors.primary, borderRadius: 20 },
    selected_label: { color: globalColors.white, fontFamily: 'Roboto-Bold', fontSize: 16 },
    disabled_label: { color: globalColors.grey },
    day_label: { color: globalColors.primary, fontFamily: 'Roboto-Regular', fontSize: 16 },
    month_selector_label: { color: globalColors.primary, fontFamily: 'Roboto-Bold', fontSize: 20 },
    weekday_label: { color: globalColors.primary, fontFamily: 'Roboto-Light', fontSize: 18 },
    year_selector_label: { color: globalColors.primaryDark, fontFamily: 'Roboto-Bold', fontSize: 20 },
    year_selector: { color: globalColors.primaryDark, fontFamily: 'Roboto-Bold', fontSize: 20 },
});
