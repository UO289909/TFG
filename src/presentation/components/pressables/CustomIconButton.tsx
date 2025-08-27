import { Pressable, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { IonIcon, IonIconNames } from '../icons';
import { globalColors } from '../../../config/app-theme';


interface Props {
    icon: IonIconNames;
    onPress: () => void;
    color?: string;
    colorPressed?: string;
    style?: StyleProp<ViewStyle>;
    disabled?: boolean;
}

export const CustomIconButton = ({ icon, onPress, color = globalColors.primary, colorPressed = globalColors.primaryDark,style, disabled }: Props) => (

    <Pressable
        onPress={onPress}
        disabled={disabled}
        style={({ pressed }) => [
            styles.button,
            {
                backgroundColor: disabled
                    ? globalColors.grey
                    : pressed
                        ? colorPressed
                        : color,
                elevation: pressed ? 4 : 8,
            },
            style,
        ]}
    >
        <IonIcon name={icon} color={globalColors.white} size={24}/>
    </Pressable>

);


const styles = StyleSheet.create({
    button: {
        borderRadius: 15,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        marginVertical: 8,
    },
});
