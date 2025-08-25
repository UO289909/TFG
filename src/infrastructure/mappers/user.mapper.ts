import { User } from '../../core/entities/user.entity';
import { DatabaseUser } from '../interfaces/supabase.responses';


export class UserMapper {

    static fromDatabaseUserToEntity(databaseUser: DatabaseUser): User {
        return {
            id: databaseUser.id,
            nickname: databaseUser.nickname,
            full_name: databaseUser.full_name,
            avatarUrl: null,
        };
    }
}
