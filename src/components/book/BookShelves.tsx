'use client';

import React, { useCallback, useEffect, useState } from 'react';
import BookSkeleton from '../skeleton/BookSkeleton';
import { BooksData } from '@/types/books';
import Link from 'next/link';
import Image from 'next/image';
import { HeartIcon } from '@/icons/HeartIcon';
import { EyeIcon } from '@/icons/EyeIcon';
import { XIcon } from '@/icons/XIcon';
import useSessionStorage from '@/hooks/useSessionStorage';
import { jwtDecode } from 'jwt-decode';
import debounce from 'lodash/debounce';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { getIconFilter } from '@/utils/IconFilter';
import { getSocket, initializeWebSocket } from '@/utils/websocket';
import Swal from 'sweetalert2';
import { getUserInfo } from '@/services/userService';
import { ProfileData } from '@/types/user';
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const bookCover = '/static/bookCover.png';
const personIcon = '/static/defaultAvatar.png';

interface ProfileProps {
  _id: string;
  avatar: string;
  name: string;
  bookshelfLink: string;
  likedBooksLink: string;
  userId: string;
  introduction: string;
}

interface UserProfileProps {
  _id: string;
  userId: string;
  nickname: string;
  avatar: string;
  introduction: string;
}

BookShelves.propTypes = {
  books: PropTypes.array.isRequired,
};

interface BookShelvesProps {
  books: Array<BooksData>;
  limit: number;
  search: string;
}

interface BookComponentProps {
  book: BooksData;
  index: number;
}

async function getUserProfile(_id: string) {
  if (!_id) {
    return;
  }
  const response = await fetch(`${API_URL}/users/profile/${_id}`, {
    method: 'GET',
  });

  return response.json();
}

async function getUserIdtoProfile(_id: string) {
  if (!_id) {
    return;
  }
  const response: ProfileData | null = await getUserInfo(_id);

  const response2 = await getUserProfile(response?.userId ?? '');

  return response2;
}

export const Book = ({ book, index }: BookComponentProps) => {
  const token = useSessionStorage('token');
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(book.likesCount ?? book.likes?.length);
  const [likeError, setLikeError] = useState(false);
  const [user, setUser] = useState<ProfileProps>({
    _id: '',
    avatar: '',
    bookshelfLink: '',
    likedBooksLink: '',
    name: '',
    userId: '',
    introduction: '',
  });

  const theme = useSelector((state: RootState) => state.theme.value);
  const iconFilter = getIconFilter(theme);

  const sendLikeRequestToServer = async (likeStatus: boolean) => {
    try {
      const method = likeStatus ? 'POST' : 'DELETE';
      const response = await fetch(`${API_URL}/books/${book._id}/likes`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to send like request to server');
      }
      const socket = getSocket();

      setLikeError(false);

      if (socket) {
        socket.emit('like', { bookId: book._id });
      }
      return await response.json();
    } catch (error) {
      setLikeError(true);

      setTimeout(() => {
        setLikeError(false);
      }, 1000);

      throw error;
    }
  };

  const debouncedFunction = debounce(async (prevLiked: boolean) => {
    try {
      const response = await sendLikeRequestToServer(prevLiked);
      if (response.likesCount) setLikeCount(response.likesCount);
      else if (response.likes) setLikeCount(response.likes.length);
      else setLikeCount(0);

      setLiked((prevLiked) => !prevLiked);
    } catch (error) {
      console.error('Failed to like/unlike the book:', error);
    }
  }, 500);

  const debouncedHandleLike = useCallback(() => {
    debouncedFunction(!liked);
  }, [debouncedFunction, liked]);

  useEffect(() => {
    let log = token ? jwtDecode(token) : null;
    let isLiked = book.likes?.some((like) => like === log?.sub);
    setLiked(isLiked ?? false);
    if (book.likesCount) setLikeCount(book.likesCount);
    else if (book.likes) setLikeCount(book.likes.length);
    else setLikeCount(0);
  }, [book, token]);

  let imageURL;

  try {
    const noBookImg =
      book.coverUrl && (book.coverUrl.startsWith('http://') || book.coverUrl.startsWith('https://'))
        ? book.coverUrl
        : bookCover;
    imageURL = book.thumbnail ? book.thumbnail : noBookImg;
  } catch (error) {
    imageURL = bookCover;
  }

  useEffect(() => {
    const fetchData = async () => {
      const setData = async (): Promise<UserProfileProps> => {
        if (typeof book.userId === 'string') {
          const data = await getUserIdtoProfile(book.userId);
          setUser(data);
          return data;
        } else {
          const data = await getUserProfile(book.userId?.userId ?? '');
          setUser(data);
          return data;
        }
      };

      const data = await setData();

      const _id = typeof book.userId === 'string' ? book.userId : book.userId?._id ?? '';

      const user: ProfileProps = {
        _id: _id,
        avatar: data.avatar ? data.avatar : personIcon,
        bookshelfLink: `/user/${encodeURIComponent(_id)}/bookshelf`,
        name: data.nickname ?? data.userId,
        userId: data.userId,
        introduction: data.introduction,
        likedBooksLink: `/user/${encodeURIComponent(_id)}/liked-books`,
      };
      setUser(user);
    };

    fetchData();
  }, [book]);
  useEffect(() => {
    const userToken = sessionStorage.getItem('token');
    if (userToken) {
      initializeWebSocket(userToken);
      // console.log('소켓셋팅됨');
    }
  }, []);
  useEffect(() => {
    const socket = getSocket();

    if (socket) {
      // socket.emit('like', { bookId: book._id });
      //여긴 유지
      // socket.on('like', (data) => {
      //   if (data.bookId === book._id) {
      //     console.log('Your book has received a like!',data);
      //     alert(`${data.message}`);
      //   }
      // });
    }

    return () => {
      if (socket) socket.off('like');
    };
  }, [book._id]);

  return (
    <div
      key={index}
      className="bg-opacity-10 backdrop-blur-sm rounded-lg overflow-hidden shadow-lg transition-shadow hover:shadow-2xl w-72"
    >
      <div className="object-center transition-transform duration-500 hover:scale-105 ">
        <Link as={`/book/${encodeURIComponent(book?._id ?? '')}`} href={''}>
          <Image
            src={imageURL}
            priority={index < 4}
            alt="Book Cover Image"
            className="object-contain w-full h-full "
            height={320}
            width={320}
            quality={100}
          />
        </Link>
      </div>

      <div className="p-4">
        <div className="flex  justify-center text-align-center">
          <div className="flex  justify-center text-md sm:text-md md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl font-bold text-base-content">
            <div className="text-center truncate max-w-60">{book.title}</div>
          </div>
        </div>
        <div className=" flex justify-between items-center mt-4 ">
          <div className="dropdown dropdown-top flex justify-start items-center">
            <div
              tabIndex={0}
              role="button"
              className="flex items-center rounded-4xl space-x-2 hover:bg-black/10 cursor-pointer"
            >
              <div className="avatar">
                <div className="w-6 h-6 md:w-7 md:h-7 xl:w-8 xl:h-8 2xl:w-10 2xl:h-10 rounded-full">
                  <Image
                    src={user.avatar ? user.avatar : personIcon}
                    alt={`${user.name}'s Avatar`}
                    width={64}
                    height={64}
                    quality={100}
                    style={{ filter: iconFilter }}
                  />
                </div>
              </div>
              <span className="truncate max-w-20 text-xs sm:text-xs md:text-sm lg:text-md xl:text-lg 2xl:text-xl font-semibold text-base-content">
                {user.name}
              </span>
            </div>
            <ul
              tabIndex={0}
              className={` dropdown-content z-10 menu p-2 shadow bg-base-200 rounded-box w-52`}
            >
              <Link href={user.bookshelfLink}>
                <li className="rounded-t hover:bg-base-300 py-2 px-4 block whitespace-no-wrap text-base-content">
                  책장 보기
                </li>
              </Link>
              {/* <Link href={user.likedBooksLink}>
                <li className="rounded-t hover:bg-base-300 py-2 px-4 block whitespace-no-wrap text-base-content">
                  좋아요한 책 보기
                </li>
              </Link> */}

              {/* <li className="rounded-t hover:bg-base-200 py-2 px-4 block whitespace-no-wrap text-base-content">
                친구 추가
              </li> */}
            </ul>
          </div>

          <div className="flex justify-end items-center mt-1">
            <div className="flex items-center space-x-2">
              <EyeIcon className="w-4 h-4 text-gray-500" />
              <span className="text-xs sm:text-xs md:text-sm lg:text-md xl:text-lg 2xl:text-xl text-base-content">
                {book.count}
              </span>
            </div>
            <div className="flex items-center  ml-2">
              <button
                className={`btn btn-ghost btn-circle btn-sm  ${
                  token ? '' : 'hover:bg-transparent hover:text-current'
                }`}
                onClick={
                  token
                    ? debouncedHandleLike
                    : () => {
                        Swal.fire({
                          icon: 'error',
                          title: '로그인 필요',
                          text: '좋아요를 누르기 위해서는 로그인이 필요합니다.',
                          confirmButtonText: '확인',
                        });
                      }
                }
              >
                {likeError ? (
                  <span>
                    <XIcon />
                  </span>
                ) : (
                  <HeartIcon
                    height={128}
                    width={128}
                    className={`${
                      liked && token && !likeError ? 'fill-current text-red-500' : 'text-gray-500'
                    }`}
                  />
                )}
              </button>

              <span className="text-xs sm:text-xs md:text-sm lg:text-md xl:text-lg 2xl:text-xl text-base-content">
                {likeCount}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function BookShelves({ books = [], limit, search }: BookShelvesProps) {
  return (
    <>
      {Array.isArray(books) && books.length === 0 ? (
        <div className="flex justify-center items-center w-full h-96">
          <span className="text-base-content text-2xl">결과가 없습니다.</span>
        </div>
      ) : (
        // <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-1 md:gap-4 2xl:gap-8">
        //   <BookSkeleton cnt={24} />
        // </div>
        Array.isArray(books) &&
        books.map((book, index) => <Book key={index} book={book} index={index} />)
      )}
    </>
  );
}