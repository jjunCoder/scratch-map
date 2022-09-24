import { useEffect } from "react";
import geojson from "../geo/geojson"

const { kakao } = window;

const SEOUL_LAT = 37.566826
const SEOUL_LNG = 126.9786567


function Seoul() {
    console.log("Seoul");
    useEffect(() => {
        console.log("Seoul useEffect");
        const container = document.getElementById('map');
        const options = {
            center: new kakao.maps.LatLng(SEOUL_LAT, SEOUL_LNG),
            level: 10
        };
        const map = new kakao.maps.Map(container, options);
        const customOverlay = new kakao.maps.CustomOverlay({});
        const infowindow = new kakao.maps.InfoWindow({ removable: true });

        const data = geojson.features;
        const polygons = [];

        const displayArea = (coordinates, name) => {
            let path = [];
            let points = [];
            coordinates[0].forEach((coordinate) => {
                let point = {};
                point.x = coordinate[1];
                point.y = coordinate[0];
                points.push(point);
                path.push(new kakao.maps.LatLng(point.x, point.y));
            });

            const polygon = new kakao.maps.Polygon({
                map: map,
                path: path,
                strokeWeight: 2,
                strokeColor: '#004C80',
                strokeOpacity: 0.8,
                strokeStyle: 'solid',
                fillColor: '#FFF',
                fillOpacity: 0.7
            });

            polygons.push(polygon);

            // 다각형에 mouseover 이벤트를 등록하고 이벤트가 발생하면 폴리곤의 채움색을 변경합니다
            // 지역명을 표시하는 커스텀오버레이를 지도위에 표시합니다
            kakao.maps.event.addListener(polygon, 'mouseover', function (mouseEvent) {
                polygon.setOptions({ fillColor: '#09f' });

                customOverlay.setContent('<div class="area">' + name + '</div>');

                customOverlay.setPosition(mouseEvent.latLng);
                customOverlay.setMap(map);
            });

            // 다각형에 mousemove 이벤트를 등록하고 이벤트가 발생하면 커스텀 오버레이의 위치를 변경합니다
            kakao.maps.event.addListener(polygon, 'mousemove', function (mouseEvent) {
                customOverlay.setPosition(mouseEvent.latLng);
            });

            // 다각형에 mouseout 이벤트를 등록하고 이벤트가 발생하면 폴리곤의 채움색을 원래색으로 변경합니다
            // 커스텀 오버레이를 지도에서 제거합니다
            kakao.maps.event.addListener(polygon, 'mouseout', function () {
                polygon.setOptions({ fillColor: '#fff' });
                customOverlay.setMap(null);
            });

            // 다각형에 click 이벤트를 등록하고 이벤트가 발생하면 다각형의 이름과 면적을 인포윈도우에 표시합니다
            kakao.maps.event.addListener(polygon, 'click', function (mouseEvent) {
                const content = '<div style="padding:2px;">' + name + '</div>';
                infowindow.setContent(content);
                infowindow.setPosition(mouseEvent.latLng);
                infowindow.setMap(map);
            });
        }

        data.forEach((val) => {
            const coordinates = val.geometry.coordinates;
            const name = val.properties.SIG_KOR_NM;

            displayArea(coordinates, name);
        })

    }, []);

    return (<div id="map" style={{ width: '100%', height: '1000px' }}></div>)
}

export default Seoul;