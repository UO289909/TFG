import { StyleSheet, Text, View } from 'react-native';
import { CompactBookCard } from '../books/CompactBookCard';
import { useTheme } from '@react-navigation/native';
import { CustomTheme } from '../../../config/app-theme';


export const FriendBooks = () => {

    const { colors } = useTheme() as CustomTheme;

    return (
        <View style={styles.container}>

            <Text style={{ ...styles.title, color: colors.text }}>Tus amigos han leido recientemente...</Text>

            <CompactBookCard
                cover_url="https://placehold.co/160x256.webp?text=Test+cover&font=roboto"
                rating={4}
                nickname="Nickname"
                onPress={() => {}}
            />
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        padding: 16,
    },
    title: {
        fontSize: 20,
        fontFamily: 'Roboto-Bold',
    },
});
