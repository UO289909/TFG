import { useTheme } from '@react-navigation/native';
import { Image, Pressable, StyleProp, StyleSheet, Text, View } from 'react-native';
import { CustomTheme } from '../../../config/app-theme';
import { FiveStarsInput } from '../inputs';


interface Props {
    title: string;
    cover_url: string | null;
    rating: 1 | 2 | 3 | 4 | 5 | null;
    pages: string | null;
    current_page: string | null;
    onPress: () => void;
    style?: StyleProp<any>;
}

export const FriendBookCard = ({ title, cover_url, rating, pages, current_page, onPress, style }: Props) => {
    const default_cover = `https://placehold.co/160x256.webp?text=${title}&font=roboto`;

    const { colors } = useTheme() as CustomTheme;


    return (
        <Pressable
            style={({ pressed }) => [
                styles.cardContainer,
                {
                    backgroundColor: pressed ? colors.card : colors.cardPressed,
                    elevation: pressed ? 2 : 4,
                    shadowColor: colors.shadow,
                },
                style,
            ]}
            onPress={onPress}
        >
            <Image
                style={{ ...styles.cover, backgroundColor: colors.background, shadowColor: colors.shadow }}
                source={{ uri: cover_url || default_cover }}
            />

            <View style={styles.infoContainer}>
                <Text
                    style={{ ...styles.title, color: colors.text }}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                >
                    {title}
                </Text>
                {rating !== null
                    ? <FiveStarsInput
                        onPress={() => { }}
                        editable={false}
                        value={rating}
                        size="tiny"
                    />
                    : <Text style={{ ...styles.text, color: colors.text }}>
                        {`${current_page} / ${pages}`}
                    </Text>
                }
            </View>

        </Pressable>
    );
};


const styles = StyleSheet.create({
    cardContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '95%',
        aspectRatio: 0.520,
        borderRadius: 16,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        alignSelf: 'center',
        margin: 5,
        marginVertical: 10,
        padding: 5,
        paddingBottom: 10,
    },
    cover: {
        width: '95%',
        aspectRatio: 0.625,
        borderRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 4,
        marginBottom: 4,
    },
    infoContainer: {
        flex: 1,
        justifyContent: 'space-between',
    },
    title: {
        fontSize: 16,
        fontFamily: 'Roboto-Regular',
        textAlign: 'center',

    },
    text: {
        fontSize: 14,
        fontFamily: 'Roboto-Italic',
        textAlign: 'center',
    },
});
