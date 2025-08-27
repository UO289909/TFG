import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SearchBar } from '../../components/inputs';
import { globalStyles } from '../../../config/app-theme';


export const SearchUsersScreen = () => {


    return (
        <View style={styles.container}>

            <SearchBar
                onSearch={() => {}}
            />

            <View style={globalStyles.separator} />

            <ScrollView>
                <Text>Buscar usuarios</Text>
            </ScrollView>

        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
