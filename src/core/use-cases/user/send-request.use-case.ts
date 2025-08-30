import { databaseSendRequest } from '../../../infrastructure/database/user.repository';

/**
 * Sends a friend request to another user.
 * @param friendId The ID of the user to send the friend request to.
 */
export const sendRequest = async (friendId: string): Promise<void> => {
    await databaseSendRequest(friendId);
};
