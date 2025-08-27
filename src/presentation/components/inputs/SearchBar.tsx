import { StyleSheet, View } from 'react-native';
import { CustomIconButton } from '../pressables/CustomIconButton';
import { CustomTextInput } from './CustomTextInput';


export const SearchBar = () => {

    return (
        <View style={styles.container}>

            <CustomTextInput
                style={styles.textInput}
            />

            <CustomIconButton
                icon="close"
                onPress={() => { }}
                style={styles.button}
            />

            <CustomIconButton
                icon="search"
                onPress={() => { }}
                style={styles.button}
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
    },
    button: {
        marginHorizontal: 4,
    },
});
