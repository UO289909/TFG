
export type OpenLibraryResponseByIsbn = Record<string, BookData>;

export interface BookData {
    url:             string;
    key:             string;
    title:           string;
    authors:         Author[];
    number_of_pages: number;
    pagination:      string;
    by_statement:    string;
    identifiers:     Identifiers;
    publishers:      Publish[];
    publish_places:  Publish[];
    publish_date:    string;
    subjects:        Author[];
    subject_places:  Author[];
    subject_people:  Author[];
    subject_times:   Author[];
    notes:           string;
    links:           Link[];
    ebooks:          Ebook[];
    cover:           Cover;
}

export interface Author {
    url:  string;
    name: string;
}

export interface Cover {
    small:  string;
    medium: string;
    large:  string;
}

export interface Ebook {
    preview_url:  string;
    availability: string;
    formats:      Formats;
}

export interface Formats {
}

export interface Identifiers {
    goodreads:    string[];
    librarything: string[];
    isbn_10:      string[];
    isbn_13:      string[];
    oclc:         string[];
    openlibrary:  string[];
}

export interface Link {
    title: string;
    url:   string;
}

export interface Publish {
    name: string;
}
