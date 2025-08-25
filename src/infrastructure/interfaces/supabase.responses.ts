
export interface UserBook {
    user_id: string;
    isbn: string;
    rating: 1 | 2 | 3 | 4 | 5 | null;
    pages: number | string | null;
    cover_url: string | null;
    release_year: number | null;
    created_at: string;
    start_date: string;
    finish_date: string | null;
    author: string | null;
}

export interface DatabaseBook {
    isbn: string;
    title: string;
    pages: string | null;
    cover_url: string | null;
    release_year: string | null;
    author: string | null;
}

export interface DatabaseUser {
    id: string;
    full_name: string;
    created_at: string;
    has_avatar: boolean;
}
