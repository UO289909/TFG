import { databaseGetUserInfo } from '../../../infrastructure/database/user.repository';
import { UserMapper } from '../../../infrastructure/mappers/user.mapper';
import { User } from '../../entities/user.entity';


export const getUserInfo = async (id?: string): Promise<User> => {
    const userInfo = await databaseGetUserInfo(id);
    return UserMapper.fromDatabaseUserToEntity(userInfo);
};
