/* eslint-disable react-hooks/exhaustive-deps */
import { ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { IonIcon } from '../../components/icons';
import { UserCard } from '../../components/profile/UserCard';
import { useProfile } from '../../hooks/useProfile';
import { useEffect, useState } from 'react';
import { User } from '../../../core/entities/user.entity';
import { getFriendsByRequests } from '../../../core/use-cases/user/get-friends-by-request.use-case';
import { FullScreenLoader } from '../../components/feedback';
import { handleRequest } from '../../../core/use-cases/user/handle-request.use-case';
import { deleteFriend } from '../../../core/use-cases/user/delete-friend.use-case';
import { useTheme } from '@react-navigation/native';
import { CustomTheme } from '../../../config/app-theme';


export const FriendRequestsScreen = () => {

    const { colors } = useTheme() as CustomTheme;

    const { friendRequests, refetchFriendRequests } = useProfile();

    const { width, height } = useWindowDimensions();
    const isLandscape = width > height;

    const [sentUsers, setSentUsers] = useState<User[]>([]);
    const [receivedUsers, setReceivedUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        refetchFriendRequests();
    }, []);

    useEffect(() => {
        handleRequestToUsers();
    }, [friendRequests]);

    const handleRequestToUsers = async () => {

        setLoading(true);

        const users = await getFriendsByRequests(3600, friendRequests);
        console.log(friendRequests);
        console.log(users);

        setSentUsers(users.filter(user => user.request === 'sent' && user.accepted === false).map(u => u.user));
        setReceivedUsers(users.filter(user => user.request === 'received' && user.accepted === false).map(u => u.user));

        setLoading(false);
    };

    const handleDeleteFriend = (friendId: string) => {

        setLoading(true);

        deleteFriend(friendId).finally(() => {
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

    if (loading) {
        return <FullScreenLoader />;
    }

    return (
        <View style={[styles.container, isLandscape && styles.containerLandscape]}>

            <View style={styles.block}>
                <View style={styles.titleHeader}>
                    <Text style={{ ...styles.title, color: colors.text }}>Solicitudes recibidas</Text>
                    <IonIcon name="archive" size={30} color={colors.grey} />
                </View>

                <View style={{ ...styles.separator, shadowColor: colors.shadow }} />

                <ScrollView
                    style={styles.scrollContainer}
                    contentContainerStyle={styles.scrollContainerContent}
                >


                    {receivedUsers.map((user) => (
                        <UserCard
                            key={user.id}
                            type="requestReceived"
                            nickname={user.nickname}
                            name={user.full_name}
                            avatarUrl={user.avatarUrl}
                            onRightButtonPress={() => handleFriendRequest(user.id, true)}
                            onRejectRequest={() => handleFriendRequest(user.id, false)}
                        />
                    ))}


                </ScrollView>
            </View>

            <View style={[
                styles.separator,
                styles.bigSeparator,
                isLandscape && styles.bigSeparatorLandscape,
                { shadowColor: colors.shadow, backgroundColor: colors.grey },
            ]} />

            <View style={styles.block}>
                <View style={styles.titleHeader}>
                    <Text style={{ ...styles.title, color: colors.text }}>Solicitudes enviadas</Text>
                    <IonIcon name="send" size={30} color={colors.grey} />
                </View>

                <View style={{ ...styles.separator, shadowColor: colors.shadow }} />

                <ScrollView
                    style={styles.scrollContainer}
                    contentContainerStyle={styles.scrollContainerContent}
                >

                    {sentUsers.map((user) => (
                        <UserCard
                            key={user.id}
                            type="requestSent"
                            nickname={user.nickname}
                            name={user.full_name}
                            avatarUrl={user.avatarUrl}
                            onRightButtonPress={() => handleDeleteFriend(user.id)}
                        />
                    ))}

                </ScrollView>
            </View>

        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    containerLandscape: {
        flexDirection: 'row',
        alignItems: 'stretch',
    },
    block: {
        flex: 1,
    },
    separator: {
        height: 1,
        borderRadius: 1,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
    },
    scrollContainer: {
        minHeight: 200,
    },
    scrollContainerContent: {
        paddingBottom: 10,
    },
    bigSeparator: {
        height: 4,
    },
    bigSeparatorLandscape: {
        width: 4,
        height: 'auto',
        alignSelf: 'stretch',
    },
    title: {
        fontSize: 20,
        fontFamily: 'Roboto-Medium',
        marginRight: 14,
    },
    titleHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
    },
});
