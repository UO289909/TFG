/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { NavigationProp, RouteProp, useNavigation, useRoute, useTheme } from '@react-navigation/native';
import { FiveStarsInput } from '../../components/inputs/FiveStarsInput';
import { RootStackParams } from '../../navigation/MyBooksStackNavigator';
import { FloatingButton } from '../../components/pressables/FloatingButton';
import { CustomTheme } from '../../../config/app-theme';
import { rateUserBook } from '../../../core/use-cases/books/rate-book.use-case';
import { addReadingLog } from '../../../core/use-cases/books/add-reading-log.use-case';
import { getReadingLogs } from '../../../core/use-cases/books/get-reading-logs.use-case';
import { FullScreenLoader } from '../../components/feedback';


export const RateBookScreen = () => {

    const navigation = useNavigation<NavigationProp<RootStackParams>>();
    const { params } = useRoute<RouteProp<RootStackParams, 'RateBook'>>();

    const { book, rating } = params;

    const { colors } = useTheme() as CustomTheme;

    const today = new Date();
    const [startDate, setStartDate] = useState<Date | undefined>(undefined);
    const [startDatePages, setStartDatePages] = useState<number>();
    const [daysRead, setDaysRead] = useState<number>(0);
    const [finishDatePages, setFinishDatePages] = useState<number>();
    const [currentRating, setCurrentRating] = useState<number>(rating);

    useEffect(() => {
        loadBookLogs();
    }, []);

    const loadBookLogs = async () => {
        const logs = await getReadingLogs(undefined, book.isbn);

        if (logs.length === 0) {
            setStartDate(today);
            setStartDatePages(Number(book.pages));
            setFinishDatePages(Number(book.pages));
        } else {
            setStartDate(new Date(logs[logs.length - 1].reading_date));
            setStartDatePages(logs[logs.length - 1].to_page);
            setFinishDatePages(Number(book.pages) - logs[0].to_page);
            setDaysRead(logs.length + 1);
        }

        return;
    };

    const handleSubmit = async () => {
        if (!startDate || currentRating === 0) {
            return;
        }

        const lastLogPromise = addReadingLog(book.isbn, book.current_page || '0', book.pages!, today);

        const ratePromise = rateUserBook(
            book.isbn,
            currentRating,
            startDate,
            today
        );

        await Promise.all([lastLogPromise, ratePromise]);

        navigation.reset({
            index: 0,
            routes: [
                { name: 'MyBooksList', params: { doRefetch: true } },
            ],
        });
    };

    const handleCancel = () => {
        setStartDate(undefined);
        setCurrentRating(0);
        navigation.goBack();
    };


    if (!startDate) {
        return <FullScreenLoader message="Cargando información del libro..." />;
    }

    return (
        <View style={styles.container}>

            <Text style={{ ...styles.title, color: colors.text }}>Valorar '{book.title}'</Text>

            <ScrollView contentContainerStyle={styles.scrollContainer}>

                {startDate.toDateString() !== today.toDateString() &&
                    <>
                        <View style={{ ...styles.infoContainer, backgroundColor: colors.card, shadowColor: colors.shadow }}>
                            <Text style={{ ...styles.label, color: colors.text }}>
                                Empezaste a leer el libro el día {startDate?.toLocaleDateString()}
                            </Text>
                            <Text style={{ ...styles.label, color: colors.text }}>
                                Leiste {startDatePages} páginas ese día
                            </Text>
                        </View>

                        <View style={{ ...styles.infoContainer, backgroundColor: colors.card, shadowColor: colors.shadow }}>
                            <Text style={{ ...styles.label, color: colors.text }}>
                                Has leido este libro un total de {daysRead} días
                            </Text>
                        </View>
                    </>
                }

                <View style={{ ...styles.infoContainer, backgroundColor: colors.card, shadowColor: colors.shadow }}>
                    <Text style={{ ...styles.label, color: colors.text }}>
                        Terminaste el libro hoy leyendo {finishDatePages} páginas
                    </Text>
                </View>

                {startDate.toDateString() === today.toDateString() &&
                    <View style={{ ...styles.infoContainer, backgroundColor: colors.card, shadowColor: colors.shadow }}>
                        <Text style={{ ...styles.label, color: colors.text }}>
                            ¡Has terminado el libro en un solo día! ¡Impresionante!
                        </Text>
                    </View>
                }

                <Text style={{ ...styles.ratingLabel, color: colors.text }}>Valoración:</Text>
                <FiveStarsInput value={currentRating} onPress={setCurrentRating} />
            </ScrollView>

            <FloatingButton
                onPress={handleSubmit}
                icon="checkmark-outline"
                position="bottom-right"
                color={colors.primary}
                colorPressed={colors.primaryDark}
                disabled={!startDate || currentRating === 0}
            />

            <FloatingButton
                onPress={handleCancel}
                icon="close-outline"
                position="bottom-left"
                color={colors.danger}
                colorPressed={colors.dangerDark}
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
    infoContainer: {
        flexDirection: 'column',
        width: '95%',
        minHeight: 40,
        borderRadius: 16,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        alignSelf: 'center',
        alignItems: 'center',
        marginBottom: 8,
        padding: 12,
        elevation: 4,
    },
    title: {
        fontSize: 22,
        fontFamily: 'Roboto-Bold',
        marginBottom: 10,
        marginTop: 20,
        textAlign: 'center',
    },
    label: {
        fontSize: 16,
        fontFamily: 'Roboto-Regular',
        marginVertical: 4,
        textAlign: 'center',
    },
    ratingLabel: {
        textAlign: 'center',
        fontSize: 16,
        fontFamily: 'Roboto-Medium',
        marginTop: 16,
        marginBottom: 8,
    },
    dateInput: {
        borderWidth: 2,
        borderRadius: 10,
        paddingVertical: 8,
        paddingHorizontal: 12,
        marginBottom: 8,
    },
    dateLabel: {
        fontFamily: 'Roboto-Regular',
        fontSize: 16,
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
});
