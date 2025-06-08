import { SupabaseClient } from './supabaseClient';

export const getAccessToken = () => SupabaseClient.auth.session()?.access_token ?? '';

export const getUserId = () => SupabaseClient.auth.session()?.user?.id ?? '';

export const signIn = async (email: string, password: string) => {

    const { user, session, error } = await SupabaseClient
        .auth
        .signIn({ email, password });

    if (error) {
        throw error;
    }

    return { user, session };
};
