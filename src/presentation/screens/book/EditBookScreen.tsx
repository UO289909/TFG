/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';
import { CustomTextInput } from '../../components/inputs/CustomTextInput';
import { NavigationProp, RouteProp, useNavigation, useRoute, useTheme } from '@react-navigation/native';
import { FloatingButton } from '../../components/pressables/FloatingButton';
import { CustomTheme } from '../../../config/app-theme';
import { RootStackParams } from '../../navigation/MyBooksStackNavigator';
import { DatabaseReadingLog, UserBook } from '../../../infrastructure/interfaces/supabase.responses';
import { getUserBookByIsbn } from '../../../core/use-cases/books/get-user-book-by-isbn.use-case';
import { FullScreenLoader } from '../../components/feedback/FullScreenLoader';
import { FiveStarsInput } from '../../components/inputs/FiveStarsInput';
import { editUserBook } from '../../../core/use-cases/books/edit-user-book.use-case';
import { CustomNotification } from '../../components/feedback/CustomNotification';
import { getReadingLogs } from '../../../core/use-cases/books/get-reading-logs.use-case';
import { editReadingLog } from '../../../core/use-cases/books/edit-reading-log.use-case';

export const EditBookScreen = () => {
    const navigation = useNavigation<NavigationProp<RootStackParams>>();
    const { params } = useRoute<RouteProp<RootStackParams, 'EditBook'>>();
    const { book } = params;

    const { colors } = useTheme() as CustomTheme;

    const [showNotif, setShowNotif] = useState(false);
    const [notifMsg, setNotifMsg] = useState('');

    const [userBook, setUserBook] = useState<UserBook>();
    const [bookLogs, setBookLogs] = useState<DatabaseReadingLog[]>([]);
    const today = new Date();
    const [fieldsEnabled, setFieldsEnabled] = useState<string[]>([]);


    const [author, setAuthor] = useState('');
    const [pages, setPages] = useState('');
    const [year, setYear] = useState('');
    const [cover, setCover] = useState('');
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');


    const fetchUserBook = async () => {
        const [fetchedBook, fetchedLogs] = await Promise.all([getUserBookByIsbn(book.isbn), getReadingLogs(undefined, book.isbn)]);
        setUserBook(fetchedBook);
        setBookLogs(fetchedLogs);
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
            setReview(userBook.review ?? '');

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
            if (userBook.rating) {
                setFieldsEnabled((prev) => [...prev, 'rating']);
                setFieldsEnabled((prev) => [...prev, 'review']);
            }
        }

    }, [userBook]);

    useEffect(() => {
        if (fieldsEnabled.length > 0) {
            setNotifMsg('Esta es toda la información que puedes modificar');
        } else {
            setNotifMsg('No puedes modificar ninguna información de este libro');
        }
        setShowNotif(true);
    }, [fieldsEnabled]);

    const handleGoBack = () => {
        navigation.goBack();
    };

    const handleEditBook = async () => {

        if (userBook) {

            let currentPage = null;
            if (fieldsEnabled.includes('pages')) {
                if (book.rating !== null) {
                    currentPage = Number(pages);
                    await editReadingLog(book.isbn, bookLogs[0].reading_date, null, Number(pages));
                } else if (bookLogs.length > 0 && bookLogs[0].to_page > Number(pages)) {
                    currentPage = Number(pages);
                    await editReadingLog(book.isbn, bookLogs[0].reading_date, null, Number(pages));
                }
            }

            await editUserBook(
                userBook.isbn,
                fieldsEnabled.includes('author') ? author : null,
                fieldsEnabled.includes('pages') ? Number(pages) : null,
                currentPage,
                fieldsEnabled.includes('cover_url') ? cover : null,
                fieldsEnabled.includes('release_year') ? Number(year) : null,
                null,
                null,
                fieldsEnabled.includes('rating') ? rating : null,
                fieldsEnabled.includes('review') ? review.trim() : null,
            );

            navigation.reset({
                index: 0,
                routes: [
                    { name: 'MyBooksList', params: { doRefetch: true } },
                ],
            });
        }
    };

    if (!userBook) {
        return <FullScreenLoader message="Cargando información del libro..." />;
    }

    const isAnyEditableFieldEmpty =
        (fieldsEnabled.includes('author') && author.trim() === '') ||
        (fieldsEnabled.includes('pages') && pages.trim() === '') ||
        (fieldsEnabled.includes('release_year') && year.trim() === '') ||
        (fieldsEnabled.includes('rating') && (rating === 0 || rating === null));

    return (
        <View style={styles.container}>

            {showNotif &&
                <CustomNotification
                    message={notifMsg}
                    position="bottom"
                    onClose={() => setShowNotif(false)}
                />
            }

            <Text style={{ ...styles.titleText, color: colors.text }}>Editar '{book.title}'</Text>

            {fieldsEnabled.length === 0 &&
                <Text style={styles.subtitleText}>No hay información modificable por el usuario</Text>
            }

            <ScrollView contentContainerStyle={styles.scrollContainer}>


                {fieldsEnabled.includes('author') &&
                    <CustomTextInput
                        label="Autor:"
                        value={author}
                        onChangeText={setAuthor}
                        style={styles.textInput}
                    />
                }

                {fieldsEnabled.includes('pages') &&
                    <CustomTextInput
                        label="Número de páginas:"
                        value={pages}
                        onChangeText={text => setPages(text.replace(/[^0-9]/g, ''))}
                        keyboardType="numeric"
                        style={styles.textInput}
                        info={bookLogs.length > 1
                            ? book.rating === null
                                ? `No puedes indicar un número menor al que indica tu último registro de lectura (${bookLogs[0].to_page})`
                                : `No puedes indicar un número menor al que indica tu penúltimo registro de lectura (${bookLogs[1].to_page})`
                            : 'No pudedes indicar un número menor al que indica tu último registro de lectura si lo hubiera'
                        }
                    />
                }

                {fieldsEnabled.includes('release_year') &&
                    <CustomTextInput
                        label="Año de publicación:"
                        value={year}
                        onChangeText={text => setYear(text.replace(/[^0-9]/g, ''))}
                        keyboardType="numeric"
                        style={styles.textInput}
                        info={`No puedes leer libros del futuro (estamos en ${today.getFullYear()})`}
                    />
                }

                {fieldsEnabled.includes('cover_url') &&
                    <CustomTextInput
                        label="URL de la portada (opcional):"
                        value={cover}
                        onChangeText={text => setCover(text.replace(/\s/g, ''))}
                        style={styles.textInput}
                    />
                }

                {fieldsEnabled.includes('review') &&
                    <CustomTextInput
                        label="Reseña (opcional):"
                        value={review}
                        onChangeText={setReview}
                        style={styles.textInput}
                        multiline
                    />
                }

                {fieldsEnabled.includes('rating') &&
                    <View>
                        <Text style={{ ...styles.label, ...styles.ratingLabel, color: colors.text }}>Valoración:</Text>
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
                color={colors.danger}
                colorPressed={colors.dangerDark}
            />

            <FloatingButton
                onPress={handleEditBook}
                icon="checkmark-outline"
                position="bottom-right"
                color={colors.primary}
                colorPressed={colors.primaryDark}
                disabled={
                    fieldsEnabled.length === 0 ||
                    isAnyEditableFieldEmpty ||
                    (fieldsEnabled.includes('pages') && pages === '0') ||
                    (bookLogs.length > 1 && fieldsEnabled.includes('pages') && book.rating !== null && Number(pages) <= bookLogs[1].to_page) ||
                    (bookLogs.length > 1 && fieldsEnabled.includes('pages') && book.rating === null && Number(pages) <= bookLogs[0].to_page) ||
                    (bookLogs.length === 1 && fieldsEnabled.includes('pages') && Number(pages) <= bookLogs[0].to_page) ||
                    (fieldsEnabled.includes('release_year') && (Number(year) > today.getFullYear() || year.length !== 4))
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
        paddingBottom: 84,
    },
    titleText: {
        fontSize: 24,
        fontFamily: 'Roboto-Bold',
        marginBottom: 10,
        marginTop: 20,
        textAlign: 'center',
    },
    subtitleText: {
        fontSize: 16,
        fontFamily: 'Roboto-Italic',
        marginBottom: 24,
        textAlign: 'center',
    },
    label: {
        fontFamily: 'Roboto-Medium',
        fontSize: 16,
        marginBottom: 8,
    },
    textInput: {
        marginBottom: 18,
    },
    dateInput: {
        borderWidth: 2,
        borderRadius: 10,
        paddingVertical: 8,
        paddingHorizontal: 12,
        marginBottom: 18,
    },
    dateLabel: {
        fontFamily: 'Roboto-Regular',
        fontSize: 16,
    },
    ratingLabel: {
        alignSelf: 'center',
    },
});
