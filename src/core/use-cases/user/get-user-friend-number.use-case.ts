import { databaseGetUserFriendNumber } from "../../../infrastructure/database/user.repository";


export const getUserFriendNumber = async (id: string): Promise<number> => {
    return await databaseGetUserFriendNumber(id);
};