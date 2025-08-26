import { View, Image, Text, StyleSheet } from 'react-native';
import { globalColors } from '../../../config/app-theme';

interface Props {
    nickname: string;
    avatarUrl: string | null;
    name: string;
}

export const ProfileInfoHeader = ({ nickname, avatarUrl, name }: Props) => {
    const default_avatar = 'https://placehold.co/80x80.png?text=No+Avatar';

    return (
        <View style={styles.container}>
            <Image
                source={{ uri: avatarUrl || default_avatar }}
                style={styles.avatar}
            />
            <View style={styles.infoContainer}>
                <Text style={styles.nickname}>{nickname}</Text>
                <Text style={styles.name}>{name}</Text>
            </View>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    avatar: {
        width: 150,
        height: 150,
        borderRadius: 15,
        borderWidth: 2,
        borderColor: globalColors.primary,
        marginRight: 12,
    },
    infoContainer: {
        flex: 1,
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
});
