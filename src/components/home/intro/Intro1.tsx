'use client';
import React, { useEffect } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import { EffectCoverflow, Autoplay, Pagination } from 'swiper/modules';
import 'aos/dist/aos.css';
import AOS from 'aos';
import IntroHeading from './IntroHeading';
import IntroText from './IntroText';

const Intro1: React.FC = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
    });
  }, []);

  const images = [
    'https://s3.ap-northeast-2.amazonaws.com/storify/public/1-1708592079757.png',
    'https://s3.ap-northeast-2.amazonaws.com/storify/public/4-1708592098720.png',
    'https://s3.ap-northeast-2.amazonaws.com/storify/public/2-1708592125784.png',
    'https://s3.ap-northeast-2.amazonaws.com/storify/public/3-1708592136624.png',
    'https://s3.ap-northeast-2.amazonaws.com/storify/public/5-1708592147827.png',
    'https://s3.ap-northeast-2.amazonaws.com/storify/public/6-1708592157119.png',
    'https://s3.ap-northeast-2.amazonaws.com/storify/public/4-1708592098720.png',
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <IntroHeading>어린이들이 만든 <span className="text-accent">AI 동화책</span></IntroHeading>
      <IntroText>모든 동화책을 무료로 이용할 수 있습니다.</IntroText>
      <div className="max-w-[100vw] mt-5">
        <Swiper
          effect={'coverflow'}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={'auto'}
          loop={true}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          coverflowEffect={{
            rotate: 50,
            stretch: 0,
            depth: 50,
            modifier: 1,
            slideShadows: true,
          }}
          pagination={true}
          modules={[EffectCoverflow, Pagination, Autoplay]}
          className="mySwiper"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          {images.map((src, index) => (
            <SwiperSlide
              key={index}
              style={{ width: '50vw', position: 'relative' }}
            >
              <Image
                src={src}
                alt={`Slide ${index}`}
                width={720}
                height={360}
                quality={75}
                sizes="50vw"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default Intro1;
