'use client';

import { useDeviceSetting } from '@/src/commons/settings/device-setting/hook';
import { newSchemaType } from './schema';
import { useRouter, useSearchParams } from 'next/navigation';
import { gql, useMutation } from '@apollo/client';
import { useSolPlaceNewStore } from '@/src/commons/stores/solplaceNew-store';
import { message } from 'antd';

const UPLOAD_FILE = gql`
    mutation uploadFile($file: File) {
        uploadFile(file: "") {
            url
        }
    }
`;

const CREATE_PLACE = gql`
    mutation createSolplaceLog($createSolplaceLogInput: CreateSolplaceLogInput!) {
        createSolplaceLog(createSolplaceLogInput: $createSolplaceLogInput) {
            id
            title
            contents
            address
            lat
            lng
            addressCity
            addressTown
            images
        }
    }
`;

export const useInitializeNew = () => {
    const { fetchApp } = useDeviceSetting();
    const searchParams = useSearchParams();
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    const address = searchParams.get('address');

    const [createLog] = useMutation(CREATE_PLACE);
    const [uploadFile] = useMutation(UPLOAD_FILE);
    const router = useRouter();

    // zustand
    const { files } = useSolPlaceNewStore();

    // 로그인 등록
    const onClickSubmit = async (data: newSchemaType) => {
        try {
            // 사진 업로드 후 url 받아오기
            const imagesUrl = await Promise.all(
                files.map((el) => {
                    uploadFile({ variables: { file: el } });
                })
            );

            const result = await createLog({
                variables: {
                    createSolplaceLogInput: {
                        title: data.title,
                        contents: data.contents,
                        address: address,
                        lat: Number(lat),
                        lng: Number(lng),
                        images: imagesUrl,
                    },
                },
            });

            message.success('게시글이 등록되었습니다.');
            router.push(`/solplace-logs`);
            // router.push(`/solplace-logs/${result.data.createSolplaceLog.id}`);

            // 등록 완료 시, 알람 권한 요청
            await fetchApp({ query: 'requestDeviceNotificationsForPermissionSolplaceLogNewSet' });

            // 등록 완료 시, 알람 요청
            await fetchApp({
                query: 'createDeviceNotificationsForSolplaceLogNewSet',
                variables: { solplaceLogId: result.data.createSolplaceLog.id },
            });
        } catch (error) {
            alert((error as Error).message);
        }
    };

    return {
        onClickSubmit,
    };
};
