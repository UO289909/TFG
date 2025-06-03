import { Book } from '../../core/entities/book.entity';
import { BookData } from '../interfaces/open-library.responses';


export class BookMapper {

    static fromOpenLibraryResponseToEntity(response: BookData): Book {
        return {
            isbn: response.identifiers.isbn_13[0],
            title: response.title,
            authors: response.authors.map(author => author.name),
            pages: response.number_of_pages,
            publishDate: response.publish_date,
            cover: response.cover.medium,
        };
    }
}
