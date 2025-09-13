import { databaseCheckNicknameExists } from '../../../infrastructure/database/auth.repository';


export const checkNicknameExists = async (nickname: string): Promise<boolean> => {

    const nicknameExists = await databaseCheckNicknameExists(nickname);

    if (nicknameExists) {
        throw new Error('El nickname ya está en uso, elige otro');
    }

    return nicknameExists;
};
