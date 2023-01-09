import { FC, useEffect } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
/*
*/

import * as L from "leaflet";
import { useState } from "react";


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
    "OffreImmo": defaultIcon,
    "HabitatPartage": defaultIcon,
    "Collective": collectiveIcon,
    "Ecolieu": collectiveIcon
}

let interests : {position: [lat: number, long: number]
                url?: string,
                label: string,
                type?: L.Icon,
                immobilier?: [{
                    label: string,
                    url: string,
                    prix: number
                }]
                }[] = 
[
    { 
        position: [45.0494857,0.1121384],
        label: "Ferme l'odeur de la pluie",
        url: "https://lodeurdelapluie.fr",
        type: loctype.Collective,
        immobilier: [
            {
                label: "Maison 6 pièces 252 m²",
                prix: 93500,
                url: "https://www.leboncoin.fr/ventes_immobilieres/2220319286.htm"
            }
        ]
    }
] 

interface MapProps {
    tokenResponse: any,
    sheet_id: string
}

export const MapFromSheets: React.FC<MapProps> = (props: MapProps) => {
    const [markers,setMarkers] = useState(<></>);
    useEffect(() => {
        let accessToken = props.tokenResponse.access_token;
        fetch("https://sheets.googleapis.com/v4/spreadsheets/" + props.sheet_id, {
          headers: {
            'Authorization': 'Bearer ' + accessToken,
           }
        }).then((response) => {
          fetch("https://sheets.googleapis.com/v4/spreadsheets/" + props.sheet_id + "/values/Lieux", {
            headers: {
              'Authorization': 'Bearer ' + accessToken,
            }
          }).then((response) => {
              response.json().then((sheet: any) => {
                console.log(sheet);
                let attributes = sheet.values[0];
                let data = sheet.values.slice(1).map((row: Array<string>) => {
                    var result: any = { }; //{[k: string]: any} = {};
                    attributes.forEach((key: string, index: number) => {
                        result[key] = row[index];   
                    });
                    return result;
                });
                setMarkers(data.map((interest: any, index: number) => {
                    try {
                        let position = [parseFloat(interest.Latitude), parseFloat(interest.Longitude)];
                        if ( !(position[0] || position[1]) ) { return <></> }
                        let icon = loctype[interest.Type] ? loctype[interest.Type] : defaultIcon;
                        return <Marker 
                            key={index} 
                            position={[position[0],position[1]]} 
                            icon={icon}
                            eventHandlers={{
                                mouseover: (event:any) => console.log(interest), //event.target.openPopup(),
                              }}
                              >
                            <Popup>
                                <div>
                                    {interest.URL 
                                        ? <a href={interest.URL} target="_new">{interest.Nom}</a> 
                                        : <span>{interest.Nom}</span>
                                    }
                                </div>
                                <div>{interest.Description}</div>
                            </Popup>
                        </Marker>
                    } catch (e) {
                        return <></>
                    }
                }))
            });
          })
        })
    }, [])
    
    return (
        <MapContainer style={{width: "1400px",height:'800px'}} center={[45.805, -1.49]} zoom={6} scrollWheelZoom={true}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {markers}
            {interests.map((interest, index) => {
                return <Marker key={index} position={interest.position} icon={interest.type ? interest.type : defaultIcon}>
                        <Popup>
                            <div>
                                {interest.url 
                                    ? <a href={interest.url} target="_new">{interest.label}</a> 
                                    : <span>{interest.label}</span>
                                }
                            </div>
                            {interest.immobilier?.map((immobilier,index) => {
                                return <div key={index}>
                                    <a href={immobilier.url}>{immobilier.label}</a> / {immobilier.prix} €
                                </div>
                            })}
                        </Popup>
                    </Marker>
            })}
        </MapContainer>
    );
}

export default MapFromSheets