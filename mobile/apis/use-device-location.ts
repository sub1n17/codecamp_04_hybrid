import * as Location from 'expo-location';

export const useDeviceLocation = (onResponse) => {
    // 위치 권한 요청하기
    const fetchDeviceLocationForLatLngSet = async () => {
        const result = await Location.requestForegroundPermissionsAsync();
        const status = result.status;

        if (status === 'granted') {
            // 허용했을 때
            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.BestForNavigation,
            });

            onResponse({
                fetchDeviceLocationForLatLngSet: {
                    status: 'granted',
                    lat: location.coords.latitude,
                    lng: location.coords.longitude,
                },
            });
        } else {
            // 거부했을 때
            onResponse({
                fetchDeviceLocationForLatLngSet: {
                    // lat: 37.5662952,
                    // lng: 126.9779451,
                    status: 'denied',
                },
            });
        }
    };
    // fetchDeviceLocationForLatLngSet();

    // 위치 권한 조회하기
    const fetchDeviceLocationForPermissionSet = async () => {
        const permission = await Location.getForegroundPermissionsAsync();
        onResponse({
            fetchDeviceLocationForPermissionSet: {
                status: permission.status,
            },
        });
    };

    return {
        fetchDeviceLocationForLatLngSet,
        fetchDeviceLocationForPermissionSet,
    };
};
