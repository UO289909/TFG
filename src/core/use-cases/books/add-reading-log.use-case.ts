import { databaseAddReadingLog, databaseEditUserBook } from '../../../infrastructure/database/books.repository';

/**
 * Adds a reading log entry for a book.
 *
 * @param isbn The ISBN of the book.
 * @param current_page The current page the user is on.
 * @param new_page The new page the user has read up to.
 * @param date Optional date of the reading log entry. If not provided, uses the current date.
 */
export const addReadingLog = async (isbn: string, current_page: string, new_page: string, date?: Date): Promise<void> => {

    const logDate = date?.toISOString().slice(0, 10) ? date.toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10);
    const pageNum = Number(new_page) - Number(current_page);

    const logPromise = databaseAddReadingLog(isbn, logDate, pageNum);
    const updateCurrentPagePromise = databaseEditUserBook(isbn, null, null, Number(new_page), null, null, null, null, null);

    await Promise.all([logPromise, updateCurrentPagePromise]);

    return;

};
