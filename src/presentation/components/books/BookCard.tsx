import { View, Text, Pressable, StyleSheet, Image } from 'react-native';

interface Props {
    title: string;
    author: string;
    imageUrl: string;
}

export const BookCard = ({ title, author, imageUrl }: Props) => {

    return (
        <Pressable style={styles.cardContainer}>
            <Image
                style={styles.image}
                source={{ uri: imageUrl }}
                resizeMode="cover"
            />
            <View style={styles.dataContainer}>
                <Text style={styles.titleText}>{ title }</Text>
                <Text style={styles.authorText}>{ author }</Text>
            </View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
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
    dataContainer: {
        flex: 1,
        justifyContent: 'flex-start',
    },
    titleText: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    authorText: {
        fontSize: 16,
        fontWeight: 'bold',
        fontStyle: 'italic',
        color: '#333',
    },
});
