import { databaseSearchUsersByNickname } from '../../../infrastructure/database/user.repository';
import { DatabaseUser } from '../../../infrastructure/interfaces/supabase.responses';
import { UserMapper } from '../../../infrastructure/mappers/user.mapper';
import { User } from '../../entities/user.entity';
import { getUserAvatarUrl } from './get-user-avatar-url.use-case';

/**
 * Search users by their nickname.
 * @param nickname The nickname to search for.
 * @returns A promise that resolves to an array of User entities matching the nickname.
 */
export const searchUsersByNickname = async (nickname: string): Promise<User[]> => {

    if (!nickname.trim()) {
        console.log('No se proporcionó un nickname para buscar.');
        return [];
    }

    const databaseUsers: DatabaseUser[] = await databaseSearchUsersByNickname(nickname.trim());

    const avatars: Promise<string>[] = databaseUsers.map((user) => getUserAvatarUrl(3600, user.id));
    const fetchedAvatars = await Promise.all(avatars);

    const users: User[] = databaseUsers.map(UserMapper.fromDatabaseUserToEntity);

    return users.map((user, index) => ({
        ...user,
        avatarUrl: fetchedAvatars[index],
    }));

};
