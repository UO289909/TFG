import { View, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import DateTimePicker, { DateType } from 'react-native-ui-datepicker';
import { CustomTheme } from '../../../config/app-theme';
import { useEffect, useRef } from 'react';
import { useTheme } from '@react-navigation/native';

interface Props {
    minDate: Date | undefined;
    maxDate: Date | undefined;
    defaultDate: Date | undefined;
    onChange: (selectedDate?: DateType) => void;
    onTouchOutside: () => void;
}

export const CustomDatePicker = ({ minDate, maxDate, defaultDate, onChange, onTouchOutside }: Props) => {

    const { colors } = useTheme() as CustomTheme;

    const scaleAnim = useRef(new Animated.Value(0.8)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }),
        ]).start();
    }, [scaleAnim, opacityAnim]);

    return (
        <View style={styles.pickerOverlay}>
            <TouchableOpacity style={styles.overlayBg} onPress={onTouchOutside} />
            <Animated.View
                style={[
                    styles.pickerContainer,
                    {
                        backgroundColor: colors.card,
                        transform: [{ scale: scaleAnim }],
                        opacity: opacityAnim,
                    },
                ]}
            >
                <DateTimePicker
                    date={defaultDate}
                    mode="single"
                    onChange={({ date }) => onChange(date)}
                    minDate={minDate}
                    maxDate={maxDate}
                    locale="es"
                    firstDayOfWeek={1}
                    styles={getDatePickerStyles(colors)}
                />
            </Animated.View>
        </View>
    );

};

const styles = StyleSheet.create({
    pickerOverlay: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100,
    },
    overlayBg: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.2)',
    },
    pickerContainer: {
        borderRadius: 12,
        padding: 4,
        elevation: 10,
        margin: 12,
    },
});

const getDatePickerStyles = (colors: CustomTheme['colors']) => StyleSheet.create({
    selected: { backgroundColor: colors.primary, borderRadius: 20 },
    selected_label: { color: '#fff', fontFamily: 'Roboto-Bold', fontSize: 16 },
    disabled_label: { color: colors.grey },
    day_label: { color: colors.primary, fontFamily: 'Roboto-Regular', fontSize: 16 },
    month_selector_label: { color: colors.primary, fontFamily: 'Roboto-Bold', fontSize: 20 },
    month_label: { color: colors.primary, fontFamily: 'Roboto-Regular', fontSize: 16 },
    button_prev_image: { tintColor: colors.primary },
    button_next_image: { tintColor: colors.primary },
    weekday_label: { color: colors.primary, fontFamily: 'Roboto-Light', fontSize: 18 },
    year_selector_label: { color: colors.primaryDark, fontFamily: 'Roboto-Bold', fontSize: 20 },
    year_selector: { color: colors.secondaryText, fontFamily: 'Roboto-Bold', fontSize: 20 },
    year_label: { color: colors.secondaryText, fontFamily: 'Roboto-Regular', fontSize: 18 },
});
