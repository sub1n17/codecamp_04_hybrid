'use client';

export const dynamic = 'force-dynamic';

import Footer from '@/src/commons/layout/footer/footer';
import Form from '../../commons/form';
import { InputNormal } from '../../commons/input';
import { useInitializeSignUp } from './form.initialize';
import { signupSchema, signUpSchemaType } from './schema';
import style from './styles.module.css';

export default function SignUp() {
    const { onClickSubmit, signUpSuccessModal } = useInitializeSignUp();
    return (
        <>
            <div className={style.title_wrapper}>
                <div className={style.signup_title}>회원가입</div>
                <div className={style.signup_subtitle}>
                    회원가입을 위해 필요한 정보를 모두 입력해 주세요.
                </div>
            </div>
            <Form<signUpSchemaType>
                schema={signupSchema}
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
                        이름 <span>*</span>
                    </div>
                    <InputNormal
                        placeholder={'이름을 입력해 주세요.'}
                        keyname={'name'}
                    ></InputNormal>
                </div>
                <div>
                    <div className={style.form_title}>
                        비밀번호 <span>*</span>
                    </div>
                    <InputNormal
                        placeholder={'비밀번호를 입력해 주세요.'}
                        keyname={'password'}
                    ></InputNormal>
                </div>
                <div>
                    <div className={style.form_title}>
                        비밀번호 확인 <span>*</span>
                    </div>
                    <InputNormal
                        placeholder={'비밀번호를 한번 더 입력해 주세요.'}
                        keyname={'passwordCheck'}
                    ></InputNormal>
                </div>
                <Footer text={'가입하기'}></Footer>
            </Form>
            {/* 회원가입 모달창 */}
            {signUpSuccessModal}
        </>
    );
}
