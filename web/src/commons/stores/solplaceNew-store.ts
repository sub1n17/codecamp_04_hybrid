import { create } from 'zustand';

interface solPlaceNewStore {
    title: string;
    contents: string;
    files: File[];
    previewUrls: string[];
    existingImages: string[];
    setTitle: (title: string) => void;
    setContents: (contents: string) => void;
    setFiles: (file: File) => void;
    setPreviewUrls: (previewUrls: string) => void;
    setExistingImages: (images: string[]) => void;
}

export const useSolPlaceNewStore = create<solPlaceNewStore>((set) => ({
    title: '',
    setTitle: (title) => set(() => ({ title: title })),

    contents: '',
    setContents: (contents) => set(() => ({ contents: contents })),

    // 미리보기용
    previewUrls: [],
    setPreviewUrls: (previewUrls) =>
        set((state) => ({ previewUrls: [...state.previewUrls, previewUrls] })),

    // 서버 업로드용
    files: [],
    setFiles: (files) => set((state) => ({ files: [...state.files, files] })),

    // 수정할 때, 이미지 보여주기
    existingImages: [],
    setExistingImages: (images) =>
        set(() => ({
            existingImages: images,
        })),

    // 초기화하기
    reset: () => set({ title: '', contents: '', files: [], previewUrls: [] }),
}));
