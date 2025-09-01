import { StyleSheet, Text, View } from 'react-native';
import { globalColors } from '../../../config/app-theme';

interface Props {
    topLabel: string;
    bottomLabel?: string;
    value: number;
    type: 'small' | 'large';
}

export const BookStatsCard = ({ topLabel, bottomLabel, value, type }: Props) => {

    return (
        <View style={[
            styles.container,
            type === 'small' ? styles.small : styles.large,
            ]}>

            <Text style={styles.text}>{topLabel}</Text>
            <Text style={styles.number}>{value}</Text>
            {bottomLabel && <Text style={styles.text}>{bottomLabel}</Text>}

        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        padding: 12,
        borderRadius: 16,
        backgroundColor: globalColors.background,
        justifyContent: 'space-between',
        shadowColor: globalColors.black,
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
        color: globalColors.primaryDark,
    },
    number: {
        fontSize: 60,
        fontFamily: 'Roboto-Bold',
        textAlign: 'center',
    },
});
