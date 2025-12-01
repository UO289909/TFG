import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { CustomTheme } from '../../../config/app-theme';
import { FullScreenLoader } from '../feedback';

interface Props {
    pagesRanking: { nickname: string, pages: number }[];
    loading: boolean;
    error?: boolean;
}

export const PagesReadRanking = ({ pagesRanking, loading, error }: Props) => {

    const { colors } = useTheme() as CustomTheme;


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
                    key={item.nickname + index}
                    style={{ ...styles.rowContainer, backgroundColor: colors.background, shadowColor: colors.shadow }}
                >
                    <Text
                        style={{
                            ...(item.nickname === 'Tú' ? styles.user : styles.nickname),
                            color: colors.text,
                        }}
                    >
                        {index + 1}. {item.nickname}
                    </Text>
                    <Text style={{ ...styles.pages, color: colors.secondaryText }}>
                        {item.pages} pág.
                    </Text>
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
        marginTop: 10,
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
        margin: 10,
        padding: 4,
        paddingBottom: 12,
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 50,
        width: '95%',
        marginVertical: 4,
        paddingHorizontal: 12,
        borderRadius: 12,
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
    nickname: {
        fontSize: 16,
        fontFamily: 'Roboto-Medium',
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
