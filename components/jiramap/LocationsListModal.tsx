import { FC, MouseEventHandler, useEffect, useState } from "react";
import { Button, Modal, Table } from "react-bootstrap";
import { JiraHelper } from "../../lib/jira_helper";
import { MapLocation } from "../../lib/Location";
import { MapInterface } from "./interactiveMap/InteractiveMap";
import { LocationTable } from "./locationlist/LocationTable";


interface LocationsListProps {
    handleClose: MouseEventHandler,
    jiraHelper: JiraHelper,
    map: MapInterface
}
export const LocationsListModal: FC<LocationsListProps> = (props: LocationsListProps) => {
  // if (!props.jiraHelper) return <><h4>Missing component configuration</h4></>
  const [locationsTable, setLocationsTable] = useState(<></>)
  useEffect(() => {
    props.jiraHelper?.getUnlocatedLocations().then((data) => {
      setLocationsTable(<LocationTable map={props.map} jiraHelper={props.jiraHelper} locations={data as Array<MapLocation>} ></LocationTable>)      
    })

  },[])
  return <>
      <Modal.Header closeButton>
        <Modal.Title>Unlocated items</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        
      {locationsTable}

      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </>
}

export default LocationsListModal