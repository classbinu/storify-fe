'use client';

import React, { useState, useEffect } from 'react';
import BookShelves from '@/components/book/BookShelves';

import Pagination from '@/components/Pagination';
import { SearchIcon } from '@/components/icons/SearchIcon';
import useBooksData from '@/hooks/useBooksData';
import usePagination from '@/hooks/usePagination';
import { jwtDecode } from 'jwt-decode';
import { redirect } from 'next/navigation';

interface UseBooksDataProps {
  userId: string;
}
interface BookListProps{
  userId:string;
}
interface userIDProps {
  _id: string;
  nickname: string;
  userId: string;
}

async function GET(url: string): Promise<userIDProps> {
  try {
    return (await fetch(url, { cache: 'no-store' })).json();
  } catch (error: any) {
    return error.message;
  }
}

async function getOtherUserId(userId: string) {
  const response = await GET(process.env.NEXT_PUBLIC_API_URL + `/users/${userId}`);
  return response;
}

const BooksPage: React.FC<UseBooksDataProps> =({ userId }: UseBooksDataProps) => {
  const sortOptions = [
    { label: '최신순', value: 'recent' },
    { label: '좋아요순', value: 'like' },
    { label: '조회순', value: 'count' },
  ];

  // let id = '';
  const [otherNickname, setOtherNickname] = useState('');
  const [shelfTitle, setShelfTitle] = useState('');
  let id=sessionStorage.getItem('token');
  
  if (typeof window !== 'undefined' && userId) {
    if (id !== '') {
      id = jwtDecode(sessionStorage.getItem('token') || '')?.sub as string;
      const getDatas = async () => {
        const data = await getOtherUserId(userId);
        setOtherNickname(data.nickname);
      };
      getDatas();
    }
  }

  useEffect(() => {
    setShelfTitle(userId ? (id === userId ? '내 책장' : otherNickname + '님의 책장') : '');
  }, [userId, id, otherNickname]);

  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState<number>(24);
  const [writeSearch, setWriteSearch] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>(sortOptions[0].value);

  const { bookShelves, totalItems, isLoading } = useBooksData({
    currentPage,
    limit,
    sortBy,
    search,
    userId: userId,
  });

  const { totalPage, paginate } = usePagination({
    totalItems,
    itemsPerPage: limit,
    onPageChange: setCurrentPage,
  });

  const handleSortBy = (value: string) => {
    setSortBy(value);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWriteSearch(e.target.value);
  };

  const handleSearch = () => {
    setSearch(writeSearch);
  };

  return (
    <>
      <div className="flex flex-col w-full pl-[4vw] pr-[4vw]">
        <div className="flex flex-col sm:flex-row justify-between items-center w-full p-8 ">
          <div role="tablist" className="tabs tabs-lifted relative justify-start p-5 ">
            {sortOptions.map((option) => (
              <a
                role="tab"
                key={option.value}
                className={`tab whitespace-nowrap text-xs sm:text-xs md:text-sm lg:text-md xl:text-lg 2xl:text-xl ${sortBy === option.value ? 'tab-active' : ''}`}
                onClick={() => handleSortBy(option.value)}
              >
                <span className="p-1">{option.label}</span>
              </a>
            ))}
          </div>
          <div
            className={`${userId ? '' : 'hidden'} flex justify-center text-xs sm:text-xs md:text-sm lg:text-md xl:text-lg 2xl:text-xl p-5`}
          >
            {shelfTitle}
          </div>

          <div className="relative justify-end p-5 ">
            <div className="flex border-2 rounded-full">
              <input
                className="form-input w-full bg-transparent py-1 sm:py-2 px-3 text-xs sm:text-xs md:text-sm lg:text-md xl:text-lg 2xl:text-xl focus:outline-none"
                id="search"
                type="search"
                placeholder="검색어를 입력하세요."
                value={writeSearch}
                onChange={handleInputChange}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSearch();
                }}
              />
              <button
                className="p-2 text-gray-500 rounded-full hover:bg-gray-100 focus:outline-none"
                onClick={handleSearch}
              >
                <SearchIcon size={30} />
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-center flex-wrap gap-4 p-4 mx-auto">
          <div className="flex flex-wrap justify-center gap-7 ">
            <BookShelves books={bookShelves} limit={limit} search={search} />
          </div>
        </div>
        <div className="mt-10">
          <div className="text-xs sm:text-base md:text-md lg:text-lg xl:text-xl 2xl:text-2xl ">
            <Pagination totalPage={totalPage} currentPage={currentPage} paginate={paginate} />
          </div>
        </div>
      </div>
    </>
  );
};

export default BooksPage;
