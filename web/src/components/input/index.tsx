import { useFormContext } from 'react-hook-form';
import style from './styles.module.css';

function InputBase({ ...rest }) {
    const { register } = useFormContext();
    return (
        <input
            type="text"
            placeholder={rest.placeholder}
            {...register(rest.keyname)}
            className={rest.className}
        />
    );
}

export function InputNormal({ ...rest }) {
    return <InputBase {...rest} className={style.input_normal}></InputBase>;
}
