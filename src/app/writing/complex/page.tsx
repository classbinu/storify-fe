'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addText } from '@/store/textSlice';
import Link from 'next/link';
import Image from 'next/image';

const messages = [
  '안녕, 만나서 반가워.',
  '난 글쓰기를 도와 줄 요정이야.',
  '대답은 자세하게 할 수록 좋아.',
  '언제, 어디에서, 누가, 무슨 일이 있었는지 알려 줄래?',
];

interface Exchange {
  question: string;
  answer: string;
}

const ComplexWritingPage: React.FC = () => {
  const [text, setText] = useState('');
  const dispatch = useDispatch();
  let token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const [audioSrc, setAudioSrc] = useState('');
  const [isQuestionLoading, setIsQuestionLoading] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [displayedMessages, setDisplayedMessages] = useState<string[]>([]);
  const [conversation, setConversation] = useState<Exchange[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Your browser does not support Speech API. Please try Google Chrome.');
      return;
    }
  
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'ko-KR';

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const speechEvent = event as SpeechRecognitionEvent;
      const transcript = Array.from(speechEvent.results)
        .map(result => result[0].transcript)
        .join('');
      setText(transcript);
      console.log(transcript);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      setError(`Speech recognition error: ${event.error}`);
      console.error(`Speech recognition error: ${event.error}`);
    };

  
    if (isListening) {
      recognition.start();
    } else {
      recognition.stop();
    }
  
    return () => {
      recognition.stop();
    };
  }, [isListening, dispatch]);

  const playKeypressSound = () => {
    if (currentAudio) {
      currentAudio.pause();
    }

    const newAudio = new Audio(
      'https://s3.ap-northeast-2.amazonaws.com/storify/public/chat-1706736584014.mp3',
    );
    newAudio.play();

    setCurrentAudio(newAudio);
  };

  const playAudio = async () => {
    try {
      const textToSpeak = messages.join(' ');
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/ai/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: textToSpeak }),
      });

      if (!response.ok) {
        throw new Error('TTS 요청 실패');
      }

      const data = await response.text();

      if (currentAudio) {
        currentAudio.pause();
      }
      const newAudioSrc = `data:audio/mp3;base64,${data}`;
      setAudioSrc(newAudioSrc);

      const audio = new Audio(newAudioSrc);
      await audio.play();
      setCurrentAudio(audio);
    } catch (error) {
      console.error('TTS 요청 중 에러 발생:', error);
    }
  };

// handleChange 함수도 업데이트하여 입력 필드의 상태를 직접 업데이트합니다.
const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  setText(event.target.value); // 입력 필드의 상태를 직접 업데이트
};
  const handleClick = () => {
    playKeypressSound();
    handleSendButtonClick();
  };

  const handleSendButtonClick = async () => {
    if (isSending || text.trim() === '') return; // 입력된 텍스트가 없거나 이미 전송 중인 경우 더 이상 진행하지 않음

    setIsSending(true);
    setIsQuestionLoading(true);
  
    dispatch(addText(text)); // 사용자가 입력한 텍스트를 전역 상태에 추가
    setText(''); // 입력 필드를 초기화
    const updatedConversation = [...conversation, { question: text, answer: '' }];
    setConversation(updatedConversation);
    const combinedMessages = updatedConversation.map((item) => item.question).join(' ');
    if (currentStep < 2) {
      try {
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/ai/question', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ message: combinedMessages }),
        });

        if (response.ok) {
          const responseText = await response.text();

          // TTS 요청
          const ttsResponse = await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/ai/tts', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ message: responseText }),
          });

          if (ttsResponse.ok) {
            const ttsData = await ttsResponse.text();
            const audioSrc = `data:audio/mp3;base64,${ttsData}`;
            const audio = new Audio(audioSrc);
            audio.play();
          } else {
            console.error('TTS 요청 실패');
          }
          setConversation((convo) =>
            convo.map((item, idx) =>
              idx === convo.length - 1 ? { ...item, answer: responseText } : item,
            ),
          );
          setCurrentStep(currentStep + 1);
        } else {
          console.error('Failed to send message');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
    setIsSending(false);
    setIsQuestionLoading(false);
  };

  useEffect(() => {
    // 이 효과는 초기에 표시된 메시지를 설정하기 위해 한 번만 실행되어야 합니다.
    let timeoutIds: NodeJS.Timeout[] = [];
    messages.forEach((message, index) => {
      const id = setTimeout(() => {
        setDisplayedMessages((prevMessages) => [...prevMessages, message]);
      }, 1000 * index);
      timeoutIds.push(id);
    });

    // 컴포넌트가 언마운트될 때 타임아웃을 클리어하는 정리 함수
    return () => {
      timeoutIds.forEach(clearTimeout);
    };
  }, []); // 의존성 배열을 빈 배열로 설정하여 마운트시에만 효과 실행

  useEffect(() => {
    // 대화가 추가되어 화면에 표시될 때마다 실행
    window.scrollTo({
      top: document.documentElement.scrollHeight, // 페이지의 맨 아래로 스크롤
      behavior: 'smooth' // 스크롤이 부드럽게 이동
    });
  }, [conversation]); // 대화 상태가 변경될 때마다 useEffect가 실행됩니다.

  return (
        <div className="w-[60vw]">
          <h1 className="text-3xl font-semibold mb-2">요정의 질문에 답을 해 보세요.</h1>
          <h1 className="text-3xl font-semibold mb-2">
            세 번만 대답하면 요정이 동화책을 만들어 줄 거예요.
          </h1>
          <div className="divider"></div>
          {displayedMessages.map((message, index) => (
            <div key={index} className="chat chat-start mb-2">
              <div className="chat-image avatar">
                <div className="w-16 rounded-full">
                  <Image
                    alt="Tailwind CSS chat bubble component"
                    src="https://s3.ap-northeast-2.amazonaws.com/storify/public/fairy-1706712996223.jpeg"
                    width={4000}
                    height={4000}
                  />
                </div>
              </div>
              <div className="flex">
                <div className="chat-bubble">{message}</div>
                {index === 0 && (
                  <button onClick={playAudio} className="btn btn-circle btn-outline ml-2">
                    <Image
                      src="https://s3.ap-northeast-2.amazonaws.com/storify/public/free-icon-speaker-volume-3606847-1706733545145.png"
                      width={30}
                      height={30}
                      alt="play audio"
                    />
                  </button>
                )}
              </div>
            </div>
          ))}
          {conversation.map((exchange, index) => (
            <div key={index}>
              <div className="chat chat-end ">
                <div className="chat-image avatar">
                  <div className="w-16 rounded-full ring ring-success ring-offset-base-100 ring-offset-2">
                    <Image
                      alt="Tailwind CSS chat bubble component"
                      src="https://s3.ap-northeast-2.amazonaws.com/storify/public/free-icon-person-7542670-1706734232917.png"
                      width={30}
                      height={30}
                    />
                  </div>
                </div>
                <div className="chat-bubble chat-bubble-success">{exchange.question}</div>
              </div>
              <div className="chat chat-start">
                <div className="chat-image avatar">
                  <div className="w-16 rounded-full">
                    <Image
                      alt="Tailwind CSS chat bubble component"
                      src="https://s3.ap-northeast-2.amazonaws.com/storify/public/fairy-1706712996223.jpeg"
                      width={30}
                      height={30}
                    />
                  </div>
                </div>
                {isQuestionLoading && index === conversation.length - 1 ? (
                  <div className="chat-bubble">
                    <span className="loading loading-dots loading-xs sm:loading-sm md:loading-md lg:loading-lg"></span>
                  </div>
                ) : (
                  <div className="chat-bubble">{exchange.answer}</div>
                )}
              </div>
            </div>
          ))}
          <div className="divider"></div>
          {currentStep < 3 && (
            <>
              <input
                className="input input-success input-bordered w-full"
                value={text}
                onChange={handleChange}
                autoFocus
                placeholder=""
                onKeyUp={(event) => {
                  if (event.key === 'Enter' && !event.shiftKey && !isSending) {
                    event.preventDefault();
                    playKeypressSound();
                    handleSendButtonClick();
                  }
                }}
              />
              <div className="flex justify-between mt-4">
                <Link href={`/writing`} passHref>
                  <button className="btn btn-outline btn-success btn-xm sm:btn-sm md:btn-md lg:btn-lg">
                    뒤로가기
                  </button>
                </Link>
                <button onClick={() => setIsListening((prevState) => !prevState)} className="btn btn-outline btn-primary btn-xs sm:btn-sm md:btn-md lg:btn-lg">
                  {isListening ? '마이크 끄기' : '마이크 켜기'}
                </button>
                {currentStep < 2 ? (
          <button
            className="btn btn-outline btn-success btn-xm sm:btn-sm md:btn-md lg:btn-lg"
            onClick={handleClick}
            disabled={isSending}
          >
            보내기
          </button>
        ) : (
          <Link href={`/writing/complex/waiting`} passHref>
            <button
              className="btn btn-outline btn-success btn-xm sm:btn-sm md:btn-md lg:btn-lg"
              disabled={isSending}
            >
              동화책 만들기
            </button>
          </Link>
        )}
              </div>
            </>
          )}
        </div>
  );
};

export default ComplexWritingPage;