import { StyleSheet, Text, View } from 'react-native';
import { globalColors } from '../../../config/app-theme';
import { CustomIconButton } from '../pressables/CustomIconButton';

interface Props {
    type: 'received' | 'sent';
    nickname: string;
    name: string;
    onAccept: () => void;
    onDecline: () => void;
}

export const RequestCard = ({ type, nickname, name, onAccept, onDecline }: Props) => {

    return (
        <View style={styles.cardContainer} >

            <View style={styles.infoContainer}>
                <Text style={styles.nickname}>{nickname}</Text>
                <Text style={styles.name}>{name}</Text>
            </View>

            <CustomIconButton
                icon="close-outline"
                color={globalColors.danger}
                colorPressed={globalColors.dangerDark}
                onPress={onDecline}
                style={styles.declineButton}
            />

            {type === 'received' &&
                <CustomIconButton
                    icon="checkmark-outline"
                    color={globalColors.primary}
                    colorPressed={globalColors.primaryDark}
                    onPress={onAccept}
                    style={styles.acceptButton}
                />
            }

        </View>
    );
};


const styles = StyleSheet.create({
    cardContainer: {
        flexDirection: 'row',
        alignItems: 'center',
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
    infoContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
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
    acceptButton: {
        alignSelf: 'center',
        marginLeft: 8,
    },
    declineButton: {
        alignSelf: 'center',
    },
});
