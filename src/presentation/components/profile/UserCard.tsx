import { Image, StyleSheet, Text, View } from 'react-native';
import { globalColors } from '../../../config/app-theme';
import { CustomIconButton } from '../pressables/CustomIconButton';

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


    return (
        <View style={styles.cardContainer}>

            <Image
                source={{ uri: avatarUrl || default_avatar }}
                style={styles.avatar}
            />

            <View style={styles.infoContainer}>
                <Text style={styles.nickname}>{nickname}</Text>
                <Text style={styles.name}>{name}</Text>
                <Text style={styles.alreadyFriend}>{
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
                    color={globalColors.danger}
                    colorPressed={globalColors.dangerDark}
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
                        ? globalColors.primary
                        : globalColors.danger
                }
                colorPressed={
                    type === 'user' || type === 'requestReceived'
                        ? globalColors.primaryDark
                        : globalColors.dangerDark
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
        backgroundColor: globalColors.white,
        elevation: 2,
        padding: 12,
        marginVertical: 10,
        shadowColor: globalColors.black,
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
        alignSelf: 'center',
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
    alreadyFriend: {
        fontSize: 16,
        fontFamily: 'Roboto-Light',
        color: globalColors.black,
        marginTop: 6,
    },
    button: {
        alignSelf: 'center',
        marginLeft: 8,
    },
});
