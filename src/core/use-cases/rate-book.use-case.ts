import { rateUserBook } from '../../infrastructure/database/books.repository';

export const rateBook = async (
    isbn: string,
    rating: number,
    startDate: Date,
    finishDate: Date,
): Promise<void> => {

    try {
        await rateUserBook(
            isbn,
            rating,
            startDate,
            finishDate
        );

        console.log('Libro valorado.');

        return;

    } catch (error) {
        throw new Error(`Error rating book: ${error}`);
    }
};
