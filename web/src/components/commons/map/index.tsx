'use client';

import { useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Map, MapMarker } from 'react-kakao-maps-sdk';
import style from './styles.module.css';

declare const window: Window & {
    kakao: any;
};

function MapBase({ address, location, placeLat, placeLng }) {
    const mapRef = useRef(null);
    const router = useRouter();
    const searchParams = useSearchParams();

    // URL에서 좌표값 가져오기
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');

    const initLocation =
        // 게시글 상세일 때, 조회된 위도경도 값 사용
        placeLat && placeLng
            ? {
                  lat: Number(placeLat),
                  lng: Number(placeLng),
              }
            : // 작성/수정할 때, 샬로우라우팅 된 url의 위도경도 값 사용
              {
                  lat: lat ? Number(lat) : location.lat,
                  lng: lng ? Number(lng) : location.lng,
              };

    // 주소 → 좌표 변환 (지도 이동 없이 URL만 갱신)
    useEffect(() => {
        if (!address) return;
        if (!window.kakao || !window.kakao.maps) return;

        window.kakao.maps.load(() => {
            const geocoder = new window.kakao.maps.services.Geocoder();

            geocoder.addressSearch(address, (result, status) => {
                if (status === window.kakao.maps.services.Status.OK) {
                    const newLoc = {
                        lat: Number(result[0].y),
                        lng: Number(result[0].x),
                    };

                    router.replace(
                        `?lat=${newLoc.lat}&lng=${newLoc.lng}&address=${encodeURIComponent(
                            address
                        )}`,
                        { shallow: true }
                    );
                }
            });
        });
    }, [address]);

    // 지도 이동 → 역지오코딩 + URL 업데이트
    const onIdle = () => {
        const map = mapRef.current;
        if (!map) return;

        const latlng = map.getCenter();
        const geocoder = new window.kakao.maps.services.Geocoder();

        geocoder.coord2Address(latlng.getLng(), latlng.getLat(), (result, status) => {
            if (status === window.kakao.maps.services.Status.OK) {
                const addr = result[0].road_address?.address_name || result[0].address.address_name;

                router.replace(
                    `?lat=${latlng.getLat()}&lng=${latlng.getLng()}&address=${encodeURIComponent(
                        addr
                    )}`,
                    { shallow: true }
                );
            }
        });
    };

    return placeLat && placeLng ? (
        <div className={style.detailMapWrapper}>
            <Map ref={mapRef} center={initLocation} level={3} className={style.mapElement}>
                <MapMarker
                    position={{
                        lat: Number(placeLat),
                        lng: Number(placeLng),
                    }}
                    image={{
                        src: '/images/mapMarker.png',
                        size: { width: 22, height: 31 },
                    }}
                />
            </Map>
        </div>
    ) : (
        <div className={style.mapWrapper}>
            <Map
                ref={mapRef}
                center={initLocation}
                level={3}
                onIdle={onIdle}
                className={style.mapElement}
            >
                <div className={style.centerMarker} />
            </Map>
        </div>
    );
}

export function MapNew(props) {
    return <MapBase {...props} />;
}

export function MapEdit(props) {
    return <MapBase {...props} />;
}

export function MapDetail(props) {
    return <MapBase {...props} />;
}
