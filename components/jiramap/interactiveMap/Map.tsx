import { FC, useEffect, useState, useRef } from "react";
import { MapLocation } from "../../../lib/Location";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
/*
*/

import * as L from "leaflet";
import InteractiveMarker from "./InteractiveMarker";



interface MapProps {
    locations?: Array<MapLocation>,
    selected?: MapLocation
}

export const Map: FC<MapProps> = (props: MapProps) => {
    const [markers,setMarkers] = useState(<></>);
    useEffect(() => {
        const allMarkers = props.locations?.map( 
            (location: MapLocation, index: number) => {
                let selected = false
                if (props.selected?.id == location.id) {
                    selected = true
                }
                
                try {
                    if ( location.position && !(location.position[0] || location.position[1] )) { return null }
                    
                    return <InteractiveMarker key={index} location={location} selected={selected}></InteractiveMarker>
                } catch (e) {
                    console.error(e)
                    return null
                }
        }
        );
        setMarkers(<>{allMarkers}</>);

    }, [props.locations, props.selected])
    return(<>
    <MapContainer id="map" center={[45.805, -1.49]} zoom={6} scrollWheelZoom={true}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {markers}
        </MapContainer>
    </>)
}

export default Map