"use client"
import React, { useState } from 'react';
import DoubleModal from '@/components/modal/doubleModal';
import Image from 'next/image';
import Link from 'next/link';
import SimpleCard from '@/components/objects/cards/simple';
import ComplexCard from '@/components/objects/cards/complex';

const Writing: React.FC = () => {
  const [modalShow, setModalShow] = useState(true);

  return (
    
    <div className="h-[100vh] w-full bg-pastelRed flex flex-col items-center p-1">
    <h1 className="text-6xl font-bold text-white">AI요정이 생성해 주는 동화</h1>
    <div className="w-full h-full flex flex-row justify-around items-center">
      <SimpleCard/>
      <ComplexCard/>
    </div>
    </div>
   
  );
};

export default Writing;

