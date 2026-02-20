import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, useWindowDimensions, FlatList } from 'react-native';
import { CustomNotification, FullScreenLoader } from '../../components/feedback';
import { NavigationProp, RouteProp, useNavigation, useRoute, useTheme } from '@react-navigation/native';
import { RootStackParams } from '../../navigation/MyBooksStackNavigator';
import { searchBooksByTitle } from '../../../core/use-cases/books/search-books-by-title.use-case';
import { openLibrarySearchFetcher } from '../../../config/adapters/openLibrary.adapter';
import { Book } from '../../../core/entities/book.entity';
import { SearchCard } from '../../components/books/SearchCard';
import { CustomTheme } from '../../../config/app-theme';
import { IonIcon } from '../../components/icons';


export const BookSearchScreen = () => {

    const navigation = useNavigation<NavigationProp<RootStackParams>>();
    const { params } = useRoute<RouteProp<RootStackParams, 'BookSearch'>>();
    const { query } = params;

    const { width, height } = useWindowDimensions();
    const isLandscape = width > height || width >= 768;

    const { colors } = useTheme() as CustomTheme;

    const [showNotif, setShowNotif] = useState(false);

    const [bookResults, setBookResults] = useState<{ book: Book, fromOpenLibrary: boolean, alreadyInUser: boolean }[] | null>([]);
    const [noResults, setNoResults] = useState(false);

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        handleSearch();
    }, []);

    useEffect(() => {
        if (bookResults === null) {
            setNoResults(true);
            setIsLoading(false);
            return;
        } else if (bookResults.length === 0) {
            return;
        }
        setIsLoading(false);
        setShowNotif(true);
    }, [bookResults]);

    const handleSearch = async () => {
        const results = await searchBooksByTitle(openLibrarySearchFetcher, query);
        setBookResults(results);
    }

    const handleSelectBook = (search: { book: Book, fromOpenLibrary: boolean, alreadyInUser: boolean }) => {
        if (search.alreadyInUser) {
            navigation.reset({
                index: 0,
                routes: [{ name: 'MyBooksList' }],
            });
        } else {
            navigation.navigate('AddBook', { search }, { pop: true });
        }
    }

    const renderSearchCard = ({ item, index }: { item: { book: Book, fromOpenLibrary: boolean, alreadyInUser: boolean }, index: number }) => (
        <SearchCard
            book={item.book}
            fromOpenLibrary={item.fromOpenLibrary}
            alreadyInUser={item.alreadyInUser}
            onPress={() => handleSelectBook(item)}
            style={[
                isLandscape ? styles.searchCardLandscape : undefined,
                index === 0 ? { marginTop: 5 } : undefined
            ]}
        />
    );


    if (isLoading) {
        return <FullScreenLoader message={`Buscando libros por "${query}"...`} />
    }

    if (noResults) {
        return (
            <View style={styles.container}>
                <View style={[styles.headerContainer, { backgroundColor: colors.card }]}>
                    <Text style={[styles.titleText, { color: colors.text },]}>
                        No se ha encontrado nada por "{query}"
                    </Text>
                </View>
                <IonIcon
                    name="book"
                    size={200}
                    color={colors.greyLight}
                    style={styles.bigIcon}
                />
            </View>
        )
    }

    return (
        <View style={styles.container}>

            {showNotif &&
                <CustomNotification
                    message={'Selecciona un resultado para añadir a tu biblioteca o vuelve atrás'}
                    position="bottom"
                    onClose={() => setShowNotif(false)}
                />
            }

            <View style={[styles.headerContainer, { backgroundColor: colors.card }]}>
                <Text style={[styles.titleText, { color: colors.text },]}>
                    Resultados de la búsqueda por "{query}"
                </Text>
            </View>

            <FlatList
                data={bookResults}
                key={isLandscape ? 'h' : 'v'}
                renderItem={renderSearchCard}
                keyExtractor={item => item.book.isbn}
                numColumns={isLandscape ? 2 : 1}
                contentContainerStyle={styles.scrollContainer}
            />

        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerContainer: {
        width: '95%',
        borderRadius: 16,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        marginBottom: 5,
        padding: 12,
    },
    titleText: {
        fontSize: 20,
        fontFamily: 'Roboto-Medium',
        textAlign: 'center',
    },
    bigIcon: {
        flex: 1,
        alignSelf: 'center',
        marginTop: 50,
    },
    scrollContainer: {
        paddingBottom: 10,
    },
    searchCardLandscape: {
        flex: 1,
        margin: 8,
    },
})