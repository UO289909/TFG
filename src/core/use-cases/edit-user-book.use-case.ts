import { databaseEditUserBook } from '../../infrastructure/database/books.repository';

export const editUserBook = async (
    isbn: string,
    author: string | null,
    pages: number | null,
    cover_url: string | null,
    release_year: number | null,
    start_date: string | null,
    finish_date: string | null,
    rating: number | null
): Promise<void> => {
    try {

        await databaseEditUserBook(
            isbn,
            author,
            pages,
            cover_url,
            release_year,
            start_date,
            finish_date,
            rating
        );

        return;

    } catch (error) {
        throw new Error(`Error editing book: ${error}`);
    }
};
