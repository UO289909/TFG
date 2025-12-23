import { View, Text, StyleSheet, FlatList, useWindowDimensions } from 'react-native';
import { FullScreenLoader } from '../feedback';
import { useTheme } from '@react-navigation/native';
import { CustomTheme } from '../../../config/app-theme';
import { Recommendation } from '../../../core/entities/recommendation.entity';
import { RecommendationCard } from '.';

interface Props {
    recommendations: Recommendation[];
    loading: boolean;
    error?: 'noUserBooks' | 'errorAskingAI';
}

export const RecommendationBox = ({ recommendations, loading, error }: Props) => {

    const { colors } = useTheme() as CustomTheme;

    const { width, height } = useWindowDimensions();
    const isLandscape = width > height;

    const renderRecommendationCard = ({ item }: { item: Recommendation }) => (
        <RecommendationCard
            recommendation={item}
        />
    );

    if (error) {
        return (
            <View style={[
                styles.loadingContainer,
                {
                    backgroundColor: colors.card,
                    shadowColor: colors.shadow,
                },
            ]}>
                <Text style={{ ...styles.loadingText, color: colors.text }}>
                    {error === 'noUserBooks'
                        ? 'No puedes pedir recomendaciones sin haber leído ningún libro.'
                        : 'Ha ocurrido un error al pedir recomendaciones a la IA. Inténtalo de nuevo más tarde.'}
                </Text>
            </View>
        );
    }

    if (loading) {
        return (
            <View style={[
                styles.loadingContainer,
                {
                    backgroundColor: colors.card,
                    shadowColor: colors.shadow,
                },
            ]}>
                <FullScreenLoader />
                <Text style={{ ...styles.loadingText, color: colors.text }}>
                    Preguntando a la IA (puede tardar un poco)...
                </Text>
            </View>
        );
    }

    return (
        <View style={[
            styles.container,
            {
                backgroundColor: colors.card,
                shadowColor: colors.shadow,
            },
        ]}>
            <Text style={{ ...styles.title, color: colors.text }}>Recomendaciones</Text>
            <FlatList
                data={recommendations}
                key={isLandscape ? 'h' : 'v'}
                renderItem={renderRecommendationCard}
                horizontal
            />
        </View>
    );
};


const styles = StyleSheet.create({
    loadingContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        width: '95%',
        minHeight: 148,
        borderRadius: 16,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 4,
        alignSelf: 'center',
        marginTop: 10,
        padding: 12,
    },
    container: {
        height: 200,
        borderRadius: 16,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 4,
        alignSelf: 'center',
        margin: 10,
        padding: 4,
        marginRight: 16,
    },
    loadingText: {
        alignSelf: 'center',
        fontSize: 14,
        fontFamily: 'Roboto-Regular',
    },
    title: {
        alignSelf: 'center',
        fontSize: 22,
        fontFamily: 'Roboto-Medium',
        marginVertical: 6,
    },
});
