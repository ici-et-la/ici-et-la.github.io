import { ChangeEventHandler, FC, FormEvent, FormEventHandler, MouseEventHandler, useEffect, useState } from "react";

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { JiraHelper } from "../../lib/jira_helper";
import { MapLocation } from "../../lib/Location";
import { MapInterface } from "./interactiveMap/InteractiveMap";
import { JSONTransformer } from '@atlaskit/editor-json-transformer';
import { Editor } from '@atlaskit/editor-core';
import { EditorView } from 'prosemirror-view';

interface EditLocationProps {
    handleClose: MouseEventHandler
    jiraHelper: JiraHelper
    location?: MapLocation
    title: String,
    map: MapInterface
}

export const EditLocation: FC<EditLocationProps> = (props:EditLocationProps) => {
    // if (!props.jiraHelper) return <><h4>Missing component configuration</h4></>;
    const locationId = props.location?.id ? props.location?.id : undefined;
    const [nameFieldValue, setNameFieldValue] = useState(props.location?.label ? props.location?.label : "");
    const [urlFieldValue, setUrlFieldValue] = useState(props.location?.url ? props.location?.url : "");
    const [mapsUrlFieldValue, setMapsUrlFieldValue] = useState(props.location?.maps_url ? props.location?.maps_url :"");
    const [locationType, setLocationType] = useState(props.location?.issuetype ? props.location?.issuetype : "Ecole");
    
    const [statusValue, setStatus] = useState(props.location?.status ? props.location?.status : "");
    const [descriptionValue, setDescription] = useState(props.location?.description ? props.location?.description : {});
    const [errorMessage, setErrorMessage] = useState("")
    const [descriptionDom, setDescriptionDom] = useState(props.location?.description ? props.location?.description : {});
    const serializer = new JSONTransformer()
    
    if (props.location?.description) {
      console.log(props.location.description)
      // const value = serializer.parse(props.location.description)
      // setDescriptionDom(value)
    }

    const handleNameChange = (event:any) => {
        setNameFieldValue(event.target.value)
    }
    
    const handleUrlChange = (event:any) => {
        setUrlFieldValue(event.target.value)
    }
    const handleMapsUrlChange = (event:any) => {
        setMapsUrlFieldValue(event.target.value)
    }

    const handleDescriptionChange = (editorView: EditorView) => {
      setDescription(serializer.encode(editorView.state.doc))
      // console.log(descriptionValue)
      // setDescription(event.target.value)
    }
    const handleSelectType = (event: any) => {
      setLocationType(event.target.value)
    }
    const handleSave: MouseEventHandler = async (mouseEvent) => {
        console.log(nameFieldValue)
        const newLocationValues: MapLocation = {
          id: locationId,
          label: nameFieldValue,
          url: urlFieldValue,
          maps_url: mapsUrlFieldValue,
          description: descriptionValue
        }
        if (!locationId) { // No ID ==> new issue
          if (window.confirm("This will create a new " + locationType + " " + nameFieldValue))
          props.jiraHelper?.createIssue(nameFieldValue, urlFieldValue, mapsUrlFieldValue, locationType).then((result: any) => {
            console.log(result)
            newLocationValues.id = result.key
            props.jiraHelper.getLocation(result.key).then((result) => {
              const locations = props.map.getLocations();
              locations.push(result)
              props.map.setLocations(locations)
            })
            props.handleClose(mouseEvent);
          }).catch((error) => {setErrorMessage(error)})
        } else {
          props.jiraHelper?.updateLocation(newLocationValues).then(() => {
            props.handleClose(mouseEvent);
          }).catch((error) => {setErrorMessage(error)});
        }
    }
    useEffect(() => {
    }, [])
    return <>
        <Modal.Header closeButton>
        <Modal.Title>{props.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <Form>
      {!locationId
        ? <Form.Group className="mb-3">
            <Form.Label>Type de lieu</Form.Label>
            <Form.Control as="select" aria-label="Type de lieu" onChange={handleSelectType}>
              <option disabled>Choisissez le type de lieu</option>
              <option value="Ecole">Ecole</option>
              <option value="Initiative">Initiative</option>
              <option value="Localisation">Localisation</option>
            </Form.Control>
          </Form.Group>
        : <></> }
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
        <Form.Control onChange={handleMapsUrlChange} type="text" placeholder="Enter location url from google maps" />
        <Form.Text className="text-muted">
          Name of the place.
        </Form.Text>
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Description</Form.Label>
        {/* <Form.Control as="textarea" onChange={handleDescriptionChange} rows={3} value={descriptionValue}/> */}
        <Editor onChange={handleDescriptionChange} defaultValue={props.location?.description} appearance="comment"></Editor>
      </Form.Group>
    </Form>
    <div>{errorMessage}</div>

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