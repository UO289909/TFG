import { databaseAcceptRequest, databaseRejectRequest } from '../../../infrastructure/database/user.repository';
import { Friend } from '../../entities/friend.entity';

/**
 * Handles a friend request by accepting or rejecting it.
 * @param friendRequest The friend request to handle.
 * @param accept Whether to accept or reject the friend request.
 */
export const handleRequest = async (friendRequest: Friend, accept: boolean): Promise<void> => {
    if (accept) {
        await databaseAcceptRequest(friendRequest);
    } else {
        await databaseRejectRequest(friendRequest);
    }
};
