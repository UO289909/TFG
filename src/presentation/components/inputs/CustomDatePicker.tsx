import { View, TouchableOpacity, StyleSheet } from 'react-native';
import DateTimePicker from 'react-native-ui-datepicker';
import { globalDatePickerStyles } from '../../../config/app-theme';

interface Props {
    minDate: Date;
    maxDate: Date;
    defaultDate: Date;
    onChange: () => void;
    onTouchOutside: () => void;
}

export const CustomDatePicker = ({ minDate, maxDate, defaultDate, onChange, onTouchOutside }: Props) => {

    return (
        <View style={styles.pickerOverlay}>
            <TouchableOpacity style={styles.overlayBg} onPress={onTouchOutside} />
            <DateTimePicker
                date={defaultDate}
                mode="single"
                onChange={onChange}
                minDate={minDate}
                maxDate={maxDate}
                locale="es"
                firstDayOfWeek={1}
                style={styles.pickerContainer}
                styles={globalDatePickerStyles}
            />
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
