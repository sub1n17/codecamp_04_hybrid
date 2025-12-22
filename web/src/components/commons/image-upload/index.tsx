'use client';

import { ChangeEvent, useRef } from 'react';
import Image from 'next/image';
import style from './styles.module.css';
import { useSolPlaceNewStore } from '@/src/commons/stores/solplaceNew-store';

const imgSrc = {
    add_img: '/images/add_img.png',
};

interface ImageUploadProps {
    isEdit: boolean;
}

export default function ImageUpload({ isEdit }: ImageUploadProps) {
    // zustand
    const { previewUrls, setPreviewUrls, setFiles, existingImages } = useSolPlaceNewStore();

    // 이미지 추가하기
    const onChangeFile = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (file?.size > 5 * 1024 * 1024) {
            alert('5MB 이하의 사진만 업로드 가능합니다.');
            return;
        }

        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = (event) => {
            const result = event.target?.result;
            if (typeof result === 'string') {
                setPreviewUrls(result);
                setFiles(file);
            }
        };
    };

    const fileRef = useRef<HTMLInputElement | null>(null);
    const onClickUploadImage = () => {
        if (!fileRef.current) return;
        fileRef.current.click();
    };

    return (
        <>
            <div className={style.img_wrapper}>
                <input
                    type="file"
                    onChange={onChangeFile}
                    style={{ display: 'none' }}
                    ref={fileRef}
                    accept="image/jpg, image/png"
                />
                <Image
                    src={imgSrc.add_img}
                    alt="add_img"
                    width={100}
                    height={100}
                    onClick={onClickUploadImage}
                    style={{ flexShrink: 0 }}
                ></Image>
                {/* 기존 이미지 */}
                {isEdit &&
                    existingImages.map((el, index) => (
                        <div className={style.upload_img} key={`${el}_${index}`}>
                            <Image
                                src={`https://storage.googleapis.com/${el}`}
                                alt="img"
                                width={100}
                                height={100}
                                style={{ aspectRatio: '1/1', objectFit: 'cover' }}
                            ></Image>
                        </div>
                    ))}
                {/* 새로 업로드한 이미지 */}
                {previewUrls.map((el, index) => (
                    <div className={style.upload_img} key={`${el}_${index}`}>
                        <Image
                            src={el}
                            alt="img"
                            width={100}
                            height={100}
                            style={{ aspectRatio: '1/1', objectFit: 'cover' }}
                        ></Image>
                    </div>
                ))}
            </div>
        </>
    );
}
