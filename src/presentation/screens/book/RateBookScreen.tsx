import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, Platform, TouchableOpacity } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { FiveStarsInput } from '../../components/inputs/FiveStarsInput';

type RateBookScreenRouteProp = RouteProp<
    {
        params: {
            book: any; // Ajusta el tipo según tu modelo de libro
            rating: number;
        };
    },
    'params'
>;

const RateBookScreen: React.FC = () => {
    const navigation = useNavigation();
    const route = useRoute<RateBookScreenRouteProp>();
    const { book, rating } = route.params;

    const today = new Date();
    const [startDate, setStartDate] = useState<Date | undefined>(undefined);
    const [endDate, setEndDate] = useState<Date>(today);
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);
    const [currentRating, setCurrentRating] = useState<number>(rating);

    const onChangeStart = (_: any, selectedDate?: Date) => {
        setShowStartPicker(Platform.OS === 'ios');
        if (selectedDate) setStartDate(selectedDate);
    };

    const onChangeEnd = (_: any, selectedDate?: Date) => {
        setShowEndPicker(Platform.OS === 'ios');
        if (selectedDate) setEndDate(selectedDate);
    };

    const handleSubmit = () => {
        // Aquí puedes manejar el envío de los datos
        // Por ejemplo, llamar a una función para guardar la valoración
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Valorar "{book.title}"</Text>

            <Text style={styles.label}>Fecha de inicio de lectura</Text>
            <TouchableOpacity onPress={() => setShowStartPicker(true)} style={styles.dateInput}>
                <Text>
                    {startDate
                        ? startDate.toLocaleDateString()
                        : 'Selecciona la fecha de inicio'}
                </Text>
            </TouchableOpacity>
            {showStartPicker && (
                <DateTimePicker
                    value={startDate || today}
                    mode="date"
                    display="default"
                    onChange={onChangeStart}
                    maximumDate={endDate}
                />
            )}

            <Text style={styles.label}>Fecha de fin de lectura</Text>
            <TouchableOpacity onPress={() => setShowEndPicker(true)} style={styles.dateInput}>
                <Text>
                    {endDate ? endDate.toLocaleDateString() : today.toLocaleDateString()}
                </Text>
            </TouchableOpacity>
            {showEndPicker && (
                <DateTimePicker
                    value={endDate}
                    mode="date"
                    display="default"
                    onChange={onChangeEnd}
                    minimumDate={startDate}
                    maximumDate={today}
                />
            )}

            <Text style={styles.label}>Valoración</Text>
            <FiveStarsInput value={currentRating} onChange={setCurrentRating} />

            <Button title="Guardar valoración" onPress={handleSubmit} />
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
        fontWeight: 'bold',
        marginBottom: 24,
    },
    label: {
        fontSize: 16,
        marginTop: 16,
        marginBottom: 8,
    },
    dateInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
    },
});

export default RateBookScreen;