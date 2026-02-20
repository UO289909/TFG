import { useTheme } from '@react-navigation/native';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { CustomTheme } from '../../../config/app-theme';
import { IonIcon } from '../icons';

interface Props {
    friends: number;
    books: number;
    loadingFriends: boolean;
    loadingBooks: boolean;
}

export const FriendNumbers = ({ friends, books, loadingFriends, loadingBooks }: Props) => {

    const { colors } = useTheme() as CustomTheme;

    return (
        <View style={[
            styles.container,
            {
                backgroundColor: colors.card,
                shadowColor: colors.shadow,
            },
        ]}>

            <View style={styles.section}>
                <IonIcon name="person" size={30} color={colors.primary} />
                <View style={[styles.info, { marginLeft: 15 }]}>
                    {
                        loadingFriends
                            ? <ActivityIndicator size="small" color={colors.primary} />
                            : <Text style={[styles.number, { color: colors.text }]}>{friends}</Text>
                    }
                    <Text style={[styles.label, { color: colors.greyDark }]}>{friends === 1 ? 'Amigo' : 'Amigos'}</Text>
                </View>
            </View>

            <View style={[styles.separator, { backgroundColor: colors.border }]} />

            <View style={styles.section}>
                <IonIcon name="book" size={30} color={colors.primary} />
                <View style={[styles.info, { marginLeft: 15 }]}>
                    {
                        loadingBooks
                            ? <ActivityIndicator size="small" color={colors.primary} />
                            : <Text style={[styles.number, { color: colors.text }]}>{books}</Text>
                    }
                    <Text style={[styles.label, { color: colors.greyDark }]}>{books === 1 ? 'Libro' : 'Libros'}</Text>
                </View>
            </View>

        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        width: '100%',
        alignSelf: 'center',
        paddingVertical: 15,
        borderRadius: 16,
        alignItems: 'center',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 4,
        marginBottom: 10,
        position: 'relative',
    },
    section: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
    },
    info: {
        alignItems: 'flex-start',
    },
    number: {
        fontSize: 22,
        fontFamily: 'Roboto-Bold',
        fontWeight: 'bold',
    },
    label: {
        fontSize: 14,
        fontFamily: 'Roboto-Medium',
    },
    separator: {
        width: 1,
        height: '80%',
        position: 'absolute',
        left: '50%',
    }
});