import { databaseCheckNicknameExists, databaseCheckSameNickname } from '../../../infrastructure/database/auth.repository';
import { databaseChangeNickname } from '../../../infrastructure/database/user.repository';

/**
 * Change the current user's nickname after checking if it's the same or if it exists
 * @param newNickname The new nickname to set
 * @returns True if the nickname was changed successfully, false otherwise
 */
export const changeNickname = async (newNickname: string): Promise<boolean> => {

    const nicknameExists = await databaseCheckNicknameExists(newNickname);

    if (nicknameExists) {
        const sameNickname = await databaseCheckSameNickname(newNickname);
        if (sameNickname) {
            throw new Error('El nickname es el mismo que el actual');
        }
        throw new Error('El nickname ya está en uso, elige otro');
    }

    const changed = await databaseChangeNickname(newNickname);

    return changed;

};
