import { FC } from "react";
import { Table } from "react-bootstrap";
import { MapDataHelper } from "./MapDataHelper";
import { MapLocation } from "./MapLocation";
import LocationRows from "./LocationRows";
import { MapInterface } from "./MapInterface";
import MapModal from "./MapModal";

interface InteractiveMapSideBarProps {
    dataHelper: MapDataHelper
    locations: Array<MapLocation>
    selectedLocation: MapLocation
    modal: MapModal
}

export const InteractiveMapSideBar: FC<InteractiveMapSideBarProps> = (props: InteractiveMapSideBarProps) => {

    return <>
        <div id="sidebar">
            <div className="sidebar-wrapper">
                <div id="features">
                    <div className="sidebar-table">
                        <Table>
                            <tbody>
                                <LocationRows
                                    modal={props.modal}
                                    dataHelper={props.dataHelper}
                                    locations={props.locations}
                                    selected={props.selectedLocation}
                                    columns={["label"]}
                                    actions={["edit", "locate"]} />
                            </tbody>
                        </Table>
                    </div>
                </div>
            </div>
        </div>
    </>
}