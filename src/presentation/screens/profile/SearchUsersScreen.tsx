import { ScrollView, StyleSheet, View } from 'react-native';
import { SearchBar } from '../../components/inputs';
import { globalStyles } from '../../../config/app-theme';
import { UserCard } from '../../components/profile/UserCard';


export const SearchUsersScreen = () => {


    return (
        <View style={styles.container}>

            <SearchBar
                onSearch={() => { }}
            />

            <View style={globalStyles.separator} />

            <ScrollView>

                <UserCard
                    nickname="daniirguez"
                    name="Daniel Rodríguez Pérez"
                    avatarUrl=""
                />

                <UserCard
                    nickname="dimenemene"
                    name="Diego Menendez"
                    avatarUrl="https://randomuser.me/api/portraits/men/2.jpg"
                />

                <UserCard
                    nickname="rosirodriguez"
                    name="Rosa Delia Rodríguez"
                    avatarUrl=""
                />

                <UserCard
                    nickname="ituya"
                    name="Iñigo Tuya Cordera"
                    avatarUrl=""
                />

                <UserCard
                    nickname="paquillo72"
                    name="Paco Quintana"
                    avatarUrl="http://randomuser.me/api/portraits/men/3.jpg"
                />

            </ScrollView>

        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
