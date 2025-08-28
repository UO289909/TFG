import { User } from '../../entities/user.entity';
import { getUserAvatarUrl } from './get-user-avatar-url.use-case';
import { getUserInfo } from './get-user-info.use-case';


export const getUser = async (
    avatarExpiresInSeconds = 3600,
    id?: string,
): Promise<User> => {
    const userPromise = getUserInfo(id);
    const avatarUrlPromise = getUserAvatarUrl(avatarExpiresInSeconds, id);

    const [user, avatarUrl] = await Promise.all([userPromise, avatarUrlPromise]);
    user.avatarUrl = avatarUrl;

    return user;
};
