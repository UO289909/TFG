import { View, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import DateTimePicker, { DateType } from 'react-native-ui-datepicker';
import { globalColors } from '../../../config/app-theme';
import { useEffect, useRef } from 'react';

interface Props {
    minDate: Date | undefined;
    maxDate: Date | undefined;
    defaultDate: Date | undefined;
    onChange: (selectedDate?: DateType) => void;
    onTouchOutside: () => void;
}

export const CustomDatePicker = ({ minDate, maxDate, defaultDate, onChange, onTouchOutside }: Props) => {

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
                    styles={datePickerStyles}
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
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 4,
        elevation: 10,
        margin: 12,
    },
});

export const datePickerStyles = StyleSheet.create({
    selected: { backgroundColor: globalColors.primary, borderRadius: 20 },
    selected_label: { color: globalColors.white, fontFamily: 'Roboto-Bold', fontSize: 16 },
    disabled_label: { color: globalColors.grey },
    day_label: { color: globalColors.primary, fontFamily: 'Roboto-Regular', fontSize: 16 },
    month_selector_label: { color: globalColors.primary, fontFamily: 'Roboto-Bold', fontSize: 20 },
    month_label: { color: globalColors.primary, fontFamily: 'Roboto-Regular', fontSize: 16 },
    button_prev_image: { tintColor: globalColors.primary },
    button_next_image: { tintColor: globalColors.primary },
    weekday_label: { color: globalColors.primary, fontFamily: 'Roboto-Light', fontSize: 18 },
    year_selector_label: { color: globalColors.primaryDark, fontFamily: 'Roboto-Bold', fontSize: 20 },
    year_selector: { color: globalColors.primaryDark, fontFamily: 'Roboto-Bold', fontSize: 20 },
    year_label: { color: globalColors.primaryDark, fontFamily: 'Roboto-Regular', fontSize: 18 },
});
