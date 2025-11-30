import { useFormContext } from 'react-hook-form';
import style from './styles.module.css';

interface ITextareaProps {
    placeholder: string;
    keyname: string;
    className?: string;
}

export default function Textarea({ placeholder, keyname, className }: ITextareaProps) {
    const { register, formState } = useFormContext();
    const error = formState.errors[keyname]?.message?.toString();
    return (
        <>
            <textarea
                placeholder={placeholder}
                {...register(keyname)}
                className={className}
            ></textarea>
            {error && <div className={style.error_txt}>{error}</div>}
        </>
    );
}
