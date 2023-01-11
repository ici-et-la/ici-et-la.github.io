import { FC, useEffect, useRef, useState } from "react";
import { Marker, Popup } from "react-leaflet";
import { MapLocation } from "../../../lib/Location";

interface InteractiveMarkerProps {
    location: MapLocation
    selected?: boolean
}

const InteractiveMarker: FC<InteractiveMarkerProps> = (props: InteractiveMarkerProps) => {
    const [refReady, setRefReady] = useState(false);
    const [ref, setRef] = useState()
    //let ref = useRef();
    useEffect(() => {
            //console.log(ref)
            if (ref && props.selected) {
                const maref: any = ref
                maref.openPopup()
            } 
            if (ref && !props.selected) {
                const maref: any = ref
                maref.closePopup()
            } 
    }, [ref,refReady,props.selected])
    
    const initMarker = (ref:any) => {
        if (ref && props.selected) {
            setRef(ref)
            setRefReady(true)
            }
        }
    if (!props.location.position) return <></>
    return <Marker 
        ref = {initMarker}
        position={props.location.position} 
        icon={props.location.type}
        eventHandlers={{
            mouseover: (event:any) => console.log(location), //event.target.openPopup(),
        }}
        >
        <Popup>
            <div>
                {props.location.url
                    ? <a href={props.location.url} target="_new">{props.location.label}</a> 
                    : <span>{props.location.label}</span>
                }
            </div>
            {/* <div>{location.}</div> */}
        </Popup>
    </Marker>
}

export default InteractiveMarker