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
import { deleteFriend } from '../../../core/use-cases/user/delete-friend.use-case';
import { handleRequest } from '../../../core/use-cases/user/handle-request.use-case';
import { sendRequest } from '../../../core/use-cases/user/send-request.use-case';
import { useProfile } from '../../hooks/useProfile';


export const SearchUsersScreen = () => {

    const { friendRequests, refetchFriendRequests } = useProfile();

    const [users, setUsers] = useState<{ user: User, type: UserType }[]>([]);
    const [loading, setLoading] = useState(false);

    const [showNotif, setShowNotif] = useState(false);
    const [notifMsg, setNotifMsg] = useState('');

    useEffect(() => {
        refetchFriendRequests();
    }, []);

    useEffect(() => {

        if (users.length === 0) {
            return;
        }

        setLoading(true);

        const reTypedUsers = users.map(reUser => {
            const friendRequest = friendRequests.find(
                fr => fr.sender === reUser.user.id || fr.receiver === reUser.user.id
            );

            let type: UserType = 'user';

            if (friendRequest) {
                if (friendRequest.accepted) {
                    type = 'friend';
                } else if (friendRequest.sender === reUser.user.id) {
                    type = 'requestReceived';
                } else if (friendRequest.receiver === reUser.user.id) {
                    type = 'requestSent';
                }
            }

            return { user: reUser.user, type };
        });

        setUsers(reTypedUsers);
        setLoading(false);

    }, [friendRequests]);

    const handleSearch = async (text: string) => {

        setLoading(true);

        try {

            if (!text.trim()) {
                setUsers([]);
                return;
            }

            await refetchFriendRequests();
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
                            type = 'requestReceived';
                        } else if (friendRequest.receiver === user.id) {
                            type = 'requestSent';
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
            setUsers(prevUsers =>
                prevUsers.map(u =>
                    u.user.id === friendId ? { ...u, type: 'user' } : u
                )
            );
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

    const handleFriendRequest = (friendId: string, accept: boolean) => {

        setLoading(true);

        handleRequest(friendId, accept).then(() => {
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
                <ScrollView
                    contentContainerStyle={styles.scrollContainer}
                >

                    {users.map(({ user, type }) => (
                        <UserCard
                            key={user.id}
                            nickname={user.nickname}
                            name={user.full_name}
                            avatarUrl={user.avatarUrl}
                            type={type}
                            onRightButtonPress={() => {
                                type === 'user'
                                    ? handleSendRequest(user.id)
                                    : type === 'requestReceived'
                                        ? handleFriendRequest(user.id, true)
                                        : handleDeleteFriend(user.id);
                            }}
                            onRejectRequest={() => handleFriendRequest(user.id, false)}
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
    scrollContainer: {
        paddingBottom: 10,
    },
    bigIcon: {
        flex: 1,
        alignSelf: 'center',
        marginTop: 50,
    },
});
