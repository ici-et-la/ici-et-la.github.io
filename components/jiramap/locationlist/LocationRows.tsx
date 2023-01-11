import { FC, MouseEventHandler, useState } from "react"
import { Button, Modal } from "react-bootstrap"
import { MapLocation } from "../../../lib/Location"
import * as Icon from "react-bootstrap-icons"
import EditLocation from "../EditLocation"
import { JiraHelper } from "../../../lib/jira_helper"
interface LocationRowsProps {
    locations?: Array<MapLocation>
    columns: Array<String>
    selected?: MapLocation
    actions?: Array<String>
    jiraHelper?: JiraHelper
}

export const LocationRows: FC<LocationRowsProps> = (props:LocationRowsProps) => {
  const [showmodal, setShowModal] = useState(false);
  
  
  const handleCloseModal = () => setShowModal(false);
  

  
  const [modalContent, setModalContent] = useState(
    <>
        <Modal.Header closeButton>
        <Modal.Title>Modal title</Modal.Title>
      </Modal.Header>
      <Modal.Body>Woohoo, you&apos;re reading this text in a modal!</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseModal}>
          Close
        </Button>
        <Button variant="primary" onClick={handleCloseModal}>
          Save Changes
        </Button>
      </Modal.Footer>
      </>
    );

    if (!props.jiraHelper) return <h4>Interactive map is loading</h4>
    const helper: JiraHelper = props.jiraHelper;
    const getHandleShowEdit = (location: MapLocation) => {
        return () => {
          setModalContent(<>
            <EditLocation title="Edit location" location={location} jiraHelper={helper} handleClose={handleCloseModal}></EditLocation>
          </>)
          setShowModal(true);
        }
    }
    return <>
    {props.locations?.map((location: MapLocation, index: number) => {
          const onSelectRowHandler:MouseEventHandler  = (mouseEvent) => {
            console.log(location.status)
           location.onSelectHandler ? location.onSelectHandler() : null; 
          }
        return <tr key={index} onClick={onSelectRowHandler}>
            
          {props.columns.includes("id") ? <td>{location.id}</td> : <></>}
          {props.columns.includes("label") 
            ? <>{location.url 
                ? <td><a href={location.url} target="_new">{location.label}</a> </td>
                : <td>{location.label}</td> }</>
            : <></>}
          {props.columns.includes("actions") || props.actions
            ? <td>
              {location.status == "Ouvert" 
                ? <>
                    {props.actions?.includes("locate")
                      ? <Button variant="secondary" size="sm" onClick={getHandleShowEdit(location)}><Icon.PinMapFill/></Button>
                      : <></>
                    }
                    
                  </> 
                : <>
                    {props.actions?.includes("edit")
                      ? <Button variant="secondary" size="sm" onClick={getHandleShowEdit(location)}><Icon.Pencil/></Button>
                      : <></>
                    }
                  </>
                }
              </td> 
            : <></> }
        </tr>
    })}
    <Modal show={showmodal} onHide={handleCloseModal}>
        {modalContent}
      </Modal>
    </>
}

export default LocationRows