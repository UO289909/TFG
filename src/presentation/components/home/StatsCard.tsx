import { Image, StyleSheet, Text, View } from 'react-native';
import { CustomTheme } from '../../../config/app-theme';
import { useTheme } from '@react-navigation/native';

interface Props {
    topLabel: string;
    bottomLabel?: string;
    value: number | string;
    type: 'small' | 'large';
    landscape?: boolean;
    cover_url?: string;
}

export const StatsCard = ({ topLabel, bottomLabel, value, type, landscape, cover_url }: Props) => {
    const default_cover = 'https://placehold.co/160x256.webp?text=No+Cover&font=roboto';

    const { colors } = useTheme() as CustomTheme;

    return (
        <View
            style={[
                styles.container,
                type === 'large'
                    ? landscape
                        ? styles.largeLandscape
                        : styles.large
                    : landscape
                        ? styles.smallLandscape
                        : styles.small,
                cover_url && styles.containerWithCover,
                {
                    backgroundColor: colors.card,
                    shadowColor: colors.shadow,
                },
            ]}
        >

            {cover_url &&
                <Image source={{ uri: cover_url || default_cover }} style={styles.coverImage} />
            }

            <View style={[
                cover_url ? styles.textContainerWithCover : styles.textContainer,
                landscape ? styles.textContainerWithCoverLandscape : {},
            ]}>
                <Text style={{
                    ...styles.text,
                    ...(cover_url && styles.textWithCover),
                    color: colors.secondaryText,
                }}>
                    {topLabel}
                </Text>
                <Text style={{
                    ...styles.value,
                    ...(cover_url && styles.valueWithCover),
                    color: colors.text,
                }}>
                    {value}
                </Text>
                {bottomLabel && (
                    <Text style={{
                        ...styles.text,
                        ...(cover_url && styles.textWithCover),
                        color: colors.secondaryText,
                    }}>
                        {bottomLabel}
                    </Text>
                )}
            </View>

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
    containerWithCover: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textContainerWithCover: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingLeft: 12,
    },
    textContainerWithCoverLandscape: {
        alignItems: 'center',
    },
    small: {
        width: '45%',
        aspectRatio: 1,
    },
    smallLandscape: {
        width: '45%',
        aspectRatio: 2.5,
    },
    large: {
        width: '95%',
        aspectRatio: 2.5,
    },
    largeLandscape: {
        width: '95%',
        aspectRatio: 5,
    },
    coverImage: {
        height: '95%',
        aspectRatio: 0.625,
        borderRadius: 10,
        alignSelf: 'flex-start',
        margin: 4,
    },
    text: {
        fontSize: 24,
        fontFamily: 'Roboto-Light',
        textAlign: 'center',
    },
    textWithCover: {
        fontSize: 16,
        textAlign: 'left',
    },
    value: {
        fontSize: 60,
        fontFamily: 'Roboto-Bold',
        textAlign: 'center',
    },
    valueWithCover: {
        fontSize: 32,
        textAlign: 'left',
    },
});
