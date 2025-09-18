import { Recommendation } from '../../core/entities/recommendation.entity';
import { SupabaseClient } from './supabaseClient';

export const databaseAskAIRecommendations = async (
    books: {
        title: string;
        author: string | null;
        isbn: string;
        rating: 1 | 2 | 3 | 4 | 5 | null;
    }[]
): Promise<Recommendation[]> => {

    const { data, error } = await SupabaseClient.functions.invoke('recommendations', {
        body: {
            'maxResults': 4,
            'books': books,
        },
    });

    if (error) {
        console.log('Error:', error);
        console.log('Data:', data);
        return [];
    }

    console.log('Data.recommendations:', data.recommendations);
    return data.recommendations;

};
