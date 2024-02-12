import { BooksData } from '@/types/books';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface BooksResponse {
  total: number;
  books: BooksData[];
}

export interface GetParams {
  page: number;
  limit: number;
  sort: string;
  search: string;
}

async function GET(url: string): Promise<BooksResponse> {
  try {
    return (await fetch(url, { cache: 'no-store' })).json();
  } catch (error: any) {
    return error.message;
  }
}

export async function getUserBooks(page = 1, limit = 24, sort = '', search = '', id = '') {
  const data = await GET(`${API_URL}/books?page=${page}&limit=${limit}&userId=${id}`);
  return data;
}

export async function getAllBooks(page = 1, limit = 24, sort = '', search = '', id = '') {
  const data = await GET(
    `${API_URL}/books?page=${page}&limit=${limit}&title=${search}&sort=${sort}&userId=${id}`,
  );
  return data;
}
