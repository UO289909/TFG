import { useEffect, useState } from 'react';
import { View, StyleSheet, useWindowDimensions, FlatList } from 'react-native';
import { FullScreenLoader } from '../../components/feedback';
import { NavigationProp, RouteProp, useNavigation, useRoute, useTheme } from '@react-navigation/native';
import { RootStackParams } from '../../navigation/MyBooksStackNavigator';
import { searchBooksByTitle } from '../../../core/use-cases/books/search-books-by-title.use-case';
import { openLibrarySearchFetcher } from '../../../config/adapters/openLibrary.adapter';
import { Book } from '../../../core/entities/book.entity';
import { SearchCard } from '../../components/books/SearchCard';
import { CustomTheme } from '../../../config/app-theme';


export const BookSearchScreen = () => {

    const navigation = useNavigation<NavigationProp<RootStackParams>>();
    const { params } = useRoute<RouteProp<RootStackParams, 'BookSearch'>>();
    const { query } = params;

    const { width, height } = useWindowDimensions();
    const isLandscape = width > height || width >= 768;

    const { colors } = useTheme() as CustomTheme;

    const [bookResults, setBookResults] = useState<{ book: Book, fromOpenLibrary: boolean, alreadyInUser: boolean }[]>([]);

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        handleSearch();
    }, []);

    useEffect(() => {
        if (bookResults.length === 0) {
            return;
        }
        setIsLoading(false);
    }, [bookResults]);

    const handleSearch = async () => {
        const results = await searchBooksByTitle(openLibrarySearchFetcher, query);
        setBookResults(results);
    }

    const renderSearchCard = ({ item }: { item: { book: Book, fromOpenLibrary: boolean, alreadyInUser: boolean } }) => (
        <SearchCard
            book={item.book}
            fromOpenLibrary={item.fromOpenLibrary}
            alreadyInUser={item.alreadyInUser}
            onPress={() => { }}
        />
    );


    if (isLoading) {
        return <FullScreenLoader message={`Buscando libros por "${query}"...`} />
    }

    return (
        <View style={styles.container}>

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
    scrollContainer: {
        paddingBottom: 10,
    }
})