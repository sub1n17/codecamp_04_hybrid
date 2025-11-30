import { useFormContext } from 'react-hook-form';
import style from './styles.module.css';

function InputBase({ ...rest }) {
    const { register, formState } = useFormContext();
    const error = formState.errors?.[rest.keyname]?.message?.toString();

    return (
        <>
            <input
                type="text"
                placeholder={rest.placeholder}
                {...register(rest.keyname)}
                className={rest.className}
            />
            {error && <div className={style.error_txt}>{error}</div>}
            {/* formState.errors는 객체라서 formState.errors.title = formState.errors['title']
             => formState.errors = {
                    title: { message: "제목을 입력하세요" },
                    contents: { message: "내용을 입력하세요" }
            } */}
        </>
    );
}

export function InputNormal({ ...rest }) {
    return <InputBase {...rest} className={style.input_normal}></InputBase>;
}
