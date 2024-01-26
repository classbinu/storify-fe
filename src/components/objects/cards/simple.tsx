import React from "react";
import { Card, CardFooter, Image, Button } from "@nextui-org/react";

const SimpleCard = () => {
  return (
    <Card
      isFooterBlurred
      radius="lg"
      className="border-none w-1/3 h-2/3"
      
    >
      <Image
        alt="동화 생성 선택"
        className="object-cover "
        src="/images/angels/signUp.png"
        width="100%"   // 이미지의 너비를 100%로 설정
        height="100%"
      />
      <CardFooter className="justify-center before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
        <Button className="text-tiny text-white bg-black/20" variant="flat" color="default" radius="lg" size="sm">
          단순생성
        </Button>
        
      </CardFooter>
    </Card>
  );
};

export default SimpleCard;
