import { useTheme } from '@react-navigation/native';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { CustomTheme } from '../../../config/app-theme';
import { IonIcon } from '../icons';

interface Props {
    friends: number;
    books: number;
    loading: boolean;
}

export const FriendNumbers = ({ friends, books, loading }: Props) => {

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
                        loading
                            ? <ActivityIndicator size="small" color={colors.primary} />
                            : <Text style={[styles.number, { color: colors.text }]}>{friends}</Text>
                    }
                    <Text style={[styles.label, { color: colors.greyDark }]}>Amigos</Text>
                </View>
            </View>

            <View style={[styles.separator, { backgroundColor: colors.border }]} />

            <View style={styles.section}>
                <IonIcon name="book" size={30} color={colors.primary} />
                <View style={[styles.info, { marginLeft: 15 }]}>
                    {
                        loading
                            ? <ActivityIndicator size="small" color={colors.primary} />
                            : <Text style={[styles.number, { color: colors.text }]}>{books}</Text>
                    }
                    <Text style={[styles.label, { color: colors.greyDark }]}>Libros</Text>
                </View>
            </View>

        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        width: '95%',
        alignSelf: 'center',
        paddingVertical: 15,
        borderRadius: 15,
        alignItems: 'center',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 2,
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