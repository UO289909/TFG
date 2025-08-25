import { databaseGetUserInfo } from '../../../infrastructure/database/user.repository';
import { UserMapper } from '../../../infrastructure/mappers/user.mapper';
import { User } from '../../entities/user.entity';


export const getUserInfo = async (): Promise<User> => {
    const userInfo = await databaseGetUserInfo();
    return UserMapper.fromDatabaseUserToEntity(userInfo);
};
