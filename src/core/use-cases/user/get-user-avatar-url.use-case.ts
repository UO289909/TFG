import { databaseCreateSignedAvatarUrl } from '../../../infrastructure/database/user.repository';

/**
 * Get a signed URL for a user's avatar.
 * @param expiresInSeconds Time in seconds for the URL to expire. Default is 3600 seconds (1 hour).
 * @param id The user ID. If not provided, fetches the current user's avatar URL.
 * @returns URL string of the user's avatar.
 */
export const getUserAvatarUrl = async (
    expiresInSeconds = 3600,
    id?: string,
): Promise<string> => {

    const url = await databaseCreateSignedAvatarUrl(expiresInSeconds, id);
    return url;
};
