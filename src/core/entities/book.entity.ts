
export interface Book {
    isbn: string;
    title: string;
    pages: string | null;
    actual_page: string | null;
    cover_url: string | null;
    release_year: string | null;
    author: string | null;
    rating: 1 | 2 | 3 | 4 | 5 | null;
    start_date: string | null;
    finish_date: string | null;
    created_at: string | null;
}
