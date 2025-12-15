interface HeaderOptions {
    title?: string;
    hasLogo?: boolean;
    hasBack?: boolean;
    isTransParent?: boolean;
}

export interface IHeaderTypeProps {
    solplaceLogId?: string;
}

export const headerType = (params: IHeaderTypeProps) => ({
    globalHeader: {
        '/solplace-logs/new': {
            title: '플레이스 등록',
            hasLogo: false,
            hasBack: true,
            isTransParent: false,
        },
        [`/solplace-logs/${params.solplaceLogId}/edit`]: {
            title: '플레이스 수정',
            hasLogo: false,
            hasBack: true,
            isTransParent: false,
        },
        '/solplace-logs': {
            title: '플레이스',
            hasLogo: false,
            hasBack: false,
            isTransParent: false,
        },
        '/login': {
            title: '',
            hasLogo: true,
            hasBack: false,
            isTransParent: false,
        },
    } as Record<string, HeaderOptions>,
    // ㄴ> string 키를 가지는 객체인데 그 값은 모두 HeaderOptions 타입이어야 함

    localHeader: {
        [`/solplace-logs/${params.solplaceLogId}`]: {
            hasBack: true,
            isTransParent: true,
        },
    } as Record<string, HeaderOptions>,
});
