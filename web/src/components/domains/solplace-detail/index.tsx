'use client';

import Image from 'next/image';
import style from './styles.module.css';
import { useEffect, useState } from 'react';
import { useDeviceSetting } from '@/src/commons/settings/device-setting/hook';
import { gql, useQuery } from '@apollo/client';
import { useParams } from 'next/navigation';
import { webviewLog } from '@/src/commons/libraries/webview-log';
import { Map, MapMarker } from 'react-kakao-maps-sdk';
import { MapDetail } from '../../commons/map';
import Link from 'next/link';

const imgSrc = {
    placeImage: '/images/defaultPlaceImg.jpg',
    // placeImage: '/images/placeImage.png',
    edit: '/icons/edit.png',
    location: '/icons/location.png',
    mapDown: '/icons/mapDown.png',
    mapUp: '/icons/mapUp.png',
    mapExample: '/images/mapExample.png',
    imageClose: '/images/image_close.png',
};

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

export default function SolPlaceDetail() {
    // 조회하기

    const params = useParams();
    const { data } = useQuery(FETCH_PLACE, {
        variables: {
            id: params.solplaceLogId,
        },
    });
    const placeLat = data?.fetchSolplaceLog.lat === 0 ? null : data?.fetchSolplaceLog.lat;
    const placeLng = data?.fetchSolplaceLog.lng === 0 ? null : data?.fetchSolplaceLog.lng;

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
                        {/* 이미지 없으면 기본 이미지 */}
                        {data?.fetchSolplaceLog.images.length === 0 ? (
                            <div>
                                <Image
                                    src={imgSrc.placeImage}
                                    alt="placeImage"
                                    fill
                                    style={{ objectFit: 'cover' }}
                                />
                            </div>
                        ) : (
                            // 이미지 있을 떄
                            data?.fetchSolplaceLog.images.map((el) => (
                                <div onClick={onclickFullScreen} key={el}>
                                    <Image
                                        src={`https://storage.googleapis.com/${el}`}
                                        alt="placeImage"
                                        fill
                                        style={{ objectFit: 'cover' }}
                                    />
                                </div>
                            ))
                        )}
                    </div>
                    <div className={style.contents_wrapper}>
                        <div className={style.address_wrapper}>
                            {/* 제목 */}
                            <div className={style.title_wrapper}>
                                <div className={style.address_title}>
                                    {data?.fetchSolplaceLog.title}
                                </div>
                                <Link
                                    href={`/solplace-logs/${data?.fetchSolplaceLog.id}/edit`}
                                    className={style.edit_img}
                                >
                                    <Image src={imgSrc.edit} alt="수정하기" fill></Image>
                                </Link>
                            </div>
                            {/* 주소 */}
                            {placeLat && placeLng && (
                                <div>
                                    <div className={style.addressDetail_wrapper}>
                                        <div className={style.location_img}>
                                            <Image src={imgSrc.location} alt="주소" fill></Image>
                                        </div>
                                        <div className={style.addressDetail}>
                                            {data?.fetchSolplaceLog.address}
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
                                                        src={
                                                            mapToggle
                                                                ? imgSrc.mapUp
                                                                : imgSrc.mapDown
                                                        }
                                                        alt={mapToggle ? '지도 접기' : '지도 보기'}
                                                        fill
                                                    ></Image>
                                                </div>
                                            </button>
                                        </div>
                                    </div>
                                    {mapToggle && (
                                        <div className={style.map_wrapper}>
                                            <Map
                                                center={{ lat: placeLat, lng: placeLng }}
                                                level={3}
                                                style={{ width: '100%', height: '100%' }}
                                            >
                                                <MapMarker
                                                    position={{ lat: placeLat, lng: placeLng }}
                                                    image={{
                                                        src: '/images/mapMarker.png',
                                                        size: { width: 22, height: 31 },
                                                    }}
                                                />
                                            </Map>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        {/* 내용 */}
                        <div className={style.contents}>{data?.fetchSolplaceLog.contents}</div>
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
