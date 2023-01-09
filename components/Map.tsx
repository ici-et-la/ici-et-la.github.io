import { FC, useEffect, useState } from "react";
import { MapLocation } from "../lib/Location";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
/*
*/

import * as L from "leaflet";



interface MapProps {
    locations: Array<MapLocation>
}

export const Map: FC<MapProps> = (props: MapProps) => {
    const [markers,setMarkers] = useState(<></>);
    useEffect(() => {
        console.log(props.locations)
        const allMarkers = props.locations.map( 
            (location: MapLocation, index: number) => {
                try {
                    if ( !(location.position[0] || location.position[1]) ) { return <></> }
                    return <Marker 
                        key={index} 
                        position={location.position} 
                        icon={location.type}
                        eventHandlers={{
                            mouseover: (event:any) => console.log(location), //event.target.openPopup(),
                          }}
                          >
                        <Popup>
                            <div>
                                {location.url
                                    ? <a href={location.url} target="_new">{location.label}</a> 
                                    : <span>{location.label}</span>
                                }
                            </div>
                            {/* <div>{location.}</div> */}
                        </Popup>
                    </Marker>
                } catch (e) {
                    return <></>
                }
        }
        );
        setMarkers(<>{allMarkers}</>);

    }, [])
    return(<>
    <MapContainer style={{width: "1400px",height:'800px'}} center={[45.805, -1.49]} zoom={6} scrollWheelZoom={true}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {markers}
        </MapContainer>
    </>)
}

export default Map