import { FC, useEffect } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
/*
*/

import * as L from "leaflet";


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

let loctype = {
    Ecole: schoolIcon,
    OffreImmo: defaultIcon,
    HabitatPartage: defaultIcon,
    Collective: collectiveIcon,
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
    },
    { 
        position: [48.7464092,1.0472644],
        label: "Ecole les roseaux de Verneuil",
        url: "https://ecoleroseauxverneuil.com/",
        type: loctype.Ecole
    },
    {
        position: [42.8833185,2.1382861],
        url     : "https://grainesdevie.info/",
        label   : "Graines de vie",
        type    : loctype.Ecole
    },
    {
        position: [46.3240607,0.28274],
        url     : "https://lejardinagrandir.jimdofree.com/",
        label   : "Le Jardinagrandir",
        type    : loctype.Ecole
    },
    {
        position: [45.5942617,4.5387813],
        url     : "https://lesvoiesdelaforet.fr/",
        label   : "Les voies de la forêt",
        type    : loctype.Ecole
    },
    {
        position: [48.6994924,-3.1194224],
        label: "le village vegan",
        type: loctype.Collective

    },
    {
        position: [48.1300553,-2.1535194],
        url: "https://www.bretagne-grainedesens.bzh/",
        label: "Graines de Sens",
        type    : loctype.Ecole
    },
    {
        position: [48.0470674,-1.4961974],
        url: "https://www.grainesdejoie.fr/",
        label: "Graines de Joie",
        type    : loctype.Ecole
    },
    {
        position: [47.91039,-1.826753],
        url: "https://ecolenoesis.org/",
        label: "Ecole Noesis",
        type    : loctype.Ecole
    },
    {
        position: [48.6605113,2.6708979],
        label: "Nova School",
        url: "https://www.ecolealternative77.com/",
        type    : loctype.Ecole
    },
    {
        position: [43.5965115,-1.3488512],
        label   : "Enfants sous les Pins",
        type    : loctype.Ecole,
        url     : "http://enfantssouslespins.com/"
    },
    {
        position: [48.3265023,-3.7932969],
        label: "Tremargat",
        type: loctype.Collective
    },
    {
        position: [49.28, -0.200652],
        label: "Merville/Francefille.",
    },
    {
        position: [43.9285776,4.8816622],
        label: "Montfavet"
    }
    
] 
 


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
        <MapContainer style={{width: "1400px",height:'800px'}} center={[45.805, -1.49]} zoom={6} scrollWheelZoom={true}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
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

export default Map