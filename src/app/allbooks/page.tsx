'use client';

import { getAllBooks } from '@/components/book/AllBooks';
import BooksPage from '@/components/book/BooksPage';
import { BooksData } from '@/types/books';
import { Suspense } from 'react';
import { Hydrate, QueryClient, QueryClientProvider } from 'react-query';
import Loading from './loading';

const Page = () => {
  return (
    <div className="flex justify-center items-center p-5">
      <BooksPage userId="" />
    </div>
  );
};

export default Page;
