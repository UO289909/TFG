import { databaseGetReadingLogs } from '../../../infrastructure/database/books.repository';
import { DatabaseReadingLog } from '../../../infrastructure/interfaces/supabase.responses';

/**
 * Gets reading logs, optionally filtered by user and/or book ISBN.
 * @param user Optional user ID to filter logs by, if not specified uses the current user.
 * @param isbn Optional book ISBN to filter logs by.
 * @returns A list of reading logs matching the specified criteria.
 */
export const getReadingLogs = async (
    user?: string,
    isbn?: string,
): Promise<DatabaseReadingLog[]> => {

    const logs = await databaseGetReadingLogs(user, isbn);
    return logs;

};
