import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { DateType } from 'react-native-ui-datepicker';
import { FiveStarsInput } from '../../components/inputs/FiveStarsInput';
import { RootStackParams } from '../../navigation/MyBooksStackNavigator';
import { FloatingButton } from '../../components/pressables/FloatingButton';
import { globalColors } from '../../../config/app-theme';
import { CustomDatePicker } from '../../components/inputs/CustomDatePicker';
import { rateBook } from '../../../core/use-cases/rate-book.use-case';


export const RateBookScreen = () => {
    const navigation = useNavigation<NavigationProp<RootStackParams>>();
    const { params } = useRoute<RouteProp<RootStackParams, 'RateBook'>>();
    const { book, rating } = params;

    const today = new Date();
    const [startDate, setStartDate] = useState<Date | undefined>(undefined);
    const [endDate, setEndDate] = useState<Date | undefined>(today);
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);
    const [currentRating, setCurrentRating] = useState<number>(rating);

    const onChangeStart = (selectedDate?: DateType) => {
        if (selectedDate) {
            setStartDate(new Date(selectedDate.toString()));
        }
        setShowStartPicker(false);
    };

    const onChangeEnd = (selectedDate?: DateType) => {
        if (selectedDate) {
            setEndDate(new Date(selectedDate.toString()));
        }
        setShowEndPicker(false);
    };

    const handleSubmit = async () => {
        if (!startDate || !endDate || currentRating === 0) {
            return;
        }

        await rateBook(
            book.isbn,
            currentRating,
            startDate,
            endDate
        );
        navigation.navigate('MyBooksList');
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
                <Text style={styles.dateLabel}>
                    {startDate
                        ? startDate.toLocaleDateString()
                        : 'Selecciona la fecha de inicio'}
                </Text>
            </TouchableOpacity>
            {showStartPicker && (
                <CustomDatePicker
                    minDate={undefined}
                    maxDate={endDate}
                    defaultDate={startDate || today}
                    onChange={onChangeStart}
                    onTouchOutside={() => setShowStartPicker(false)}
                />
            )}

            <Text style={styles.label}>Fecha de fin de lectura</Text>
            <TouchableOpacity onPress={() => setShowEndPicker(true)} style={styles.dateInput}>
                <Text style={styles.dateLabel}>
                    {endDate ? endDate.toLocaleDateString() : today.toLocaleDateString()}
                </Text>
            </TouchableOpacity>
            {showEndPicker && (
                <CustomDatePicker
                    minDate={startDate}
                    maxDate={today}
                    defaultDate={endDate}
                    onChange={onChangeEnd}
                    onTouchOutside={() => setShowEndPicker(false)}
                />
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
        borderWidth: 2,
        borderColor: globalColors.primary,
        borderRadius: 10,
        paddingVertical: 8,
        paddingHorizontal: 12,
        marginBottom: 8,
    },
    dateLabel: {
        fontFamily: 'Roboto-Regular',
        fontSize: 16,
        color: '#222',
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
