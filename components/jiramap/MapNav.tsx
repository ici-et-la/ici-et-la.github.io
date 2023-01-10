import { FC, useEffect, useState } from "react";
import { Navbar } from "react-bootstrap";
import Container from "react-bootstrap/esm/Container";
import NavLink from "react-bootstrap/esm/NavLink";
import Nav from 'react-bootstrap/Nav';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import EditLocation from "./EditLocation";

export const MapNav: FC = () => {
    const [showmodal, setShowModal] = useState(false);
    

    const handleCloseModal = () => setShowModal(false);


    const [modalContent, setModalContent] = useState(
        <>
        <Modal.Header closeButton>
        <Modal.Title>Modal title</Modal.Title>
      </Modal.Header>
      <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
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

    const handleShowCreate = () => {
        setModalContent(<>
        <EditLocation handleClose={handleCloseModal}></EditLocation>
        </>)
        setShowModal(true);
    }

    return <>
    <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="#home">Carte</Navbar.Brand>
          <Nav className="me-auto">
            <NavLink href="#home" onClick={handleShowCreate}>Create</NavLink>
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