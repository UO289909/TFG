import { Book } from '../../core/entities/book.entity';
import { BookData } from '../interfaces/open-library.responses';
import { DatabaseBook } from '../interfaces/supabase.responses';


export class BookMapper {

    static fromOpenLibraryResponseToEntity(response: BookData): Book {
        return {
            isbn: response.identifiers.isbn_13?.[0] || response.identifiers.isbn_10?.[0],
            title: response.title,
            author: response.authors[0].name,
            pages: response.number_of_pages.toString(),
            release_year: response.publish_date,
            cover_url: response.cover?.medium || null,
        };
    }

    static fromDatabaseBookToEntity(databaseBook: DatabaseBook): Book {
        return {
            isbn: databaseBook.isbn,
            title: databaseBook.title,
            author: databaseBook.author,
            pages: databaseBook.pages,
            release_year: databaseBook.release_year,
            cover_url: databaseBook.cover_url || null,
        };
    }
}
