import { deleteUserBook } from '../../infrastructure/database/books.repository';

export const deleteBookFromLibrary = async (
    isbn: string
): Promise<void> => {

    try {
        await deleteUserBook(
            isbn
        );

        console.log('Libro eliminado.');

        return;

    } catch (error) {
        throw new Error(`Error deleting book: ${error}`);
    }
};
