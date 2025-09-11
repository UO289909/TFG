import { Text, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { CustomTheme } from '../../../config/app-theme';

interface Props {
    onPress: () => void;
    title: string;
}

export const CustomButton = ({ onPress, title }: Props) => {

    const { colors } = useTheme() as CustomTheme;

    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [
                styles.button,
                {
                    backgroundColor: pressed
                        ? colors.cardPressed
                        : colors.card,
                    elevation: pressed ? 2 : 4,
                    shadowColor: colors.shadow,
                },
            ]}
        >
            <Text style={{ ...styles.text, color: colors.text }}>{title}</Text>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 8,
        padding: 12,
        elevation: 2,
        marginTop: 16,
    },
    text: {
        fontSize: 16,
        fontFamily: 'Roboto-Bold',
        textAlign: 'center',
        flex: 1,
    },
});
