import { databaseRateUserBook } from '../../infrastructure/database/books.repository';

export const rateUserBook = async (
    isbn: string,
    rating: number,
    startDate: Date,
    finishDate: Date,
): Promise<void> => {

    try {
        await databaseRateUserBook(
            isbn,
            rating,
            startDate,
            finishDate
        );

        return;

    } catch (error) {
        throw new Error(`Error rating book: ${error}`);
    }
};
