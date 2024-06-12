import { APIProvider, Map } from "@vis.gl/react-google-maps";
import React from "react";

export default function GmapsApi() {
  return (
    <APIProvider apiKey={'AIzaSyB5bZTy-YbZGqvue8X2XPUO3jTiIul-zmY'} onLoad={() => console.log('Maps API has loaded.')}>
      <Map
        defaultZoom={7.5}
        defaultCenter={{ lat: 38.205542, lng: -28.284108 }}
      >
      </Map>
    </APIProvider>
  );
}