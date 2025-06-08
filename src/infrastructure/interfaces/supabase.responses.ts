
export interface UserBook {
    user_id: string;
    isbn13: string;
    current_page: number;
    rating: [1, 2, 3, 4, 5, null];
    finished: boolean;
    updated_at: string;
    genre: string;
}
