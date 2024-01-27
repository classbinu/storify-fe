"use client"
import React, { useState } from "react";
import { LoginData } from '@/types/auth';
import { Tabs, Tab, Input, Link, Button, Card, CardBody } from "@nextui-org/react";
// import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure} from "@nextui-org/react";
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import {login}from '@/store/userSlice';
import{signup}from '@/store/userSlice';
import Swal from 'sweetalert2';


function LoginPage() {
  const [selected, setSelected] = useState("login");


  // const [formData, setFormData] = useState<LoginData>({ username: '', password: '' });
  const dispatch = useAppDispatch();
  const loginStatus = useAppSelector(state => state.user.status);
  const loginError = useAppSelector(state => state.user.error);

  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const showLoginSuccessAlert = () => {
    Swal.fire({
      title: `로그인 성공`,
      text: '로그인에 성공했어요!',
      icon: 'success', 
      confirmButtonText: 'OK',
    }).then((result) => {
      if (result.value) {
        window.location.reload();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });
  }
  const showLoginFailedAlert = () => {
    Swal.fire({
      title: `로그인 실패`,
      text: '로그인에 실패했어요!',
      icon: 'error', 
      confirmButtonText: 'OK',
    }).then((result) => {
      if (result.value) {
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });
  }
  const showSignupSuccessAlert = () => {
    Swal.fire({
      title: `회원가입 성공`,
      text: '회원가입에 성공했어요!',
      icon: 'success', 
      confirmButtonText: 'OK',
    }).then((result) => {
      if (result.value) {
        window.location.reload();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });
  }
  const showSignupFailedAlert = () => {
    Swal.fire({
      title: `회원가입 실패`,
      text: '회원가입에 실패했어요!',
      icon: 'error', 
      confirmButtonText: 'OK',
    }).then((result) => {
      if (result.value) {
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });
  }
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };


  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(login({ username: formData.username, password: formData.password }))
    .then(() => {
      console.log("로그인 성공");
      showLoginSuccessAlert();
    })
    .catch((error) => {
      console.error("로그인 실패: ", error);
      showLoginFailedAlert();
    });
  console.log("여기까지 왔다");
  };




  const [formSignupData,setFormSignupData]=useState({
    username :'',
    email:'',
    password:''
  });
  const handleInputChangeSignup=(e)=>{
    const{name,value}=e.target;
    setFormSignupData({
      ...formSignupData,
      [name]:value
    });
  };
  const handleSignUpSubmit =async (e: React.FormEvent<HTMLFormElement>)  => {
    e.preventDefault();
    dispatch(signup({username:formSignupData.username, password:formSignupData.password, email:formSignupData.email})).then(()=>{
      showSignupSuccessAlert();
    }).catch((error)=>{
      console.log("회원가입 실패: ********* ",error);
      showSignupFailedAlert();
    });

    console.log("여기까지 옴");
  };

  return (
    <div className="flex flex-col w-full">
      <Card className="max-w-full w-[340px] h-[400px]">
        <CardBody className="overflow-hidden">
          <Tabs
            fullWidth
            size="md"
            aria-label="Tabs form"
            selectedKey={selected}
            onSelectionChange={setSelected}
          >
            <Tab key="login" title="로그인">
              <form className="flex flex-col gap-4" onSubmit={handleLoginSubmit}>
              <Input
        isRequired
        label="이름"
        placeholder="이름을 입력하세요"
        type="text"
        name="username"
        value={formData.username}
        onChange={handleInputChange}
      />
              <Input
        isRequired
        label="비밀번호"
        placeholder="비밀번호를 입력하세요"
        type="password"
        name="password"
        value={formData.password}
        onChange={handleInputChange}
      />
                <p className="text-center text-small">
                  계정이 없으신가요?{" "}
                  <Link size="sm" style={{color:'#FFC4D0'}}onPress={() => setSelected("sign-up")}>
                    회원가입
                  </Link>
                </p>
                <div className="flex gap-2 justify-end">
                  <Button type="submit" fullWidth style={{backgroundColor:'#FFC4D0'}}>
                    로그인
                  </Button>
                </div>
              </form>
            </Tab>
            <Tab key="sign-up" title="회원가입">
              <form className="flex flex-col gap-4 h-[300px]" onSubmit={handleSignUpSubmit}>
              <Input
        isRequired
        label="이름"
        placeholder="이름을 입력하세요"
        type="text"
        name="username"
        value={formSignupData.username}
        onChange={handleInputChangeSignup}
      />
              <Input
        isRequired
        label="비밀번호"
        placeholder="비밀번호를 입력하세요"
        type="password"
        name="password"
        value={formSignupData.password}
        onChange={handleInputChangeSignup}
      />
       <Input
        isRequired
        label="이메일"
        placeholder="이메일을 입력하세요"
        type="email"
        name="email"
        value={formSignupData.email}
        onChange={handleInputChangeSignup}
      />
                <p className="text-center text-small">
                  이미 계정이 있으신가요?{" "}
                  <Link size="sm" style={{color:'#FFC4D0'}}onPress={() => setSelected("login")}>
                    로그인
                  </Link>
                </p>
                <div className="flex gap-2 justify-end">
                  <Button type="submit" fullWidth style={{backgroundColor:'#FFC4D0'}}>
                    회원가입
                  </Button>
                </div>
              </form>
            </Tab>
          </Tabs>
        </CardBody>
      </Card>
    </div>
  );
}

export default LoginPage;