'use client';

import Image from 'next/image';
import style from './styles.module.css';
import { headerType } from './constants';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { useRoutingSetting } from '../../settings/routing-setting/hook';
import { useFullscreenStore } from '../../stores/fullscreen-store';

const imgSrc = {
    backBtn: '/icons/backBtn.png',
    logo: '/images/logo.png',
};

interface IHeaderBaseProps {
    title?: string;
    hasLogo?: boolean;
    hasBack?: boolean;
    isTransParent?: boolean;
}

const HeaderBase = ({ title, hasLogo, hasBack, isTransParent }: IHeaderBaseProps) => {
    const { onRouterBack } = useRoutingSetting();
    return (
        <>
            <header
                className={style.header}
                style={{
                    backgroundColor: isTransParent ? 'transparent' : '#FFFFFF',
                }}
            >
                {hasLogo && (
                    <div className={style.logo_img}>
                        <Image src={imgSrc.logo} alt="logo" width={52} height={32}></Image>
                    </div>
                )}

                {hasBack && (
                    <div className={style.backBtn_img} onClick={onRouterBack}>
                        <Image src={imgSrc.backBtn} alt="backBtn" fill></Image>
                    </div>
                )}

                {title && <div className={style.header_title}>{title}</div>}
            </header>
            {/* 헤더 레이어 */}
            {isTransParent ? <></> : <div className={style.header_layer}></div>}
        </>
    );
};

export function HeaderGlobal() {
    const pathname = usePathname();
    const params = useParams();
    const options = headerType(params).globalHeader[pathname];

    return (
        <>
            <div style={{ display: options ? 'block' : 'none' }}>
                <HeaderBase {...options}></HeaderBase>
            </div>
        </>
    );
}

export function HeaderLocal() {
    const pathname = usePathname();
    // const params = useParams();
    // const options = headerType(params).localHeader[pathname];

    // 상세페이지일 때
    const isDetailPage =
        pathname.startsWith('/solplace-logs/') &&
        !pathname.endsWith('/edit') &&
        !pathname.endsWith('/map') &&
        !pathname.endsWith('/new');
    // 지도페이지일 때 (쿼리스트링은 pathname에 포함x)
    const isMapPage = pathname.endsWith('/map');

    // 상세페이지의 이미지가 풀스크린일 때 헤더 숨기기
    const { isImageFullscreen } = useFullscreenStore();
    if (isImageFullscreen) return null;

    const options =
        isDetailPage || isMapPage
            ? {
                  title: '',
                  hasLogo: false,
                  hasBack: true,
                  isTransParent: true,
              }
            : null;

    return (
        <>
            <div style={{ display: options ? 'block' : 'none' }}>
                <HeaderBase {...options}></HeaderBase>
            </div>
        </>
    );
}
