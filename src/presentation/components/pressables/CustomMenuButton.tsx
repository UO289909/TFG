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
                elevation: pressed ? 2 : 4,
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
                            ? globalColors.greyDark
                            : pressed
                                ? globalColors.primaryDark
                                : globalColors.primary
                    }
                    style={styles.icon}
                />
                <Text style={[
                    styles.label,
                    {
                        color: disabled
                            ? globalColors.greyDark
                            : pressed
                                ? globalColors.primaryDark
                                : globalColors.primary,
                    },
                ]}
                >
                    {label}
                </Text>
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
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
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
