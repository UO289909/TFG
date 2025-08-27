import { StyleSheet, View } from 'react-native';
import { CustomIconButton } from '../pressables/CustomIconButton';
import { CustomTextInput } from './CustomTextInput';
import { useState } from 'react';

interface Props {
    onSearch: (text: string) => void;
}

export const SearchBar = ({ onSearch }: Props) => {

    const [searchText, setSearchText] = useState('');

    return (
        <View style={styles.container}>

            <CustomTextInput
                style={styles.textInput}
                value={searchText}
                onChangeText={setSearchText}
                placeholder="Buscar por título o autor..."
                returnKeyType="search"
                onSubmitEditing={() => searchText.length > 0 ? onSearch(searchText) : null}
            />

            <CustomIconButton
                icon="close"
                onPress={() => setSearchText('')}
                style={styles.button}
                disabled={searchText.length === 0}
            />

            <CustomIconButton
                icon="search"
                onPress={() => onSearch(searchText)}
                style={styles.button}
                disabled={searchText.length === 0}
            />
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 10,
    },
    textInput: {
        flex: 1,
        marginVertical: 10,
        marginRight: 4,
    },
    button: {
        marginHorizontal: 4,
    },
});
