import { SupabaseClient } from './supabaseClient';

/**
 * Get the user access token for Supabase
 * @returns The user access token for Supabase
 */
export const getAccessToken = async () => {

    const { data: { session } } = await SupabaseClient
        .auth
        .getSession();

    if (session) {
        console.log('Access Token:', session.access_token);
        return session.access_token;
    }

    throw new Error('Error retrieving access token');
};

/**
 * Get the user ID for Supabase
 * @returns The user ID for Supabase
 */
export const getUserId = async () => {

    const { data: { user } } = await SupabaseClient
        .auth
        .getUser();

    if (user) {
        console.log('User ID:', user.id);
        return user.id;
    }

    throw new Error('Error retrieving user ID');
};

/**
 * Get the user ID and access token for Supabase
 * @returns The user ID and access token for Supabase
 */
export const getCredentials = async () => {
    const accessTokenPromise = getAccessToken();
    const userIdPromise = getUserId();

    const [accessToken, userId] = await Promise.all([accessTokenPromise, userIdPromise]);

    return { accessToken, userId };
};

/**
 * Sign in a user with email and password
 * @param email The email of the user
 * @param password The password of the user
 * @returns The user and session information
 */
export const signIn = async (email: string, password: string) => {

    const { data, error } = await SupabaseClient
        .auth
        .signInWithPassword({ email, password });

    if (error) {
        throw error;
    }

    return { user: data.user, session: data.session };
};

/**
 * Check if a nickname exists in the database
 * @param nickname The nickname to check
 * @returns True if the nickname exists, false otherwise
 */
export const databaseCheckNicknameExists = async (nickname: string): Promise<boolean> => {

    const { data, error } = await SupabaseClient
        .from('users')
        .select()
        .eq('nickname', nickname);

    if (error) {
        throw error;
    }

    return data.length > 0;
};


export const databaseCheckSameNickname = async (newNickname: string): Promise<boolean> => {

    const userId = await getUserId();

    const { data, error } = await SupabaseClient
        .from('users')
        .select()
        .eq('id', userId)
        .eq('nickname', newNickname);

    if (error) {
        throw error;
    }

    return data.length > 0;
};
