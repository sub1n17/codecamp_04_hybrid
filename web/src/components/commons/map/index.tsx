'use client';

import { useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Map, MapMarker } from 'react-kakao-maps-sdk';
import style from './styles.module.css';
import { useDeviceSetting } from '@/src/commons/settings/device-setting/hook';

declare const window: Window & {
    kakao: any;
};

function MapBase({ address, placeLat, placeLng }) {
    const { fetchApp } = useDeviceSetting();

    // const mapRef = useRef(null);
    const mapRef = useRef<kakao.maps.Map | null>(null);
    const router = useRouter();
    const searchParams = useSearchParams();

    // URL에서 좌표값 가져오기
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    const addressParam = searchParams.get('address');
    // from으로 new인지 edit인지 구분하기
    const from = searchParams.get('from');

    const initLocation =
        // 게시글 상세일 때, 조회된 위도경도 값 사용
        placeLat && placeLng
            ? { lat: Number(placeLat), lng: Number(placeLng) }
            : lat && lng
            ? // 작성/수정할 때, 샬로우라우팅 된 url의 위도경도 값 사용
              { lat: Number(lat), lng: Number(lng) }
            : // 위치 권한 거부 시, 서울시청 값 사용
              { lat: 37.5662952, lng: 126.9779451 };

    // 새 글 작성 시, 현재 위치로 지도 표시하기
    useEffect(() => {
        // 좌표/주소 있으면 현재위치 좌표 가져오기 못하게 하기
        if (searchParams.get('lat') && searchParams.get('lng') && searchParams.get('address')) {
            return;
        }

        const fetchLocation = async () => {
            // 현재 위치 좌표값 가져오기
            const result = await fetchApp({ query: 'fetchDeviceLocationForLatLngSet' });
            const status = result.data.fetchDeviceLocationForLatLngSet.status;
            const currentLat = result.data.fetchDeviceLocationForLatLngSet.lat;
            const currentLng = result.data.fetchDeviceLocationForLatLngSet.lng;

            // 아직 현재 위치 좌표 안 왔으면 그냥 대기
            if (
                status === 'granted' &&
                (typeof currentLat !== 'number' || typeof currentLng !== 'number')
            )
                return;

            const params = new URLSearchParams(searchParams.toString());

            // 위치 권한 허락 시, 현재 위치 보여주기
            if (
                status === 'granted' &&
                typeof currentLat === 'number' &&
                typeof currentLng === 'number'
            ) {
                // 현재 위치를 url에 넣기
                params.set('lat', String(currentLat));
                params.set('lng', String(currentLng));

                // 카카오 SDK 로드 확인
                if (!window.kakao || !window.kakao.maps) {
                    router.replace(`?${params.toString()}`, { shallow: true });
                    return;
                }

                // 지도 로드 완료 후, 현재 위치의 위도경도로 주소 역지오코딩
                window.kakao.maps.load(() => {
                    const geocoder = new window.kakao.maps.services.Geocoder();

                    geocoder.coord2Address(currentLng, currentLat, (result, status) => {
                        if (status === window.kakao.maps.services.Status.OK) {
                            const addr =
                                result[0].road_address?.address_name ||
                                result[0].address.address_name;

                            params.set('address', addr);
                        }

                        params.delete('from');
                        router.replace(`?${params.toString()}`, { shallow: true });
                    });
                });
                return;
            } else if (status === 'denied') {
                // 위치 권한 거부 시, 서울시청 보여주기
                // params.set('lat', '37.5662952'); // 원래
                // params.set('lng', '126.9779451');
                // params.set('lat', '37.5665851'); // 위치 설정할 때 나온 주소
                // params.set('lng', '126.9782038');
                params.set('lat', '37.5668242'); // 지도에서 서울시청 찍을때
                params.set('lng', '126.9786465');
                params.set('address', '서울특별시 중구 세종대로 110');
            } else {
                return; // 아직 좌표 안 온 상태
            }

            params.delete('from'); // 역할 끝났으니 제거
            router.replace(`?${params.toString()}`, { shallow: true });
        };
        fetchLocation();
    }, []);

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

                    // edit-map 이동 시, from=edit 쿼리스트링 유지하기
                    const params = new URLSearchParams(searchParams.toString());
                    params.set('lat', String(newLoc.lat));
                    params.set('lng', String(newLoc.lng));
                    params.set('address', address);

                    router.replace(`?${params.toString()}`, { shallow: true });
                }
            });
        });
    }, [address]);

    // 이전 좌표 기억용 ref
    const lastCenterRef = useRef<{ lat: number; lng: number } | null>(null);

    // URL(lat, lng)이 바뀌었을 때, 지도의 중심을 그 좌표로 맞추기
    // useEffect(() => {
    //     if (!mapRef.current) return;
    //     if (!lat || !lng) return;

    //     const nextLat = Number(lat);
    //     const nextLng = Number(lng);

    //     mapRef.current.setCenter(new window.kakao.maps.LatLng(nextLat, nextLng));

    //     // onIdle 중복 방지
    //     lastCenterRef.current = { lat: nextLat, lng: nextLng };
    // }, [lat, lng]);

    // 지도 이동 → 역지오코딩 + URL 업데이트
    const onIdle = () => {
        const map = mapRef.current;
        if (!map) return;

        const latlng = map.getCenter();
        const nextLat = latlng.getLat();
        const nextLng = latlng.getLng();

        // 이전 좌표와 같으면 아무것도 안 함
        if (
            lastCenterRef.current &&
            lastCenterRef.current.lat === nextLat &&
            lastCenterRef.current.lng === nextLng
        ) {
            return;
        }

        lastCenterRef.current = { lat: nextLat, lng: nextLng };

        const geocoder = new window.kakao.maps.services.Geocoder();

        geocoder.coord2Address(nextLng, nextLat, (result, status) => {
            if (status === window.kakao.maps.services.Status.OK) {
                const addr = result[0].road_address?.address_name || result[0].address.address_name;

                // 바뀐 위도경도값으로 url 바꾸기
                const params = new URLSearchParams(searchParams.toString());
                params.set('lat', String(nextLat));
                params.set('lng', String(nextLng));
                params.set('address', addr);

                router.replace(`?${params.toString()}`, { shallow: true });
            }
        });
    };

    return (
        <div className={style.mapWrapper}>
            <Map
                // ref={mapRef}
                center={initLocation} //지도의 중심을 이 좌표로 맞추기
                level={3}
                onIdle={onIdle}
                className={style.mapElement}
                onCreate={(map) => {
                    mapRef.current = map;
                }}
            >
                <div className={style.centerMarker} />
            </Map>

            {/* 🔴 여기 추가 */}
            {/* <div
                style={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    background: '#000',
                    color: '#0f0',
                    fontSize: 12,
                    padding: '4px 8px',
                    zIndex: 9999,
                }}
            >
                initLat: {initLocation.lat} / initLng: {initLocation.lng}
                <br />
                lat: {lat ?? 'null'} / lng: {lng ?? 'null'} / addr: {addressParam ?? 'null'}
            </div> */}
        </div>
    );
}

export function MapNew(props) {
    return <MapBase {...props} />;
}

export function MapEdit(props) {
    return <MapBase {...props} />;
}

// export function MapDetail(props) {
//     return <MapBase {...props} />;
// }
