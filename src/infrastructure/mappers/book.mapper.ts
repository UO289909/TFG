import { Book } from '../../core/entities/book.entity';
import { BookData, Doc } from '../interfaces/open-library.responses';
import { DatabaseBook } from '../interfaces/supabase.responses';


export class BookMapper {

    static fromOpenLibraryResponseToEntity(response: BookData): Book {
        return {
            isbn: response.identifiers.isbn_13?.[0] || response.identifiers.isbn_10?.[0],
            title: response.title,
            author: response.authors?.[0]?.name || null,
            pages: response.number_of_pages !== null && response.number_of_pages !== undefined
                ? response.number_of_pages.toString()
                : null,
            current_page: null,
            release_year: response.publish_date,
            cover_url: response.cover?.medium || null,
            rating: null,
            review: null,
            start_date: null,
            finish_date: null,
            created_at: null,
        };
    }

    static fromOpenLibrarySearchToEntity(response: Doc): Book {
        return {
            isbn: response.isbn?.[0],
            title: response.title,
            author: response.author_name?.[0] || null,
            pages: null,
            current_page: null,
            release_year: null,
            cover_url: response.cover_i ? `https://covers.openlibrary.org/b/id/${response.cover_i}-M.jpg` : null,
            rating: null,
            review: null,
            start_date: null,
            finish_date: null,
            created_at: null,
        }
    }

    static fromDatabaseBookToEntity(databaseBook: DatabaseBook): Book {
        return {
            isbn: databaseBook.isbn,
            title: databaseBook.title,
            author: databaseBook.author,
            pages: databaseBook.pages,
            current_page: null,
            release_year: databaseBook.release_year,
            cover_url: databaseBook.cover_url || null,
            rating: null,
            review: null,
            start_date: null,
            finish_date: null,
            created_at: null,
        };
    }
}
