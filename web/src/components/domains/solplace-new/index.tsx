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
import { useSolPlaceNewStore } from '@/src/commons/stores/solplaceNew-store';

export default function SolPlaceNew() {
    const searchParams = useSearchParams();
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    const address = searchParams.get('address') || '플레이스 주소 입력';

    const { onClickSubmit } = useInitializeNew();

    // zustand
    const { title, setTitle, contents, setContents } = useSolPlaceNewStore();

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
                            value={title}
                            onChange={(event) => setTitle(event?.target.value)}
                        ></InputNormal>
                    </div>
                    <div>
                        <div className={style.form_title}>플레이스 주소</div>
                        <AddressLink
                            href={
                                `/solplace-logs/new/map?from=new` +
                                (lat ? `&lat=${lat}` : '') +
                                (lng ? `&lng=${lng}` : '') +
                                (address && address !== '플레이스 주소 입력'
                                    ? `&address=${encodeURIComponent(address)}`
                                    : '')
                            }
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
                            value={contents}
                            onChange={(event) => setContents(event?.target.value)}
                        ></Textarea>
                    </div>
                    <Footer text={'로그 등록'}></Footer>
                </Form>
            </main>
        </>
    );
}
