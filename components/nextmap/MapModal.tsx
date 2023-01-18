import { MouseEventHandler } from "react"

export interface MapModal {
    setModalContent: Function
    setShowModal: Function
    handleCloseModal: MouseEventHandler
}

export default MapModal