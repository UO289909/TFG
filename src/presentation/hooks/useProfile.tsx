import { useEffect, useState } from 'react';
import { User } from '../../core/entities/user.entity';
import { signIn } from '../../infrastructure/database/auth.repository';
import { getUserInfo } from '../../core/use-cases/user/get-user-info.use-case';
import { getUserAvatarUrl } from '../../core/use-cases/user/get-user-avatar-url.use-case';
import { changeUserAvatar } from '../../core/use-cases/user/change-user-avatar.use-case';
import { DatabaseFriend } from '../../infrastructure/interfaces/supabase.responses';


export const useProfile = () => {

    const [isLoading, setIsLoading] = useState(true);
    const [myProfile, setMyProfile] = useState<User>();
    const [friendRequests, setFriendRequests] = useState<DatabaseFriend[]>([]);
    const [friends, setFriends] = useState<User[]>([]);

    useEffect(() => {
        loadMyProfile();
    }, []);

    const loadMyProfile = async () => {

        setIsLoading(true);

        await signIn('dev@test.es', 'test');

        const userPromise = getUserInfo();
        const avatarUrlPromise = getUserAvatarUrl();

        const [user, avatarUrl] = await Promise.all([userPromise, avatarUrlPromise]);
        user.avatarUrl = avatarUrl;

        console.log('User profile loaded:', user);
        setMyProfile(user);

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
        friends,
        changeAvatar,
    };
};
