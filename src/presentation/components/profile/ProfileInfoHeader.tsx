import { View, Image, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { CustomTheme } from '../../../config/app-theme';
import { FullScreenLoader } from '../feedback';
import { useTheme } from '@react-navigation/native';

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

    const { colors } = useTheme() as CustomTheme;

    return (
        <View style={[
            styles.container,
            landscape && styles.containerLandscape,
            {
                shadowColor: colors.shadow,
                backgroundColor: colors.card,
            },
            style]}>

            {loadingAvatar &&
                <View style={{
                    ...styles.avatarContainer,
                    backgroundColor: colors.cardPressed,
                    borderColor: colors.cardPressed,
                }}>
                    <FullScreenLoader />
                </View>
            }

            {!loadingAvatar &&
                <View style={{
                    ...styles.avatarContainer,
                    backgroundColor: colors.cardPressed,
                    borderColor: colors.cardPressed,
                }}>
                    <Image
                        source={{ uri: avatarUrl || default_avatar }}
                        style={{
                            ...styles.avatar,
                            backgroundColor: colors.cardPressed,
                            borderColor: colors.cardPressed,
                        }}
                    />
                </View>
            }

            <View style={[styles.infoContainer, landscape && styles.infoContainerLandscape]}>
                <Text style={{...styles.nickname, color: colors.text}}>{nickname}</Text>
                <Text style={{...styles.name, color: colors.secondaryText}}>{name}</Text>
            </View>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '95%',
        borderRadius: 16,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        alignSelf: 'center',
        marginTop: 10,
        elevation: 4,
        padding: 10,
        marginBottom: 20,
    },
    containerLandscape: {
        flexDirection: 'column',
        alignItems: 'center',
        width: '20%',
        height: '95%',
        borderRadius: 16,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        alignSelf: 'center',
        marginTop: 10,
        elevation: 4,
        paddingLeft: 20,
        marginLeft: 34,
        marginRight: 18,
    },
    avatarContainer: {
        width: 150,
        height: 150,
        borderRadius: 16,
        borderWidth: 1,
        marginRight: 10,
    },
    avatar: {
        width: '100%',
        height: '100%',
        borderRadius: 16,
    },
    infoContainer: {
        flex: 1,
    },
    infoContainerLandscape: {
        marginTop: 5,
        alignSelf: 'flex-start',
    },
    nickname: {
        fontSize: 20,
        fontFamily: 'Roboto-Bold',
    },
    name: {
        fontSize: 16,
        fontFamily: 'Roboto-Italic',
    },
});
