import { Image, StyleSheet, Text, View } from 'react-native';
import { CustomTheme } from '../../../config/app-theme';
import { CustomIconButton } from '../pressables/CustomIconButton';
import { useTheme } from '@react-navigation/native';

interface Props {
    nickname: string;
    avatarUrl: string | null;
    name: string;
    type?: UserType;
    onRightButtonPress: () => void;
    onRejectRequest?: () => void;
}

export type UserType = 'user' | 'friend' | 'requestSent' | 'requestReceived';

export const UserCard = ({ nickname, avatarUrl, name, type = 'user', onRightButtonPress, onRejectRequest = () => { } }: Props) => {
    const default_avatar = 'https://placehold.co/100x100.webp?text=No+Avatar&font=roboto';

    const { colors } = useTheme() as CustomTheme;

    return (
        <View style={{
            ...styles.cardContainer,
            backgroundColor: colors.card,
            shadowColor: colors.shadow,
        }}>

            <Image
                source={{ uri: avatarUrl || default_avatar }}
                style={styles.avatar}
            />

            <View style={styles.infoContainer}>
                <Text style={{...styles.nickname, color: colors.text}}>{nickname}</Text>
                <Text style={{...styles.name, color: colors.secondaryText}}>{name}</Text>
                <Text style={{...styles.alreadyFriend, color: colors.text}}>{
                    type === 'friend'
                        ? '¡Ya es tu amigo!'
                        : type === 'requestSent'
                            ? 'Solicitud enviada'
                            : type === 'requestReceived'
                                ? 'Solicitud recibida'
                                : null
                }</Text>

            </View>

            {type === 'requestReceived' &&
                <CustomIconButton
                    icon="close"
                    color={colors.danger}
                    colorPressed={colors.dangerDark}
                    onPress={onRejectRequest}
                    style={styles.button}
                />
            }


            <CustomIconButton
                icon={
                    type === 'friend'
                        ? 'person-remove-outline'
                        : type === 'user'
                            ? 'person-add-outline'
                            : type === 'requestReceived'
                                ? 'checkmark-outline'
                                : 'close'
                }
                color={
                    type === 'user' || type === 'requestReceived'
                        ? colors.primary
                        : colors.danger
                }
                colorPressed={
                    type === 'user' || type === 'requestReceived'
                        ? colors.primaryDark
                        : colors.dangerDark
                }
                onPress={onRightButtonPress}
                style={styles.button}
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
        elevation: 2,
        padding: 12,
        marginTop: 10,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        alignSelf: 'center',
    },
    avatar: {
        width: 70,
        height: 70,
        borderRadius: 15,
        marginRight: 12,
        alignSelf: 'center',
        elevation: 2,
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
    },
    alreadyFriend: {
        fontSize: 16,
        fontFamily: 'Roboto-Thin',
        marginTop: 6,
    },
    button: {
        alignSelf: 'center',
        marginLeft: 8,
    },
});
