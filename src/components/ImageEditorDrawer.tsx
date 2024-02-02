"use client"
import React, { useState,useEffect } from 'react';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Image from 'next/image';

const ImageEditorDrawer = ({ isOpen, onClose, onImageDrop ,hellopage,bookId}) => {
  const [editedImageUrl, setEditedImageUrl] = useState('');
  // const [imageList, setImageList] = useState(Array(4).fill(null));
  //const [imageUrls, setImageUrls] = useState([
    // 'https://s3.ap-northeast-2.amazonaws.com/storify/public/ai1-1706699591500.jpeg',
    // 'https://s3.ap-northeast-2.amazonaws.com/storify/public/ai2-1706699626175.jpeg',
    // 'https://s3.ap-northeast-2.amazonaws.com/storify/public/ai3-1706699643732.jpeg',
    // 'https://s3.ap-northeast-2.amazonaws.com/storify/public/ai6-1706699685087.jpeg',
  //]);

  // 0 1 2 2 4 3 6 4 8 5 10 6 
  // 1 1 3 2 5 3 7 4 9 5 11 6
  // 2 1 4 2 6 3 8 4 10 5
  const [imageUrls, setImageUrls] = useState([]);
  const token=sessionStorage.getItem('token');
  const realPageNumber=(hellopage+2)/2;
  console.log("내가 제대로 계산한게 맞나"+realPageNumber);

  const fetchImages = async () => {
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL + `/api/ai/books/${bookId}/${realPageNumber}/new-images`,{
        method:'GET',
        headers:{
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        }
      });
      console.log(`api/ai/books/${bookId}/${realPageNumber}/new-images`);
      console.log("요청은 보냈음");
      if (!response.ok) {
        throw new Error('이미지 못사져옴');
      }
      const data = await response.json();
      console.log(data);
      const fetchedImageUrls = data.map(imageData => imageData); // 이미지 데이터에서 base64 추출
fetchedImageUrls.forEach((imageUrl, index) => {
  console.log(`이미지 ${index + 1}의 base64 문자열: ${imageUrl}`);
});
      setImageUrls(fetchedImageUrls);



    } catch (error) {
      console.error('오류:', error);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [hellopage, bookId]);

  const handleDragOver = (e) => {
    e.preventDefault();
  };
  const handleDragStart = (e, imageUrl) => {
    e.dataTransfer.setData('text/plain', imageUrl);
  };
  console.log(hellopage+"여기 페이지 넘어왔다");
  console.log("북아이디다"+bookId);
  return (
    <Drawer anchor="bottom" open={isOpen} onClose={onClose} variant={"persistent"}>
      <List>
        <ListItem>
          <ListItemText primary="이미지 편집" />
        </ListItem>
      </List>
        <div
        // onDrop={(e) => handleDrop(e, 0)}
        onDragOver={handleDragOver}
        style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}
      >
        {imageUrls.length === 0 ? (
        <div>Loading...</div>
      ) : (
        imageUrls.map((imageUrl, index) => (
          <div
            key={index}
            draggable
            onDragStart={(e) => handleDragStart(e, imageUrl)}
            onDragOver={handleDragOver}
            style={{
              width: 'calc(25% - 10px)',
              height: '200px',
              border: '2px dashed #ddd',
              borderRadius: '20px',
            }}
          >
            <Image
              src={`data:image/jpeg;base64,${imageUrl}`}
              alt={`편집 중인 이미지 ${index + 1}`}
              width={200}
              height={200}
              layout="fixed"
              style={{
                objectFit: 'cover',
                width: '100%',
                height: '100%',
                borderRadius: '20px',
              }}
            />
          </div>
        ))
      )}
         
      </div>
    </Drawer>
  );
};

export default ImageEditorDrawer;