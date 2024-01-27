"use client"
import React from "react";
import { Card, CardFooter, Image, Button } from "@nextui-org/react";
import Link from 'next/link';

const SimpleCard = () => {
  return (
    <Card
      isFooterBlurred
      isPressable
      radius="lg"
      className="border-[none] w-1/3 h-2/3 sm: mr-0 md:mr-6 lg:mr-6" >
      <Link href="/writing/simpleWriting" passHref>
        <Image
          isZoomed
          alt="동화 생성 선택"
          className="object-cover "
          src="/images/pictures/sample1.webp"
          width="100%"  
          height="100%"
          />
        </Link>
        <Link href="/writing/simpleWriting" passHref>
          <CardFooter className="justify-center before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
            <Button className="text-tiny text-black " variant="light" color="primary" radius="lg" size="lg" style = {{fontSize : '1.25rem'}}>
              간단히 만들기
            </Button>
          </CardFooter>
        </Link>
    </Card>
  );
};

export default SimpleCard;

