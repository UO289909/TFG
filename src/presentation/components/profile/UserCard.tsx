import { Image, StyleSheet, Text, View } from 'react-native';
import { globalColors } from '../../../config/app-theme';
import { CustomIconButton } from '../pressables/CustomIconButton';

interface Props {
    nickname: string;
    avatarUrl: string | null;
    name: string;
}

export const UserCard = ({ nickname, avatarUrl, name }: Props) => {
    const default_avatar = 'https://placehold.co/80x80.png?text=No+Avatar';


    return (
        <View style={styles.cardContainer}>

            <Image
                source={{ uri: avatarUrl || default_avatar }}
                style={styles.avatar}
            />

            <View style={styles.infoContainer}>
                <Text style={styles.nickname}>{nickname}</Text>
                <Text style={styles.name}>{name}</Text>
            </View>

            <CustomIconButton
                icon="person-add-outline"
                onPress={() => { }}
                style={styles.addButton}
            />

        </View>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        width: '95%',
        borderRadius: 16,
        backgroundColor: globalColors.white,
        elevation: 2,
        padding: 12,
        marginVertical: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        alignSelf: 'center',
    },
    avatar: {
        width: 70,
        height: 70,
        borderRadius: 15,
        borderWidth: 2,
        borderColor: globalColors.primary,
        marginRight: 12,
    },
    infoContainer: {
        flex: 1,
        flexDirection: 'column',
    },
    nickname: {
        fontSize: 20,
        fontFamily: 'Roboto-Bold',
    },
    name: {
        fontSize: 16,
        fontFamily: 'Roboto-Italic',
        color: globalColors.tertiary,
    },
    addButton: {
        alignSelf: 'center',
    },
});
