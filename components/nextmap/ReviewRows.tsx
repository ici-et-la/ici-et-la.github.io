import { FC, MouseEventHandler, useState } from "react"
import { Button, Modal, Table } from "react-bootstrap"
import { MapLocation } from "./data/MapLocation"
import * as Icon from "react-bootstrap-icons"
import { MapDataHelper } from "./MapDataHelper"
import MapModal from "./MapModal"
import ReviewEdit, {  } from "./ReviewEdit"
import { LocationReview } from "./data/LocationReview"
import ReviewRow from "./ReviewRow"
interface ReviewRowsProps {
    //reviews?: Array<LocationReview>
    location: MapLocation
    columns?: Array<String>
    actions?: Array<String>
    dataHelper?: MapDataHelper
    modal?: MapModal
}

export const ReviewRows: FC<ReviewRowsProps> = (props:ReviewRowsProps) => {
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
    if (!props.dataHelper) return <h4>Interactive map is loading</h4>
    const helper: MapDataHelper = props.dataHelper;
    const getHandleShowEdit = (review: LocationReview) => {
        return () => {
          modal.setModalContent(<>
            <ReviewEdit title="Edit review" location={props.location} review={review} dataHelper={helper} handleClose={modal.handleCloseModal}></ReviewEdit>
          </>)
          modal.setShowModal(true);
        }
      }
    return <>
    {props.location.reviews?.length
      ? <Table striped>
            <thead>
                <tr>
                <th>#</th>
                <th>Name</th>
                <th>Author</th>
                <th></th>
                </tr>
            </thead>
            <tbody>

        {props.location.reviews.map((review: LocationReview, index: number) => {
          
          return <ReviewRow key={index} modal={modal} location={props.location} review={review} dataHelper={props.dataHelper}></ReviewRow>
        })
      }
      </tbody>
    </Table>
    : <><p>No reviews</p></> }
    {!props.modal
      ? <Modal show={showModal} onHide={handleCloseModal}>
          {modalContent}
        </Modal>
      : <></>
    }
    </>
}

export default ReviewRows