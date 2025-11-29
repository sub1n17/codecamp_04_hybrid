'use client';

import Image from 'next/image';
import style from './styles.module.css';
import Link from 'next/link';
import { FormProvider, useForm } from 'react-hook-form';
import { InputNormal } from '@/src/components/input';

const imgSrc = {
    arr_left: '/icons/left_icon.png',
    arr_right: '/icons/right_icon.png',
    add_img: '/images/add_img.png',
};

export default function NewPage() {
    const { ...methods } = useForm();
    const onClickSubmit = () => {};

    return (
        <div className={style.container}>
            <div className={style.title_wrapper}>
                <button className={style.btn_prev}>
                    <div className={style.icon_left}>
                        <Image src={imgSrc.arr_left} alt="arr_left" fill></Image>
                    </div>
                </button>
                <div className={style.title_new}>플레이스 등록</div>
            </div>
            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(onClickSubmit)} className={style.form_wrapper}>
                    {/* 사진 등록 */}
                    <div>
                        <div className={style.img_add}>
                            <Image
                                src={imgSrc.add_img}
                                alt="add_img"
                                width={100}
                                height={100}
                            ></Image>
                        </div>
                    </div>
                    {/* 플레이스 이름 */}
                    <div>
                        <div className={style.form_title}>
                            플레이스 이름 <span>*</span>
                        </div>
                        <InputNormal
                            keyname={'title'}
                            placeholder={'플레이스 이름을 입력해 주세요. (1자 이상)'}
                        ></InputNormal>
                    </div>
                    {/* 플레이스 주소 */}
                    <div>
                        <div className={style.form_title}>플레이스 주소</div>
                        <Link href={''} className={style.address_button}>
                            <div>플레이스 주소 입력</div>
                            <div className={style.icon_right}>
                                <Image src={imgSrc.arr_right} alt=" arr_right" fill></Image>
                            </div>
                        </Link>
                    </div>
                    {/* 플레이스 내용 */}
                    <div>
                        <div className={style.form_title}>
                            플레이스 내용 <span>*</span>
                        </div>
                        <textarea
                            placeholder="플레이스 내용을 입력해 주세요. (1자 이상)"
                            {...methods.register('contents')}
                            className={style.form_textarea}
                        >
                            {/* <div>0/100</div> */}
                        </textarea>
                    </div>
                </form>
            </FormProvider>
            {/* 등록 버튼 */}
            <button onClick={onClickSubmit}>로그 등록</button>
        </div>
    );
}
