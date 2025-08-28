import { Friend } from '../../core/entities/friend.entity';
import { User } from '../../core/entities/user.entity';
import { DatabaseFriend, DatabaseUser } from '../interfaces/supabase.responses';


export class UserMapper {

    static fromDatabaseUserToEntity(databaseUser: DatabaseUser): User {
        return {
            id: databaseUser.id,
            nickname: databaseUser.nickname,
            full_name: databaseUser.full_name,
            avatarUrl: null,
        };
    }

    static fromDatabaseFriendToEntity(databaseFriend: DatabaseFriend): Friend {
        return {
            sender: databaseFriend.sender,
            receiver: databaseFriend.receiver,
            accepted: databaseFriend.accepted,
        };
    }
}
