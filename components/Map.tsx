import { FC, useEffect } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
/*
*/

 


export const Map: React.FC = () => {
/*    useEffect(() => {
        function showInfo(data, tabletop) {
            // do something with the data
            console.log(JSON.stringify(data, null, 2));
          }
        Tabletop.init( { key: publicSpreadsheetUrl,
            callback: showInfo,
            simpleSheet: false } )
    },[]); */
    return (
        <MapContainer style={{width: "1400px",height:'800px'}} center={[48.805, -1.49]} zoom={8} scrollWheelZoom={false}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[49.28, -0.200652]}>
                <Popup>
                Merville/Francefille.
                </Popup>
            </Marker>
            <Marker position={[48.3265023,-3.7932969]}>
            <Popup>
                Tremargat
            </Popup>
            </Marker>
        </MapContainer>

    );
}

export default Map