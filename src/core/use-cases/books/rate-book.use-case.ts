import { databaseRateUserBook } from '../../../infrastructure/database/books.repository';

/**
 * Adds a rating and reading dates to a user's book.
 * @param isbn ISBN of the book to be rated
 * @param rating Rating given by the user
 * @param review Optional review text provided by the user
 * @param startDate Date when the user started reading the book
 * @param finishDate Date when the user finished reading the book
 */
export const rateUserBook = async (
    isbn: string,
    rating: number,
    review: string | null,
    startDate: Date,
    finishDate: Date,
): Promise<void> => {

    try {
        await databaseRateUserBook(
            isbn,
            rating,
            review,
            startDate,
            finishDate
        );

        return;

    } catch (error) {
        throw new Error(`Error rating book: ${error}`);
    }
};
