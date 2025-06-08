
export interface UserBook {
    user_id: string;
    isbn13: string;
    current_page: number;
    rating: [0, 1, 2, 3, 4, 5, null];
}
