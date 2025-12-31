import Link from 'next/link';
import Image from 'next/image';
import style from './styles.module.css';
import { useRoutingSetting } from '@/src/commons/settings/routing-setting/hook';

const imgSrc = {
    arr_right: '/icons/right_icon.png',
};

interface LinkBaseProps {
    href: string;
    linkText?: string;
    placeAddress?: string;
    replace?: boolean;
}

function LinkBase({ linkText, href, placeAddress, replace }: LinkBaseProps) {
    const { onRouterPush } = useRoutingSetting();
    return (
        <>
            <Link
                href={href}
                className={style.address_button}
                onClick={(e) => {
                    e.preventDefault();
                    onRouterPush(href, replace);
                }}
            >
                <div className={style.address_txt}>{placeAddress ? placeAddress : linkText}</div>
                <div className={style.icon_right}>
                    <Image src={imgSrc.arr_right} alt="arr_right" fill></Image>
                </div>
            </Link>
        </>
    );
}

export function AddressLink(props: LinkBaseProps) {
    return <LinkBase {...props}></LinkBase>;
}
