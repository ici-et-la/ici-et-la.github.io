import { ChangeEventHandler, FC, FormEvent, FormEventHandler, MouseEventHandler, useEffect, useState } from "react";

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { JiraHelper } from "../../lib/jira_helper";
import { copyFileSync } from "fs";
import { MapLocation } from "../../lib/Location";

const useSsrLocalStorage = (key: string, initial: string): [string, React.Dispatch<string>] => {
    if (typeof window === 'undefined') {
        return [initial, (value: string) => undefined ]
    } else {
        return require("react-use-localstorage").default(key, initial);
    }
}

interface EditLocationProps {
    handleClose: MouseEventHandler
}

export const EditLocation: FC<EditLocationProps> = (props:EditLocationProps) => {
    
    const [jiraTokenResponse, setJIRATokenResponse] = useSsrLocalStorage("jiraTokenResponse","");
    const [jiraConfigJson, setJiraConfigJson] = useSsrLocalStorage("jiraConfigJson","");
    var helper:JiraHelper;
    const [nameFieldValue, setNameFieldValue] = useState("");
    const [urlFieldValue, setUrlFieldValue] = useState("");
    const [mapsUrlFieldValue, setMapsUrlFieldValue] = useState("");
    
    const handleNameChange = (event:any) => {
        setNameFieldValue(event.target.value)
    }
    
    const handleUrlChange = (event:any) => {
        setUrlFieldValue(event.target.value)
    }
    const handleMapsUrlChange = (event:any) => {
        setMapsUrlFieldValue(event.target.value)
    }

    const handleSave: MouseEventHandler = (mouseEvent) => {
        console.log(nameFieldValue)
        // const location: MapLocation = {
        //     label: nameFieldValue,
        //     url: urlFieldValue,
        // }
        helper.createIssue(nameFieldValue, urlFieldValue ,mapsUrlFieldValue);
        props.handleClose(mouseEvent)
    }
    const jira_token = JSON.parse(jiraTokenResponse);
    const jiraConfig = JSON.parse(jiraConfigJson)
    helper = new JiraHelper(jiraConfig,jira_token)
    useEffect(() => {
    }, [])
    return <>
        <Modal.Header closeButton>
        <Modal.Title>Create location</Modal.Title>
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