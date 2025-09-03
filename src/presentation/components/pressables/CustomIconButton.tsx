import { Pressable, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { IonIcon, IonIconNames } from '../icons';
import { CustomTheme } from '../../../config/app-theme';
import { useTheme } from '@react-navigation/native';


interface Props {
    icon: IonIconNames;
    onPress: () => void;
    color?: string;
    colorPressed?: string;
    style?: StyleProp<ViewStyle>;
    disabled?: boolean;
}

export const CustomIconButton = ({ icon, onPress, color, colorPressed, style, disabled }: Props) => {

    const { colors } = useTheme() as CustomTheme;

    return (

        <Pressable
            onPress={onPress}
            disabled={disabled}
            style={({ pressed }) => [
                styles.button,
                {
                    backgroundColor: disabled
                        ? colors.buttonDisabled
                        : pressed
                            ? colorPressed || colors.primaryDark
                            : color || colors.primary,
                    elevation: pressed ? 4 : 8,
                    shadowColor: colors.shadow,
                },
                style,
            ]}
        >
            <IonIcon name={icon} color={'white'} size={24} />
        </Pressable>

    );

};


const styles = StyleSheet.create({
    button: {
        borderRadius: 15,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        marginVertical: 8,
    },
});
