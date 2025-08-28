import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { NavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { DateType } from 'react-native-ui-datepicker';
import { FiveStarsInput } from '../../components/inputs/FiveStarsInput';
import { RootStackParams } from '../../navigation/MyBooksStackNavigator';
import { FloatingButton } from '../../components/pressables/FloatingButton';
import { globalColors } from '../../../config/app-theme';
import { CustomDatePicker } from '../../components/inputs/CustomDatePicker';
import { rateUserBook } from '../../../core/use-cases/books/rate-book.use-case';


export const RateBookScreen = () => {
    const navigation = useNavigation<NavigationProp<RootStackParams>>();
    const { params } = useRoute<RouteProp<RootStackParams, 'RateBook'>>();
    const { book, rating } = params;

    const today = new Date();
    const [startDate, setStartDate] = useState<Date | undefined>(undefined);
    const [finishDate, setFinishDate] = useState<Date | undefined>(today);
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showFinishPicker, setShowFinishPicker] = useState(false);
    const [currentRating, setCurrentRating] = useState<number>(rating);

    const onChangeStart = (selectedDate?: DateType) => {
        if (selectedDate) {
            setStartDate(new Date(selectedDate.toString()));
        }
        setShowStartPicker(false);
    };

    const onChangeFinish = (selectedDate?: DateType) => {
        if (selectedDate) {
            setFinishDate(new Date(selectedDate.toString()));
        }
        setShowFinishPicker(false);
    };

    const handleSubmit = async () => {
        if (!startDate || !finishDate || currentRating === 0) {
            return;
        }

        await rateUserBook(
            book.isbn,
            currentRating,
            startDate,
            finishDate
        );
        navigation.navigate('MyBooksList', { doRefetch: true });
    };

    const handleCancel = () => {
        setStartDate(undefined);
        setFinishDate(undefined);
        setCurrentRating(0);
        navigation.goBack();
    };

    return (
        <View style={styles.container}>

            {showStartPicker && (
                <CustomDatePicker
                    minDate={undefined}
                    maxDate={finishDate}
                    defaultDate={startDate || today}
                    onChange={onChangeStart}
                    onTouchOutside={() => setShowStartPicker(false)}
                />
            )}
            {showFinishPicker && (
                <CustomDatePicker
                    minDate={startDate}
                    maxDate={today}
                    defaultDate={finishDate}
                    onChange={onChangeFinish}
                    onTouchOutside={() => setShowFinishPicker(false)}
                />
            )}

            <Text style={styles.title}>Valorar "{book.title}"</Text>

            <ScrollView contentContainerStyle={styles.scrollContainer}>

                <Text style={styles.label}>Fecha de inicio de lectura:</Text>
                <TouchableOpacity onPress={() => setShowStartPicker(true)} style={styles.dateInput}>
                    <Text style={styles.dateLabel}>
                        {startDate
                            ? startDate.toLocaleDateString()
                            : 'Selecciona la fecha de inicio'}
                    </Text>
                </TouchableOpacity>

                <Text style={styles.label}>Fecha de fin de lectura:</Text>
                <TouchableOpacity onPress={() => setShowFinishPicker(true)} style={styles.dateInput}>
                    <Text style={styles.dateLabel}>
                        {finishDate ? finishDate.toLocaleDateString() : today.toLocaleDateString()}
                    </Text>
                </TouchableOpacity>

                <Text style={styles.label}>Valoración:</Text>
                <FiveStarsInput value={currentRating} onPress={setCurrentRating} />
            </ScrollView>

            <FloatingButton
                onPress={handleSubmit}
                icon="checkmark-outline"
                position="bottom-right"
                color={globalColors.primary}
                colorPressed={globalColors.primaryDark}
                disabled={!startDate || !finishDate || currentRating === 0}
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
    },
    scrollContainer: {
        padding: 20,
    },
    title: {
        fontSize: 22,
        fontFamily: 'Roboto-Bold',
        marginBottom: 10,
        marginTop: 20,
        marginLeft: 20,
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
        borderColor: '#ccc',
        backgroundColor: '#faf9fd',
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
