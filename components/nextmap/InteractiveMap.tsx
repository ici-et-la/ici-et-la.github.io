import { FC, useEffect, useState, useRef } from "react";
import { MapLocation } from "./MapLocation";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
/*
*/

import * as L from "leaflet";
import InteractiveMarker from "./InteractiveMarker";
import MapModal from "./MapModal";
import { MapDataHelper } from "./MapDataHelper";
import { MapInterface } from "./MapInterface";



interface MapProps {
    locations?: Array<MapLocation>,
    selected?: MapLocation,
    modal: MapModal,
    dataHelper?: MapDataHelper
}

export const InteractiveMap: FC<MapProps> = (props: MapProps) => {
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
                    
                    return <InteractiveMarker dataHelper={helper} modal={props.modal} key={index} location={location} selected={selected}></InteractiveMarker>
                } catch (e) {
                    console.error(e)
                    return null
                }
        }
        );
        setMarkers(<>{allMarkers}</>);

    }, [props.locations, props.selected])

    if (!props.dataHelper) return <h4>Interactive map is loading</h4>
    const helper: MapDataHelper = props.dataHelper;

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

export default InteractiveMap