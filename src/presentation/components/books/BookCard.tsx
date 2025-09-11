import { View, Text, Pressable, StyleSheet, Image, StyleProp } from 'react-native';
import { FiveStarsInput } from '../inputs/FiveStarsInput';
import { CustomTheme } from '../../../config/app-theme';
import { useTheme } from '@react-navigation/native';

interface Props {
    title: string;
    author: string | null;
    pages: string | null;
    rating: 1 | 2 | 3 | 4 | 5 | null;
    imageUrl: string | null;
    onPress: () => void;
    style?: StyleProp<any>;
}

export const BookCard = ({ title, author, pages, rating, imageUrl, onPress, style }: Props) => {
    const default_cover = `https://placehold.co/160x256.webp?text=${title}&font=roboto`;

    const { colors } = useTheme() as CustomTheme;

    return (
        <Pressable
            style={({pressed}) => [
                styles.cardContainer,
                {
                    backgroundColor: pressed ? colors.cardPressed : colors.card,
                    elevation: pressed ? 2 : 4,
                    shadowColor: colors.shadow,
                },
                style,
            ]}
            onPress={onPress}
        >
            <Image
                style={{...styles.image, backgroundColor: colors.background}}
                source={{ uri: imageUrl || default_cover }}
                resizeMode="cover"
            />
            <View style={styles.dataContainer}>
                <View style={styles.infoContainer}>
                    <Text style={{...styles.titleText, color: colors.text}}>{title}</Text>
                    <Text style={{...styles.authorText, color: colors.secondaryText}}>{author}</Text>
                    <Text style={{...styles.pagesText, color: colors.text}}>{pages} páginas</Text>
                </View>
                <View style={styles.ratingContainer}>
                    {rating
                        ? <FiveStarsInput value={rating} editable={false} size="small" onPress={() => { }} />
                        : <Text style={{...styles.ratingText, color: colors.text}}>Lectura en curso</Text>
                    }
                </View>
            </View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        width: '95%',
        minHeight: 148,
        borderRadius: 16,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        alignSelf: 'center',
        marginTop: 10,
        padding: 12,
    },
    image: {
        width: 80,
        height: 128,
        borderRadius: 10,
        marginRight: 16,
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
    pagesText: {
        fontSize: 14,
        fontFamily: 'Roboto-Thin',
        marginBottom: 10,
    },
    ratingText: {
        fontSize: 14,
        fontFamily: 'Roboto-Italic',
    },
    infoContainer: {
        flex: 1,
    },
    ratingContainer: {
        marginBottom: 0,
        alignItems: 'flex-end',
    },
});
