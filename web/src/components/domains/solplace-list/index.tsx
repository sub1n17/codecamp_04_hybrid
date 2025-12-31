'use client';
import Image from 'next/image';
import style from './styles.module.css';
import Footer from '@/src/commons/layout/footer/footer';
import Link from 'next/link';
import { useRoutingSetting } from '@/src/commons/settings/routing-setting/hook';
import { useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { ButtonCircle } from '../../commons/button';
import { gql, useQuery } from '@apollo/client';
import { useSolPlaceNewStore } from '@/src/commons/stores/solplaceNew-store';

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
            address
            # addressCity
            # addressTown
            images
        }
    }
`;

export default function SolPlaceList({ isPlace }) {
    const { onRouterPush } = useRoutingSetting();

    // 게시글 조회
    const { data, fetchMore, refetch } = useQuery(FETCH_PLACES, {
        variables: { page: 1 },
    });

    const [page, setPage] = useState(1);
    const list = data?.fetchSolplaceLogs ?? [];

    // 무한 스크롤
    const onNext = () => {
        fetchMore({
            variables: {
                page: page + 1,
            },
            updateQuery: (prev, { fetchMoreResult }) => {
                // 더 이상 불러올 데이터 없으면 이전 값으로 두기
                if (!fetchMoreResult.fetchSolplaceLogs.length) return prev;

                // 데이터가 더 있으면 페이지 업데이트
                setPage((prev) => prev + 1);

                // 기존 데이터와 새로 불러온 데이터 합쳐서 보여주기
                return {
                    fetchSolplaceLogs: [
                        ...prev.fetchSolplaceLogs,
                        ...fetchMoreResult.fetchSolplaceLogs,
                    ],
                };
            },
        });
    };

    // 당겨서 새로고침 (4개 보여주기)
    const onRefresh = () => {
        setPage(1);
        refetch({ page: 1 });
    };

    const { setIsFirstNew } = useSolPlaceNewStore();

    return (
        <>
            <main className={style.place_wrapper}>
                <InfiniteScroll
                    hasMore={true}
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
                                            // el.images?.[0]
                                            Array.isArray(el.images) &&
                                            el.images.length > 0 &&
                                            typeof el.images[0] === 'string' &&
                                            el.images[0].trim() !== ''
                                                ? `https://storage.googleapis.com/${el.images[0]}`
                                                : imgSrc.defaultPlaceImg
                                        }
                                        alt="img"
                                        fill
                                        style={{ objectFit: 'cover' }}
                                    />
                                </div>
                                <div>
                                    <div className={style.title}>{el.title} </div>
                                    <div className={style.contents}>{el.contents} </div>
                                </div>
                                {/* {el.addressCity && (
                                    <div className={style.location_wrapper}>
                                        <div className={style.location_img}>
                                            <Image
                                                src={imgSrc.location}
                                                alt="location"
                                                fill
                                            ></Image>
                                        </div>
                                        <div className={style.address}>
                                            {el.addressCity} {el.addressTown}
                                        </div>
                                    </div>
                                )} */}
                                {el.address && (
                                    <div className={style.location_wrapper}>
                                        <div className={style.location_img}>
                                            <Image src={imgSrc.location} alt="location" fill />
                                        </div>
                                        <div className={style.address}>
                                            {el.address.split(' ').slice(0, 2).join(' ')}
                                        </div>
                                    </div>
                                )}
                            </Link>
                        ))}
                    </div>
                </InfiniteScroll>
                <Link
                    href={'/solplace-logs/new'}
                    onClick={() => setIsFirstNew(true)}
                    className={style.add_place}
                >
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
            <Footer navActive={'isPlace'}></Footer>
        </>
    );
}
