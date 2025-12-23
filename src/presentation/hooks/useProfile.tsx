import { useState } from 'react';
import { User } from '../../core/entities/user.entity';
import { changeUserAvatar } from '../../core/use-cases/user/change-user-avatar.use-case';
import { getFriendRequests } from '../../core/use-cases/user/get-friend-requests.use-case';
import { Friend } from '../../core/entities/friend.entity';
import { getUser } from '../../core/use-cases/user/get-user.use-case';
import { getFriendsByRequests } from '../../core/use-cases/user/get-friends-by-request.use-case';


export const useProfile = () => {

    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingProfile, setIsLoadingProfile] = useState(false);
    const [isLoadingFriendRequests, setIsLoadingFriendRequests] = useState(false);
    const [isLoadingFriends, setIsLoadingFriends] = useState(false);

    const [myProfile, setMyProfile] = useState<User>();
    const [friendRequests, setFriendRequests] = useState<Friend[]>([]);
    const [friends, setFriends] = useState<User[]>([]);

    const loadMyProfile = async () => {

        setIsLoading(true);

        const userPromise = getUser();
        const friendRequestsPromise = getFriendRequests();

        const [user, friendRequestsFetched] = await Promise.all([userPromise, friendRequestsPromise]);

        setMyProfile(user);
        setFriendRequests(friendRequestsFetched);

        setIsLoading(false);

    };

    const refetchFriends = async () => {

        setIsLoadingFriends(true);

        const fetchedFriendRequests = await refetchFriendRequests();

        const fetchedFriends = await getFriendsByRequests(3600, fetchedFriendRequests, true);
        setFriends([...fetchedFriends.map(friend => friend.user)]);

        setIsLoadingFriends(false);

    };

    const refetchFriendRequests = async (): Promise<Friend[]> => {

        setIsLoadingFriendRequests(true);

        const friendRequestsFetched = await getFriendRequests();
        setFriendRequests(friendRequestsFetched);

        setIsLoadingFriendRequests(false);
        return friendRequestsFetched;

    };

    const refetchProfile = async () => {

        setIsLoadingProfile(true);

        const profile = await getUser();
        setMyProfile(profile);

        setIsLoadingProfile(false);

    };

    const refetch = async () => {
        await loadMyProfile();
    };

    const changeAvatar = async (newAvatarUrl: string) => {

        setIsLoadingProfile(true);
        console.log('Changing avatar to URL:', newAvatarUrl);
        await changeUserAvatar(newAvatarUrl);
        console.log('Avatar change request completed.');
        setIsLoadingProfile(false);

    };

    return {
        isLoading,
        isLoadingProfile,
        isLoadingFriendRequests,
        isLoadingFriends,
        friends,
        myProfile,
        friendRequests,
        refetchFriends,
        refetchFriendRequests,
        refetchProfile,
        refetch,
        changeAvatar,
    };
};
