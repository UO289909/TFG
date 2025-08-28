import { ScrollView, StyleSheet, View } from 'react-native';
import { SearchBar } from '../../components/inputs';
import { globalColors, globalStyles } from '../../../config/app-theme';
import { CustomNotification, FullScreenLoader } from '../../components/feedback';
import { useEffect, useState } from 'react';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParams } from '../../navigation/ProfileStackNavigator';
import { IonIcon } from '../../components/icons';
import { UserCard } from '../../components/profile/UserCard';
import { normalizeText } from '../../../utils/normalizeText';


export const FriendsScreen = () => {

    // const navigation = useNavigation<NavigationProp<RootStackParams>>();
    const { params } = useRoute<RouteProp<RootStackParams, 'Friends'>>();
    const { friends } = params;

    const [filteredFriends, setFilteredFriends] = useState(friends);
    const [loading, setLoading] = useState(false);

    const [showNotif, setShowNotif] = useState(false);
    const [notifMsg, setNotifMsg] = useState('');

    useEffect(() => {
        setFilteredFriends(friends);
    }, [friends]);

    const handleFilterFriends = (text: string) => {

        setLoading(true);

        const search = normalizeText(text);

        if (!search) {
            setFilteredFriends(friends);
            setLoading(false);
            return;
        }

        const filtered = friends.filter(
            (friend) =>
                normalizeText(friend.nickname).includes(search) ||
                normalizeText(friend.full_name).includes(search)
        );

        if (filtered.length === 0) {
            setNotifMsg('No tienes amigos que coincidan con la busqueda :(');
            setShowNotif(true);
            setFilteredFriends(friends);
            setLoading(false);
            return;
        }

        setFilteredFriends(filtered);
        setLoading(false);
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
                onSearch={handleFilterFriends}
                placeholder="Buscar amigos por nickname..."
                disabled={loading}
            />

            <View style={globalStyles.separator} />

            {loading &&
                <FullScreenLoader />
            }

            {!loading && friends.length === 0 &&
                <IonIcon
                    name="people"
                    size={200}
                    color={globalColors.greyLight}
                    style={styles.bigIcon}
                />
            }

            {!loading && friends.length > 0 &&
                <ScrollView>

                    {filteredFriends.map((friend) => (
                        <UserCard
                            key={friend.id}
                            nickname={friend.nickname}
                            name={friend.full_name}
                            avatarUrl={friend.avatarUrl}
                            alreadyAdded={true}
                            onButtonPress={() => { }}
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
