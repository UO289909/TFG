import { View, Text, Pressable, StyleSheet, Image } from 'react-native';

interface Props {
    isbn: string;
}

export const BookCard = ({ isbn }: Props) => {
    return (
        <Pressable style={styles.cardContainer}>
            <Image
                style={styles.image}
                source={{ uri: 'https://i.stack.imgur.com/l60Hf.png' }}
            />
            <View style={styles.textContainer}>
                <Text style={styles.isbnText}>ISBN: {isbn}</Text>
            </View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        width: '95%',
        height: 130,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 5,
        alignSelf: 'center',
        marginVertical: 10,
        padding: 12,
    },
    image: {
        width: 80,
        height: 110,
        borderRadius: 10,
        marginRight: 16,
        backgroundColor: '#eee',
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    isbnText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
});
