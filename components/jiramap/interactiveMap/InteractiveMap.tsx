import { FC, useEffect, useState } from "react";

import { loctype, MapLocation } from "../../../lib/Location";
import { Map } from './Map'
import 'bootstrap/dist/css/bootstrap.min.css';

import MapNav from "./MapNav";
import { JiraHelper } from "../../../lib/jira_helper";
import { Col, Container, Row, Table } from "react-bootstrap";
import LocationRows from "../locationlist/LocationRows";

const useSsrLocalStorage = (key: string, initial: string): [string, React.Dispatch<string>] => {
    if (typeof window === 'undefined') {
        return [initial, (value: string) => undefined ]
    } else {
        return require("react-use-localstorage").default(key, initial);
    }
}

export const InteractiveMap: FC = () => {
    //  const [map, setMap] = useState(<></>);
    const [jiraTokenResponse, setJIRATokenResponse] = useSsrLocalStorage("jiraTokenResponse","");
    const [jiraConfigJson, setJiraConfigJson] = useSsrLocalStorage("jiraConfigJson","");
    const [jiraHelper, setJiraHelper] = useState<JiraHelper>()
    const [selectedLocation, setSelectedLocation] = useState<MapLocation>()
    const [locations, setLocations] = useState<Array<MapLocation>>()
    
    const [mapContent, setMapContent] = useState(<>Loading</>)
    useEffect(() => {
        const jira_token = JSON.parse(jiraTokenResponse);
        const jiraConfig = JSON.parse(jiraConfigJson)
        const helper = new JiraHelper(jiraConfig, jira_token)
        helper.ready.then(() => {
            console.log("helper is ready")
            setJiraHelper(helper)
            helper.getLocations().then((locations:Array<MapLocation>) => {
                locations.map((location: MapLocation, key: number) => {
                location.onSelectHandler = () => { 
                    console.log("Map location.onSelectHandler : " + location.id)
                    setSelectedLocation(location)
                };
                })
                setLocations(locations)
            })
        })
        //setMap(<MyAwesomeMap></MyAwesomeMap>)
     }, [jiraConfigJson,jiraTokenResponse]);
      return (
        <>
        <MapNav jiraHelper={jiraHelper}></MapNav>
        <div id="container">
            <div id="sidebar">
                <div className="sidebar-wrapper">
                    <Table>
                        <tbody>
                            <LocationRows jiraHelper={jiraHelper} locations={locations} selected={selectedLocation} columns={["label"]} actions={["edit", "locate"]}></LocationRows>

                        </tbody>

                    </Table>

                </div>
            </div>
            <Map locations={locations} selected={selectedLocation}></Map>
        </div>

        </>
      )
    }

export default InteractiveMap