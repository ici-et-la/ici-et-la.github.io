import { ChangeEventHandler, FC, FormEvent, FormEventHandler, MouseEventHandler, useEffect, useState } from "react";

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { MapDataHelper } from "./MapDataHelper";
import { MapLocation } from "./data/MapLocation";
import { JSONTransformer } from '@atlaskit/editor-json-transformer';
import { Editor } from '@atlaskit/editor-core';
import { EditorView } from 'prosemirror-view';
import { LocationReview } from "./data/LocationReview";

interface EditReviewProps {
    handleClose: MouseEventHandler
    dataHelper: MapDataHelper
    review?: LocationReview
    location: MapLocation
    title: string
}

export const ReviewEdit: FC<EditReviewProps> = (props:EditReviewProps) => {
    // if (!props.jiraHelper) return <><h4>Missing component configuration</h4></>;
    const locationId = props.location?.id ? props.location?.id : undefined;
    const reviewId = props.review?.id ? props.review?.id : undefined;
    const [summaryFieldValue, setSummaryFieldValue] = useState(props.review?.summary ? props.review?.summary : "");
    const [descriptionValue, setDescription] = useState(props.location?.description ? props.location?.description : {});
    const [errorMessage, setErrorMessage] = useState("")
    const [descriptionDom, setDescriptionDom] = useState(props.location?.description ? props.location?.description : {});
    const serializer = new JSONTransformer()
    let applyButton = <></>
    if (props.location?.description) {
      console.log(props.location.description)
      // const value = serializer.parse(props.location.description)
      // setDescriptionDom(value)
    }

    const handleSummaryChange = (event:any) => {
        setSummaryFieldValue(event.target.value)
    }
    

    const handleDescriptionChange = (editorView: EditorView) => {
      setDescription(serializer.encode(editorView.state.doc))
      // console.log(descriptionValue)
      // setDescription(event.target.value)
    }

    const handleSave: MouseEventHandler = async (mouseEvent) => {
        if (!reviewId) { // No ID ==> new issue
          if (window.confirm("This will create a new review " + summaryFieldValue)) {
            const newReview: LocationReview = {
                summary: summaryFieldValue,
                description: descriptionValue,
                locationId: locationId
              }
            props.dataHelper?.createReview(newReview).then((result: any) => {
                props.handleClose(mouseEvent);
            }).catch((error) => {setErrorMessage(error)})
          }
        } else {
          const newReviewValues: LocationReview = {
            id: reviewId,
            summary: summaryFieldValue,
            description: descriptionValue,
            locationId: locationId
          }
          props.dataHelper?.updateReview(newReviewValues).then(() => {
            props.handleClose(mouseEvent);
          }).catch((error) => {setErrorMessage(error)});
        }
    }
    useEffect(() => {
    }, [])
    if (!reviewId) { // No ID ==> new issue
      applyButton = <Button variant="primary" onClick={handleSave}>
      Create
    </Button>
    } else {
      applyButton = <Button variant="primary" onClick={handleSave}>
      Save
    </Button>
    }
    return <>
        <Modal.Header closeButton>
        <Modal.Title>{props.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <Form>
      
      <Form.Group className="mb-3">
        <Form.Label>Title</Form.Label>
        <Form.Control onChange={handleSummaryChange} value={summaryFieldValue} type="text" placeholder="Enter name" />
        <Form.Text className="text-muted">
          Title
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
        {applyButton}
      </Modal.Footer>
      </>
}

export default ReviewEdit