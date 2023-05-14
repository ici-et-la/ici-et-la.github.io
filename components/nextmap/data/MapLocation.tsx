
import * as L from "leaflet";
import { LocationReview } from "./LocationReview";

const defaultIcon = new L.Icon({
    iconUrl: "/map-pins/map-pin-basic.svg",
    iconAnchor:   [12, 34],
    iconSize: [24, 34],
}),
schoolIcon = new L.Icon({
    iconUrl: "/map-pins/map-pin-kids.svg",
    iconAnchor:   [12, 34],
    iconSize: [24, 34],
}),
collectiveIcon = new L.Icon({
    iconUrl: "/map-pins/map-pin-collectif.svg",
    iconAnchor:   [12, 34],
    iconSize: [24, 34],
})
;

let loctype: {[k: string]: any} = {
"Ecole": schoolIcon,
"Initiative": collectiveIcon,
"Localisation": defaultIcon
}

export interface MapLocation {
    onSelectHandler?: Function,
    id: string,
    position?: [lat: number, long: number]
    url?: string,
    status?: string,
    issuetype?: string,
    maps_url?: string,
    label: string,
    description?: any,
    type?: L.Icon,
    immobilier?: [{
        label: string,
        url: string,
        prix: number
    }]
    reviews?: Array<LocationReview>
}

export {loctype}