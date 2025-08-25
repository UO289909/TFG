import { SupabaseClient } from './supabaseClient';

/**
 * Get the user access token for Supabase
 * @returns The user access token for Supabase
 */
export const getAccessToken = () => SupabaseClient.auth.session()?.access_token ?? '';

/**
 * Get the user ID for Supabase
 * @returns The user ID for Supabase
 */
export const getUserId = () => SupabaseClient.auth.session()?.user?.id ?? '';

/**
 * Sign in a user with email and password
 * @param email The email of the user
 * @param password The password of the user
 * @returns The user and session information
 */
export const signIn = async (email: string, password: string) => {

    const { user, session, error } = await SupabaseClient
        .auth
        .signIn({ email, password });

    if (error) {
        throw error;
    }

    return { user, session };
};
