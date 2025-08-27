import ImageResizer from '@bam.tech/react-native-image-resizer';
import { databaseUploadMyAvatar } from '../../../infrastructure/database/user.repository';

/**
 * Change the current user's avatar.
 * @param imageUri The URI of the image to be used as the new avatar.
 */
export const changeUserAvatar = async (imageUri: string): Promise<void> => {

    const treatedImage = await ImageResizer.createResizedImage(
        imageUri,
        512,
        512,
        'WEBP',
        80,
        0
    );

    const response = await fetch(treatedImage.uri);
    if (!response.ok) {
        throw new Error('Cannot read processed WEBP avatar');
    }

    await databaseUploadMyAvatar(treatedImage.uri);
};
