"use client"
import React, { useState, FC } from 'react';
import singleModal from '@/components/modal/singleModal';
import TwoModal from '@/components/modal/twoModal';

const ParentComponent = () => {
  const [modalShow, setModalShow] = useState(false);

  return (
    <div>
      <TwoModal />

    </div>
  );
};

export default ParentComponent;
