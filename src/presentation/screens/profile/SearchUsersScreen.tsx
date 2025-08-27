import { ScrollView, StyleSheet, View } from 'react-native';
import { SearchBar } from '../../components/inputs';
import { globalColors, globalStyles } from '../../../config/app-theme';
import { UserCard } from '../../components/profile/UserCard';
import { CustomNotification, FullScreenLoader } from '../../components/feedback';
import { useState } from 'react';
import { User } from '../../../core/entities/user.entity';
import { searchUsersByNickname } from '../../../core/use-cases/user/search-users-by-nickname.use-case';
import { normalizeText } from '../../../utils/normalizeText';
import { IonIcon } from '../../components/icons';


export const SearchUsersScreen = () => {

    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);

    const [showNotif, setShowNotif] = useState(false);
    const [notifMsg, setNotifMsg] = useState('');

    const handleSearch = async (text: string) => {

        setLoading(true);

        try {

            if (!text.trim()) {
                setUsers([]);
                return;
            }

            const found = await searchUsersByNickname(normalizeText(text));

            if (found.length === 0) {
                setNotifMsg('No se encontraron usuarios');
                setShowNotif(true);
            } else {
                setUsers(found);
            }

        } finally {
            setLoading(false);
        }

    };

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
                onSearch={handleSearch}
                disabled={loading}
            />

            <View style={globalStyles.separator} />

            {loading &&
                <FullScreenLoader />
            }

            {!loading && users.length === 0 &&
                <IonIcon
                    name="person"
                    size={200}
                    color={globalColors.greyLight}
                    style={styles.bigIcon}
                />
            }

            {!loading && users.length !== 0 &&
                <ScrollView>

                    {users.map((user) => (
                        <UserCard
                            key={user.id}
                            nickname={user.nickname}
                            name={user.full_name}
                            avatarUrl={user.avatarUrl}
                        />
                    ))}

                </ScrollView>
            }

        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    bigIcon: {
        flex: 1,
        alignSelf: 'center',
        marginTop: 50,
    },
});
