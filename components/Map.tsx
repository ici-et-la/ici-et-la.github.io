import { FC, useEffect } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
/*
*/

enum loctype {
    Ecole,
    OffreImmo,
    HabitatPartage
}

let interest : {position: [lat: number, long: number]
                url: string,
                label: string,
                type: loctype
                } = 
[
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
        label: "le village vegan"

    },
    {
        position: [48.1300553,-2.1535194],
        url: "https://www.bretagne-grainedesens.bzh/",
        label: "Graines de Sens"
    },
    {
        position: [47.91039,-1.826753],
        url: "https://ecolenoesis.org/",
        label: "Ecole Noesis"
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
            {interest.map(interest => {
                return <Marker position={interest.position}>
                        <Popup>
                            {interest.url 
                                ? <a href={interest.url} target="_new">{interest.label}</a> 
                                : <span>{interest.label}</span>
                            }
                        </Popup>
                    </Marker>
            })}
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
            <Marker position={[43.5965115,-1.3488512]}>
            <Popup>
                <a href="http://enfantssouslespins.com/" target='_new'>Enfants sous les Pins</a>
            </Popup>
            </Marker>
        </MapContainer>

    );
}

export default Map