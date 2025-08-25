import { getUserId } from './auth.repository';
import { SupabaseClient } from './supabaseClient';

const AVATARS_BUCKET = 'avatars';

/**
 * Uploads a user's avatar to the database.
 * @param file The avatar file to upload.
 * @returns The file name of the uploaded avatar.
 */
export const databaseUploadMyAvatar = async (fileUri: string): Promise<string> => {

    const userId = getUserId();
    const fileName = `${userId}.webp`;

    const formData = new FormData();
    formData.append('file', {
        uri: fileUri,
        name: fileName,
        type: 'image/webp',
    } as any);

    const { error } = await SupabaseClient
        .storage
        .from(AVATARS_BUCKET)
        .upload(fileName, formData, { upsert: true, contentType: 'image/webp' });

    if (error) {
        console.log(`Error uploading avatar: ${error.message}`);
        throw new Error(`Error uploading avatar: ${error.message}`);
    }

    return fileName;
};


/**
 * Creates a signed URL for the user's avatar.
 * @param expiresInSeconds The duration in seconds for which the signed URL is valid.
 * @returns A promise that resolves to the signed URL.
 */
export const databaseCreateSignedAvatarUrl = async (
    expiresInSeconds = 3600
): Promise<string> => {

    const userId = getUserId();
    const avatarPath = `${userId}.webp`;


    const { data, error } = await SupabaseClient
        .storage
        .from(AVATARS_BUCKET)
        .createSignedUrl(avatarPath, expiresInSeconds);

    if (error || !data?.signedURL) {
        throw new Error('Error creating signed avatar URL');
    }

    return data.signedURL;

};
