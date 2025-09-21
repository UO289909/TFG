import { databaseAddReadingLog, databaseAlreadyLogged, databaseEditReadingLog, databaseEditUserBook } from '../../../infrastructure/database/books.repository';

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

    const alreadyLogged = await databaseAlreadyLogged(isbn, logDate);

    if (alreadyLogged) {
        await databaseEditReadingLog(isbn, logDate, null, Number(new_page));
    } else {
        await databaseAddReadingLog(isbn, logDate, Number(current_page), Number(new_page));
    }

    await databaseEditUserBook(isbn, null, null, Number(new_page), null, null, null, null, null);

    return;

};
