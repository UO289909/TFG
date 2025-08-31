import { View, Image, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { globalColors } from '../../../config/app-theme';
import { FullScreenLoader } from '../feedback';

interface Props {
    nickname: string;
    avatarUrl: string | null;
    name: string;
    style?: StyleProp<ViewStyle>;
    loadingAvatar?: boolean;
    landscape?: boolean;
}

export const ProfileInfoHeader = ({ nickname, avatarUrl, name, style, loadingAvatar = false, landscape = false }: Props) => {
    const default_avatar = 'https://placehold.co/150x150.webp?text=No+Avatar&font=robot';

    return (
        <View style={[styles.container, landscape && styles.containerLandscape, style]}>
            {loadingAvatar &&
                <FullScreenLoader style={styles.loader} />
            }

            {!loadingAvatar &&
                <Image
                    source={{ uri: avatarUrl || default_avatar }}
                    style={styles.avatar}
                />
            }

            <View style={[styles.infoContainer, landscape && styles.infoContainerLandscape]}>
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
    containerLandscape: {
        flexDirection: 'column',
        alignItems: 'center',
        marginLeft: 24,
        marginRight: 18,
    },
    loader: {
        height: 150,
        maxWidth: 150,
        borderRadius: 15,
        borderWidth: 2,
        borderColor: globalColors.primary,
        marginRight: 12,
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
    infoContainerLandscape: {
        marginTop: 10,
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
