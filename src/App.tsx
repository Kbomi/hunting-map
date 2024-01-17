import React, {
  ReactNode,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import "./App.css";
const data = require("./data.json");

declare global {
  interface Window {
    kakao: any;
  }
}

type Location = {
  id: number;
  latitude: number;
  longitude: number;
  title: string;
};

// type Data = {[key: string] : Location[]}[]

function App() {
  const [location, setLocation] = useState("hongdae");

  useEffect(() => {
    const selectLocation: Location[] = data[location];
    const mapContainer = document.getElementById("map");

    if (mapContainer) {
      const { kakao } = window;

      const options = {
        center: new window.kakao.maps.LatLng(
          37.550571261875426,
          126.92215595376915
        ),
        level: 1,
      };

      const map = new kakao.maps.Map(mapContainer, options); // 지도 그리기

      const zoomControl = new kakao.maps.ZoomControl(); // 컨트롤 추가
      map.addControl(zoomControl, kakao.maps.ControlPosition.BOTTOMRIGHT);

      const imageSrc = "/images/fox-mark.svg";

      // 지도를 재설정할 범위정보를 가지고 있을 LatLngBounds 객체를 생성합니다
      const bounds = new kakao.maps.LatLngBounds();

      for (var i = 0; i < selectLocation.length; i++) {
        // 마커 이미지의 이미지 크기 입니다
        const imageSize = new kakao.maps.Size(38, 38);
        // 마커 이미지를 생성합니다
        const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);

        const { title, latitude, longitude } = selectLocation[i];

        const kakaoLatLng = new kakao.maps.LatLng(latitude, longitude);

        // 마커를 생성합니다
        const marker = new kakao.maps.Marker({
          map: map, // 마커를 표시할 지도
          position: kakaoLatLng, // 마커를 표시할 위치
          title: title, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
          image: markerImage, // 마커 이미지
        });

        marker.setMap(map);

        // 커스텀 오버레이 생성
        const content = `<div id="info"><p class="title">${title}</p></div>`;

        const customOverlay = new kakao.maps.CustomOverlay({
          map: map,
          position: marker.getPosition(),
          clickable: true,
          content: content,
          yAnchor: 1,
        });

        // 마커를 클릭했을 때 커스텀 오버레이를 표시합니다
        kakao.maps.event.addListener(marker, "click", function () {
          customOverlay.setMap(map);
        });

        kakao.maps.event.addListener(map, "click", function () {
          customOverlay.setMap(null);
        });

        // 선을 구성하는 좌표 배열입니다. 이 좌표들을 이어서 선을 표시합니다
        const linePath = selectLocation.map(
          (item: Location) =>
            new kakao.maps.LatLng(item.latitude, item.longitude)
        );

        const polyline = new kakao.maps.Polyline({
          path: linePath, // 선을 구성하는 좌표배열 입니다
          strokeWeight: 5, // 선의 두께 입니다
          strokeColor: "#FFAE00", // 선의 색깔입니다
          strokeOpacity: 0.7, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
          strokeStyle: "solid", // 선의 스타일입니다
        });

        polyline.setMap(map);

        // LatLngBounds 객체에 좌표를 추가합니다
        bounds.extend(kakaoLatLng);
      }

      // LatLngBounds 객체에 추가된 좌표들을 기준으로 지도의 범위를 재설정합니다
      // 이때 지도의 중심좌표와 레벨이 변경될 수 있습니다
      map.setBounds(bounds);
      map.setLevel(2);
    }
  }, [location]);

  return (
    <>
      <h1>헌팅여지도</h1>
      <select
        name="location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      >
        <option value="hongdae">홍대 클럽거리</option>
        <option value="gangnam">강남</option>
      </select>
      <div id="map" style={{ height: "600px" }}></div>
      <div className="background-line"></div>
    </>
  );
}

export default App;
