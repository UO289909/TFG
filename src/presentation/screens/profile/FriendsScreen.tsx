/* eslint-disable react-hooks/exhaustive-deps */
import { ScrollView, StyleSheet, Text, View } from 'react-native';
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
import { deleteFriend } from '../../../core/use-cases/user/delete-friend.use-case';


export const FriendsScreen = () => {

    const { params } = useRoute<RouteProp<RootStackParams, 'Friends'>>();
    const { friendRequests, refetchFriendRequests } = params;

    const [friends, setFriends] = useState<User[]>([]);
    const [filteredFriends, setFilteredFriends] = useState<User[]>(friends);
    const [loading, setLoading] = useState(false);

    const [showNotif, setShowNotif] = useState(false);
    const [notifMsg, setNotifMsg] = useState('');

    useEffect(() => {
        fetchFriends();
    }, []);

    useEffect(() => {
        setFilteredFriends(friends);
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

    const handleDeleteFriend = (friendId: string) => {

        setLoading(true);

        deleteFriend(friendId).then(() => {
            setFriends(friends.filter(friend => friend.id !== friendId));
            setFilteredFriends(filteredFriends.filter(friend => friend.id !== friendId));
        }).finally(() => {
            refetchFriendRequests();
            setLoading(false);
        });
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
                disabled={loading || friends.length === 0}
            />

            <View style={globalStyles.separator} />

            {loading &&
                <FullScreenLoader />
            }

            {!loading && friends.length === 0 &&
                <>
                    <IonIcon
                        name="people"
                        size={200}
                        color={globalColors.greyLight}
                        style={styles.bigIcon}
                    />
                    <Text style={styles.noFriendsText}>No tienes amigos aun</Text>
                </>
            }

            {!loading && friends.length > 0 &&
                <ScrollView>

                    {filteredFriends.map((friend) => (
                        <UserCard
                            key={friend.id}
                            nickname={friend.nickname}
                            name={friend.full_name}
                            avatarUrl={friend.avatarUrl}
                            type="friend"
                            onRightButtonPress={() => handleDeleteFriend(friend.id)}
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
    noFriendsText: {
        flex: 1,
        fontSize: 20,
        fontFamily: 'Roboto-Light',
        color: globalColors.grey,
        alignSelf: 'center',
        textAlign: 'center',
    },
});
