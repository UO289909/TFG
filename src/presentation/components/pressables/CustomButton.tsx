import { Text, StyleSheet, Pressable, StyleProp, ViewStyle } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { CustomTheme } from '../../../config/app-theme';

interface Props {
    onPress: () => void;
    title: string;
    disabled?: boolean;
    style?: StyleProp<ViewStyle>;
}

export const CustomButton = ({ onPress, title, disabled = false, style }: Props) => {

    const { colors } = useTheme() as CustomTheme;

    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [
                styles.button,
                {
                    backgroundColor: disabled
                        ? colors.buttonDisabled
                        : pressed
                            ? colors.secondaryText
                            : colors.primary,
                    elevation: pressed ? 2 : 4,
                    shadowColor: colors.shadow,
                },
                style,
            ]}
            disabled={disabled}
        >
            <Text
                style={[
                    styles.text,
                    disabled && { color: colors.greyDark },
                ]}
            >
                {title}
            </Text>

        </Pressable>
    );
};

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 16,
        padding: 12,
        elevation: 2,
        marginTop: 10,
    },
    text: {
        fontSize: 16,
        fontFamily: 'Roboto-Bold',
        textAlign: 'center',
        color: 'white',
        flex: 1,
    },
});
