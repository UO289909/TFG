import { FlatList, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { CompactBookCard } from '../books/CompactBookCard';
import { NavigationProp, useNavigation, useTheme } from '@react-navigation/native';
import { CustomTheme } from '../../../config/app-theme';
import { Book } from '../../../core/entities/book.entity';
import { FullScreenLoader } from '../feedback';
import { RootStackParams } from '../../navigation/HomeStackNavigator';
import { User } from '../../../core/entities/user.entity';

interface Props {
    recentReads: { user: User, book: Book }[];
    loading: boolean;
    error?: boolean;
}

export const RecentReadsBox = ({ recentReads, loading, error }: Props) => {

    const navigation = useNavigation<NavigationProp<RootStackParams>>();

    const { colors } = useTheme() as CustomTheme;

    const { width, height } = useWindowDimensions();
    const isLandscape = width > height;

    const handleGoToReadInfo = (book: Book, user: User) => {
        navigation.navigate('ReadDetails', { book, user, userPressable: true });
    };

    const renderReadInfo = ({ item }: { item: { user: User, book: Book } }) => (
        <CompactBookCard
            title={item.book.title}
            cover_url={item.book.cover_url}
            rating={item.book.rating}
            nickname={item.user.nickname}
            onPress={() => handleGoToReadInfo(item.book, item.user)}
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
                    No hay lecturas recientes de amigos disponibles.
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
                    Cargando lecturas recientes de tus amigos...
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
            <Text style={{ ...styles.title, color: colors.text }}>Lecturas recientes de amigos</Text>
            <FlatList
                data={recentReads}
                key={isLandscape ? 'h' : 'v'}
                renderItem={renderReadInfo}
                horizontal
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
        margin: 10,
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
        margin: 10,
        padding: 4,
    },
    loadingText: {
        alignSelf: 'center',
        fontSize: 14,
        fontFamily: 'Roboto-Regular',
    },
    title: {
        alignSelf: 'center',
        fontSize: 22,
        fontFamily: 'Roboto-Medium',
        marginVertical: 6,
    },
});
