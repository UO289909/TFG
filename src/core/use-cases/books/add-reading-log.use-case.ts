import { databaseAddReadingLog, databaseEditUserBook } from '../../../infrastructure/database/books.repository';

/**
 * Adds a reading log entry for a book.
 *
 * @param isbn The ISBN of the book.
 * @param current_page The current page the user is on.
 * @param new_page The new page the user has read up to.
 */
export const addReadingLog = async (isbn: string, current_page: string, new_page: string): Promise<void> => {

    const date = new Date().toISOString();
    const pageNum = Number(current_page) - Number(new_page);

    const logPromise = databaseAddReadingLog(isbn, date, pageNum);
    const updateCurrentPagePromise = databaseEditUserBook(isbn, null, null, Number(new_page), null, null, null, null, null);

    await Promise.all([logPromise, updateCurrentPagePromise]);

    return;

};
