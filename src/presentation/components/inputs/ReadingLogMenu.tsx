import { View, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { NavigationProp, useNavigation, useTheme } from '@react-navigation/native';
import { CustomTheme } from '../../../config/app-theme';
import { CustomButton } from '../pressables';
import { CustomTextInput } from './CustomTextInput';
import { addReadingLog } from '../../../core/use-cases/books/add-reading-log.use-case';
import { RootStackParams } from '../../navigation/MyBooksStackNavigator';
import { Book } from '../../../core/entities/book.entity';

interface Props {
    book: Book;
    onClose: () => void;
}

export const ReadingLogMenu = ({ book, onClose }: Props) => {

    const navigation = useNavigation<NavigationProp<RootStackParams>>();

    const { colors } = useTheme() as CustomTheme;

    const [newPage, setNewPage] = useState(book.current_page);

    const scaleAnim = useRef(new Animated.Value(0.8)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }),
        ]).start();
    }, [scaleAnim, opacityAnim]);

    const handleAddLog = () => {

        if (Number(newPage) === Number(book.pages)) {
            navigation.navigate('RateBook', { book, rating: 0 });
            onClose();
            return;
        } else {
            addReadingLog(book.isbn, book.current_page!, newPage!);
            navigation.reset({
                index: 0,
                routes: [
                    { name: 'MyBooksList', params: { doRefetch: true } },
                ],
            });
        }
    };


    return (
        <View style={styles.overlay}>
            <TouchableOpacity style={styles.overlayBg} onPress={onClose} />
            <Animated.View
                style={[
                    styles.menuContainer,
                    {
                        backgroundColor: colors.card,
                        transform: [{ scale: scaleAnim }],
                        opacity: opacityAnim,
                    },
                ]}
            >

                <CustomTextInput
                    label="Hoy has leido hasta la página..."
                    style={styles.input}
                    info={`Ibas por la página ${book.current_page} de ${book.pages}`}
                    value={newPage!}
                    onChangeText={text => setNewPage(text.replace(/[^0-9]/g, ''))}
                    keyboardType="numeric"
                />

                <CustomButton
                    title="Añadir registro de lectura"
                    onPress={handleAddLog}
                    disabled={!newPage || Number(newPage) <= Number(book.current_page) || Number(newPage) > Number(book.pages)}
                />

            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    overlayBg: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.2)',
    },
    menuContainer: {
        borderRadius: 12,
        padding: 16,
        elevation: 10,
        width: 280,
        height: 180,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    input: {
        width: 240,
        marginVertical: 6,
    },
});
