'use client';

import style from './styles.module.css';

interface IButtonBaseProps {
    text?: string;
    onClick?: any;
    className?: string;
}

function ButtonBase({ text, onClick, className }: IButtonBaseProps) {
    return (
        <button onClick={onClick} className={className}>
            {text}
        </button>
    );
}

export function ButtonFull(props) {
    return <ButtonBase {...props} className={style.button_normal}></ButtonBase>;
}

export function ButtonSmall(props) {
    return <ButtonBase {...props}></ButtonBase>;
}

export function ButtonCircle(props) {
    return <ButtonBase {...props}></ButtonBase>;
}
