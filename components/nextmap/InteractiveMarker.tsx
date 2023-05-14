import * as Icon from 'react-bootstrap-icons'
import { FC, useEffect, useRef, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { Marker, Popup } from "react-leaflet";
import { loctype, MapLocation } from "./data/MapLocation";
import MapModal from "./MapModal";
import EditLocation from './EditLocation';
import { MapDataHelper } from './MapDataHelper';
import { MapInterface } from "./MapInterface";
import { LocationCard } from './LocationCard';

interface InteractiveMarkerProps {
    location: MapLocation
    selected?: boolean
    modal: MapModal
    dataHelper: MapDataHelper
}

const InteractiveMarker: FC<InteractiveMarkerProps> = (props: InteractiveMarkerProps) => {
    const [refReady, setRefReady] = useState(false);
    const [ref, setRef] = useState()
    
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState(<>Empty</>);
    
    const handleCloseModal = () => modal.setShowModal(false);
    let modal: MapModal = {
    setShowModal: setShowModal,
    setModalContent: setModalContent,
    handleCloseModal: handleCloseModal
    }
    if (props.modal) {
    modal = props.modal
    }
    props.location.type = props.location.type ? props.location.type : loctype["Localisation"];
    useEffect(() => {
        console.log("Rendering marker for " + props.location.label)
        //console.log(ref)
        if (ref && props.selected) {
            const maref: any = ref
            if (maref && refReady) maref.openPopup()
        } 
        if (ref && !props.selected) {
            const maref: any = ref
            if (maref && refReady) maref.closePopup()
        } 
    }, [ref,refReady,props.selected,props.location])
    
    const initMarker = (ref:any) => {
        if (ref && props.selected) {
            setRef(ref)
            setRefReady(true)
            }
        }
    
    if (!props.location.position) return <></>
    const getHandleShowEdit = (location: MapLocation) => {
        return () => {
          modal.setModalContent(<>
            <EditLocation title="Edit location" location={location} dataHelper={props.dataHelper} handleClose={modal.handleCloseModal}></EditLocation>
          </>)
          modal.setShowModal(true);
        }
      }
    return <><Marker 
        ref = {initMarker}
        position={props.location.position} 
        icon={props.location.type}
        eventHandlers={{
            mouseover: (event:any) => console.log(location), //event.target.openPopup(),
        }}
        >
        <Popup>
            <LocationCard editHandler={getHandleShowEdit(props.location)} location={props.location} dataHelper={props.dataHelper} modal={props.modal}/>
        </Popup>
    </Marker>
    {!props.modal
        ? <Modal show={showModal} onHide={handleCloseModal}>
            {modalContent}
            </Modal>
        : <></>
        }
    </>
}

export default InteractiveMarker