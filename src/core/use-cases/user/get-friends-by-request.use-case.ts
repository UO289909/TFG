import { databaseGetFriendAvatarByRequest, databaseGetFriendInfoByRequest } from '../../../infrastructure/database/user.repository';
import { DatabaseUser } from '../../../infrastructure/interfaces/supabase.responses';
import { Friend } from '../../entities/friend.entity';
import { User } from '../../entities/user.entity';

/**
 * Get friends by requests, their avatars, if the request was sent or received and if it's accepted
 * @param expiresInSeconds Time in seconds until the avatar URL expires
 * @param friendRequests Array of friend requests
 * @param onlyAccepted If true, only accepted requests will be returned
 * @returns Array of users with their info, avatar URL, the type of request (sent or received) and if it's accepted
 */
export const getFriendsByRequests = async (expiresInSeconds = 3600, friendRequests: Friend[], onlyAccepted?: boolean): Promise<{user: User, request: 'sent' | 'received', accepted: boolean}[]> => {
    const acceptedRequests = onlyAccepted ? friendRequests.filter(request => request.accepted) : friendRequests;

    const infosPromise = acceptedRequests.map(request => databaseGetFriendInfoByRequest(request));
    const avatarsPromise = acceptedRequests.map(request => databaseGetFriendAvatarByRequest(expiresInSeconds, request));

    const infos: {user: DatabaseUser, request: 'sent' | 'received', accepted: boolean}[] = await Promise.all(infosPromise);
    const avatars: string[] = await Promise.all(avatarsPromise);
    console.log('friend requests:', friendRequests);

    const users: {user: User, request: 'sent' | 'received', accepted: boolean}[] = infos.map((info, idx) => ({
        user: {
            ...info.user,
            avatarUrl: avatars[idx],
        },
        request: info.request,
        accepted: info.accepted,
    }));

    return users;
};
