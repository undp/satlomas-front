import dynamic from "next/dynamic";
import lomasData from "../public/static/lomas_aoi.json"

const GeoJSON = dynamic(() => import("./GeoJSON"), {
  ssr: false
});

const LomasPolygonsLayer = () => (
  <GeoJSON
    data={lomasData}
    style={{
      fillColor: "#000000",
      fillOpacity: 0.0,
      color: '#ff0000',
      weight: 1
    }}
  />
)

export default LomasPolygonsLayer;