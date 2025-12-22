'use client';

import { gql, useMutation } from '@apollo/client';
import { editSchemaType } from './schema';
import { useParams } from 'next/navigation';

const UPDATE_LOG = gql`
    mutation updateSolplaceLog($id: ID!, $updateSolplaceLogInput: UpdateSolplaceLogInput!) {
        updateSolplaceLog(id: $id, updateSolplaceLogInput: $updateSolplaceLogInput) {
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

export const useInitializeEdit = () => {
    const [update_log] = useMutation(UPDATE_LOG);
    const params = useParams();
    const onClickSubmit = async (data: editSchemaType) => {
        // console.log(data);
        // alert('수정 완료');

        await update_log({
            variables: {
                id: params.solplaceLogId,
                updateSolplaceLogInput: {
                    title: data.title,
                    contents: data.contents,
                    address: 'df',
                    lat: 0,
                    lng: 0,
                    images: [],
                },
            },
        });
    };
    return {
        onClickSubmit,
    };
};
