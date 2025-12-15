import { create } from 'zustand';

interface AccessTokenStore {
    accessToken: string;
    setAccessToken: (newAccessToken: string) => void;
}

export const useAccessTokenStore = create<AccessTokenStore>((set) => {
    return {
        accessToken: '',
        setAccessToken: (newAccessToken) => set(() => ({ accessToken: newAccessToken })),
    };
});
