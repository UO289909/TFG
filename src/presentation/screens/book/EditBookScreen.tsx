/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import { useEffect, useState } from 'react';
import { View, ScrollView, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CustomTextInput } from '../../components/inputs/CustomTextInput';
import { NavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { FloatingButton } from '../../components/pressables/FloatingButton';
import { globalColors } from '../../../config/app-theme';
import { RootStackParams } from '../../navigation/MyBooksStackNavigator';
import { UserBook } from '../../../infrastructure/interfaces/supabase.responses';
import { getUserBookByIsbn } from '../../../core/use-cases/get-user-book-by-isbn.use-case';
import { FullScreenLoader } from '../../components/loaders/FullScreenLoader';
import { FiveStarsInput } from '../../components/inputs/FiveStarsInput';
import { CustomDatePicker } from '../../components/inputs/CustomDatePicker';

export const EditBookScreen = () => {
    const navigation = useNavigation<NavigationProp<RootStackParams>>();
    const { params } = useRoute<RouteProp<RootStackParams, 'EditBook'>>();
    const { book } = params;

    const [userBook, setUserBook] = useState<UserBook>();
    const [isLoading, setIsLoading] = useState(true);

    const [author, setAuthor] = useState('');
    const [pages, setPages] = useState('');
    const [year, setYear] = useState('');
    const [cover, setCover] = useState('');
    const [rating, setRating] = useState(0);
    const [startDate, setStartDate] = useState(userBook?.start_date);
    const [finishDate, setFinishDate] = useState(userBook?.finish_date);

    const fetchUserBook = async () => {
        setIsLoading(true);

        const fetchedBook = await getUserBookByIsbn(book.isbn);
        setUserBook(fetchedBook);

        setIsLoading(false);
    };

    useEffect(() => {
        fetchUserBook();
    }, []);

    useEffect(() => {
        if (userBook) {
            setAuthor(userBook.author ?? '');
            setPages(userBook.pages?.toString() ?? '');
            setYear(userBook.release_year?.toString() ?? '');
            setCover(userBook.cover_url ?? '');
            setRating(Number(userBook.rating) || 0);
        }
    }, [userBook]);



    const handleGoBack = () => {
        navigation.goBack();
    };

    const handleEditBook = () => {

    };

    if (isLoading) {
        return <FullScreenLoader />;
    }

    return (
        <View style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={{ padding: 20 }}>

                <Text style={styles.titleText}>{book.title}</Text>

                {author !== '' &&
                    <CustomTextInput
                        label="Autor:"
                        value={author}
                        onChangeText={setAuthor}
                    />
                }

                {pages !== '0' &&
                    <CustomTextInput
                        label="Número de páginas:"
                        value={pages}
                        onChangeText={setPages}
                        keyboardType="numeric"
                    />
                }

                {year !== '0' &&
                    <CustomTextInput
                        label="Año de publicación:"
                        value={year}
                        onChangeText={setYear}
                        keyboardType="numeric"
                    />
                }

                {cover !== '' &&
                    <CustomTextInput
                        label="URL de la portada (opcional):"
                        value={cover}
                        onChangeText={setCover}
                    />
                }

                {startDate !== '' &&
                    <View>
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
                </View>
                }

                {rating !== 0 &&
                    <FiveStarsInput
                        value={rating}
                        onPress={setRating}
                    />
                }

            </ScrollView>
            <FloatingButton
                onPress={handleGoBack}
                icon="close-outline"
                position="bottom-left"
                color={globalColors.danger}
                colorPressed={globalColors.dangerDark}
            />
            <FloatingButton
                onPress={handleEditBook}
                icon="checkmark-outline"
                position="bottom-right"
                color={globalColors.primary}
                colorPressed={globalColors.primaryDark}
                disabled={false}
            />
        </View>
    );
};


const styles = StyleSheet.create({
    titleText: {
        fontSize: 24,
        fontFamily: 'Roboto-Bold',
        marginBottom: 20,
    },
});
