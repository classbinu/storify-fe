"use client"
import React, { useState } from 'react';
import MediumImageButton from '@/components/buttons/imageButtons/mediumImageButton';
import LargeImageButton from '@/components/buttons/imageButtons/largeImageButton';
import SmallImageButton from '@/components/buttons/imageButtons/smallImageButton';
import SimpleWritingForm from '@/components/forms/writingForms/simpleWritingForm';
import EventsWritingForm from '@/components/forms/writingForms/eventsWritingForm';
import PeopleWritingForm from '@/components/forms/writingForms/peopleWritingForm';
import BackgroundWritingForm from '@/components/forms/writingForms/backgroundWritingForm';
import Card from '@/components/objects/cards/customCards/card';
import ClusterCard from '@/components/objects/cards/customCards/clusterCard';
import ClusterCardContainer from '@/components/objects/cards/customCards/clusterCardContainer';
import SimpleCard from '@/components/objects/cards/simple';
import ComplexCard from '@/components/objects/cards/complex';
import HomeDesign from '@/components/home/homeTest';
import ComplexWritingForm from '@/components/forms/writingForms/complexWritingForm';

import Drawer from '@/components/drawer/friend';
import FriendPage from '@/components/drawer/friendPage';


const TestBH: React.FC = () => {
  const [text, setText] = useState('');



  const menuItems = [
    { text: '홈', url: '/' },
    { text: '프로필', url: '/profile' },
    { text: '책장 1', url: '/'},
    { text: '책장 2', url: '/'},
    { text: '책장 3', url: '/'},
    { text: '책장 4', url: '/'},
  ];

  const handleCardClick = () => {
    console.log('클릭');
  };
  return (
    <div className="w-full h-[92vh] w-full flex flex-col items-center mt-10">
      <h1 className="text-4xl font-bold mb-4">자세히 만들기</h1>
      <div>
        <ComplexWritingForm  text={text} setText={setText}/>
      </div>
        
    </div>
  );
}

export default TestBH;