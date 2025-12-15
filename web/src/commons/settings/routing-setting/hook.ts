import { usePathname, useRouter } from 'next/navigation';
import { useDeviceSetting } from '../device-setting/hook';

// 메인페이지 구분하기
const mainPage = ['/solplace-logs', '/mypage'];

export const useRoutingSetting = () => {
    const router = useRouter();
    const pathname = usePathname();
    const { fetchApp } = useDeviceSetting();

    const onRouterPush = (href) => {
        // 링크 태그의 기본 페이지 이동 기능 막기
        // event.preventDefault?.();

        // event.target : 실제로 클릭된 가장 안쪽 요소
        // 이미지 클릭 시 event.target=<img> / 텍스트 클릭 시 event.target=<div class="title"> => 이 요소들엔 href가 없음
        // 그래서 event.target.href는 undefined가 돼서 페이지 이동이 안 됨
        // event.currentTarget으로 onClick이 달린 요소 <a>를 찾아서 제대로 페이지 이동 시킴
        // const href = event.currentTarget.href;
        if (!href) return;

        if (document.startViewTransition) {
            // 뷰트랜지션 되면 적용해서 뒤로가기
            document.startViewTransition(() => {
                return router.push(href);
            });
        } else {
            // 뷰트랜지션 안 되면 그냥 페이지 이동
            return router.push(event.target.href);
        }
    };

    // 백버튼 클릭 시 뒤로가기 및 앱 종료
    const onRouterBack = () => {
        if (mainPage.includes(pathname)) {
            // 메인페이지에서 백버튼 누르면 앱 종료하기
            return fetchApp({ query: 'exitDeviceRoutingForBackSet' });
        } else {
            if (document.startViewTransition) {
                // 뷰트랜지션 되면 적용해서 뒤로가기
                document
                    .startViewTransition(() => {
                        // 뒤로가기 클래스 붙이기
                        document.documentElement.classList.add('backWithTransition');
                        // 메인페이지가 아니라면 페이지 뒤로가기
                        return router.back();
                    })
                    .finished.finally(() => {
                        // 뒤로가기 실행이 끝나고 나면 클래스 삭제
                        document.documentElement.classList.remove('backWithTransition');
                    });
            } else {
                // 뷰트랜지션 안 되면 그냥 뒤로가기
                return router.back();
            }
        }
    };

    return {
        onRouterPush,
        onRouterBack,
    };
};
