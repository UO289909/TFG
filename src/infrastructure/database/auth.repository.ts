import { SupabaseClient } from './supabaseClient';

export const signIn = async (email: string, password: string) => {

    const { user, session, error } = await SupabaseClient
        .auth
        .signIn({ email, password });

    if (error) {
        throw error;
    }

    return { user, session };
};
