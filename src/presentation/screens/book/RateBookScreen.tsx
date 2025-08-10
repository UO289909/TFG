import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import DateTimePicker, { DateType } from 'react-native-ui-datepicker';
import { FiveStarsInput } from '../../components/inputs/FiveStarsInput';
import { RootStackParams } from '../../navigation/MyBooksStackNavigator';
import { FloatingButton } from '../../components/pressables/FloatingButton';
import { globalColors, globalDatePickerStyles } from '../../../config/app-theme';


export const RateBookScreen = () => {
    const navigation = useNavigation();
    const { params } = useRoute<RouteProp<RootStackParams, 'RateBook'>>();
    const { book, rating } = params;

    const today = new Date();
    const [startDate, setStartDate] = useState<DateType | undefined>(undefined);
    const [endDate, setEndDate] = useState<DateType | undefined>(today);
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);
    const [currentRating, setCurrentRating] = useState<number>(rating);

    const onChangeStart = (_: any, selectedDate?: Date) => {
        setShowStartPicker(Platform.OS === 'ios');
        if (selectedDate) {
            setStartDate(selectedDate);
        }
    };

    const onChangeEnd = (_: any, selectedDate?: Date) => {
        setShowEndPicker(Platform.OS === 'ios');
        if (selectedDate) {
            setEndDate(selectedDate);
        }
    };

    const handleSubmit = () => {
        // Aquí puedes manejar el envío de los datos
        // Por ejemplo, llamar a una función para guardar la valoración
        navigation.goBack();
    };

    const handleCancel = () => {
        setStartDate(undefined);
        setEndDate(undefined);
        setCurrentRating(0);
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Valorar "{book.title}"</Text>

            <Text style={styles.label}>Fecha de inicio de lectura</Text>
            <TouchableOpacity onPress={() => setShowStartPicker(true)} style={styles.dateInput}>
                <Text>
                    {startDate
                        ? startDate.toLocaleString()
                        : 'Selecciona la fecha de inicio'}
                </Text>
            </TouchableOpacity>
            {showStartPicker && (
                <View style={styles.pickerOverlay}>
                    <TouchableOpacity style={styles.overlayBg} onPress={() => setShowStartPicker(false)} />
                    <DateTimePicker
                        date={startDate || today}
                        mode="single"
                        onChange={onChangeStart}
                        maxDate={endDate}
                        locale="es"
                        firstDayOfWeek={1}
                        style={styles.pickerContainer}
                        styles={globalDatePickerStyles}
                    />
                </View>
            )}

            <Text style={styles.label}>Fecha de fin de lectura</Text>
            <TouchableOpacity onPress={() => setShowEndPicker(true)} style={styles.dateInput}>
                <Text>
                    {endDate ? endDate.toLocaleString() : today.toLocaleDateString()}
                </Text>
            </TouchableOpacity>
            {showEndPicker && (
                <View style={styles.pickerOverlay}>
                    <TouchableOpacity style={styles.overlayBg} onPress={() => setShowEndPicker(false)} />
                    <DateTimePicker
                        date={endDate}
                        mode="single"
                        onChange={onChangeEnd}
                        minDate={startDate}
                        maxDate={today}
                        locale="es"
                        firstDayOfWeek={1}
                        style={styles.pickerContainer}
                        styles={globalDatePickerStyles}
                    />
                </View>
            )}

            <Text style={styles.label}>Valoración</Text>
            <FiveStarsInput value={currentRating} onPress={setCurrentRating} />

            <FloatingButton
                onPress={handleSubmit}
                icon="checkmark-outline"
                position="bottom-right"
                color={globalColors.primary}
                colorPressed={globalColors.primaryDark}
                disabled={!startDate || !endDate || currentRating === 0}
            />

            <FloatingButton
                onPress={handleCancel}
                icon="close-outline"
                position="bottom-left"
                color={globalColors.danger}
                colorPressed={globalColors.dangerDark}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 22,
        fontFamily: 'Roboto-Bold',
        marginBottom: 24,
    },
    label: {
        textAlign: 'center',
        fontSize: 16,
        fontFamily: 'Roboto-Regular',
        marginTop: 16,
        marginBottom: 8,
    },
    dateInput: {
        borderWidth: 1,
        borderColor: globalColors.primary,
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
    },
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
