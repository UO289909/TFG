import { databaseDeleteFriend } from '../../../infrastructure/database/user.repository';

/**
 * Deletes a friend relationship from the database.
 * @param friendId The ID of the friend to delete.
 */
export const deleteFriend = async (friendId: string): Promise<void> => {
    await databaseDeleteFriend(friendId);
};
