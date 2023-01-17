import { FC, MouseEventHandler, useState } from "react"
import { Button, Modal } from "react-bootstrap"
import { MapLocation } from "../../../lib/Location"
import * as Icon from "react-bootstrap-icons"
import EditLocation from "../EditLocation"
import { JiraHelper } from "../../../lib/jira_helper"
import MapModal from "../interactiveMap/MapModal"
import { MapInterface } from "../interactiveMap/InteractiveMap"
interface LocationRowsProps {
    locations?: Array<MapLocation>
    columns: Array<String>
    selected?: MapLocation
    actions?: Array<String>
    jiraHelper?: JiraHelper
    modal?: MapModal
    map: MapInterface
}

export const LocationRows: FC<LocationRowsProps> = (props:LocationRowsProps) => {
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
    if (!props.jiraHelper) return <h4>Interactive map is loading</h4>
    const helper: JiraHelper = props.jiraHelper;
    const getHandleShowEdit = (location: MapLocation) => {
        return () => {
          modal.setModalContent(<>
            <EditLocation map={props.map} title="Edit location" location={location} jiraHelper={helper} handleClose={modal.handleCloseModal}></EditLocation>
          </>)
          modal.setShowModal(true);
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
                : <td>{location.label}</td> }
              </>
            : <></>
          }
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
            : <></>
          }
        </tr>
      })
    }
    {!props.modal
      ? <Modal show={showModal} onHide={handleCloseModal}>
          {modalContent}
        </Modal>
      : <></>
    }
    </>
}

export default LocationRows