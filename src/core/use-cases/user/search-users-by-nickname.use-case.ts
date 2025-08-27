import { databaseSearchUsersByNickname } from '../../../infrastructure/database/user.repository';
import { DatabaseUser } from '../../../infrastructure/interfaces/supabase.responses';
import { UserMapper } from '../../../infrastructure/mappers/user.mapper';
import { User } from '../../entities/user.entity';


export const searchUsersByNickname = async (nickname: string): Promise<User[]> => {

    if (!nickname.trim()) {
        return [];
    }

    const databaseUsers: DatabaseUser[] = await databaseSearchUsersByNickname(nickname.trim());
    const users: User[] = databaseUsers.map(UserMapper.fromDatabaseUserToEntity);

    return users;
};
