'use client';
import Image from 'next/image';
import style from './styles.module.css';
import Footer from '@/src/commons/layout/footer/footer';
import Link from 'next/link';
import { useRoutingSetting } from '@/src/commons/settings/routing-setting/hook';
import { useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

const mockData = [
    {
        image: '/images/placeExample01.png',
        title: '111Bramble & Brioche 한남점',
        contents: '한국에서 느낄 수 없었던 영국 감성의',
        address: '서울시 용산구',
    },
    {
        image: '/images/placeExample02.png',
        title: '222오브레크 경주',
        contents: '티라미수에 밤보다 더 어울리는',
        address: '경북 경주시',
    },
    {
        image: '/images/placeExample03.png',
        title: '333미드나잇 딤섬',
        contents: '너무 편안한 분위기의 딤섬 맛집입니다',
        address: '서울시 성동구',
    },
    {
        image: '/images/placeExample04.png',
        title: '444모찌 비주',
        contents: '세상에 없던 찹쌀떡 맛집',
        address: '서울시 마포구',
    },
    {
        image: '/images/placeExample01.png',
        title: '555Bramble & Brioche 한남점',
        contents: '한국에서 느낄 수 없었던 영국 감성의',
        address: '서울시 용산구',
    },
    {
        image: '/images/placeExample02.png',
        title: '666오브레크 경주',
        contents: '티라미수에 밤보다 더 어울리는',
        address: '경북 경주시',
    },
    {
        image: '/images/placeExample03.png',
        title: '777미드나잇 딤섬',
        contents: '너무 편안한 분위기의 딤섬 맛집입니다',
        address: '서울시 성동구',
    },
    {
        image: '/images/placeExample04.png',
        title: '888모찌 비주',
        contents: '세상에 없던 찹쌀떡 맛집',
        address: '서울시 마포구',
    },
    {
        image: '/images/placeExample04.png',
        title: '999모찌 비주',
        contents: '세상에 없던 찹쌀떡 맛집',
        address: '서울시 마포구',
    },
    {
        image: '/images/placeExample04.png',
        title: '101010모찌 비주',
        contents: '세상에 없던 찹쌀떡 맛집',
        address: '서울시 마포구',
    },
    {
        image: '/images/placeExample04.png',
        title: '11모찌 비주',
        contents: '세상에 없던 찹쌀떡 맛집',
        address: '서울시 마포구',
    },
    {
        image: '/images/placeExample01.png',
        title: '555Bramble & Brioche 한남점',
        contents: '한국에서 느낄 수 없었던 영국 감성의',
        address: '서울시 용산구',
    },
    {
        image: '/images/placeExample02.png',
        title: '666오브레크 경주',
        contents: '티라미수에 밤보다 더 어울리는',
        address: '경북 경주시',
    },
    {
        image: '/images/placeExample03.png',
        title: '777미드나잇 딤섬',
        contents: '너무 편안한 분위기의 딤섬 맛집입니다',
        address: '서울시 성동구',
    },
    {
        image: '/images/placeExample04.png',
        title: '888모찌 비주',
        contents: '세상에 없던 찹쌀떡 맛집',
        address: '서울시 마포구',
    },
    {
        image: '/images/placeExample04.png',
        title: '999모찌 비주',
        contents: '세상에 없던 찹쌀떡 맛집',
        address: '서울시 마포구',
    },
    {
        image: '/images/placeExample04.png',
        title: '101010모찌 비주',
        contents: '세상에 없던 찹쌀떡 맛집',
        address: '서울시 마포구',
    },
    {
        image: '/images/placeExample04.png',
        title: '11모찌 비주',
        contents: '세상에 없던 찹쌀떡 맛집',
        address: '서울시 마포구',
    },
    {
        image: '/images/placeExample01.png',
        title: '555Bramble & Brioche 한남점',
        contents: '한국에서 느낄 수 없었던 영국 감성의',
        address: '서울시 용산구',
    },
    {
        image: '/images/placeExample02.png',
        title: '666오브레크 경주',
        contents: '티라미수에 밤보다 더 어울리는',
        address: '경북 경주시',
    },
    {
        image: '/images/placeExample03.png',
        title: '777미드나잇 딤섬',
        contents: '너무 편안한 분위기의 딤섬 맛집입니다',
        address: '서울시 성동구',
    },
    {
        image: '/images/placeExample04.png',
        title: '888모찌 비주',
        contents: '세상에 없던 찹쌀떡 맛집',
        address: '서울시 마포구',
    },
    {
        image: '/images/placeExample04.png',
        title: '999모찌 비주',
        contents: '세상에 없던 찹쌀떡 맛집',
        address: '서울시 마포구',
    },
    {
        image: '/images/placeExample04.png',
        title: '101010모찌 비주',
        contents: '세상에 없던 찹쌀떡 맛집',
        address: '서울시 마포구',
    },
    {
        image: '/images/placeExample04.png',
        title: '11모찌 비주',
        contents: '세상에 없던 찹쌀떡 맛집',
        address: '서울시 마포구',
    },
    {
        image: '/images/placeExample01.png',
        title: '555Bramble & Brioche 한남점',
        contents: '한국에서 느낄 수 없었던 영국 감성의',
        address: '서울시 용산구',
    },
    {
        image: '/images/placeExample02.png',
        title: '666오브레크 경주',
        contents: '티라미수에 밤보다 더 어울리는',
        address: '경북 경주시',
    },
    {
        image: '/images/placeExample03.png',
        title: '777미드나잇 딤섬',
        contents: '너무 편안한 분위기의 딤섬 맛집입니다',
        address: '서울시 성동구',
    },
    {
        image: '/images/placeExample04.png',
        title: '888모찌 비주',
        contents: '세상에 없던 찹쌀떡 맛집',
        address: '서울시 마포구',
    },
    {
        image: '/images/placeExample04.png',
        title: '999모찌 비주',
        contents: '세상에 없던 찹쌀떡 맛집',
        address: '서울시 마포구',
    },
    {
        image: '/images/placeExample04.png',
        title: '101010모찌 비주',
        contents: '세상에 없던 찹쌀떡 맛집',
        address: '서울시 마포구',
    },
    {
        image: '/images/placeExample04.png',
        title: '11모찌 비주',
        contents: '세상에 없던 찹쌀떡 맛집',
        address: '서울시 마포구',
    },
    {
        image: '/images/placeExample01.png',
        title: '555Bramble & Brioche 한남점',
        contents: '한국에서 느낄 수 없었던 영국 감성의',
        address: '서울시 용산구',
    },
    {
        image: '/images/placeExample02.png',
        title: '666오브레크 경주',
        contents: '티라미수에 밤보다 더 어울리는',
        address: '경북 경주시',
    },
    {
        image: '/images/placeExample03.png',
        title: '777미드나잇 딤섬',
        contents: '너무 편안한 분위기의 딤섬 맛집입니다',
        address: '서울시 성동구',
    },
    {
        image: '/images/placeExample04.png',
        title: '888모찌 비주',
        contents: '세상에 없던 찹쌀떡 맛집',
        address: '서울시 마포구',
    },
    {
        image: '/images/placeExample04.png',
        title: '999모찌 비주',
        contents: '세상에 없던 찹쌀떡 맛집',
        address: '서울시 마포구',
    },
    {
        image: '/images/placeExample04.png',
        title: '101010모찌 비주',
        contents: '세상에 없던 찹쌀떡 맛집',
        address: '서울시 마포구',
    },
    {
        image: '/images/placeExample04.png',
        title: '11모찌 비주',
        contents: '세상에 없던 찹쌀떡 맛집',
        address: '서울시 마포구',
    },
];

const imgSrc = {
    location: '/icons/location.png',
    placeAdd: '/icons/place_add.png',
    footerLocation: '/icons/footer_location.png',
    footerMypage: '/icons/footer_mypage.png',
};

export default function SolPlaceList({ isPlace }) {
    const { onRouterPush } = useRoutingSetting();

    const [list, setList] = useState(mockData.slice(0, 4));
    const onNext = () => {
        setList((prev) => {
            const newList = mockData.slice(prev.length, prev.length + 4);
            return [...prev, ...newList];
        });
    };

    const onRefresh = () => {
        setList(mockData.slice(0, 4));
        // alert('리프레시 완료');
    };

    return (
        <>
            <main style={{ minHeight: '100vh' }}>
                <InfiniteScroll
                    hasMore={list.length < mockData.length}
                    next={onNext}
                    loader={<div>로딩중</div>}
                    dataLength={list.length}
                    // pull-to-refresh
                    pullDownToRefresh={true}
                    refreshFunction={onRefresh}
                    pullDownToRefreshThreshold={100}
                >
                    <div className={style.place_list}>
                        {list.map((el, index) => (
                            <Link
                                href={'/solplace-logs/1'}
                                key={`${el}_${index}`}
                                className={style.list_wrapper}
                                onClick={(e) => {
                                    e.preventDefault();
                                    onRouterPush('/solplace-logs/1');
                                }}
                            >
                                <div className={style.place_img}>
                                    <Image src={el.image} alt="img" fill></Image>
                                </div>
                                <div>
                                    <div className={style.title}>{el.title} </div>
                                    <div className={style.contents}>{el.contents} </div>
                                </div>
                                <div className={style.location_wrapper}>
                                    <div className={style.location_img}>
                                        <Image src={imgSrc.location} alt="location" fill></Image>
                                    </div>
                                    <div className={style.address}>{el.address} </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </InfiniteScroll>
            </main>
            <Footer isPlace={isPlace}></Footer>
        </>
    );
}
