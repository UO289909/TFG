import { User } from '../../entities/user.entity';
import { getUserAvatarUrl } from './get-user-avatar-url.use-case';
import { getUserInfo } from './get-user-info.use-case';

/**
 * Gets the user information and avatar URL for a user.
 * @param avatarExpiresInSeconds The duration in seconds for which the signed URL is valid.
 * @param id The ID of the user to fetch (optional).
 * @returns A promise that resolves to the user information and avatar URL.
 */
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
