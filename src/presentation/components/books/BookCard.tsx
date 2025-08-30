import { View, Text, Pressable, StyleSheet, Image } from 'react-native';
import { FiveStarsInput } from '../inputs/FiveStarsInput';
import { globalColors } from '../../../config/app-theme';

interface Props {
    title: string;
    author: string | null;
    pages: string | null;
    rating: 1 | 2 | 3 | 4 | 5 | null;
    imageUrl: string | null;
    onPress: () => void;
}

export const BookCard = ({ title, author, pages, rating, imageUrl, onPress }: Props) => {
    const default_cover = 'https://placehold.co/160x256.webp?text=No+Cover&font=roboto';

    return (
        <Pressable
            style={({pressed}) => [
                styles.cardContainer,
                {
                    backgroundColor: pressed ? globalColors.greyLight : globalColors.white,
                    elevation: pressed ? 2 : 4,
                },
            ]}
            onPress={onPress}
        >
            <Image
                style={styles.image}
                source={{ uri: imageUrl || default_cover }}
                resizeMode="cover"
            />
            <View style={styles.dataContainer}>
                <View style={styles.infoContainer}>
                    <Text style={styles.titleText}>{title}</Text>
                    <Text style={styles.authorText}>{author}</Text>
                    <Text style={styles.pagesText}>{pages} páginas</Text>
                </View>
                <View style={styles.ratingContainer}>
                    {rating
                        ? <FiveStarsInput value={rating} editable={false} small onPress={() => { }} />
                        : <Text style={styles.ratingText}>Lectura en curso</Text>
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
        shadowColor: '#000',
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
        backgroundColor: '#eee',
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
        color: '#333',
    },
    pagesText: {
        fontSize: 14,
        fontFamily: 'Roboto-Light',
        color: '#333',
        marginBottom: 10,
    },
    ratingText: {
        fontSize: 14,
        fontFamily: 'Roboto-Italic',
        color: '#333',
    },
    infoContainer: {
        flex: 1,
    },
    ratingContainer: {
        marginBottom: 0,
        alignItems: 'flex-end',
    },
});
