import { databaseCheckNicknameExists } from '../../../infrastructure/database/auth.repository';

/**
 * Check if a nickname already exists in the database
 * @param nickname The nickname to check
 * @returns True if the nickname exists, false otherwise
 */
export const checkNicknameExists = async (nickname: string): Promise<boolean> => {

    const nicknameExists = await databaseCheckNicknameExists(nickname);

    if (nicknameExists) {
        throw new Error('El nickname ya está en uso, elige otro');
    }

    return nicknameExists;
};
