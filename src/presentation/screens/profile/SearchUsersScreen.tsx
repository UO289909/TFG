/* eslint-disable react-hooks/exhaustive-deps */
import { ScrollView, StyleSheet, View } from 'react-native';
import { SearchBar } from '../../components/inputs';
import { globalColors, globalStyles } from '../../../config/app-theme';
import { UserCard, UserType } from '../../components/profile/UserCard';
import { CustomNotification, FullScreenLoader } from '../../components/feedback';
import { useEffect, useState } from 'react';
import { User } from '../../../core/entities/user.entity';
import { searchUsersByNickname } from '../../../core/use-cases/user/search-users-by-nickname.use-case';
import { normalizeText } from '../../../utils/normalizeText';
import { IonIcon } from '../../components/icons';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParams } from '../../navigation/ProfileStackNavigator';
import { deleteFriend } from '../../../core/use-cases/user/delete-friend.use-case';
import { Friend } from '../../../core/entities/friend.entity';
import { handleRequest } from '../../../core/use-cases/user/handle-request.use-case';
import { sendRequest } from '../../../core/use-cases/user/send-request.use-case';


export const SearchUsersScreen = () => {

    const { params } = useRoute<RouteProp<RootStackParams, 'SearchUsers'>>();
    const { friendRequests, refetchFriendRequests } = params;

    const [friends, setFriends] = useState<User[]>([]);

    const [users, setUsers] = useState<{ user: User, type: UserType }[]>([]);
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
                setNotifMsg('No se encontraron usuarios que coincidan con la busqueda :(');
                setShowNotif(true);
            } else {
                const foundWithType = found.map(user => {

                    const friendRequest = friendRequests.find(
                        fr => fr.sender === user.id || fr.receiver === user.id
                    );

                    let type: UserType = 'user';

                    if (friendRequest) {
                        if (friendRequest.accepted) {
                            type = 'friend';
                        } else if (friendRequest.sender === user.id) {
                            type = 'requestSent';
                        } else if (friendRequest.receiver === user.id) {
                            type = 'requestReceived';
                        }
                    }

                    return { user, type };
                });

                setUsers(foundWithType);
            }

        } finally {
            setLoading(false);
        }

    };

    const handleDeleteFriend = (friendId: string) => {

        setLoading(true);

        deleteFriend(friendId).then(() => {
            setFriends(friends.filter(friend => friend.id !== friendId));
        }).finally(() => {
            refetchFriendRequests();
            setLoading(false);
        });
    };

    const handleSendRequest = (friendId: string) => {

        setLoading(true);

        sendRequest(friendId).finally(() => {
            refetchFriendRequests();
            setLoading(false);
        });
    };

    const handleFriendRequest = (friendRequest: Friend, accept: boolean) => {

        setLoading(true);

        handleRequest(friendRequest, accept).then(() => {
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
                onSearch={handleSearch}
                placeholder="Buscar usuarios por nickname..."
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

            {!loading && users.length > 0 &&
                <ScrollView>

                    {users.map(({ user, type }) => (
                        <UserCard
                            key={user.id}
                            nickname={user.nickname}
                            name={user.full_name}
                            avatarUrl={user.avatarUrl}
                            type={type}
                            onRightButtonPress={() => { }}
                            onRejectRequest={type === 'requestReceived' ? () => { } : undefined}
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
