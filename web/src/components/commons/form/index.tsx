'use client';

import { FieldValues, FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

/* eslint-disable @typescript-eslint/no-explicit-any */
interface IFormProps {
    children: React.ReactNode;
    schema: any;
    onClickSubmit: (data: any) => void;
    className?: string;
}

export default function Form<T extends FieldValues>({
    children,
    schema,
    onClickSubmit,
    className,
}: IFormProps) {
    const methods = useForm<T>({
        resolver: zodResolver(schema),
        mode: 'onChange',
    });

    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onClickSubmit)} className={className}>
                {children}
            </form>
        </FormProvider>
    );
}
