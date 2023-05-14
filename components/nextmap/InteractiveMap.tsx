import { FC, useEffect, useState, useRef } from "react";
import { MapLocation } from "./data/MapLocation";
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
    const googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
        maxZoom: 20,
        subdomains:['mt0','mt1','mt2','mt3']
    });
    

    useEffect(() => {
        const allMarkers = props.locations?.map( 
            (maplocation: MapLocation, index: number) => {
                let selected = false
                if (props.selected?.id == maplocation.id) {
                    selected = true
                }
                
                try {
                    if ( ! maplocation.position || 
                            (maplocation.position && !(typeof maplocation.position[0] == 'number' && !isNaN(maplocation.position[0]) && typeof maplocation.position[1] == 'number' && !isNaN(maplocation.position[1])) )) { return null }
                    console.log("Creating marker for " + maplocation.label + " at " + maplocation.position)
                    const mapMarker = <InteractiveMarker dataHelper={helper} modal={props.modal} key={index} location={maplocation} selected={selected}></InteractiveMarker>
                    return mapMarker
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
            {/* <TileLayer 
                maxZoom={20}
                subdomains={['mt0','mt1','mt2','mt3']}
                url='http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}'
            /> */}
            {markers}
        </MapContainer>
    </>)
}

export default InteractiveMap