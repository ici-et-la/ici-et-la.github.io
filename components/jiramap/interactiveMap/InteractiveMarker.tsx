import * as Icon from 'react-bootstrap-icons'
import { FC, useEffect, useRef, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { Marker, Popup } from "react-leaflet";
import { MapLocation } from "../../../lib/Location";
import MapModal from "./MapModal";
import EditLocation from '../EditLocation';
import { JiraHelper } from '../../../lib/jira_helper';

interface InteractiveMarkerProps {
    location: MapLocation
    selected?: boolean
    modal: MapModal
    jiraHelper: JiraHelper
}

const InteractiveMarker: FC<InteractiveMarkerProps> = (props: InteractiveMarkerProps) => {
    const [refReady, setRefReady] = useState(false);
    const [ref, setRef] = useState()
    
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState(<>Empty</>);
    
    let modal: MapModal = {
    setShowModal: setShowModal,
    setModalContent: setModalContent
    }
    if (props.modal) {
    modal = props.modal
    }
    const handleCloseModal = () => modal.setShowModal(false);
    
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
    const getHandleShowEdit = (location: MapLocation) => {
        return () => {
          modal.setModalContent(<>
            <EditLocation title="Edit location" location={location} jiraHelper={props.jiraHelper} handleClose={handleCloseModal}></EditLocation>
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
            <div>
                {props.location.url
                    ? <a href={props.location.url} target="_new">{props.location.label}</a> 
                    : <span>{props.location.label}</span>
                }
                <Button variant="secondary" size="sm" onClick={getHandleShowEdit(props.location)}><Icon.Pencil/></Button>
            </div>
            {/* <div>{location.}</div> */}
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