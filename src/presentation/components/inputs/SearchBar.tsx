import { Keyboard, StyleSheet, View } from 'react-native';
import { CustomIconButton } from '../pressables/CustomIconButton';
import { CustomTextInput } from './CustomTextInput';
import { useState } from 'react';

interface Props {
    onSearch: (text: string) => void;
    placeholder?: string;
    numeric?: boolean;
    disabled?: boolean;
}

export const SearchBar = ({ onSearch, disabled, placeholder, numeric }: Props) => {

    const [searchText, setSearchText] = useState('');

    const handleSearch = () => {
        onSearch(searchText);
        Keyboard.dismiss();
    };

    const handleClear = () => {
        setSearchText('');
        onSearch('');
        Keyboard.dismiss();
    };

    return (
        <View style={styles.container}>

            <CustomTextInput
                style={styles.textInput}
                value={searchText}
                onChangeText={numeric ? text => setSearchText(text.replace(/[^0-9]/g, '')) : setSearchText}
                placeholder={placeholder}
                keyboardType={numeric ? 'numeric' : 'default'}
                returnKeyType="search"
                onSubmitEditing={() => searchText.length > 0 ? handleSearch() : null}
                editable={!disabled}
            />

            <CustomIconButton
                icon="close"
                onPress={handleClear}
                style={styles.button}
                disabled={searchText.length === 0 || disabled}
            />

            <CustomIconButton
                icon="search"
                onPress={handleSearch}
                style={styles.button}
                disabled={searchText.length === 0 || disabled}
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
