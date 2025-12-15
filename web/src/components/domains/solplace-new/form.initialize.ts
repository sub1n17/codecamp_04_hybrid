'use client';

import { useDeviceSetting } from '@/src/commons/settings/device-setting/hook';
import { newSchemaType } from './schema';
import { useMutation } from '@apollo/client';
import { CREATE_SOLPLACE_LOG } from '@/src/commons/apis/graphql/mutations/create-solplace-log';
import { useRouter, useSearchParams } from 'next/navigation';

export const useInitializeNew = () => {
    const { fetchApp } = useDeviceSetting();
    const searchParams = useSearchParams();
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    const address = searchParams.get('address');

    const [createSolplaceLog] = useMutation(CREATE_SOLPLACE_LOG);
    const router = useRouter();
    const onClickSubmit = async (data: newSchemaType) => {
        const result = await createSolplaceLog({
            variables: {
                createSolplaceLogInput: {
                    title: data.title,
                    contents: data.contents,
                    lat: lat,
                    lng: lng,
                    address: address,
                },
            },
        });

        await fetchApp({ query: 'requestDeviceNotificationsForPermissionSolplaceLogNewSet' });
        await fetchApp({
            query: 'createDeviceNotificationsForSolplaceLogNewSet',
            variables: { solplaceLogId: result.data.createSolplaceLog.id },
        });
        router.push(`/solplace-logs/${result.data.createSolplaceLog.id}`);
    };

    return {
        onClickSubmit,
    };
};
