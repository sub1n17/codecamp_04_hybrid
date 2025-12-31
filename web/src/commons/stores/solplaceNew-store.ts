import { create } from 'zustand';

interface solPlaceNewStore {
    title: string;
    setTitle: (title: string) => void;

    contents: string;
    setContents: (contents: string) => void;

    files: File[];
    setFiles: (file: File[] | ((prev: File[]) => File[])) => void;

    previewUrls: string[];
    setPreviewUrls: (previewUrls: string[] | ((prev: string[]) => string[])) => void;

    existingImages: string[];
    setExistingImages: (images: string[]) => void;

    reset: () => void;

    isFirstNew: boolean;
    setIsFirstNew: (state: boolean) => void;
}

export const useSolPlaceNewStore = create<solPlaceNewStore>((set) => ({
    title: '',
    setTitle: (title) => set(() => ({ title: title })),

    contents: '',
    setContents: (contents) => set(() => ({ contents: contents })),

    // 미리보기용 (base64:로컬 미리보기)
    previewUrls: [],
    setPreviewUrls: (previewUrls) =>
        set((state) => ({
            previewUrls:
                typeof previewUrls === 'function' ? previewUrls(state.previewUrls) : previewUrls,
        })),

    // 서버 업로드용
    files: [],
    setFiles: (files) =>
        set((state) => ({ files: typeof files === 'function' ? files(state.files) : files })),

    // 수정할 때, 이미지 보여주기
    existingImages: [],
    setExistingImages: (images) =>
        set(() => ({
            existingImages: images,
        })),

    // 초기화하기
    reset: () => set({ title: '', contents: '', files: [], previewUrls: [] }),

    // 등록페이지에 첫 진입일 때 리셋하기 위한 state
    isFirstNew: true,
    setIsFirstNew: (state) => set({ isFirstNew: state }),
}));
