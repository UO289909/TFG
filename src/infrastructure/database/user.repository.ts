import { supabaseFetcher } from '../../config/adapters/supabase.adapter';
import { Friend } from '../../core/entities/friend.entity';
import { DatabaseFriend, DatabaseUser } from '../interfaces/supabase.responses';
import { getUserId, getAccessToken } from './auth.repository';
import { SupabaseClient } from './supabaseClient';

const AVATARS_BUCKET = 'avatars';

/**
 * Fetches the id user information's from the database
 * or the current user's information if no id is provided.
 * @param id The ID of the user to fetch (optional).
 * @returns The user's information.
 */
export const databaseGetUserInfo = async (id?: string): Promise<DatabaseUser> => {

    const accessToken = getAccessToken();
    const userId = id || getUserId();

    try {
        const data: DatabaseUser[] = await supabaseFetcher.get(
            `/rest/v1/users?id=eq.${userId}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );
        return data[0];

    } catch (error) {
        throw new Error(`Error fetching user info from database: ${error}`);
    }
};

/**
 * Uploads a user's avatar to the database.
 * @param file The avatar file route to upload.
 * @returns The file name of the uploaded avatar.
 */
export const databaseUploadMyAvatar = async (fileUri: string): Promise<string> => {

    const userId = getUserId();
    const fileName = `${userId}.webp`;

    const formData = new FormData();
    formData.append('file', {
        uri: fileUri,
        name: fileName,
        type: 'image/webp',
    } as any);

    const { error } = await SupabaseClient
        .storage
        .from(AVATARS_BUCKET)
        .upload(fileName, formData, { upsert: true, contentType: 'image/webp' });

    if (error) {
        console.log(`Error uploading avatar: ${error.message}`);
        throw new Error(`Error uploading avatar: ${error.message}`);
    }

    return fileName;
};


/**
 * Creates a signed URL for the received id user's avatar
 * or the current user's avatar if no id is provided.
 * @param expiresInSeconds The duration in seconds for which the signed URL is valid.
 * @param id The ID of the user whose avatar URL is to be created (optional).
 * @returns A promise that resolves to the signed URL or an empty string if the avatar does not exist.
 */
export const databaseCreateSignedAvatarUrl = async (
    expiresInSeconds = 3600,
    id?: string
): Promise<string> => {

    const userId = id || getUserId();
    const avatarPath = `${userId}.webp`;


    const { data, error } = await SupabaseClient
        .storage
        .from(AVATARS_BUCKET)
        .createSignedUrl(avatarPath, expiresInSeconds);

    if (error || !data?.signedURL) {
        if (error?.message === 'Object not found') {
            return '';
        }
        throw new Error('Error creating signed avatar URL');
    }

    return data.signedURL;

};

/**
 * Gets a list of users whose nicknames match the provided nickname (case insensitive).
 * @param nickname The nickname to search for.
 * @returns A promise that resolves to an array of users matching the nickname.
 */
export const databaseSearchUsersByNickname = async (nickname: string): Promise<DatabaseUser[]> => {

    const accessToken = getAccessToken();
    const userId = getUserId();

    try {

        const data: DatabaseUser[] = await supabaseFetcher.get(
            `/rest/v1/users?nickname=ilike.*${nickname}*&id=neq.${userId}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );
        return data;

    } catch (error) {
        throw new Error(`Error searching users by nickname: ${error}`);
    }
};

/**
 * Gets a list of friend requests (accepted or not, sended or received) for the current user.
 * @returns A promise that resolves to an array of friend requests.
 */
export const databaseGetFriendRequests = async (): Promise<DatabaseFriend[]> => {

    const accessToken = getAccessToken();
    const userId = getUserId();

    try {

        const data: DatabaseFriend[] = await supabaseFetcher.get(
            `/rest/v1/friends?or=(sender.eq.${userId},receiver.eq.${userId})`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );
        return data;

    } catch (error) {
        throw new Error(`Error fetching friend requests: ${error}`);
    }
};

/**
 * Gets the user information for a friend request.
 * @param friendRequest The friend request object.
 * @returns A promise that resolves to the user information of the friend.
 */
export const databaseGetFriendInfoByRequest = async (friendRequest: Friend): Promise<DatabaseUser> => {

    const id = friendRequest.sender === getUserId() ? friendRequest.receiver : friendRequest.sender;

    try {
        const data: DatabaseUser = await databaseGetUserInfo(id);
        return data;

    } catch (error) {
        throw new Error(`Error fetching friend info from database: ${error}`);
    }
};

/**
 * Gets the avatar URL for a friend request.
 * @param expiresInSeconds The duration in seconds for which the signed URL is valid.
 * @param friendRequest The friend request object.
 * @returns A promise that resolves to the signed avatar URL or an empty string if the avatar does not exist.
 */
export const databaseGetFriendAvatarByRequest = async (expiresInSeconds = 3600, friendRequest: Friend): Promise<string> => {

    const id = friendRequest.sender === getUserId() ? friendRequest.receiver : friendRequest.sender;

    try {
        const avatarUrl = await databaseCreateSignedAvatarUrl(expiresInSeconds, id);
        return avatarUrl;

    } catch (error) {
        throw new Error(`Error fetching friend avatar from database: ${error}`);
    }
};

/**
 * Deletes a friend relationship from the database.
 * @param friendId The ID of the friend to delete.
 */
export const databaseDeleteFriend = async (friendId: string): Promise<void> => {

    const accessToken = getAccessToken();
    const userId = getUserId();

    try {
        await supabaseFetcher.delete(
            `/rest/v1/friends?or=(and(sender.eq.${userId},receiver.eq.${friendId}),and(sender.eq.${friendId},receiver.eq.${userId}))`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

    } catch (error) {
        throw new Error(`Error deleting friend from database: ${error}`);
    }
};

/**
 * Sends a friend request to another user.
 * @param friendId The ID of the user to send the friend request to.
 */
export const databaseSendRequest = async (friendId: string): Promise<void> => {

    const accessToken = getAccessToken();
    const userId = getUserId();

    try {
        await supabaseFetcher.post(
            '/rest/v1/friends',
            {
                sender: userId,
                receiver: friendId,
                accepted: false,
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

    } catch (error) {
        throw new Error(`Error sending friend request: ${error}`);
    }
};

/**
 * Accepts a friend request.
 * @param friendId The ID of the friend request to accept.
 */
export const databaseAcceptRequest = async (friendId: string): Promise<void> => {

    const accessToken = getAccessToken();
    const userId = getUserId();

    try {
        await supabaseFetcher.patch(
            `/rest/v1/friends?sender=eq.${friendId}&receiver=eq.${userId}`,
            {
                accepted: true,
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

    } catch (error) {
        throw new Error(`Error accepting friend request: ${error}`);
    }
};

/**
 * Rejects a friend request.
 * @param friendId The ID of the friend request to reject.
 */
export const databaseRejectRequest = async (friendId: string): Promise<void> => {

    const accessToken = getAccessToken();
    const userId = getUserId();

    try {
        await supabaseFetcher.delete(
            `/rest/v1/friends?sender=eq.${friendId}&receiver=eq.${userId}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

    } catch (error) {
        throw new Error(`Error rejecting friend request: ${error}`);
    }
};
