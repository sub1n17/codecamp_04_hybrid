// 백엔드에서 나중에 제공할 GraphQL Mutation & Query를 직접 가짜로 만들기
import { graphql } from 'msw';

const imgSrc = {
    placeImage: '/images/placeImage.png',
};

// 임시 데이터 저장
const solplaceLogs = [
    {
        id: '1',
        images: [imgSrc.placeImage],
        title: '오션뷰 카페',
        contents: '해변이 보이는 아름다운 카페',
        addressCity: '부산',
        addressTown: '해운대구',
        address: '부산 해운대구 우동 1408-5',
        lat: 35.1587,
        lng: 129.1604,
    },
    {
        id: '2',
        images: [imgSrc.placeImage],
        title: '힐링 가든',
        contents: '자연 속에서 즐기는 커피 한 잔',
        addressCity: '서울',
        addressTown: '성동구',
        address: '서울 성동구 성수동1가 685-697',
        lat: 37.5446,
        lng: 127.0551,
    },
    {
        id: '3',
        images: [imgSrc.placeImage],
        title: '빈티지 블루',
        contents: '빈티지한 인테리어와 음악이 있는 카페',
        addressCity: '서울',
        addressTown: '강남구',
        address: '서울 강남구 신사동 535-12',
        lat: 37.5244,
        lng: 127.0223,
    },
    {
        id: '4',
        images: [imgSrc.placeImage],
        title: '어반 포레스트',
        contents: '도심 속 작은 숲 같은 공간',
        addressCity: '서울',
        addressTown: '중구',
        address: '서울 중구 명동2가 88-1',
        lat: 37.5637,
        lng: 126.9827,
    },
];

export const handlers = [
    // 조회
    graphql.query('fetchSolplaceLogs', (req, res, ctx) => {
        return res(
            ctx.data({
                fetchSolplaceLogs: solplaceLogs,
            })
        );
    }),

    // 생성
    graphql.mutation('createSolplaceLog', (req, res, ctx) => {
        const { createSolplaceLogInput } = req.variables;

        const newLog = {
            id: String(solplaceLogs.length + 1),
            ...createSolplaceLogInput,
        };
        solplaceLogs.push(newLog);

        return res(
            ctx.data({
                createSolplaceLog: newLog,
            })
        );
    }),
];
