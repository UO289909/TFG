import { databaseCreateSignedAvatarUrl } from '../../../infrastructure/database/user.repository';

export const getUserAvatarUrl = async (
    expiresInSeconds = 3600
): Promise<string> => {

    const url = await databaseCreateSignedAvatarUrl(expiresInSeconds);
    return url;
};
