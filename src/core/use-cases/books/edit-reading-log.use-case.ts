import { databaseEditReadingLog } from '../../../infrastructure/database/books.repository';

/**
 * Edits a reading log entry in the database.
 * @param isbn The ISBN of the book.
 * @param reading_date The date of the reading session.
 * @param from_page The starting page of the reading session.
 * @param to_page The ending page of the reading session.
 * @returns A promise that resolves when the reading log entry has been updated.
 */
export const editReadingLog = async (
    isbn: string,
    reading_date: string,
    from_page: number | null,
    to_page: number | null
): Promise<void> => {

    await databaseEditReadingLog(isbn, reading_date, from_page, to_page);

    return;

};
