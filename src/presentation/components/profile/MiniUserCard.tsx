import { View, Text, Image, StyleSheet, StyleProp, ViewStyle, Pressable, PressableStateCallbackType } from 'react-native';
import { CustomTheme } from '../../../config/app-theme';
import { useTheme } from '@react-navigation/native';

interface Props {
    nickname: string;
    avatarUrl: string | null;
    onPress?: () => void;
    style?: StyleProp<ViewStyle> | ((state: PressableStateCallbackType) => StyleProp<ViewStyle>);
}

export const MiniUserCard = ({ nickname, avatarUrl, onPress, style }: Props) => {

    const { colors } = useTheme() as CustomTheme;

    const default_avatar = `https://placehold.co/32x32.webp?text=${nickname}&font=roboto`;

    return (
        <Pressable
            onPress={onPress}
            style={(state) => [
                styles.userContainer,
                {
                    backgroundColor: colors.card,
                    shadowColor: colors.shadow,
                },
                typeof style === 'function' ? style(state) : style,
            ]}
        >
            <Image source={{ uri: avatarUrl || default_avatar }} style={styles.avatar} />
            <Text style={{ ...styles.userName, color: colors.text }}>{nickname}</Text>
        </Pressable>
    )
}


const styles = StyleSheet.create({
    userContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 6,
        flexDirection: 'row',
        borderRadius: 14,
        alignSelf: 'center',
        elevation: 4,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    userName: {
        fontSize: 16,
        fontFamily: 'Roboto-Medium',
        marginLeft: 10,
    },
    avatar: {
        width: 32,
        height: 32,
        borderRadius: 10,
    },
})