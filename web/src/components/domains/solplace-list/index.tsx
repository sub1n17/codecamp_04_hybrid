'use client';
import Image from 'next/image';
import style from './styles.module.css';
import Footer from '@/src/commons/layout/footer/footer';
import Link from 'next/link';
import { useRoutingSetting } from '@/src/commons/settings/routing-setting/hook';
import { useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { ButtonCircle } from '../../commons/button';
import { gql, useQuery } from '@apollo/client';

const imgSrc = {
    location: '/icons/location.png',
    placeAdd: '/icons/place_add.png',
    footerLocation: '/icons/footer_location.png',
    footerMypage: '/icons/footer_mypage.png',
    defaultPlaceImg: '/images/defaultPlaceImg.jpg',
};

const FETCH_PLACES = gql`
    query fetchSolplaceLogs($page: Int) {
        fetchSolplaceLogs(page: $page) {
            id
            title
            contents
            addressCity
            addressTown
            images
        }
    }
`;

export default function SolPlaceList({ isPlace }) {
    const { onRouterPush } = useRoutingSetting();

    // 게시글 조회
    const { data } = useQuery(FETCH_PLACES, {
        variables: { page: 1 },
    });

    const [placeCount, setPlaceCount] = useState(4);
    const list = data?.fetchSolplaceLogs.slice(0, placeCount) ?? [];

    // 무한 스크롤 (4개씩 게시글 더 보여주기)
    const onNext = () => {
        setPlaceCount((prev) => prev + 4);
    };

    // 당겨서 새로고침 (4개 보여주기)
    const onRefresh = () => {
        setPlaceCount(4);
        // alert('리프레시 완료');
    };

    return (
        <>
            <main className={style.place_wrapper}>
                <InfiniteScroll
                    hasMore={list.length < (data?.fetchSolplaceLogs.length ?? 0)}
                    next={onNext}
                    loader={<div>로딩중</div>}
                    dataLength={list.length}
                    // pull-to-refresh 새로고침
                    pullDownToRefresh={true}
                    refreshFunction={onRefresh}
                    pullDownToRefreshThreshold={100}
                >
                    <div className={style.place_list}>
                        {list.map((el, index) => (
                            <Link
                                href={`/solplace-logs/${el.id}`}
                                key={`${el}_${index}`}
                                className={style.list_wrapper}
                                onClick={(e) => {
                                    e.preventDefault();
                                    onRouterPush(`/solplace-logs/${el.id}`);
                                }}
                            >
                                <div className={style.place_img}>
                                    <Image
                                        src={
                                            el.images?.[0]
                                                ? `https://storage.googleapis.com/${el.images[0]}`
                                                : imgSrc.defaultPlaceImg
                                        }
                                        alt="img"
                                        fill
                                    />
                                </div>
                                <div>
                                    <div className={style.title}>{el.title} </div>
                                    <div className={style.contents}>{el.contents} </div>
                                </div>
                                <div className={style.location_wrapper}>
                                    <div className={style.location_img}>
                                        <Image src={imgSrc.location} alt="location" fill></Image>
                                    </div>
                                    <div className={style.address}>
                                        {el.addressCity} {el.addressTown}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </InfiniteScroll>
                <Link href={'/solplace-logs/new'} className={style.add_place}>
                    <ButtonCircle>
                        <Image
                            src={imgSrc.placeAdd}
                            alt="플레이스 등록"
                            width={36}
                            height={36}
                        ></Image>
                    </ButtonCircle>
                </Link>
            </main>
            <Footer isPlace={isPlace}></Footer>
        </>
    );
}
