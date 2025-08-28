import { databaseGetFriendAvatarByRequest, databaseGetFriendInfoByRequest } from '../../../infrastructure/database/user.repository';
import { DatabaseUser } from '../../../infrastructure/interfaces/supabase.responses';
import { Friend } from '../../entities/friend.entity';
import { User } from '../../entities/user.entity';

/**
 * Get friends by requests
 * @param expiresInSeconds Time in seconds until the avatar URL expires
 * @param friendRequests Array of friend requests
 * @returns Array of users with their info and avatar URL
 */
export const getFriendsByRequests = async (expiresInSeconds = 3600, friendRequests: Friend[]): Promise<User[]> => {
    const acceptedRequests = friendRequests.filter(request => request.accepted);

    const infosPromise = acceptedRequests.map(request => databaseGetFriendInfoByRequest(request));
    const avatarsPromise = acceptedRequests.map(request => databaseGetFriendAvatarByRequest(expiresInSeconds, request));

    const infos: DatabaseUser[] = await Promise.all(infosPromise);
    const avatars: string[] = await Promise.all(avatarsPromise);

    const users: User[] = infos.map((info, idx) => ({
        ...info,
        avatarUrl: avatars[idx],
    }));

    return users;
};
