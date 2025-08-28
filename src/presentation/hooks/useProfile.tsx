import { useEffect, useState } from 'react';
import { User } from '../../core/entities/user.entity';
import { signIn } from '../../infrastructure/database/auth.repository';
import { changeUserAvatar } from '../../core/use-cases/user/change-user-avatar.use-case';
import { getFriendRequests } from '../../core/use-cases/user/get-friend-requests.use-case';
import { Friend } from '../../core/entities/friend.entity';
import { getUser } from '../../core/use-cases/user/get-user.use-case';


export const useProfile = () => {

    const [isLoading, setIsLoading] = useState(true);
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

    const changeAvatar = async (newAvatarUrl: string) => {

        setIsLoading(true);

        await changeUserAvatar(newAvatarUrl);
        loadMyProfile();

        setIsLoading(false);

    };

    return {
        isLoading,
        myProfile,
        friendRequests,
        changeAvatar,
    };
};
