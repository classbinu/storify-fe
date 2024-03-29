'use client';
import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Autoplay } from 'swiper/modules';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { RootState } from '@/store/index';
import { setBookContent, setBookId } from '@/store/bookSlice';
import { resetText } from '@/store/textSlice';

const loadingTexts: string[] = [
  '와, 멋진 글이네요!',
  '요정에게 글을 보낼게요.',
  '글이 요정에게 전달되고 있어요.',
  '요정이 글을 받았어요.',
  '요정이 글을 읽고 있어요.',
  '요정이 어떤 동화로 바꿀 지 생각하고 있어요.',
  '곧 요정이 동화를 써 줄 거예요.',
];

const ComplexWaitingPage: React.FC = () => {
  const dispatch = useDispatch();
  const texts = useSelector((state: RootState) => state.text.texts);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const router = useRouter();
  let token: string | null = null;

  if (typeof window !== 'undefined') {
    token = sessionStorage.getItem('token');
  }

  useEffect(() => {
    const combinedText = texts.join(' ');
    const fetchData = async () => {
      if (isSuccess) return;

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai/stories`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ message: combinedText }),
        });

        if (response.ok) {
          const data = await response.json();
          dispatch(setBookContent(data.content));
          dispatch(setBookId(data.story._id));
          resetText();
          setIsSuccess(true);
        } else {
          alert('제출에 실패했습니다. 다시 시도해주세요.');
        }
      } catch (error) {
        alert('에러가 발생했습니다. 다시 시도해주세요.');
      }
    };

    fetchData();
  }, [texts, isSuccess, dispatch, token]);

  useEffect(() => {
    if (isSuccess) {
      router.push(`/writing/complex/result`);
    }
  }, [isSuccess, router]);

  return (
    <div className="w-w-[90vw] sm:w-[85vw] md:w-[80vw] lg: w-[75vw] xl:w-[70vw] h-[60vh] flex flex-col justify-center items-center ">
      <Swiper
        spaceBetween={0}
        centeredSlides={true}
        loop={true}
        direction="vertical"
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        modules={[Autoplay]}
        className="mySwiper"
        style={{ width: '100%', height: '40%' }}
      >
        {loadingTexts.map((loadingText, index) => (
          <SwiperSlide key={index}>
            <h1 className="text-xl sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl text-center font-bold text-base-content">
              {loadingText}
            </h1>
          </SwiperSlide>
        ))}
      </Swiper>
      {!isSuccess && <span className="loading loading-dots loading-lg text-accent"></span>}
    </div>
  );
};

export default ComplexWaitingPage;
