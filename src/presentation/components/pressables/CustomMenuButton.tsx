import { Pressable, StyleProp, StyleSheet, Text, ViewStyle } from 'react-native';
import { IonIcon, IonIconNames } from '../icons';
import { globalColors } from '../../../config/app-theme';


interface Props {
    onPress: () => void;
    label: string;
    icon: IonIconNames;
    style?: StyleProp<ViewStyle>;
    disabled?: boolean;
}

export const CustomMenuButton = ({ onPress, label, icon, style, disabled = false }: Props) => (

    <Pressable
        onPress={onPress}
        disabled={disabled}
        style={({ pressed }) => [
            styles.button,
            {
                backgroundColor: disabled
                    ? globalColors.grey
                    : pressed
                        ? globalColors.greyLight
                        : globalColors.background,
                borderColor: pressed
                    ? globalColors.primaryDark
                    : globalColors.primary,
                elevation: pressed ? 4 : 8,
            },
            style,
        ]}
    >
        {({ pressed }) => (
            <>
                <IonIcon
                    name={
                        pressed
                            ? `${icon.replace('-outline', '')}-outline` as IonIconNames
                            : icon
                    }
                    size={26}
                    color={
                        disabled
                            ? globalColors.grey
                            : pressed
                                ? globalColors.primaryDark
                                : globalColors.primary
                    }
                    style={styles.icon}
                />
                <Text style={styles.label}>{label}</Text>
            </>
        )}
    </Pressable>
);


const styles = StyleSheet.create({
    button: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: globalColors.primary,
        marginVertical: 5,
    },
    icon: {
        position: 'absolute',
        left: 12,
    },
    label: {
        flex: 1,
        fontSize: 18,
        fontFamily: 'Roboto-Medium',
        textAlign: 'center',
    },
});
