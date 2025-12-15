import { ButtonFull } from '@/src/components/commons/button';
import style from './styles.module.css';
import Navigation from '@/src/components/commons/navigation';
import Link from 'next/link';

interface IFooterProps {
    text?: string;
    isPlace?: boolean;
    isLogin?: boolean;
}

export default function Footer({ text, isPlace, isLogin }: IFooterProps) {
    return (
        <>
            <div className={style.footer_layer}></div>

            {!isPlace && !isLogin && (
                <div>
                    <ButtonFull text={text}></ButtonFull>
                </div>
            )}

            {isPlace && (
                <div className={style.isPlace_footer}>
                    <Navigation isPlace={isPlace}></Navigation>
                </div>
            )}

            {isLogin && !isPlace && (
                <div>
                    <ButtonFull text={text}></ButtonFull>
                    <Link href="/onBoarding/signup" className={style.signup_link}>
                        회원가입
                    </Link>
                </div>
            )}
        </>
    );
}
