import { useFormContext } from 'react-hook-form';
import style from './styles.module.css';
import { ChangeEvent } from 'react';

interface ITextareaProps {
    placeholder: string;
    keyname: string;
    className?: string;
    value?: string;
    onChange?: (event: ChangeEvent<HTMLTextAreaElement>) => void;
}

export default function Textarea({
    placeholder,
    keyname,
    className,
    value,
    onChange,
}: ITextareaProps) {
    const { register, formState } = useFormContext();
    const error = formState.errors[keyname]?.message?.toString();
    return (
        <>
            <textarea
                placeholder={placeholder}
                {...register(keyname)}
                className={className}
                value={value}
                onChange={onChange}
            ></textarea>
            {error && <div className={style.error_txt}>{error}</div>}
        </>
    );
}
