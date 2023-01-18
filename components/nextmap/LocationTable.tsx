import { FC, useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { MapDataHelper } from "./MapDataHelper";
import { MapLocation } from "./MapLocation";
import { MapInterface } from "./MapInterface";
import LocationRows from "./LocationRows";


interface LocationTableProps {
    locations: Array<MapLocation>
    columns?: Array<String>
    selected?: MapLocation
    jiraHelper: MapDataHelper
}

export const LocationTable: FC<LocationTableProps> = (props: LocationTableProps) => {
    const columns = props.columns ? props.columns : ["id", "label","actions"]
    return <>
        <Table striped>
            <thead>
                <tr>
                {columns.includes("id") ? <th>#</th>: <></>}
                {columns.includes("label") ? <th>Name</th> : <></>}
                {columns.includes("actions") ? <th>Actions</th> : <></>}
                </tr>
            </thead>
            <tbody>
                <LocationRows dataHelper={props.jiraHelper} columns={columns} locations={props.locations}></LocationRows>
            </tbody> 
        </Table>
    </>
}
