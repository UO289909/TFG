/* eslint-disable react-hooks/exhaustive-deps */
import { FlatList, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { FullScreenLoader } from '../../components/feedback';
import { useEffect, useState } from 'react';
import { getReadingLogs } from '../../../core/use-cases/books/get-reading-logs.use-case';
import { CustomTheme } from '../../../config/app-theme';
import { useTheme } from '@react-navigation/native';
import { useBooks } from '../../hooks/useBooks';


export const MonthReadingLogs = () => {

    const { colors } = useTheme() as CustomTheme;

    const { width, height } = useWindowDimensions();
    const isLandscape = width > height || width >= 768;

    const { myBooks } = useBooks();

    const [loading, setLoading] = useState(true);
    const [readInfoByBook, setReadInfoByBook] = useState<{ title: string, pagesRead: number }[]>([]);

    useEffect(() => {
        fetchLogs();
    }, [myBooks]);

    const fetchLogs = async () => {
        setLoading(true);

        const now = new Date();
        const currentMonth = now.getUTCMonth();
        const currentYear = now.getUTCFullYear();

        const readingLogs = await getReadingLogs();

        const logsThisMonth = readingLogs.filter(log => {
            const logDate = new Date(log.reading_date);
            return logDate.getUTCMonth() === currentMonth && logDate.getUTCFullYear() === currentYear;
        });

        const logsByIsbn: { [isbn: string]: typeof readingLogs } = {};
        logsThisMonth.forEach(log => {
            if (!logsByIsbn[log.isbn]) {
                logsByIsbn[log.isbn] = [];
            }
            logsByIsbn[log.isbn].push(log);
        });

        const readInfoList: { title: string; pagesRead: number }[] = [];

        for (const isbn of Object.keys(logsByIsbn)) {
            const logs = logsByIsbn[isbn];
            const sortedLogs = logs.sort((a, b) => new Date(a.reading_date).getTime() - new Date(b.reading_date).getTime());
            const fromPage = sortedLogs[0].from_page ?? 0;
            const toPage = sortedLogs[sortedLogs.length - 1].to_page ?? 0;
            const pagesRead = Math.max(0, toPage - fromPage);

            const book = myBooks.find(b => b.isbn === isbn);
            readInfoList.push({
                title: book?.title ?? 'Desconocido',
                pagesRead,
            });
        }

        setReadInfoByBook(readInfoList);

        setLoading(false);
    };

    const renderBookStat = ({ item }: { item: { title: string, pagesRead: number } }) => (
        <View style={{ ...styles.card, backgroundColor: colors.card, shadowColor: colors.shadow }}>
            <Text style={{ ...styles.title, color: colors.text }}>{item.title}</Text>
            <Text style={{ ...styles.pages, color: colors.text }}>{item.pagesRead} páginas leídas</Text>
        </View>
    );


    if (loading) {
        return <FullScreenLoader message="Cargando registros de lectura..." />;
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={readInfoByBook}
                key={isLandscape ? 'h' : 'v'}
                renderItem={renderBookStat}
                keyExtractor={(item, index) => item.title + index}
                numColumns={isLandscape ? 2 : 1}
                contentContainerStyle={styles.scrollContainer}
            />
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContainer: {
        paddingBottom: 10,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '95%',
        minHeight: 100,
        borderRadius: 16,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        alignSelf: 'center',
        marginTop: 10,
        padding: 12,
        elevation: 4,
    },
    title: {
        fontSize: 16,
        fontFamily: 'Roboto-Medium',
    },
    pages: {
        fontSize: 14,
        fontFamily: 'Roboto-Light',
    },
});
