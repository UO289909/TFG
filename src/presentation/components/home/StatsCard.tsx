import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { CustomTheme } from '../../../config/app-theme';
import { useTheme } from '@react-navigation/native';

interface Props {
    topLabel: string;
    bottomLabel?: string;
    value: number | string;
    type: 'small' | 'large' | 'cover';
    landscape?: boolean;
    cover_url?: string;
    onPress?: () => void;
}

export const StatsCard = ({ topLabel, bottomLabel, value, type, landscape, cover_url, onPress }: Props) => {
    const default_cover = `https://placehold.co/160x256.webp?text=${value}&font=roboto`;

    const { colors } = useTheme() as CustomTheme;

    return (
        <Pressable
            style={({ pressed }) => [
                styles.container,
                type === 'large' || type === 'cover'
                    ? landscape
                        ? styles.largeLandscape
                        : styles.large
                    : landscape
                        ? styles.smallLandscape
                        : styles.small,
                type === 'cover' && styles.containerWithCover,
                {
                    backgroundColor: pressed && onPress ? colors.cardPressed : colors.card,
                    shadowColor: colors.shadow,
                },
            ]}
            onPress={onPress}
        >

            {type === 'cover' &&
                <Image source={{ uri: cover_url || default_cover }} style={{ ...styles.coverImage, shadowColor: colors.shadow }} />
            }

            <View style={[
                type === 'cover' ? styles.textContainerWithCover : styles.textContainer,
                landscape ? styles.textContainerWithCoverLandscape : {},
            ]}>
                <Text style={{
                    ...styles.text,
                    ...(type === 'cover' && styles.textWithCover),
                    color: colors.secondaryText,
                }}>
                    {topLabel}
                </Text>
                <Text style={{
                    ...styles.value,
                    ...(type === 'cover' && styles.valueWithCover),
                    color: colors.text,
                }}>
                    {value}
                </Text>
                {bottomLabel && (
                    <Text style={{
                        ...styles.text,
                        ...(type === 'cover' && styles.textWithCover),
                        color: colors.secondaryText,
                    }}>
                        {bottomLabel}
                    </Text>
                )}
            </View>

        </Pressable>
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
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 4,
    },
    text: {
        fontSize: 24,
        fontFamily: 'Roboto-Light',
        textAlign: 'center',
    },
    textWithCover: {
        fontSize: 18,
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
