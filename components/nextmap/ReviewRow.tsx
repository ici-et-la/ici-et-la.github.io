import { FC, MouseEventHandler, useEffect, useState } from "react"
import { Button, Modal, Table } from "react-bootstrap"
import { MapLocation } from "./data/MapLocation"
import * as Icon from "react-bootstrap-icons"
import { MapDataHelper } from "./MapDataHelper"
import MapModal from "./MapModal"
import ReviewEdit, {  } from "./ReviewEdit"
import { LocationReview } from "./data/LocationReview"
interface ReviewRowProps {
    review: LocationReview
    location: MapLocation
    columns?: Array<String>
    actions?: Array<String>
    dataHelper?: MapDataHelper
    modal: MapModal
}

export const ReviewRow: FC<ReviewRowProps> = (props:ReviewRowProps) => {
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState(<>Empty</>);
  const [review, setReview] = useState<LocationReview>()
  useEffect(function() {
    if (props.review.id){
      props.dataHelper?.getReview(props.review.id).then((foundReview: LocationReview) => {
        setReview(foundReview)
      });
    }
  }, [])
  if (!props.dataHelper) return <h4>Interactive map is loading</h4>;
  const helper: MapDataHelper = props.dataHelper;
  const getHandleShowEdit = (review: LocationReview) => {
    return () => {
      props.modal.setModalContent(<>
        <ReviewEdit title="Edit review" location={props.location} review={review} dataHelper={helper} handleClose={props.modal.handleCloseModal}></ReviewEdit>
      </>)
      props.modal.setShowModal(true);
    }
  }
  const onSelectRowHandler:MouseEventHandler  = (mouseEvent) => {
    props.review.onSelectHandler ? props.review.onSelectHandler() : null; 
  }
  return <tr key={props.review.id} onClick={onSelectRowHandler}>
      <td>{props.review.id}</td>
      <td>{props.review.summary}</td>
      {props.review.creator 
        ? <td>{props.review.creator}</td>
        : <td></td> }
      <td><Button variant="secondary" size="sm" onClick={getHandleShowEdit(props.review)}><Icon.Pencil/></Button></td>
    </tr>
}

export default ReviewRow