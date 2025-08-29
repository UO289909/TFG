import { useEffect, useState } from 'react';
import { User } from '../../core/entities/user.entity';
import { signIn } from '../../infrastructure/database/auth.repository';
import { changeUserAvatar } from '../../core/use-cases/user/change-user-avatar.use-case';
import { getFriendRequests } from '../../core/use-cases/user/get-friend-requests.use-case';
import { Friend } from '../../core/entities/friend.entity';
import { getUser } from '../../core/use-cases/user/get-user.use-case';


export const useProfile = () => {

    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingProfile, setIsLoadingProfile] = useState(false);
    const [isLoadingFriendRequests, setIsLoadingFriendRequests] = useState(false);

    const [myProfile, setMyProfile] = useState<User>();
    const [friendRequests, setFriendRequests] = useState<Friend[]>([]);

    useEffect(() => {
        loadMyProfile();
    }, []);

    const loadMyProfile = async () => {

        setIsLoading(true);

        await signIn('dev@test.es', 'test');

        const userPromise = getUser();
        const friendRequestsPromise = getFriendRequests();

        const [user, friendRequestsFetched] = await Promise.all([userPromise, friendRequestsPromise]);

        setMyProfile(user);
        setFriendRequests(friendRequestsFetched);

        console.log('Friend requests fetched:', friendRequestsFetched);

        setIsLoading(false);

    };

    const refetchFriendRequests = async () => {

        setIsLoadingFriendRequests(true);

        const friendRequestsFetched = await getFriendRequests();
        setFriendRequests(friendRequestsFetched);

        setIsLoadingFriendRequests(false);

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

        await changeUserAvatar(newAvatarUrl);

        setIsLoadingProfile(false);

    };

    return {
        isLoading,
        isLoadingProfile,
        isLoadingFriendRequests,
        myProfile,
        friendRequests,
        refetchFriendRequests,
        refetchProfile,
        refetch,
        changeAvatar,
    };
};
