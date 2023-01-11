import { FC, useEffect, useState } from "react";
import { Navbar } from "react-bootstrap";
import Container from "react-bootstrap/esm/Container";
import NavLink from "react-bootstrap/esm/NavLink";
import Nav from 'react-bootstrap/Nav';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import EditLocation from "../EditLocation";
import { JiraHelper } from "../../../lib/jira_helper";
import LocationsListModal from "../LocationsListModal";
interface MapNavProps {
  jiraHelper?: JiraHelper
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
    if (!props.jiraHelper) return <h4>Interactive map is loading</h4>
    const helper: JiraHelper = props.jiraHelper;
    
    const handleShowCreate = () => {
        setModalContent(<>
        <EditLocation title="Create Location" jiraHelper={helper} handleClose={handleCloseModal}></EditLocation>
        </>)
        setShowModal(true);
    }
    const handleShowUnlocated = () => {
      setModalContent(<>
        <LocationsListModal jiraHelper={helper} handleClose={handleCloseModal}></LocationsListModal>
      </>)
      setShowModal(true);
    }

    return <>
    <Navbar bg="dark" variant="dark" fixed="top">
        <Container>
          <Navbar.Brand href="#home">Carte</Navbar.Brand>
          <Nav className="me-auto">
            <NavLink href="#Create" onClick={handleShowCreate}>Create</NavLink>
            <NavLink href="#Unlocated" onClick={handleShowUnlocated}>Show Unlocated</NavLink>
            {/* <NavLink href="#features">Features</NavLink>
            <NavLink href="#pricing">Pricing</NavLink> */}
          </Nav>
        </Container>
      </Navbar>

      <Modal show={showmodal} onHide={handleCloseModal}>
        {modalContent}
      </Modal>
    </>
}

export default MapNav