'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/index';
import { setBookId, setImageUrls } from '@/store/bookSlice';

interface BookResponseData {
  _id: string;
  body: Record<string, ImageItem>;
}

interface ImageItem {
  imageUrl: string;
}
const Skeleton = () => {
  return <div className="skeleton w-16 sm:w-20 md:w-24 lg:w-36 xl:w-48 2xl:w-60"></div>;
};

const SimpleResultPage: React.FC = () => {
  const dispatch = useDispatch();
  let token: string | null = null;
  const bookContent = useSelector((state: RootState) => state.book.content);
  const bookId = useSelector((state: RootState) => state.book.bookId);
  const imageUrls = useSelector((state: RootState) => state.book.imageUrls);
  const [displayedText, setDisplayedText] = useState('');
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [realImagesLoaded, setRealImagesLoaded] = useState(false);
  const [isTypingCompleted, setIsTypingCompleted] = useState(false);
  const [isImageBlurCompleted, setIsImageBlurCompleted] = useState(false);
  const [showNavigateButton, setShowNavigateButton] = useState(false);



  if (typeof window !== 'undefined') {
    token = localStorage.getItem('token');
  }

  useEffect(() => {
    if (realImagesLoaded || !bookContent || !bookId) {
      return;
    }
    const sendBookData = async () => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ai/books`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`, // token은 적절히 설정해야 합니다.
            },
            body: JSON.stringify({
              imageStyle: 'cartoon',
              aiStory: bookContent,
              storyId: bookId,
            }),
          });
          if (response.ok) {
            const responseData = (await response.json()) as BookResponseData;
            dispatch(setBookId(responseData._id));
            const imageUrls = Object.values(responseData.body).map(
              (item: ImageItem) => item.imageUrl,
            );
            dispatch(setImageUrls(imageUrls));
            setRealImagesLoaded(true);
          }
        } catch (error) {
          console.error('Error:', error);
        }
    };

    sendBookData();
  }, [bookContent, bookId, realImagesLoaded, token, dispatch]); 

    useEffect(() => {
      if (imageUrls.length > 0 && !realImagesLoaded) {
        setRealImagesLoaded(true);
      }
    }, [imageUrls, realImagesLoaded]);

  useEffect(() => {
    setDisplayedText('');
    let i = 0;
    const typingEffect = (currentText: string) => {
      if (i < bookContent.length) {
        setDisplayedText(currentText + bookContent[i]);
        i++;
        setTimeout(() => typingEffect(currentText + bookContent[i - 1]), 50);
      }
    };

    if (bookContent) {
      typingEffect('');
    }
  }, [bookContent]);

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.scrollTop = textAreaRef.current.scrollHeight;
    }
  }, [displayedText]);

  useEffect(() => {
    if (displayedText === bookContent) {
      setIsTypingCompleted(true);
    }
  }, [displayedText, bookContent]);

  useEffect(() => {
    if (isTypingCompleted) {
      setIsImageBlurCompleted(false);
      setTimeout(() => {
        setIsImageBlurCompleted(true);
        setTimeout(() => {
          if (bookId) {
            setShowNavigateButton(true);
          }
        }, 2000);
      }, 5000);
    }
  }, [isTypingCompleted, bookId]);

  useEffect(() => {
    const scrollToBottom = () => {
      window.scrollTo({
        left: 0,
        top: document.body.scrollHeight,
        behavior: 'smooth',
      });
    };

    if (realImagesLoaded || showNavigateButton) {
      scrollToBottom();
    }
  }, [realImagesLoaded, showNavigateButton]);

  return (
    <div className="w-[60vw]">
      <h1 className="text-sm sm:text-md md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl  font-bold mb-4">요정이 동화책을 만들고 있어요.</h1>
      <h2 className="text-sm sm:text-md md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl font-bold mb-4">잠시만 기다려 주세요.</h2>
      <div className="divider"></div>
      <textarea
        placeholder="여기에 간단히 적어줘"
        className="textarea textarea-bordered textarea-success textarea-lg w-full"
        rows={6}
        ref={textAreaRef}
        value={displayedText}
        readOnly
      ></textarea>
      <div className="divider"></div>
      <div className="flex justify-around gap-2">
      { realImagesLoaded ? (
        imageUrls.map((url, index) => (
          <Image
            key={index}
            src={url}
            alt={`Image ${index + 1}`}
            width={256}
            height={256}
            className="rounded-md blur-effect1 w-16 sm:w-20 md:w-24 lg:w-36 xl:w-48 2xl:w-60"
          />
        ))
      ) : (
        Array.from({ length: imageUrls.length || 3 }, (_, index) => (
          <Skeleton key={index} />
        ))
      )}

      </div>
      {showNavigateButton && (
        <Link href={`/book/${bookId}`} passHref>
          <button className="btn btn-outline btn-success btn-xm sm:btn-sm md:btn-md lg:btn-lg mt-4">
            책 보러 가기
          </button>
        </Link>
      )}
    </div>
  );
};
export default SimpleResultPage;