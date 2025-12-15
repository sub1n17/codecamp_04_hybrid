import { Modal, Button } from 'antd';
import { useState } from 'react';
import style from './signupSuccessModal.module.css';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { gql, useMutation } from '@apollo/client';
import { signUpSchemaType } from './schema';

const SIGN_UP = gql`
    mutation signup($signupInput: SignupInput!) {
        signup(signupInput: $signupInput) {
            id
            email
            name
        }
    }
`;

export const useInitializeSignUp = () => {
    const router = useRouter();

    // 모달창 열고 닫기
    const [open, setOpen] = useState(false);

    const [sign_up] = useMutation(SIGN_UP);

    // 회원가입 버튼 클릭 시 모달창 열기
    const onClickSubmit = async (data: signUpSchemaType) => {
        try {
            // 회원가입 쿼리 요청
            await sign_up({
                variables: {
                    signupInput: {
                        email: data.email,
                        password: data.password,
                        name: data.name,
                    },
                },
            });

            setOpen(true);
        } catch (error) {
            Modal.error({
                title: '회원가입 실패',
                content: (error as Error).message,
                centered: true,
                width: '20rem',
            });
        }
    };

    // 모달창 버튼 클릭 시 로그인 페이지로 이동
    const onClickLogin = () => {
        setOpen(false);
        router.push('/onBoarding/login');
    };

    // 회원가입 축하 모달
    const signUpSuccessModal = (
        <Modal
            open={open}
            footer={null} // 버튼 커스텀하기
            centered // 모달 가운데에 보이게 하기
            closable={false} // 닫기 버튼 없애기
            className={style.modal}
            width="20rem"
            height="12.25rem"
        >
            <div className={style.title}>회원가입을 축하 드려요.</div>
            <div className={style.logo_img}>
                <Image src={'/images/modalLogo.png'} alt="로고" fill></Image>
            </div>

            <Button className={style.loginBtn} onClick={onClickLogin}>
                로그인 하기
            </Button>
        </Modal>
    );
    return { onClickSubmit, signUpSuccessModal };
};
