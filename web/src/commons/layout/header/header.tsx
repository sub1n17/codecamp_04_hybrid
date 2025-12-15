'use client';

import Image from 'next/image';
import style from './styles.module.css';
import { headerType } from './constants';
import { useParams, usePathname } from 'next/navigation';

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
    return (
        <>
            <header
                className={style.header}
                style={{
                    backgroundColor: isTransParent ? 'transparent' : '#FFFFFF',
                }}
            >
                {hasLogo && (
                    // <Image src={imgSrc.logo} alt="logo" width={52} height={32}></Image>

                    // <div className={style.logo_img}>
                    //     <Image src={imgSrc.logo} alt="logo" fill></Image>
                    // </div>
                    <div className={style.logo_img}>
                        <Image src={imgSrc.logo} alt="logo" width={52} height={32}></Image>
                    </div>
                )}

                {hasBack && (
                    <div className={style.backBtn_img}>
                        <Image src={imgSrc.backBtn} alt="backBtn" fill></Image>
                    </div>
                )}

                {title && <div>{title} </div>}
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
    const params = useParams();
    const options = headerType(params).localHeader[pathname];

    return (
        <>
            <div style={{ display: options ? 'block' : 'none' }}>
                <HeaderBase {...options}></HeaderBase>
            </div>
        </>
    );
}
