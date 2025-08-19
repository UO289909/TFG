/* eslint-disable react-hooks/exhaustive-deps */
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
import { DateType } from 'react-native-ui-datepicker';
import { editUserBook } from '../../../core/use-cases/edit-user-book.use-case';

export const EditBookScreen = () => {
    const navigation = useNavigation<NavigationProp<RootStackParams>>();
    const { params } = useRoute<RouteProp<RootStackParams, 'EditBook'>>();
    const { book } = params;

    const [userBook, setUserBook] = useState<UserBook>();
    const [isLoading, setIsLoading] = useState(true);
    const [fieldsEnabled, setFieldsEnabled] = useState<string[]>([]);


    const [author, setAuthor] = useState('');
    const [pages, setPages] = useState('');
    const [year, setYear] = useState('');
    const [cover, setCover] = useState('');
    const [rating, setRating] = useState(0);

    const today = new Date();
    const [startDate, setStartDate] = useState('');
    const [finishDate, setFinishDate] = useState('');
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showFinishPicker, setShowFinishPicker] = useState(false);

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
            setStartDate(userBook.start_date ?? '');
            setFinishDate(userBook.finish_date ?? '');

            if (userBook.author) {
                setFieldsEnabled((prev) => [...prev, 'author']);
            }
            if (userBook.pages) {
                setFieldsEnabled((prev) => [...prev, 'pages']);
            }
            if (userBook.release_year) {
                setFieldsEnabled((prev) => [...prev, 'release_year']);
            }
            if (userBook.cover_url) {
                setFieldsEnabled((prev) => [...prev, 'cover_url']);
            }
            if (userBook.start_date) {
                setFieldsEnabled((prev) => [...prev, 'dates']);
            }
            if (userBook.rating) {
                setFieldsEnabled((prev) => [...prev, 'rating']);
            }
        }

    }, [userBook]);

    const onChangeStart = (selectedDate?: DateType) => {
        if (selectedDate) {
            setStartDate(selectedDate.toString());
        }
        setShowStartPicker(false);
    };

    const onChangeFinish = (selectedDate?: DateType) => {
        if (selectedDate) {
            setFinishDate(selectedDate.toString());
        }
        setShowFinishPicker(false);
    };

    const handleGoBack = () => {
        navigation.goBack();
    };

    const handleEditBook = async () => {

        if (userBook) {
            await editUserBook(
                userBook.isbn,
                fieldsEnabled.includes('author') ? author : null,
                fieldsEnabled.includes('pages') ? Number(pages) : null,
                fieldsEnabled.includes('cover_url') ? cover : null,
                fieldsEnabled.includes('release_year') ? Number(year) : null,
                fieldsEnabled.includes('dates') ? new Date(startDate).toISOString() : null,
                fieldsEnabled.includes('dates') ? new Date(finishDate).toISOString() : null,
                fieldsEnabled.includes('rating') ? rating : null,
            );

            navigation.navigate('MyBooksList');
        }
    };

    if (isLoading) {
        return <FullScreenLoader />;
    }

    const isAnyEditableFieldEmpty =
        (fieldsEnabled.includes('author') && author.trim() === '') ||
        (fieldsEnabled.includes('pages') && pages.trim() === '') ||
        (fieldsEnabled.includes('release_year') && year.trim() === '') ||
        (fieldsEnabled.includes('dates') && startDate.trim() === '') ||
        (fieldsEnabled.includes('dates') && finishDate.trim() === '') ||
        (fieldsEnabled.includes('rating') && (rating === 0 || rating === null));

    return (
        <View style={styles.container}>

            {showStartPicker && (
                <CustomDatePicker
                    minDate={undefined}
                    maxDate={new Date(finishDate ? new Date(finishDate) : '')}
                    defaultDate={startDate ? new Date(startDate) : today}
                    onChange={onChangeStart}
                    onTouchOutside={() => setShowStartPicker(false)}
                />
            )}
            {showFinishPicker && (
                <CustomDatePicker
                    minDate={startDate ? new Date(startDate) : undefined}
                    maxDate={today}
                    defaultDate={finishDate ? new Date(finishDate) : today}
                    onChange={onChangeFinish}
                    onTouchOutside={() => setShowFinishPicker(false)}
                />
            )}

            <ScrollView contentContainerStyle={styles.scrollContainer}>

                <Text style={styles.titleText}>{book.title}</Text>

                {fieldsEnabled.length > 0 &&
                    <Text style={styles.subtitleText}>Esta es la información que puedes modificar:</Text>
                }

                {fieldsEnabled.length === 0 &&
                    <Text style={styles.subtitleText}>No puedes modificar ninguna información de este libro :(</Text>
                }

                {fieldsEnabled.includes('author') &&
                    <CustomTextInput
                        label="Autor:"
                        value={author}
                        onChangeText={setAuthor}
                    />
                }

                {fieldsEnabled.includes('pages') &&
                    <CustomTextInput
                        label="Número de páginas:"
                        value={pages}
                        onChangeText={setPages}
                        keyboardType="numeric"
                    />
                }

                {fieldsEnabled.includes('release_year') &&
                    <CustomTextInput
                        label="Año de publicación:"
                        value={year}
                        onChangeText={setYear}
                        keyboardType="numeric"
                    />
                }

                {fieldsEnabled.includes('cover_url') &&
                    <CustomTextInput
                        label="URL de la portada (opcional):"
                        value={cover}
                        onChangeText={setCover}
                    />
                }

                {fieldsEnabled.includes('dates') &&
                    <View>
                        <Text style={styles.label}>Fecha de inicio de lectura:</Text>
                        <TouchableOpacity onPress={() => setShowStartPicker(true)} style={styles.dateInput}>
                            <Text style={styles.dateLabel}>
                                {startDate
                                    ? new Date(startDate).toLocaleDateString()
                                    : 'Selecciona la fecha de inicio'}
                            </Text>
                        </TouchableOpacity>

                        <Text style={styles.label}>Fecha de fin de lectura:</Text>
                        <TouchableOpacity onPress={() => setShowFinishPicker(true)} style={styles.dateInput}>
                            <Text style={styles.dateLabel}>
                                {finishDate ? new Date(finishDate).toLocaleDateString() : today.toLocaleDateString()}
                            </Text>
                        </TouchableOpacity>
                    </View>
                }

                {fieldsEnabled.includes('rating') &&
                    <View>
                        <Text style={{ ...styles.label, ...styles.ratingLabel }}>Valoración:</Text>
                        <FiveStarsInput
                            value={rating}
                            onPress={setRating}
                        />
                    </View>
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
                disabled={
                    fieldsEnabled.length === 0 ||
                    isAnyEditableFieldEmpty
                }
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
    titleText: {
        fontSize: 24,
        fontFamily: 'Roboto-Bold',
        marginBottom: 4,
    },
    subtitleText: {
        fontSize: 16,
        fontFamily: 'Roboto-Italic',
        marginBottom: 24,
    },
    label: {
        fontFamily: 'Roboto-Medium',
        fontSize: 18,
        marginBottom: 4,
        color: '#333',
    },
    dateInput: {
        borderWidth: 2,
        borderColor: '#ccc',
        backgroundColor: '#faf9fd',
        borderRadius: 10,
        paddingVertical: 8,
        paddingHorizontal: 12,
        marginBottom: 18,
    },
    dateLabel: {
        fontFamily: 'Roboto-Regular',
        fontSize: 16,
        color: '#222',
    },
    ratingLabel: {
        alignSelf: 'center',
    },
});
