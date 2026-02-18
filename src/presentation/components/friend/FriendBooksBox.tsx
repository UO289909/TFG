import { FlatList, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { NavigationProp, useNavigation, useTheme } from '@react-navigation/native';
import { CustomTheme } from '../../../config/app-theme';
import { Book } from '../../../core/entities/book.entity';
import { FullScreenLoader } from '../feedback';
import { RootStackParams } from '../../navigation/HomeStackNavigator';
import { FriendBookCard } from './FriendBookCard';
import { User } from '../../../core/entities/user.entity';

interface Props {
    books: Book[];
    loading: boolean;
    error?: boolean;
    friend: User;
}

export const FriendBooksBox = ({ books, loading, error, friend }: Props) => {

    const navigation = useNavigation<NavigationProp<RootStackParams>>();

    const { colors } = useTheme() as CustomTheme;

    const { width, height } = useWindowDimensions();
    const isLandscape = width > height;

    const handleGoToReadInfo = (book: Book) => {
        navigation.navigate('ReadDetails', { book, user: friend, userPressable: false });
    };

    const renderBook = ({ item }: { item: Book }) => (
        <FriendBookCard
            title={item.title}
            cover_url={item.cover_url}
            rating={item.rating}
            pages={item.pages}
            current_page={item.current_page}
            onPress={() => handleGoToReadInfo(item)}
        />
    );

    if (error) {
        return (
            <View style={[
                styles.loadingContainer,
                {
                    backgroundColor: colors.card,
                    shadowColor: colors.shadow,
                },
            ]}>
                <Text style={{ ...styles.loadingText, color: colors.text }}>
                    No hay libros disponibles.
                </Text>
            </View>
        );
    }

    if (loading) {
        return (
            <View style={[
                styles.loadingContainer,
                {
                    backgroundColor: colors.card,
                    shadowColor: colors.shadow,
                },
            ]}>
                <FullScreenLoader />
                <Text style={{ ...styles.loadingText, color: colors.text }}>
                    Cargando libros...
                </Text>
            </View>
        );
    }

    if (books.length === 0) {
        return (
            <View style={[
                styles.loadingContainer,
                {
                    backgroundColor: colors.card,
                    shadowColor: colors.shadow,
                },
            ]}>
                <Text style={{ ...styles.loadingText, color: colors.text }}>
                    {friend.nickname} no tiene libros registrados.
                </Text>
            </View>
        );
    }

    return (
        <View style={[
            styles.container,
            {
                backgroundColor: colors.card,
                shadowColor: colors.shadow,
            },
        ]}>
            <Text style={{ ...styles.title, color: colors.text }}>Libros de {friend.nickname}</Text>
            <FlatList
                data={books}
                key={isLandscape ? 'h' : 'v'}
                renderItem={renderBook}
                horizontal
                showsHorizontalScrollIndicator={false}
            />
        </View>
    );
};


const styles = StyleSheet.create({
    loadingContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '95%',
        minHeight: 148,
        borderRadius: 16,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 4,
        alignSelf: 'center',
        padding: 12,
    },
    container: {
        width: '95%',
        height: 295,
        borderRadius: 16,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 4,
        alignSelf: 'center',
        padding: 4,
    },
    loadingText: {
        alignSelf: 'center',
        fontSize: 14,
        fontFamily: 'Roboto-Regular',
        textAlign: 'center',
    },
    title: {
        alignSelf: 'center',
        fontSize: 22,
        fontFamily: 'Roboto-Medium',
        marginVertical: 6,
    },
});
