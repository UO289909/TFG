
import { View, Text, StyleSheet, ScrollView, useWindowDimensions } from 'react-native';
import { ProfileInfoHeader } from '../../components/profile';
import { FriendBooksBox } from '../../components/friend/FriendBooksBox';
import { NavigationProp, RouteProp, useNavigation, useRoute, useTheme } from '@react-navigation/native';
import { RootStackParams as ProfileStackParams } from '../../navigation/ProfileStackNavigator';
import { RootStackParams as HomeStackParams } from '../../navigation/HomeStackNavigator';
import { CustomTheme } from '../../../config/app-theme';
import { useFriend } from '../../hooks/useFriend';
import { CustomMenuButton } from '../../components/pressables';
import { CustomNotification, FullScreenLoader } from '../../components/feedback';
import { useState } from 'react';
import { deleteFriend } from '../../../core/use-cases/user/delete-friend.use-case';
import { FriendNumbers } from '../../components/friend/FriendNumbers';


export const FriendScreen = () => {

    const { params } = useRoute<RouteProp<ProfileStackParams, 'Friend'>>();
    const { friend, fromHome } = params;

    const navigation = useNavigation<NavigationProp<ProfileStackParams & HomeStackParams>>();

    const { friendBooks, friendNumber, loadingFriendBooks, loadingFriendNumber } = useFriend(friend.id);

    const { colors } = useTheme() as CustomTheme;

    const { width, height } = useWindowDimensions();
    const isLandscape = width > height || width >= 768;

    const [isLoading, setIsLoading] = useState(false);

    const [showNotif, setShowNotif] = useState(false);

    const handleDeleteFriend = () => {
        setIsLoading(true);
        deleteFriend(friend.id).then(() => {
            if (fromHome) {
                navigation.reset({
                    index: 0,
                    routes: [
                        { name: 'HomeScreen' }
                    ],
                });
            } else {
                navigation.reset({
                    index: 0,
                    routes: [
                        { name: 'ProfileMenu', params: { doRefetch: true } },
                    ],
                });
            }
        })
    };


    if (isLoading) {
        return <FullScreenLoader message="Eliminando amigo..." />;
    }

    return (
        <View style={[styles.container, isLandscape && styles.containerLandscape]}>

            {showNotif &&
                <CustomNotification
                    message={'¿Estás seguro de que quieres eliminar a este amigo?'}
                    onClose={() => {
                        setShowNotif(false);
                    }}
                    onAccept={() => {
                        setShowNotif(false);
                        handleDeleteFriend();
                    }}
                    position="bottom"
                />
            }

            <ProfileInfoHeader
                nickname={friend.nickname}
                name={friend.full_name}
                avatarUrl={friend.avatarUrl}
                style={isLandscape ? styles.profileHeaderLandscape : styles.profileHeader}
                loadingAvatar={false}
                landscape={isLandscape}
            />

            <ScrollView
                contentContainerStyle={[styles.scrollContainer, isLandscape && styles.scrollContainerLandscape]}
            >

                <FriendNumbers
                    friends={friendNumber}
                    books={friendBooks.length}
                    loadingFriends={loadingFriendNumber}
                    loadingBooks={loadingFriendBooks}
                />

                <FriendBooksBox
                    books={friendBooks}
                    loading={loadingFriendBooks}
                    friend={friend}
                />

                <View style={[styles.actionsContainer, { backgroundColor: colors.card }]}>

                    <Text style={[styles.title, { color: colors.text }]}>Acciones</Text>

                    <CustomMenuButton
                        onPress={() => {
                            setShowNotif(true);
                        }}
                        label="Eliminar amigo"
                        icon="person-remove"
                        style={styles.button}
                        disabled={showNotif}
                    />

                </View>

            </ScrollView>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    containerLandscape: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    scrollContainer: {
        alignItems: 'center',
        padding: 10,
        paddingTop: 5,
    },
    scrollContainerLandscape: {
        paddingVertical: 10,
        paddingHorizontal: 36,
    },
    profileHeader: {
        marginBottom: 5,
    },
    profileHeaderLandscape: {
        marginBottom: 10,
    },
    actionsContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        alignSelf: 'center',
        width: '100%',
        padding: 10,
        borderRadius: 16,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 4,
    },
    title: {
        fontSize: 22,
        fontFamily: 'Roboto-Medium',
        marginBottom: 10,
    },
    button: {
        width: '100%',
    },
});