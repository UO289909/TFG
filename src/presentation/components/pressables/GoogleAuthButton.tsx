import { Text, StyleSheet, Pressable } from 'react-native';
import { IonIcon } from '../icons';
import { useTheme } from '@react-navigation/native';
import { CustomTheme } from '../../../config/app-theme';

interface Props {
    onPress: () => void;
    type: 'signIn' | 'signUp';
}

export const GoogleAuthButton = ({ onPress, type }: Props) => {

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
            <IonIcon
                name="logo-google"
                size={24}
                color={colors.primary}
                style={styles.icon}
            />
            <Text style={{ ...styles.text, color: colors.text }}>
                {type === 'signIn' ? 'Iniciar sesión con Google' : 'Registrarse con Google'}
            </Text>

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
    icon: {
        position: 'absolute',
        marginRight: 8,
        left: 12,
    },
    text: {
        fontSize: 16,
        fontFamily: 'Roboto-Bold',
        textAlign: 'center',
        flex: 1,
    },
});
