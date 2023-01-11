import { ChangeEventHandler, FC, FormEvent, FormEventHandler, MouseEventHandler, useEffect, useState } from "react";

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { JiraHelper } from "../../lib/jira_helper";
import { MapLocation } from "../../lib/Location";


interface EditLocationProps {
    handleClose: MouseEventHandler
    jiraHelper: JiraHelper
    location?: MapLocation
    title: String
}

export const EditLocation: FC<EditLocationProps> = (props:EditLocationProps) => {
    // if (!props.jiraHelper) return <><h4>Missing component configuration</h4></>;
    const locationId = props.location?.id ? props.location?.id : undefined;
    const [nameFieldValue, setNameFieldValue] = useState(props.location?.label ? props.location?.label : "");
    const [urlFieldValue, setUrlFieldValue] = useState(props.location?.url ? props.location?.url : "");
    const [mapsUrlFieldValue, setMapsUrlFieldValue] = useState(props.location?.maps_url ? props.location?.maps_url : "");
    const [statusValue, setStatus] = useState(props.location?.status ? props.location?.status : "");
    const [descriptionValue, setDescription] = useState(props.location?.description ? props.location?.description : "");
    const handleNameChange = (event:any) => {
        setNameFieldValue(event.target.value)
    }
    
    const handleUrlChange = (event:any) => {
        setUrlFieldValue(event.target.value)
    }
    const handleMapsUrlChange = (event:any) => {
        setMapsUrlFieldValue(event.target.value)
    }
    const handleDescriptionChange = (event:any) => {
      setDescription(event.target.value)
  }
    const handleSave: MouseEventHandler = (mouseEvent) => {
        console.log(nameFieldValue)
        const newLocationValues: MapLocation = {
          id: locationId,
          label: nameFieldValue,
          url: urlFieldValue,
          maps_url: mapsUrlFieldValue,
          description: descriptionValue
        }
        if (!locationId) { // No ID ==> new issue
          return props.jiraHelper?.createIssue(nameFieldValue, urlFieldValue ,mapsUrlFieldValue).then(() => {
            props.handleClose(mouseEvent)
          });
        }
        return props.jiraHelper?.updateLocation(newLocationValues).then(() => {
          props.handleClose(mouseEvent)
        });
    }
    useEffect(() => {
    }, [])
    return <>
        <Modal.Header closeButton>
        <Modal.Title>{props.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <Form>
      <Form.Group className="mb-3">
        <Form.Label>Name</Form.Label>
        <Form.Control onChange={handleNameChange} value={nameFieldValue} type="text" placeholder="Enter name" />
        <Form.Text className="text-muted">
          Name of the place.
        </Form.Text>
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>URL</Form.Label>
        <Form.Control onChange={handleUrlChange} value={urlFieldValue} type="text" placeholder="Enter url" />
        <Form.Text className="text-muted">
          Name of the place.
        </Form.Text>
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Google Maps URL</Form.Label>
        <Form.Control onChange={handleMapsUrlChange} value={mapsUrlFieldValue} type="text" placeholder="Enter location url from google maps" />
        <Form.Text className="text-muted">
          Name of the place.
        </Form.Text>
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Description</Form.Label>
        <Form.Control as="textarea" onChange={handleDescriptionChange} rows={3} value={descriptionValue}/>
      </Form.Group>
    </Form>

      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Create
        </Button>
      </Modal.Footer>
      </>
}

export default EditLocation