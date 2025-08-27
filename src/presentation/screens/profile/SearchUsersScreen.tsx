import { ScrollView, StyleSheet, View } from 'react-native';
import { SearchBar } from '../../components/inputs';
import { globalStyles } from '../../../config/app-theme';
import { UserCard } from '../../components/profile/UserCard';
import { CustomNotification } from '../../components/feedback';
import { useState } from 'react';


export const SearchUsersScreen = () => {

    const [showNotif, setShowNotif] = useState(false);
    const [notifMsg, setNotifMsg] = useState('');

    return (
        <View style={styles.container}>

            {showNotif &&
                <CustomNotification
                    message={notifMsg}
                    position="bottom"
                    onClose={() => setShowNotif(false)}
                />
            }

            <SearchBar
                onSearch={() => {
                    setNotifMsg('Buscando usuarios...');
                    setShowNotif(true);
                }}
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
