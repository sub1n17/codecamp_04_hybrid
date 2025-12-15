'use client';

import Image from 'next/image';
import style from './styles.module.css';
import { useState } from 'react';
import { useDeviceSetting } from '@/src/commons/settings/device-setting/hook';

const imgSrc = {
    placeImage: '/images/placeImage.png',
    edit: '/icons/edit.png',
    location: '/icons/location.png',
    mapDown: '/icons/mapDown.png',
    mapUp: '/icons/mapUp.png',
    mapExample: '/images/mapExample.png',
    imageClose: '/images/image_close.png',
};

export default function SolPlaceDetail() {
    const { fetchApp } = useDeviceSetting();

    // 이미지 풀스크린 상태
    const [isFullScreen, setIsFullScreen] = useState(false);

    // 이미지 풀스크린
    const onclickFullScreen = async () => {
        setIsFullScreen(true);
        await fetchApp({ query: 'toggleDeviceLayoutForFullScreenSet' });

        // 핀치줌 허용
        const viewport = document.querySelector('meta[name="viewport"]');
        // viewport?.setAttribute(
        //     'content',
        //     `
        //         width=device-width,
        //         initial-scale=1.0,
        //         minimum-scale=1.0,
        //         maximum-scale=3.0,
        //         user-scalable=yes
        //     `
        // );
        viewport?.setAttribute(
            'content',
            'width=device-width, initial-scale=1.0, maximum-scale=3.0, user-scalable=yes'
        );
    };

    // 이미지 닫기
    const onclickClose = async () => {
        setIsFullScreen(false);
        await fetchApp({ query: 'toggleDeviceLayoutForFullScreenSet' });

        // 핀치줌 비허용
        const viewport = document.querySelector('meta[name="viewport"]');
        // viewport?.setAttribute(
        //     'content',
        //     `
        //         width=device-width,
        //         initial-scale=1.0,
        //         minimum-scale=1.0,
        //         maximum-scale=1.0,
        //         user-scalable=no
        //     `
        // );
        viewport?.setAttribute(
            'content',
            'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
        );
    };

    // 지도 토글
    const [mapToggle, setMapToggle] = useState(false);
    const onClickMapToggle = () => {
        setMapToggle((prev) => !prev);
    };

    return (
        <>
            {!isFullScreen && (
                <div>
                    {/* 이미지 */}
                    <div className={style.image_wrapper}>
                        <div onClick={onclickFullScreen}>
                            <Image src={imgSrc.placeImage} alt="placeImage" fill></Image>
                        </div>
                    </div>
                    <div className={style.contents_wrapper}>
                        {/* 주소 */}
                        <div className={style.address_wrapper}>
                            <div className={style.title_wrapper}>
                                <div className={style.address_title}>Bramble & Brioche 한남점</div>
                                <button className={style.edit_img}>
                                    <Image src={imgSrc.edit} alt="수정하기" fill></Image>
                                </button>
                            </div>
                            <div>
                                <div className={style.addressDetail_wrapper}>
                                    <div className={style.location_img}>
                                        <Image src={imgSrc.location} alt="주소" fill></Image>
                                    </div>
                                    <div className={style.addressDetail}>
                                        서울특별시 용산구 이태원로49길 24-14
                                    </div>
                                    <div>
                                        {/* 지도 보기 */}
                                        <button
                                            className={style.map_toggle}
                                            onClick={onClickMapToggle}
                                        >
                                            <div className={style.map_txt}>
                                                {mapToggle ? '지도 접기' : '지도 보기'}
                                            </div>
                                            <div className={style.mapArr_img}>
                                                <Image
                                                    src={mapToggle ? imgSrc.mapUp : imgSrc.mapDown}
                                                    alt={mapToggle ? '지도 접기' : '지도 보기'}
                                                    fill
                                                ></Image>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                                {mapToggle && (
                                    <div className={style.map_wrapper}>
                                        <Image src={imgSrc.mapExample} alt="지도" fill></Image>
                                    </div>
                                )}
                            </div>
                        </div>
                        {/* 내용 */}
                        <div className={style.contents}>
                            Bramble & Brioche는 하루를 천천히 시작하고 싶은 사람들을 위한 아늑한
                            브런치 카페예요. 바쁜 일상에서 잠깐 벗어나, 따뜻한 공간에서 여유를
                            느끼고 싶다면 이곳이 제격이에요.
                        </div>
                    </div>
                </div>
            )}

            {/* 풀스크린 이미지 */}
            {isFullScreen && (
                <div className={style.fullscreen_wrapper}>
                    <button className={style.imageClose_img} onClick={onclickClose}>
                        <Image src={imgSrc.imageClose} alt="이미지 닫기" fill></Image>
                    </button>
                    <div className={style.placeImage_img}>
                        <Image
                            src={imgSrc.placeImage}
                            alt="이미지"
                            fill
                            sizes="100vw"
                            style={{ objectFit: 'contain' }}
                            unoptimized
                        ></Image>
                    </div>
                </div>
            )}
        </>
    );
}
