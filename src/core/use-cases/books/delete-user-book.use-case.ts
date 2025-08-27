import { databaseDeleteUserBook } from '../../../infrastructure/database/books.repository';

/**
 * Deletes a book from the user's collection by its ISBN.
 * @param isbn ISBN of the book to delete.
 */
export const deleteUserBook = async (
    isbn: string
): Promise<void> => {

    try {
        await databaseDeleteUserBook(
            isbn
        );

        console.log('Libro eliminado.');

        return;

    } catch (error) {
        throw new Error(`Error deleting book: ${error}`);
    }
};
