import { BooksData } from '@/types/books';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function GET(url: string): Promise<BooksData[]> {
    try {
        return (await fetch(url)).json();
    } catch (error: any) {
        return error.message;
    }
}

export async function getAllBooks() {
    const data = await GET(API_URL + '/api/books?page=1');
    const makeBookButton = {
        _id: 'makeBookButton',
        title: 'makeBookButton',
        userId: '',
        storyId: '',
    };
    const allBooks = [...data, makeBookButton];
    console.log('in allbooks', allBooks);

    return allBooks;
}
