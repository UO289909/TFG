import { StyleSheet, Text, View } from 'react-native';
import { CustomTheme } from '../../../config/app-theme';
import { useTheme } from '@react-navigation/native';

interface Props {
    topLabel: string;
    bottomLabel?: string;
    value: number;
    type: 'small' | 'large';
}

export const BookStatsCard = ({ topLabel, bottomLabel, value, type }: Props) => {

    const { colors } = useTheme() as CustomTheme;

    return (
        <View style={[
            styles.container,
            type === 'small' ? styles.small : styles.large,
            {
                backgroundColor: colors.card,
                shadowColor: colors.shadow,
            },
            ]}>

            <Text style={{...styles.text, color: colors.secondaryText}}>{topLabel}</Text>
            <Text style={{...styles.number, color: colors.text}}>{value}</Text>
            {bottomLabel && <Text style={{...styles.text, color: colors.secondaryText}}>{bottomLabel}</Text>}

        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        padding: 5,
        borderRadius: 16,
        justifyContent: 'space-between',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 4,
        marginTop: 10,
        marginHorizontal: 5,
    },
    small: {
        width: '45%',
        aspectRatio: 1,
    },
    large: {
        width: '95%',
        aspectRatio: 2,
    },
    text: {
        fontSize: 24,
        fontFamily: 'Roboto-Light',
        textAlign: 'center',
    },
    number: {
        fontSize: 60,
        fontFamily: 'Roboto-Bold',
        textAlign: 'center',
    },
});
