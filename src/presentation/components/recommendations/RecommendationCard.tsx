import { View, Text, StyleSheet } from 'react-native';
import { CustomTheme } from '../../../config/app-theme';
import { useTheme } from '@react-navigation/native';
import { Recommendation } from '../../../core/entities/recommendation.entity';

interface Props {
    recommendation: Recommendation;
}

export const RecommendationCard = ({ recommendation }: Props) => {

    const { colors } = useTheme() as CustomTheme;

    return (
        <View
            style={[
                styles.cardContainer,
                {
                    backgroundColor: colors.cardPressed,
                    shadowColor: colors.shadow,
                },
            ]}
        >

            <View style={styles.dataContainer}>
                <View style={styles.infoContainer}>
                    <Text style={{ ...styles.titleText, color: colors.text }}>{recommendation.title}</Text>
                    <Text style={{ ...styles.authorText, color: colors.secondaryText }}>{recommendation.author}</Text>
                    <Text style={{ ...styles.whyText, color: colors.text }}>{recommendation.why}</Text>
                </View>
                <View style={styles.confidenceContainer}>
                    <Text style={{ ...styles.confidenceText, color: colors.text }}>
                        Coincidencia: {(recommendation.confidence * 100).toFixed(2)}%
                    </Text>
                </View>
            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        height: '95%',
        minWidth: 148,
        borderRadius: 16,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 2,
        alignSelf: 'center',
        marginHorizontal: 6,
        marginBottom: 6,
        padding: 12,
    },
    dataContainer: {
        flex: 1,
        justifyContent: 'space-between',
    },
    titleText: {
        fontSize: 22,
        fontFamily: 'Roboto-Medium',
        marginBottom: 8,
    },
    authorText: {
        fontSize: 16,
        fontFamily: 'Roboto-Regular',
    },
    whyText: {
        fontSize: 14,
        fontFamily: 'Roboto-Light',
        marginBottom: 10,
    },
    confidenceText: {
        fontSize: 14,
        fontFamily: 'Roboto-Italic',
    },
    infoContainer: {
        flex: 1,
    },
    confidenceContainer: {
        marginBottom: 0,
        alignItems: 'flex-end',
    },
});
