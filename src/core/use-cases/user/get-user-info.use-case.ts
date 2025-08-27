import { databaseGetUserInfo } from '../../../infrastructure/database/user.repository';
import { UserMapper } from '../../../infrastructure/mappers/user.mapper';
import { User } from '../../entities/user.entity';

/**
 * Get user information by ID.
 * @param id The user ID. If not provided, fetches the current user's info.
 * @returns The user information as a User entity.
 */
export const getUserInfo = async (id?: string): Promise<User> => {
    const userInfo = await databaseGetUserInfo(id);
    return UserMapper.fromDatabaseUserToEntity(userInfo);
};
