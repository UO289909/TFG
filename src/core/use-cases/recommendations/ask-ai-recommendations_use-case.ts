import { databaseAskAIRecommendations } from '../../../infrastructure/database/recommendations.repository';
import { Book } from '../../entities/book.entity';
import { Recommendation } from '../../entities/recommendation.entity';


export const askAIRecommendations = async (
    books: Book[]
): Promise<Recommendation[]> => {

    const formattedBooks = books.map(book => ({
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        rating: book.rating,
    }));

    try {

        const recommendations = await databaseAskAIRecommendations(formattedBooks);
        return recommendations;

    } catch (error) {
        return [];
    }

};
