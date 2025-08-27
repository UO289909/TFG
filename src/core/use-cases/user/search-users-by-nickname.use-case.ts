import { databaseSearchUsersByNickname } from '../../../infrastructure/database/user.repository';
import { DatabaseUser } from '../../../infrastructure/interfaces/supabase.responses';
import { UserMapper } from '../../../infrastructure/mappers/user.mapper';
import { User } from '../../entities/user.entity';
import { getUserAvatarUrl } from './get-user-avatar-url.use-case';


export const searchUsersByNickname = async (nickname: string): Promise<User[]> => {

    if (!nickname.trim()) {
        return [];
    }

    const databaseUsers: DatabaseUser[] = await databaseSearchUsersByNickname(nickname.trim());

    const avatarIndexes: number[] = [];
    const avatarPromises: Promise<string>[] = [];
    databaseUsers.forEach((user, idx) => {
        if (user.has_avatar) {
            avatarIndexes.push(idx);
            avatarPromises.push(getUserAvatarUrl(3600, user.id));
        }
    });

    const fetchedAvatars = await Promise.all(avatarPromises);

    const users: User[] = databaseUsers.map(UserMapper.fromDatabaseUserToEntity);

    let avatarPointer = 0;
    return users.map((user, idx) => ({
        ...user,
        avatarUrl: databaseUsers[idx].has_avatar ? fetchedAvatars[avatarPointer++] : '',
    }));
};
