import { FC, useEffect, useState } from "react";
import { Navbar } from "react-bootstrap";
import Container from "react-bootstrap/esm/Container";
import NavLink from "react-bootstrap/esm/NavLink";
import Nav from 'react-bootstrap/Nav';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import EditLocation from "./EditLocation";
import { MapDataHelper } from "./MapDataHelper";
import LocationsListModal from "./LocationsListModal";
import { MapInterface } from "./MapInterface";
import MapModal from "./MapModal";

interface MapNavProps {
  dataHelper?: MapDataHelper
  modal?: MapModal
}
export const MapNav: FC<MapNavProps> = (props: MapNavProps) => {
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
    if (!props.dataHelper) return <>
      <Navbar bg="dark" variant="dark" fixed="top">
        <Container>
            <Navbar.Brand href="#home">Carte</Navbar.Brand>
            <Nav className="me-auto">
            <NavLink href="#Create">Create</NavLink>
            </Nav>
          </Container>
      </Navbar>
      </>
    const helper: MapDataHelper = props.dataHelper;
    let modal: MapModal = {
      setModalContent: setModalContent,
      setShowModal: setShowModal,
      handleCloseModal: handleCloseModal
    }
    if (props.modal) {
      modal = props.modal
    }
    const handleShowCreate = () => {
        modal.setModalContent(<>
        <EditLocation location={undefined} title="Create Location" dataHelper={helper} handleClose={modal.handleCloseModal}></EditLocation>
        </>)
        modal.setShowModal(true);
    }
    const handleShowUnlocated = () => {
      modal.setModalContent(<>
        <LocationsListModal jiraHelper={helper} handleClose={modal.handleCloseModal}></LocationsListModal>
      </>)
      modal.setShowModal(true);
    }

    return <>
    <Navbar bg="dark" variant="dark" fixed="top">
        <Container>
          <Navbar.Brand href="#home">Carte</Navbar.Brand>
          <Nav className="me-auto">
            <NavLink href="#Create" onClick={handleShowCreate}>Create</NavLink>
            <NavLink href="#Unlocated" onClick={handleShowUnlocated}>Show Unlocated</NavLink>
          </Nav>
        </Container>
      </Navbar>

      <Modal show={showmodal} onHide={handleCloseModal}>
        {modalContent}
      </Modal>
    </>
}

export default MapNav