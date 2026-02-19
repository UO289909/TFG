import { StyleSheet, Text, View } from 'react-native';
import { NavigationProp, useNavigation, useTheme } from '@react-navigation/native';
import { CustomTheme } from '../../../config/app-theme';
import { FullScreenLoader } from '../feedback';
import { User } from '../../../core/entities/user.entity';
import { MiniUserCard } from '../profile/MiniUserCard';
import { RootTabParams } from '../../navigation/BottomTabsNavigator';
import { RootStackParams } from '../../navigation/HomeStackNavigator';

interface Props {
    pagesRanking: { user: User, pages: number }[];
    loading: boolean;
    error?: boolean;
}

export const PagesReadRanking = ({ pagesRanking, loading, error }: Props) => {

    const bottomTabsNavigation = useNavigation<NavigationProp<RootTabParams>>();
    const navigation = useNavigation<NavigationProp<RootStackParams>>();

    const { colors } = useTheme() as CustomTheme;

    const handleGoToProfile = (user: User) => {
        if (user.nickname === 'Tú') {
            bottomTabsNavigation.navigate('Profile');
        } else {
            navigation.navigate('Friend', { friend: user, fromHome: true });
        }
    };

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
                    No se ha podido crear el ranking de páginas leídas.
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
                    Cargando páginas leídas por tus amigos...
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
            <Text style={{ ...styles.title, color: colors.text }}>Páginas leídas este mes</Text>

            {pagesRanking.map((item, index) => (
                <View
                    key={item.user.nickname + index}
                    style={styles.row}
                >
                    <View style={[
                        styles.positionContainer,
                        { backgroundColor: index === 0 ? '#FFD700' : index == 1 ? '#C0C0C0' : index == 2 ? '#CD7F32' : colors.cardPressed },
                    ]}>
                        <Text
                            style={[
                                item.user.nickname === 'Tú' ? styles.user : styles.friend,
                                { color: colors.text },
                            ]}
                        >
                            {index + 1}
                        </Text>
                    </View>
                    <View
                        style={[
                            styles.rowContainer,
                            { backgroundColor: colors.background, shadowColor: colors.shadow },
                        ]}
                    >

                        <MiniUserCard
                            nickname={item.user.nickname}
                            avatarUrl={item.user.avatarUrl}
                            onPress={() => handleGoToProfile(item.user)}
                            style={({ pressed }) => ({ backgroundColor: pressed ? colors.cardPressed : colors.card })}
                        />

                        <Text style={[
                            styles.pages,
                            { color: colors.secondaryText },
                        ]}>
                            {item.pages} pág.
                        </Text>

                    </View>
                </View>
            ))}

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
        marginHorizontal: 10,
        padding: 12,
    },
    container: {
        width: '95%',
        height: 'auto',
        borderRadius: 16,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 4,
        alignSelf: 'center',
        alignItems: 'center',
        marginHorizontal: 10,
        padding: 4,
        paddingBottom: 12,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '95%',
        marginVertical: 4,
    },
    positionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: 30,
        height: 50,
        borderRadius: 14,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        backgroundColor: "#ccc",
        marginRight: 4,
    },
    rowContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 50,
        paddingLeft: 2,
        paddingRight: 12,
        borderRadius: 14,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
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
    friend: {
        fontSize: 16,
        fontFamily: 'Roboto-Regular',
    },
    user: {
        fontSize: 16,
        fontFamily: 'Roboto-Bold',
    },
    pages: {
        fontSize: 18,
        fontFamily: 'Roboto-Regular',
    },
});
