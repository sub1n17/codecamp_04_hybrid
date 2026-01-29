'use client';

import Footer from '@/src/commons/layout/footer/footer';
import { InputNormal } from '../../commons/input';
import { useInitializeLogIn } from './form.initialize';
import { loginSchema, LogInSchemaType } from './schema';
import style from './styles.module.css';
import Form from '../../commons/form';
import Splash from '../splash';

export default function LogIn() {
    console.log('로그인');
    const { onClickSubmit, tokenChecking } = useInitializeLogIn();

    // 리프레시 토큰 있으면 스플래시화면 보여주기
    if (tokenChecking) return <Splash></Splash>;

    return (
        <>
            <div className={style.title_wrapper}>로그인</div>
            <Form<LogInSchemaType>
                schema={loginSchema}
                onClickSubmit={onClickSubmit}
                className={style.form_wrapper}
            >
                <div>
                    <div className={style.form_title}>
                        이메일 <span>*</span>
                    </div>
                    <InputNormal
                        placeholder={'이메일을 입력해 주세요.'}
                        keyname={'email'}
                    ></InputNormal>
                </div>
                <div>
                    <div className={style.form_title}>
                        비밀번호 <span>*</span>
                    </div>
                    <InputNormal
                        placeholder={'비밀번호를 입력해 주세요.'}
                        keyname={'password'}
                        type="password"
                    ></InputNormal>
                </div>

                <Footer text={'로그인'} isLogin={true}></Footer>
            </Form>
        </>
    );
}
