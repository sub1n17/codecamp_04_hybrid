'use client';

import style from './styles.module.css';
import { InputNormal } from '@/src/components/commons/input';

import Form from '../../commons/form';
import { newSchema, newSchemaType } from './schema';
import { useInitializeNew } from './form.initialize';
import Textarea from '../../commons/textarea';
import Footer from '@/src/commons/layout/footer/footer';
import ImageUpload from '../../commons/image-upload';
import { AddressLink } from '../../commons/link';

import { useSearchParams } from 'next/navigation';

export default function SolPlaceNew() {
    const { onClickSubmit } = useInitializeNew();

    const searchParams = useSearchParams();
    const lat = searchParams.get('lat') || '37.5662952';
    const lng = searchParams.get('lng') || '126.9779451';
    const address = searchParams.get('address') || '플레이스 주소 입력';
    // const address = searchParams.get('address') || '서울특별시 중구 세종대로 110';

    return (
        <>
            <main className={style.container}>
                <Form<newSchemaType>
                    schema={newSchema}
                    onClickSubmit={onClickSubmit}
                    className={style.form_wrapper}
                >
                    <ImageUpload></ImageUpload>

                    <div>
                        <div className={style.form_title}>
                            플레이스 이름 <span>*</span>
                        </div>
                        <InputNormal
                            keyname={'title'}
                            placeholder={'플레이스 이름을 입력해 주세요. (1자 이상)'}
                        ></InputNormal>
                    </div>
                    <div>
                        <div className={style.form_title}>플레이스 주소</div>
                        <AddressLink
                            href={`/solplace-logs/new/map?lat=${lat}&lng=${lng}&address=${encodeURIComponent(
                                '서울특별시 중구 세종대로 110'
                            )}`}
                            linkText={address || '플레이스 주소 입력'}
                        ></AddressLink>
                    </div>
                    <div>
                        <div className={style.form_title}>
                            플레이스 내용 <span>*</span>
                        </div>

                        <Textarea
                            placeholder={'플레이스 내용을 입력해 주세요. (1자 이상)'}
                            keyname={'contents'}
                            className={style.form_textarea}
                        ></Textarea>
                    </div>

                    <Footer text={'로그 등록'}></Footer>
                </Form>
            </main>
        </>
    );
}
