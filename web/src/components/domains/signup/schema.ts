import z from 'zod';

export type signUpSchemaType = z.infer<typeof signupSchema>;

export const signupSchema = z.object({
    email: z.string().min(1, { message: '이메일을 입력해주세요.' }),
    name: z.string().min(1, { message: '이름을 입력해주세요.' }),
    password: z.string().min(1, { message: '비밀번호를 입력해주세요.' }),
    passwordCheck: z.string().min(1, { message: '비밀번호를 한번 더 입력해주세요.' }),
});
