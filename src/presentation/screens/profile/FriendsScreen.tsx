/* eslint-disable react-hooks/exhaustive-deps */
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
import { User } from '../../../core/entities/user.entity';
import { getFriendsByRequests } from '../../../core/use-cases/user/get-friends-by-request.use-case';


export const FriendsScreen = () => {

    const { params } = useRoute<RouteProp<RootStackParams, 'Friends'>>();
    const { friendRequests } = params;

    const [friends, setFriends] = useState<User[]>([]);
    const [filteredFriends, setFilteredFriends] = useState<User[]>(friends);
    const [loading, setLoading] = useState(false);

    const [showNotif, setShowNotif] = useState(false);
    const [notifMsg, setNotifMsg] = useState('');

    useEffect(() => {
        fetchFriends();

        if (friends.length === 0) {
            setNotifMsg('Aun no tienes amigos agregados :(');
            setShowNotif(true);
        }
    }, []);

    useEffect(() => {
        setFilteredFriends(friends);
        console.log('Filtered friends on state:', filteredFriends);
    }, [friends]);

    const fetchFriends = async () => {

        setLoading(true);

        console.log('Fetching friends for requests:', friendRequests);
        const fetchedFriends = await getFriendsByRequests(3600, friendRequests);
        setFriends(fetchedFriends);
        console.log('Fetched friends on state:', fetchedFriends);

        setLoading(false);

    };

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

    const handleDeleteFriend = () => {

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
                            onButtonPress={handleDeleteFriend}
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
