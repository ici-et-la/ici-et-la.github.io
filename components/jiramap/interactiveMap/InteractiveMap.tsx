import { FC, useEffect, useState } from "react";

import { loctype, MapLocation } from "../../../lib/Location";
import { JiraMap } from './JiraMap'
import 'bootstrap/dist/css/bootstrap.min.css';

import MapNav from "./MapNav";
import { JiraHelper } from "../../../lib/jira_helper";
import { Col, Container, Modal, Row, Table } from "react-bootstrap";
import LocationRows from "../locationlist/LocationRows";
import MapModal from "./MapModal";

const useSsrLocalStorage = (key: string, initial: string): [string, React.Dispatch<string>] => {
    if (typeof window === 'undefined') {
        return [initial, (value: string) => undefined ]
    } else {
        return require("react-use-localstorage").default(key, initial);
    }
}

export interface MapInterface {
    getLocations: Function
    setLocations: Function
    getSelectedLocation: Function
    setSelectedLocation: Function
}

export const InteractiveMap: FC = () => {
    //  const [map, setMap] = useState(<></>);
    const [jiraTokenResponse, setJIRATokenResponse] = useSsrLocalStorage("jiraTokenResponse","");
    const [jiraConfigJson, setJiraConfigJson] = useSsrLocalStorage("jiraConfigJson","");
    const [jiraHelper, setJiraHelper] = useState<JiraHelper>()
    const [selectedLocation, setSelectedLocation] = useState<MapLocation>()
    const [locations, setLocations] = useState<Array<MapLocation>>()
    const [showmodal, setShowModal] = useState(false)
    const [modalContent, setModalContent] = useState(<>Loading</>)
    
    const loadMapLocations = () => {
        return new Promise((resolve, reject) => {
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
                    resolve(locations)
                })
            })
        })
    }

    const handleCloseModal = () => {
        loadMapLocations().then(() => {
            setShowModal(false)
        })
    };
    
    let modal: MapModal = {
        handleCloseModal: handleCloseModal,
        setShowModal: setShowModal,
        setModalContent: setModalContent
      }
    let map:MapInterface  = {
        getLocations: () => { return locations },
        setLocations: setLocations,
        getSelectedLocation: () => { return selectedLocation },
        setSelectedLocation: setSelectedLocation
    }
    useEffect(() => {
        loadMapLocations()
        //setMap(<MyAwesomeMap></MyAwesomeMap>)
     }, [jiraConfigJson,jiraTokenResponse]);
      return (
        <>
        <MapNav map={map} modal={modal} jiraHelper={jiraHelper}></MapNav>
        <div id="container">
            <div id="sidebar">
                <div className="sidebar-wrapper">
                    <div id="features">
                        <div className="sidebar-table">
                            <Table>
                                <tbody>
                                    <LocationRows map={map} modal={modal} jiraHelper={jiraHelper} locations={locations} selected={selectedLocation} columns={["label"]} actions={["edit", "locate"]}></LocationRows>
                                </tbody>
                            </Table>
                        </div>
                    </div>
                </div>
            </div>
            <JiraMap map={map} jiraHelper={jiraHelper} modal={modal} locations={locations} selected={selectedLocation}></JiraMap>   
        </div>
        <Modal show={showmodal} onHide={handleCloseModal}>
            {modalContent}
        </Modal>
        </>
      )
    }

export default InteractiveMap