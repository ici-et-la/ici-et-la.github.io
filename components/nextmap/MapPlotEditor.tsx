import { FC, useEffect, useState } from "react";

import { loctype, MapLocation } from "./MapLocation";
import { InteractiveMap } from './InteractiveMap'
import 'bootstrap/dist/css/bootstrap.min.css';

import MapNav from "./MapNav";
import { MapDataHelper } from "./MapDataHelper";
import { Col, Container, Modal, Row, Table } from "react-bootstrap";
import LocationRows from "./LocationRows";
import MapModal from "./MapModal";
import { MapInterface } from "./MapInterface";

interface MapPlotEditorProps {
    dataHelper: MapDataHelper
}

export const MapPlotEditor: FC<MapPlotEditorProps> = (props: MapPlotEditorProps) => {
    //  const [map, setMap] = useState(<></>);
    const [selectedLocation, setSelectedLocation] = useState<MapLocation>()
    const [locations, setLocations] = useState<Array<MapLocation>>()
    const [showmodal, setShowModal] = useState(false)
    const [modalContent, setModalContent] = useState(<>Loading</>)
    


    const handleCloseModal = () => {
        props.dataHelper.getLocations().then(() => {
            setShowModal(false)
        })
    };
    
    let modal: MapModal = {
        handleCloseModal: handleCloseModal,
        setShowModal: setShowModal,
        setModalContent: setModalContent
      }
    useEffect(() => {
        props.dataHelper.ready.then((helper: MapDataHelper) => {
            console.log("helper is ready")
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
     }, []);
      return (
        <>
        <MapNav modal={modal} dataHelper={props.dataHelper}></MapNav>
        <div id="container">
            <div id="sidebar">
                <div className="sidebar-wrapper">
                    <div id="features">
                        <div className="sidebar-table">
                            <Table>
                                <tbody>
                                    <LocationRows modal={modal} dataHelper={props.dataHelper} locations={locations} selected={selectedLocation} columns={["label"]} actions={["edit", "locate"]}></LocationRows>
                                </tbody>
                            </Table>
                        </div>
                    </div>
                </div>
            </div>
            <InteractiveMap dataHelper={props.dataHelper} modal={modal} locations={locations} selected={selectedLocation}></InteractiveMap>   
        </div>
        <Modal show={showmodal} onHide={handleCloseModal}>
            {modalContent}
        </Modal>
        </>
      )
    }

export default MapPlotEditor