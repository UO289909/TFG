import { databaseAcceptRequest, databaseRejectRequest } from '../../../infrastructure/database/user.repository';

/**
 * Handles a friend request by accepting or rejecting it.
 * @param friendId The ID of the friend request to handle.
 * @param accept Whether to accept or reject the friend request.
 */
export const handleRequest = async (friendId: string, accept: boolean): Promise<void> => {
    if (accept) {
        await databaseAcceptRequest(friendId);
    } else {
        await databaseRejectRequest(friendId);
    }
};
