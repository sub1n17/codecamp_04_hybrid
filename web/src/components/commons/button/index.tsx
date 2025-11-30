function ButtonBase({ text, onClick }) {
    return <button onClick={onClick}>{text} </button>;
}

export function ButtonFull(props) {
    return <ButtonBase {...props}></ButtonBase>;
}

export function ButtonSmall(props) {
    return <ButtonBase {...props}></ButtonBase>;
}

export function ButtonCircle(props) {
    return <ButtonBase {...props}></ButtonBase>;
}
