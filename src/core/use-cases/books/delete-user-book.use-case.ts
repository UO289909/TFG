import { databaseDeleteUserBook } from '../../../infrastructure/database/books.repository';

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
