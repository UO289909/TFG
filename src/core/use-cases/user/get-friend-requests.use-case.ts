import { databaseGetFriendRequests } from '../../../infrastructure/database/user.repository';
import { UserMapper } from '../../../infrastructure/mappers/user.mapper';
import { Friend } from '../../entities/friend.entity';

/**
 * Gets the friend requests for the current user.
 * @returns A promise that resolves to an array of friend requests.
 */
export const getFriendRequests = async (): Promise<Friend[]> => {
    const friendRequests = await databaseGetFriendRequests();
    return friendRequests.map(UserMapper.fromDatabaseFriendToEntity);
};
