'use client';

import style from '../solplace-new/styles.module.css';
import { InputNormal } from '@/src/components/commons/input';

import Form from '../../commons/form';
import Textarea from '../../commons/textarea';
import Footer from '@/src/commons/layout/footer/footer';
import ImageUpload from '../../commons/image-upload';
import { AddressLink } from '../../commons/link';
import { editSchema } from './schema';
import { useInitializeEdit } from './form.initialize';
import { gql, useQuery } from '@apollo/client';
import { useParams } from 'next/navigation';

const FETCH_PLACE = gql`
    query fetchSolplaceLog($id: ID!) {
        fetchSolplaceLog(id: $id) {
            id
            title
            contents
            address
            lat
            lng
            images
        }
    }
`;

export default function SolPlaceDetailEdit() {
    const { onClickSubmit } = useInitializeEdit();

    // 조회하기
    const params = useParams();
    // const router = useRouter();

    const { data } = useQuery(FETCH_PLACE, {
        variables: {
            id: params.solplaceLogId,
        },
    });

    const placeAddress = data?.fetchSolplaceLog.address;
    const placeLat = data?.fetchSolplaceLog.lat;
    const placeLng = data?.fetchSolplaceLog.lng;

    // form 값 넣기
    const defaultValues = data?.fetchSolplaceLog
        ? {
              title: data.fetchSolplaceLog.title,
              contents: data.fetchSolplaceLog.contents,
          }
        : {};

    return (
        <>
            <main className={style.container}>
                <Form
                    schema={editSchema}
                    onClickSubmit={onClickSubmit}
                    className={style.form_wrapper}
                    defaultValues={defaultValues}
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
                            href={`/solplace-logs/${params.solplaceLogId}/edit/map?from=edit&id=${
                                params.solplaceLogId
                            }&lat=${placeLat}&lng=${placeLng}&address=${encodeURIComponent(
                                placeAddress ?? ''
                            )}`}
                            placeAddress={placeAddress}
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
                    <Footer text={'수정'}></Footer>
                </Form>
            </main>
        </>
    );
}
