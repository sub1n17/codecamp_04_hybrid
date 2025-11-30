'use client';

import { newSchemaType } from './schema';

export const useInitializeNew = () => {
    const onClickSubmit = (data: newSchemaType) => {
        console.log(data);
        alert('등록 완료');
    };

    return {
        onClickSubmit,
    };
};
