import { databaseCreateSignedAvatarUrl } from '../../../infrastructure/database/user.repository';

export const getUserAvatarUrl = async (
    expiresInSeconds = 3600,
    id?: string,
): Promise<string> => {

    const url = await databaseCreateSignedAvatarUrl(expiresInSeconds, id);
    return url;
};
