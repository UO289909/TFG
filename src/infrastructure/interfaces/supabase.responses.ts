
export interface UserBook {
    user_id: string;
    isbn13: string;
    rating: [1, 2, 3, 4, 5, null];
    pages: number | null;
    cover_url: string | null;
    release_year: number | null;
    created_at: string;
    start_date: string;
    finish_date: string | null;
}

export interface DatabaseBook {
    isbn13: string;
    title: string;
    pages: number | null;
    cover_url: string | null;
    release_year: number | null;
}
